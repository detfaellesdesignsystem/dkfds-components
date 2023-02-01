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
var DATE_PICKER_GUIDE_CLASS = "".concat(DATE_PICKER_CLASS, "__guide");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var DIALOG_WRAPPER_CLASS = "dialog-wrapper";
var DATE_PICKER_DIALOG_WRAPPER = ".".concat(DIALOG_WRAPPER_CLASS);
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
var DATE_PICKER_GUIDE = ".".concat(DATE_PICKER_GUIDE_CLASS);
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
  "choose_a_date": "Vælg en dato",
  "choose_a_date_between": "Vælg en dato mellem {minDay}. {minMonthStr} {minYear} og {maxDay}. {maxMonthStr} {maxYear}",
  "choose_a_date_before": "Vælg en dato. Der kan vælges indtil {maxDay}. {maxMonthStr} {maxYear}.",
  "choose_a_date_after": "Vælg en dato. Der kan vælges fra {minDay}. {minMonthStr} {minYear} og fremad.",
  "aria_label_date": "{dayStr} den {day}. {monthStr} {year}",
  "current_month_displayed": "Viser {monthLabel} {focusedYear}",
  "first_possible_date": "Første valgbare dato",
  "last_possible_date": "Sidste valgbare dato",
  "previous_year": "Navigér ét år tilbage",
  "previous_month": "Navigér én måned tilbage",
  "next_month": "Navigér én måned frem",
  "next_year": "Navigér ét år frem",
  "select_month": "Vælg måned",
  "select_year": "Vælg år",
  "previous_years": "Navigér {years} år tilbage",
  "next_years": "Navigér {years} år frem",
  "guide": "Navigerer du med tastatur, kan du skifte dag med højre og venstre piletaster, uger med op og ned piletaster, måneder med page up og page down-tasterne og år med shift-tasten plus page up eller page down. Home og end-tasten navigerer til start eller slutning af en uge.",
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
 * @property {HTMLDivElement} dialogEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} guideEl
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
  var guideEl = datePickerEl.querySelector(DATE_PICKER_GUIDE);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var dialogEl = datePickerEl.querySelector(DATE_PICKER_DIALOG_WRAPPER);
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
    dialogEl: dialogEl,
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
    statusEl: statusEl,
    guideEl: guideEl
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
  var dialogTitle = text.choose_a_date;
  var hasMinDate = minDate !== undefined && minDate !== "";
  var isDefaultMinDate = minDate !== undefined && minDate !== "" && parseDateString(DEFAULT_MIN_DATE).getTime() === minDate.getTime();
  var hasMaxDate = maxDate !== undefined && maxDate !== "";

  if (hasMinDate && !isDefaultMinDate && hasMaxDate) {
    var minDay = minDate.getDate();
    var minMonth = minDate.getMonth();
    var minMonthStr = MONTH_LABELS[minMonth];
    var minYear = minDate.getFullYear();
    var maxDay = maxDate.getDate();
    var maxMonth = maxDate.getMonth();
    var maxMonthStr = MONTH_LABELS[maxMonth];
    var maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_between.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear).replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  } else if (hasMinDate && !isDefaultMinDate && !hasMaxDate) {
    var _minDay = minDate.getDate();

    var _minMonth = minDate.getMonth();

    var _minMonthStr = MONTH_LABELS[_minMonth];

    var _minYear = minDate.getFullYear();

    dialogTitle = text.choose_a_date_after.replace(/{minDay}/, _minDay).replace(/{minMonthStr}/, _minMonthStr).replace(/{minYear}/, _minYear);
  } else if (hasMaxDate) {
    var _maxDay = maxDate.getDate();

    var _maxMonth = maxDate.getMonth();

    var _maxMonthStr = MONTH_LABELS[_maxMonth];

    var _maxYear = maxDate.getFullYear();

    dialogTitle = text.choose_a_date_before.replace(/{maxDay}/, _maxDay).replace(/{maxMonthStr}/, _maxMonthStr).replace(/{maxYear}/, _maxYear);
  }

  var guideID = externalInputEl.getAttribute("id") + "-guide";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"").concat(text.open_calendar, "\">&nbsp;</button>"), "<div class=\"".concat(DIALOG_WRAPPER_CLASS, "\" role=\"dialog\" aria-modal=\"true\" aria-label=\"").concat(dialogTitle, "\" aria-describedby=\"").concat(guideID, "\" hidden><div role=\"application\"><div class=\"").concat(DATE_PICKER_CALENDAR_CLASS, "\" hidden></div></div></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_GUIDE_CLASS, "\" id=\"").concat(guideID, "\" hidden>").concat(text.guide, "</div>")].join(""));
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
      rangeDate = _getDatePickerContext7.rangeDate,
      dialogEl = _getDatePickerContext7.dialogEl,
      guideEl = _getDatePickerContext7.guideEl;

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
    var dayOfWeek = dateToRender.getDay() - 1;

    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }

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
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(ariaLabelDate, "\"\n      aria-current=\"").concat(isSelected ? "date" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
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

  if (dialogEl.hidden === true) {
    dialogEl.hidden = false;

    if (guideEl.hidden) {
      guideEl.hidden = false;
    }
  }

  var statuses = [];

  if (calendarWasHidden) {
    statusEl.textContent = "";
  } else if (_dateToDisplay.getTime() === minDate.getTime()) {
    statuses.push(text.first_possible_date);
  } else if (maxDate !== undefined && maxDate !== "" && _dateToDisplay.getTime() === maxDate.getTime()) {
    statuses.push(text.last_possible_date);
  } else {
    statuses.push(text.current_month_displayed.replace(/{monthLabel}/, monthLabel).replace(/{focusedYear}/, focusedYear));
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
      externalInputEl = _getDatePickerContext13.externalInputEl,
      dialogEl = _getDatePickerContext13.dialogEl,
      guideEl = _getDatePickerContext13.guideEl;

  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
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
      dialogEl = _getDatePickerContext14.dialogEl,
      calendarEl = _getDatePickerContext14.calendarEl,
      inputDate = _getDatePickerContext14.inputDate,
      minDate = _getDatePickerContext14.minDate,
      maxDate = _getDatePickerContext14.maxDate,
      defaultDate = _getDatePickerContext14.defaultDate,
      guideEl = _getDatePickerContext14.guideEl;

  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
    dialogEl.hidden = true;
    guideEl.hidden = true;
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

    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
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

    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
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
      externalInputEl = _getDatePickerContext22.externalInputEl,
      dialogEl = _getDatePickerContext22.dialogEl,
      guideEl = _getDatePickerContext22.guideEl;

  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
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

  if (!this.container.querySelector('.overflow-list li[aria-current="true"]')) {
    this.container.querySelectorAll('.overflow-list li')[0].setAttribute('aria-current', "true");
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
  var selectedItem = this.container.querySelector('.overflow-list li[aria-current="true"]');
  this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};
/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */


DropdownSort.prototype.onOptionClick = function (e) {
  var li = e.target.parentNode;
  li.parentNode.querySelector('li[aria-current="true"]').removeAttribute('aria-current');
  li.setAttribute('aria-current', 'true');
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
/**
 * 
 * @param {HTMLTableElement} table Table Element
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function TableSelectableRows(table) {
  this.table = table;
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
    }

    checkedNumber = checkboxList.length;
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;

      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');
    }
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
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
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
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
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

    if (headerCellEls.length > 0) {
      var bodyRowEls = select('tbody tr', tableEl);
      Array.from(bodyRowEls).forEach(function (rowEl) {
        var cellEls = rowEl.children;

        if (cellEls.length === headerCellEls.length) {
          Array.from(headerCellEls).forEach(function (headerCellEl, i) {
            // Grab header cell text and use it body cell data title.
            if (!cellEls[i].hasAttribute('data-title') && headerCellEl.tagName === "TH" && !headerCellEl.classList.contains("actions-header")) {
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

  if (force || !event.target.hasAttribute('data-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
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


  var jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers');

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


  var jsSelectorTooltip = scope.querySelectorAll('[data-tooltip]');

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWtCLEdBQWxCLEVBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDO0VBQ3ZELElBQUksR0FBRyxDQUFDLE9BQVIsRUFBaUI7SUFDYixHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsT0FBdEI7SUFDQTtFQUNIOztFQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQXhCLEVBQWdDLENBQUMsSUFBRSxDQUFuQyxFQUFzQztJQUNsQyxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsR0FBRyxDQUFDLENBQUQsQ0FBMUIsRUFBK0IsQ0FBL0IsRUFBa0MsR0FBbEM7RUFDSDtBQUNKLENBUkQ7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUVBLElBQUksY0FBYyxNQUFNLENBQUMsSUFBekIsRUFBK0I7RUFFL0I7RUFDQTtFQUNBLElBQUksRUFBRSxlQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBQWpCLEtBQ0EsUUFBUSxDQUFDLGVBQVQsSUFBNEIsRUFBRSxlQUFlLFFBQVEsQ0FBQyxlQUFULENBQXlCLDRCQUF6QixFQUFzRCxHQUF0RCxDQUFqQixDQURoQyxFQUM4RztJQUU3RyxXQUFVLElBQVYsRUFBZ0I7TUFFakI7O01BRUEsSUFBSSxFQUFFLGFBQWEsSUFBZixDQUFKLEVBQTBCOztNQUUxQixJQUNHLGFBQWEsR0FBRyxXQURuQjtNQUFBLElBRUcsU0FBUyxHQUFHLFdBRmY7TUFBQSxJQUdHLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FIbEI7TUFBQSxJQUlHLE1BQU0sR0FBRyxNQUpaO01BQUEsSUFLRyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQUQsQ0FBTixDQUFrQixJQUFsQixJQUEwQixZQUFZO1FBQ2pELE9BQU8sS0FBSyxPQUFMLENBQWEsWUFBYixFQUEyQixFQUEzQixDQUFQO01BQ0EsQ0FQRjtNQUFBLElBUUcsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFELENBQUwsQ0FBaUIsT0FBakIsSUFBNEIsVUFBVSxJQUFWLEVBQWdCO1FBQzFELElBQ0csQ0FBQyxHQUFHLENBRFA7UUFBQSxJQUVHLEdBQUcsR0FBRyxLQUFLLE1BRmQ7O1FBSUEsT0FBTyxDQUFDLEdBQUcsR0FBWCxFQUFnQixDQUFDLEVBQWpCLEVBQXFCO1VBQ3BCLElBQUksQ0FBQyxJQUFJLElBQUwsSUFBYSxLQUFLLENBQUwsTUFBWSxJQUE3QixFQUFtQztZQUNsQyxPQUFPLENBQVA7VUFDQTtRQUNEOztRQUNELE9BQU8sQ0FBQyxDQUFSO01BQ0EsQ0FuQkYsQ0FvQkM7TUFwQkQ7TUFBQSxJQXFCRyxLQUFLLEdBQUcsU0FBUixLQUFRLENBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QjtRQUNsQyxLQUFLLElBQUwsR0FBWSxJQUFaO1FBQ0EsS0FBSyxJQUFMLEdBQVksWUFBWSxDQUFDLElBQUQsQ0FBeEI7UUFDQSxLQUFLLE9BQUwsR0FBZSxPQUFmO01BQ0EsQ0F6QkY7TUFBQSxJQTBCRyxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBVSxTQUFWLEVBQXFCLEtBQXJCLEVBQTRCO1FBQ3JELElBQUksS0FBSyxLQUFLLEVBQWQsRUFBa0I7VUFDakIsTUFBTSxJQUFJLEtBQUosQ0FDSCxZQURHLEVBRUgsNENBRkcsQ0FBTjtRQUlBOztRQUNELElBQUksS0FBSyxJQUFMLENBQVUsS0FBVixDQUFKLEVBQXNCO1VBQ3JCLE1BQU0sSUFBSSxLQUFKLENBQ0gsdUJBREcsRUFFSCxzQ0FGRyxDQUFOO1FBSUE7O1FBQ0QsT0FBTyxVQUFVLENBQUMsSUFBWCxDQUFnQixTQUFoQixFQUEyQixLQUEzQixDQUFQO01BQ0EsQ0F4Q0Y7TUFBQSxJQXlDRyxTQUFTLEdBQUcsU0FBWixTQUFZLENBQVUsSUFBVixFQUFnQjtRQUM3QixJQUNHLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxZQUFMLENBQWtCLE9BQWxCLEtBQThCLEVBQTNDLENBRHBCO1FBQUEsSUFFRyxPQUFPLEdBQUcsY0FBYyxHQUFHLGNBQWMsQ0FBQyxLQUFmLENBQXFCLEtBQXJCLENBQUgsR0FBaUMsRUFGNUQ7UUFBQSxJQUdHLENBQUMsR0FBRyxDQUhQO1FBQUEsSUFJRyxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BSmpCOztRQU1BLE9BQU8sQ0FBQyxHQUFHLEdBQVgsRUFBZ0IsQ0FBQyxFQUFqQixFQUFxQjtVQUNwQixLQUFLLElBQUwsQ0FBVSxPQUFPLENBQUMsQ0FBRCxDQUFqQjtRQUNBOztRQUNELEtBQUssZ0JBQUwsR0FBd0IsWUFBWTtVQUNuQyxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixFQUEyQixLQUFLLFFBQUwsRUFBM0I7UUFDQSxDQUZEO01BR0EsQ0F0REY7TUFBQSxJQXVERyxjQUFjLEdBQUcsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixFQXZEM0M7TUFBQSxJQXdERyxlQUFlLEdBQUcsU0FBbEIsZUFBa0IsR0FBWTtRQUMvQixPQUFPLElBQUksU0FBSixDQUFjLElBQWQsQ0FBUDtNQUNBLENBMURGLENBTmlCLENBa0VqQjtNQUNBOzs7TUFDQSxLQUFLLENBQUMsU0FBRCxDQUFMLEdBQW1CLEtBQUssQ0FBQyxTQUFELENBQXhCOztNQUNBLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLFVBQVUsQ0FBVixFQUFhO1FBQ2xDLE9BQU8sS0FBSyxDQUFMLEtBQVcsSUFBbEI7TUFDQSxDQUZEOztNQUdBLGNBQWMsQ0FBQyxRQUFmLEdBQTBCLFVBQVUsS0FBVixFQUFpQjtRQUMxQyxLQUFLLElBQUksRUFBVDtRQUNBLE9BQU8scUJBQXFCLENBQUMsSUFBRCxFQUFPLEtBQVAsQ0FBckIsS0FBdUMsQ0FBQyxDQUEvQztNQUNBLENBSEQ7O01BSUEsY0FBYyxDQUFDLEdBQWYsR0FBcUIsWUFBWTtRQUNoQyxJQUNHLE1BQU0sR0FBRyxTQURaO1FBQUEsSUFFRyxDQUFDLEdBQUcsQ0FGUDtRQUFBLElBR0csQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUhkO1FBQUEsSUFJRyxLQUpIO1FBQUEsSUFLRyxPQUFPLEdBQUcsS0FMYjs7UUFPQSxHQUFHO1VBQ0YsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxFQUFwQjs7VUFDQSxJQUFJLHFCQUFxQixDQUFDLElBQUQsRUFBTyxLQUFQLENBQXJCLEtBQXVDLENBQUMsQ0FBNUMsRUFBK0M7WUFDOUMsS0FBSyxJQUFMLENBQVUsS0FBVjtZQUNBLE9BQU8sR0FBRyxJQUFWO1VBQ0E7UUFDRCxDQU5ELFFBT08sRUFBRSxDQUFGLEdBQU0sQ0FQYjs7UUFTQSxJQUFJLE9BQUosRUFBYTtVQUNaLEtBQUssZ0JBQUw7UUFDQTtNQUNELENBcEJEOztNQXFCQSxjQUFjLENBQUMsTUFBZixHQUF3QixZQUFZO1FBQ25DLElBQ0csTUFBTSxHQUFHLFNBRFo7UUFBQSxJQUVHLENBQUMsR0FBRyxDQUZQO1FBQUEsSUFHRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BSGQ7UUFBQSxJQUlHLEtBSkg7UUFBQSxJQUtHLE9BQU8sR0FBRyxLQUxiO1FBQUEsSUFNRyxLQU5IOztRQVFBLEdBQUc7VUFDRixLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLEVBQXBCO1VBQ0EsS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUQsRUFBTyxLQUFQLENBQTdCOztVQUNBLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBbEIsRUFBcUI7WUFDcEIsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixDQUFuQjtZQUNBLE9BQU8sR0FBRyxJQUFWO1lBQ0EsS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUQsRUFBTyxLQUFQLENBQTdCO1VBQ0E7UUFDRCxDQVJELFFBU08sRUFBRSxDQUFGLEdBQU0sQ0FUYjs7UUFXQSxJQUFJLE9BQUosRUFBYTtVQUNaLEtBQUssZ0JBQUw7UUFDQTtNQUNELENBdkJEOztNQXdCQSxjQUFjLENBQUMsTUFBZixHQUF3QixVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0I7UUFDL0MsS0FBSyxJQUFJLEVBQVQ7UUFFQSxJQUNHLE1BQU0sR0FBRyxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBRFo7UUFBQSxJQUVHLE1BQU0sR0FBRyxNQUFNLEdBQ2hCLEtBQUssS0FBSyxJQUFWLElBQWtCLFFBREYsR0FHaEIsS0FBSyxLQUFLLEtBQVYsSUFBbUIsS0FMckI7O1FBUUEsSUFBSSxNQUFKLEVBQVk7VUFDWCxLQUFLLE1BQUwsRUFBYSxLQUFiO1FBQ0E7O1FBRUQsSUFBSSxLQUFLLEtBQUssSUFBVixJQUFrQixLQUFLLEtBQUssS0FBaEMsRUFBdUM7VUFDdEMsT0FBTyxLQUFQO1FBQ0EsQ0FGRCxNQUVPO1VBQ04sT0FBTyxDQUFDLE1BQVI7UUFDQTtNQUNELENBcEJEOztNQXFCQSxjQUFjLENBQUMsUUFBZixHQUEwQixZQUFZO1FBQ3JDLE9BQU8sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFQO01BQ0EsQ0FGRDs7TUFJQSxJQUFJLE1BQU0sQ0FBQyxjQUFYLEVBQTJCO1FBQzFCLElBQUksaUJBQWlCLEdBQUc7VUFDckIsR0FBRyxFQUFFLGVBRGdCO1VBRXJCLFVBQVUsRUFBRSxJQUZTO1VBR3JCLFlBQVksRUFBRTtRQUhPLENBQXhCOztRQUtBLElBQUk7VUFDSCxNQUFNLENBQUMsY0FBUCxDQUFzQixZQUF0QixFQUFvQyxhQUFwQyxFQUFtRCxpQkFBbkQ7UUFDQSxDQUZELENBRUUsT0FBTyxFQUFQLEVBQVc7VUFBRTtVQUNkO1VBQ0E7VUFDQSxJQUFJLEVBQUUsQ0FBQyxNQUFILEtBQWMsU0FBZCxJQUEyQixFQUFFLENBQUMsTUFBSCxLQUFjLENBQUMsVUFBOUMsRUFBMEQ7WUFDekQsaUJBQWlCLENBQUMsVUFBbEIsR0FBK0IsS0FBL0I7WUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixZQUF0QixFQUFvQyxhQUFwQyxFQUFtRCxpQkFBbkQ7VUFDQTtRQUNEO01BQ0QsQ0FoQkQsTUFnQk8sSUFBSSxNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLGdCQUF0QixFQUF3QztRQUM5QyxZQUFZLENBQUMsZ0JBQWIsQ0FBOEIsYUFBOUIsRUFBNkMsZUFBN0M7TUFDQTtJQUVBLENBdEtBLEVBc0tDLE1BQU0sQ0FBQyxJQXRLUixDQUFEO0VBd0tDLENBL0s4QixDQWlML0I7RUFDQTs7O0VBRUMsYUFBWTtJQUNaOztJQUVBLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBQWxCO0lBRUEsV0FBVyxDQUFDLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFMWSxDQU9aO0lBQ0E7O0lBQ0EsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFaLENBQXNCLFFBQXRCLENBQStCLElBQS9CLENBQUwsRUFBMkM7TUFDMUMsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFlLENBQVMsTUFBVCxFQUFpQjtRQUNuQyxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixDQUFmOztRQUVBLFlBQVksQ0FBQyxTQUFiLENBQXVCLE1BQXZCLElBQWlDLFVBQVMsS0FBVCxFQUFnQjtVQUNoRCxJQUFJLENBQUo7VUFBQSxJQUFPLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBdkI7O1VBRUEsS0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxHQUFoQixFQUFxQixDQUFDLEVBQXRCLEVBQTBCO1lBQ3pCLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBRCxDQUFqQjtZQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxFQUFvQixLQUFwQjtVQUNBO1FBQ0QsQ0FQRDtNQVFBLENBWEQ7O01BWUEsWUFBWSxDQUFDLEtBQUQsQ0FBWjtNQUNBLFlBQVksQ0FBQyxRQUFELENBQVo7SUFDQTs7SUFFRCxXQUFXLENBQUMsU0FBWixDQUFzQixNQUF0QixDQUE2QixJQUE3QixFQUFtQyxLQUFuQyxFQTFCWSxDQTRCWjtJQUNBOztJQUNBLElBQUksV0FBVyxDQUFDLFNBQVosQ0FBc0IsUUFBdEIsQ0FBK0IsSUFBL0IsQ0FBSixFQUEwQztNQUN6QyxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsU0FBYixDQUF1QixNQUFyQzs7TUFFQSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixHQUFnQyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7UUFDdEQsSUFBSSxLQUFLLFNBQUwsSUFBa0IsQ0FBQyxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQUQsS0FBMEIsQ0FBQyxLQUFqRCxFQUF3RDtVQUN2RCxPQUFPLEtBQVA7UUFDQSxDQUZELE1BRU87VUFDTixPQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYixFQUFtQixLQUFuQixDQUFQO1FBQ0E7TUFDRCxDQU5EO0lBUUE7O0lBRUQsV0FBVyxHQUFHLElBQWQ7RUFDQSxDQTVDQSxHQUFEO0FBOENDOzs7OztBQy9PRCxPQUFPLENBQUMsbUNBQUQsQ0FBUDs7QUFDQSxPQUFPLENBQUMsOEJBQUQsQ0FBUDs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMscUJBQUQsQ0FBUCxDQUErQixLQUEvQixDQUFxQyxJQUF0RDs7Ozs7QUNGQSxPQUFPLENBQUMsaUNBQUQsQ0FBUDs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMscUJBQUQsQ0FBUCxDQUErQixNQUEvQixDQUFzQyxNQUF2RDs7Ozs7QUNEQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztFQUM3QixJQUFJLE9BQU8sRUFBUCxJQUFhLFVBQWpCLEVBQTZCLE1BQU0sU0FBUyxDQUFDLEVBQUUsR0FBRyxxQkFBTixDQUFmO0VBQzdCLE9BQU8sRUFBUDtBQUNELENBSEQ7Ozs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7RUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFELENBQWIsRUFBbUIsTUFBTSxTQUFTLENBQUMsRUFBRSxHQUFHLG9CQUFOLENBQWY7RUFDbkIsT0FBTyxFQUFQO0FBQ0QsQ0FIRDs7Ozs7QUNEQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLHNCQUFELENBQTdCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsV0FBVixFQUF1QjtFQUN0QyxPQUFPLFVBQVUsS0FBVixFQUFpQixFQUFqQixFQUFxQixTQUFyQixFQUFnQztJQUNyQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBRCxDQUFqQjtJQUNBLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBSCxDQUFyQjtJQUNBLElBQUksS0FBSyxHQUFHLGVBQWUsQ0FBQyxTQUFELEVBQVksTUFBWixDQUEzQjtJQUNBLElBQUksS0FBSixDQUpxQyxDQUtyQztJQUNBOztJQUNBLElBQUksV0FBVyxJQUFJLEVBQUUsSUFBSSxFQUF6QixFQUE2QixPQUFPLE1BQU0sR0FBRyxLQUFoQixFQUF1QjtNQUNsRCxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBTixDQUFULENBRGtELENBRWxEOztNQUNBLElBQUksS0FBSyxJQUFJLEtBQWIsRUFBb0IsT0FBTyxJQUFQLENBSDhCLENBSXBEO0lBQ0MsQ0FMRCxNQUtPLE9BQU0sTUFBTSxHQUFHLEtBQWYsRUFBc0IsS0FBSyxFQUEzQjtNQUErQixJQUFJLFdBQVcsSUFBSSxLQUFLLElBQUksQ0FBNUIsRUFBK0I7UUFDbkUsSUFBSSxDQUFDLENBQUMsS0FBRCxDQUFELEtBQWEsRUFBakIsRUFBcUIsT0FBTyxXQUFXLElBQUksS0FBZixJQUF3QixDQUEvQjtNQUN0QjtJQUZNO0lBRUwsT0FBTyxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxDQUF4QjtFQUNILENBZkQ7QUFnQkQsQ0FqQkQ7Ozs7O0FDTEE7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFqQjs7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLGFBQWxCLENBQVYsQyxDQUNBOzs7QUFDQSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWTtFQUFFLE9BQU8sU0FBUDtBQUFtQixDQUFqQyxFQUFELENBQUgsSUFBNEMsV0FBdEQsQyxDQUVBOztBQUNBLElBQUksTUFBTSxHQUFHLFNBQVQsTUFBUyxDQUFVLEVBQVYsRUFBYyxHQUFkLEVBQW1CO0VBQzlCLElBQUk7SUFDRixPQUFPLEVBQUUsQ0FBQyxHQUFELENBQVQ7RUFDRCxDQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7SUFBRTtFQUFhO0FBQzVCLENBSkQ7O0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7RUFDN0IsSUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7RUFDQSxPQUFPLEVBQUUsS0FBSyxTQUFQLEdBQW1CLFdBQW5CLEdBQWlDLEVBQUUsS0FBSyxJQUFQLEdBQWMsTUFBZCxDQUN0QztFQURzQyxFQUVwQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFELENBQVgsRUFBaUIsR0FBakIsQ0FBbEIsS0FBNEMsUUFBNUMsR0FBdUQsQ0FBdkQsQ0FDRjtFQURFLEVBRUEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQU4sQ0FDTDtFQURLLEVBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUQsQ0FBUixLQUFnQixRQUFoQixJQUE0QixPQUFPLENBQUMsQ0FBQyxNQUFULElBQW1CLFVBQS9DLEdBQTRELFdBQTVELEdBQTBFLENBTjlFO0FBT0QsQ0FURDs7Ozs7QUNiQSxJQUFJLFFBQVEsR0FBRyxHQUFHLFFBQWxCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0VBQzdCLE9BQU8sUUFBUSxDQUFDLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEtBQWxCLENBQXdCLENBQXhCLEVBQTJCLENBQUMsQ0FBNUIsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDRkEsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFBRSxPQUFPLEVBQUU7QUFBWCxDQUE1QjtBQUNBLElBQUksT0FBTyxHQUFQLElBQWMsUUFBbEIsRUFBNEIsR0FBRyxHQUFHLElBQU4sQyxDQUFZOzs7QUNEeEM7O0FBQ0EsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBN0I7O0FBQ0EsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXhCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQztFQUMvQyxJQUFJLEtBQUssSUFBSSxNQUFiLEVBQXFCLGVBQWUsQ0FBQyxDQUFoQixDQUFrQixNQUFsQixFQUEwQixLQUExQixFQUFpQyxVQUFVLENBQUMsQ0FBRCxFQUFJLEtBQUosQ0FBM0MsRUFBckIsS0FDSyxNQUFNLENBQUMsS0FBRCxDQUFOLEdBQWdCLEtBQWhCO0FBQ04sQ0FIRDs7Ozs7QUNKQTtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLElBQWQsRUFBb0IsTUFBcEIsRUFBNEI7RUFDM0MsU0FBUyxDQUFDLEVBQUQsQ0FBVDtFQUNBLElBQUksSUFBSSxLQUFLLFNBQWIsRUFBd0IsT0FBTyxFQUFQOztFQUN4QixRQUFRLE1BQVI7SUFDRSxLQUFLLENBQUw7TUFBUSxPQUFPLFVBQVUsQ0FBVixFQUFhO1FBQzFCLE9BQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxDQUFQO01BQ0QsQ0FGTzs7SUFHUixLQUFLLENBQUw7TUFBUSxPQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7UUFDN0IsT0FBTyxFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQVA7TUFDRCxDQUZPOztJQUdSLEtBQUssQ0FBTDtNQUFRLE9BQU8sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQjtRQUNoQyxPQUFPLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBUDtNQUNELENBRk87RUFQVjs7RUFXQSxPQUFPO0lBQVU7RUFBVixHQUF5QjtJQUM5QixPQUFPLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBVCxFQUFlLFNBQWYsQ0FBUDtFQUNELENBRkQ7QUFHRCxDQWpCRDs7Ozs7QUNGQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0VBQzdCLElBQUksRUFBRSxJQUFJLFNBQVYsRUFBcUIsTUFBTSxTQUFTLENBQUMsMkJBQTJCLEVBQTVCLENBQWY7RUFDckIsT0FBTyxFQUFQO0FBQ0QsQ0FIRDs7Ozs7QUNEQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQixZQUFZO0VBQ2hELE9BQU8sTUFBTSxDQUFDLGNBQVAsQ0FBc0IsRUFBdEIsRUFBMEIsR0FBMUIsRUFBK0I7SUFBRSxHQUFHLEVBQUUsZUFBWTtNQUFFLE9BQU8sQ0FBUDtJQUFXO0VBQWhDLENBQS9CLEVBQW1FLENBQW5FLElBQXdFLENBQS9FO0FBQ0QsQ0FGaUIsQ0FBbEI7Ozs7O0FDREEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQixRQUFwQyxDLENBQ0E7OztBQUNBLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxRQUFELENBQVIsSUFBc0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFWLENBQXZDOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0VBQzdCLE9BQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEVBQXZCLENBQUgsR0FBZ0MsRUFBekM7QUFDRCxDQUZEOzs7OztBQ0pBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRSwrRkFEZSxDQUVmLEtBRmUsQ0FFVCxHQUZTLENBQWpCOzs7OztBQ0RBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQXBCOztBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQWxCOztBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQWxCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFELENBQXRCOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksU0FBUyxHQUFHLFdBQWhCOztBQUVBLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsTUFBdEIsRUFBOEI7RUFDMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUEvQjtFQUNBLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBL0I7RUFDQSxJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQS9CO0VBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUE5QjtFQUNBLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBN0I7RUFDQSxJQUFJLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBSCxHQUFZLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBRCxDQUFOLEtBQWlCLE1BQU0sQ0FBQyxJQUFELENBQU4sR0FBZSxFQUFoQyxDQUFILEdBQXlDLENBQUMsTUFBTSxDQUFDLElBQUQsQ0FBTixJQUFnQixFQUFqQixFQUFxQixTQUFyQixDQUFwRjtFQUNBLElBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxJQUFILEdBQVUsSUFBSSxDQUFDLElBQUQsQ0FBSixLQUFlLElBQUksQ0FBQyxJQUFELENBQUosR0FBYSxFQUE1QixDQUFqQztFQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQVAsS0FBdUIsT0FBTyxDQUFDLFNBQUQsQ0FBUCxHQUFxQixFQUE1QyxDQUFmO0VBQ0EsSUFBSSxHQUFKLEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkI7RUFDQSxJQUFJLFNBQUosRUFBZSxNQUFNLEdBQUcsSUFBVDs7RUFDZixLQUFLLEdBQUwsSUFBWSxNQUFaLEVBQW9CO0lBQ2xCO0lBQ0EsR0FBRyxHQUFHLENBQUMsU0FBRCxJQUFjLE1BQWQsSUFBd0IsTUFBTSxDQUFDLEdBQUQsQ0FBTixLQUFnQixTQUE5QyxDQUZrQixDQUdsQjs7SUFDQSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBSCxHQUFZLE1BQWhCLEVBQXdCLEdBQXhCLENBQU4sQ0FKa0IsQ0FLbEI7O0lBQ0EsR0FBRyxHQUFHLE9BQU8sSUFBSSxHQUFYLEdBQWlCLEdBQUcsQ0FBQyxHQUFELEVBQU0sTUFBTixDQUFwQixHQUFvQyxRQUFRLElBQUksT0FBTyxHQUFQLElBQWMsVUFBMUIsR0FBdUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFWLEVBQWdCLEdBQWhCLENBQTFDLEdBQWlFLEdBQTNHLENBTmtCLENBT2xCOztJQUNBLElBQUksTUFBSixFQUFZLFFBQVEsQ0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFsQyxDQUFSLENBUk0sQ0FTbEI7O0lBQ0EsSUFBSSxPQUFPLENBQUMsR0FBRCxDQUFQLElBQWdCLEdBQXBCLEVBQXlCLElBQUksQ0FBQyxPQUFELEVBQVUsR0FBVixFQUFlLEdBQWYsQ0FBSjtJQUN6QixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRCxDQUFSLElBQWlCLEdBQWpDLEVBQXNDLFFBQVEsQ0FBQyxHQUFELENBQVIsR0FBZ0IsR0FBaEI7RUFDdkM7QUFDRixDQXhCRDs7QUF5QkEsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFkLEMsQ0FDQTs7QUFDQSxPQUFPLENBQUMsQ0FBUixHQUFZLENBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxDQUFaLEMsQ0FBaUI7O0FBQ2pCLE9BQU8sQ0FBQyxDQUFSLEdBQVksQ0FBWixDLENBQWlCOztBQUNqQixPQUFPLENBQUMsQ0FBUixHQUFZLENBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxFQUFaLEMsQ0FBaUI7O0FBQ2pCLE9BQU8sQ0FBQyxDQUFSLEdBQVksRUFBWixDLENBQWlCOztBQUNqQixPQUFPLENBQUMsQ0FBUixHQUFZLEVBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxHQUFaLEMsQ0FBaUI7O0FBQ2pCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQWpCOzs7OztBQzFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0I7RUFDL0IsSUFBSTtJQUNGLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBYjtFQUNELENBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtJQUNWLE9BQU8sSUFBUDtFQUNEO0FBQ0YsQ0FORDs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCLDJCQUFyQixFQUFrRCxRQUFRLENBQUMsUUFBM0QsQ0FBakI7Ozs7O0FDQUE7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLE1BQVAsSUFBaUIsV0FBakIsSUFBZ0MsTUFBTSxDQUFDLElBQVAsSUFBZSxJQUEvQyxHQUMxQixNQUQwQixHQUNqQixPQUFPLElBQVAsSUFBZSxXQUFmLElBQThCLElBQUksQ0FBQyxJQUFMLElBQWEsSUFBM0MsR0FBa0QsSUFBbEQsQ0FDWDtBQURXLEVBRVQsUUFBUSxDQUFDLGFBQUQsQ0FBUixFQUhKO0FBSUEsSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QixHQUFHLEdBQUcsTUFBTixDLENBQWM7Ozs7O0FDTDFDLElBQUksY0FBYyxHQUFHLEdBQUcsY0FBeEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQjtFQUNsQyxPQUFPLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEVBQXBCLEVBQXdCLEdBQXhCLENBQVA7QUFDRCxDQUZEOzs7OztBQ0RBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQWhCOztBQUNBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF4Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsZ0JBQUQsQ0FBUCxHQUE0QixVQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUIsS0FBdkIsRUFBOEI7RUFDekUsT0FBTyxFQUFFLENBQUMsQ0FBSCxDQUFLLE1BQUwsRUFBYSxHQUFiLEVBQWtCLFVBQVUsQ0FBQyxDQUFELEVBQUksS0FBSixDQUE1QixDQUFQO0FBQ0QsQ0FGZ0IsR0FFYixVQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUIsS0FBdkIsRUFBOEI7RUFDaEMsTUFBTSxDQUFDLEdBQUQsQ0FBTixHQUFjLEtBQWQ7RUFDQSxPQUFPLE1BQVA7QUFDRCxDQUxEOzs7OztBQ0ZBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQVAsQ0FBcUIsUUFBcEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxJQUFJLFFBQVEsQ0FBQyxlQUF0Qzs7Ozs7QUNEQSxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFDLE9BQU8sQ0FBQyxnQkFBRCxDQUFSLElBQThCLENBQUMsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQixZQUFZO0VBQzlFLE9BQU8sTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixLQUF6QixDQUF0QixFQUF1RCxHQUF2RCxFQUE0RDtJQUFFLEdBQUcsRUFBRSxlQUFZO01BQUUsT0FBTyxDQUFQO0lBQVc7RUFBaEMsQ0FBNUQsRUFBZ0csQ0FBaEcsSUFBcUcsQ0FBNUc7QUFDRCxDQUYrQyxDQUFoRDs7Ozs7QUNBQTtBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCLEMsQ0FDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLEdBQUQsQ0FBTixDQUFZLG9CQUFaLENBQWlDLENBQWpDLElBQXNDLE1BQXRDLEdBQStDLFVBQVUsRUFBVixFQUFjO0VBQzVFLE9BQU8sR0FBRyxDQUFDLEVBQUQsQ0FBSCxJQUFXLFFBQVgsR0FBc0IsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFULENBQXRCLEdBQXFDLE1BQU0sQ0FBQyxFQUFELENBQWxEO0FBQ0QsQ0FGRDs7Ozs7QUNIQTtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXZCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0IsVUFBbEIsQ0FBZjs7QUFDQSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBdkI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7RUFDN0IsT0FBTyxFQUFFLEtBQUssU0FBUCxLQUFxQixTQUFTLENBQUMsS0FBVixLQUFvQixFQUFwQixJQUEwQixVQUFVLENBQUMsUUFBRCxDQUFWLEtBQXlCLEVBQXhFLENBQVA7QUFDRCxDQUZEOzs7Ozs7O0FDTEEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7RUFDN0IsT0FBTyxRQUFPLEVBQVAsTUFBYyxRQUFkLEdBQXlCLEVBQUUsS0FBSyxJQUFoQyxHQUF1QyxPQUFPLEVBQVAsS0FBYyxVQUE1RDtBQUNELENBRkQ7Ozs7O0FDQUE7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF0Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLFFBQVYsRUFBb0IsRUFBcEIsRUFBd0IsS0FBeEIsRUFBK0IsT0FBL0IsRUFBd0M7RUFDdkQsSUFBSTtJQUNGLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBRCxDQUFSLENBQWdCLENBQWhCLENBQUQsRUFBcUIsS0FBSyxDQUFDLENBQUQsQ0FBMUIsQ0FBTCxHQUFzQyxFQUFFLENBQUMsS0FBRCxDQUF0RCxDQURFLENBRUo7RUFDQyxDQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7SUFDVixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBRCxDQUFsQjtJQUNBLElBQUksR0FBRyxLQUFLLFNBQVosRUFBdUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFKLENBQVMsUUFBVCxDQUFELENBQVI7SUFDdkIsTUFBTSxDQUFOO0VBQ0Q7QUFDRixDQVREOzs7QUNGQTs7QUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBcEI7O0FBQ0EsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXhCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxzQkFBRCxDQUE1Qjs7QUFDQSxJQUFJLGlCQUFpQixHQUFHLEVBQXhCLEMsQ0FFQTs7QUFDQSxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CLGlCQUFuQixFQUFzQyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQXRDLEVBQXFFLFlBQVk7RUFBRSxPQUFPLElBQVA7QUFBYyxDQUFqRzs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLFdBQVYsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUM7RUFDbEQsV0FBVyxDQUFDLFNBQVosR0FBd0IsTUFBTSxDQUFDLGlCQUFELEVBQW9CO0lBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFELEVBQUksSUFBSjtFQUFsQixDQUFwQixDQUE5QjtFQUNBLGNBQWMsQ0FBQyxXQUFELEVBQWMsSUFBSSxHQUFHLFdBQXJCLENBQWQ7QUFDRCxDQUhEOzs7QUNUQTs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBRCxDQUF0Qjs7QUFDQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFsQjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF2Qjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBekI7O0FBQ0EsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHNCQUFELENBQTVCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQTVCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0IsVUFBbEIsQ0FBZjs7QUFDQSxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUcsSUFBSCxJQUFXLFVBQVUsR0FBRyxJQUFILEVBQXZCLENBQVosQyxDQUErQzs7QUFDL0MsSUFBSSxXQUFXLEdBQUcsWUFBbEI7QUFDQSxJQUFJLElBQUksR0FBRyxNQUFYO0FBQ0EsSUFBSSxNQUFNLEdBQUcsUUFBYjs7QUFFQSxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQWEsR0FBWTtFQUFFLE9BQU8sSUFBUDtBQUFjLENBQTdDOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixXQUF0QixFQUFtQyxJQUFuQyxFQUF5QyxPQUF6QyxFQUFrRCxNQUFsRCxFQUEwRCxNQUExRCxFQUFrRTtFQUNqRixXQUFXLENBQUMsV0FBRCxFQUFjLElBQWQsRUFBb0IsSUFBcEIsQ0FBWDs7RUFDQSxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxJQUFWLEVBQWdCO0lBQzlCLElBQUksQ0FBQyxLQUFELElBQVUsSUFBSSxJQUFJLEtBQXRCLEVBQTZCLE9BQU8sS0FBSyxDQUFDLElBQUQsQ0FBWjs7SUFDN0IsUUFBUSxJQUFSO01BQ0UsS0FBSyxJQUFMO1FBQVcsT0FBTyxTQUFTLElBQVQsR0FBZ0I7VUFBRSxPQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUFQO1FBQXFDLENBQTlEOztNQUNYLEtBQUssTUFBTDtRQUFhLE9BQU8sU0FBUyxNQUFULEdBQWtCO1VBQUUsT0FBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUDtRQUFxQyxDQUFoRTtJQUZmOztJQUdFLE9BQU8sU0FBUyxPQUFULEdBQW1CO01BQUUsT0FBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUDtJQUFxQyxDQUFqRTtFQUNILENBTkQ7O0VBT0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFdBQWpCO0VBQ0EsSUFBSSxVQUFVLEdBQUcsT0FBTyxJQUFJLE1BQTVCO0VBQ0EsSUFBSSxVQUFVLEdBQUcsS0FBakI7RUFDQSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBakI7RUFDQSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBRCxDQUFMLElBQW1CLEtBQUssQ0FBQyxXQUFELENBQXhCLElBQXlDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBRCxDQUF2RTtFQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBRCxDQUFuQztFQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sR0FBRyxDQUFDLFVBQUQsR0FBYyxRQUFkLEdBQXlCLFNBQVMsQ0FBQyxTQUFELENBQXJDLEdBQW1ELFNBQXpFO0VBQ0EsSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLE9BQVIsR0FBa0IsS0FBSyxDQUFDLE9BQU4sSUFBaUIsT0FBbkMsR0FBNkMsT0FBOUQ7RUFDQSxJQUFJLE9BQUosRUFBYSxHQUFiLEVBQWtCLGlCQUFsQixDQWpCaUYsQ0FrQmpGOztFQUNBLElBQUksVUFBSixFQUFnQjtJQUNkLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFJLElBQUosRUFBaEIsQ0FBRCxDQUFsQzs7SUFDQSxJQUFJLGlCQUFpQixLQUFLLE1BQU0sQ0FBQyxTQUE3QixJQUEwQyxpQkFBaUIsQ0FBQyxJQUFoRSxFQUFzRTtNQUNwRTtNQUNBLGNBQWMsQ0FBQyxpQkFBRCxFQUFvQixHQUFwQixFQUF5QixJQUF6QixDQUFkLENBRm9FLENBR3BFOztNQUNBLElBQUksQ0FBQyxPQUFELElBQVksT0FBTyxpQkFBaUIsQ0FBQyxRQUFELENBQXhCLElBQXNDLFVBQXRELEVBQWtFLElBQUksQ0FBQyxpQkFBRCxFQUFvQixRQUFwQixFQUE4QixVQUE5QixDQUFKO0lBQ25FO0VBQ0YsQ0EzQmdGLENBNEJqRjs7O0VBQ0EsSUFBSSxVQUFVLElBQUksT0FBZCxJQUF5QixPQUFPLENBQUMsSUFBUixLQUFpQixNQUE5QyxFQUFzRDtJQUNwRCxVQUFVLEdBQUcsSUFBYjs7SUFDQSxRQUFRLEdBQUcsU0FBUyxNQUFULEdBQWtCO01BQUUsT0FBTyxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBUDtJQUE0QixDQUEzRDtFQUNELENBaENnRixDQWlDakY7OztFQUNBLElBQUksQ0FBQyxDQUFDLE9BQUQsSUFBWSxNQUFiLE1BQXlCLEtBQUssSUFBSSxVQUFULElBQXVCLENBQUMsS0FBSyxDQUFDLFFBQUQsQ0FBdEQsQ0FBSixFQUF1RTtJQUNyRSxJQUFJLENBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsUUFBbEIsQ0FBSjtFQUNELENBcENnRixDQXFDakY7OztFQUNBLFNBQVMsQ0FBQyxJQUFELENBQVQsR0FBa0IsUUFBbEI7RUFDQSxTQUFTLENBQUMsR0FBRCxDQUFULEdBQWlCLFVBQWpCOztFQUNBLElBQUksT0FBSixFQUFhO0lBQ1gsT0FBTyxHQUFHO01BQ1IsTUFBTSxFQUFFLFVBQVUsR0FBRyxRQUFILEdBQWMsU0FBUyxDQUFDLE1BQUQsQ0FEakM7TUFFUixJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQUgsR0FBYyxTQUFTLENBQUMsSUFBRCxDQUYzQjtNQUdSLE9BQU8sRUFBRTtJQUhELENBQVY7SUFLQSxJQUFJLE1BQUosRUFBWSxLQUFLLEdBQUwsSUFBWSxPQUFaLEVBQXFCO01BQy9CLElBQUksRUFBRSxHQUFHLElBQUksS0FBVCxDQUFKLEVBQXFCLFFBQVEsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFhLE9BQU8sQ0FBQyxHQUFELENBQXBCLENBQVI7SUFDdEIsQ0FGRCxNQUVPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBUixHQUFZLE9BQU8sQ0FBQyxDQUFSLElBQWEsS0FBSyxJQUFJLFVBQXRCLENBQWIsRUFBZ0QsSUFBaEQsRUFBc0QsT0FBdEQsQ0FBUDtFQUNSOztFQUNELE9BQU8sT0FBUDtBQUNELENBbkREOzs7OztBQ2pCQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQWY7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsS0FBbkI7O0FBRUEsSUFBSTtFQUNGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBRCxFQUFJLFFBQUosR0FBWjs7RUFDQSxLQUFLLENBQUMsUUFBRCxDQUFMLEdBQWtCLFlBQVk7SUFBRSxZQUFZLEdBQUcsSUFBZjtFQUFzQixDQUF0RCxDQUZFLENBR0Y7OztFQUNBLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxFQUFrQixZQUFZO0lBQUUsTUFBTSxDQUFOO0VBQVUsQ0FBMUM7QUFDRCxDQUxELENBS0UsT0FBTyxDQUFQLEVBQVU7RUFBRTtBQUFhOztBQUUzQixNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0IsV0FBaEIsRUFBNkI7RUFDNUMsSUFBSSxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxZQUFyQixFQUFtQyxPQUFPLEtBQVA7RUFDbkMsSUFBSSxJQUFJLEdBQUcsS0FBWDs7RUFDQSxJQUFJO0lBQ0YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQVY7SUFDQSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsUUFBRCxDQUFILEVBQVg7O0lBQ0EsSUFBSSxDQUFDLElBQUwsR0FBWSxZQUFZO01BQUUsT0FBTztRQUFFLElBQUksRUFBRSxJQUFJLEdBQUc7TUFBZixDQUFQO0lBQStCLENBQXpEOztJQUNBLEdBQUcsQ0FBQyxRQUFELENBQUgsR0FBZ0IsWUFBWTtNQUFFLE9BQU8sSUFBUDtJQUFjLENBQTVDOztJQUNBLElBQUksQ0FBQyxHQUFELENBQUo7RUFDRCxDQU5ELENBTUUsT0FBTyxDQUFQLEVBQVU7SUFBRTtFQUFhOztFQUMzQixPQUFPLElBQVA7QUFDRCxDQVhEOzs7OztBQ1ZBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBQWpCOzs7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQWpCOzs7QUNBQSxhLENBQ0E7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQXpCOztBQUNBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFyQjs7QUFDQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBbEI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBakI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQXJCLEMsQ0FFQTs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFDLE9BQUQsSUFBWSxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CLFlBQVk7RUFDM0QsSUFBSSxDQUFDLEdBQUcsRUFBUjtFQUNBLElBQUksQ0FBQyxHQUFHLEVBQVIsQ0FGMkQsQ0FHM0Q7O0VBQ0EsSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFkO0VBQ0EsSUFBSSxDQUFDLEdBQUcsc0JBQVI7RUFDQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBUDtFQUNBLENBQUMsQ0FBQyxLQUFGLENBQVEsRUFBUixFQUFZLE9BQVosQ0FBb0IsVUFBVSxDQUFWLEVBQWE7SUFBRSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBUDtFQUFXLENBQTlDO0VBQ0EsT0FBTyxPQUFPLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBUCxDQUFlLENBQWYsS0FBcUIsQ0FBckIsSUFBMEIsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFPLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBbkIsRUFBNEIsSUFBNUIsQ0FBaUMsRUFBakMsS0FBd0MsQ0FBekU7QUFDRCxDQVQ0QixDQUFaLEdBU1osU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLEVBQWdDO0VBQUU7RUFDckMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQUQsQ0FBaEI7RUFDQSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBckI7RUFDQSxJQUFJLEtBQUssR0FBRyxDQUFaO0VBQ0EsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQXRCO0VBQ0EsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQWpCOztFQUNBLE9BQU8sSUFBSSxHQUFHLEtBQWQsRUFBcUI7SUFDbkIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQU4sQ0FBVixDQUFmO0lBQ0EsSUFBSSxJQUFJLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFELENBQVAsQ0FBVyxNQUFYLENBQWtCLFVBQVUsQ0FBQyxDQUFELENBQTVCLENBQUgsR0FBc0MsT0FBTyxDQUFDLENBQUQsQ0FBbEU7SUFDQSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBbEI7SUFDQSxJQUFJLENBQUMsR0FBRyxDQUFSO0lBQ0EsSUFBSSxHQUFKOztJQUNBLE9BQU8sTUFBTSxHQUFHLENBQWhCLEVBQW1CO01BQ2pCLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFGLENBQVY7TUFDQSxJQUFJLENBQUMsV0FBRCxJQUFnQixNQUFNLENBQUMsSUFBUCxDQUFZLENBQVosRUFBZSxHQUFmLENBQXBCLEVBQXlDLENBQUMsQ0FBQyxHQUFELENBQUQsR0FBUyxDQUFDLENBQUMsR0FBRCxDQUFWO0lBQzFDO0VBQ0Y7O0VBQUMsT0FBTyxDQUFQO0FBQ0gsQ0ExQmdCLEdBMEJiLE9BMUJKOzs7OztBQ1hBO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBakI7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXpCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQVAsQ0FBeUIsVUFBekIsQ0FBZjs7QUFDQSxJQUFJLEtBQUssR0FBRyxTQUFSLEtBQVEsR0FBWTtFQUFFO0FBQWEsQ0FBdkM7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsV0FBaEIsQyxDQUVBOztBQUNBLElBQUksV0FBVSxHQUFHLHNCQUFZO0VBQzNCO0VBQ0EsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixRQUF6QixDQUFiOztFQUNBLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFwQjtFQUNBLElBQUksRUFBRSxHQUFHLEdBQVQ7RUFDQSxJQUFJLEVBQUUsR0FBRyxHQUFUO0VBQ0EsSUFBSSxjQUFKO0VBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE1BQXZCOztFQUNBLE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUIsV0FBbkIsQ0FBK0IsTUFBL0I7O0VBQ0EsTUFBTSxDQUFDLEdBQVAsR0FBYSxhQUFiLENBVDJCLENBU0M7RUFDNUI7RUFDQTs7RUFDQSxjQUFjLEdBQUcsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsUUFBdEM7RUFDQSxjQUFjLENBQUMsSUFBZjtFQUNBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLEVBQUUsR0FBRyxRQUFMLEdBQWdCLEVBQWhCLEdBQXFCLG1CQUFyQixHQUEyQyxFQUEzQyxHQUFnRCxTQUFoRCxHQUE0RCxFQUFqRjtFQUNBLGNBQWMsQ0FBQyxLQUFmO0VBQ0EsV0FBVSxHQUFHLGNBQWMsQ0FBQyxDQUE1Qjs7RUFDQSxPQUFPLENBQUMsRUFBUjtJQUFZLE9BQU8sV0FBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQixXQUFXLENBQUMsQ0FBRCxDQUFqQyxDQUFQO0VBQVo7O0VBQ0EsT0FBTyxXQUFVLEVBQWpCO0FBQ0QsQ0FuQkQ7O0FBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxNQUFQLElBQWlCLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixVQUFuQixFQUErQjtFQUMvRCxJQUFJLE1BQUo7O0VBQ0EsSUFBSSxDQUFDLEtBQUssSUFBVixFQUFnQjtJQUNkLEtBQUssQ0FBQyxTQUFELENBQUwsR0FBbUIsUUFBUSxDQUFDLENBQUQsQ0FBM0I7SUFDQSxNQUFNLEdBQUcsSUFBSSxLQUFKLEVBQVQ7SUFDQSxLQUFLLENBQUMsU0FBRCxDQUFMLEdBQW1CLElBQW5CLENBSGMsQ0FJZDs7SUFDQSxNQUFNLENBQUMsUUFBRCxDQUFOLEdBQW1CLENBQW5CO0VBQ0QsQ0FORCxNQU1PLE1BQU0sR0FBRyxXQUFVLEVBQW5COztFQUNQLE9BQU8sVUFBVSxLQUFLLFNBQWYsR0FBMkIsTUFBM0IsR0FBb0MsR0FBRyxDQUFDLE1BQUQsRUFBUyxVQUFULENBQTlDO0FBQ0QsQ0FWRDs7Ozs7QUM5QkEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQTVCOztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxpQkFBRCxDQUF6Qjs7QUFDQSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBaEI7QUFFQSxPQUFPLENBQUMsQ0FBUixHQUFZLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLEdBQTRCLE1BQU0sQ0FBQyxjQUFuQyxHQUFvRCxTQUFTLGNBQVQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsVUFBOUIsRUFBMEM7RUFDeEcsUUFBUSxDQUFDLENBQUQsQ0FBUjtFQUNBLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBRCxFQUFJLElBQUosQ0FBZjtFQUNBLFFBQVEsQ0FBQyxVQUFELENBQVI7RUFDQSxJQUFJLGNBQUosRUFBb0IsSUFBSTtJQUN0QixPQUFPLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLFVBQVAsQ0FBVDtFQUNELENBRm1CLENBRWxCLE9BQU8sQ0FBUCxFQUFVO0lBQUU7RUFBYTtFQUMzQixJQUFJLFNBQVMsVUFBVCxJQUF1QixTQUFTLFVBQXBDLEVBQWdELE1BQU0sU0FBUyxDQUFDLDBCQUFELENBQWY7RUFDaEQsSUFBSSxXQUFXLFVBQWYsRUFBMkIsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLFVBQVUsQ0FBQyxLQUFsQjtFQUMzQixPQUFPLENBQVA7QUFDRCxDQVZEOzs7OztBQ0xBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQWhCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFyQjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsZ0JBQUQsQ0FBUCxHQUE0QixNQUFNLENBQUMsZ0JBQW5DLEdBQXNELFNBQVMsZ0JBQVQsQ0FBMEIsQ0FBMUIsRUFBNkIsVUFBN0IsRUFBeUM7RUFDOUcsUUFBUSxDQUFDLENBQUQsQ0FBUjtFQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQWxCO0VBQ0EsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQWxCO0VBQ0EsSUFBSSxDQUFDLEdBQUcsQ0FBUjtFQUNBLElBQUksQ0FBSjs7RUFDQSxPQUFPLE1BQU0sR0FBRyxDQUFoQjtJQUFtQixFQUFFLENBQUMsQ0FBSCxDQUFLLENBQUwsRUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRixDQUFoQixFQUF1QixVQUFVLENBQUMsQ0FBRCxDQUFqQztFQUFuQjs7RUFDQSxPQUFPLENBQVA7QUFDRCxDQVJEOzs7OztBQ0pBLE9BQU8sQ0FBQyxDQUFSLEdBQVksTUFBTSxDQUFDLHFCQUFuQjs7Ozs7QUNBQTtBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQVAsQ0FBeUIsVUFBekIsQ0FBZjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBekI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLGNBQVAsSUFBeUIsVUFBVSxDQUFWLEVBQWE7RUFDckQsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFELENBQVo7RUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFELEVBQUksUUFBSixDQUFQLEVBQXNCLE9BQU8sQ0FBQyxDQUFDLFFBQUQsQ0FBUjs7RUFDdEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxXQUFULElBQXdCLFVBQXhCLElBQXNDLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBekQsRUFBc0U7SUFDcEUsT0FBTyxDQUFDLENBQUMsV0FBRixDQUFjLFNBQXJCO0VBQ0Q7O0VBQUMsT0FBTyxDQUFDLFlBQVksTUFBYixHQUFzQixXQUF0QixHQUFvQyxJQUEzQztBQUNILENBTkQ7Ozs7O0FDTkEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkIsS0FBN0IsQ0FBbkI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixVQUF6QixDQUFmOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QjtFQUN4QyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBRCxDQUFqQjtFQUNBLElBQUksQ0FBQyxHQUFHLENBQVI7RUFDQSxJQUFJLE1BQU0sR0FBRyxFQUFiO0VBQ0EsSUFBSSxHQUFKOztFQUNBLEtBQUssR0FBTCxJQUFZLENBQVo7SUFBZSxJQUFJLEdBQUcsSUFBSSxRQUFYLEVBQXFCLEdBQUcsQ0FBQyxDQUFELEVBQUksR0FBSixDQUFILElBQWUsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQWY7RUFBcEMsQ0FMd0MsQ0FNeEM7OztFQUNBLE9BQU8sS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUF0QjtJQUF5QixJQUFJLEdBQUcsQ0FBQyxDQUFELEVBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUYsQ0FBZixDQUFQLEVBQThCO01BQ3JELENBQUMsWUFBWSxDQUFDLE1BQUQsRUFBUyxHQUFULENBQWIsSUFBOEIsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQTlCO0lBQ0Q7RUFGRDs7RUFHQSxPQUFPLE1BQVA7QUFDRCxDQVhEOzs7OztBQ0xBO0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHlCQUFELENBQW5COztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF6Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsSUFBUCxJQUFlLFNBQVMsSUFBVCxDQUFjLENBQWQsRUFBaUI7RUFDL0MsT0FBTyxLQUFLLENBQUMsQ0FBRCxFQUFJLFdBQUosQ0FBWjtBQUNELENBRkQ7Ozs7O0FDSkEsT0FBTyxDQUFDLENBQVIsR0FBWSxHQUFHLG9CQUFmOzs7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QjtFQUN4QyxPQUFPO0lBQ0wsVUFBVSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQVgsQ0FEUDtJQUVMLFlBQVksRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFYLENBRlQ7SUFHTCxRQUFRLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBWCxDQUhMO0lBSUwsS0FBSyxFQUFFO0VBSkYsQ0FBUDtBQU1ELENBUEQ7Ozs7O0FDQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQUQsQ0FBbEI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixLQUFsQixDQUFWOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx1QkFBRCxDQUF2Qjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxVQUFoQjtBQUNBLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxTQUFOLEVBQWlCLEtBQWpCLENBQXVCLFNBQXZCLENBQVY7O0FBRUEsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQixhQUFuQixHQUFtQyxVQUFVLEVBQVYsRUFBYztFQUMvQyxPQUFPLFNBQVMsQ0FBQyxJQUFWLENBQWUsRUFBZixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxDQUFDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBdUIsSUFBdkIsRUFBNkI7RUFDN0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFQLElBQWMsVUFBL0I7RUFDQSxJQUFJLFVBQUosRUFBZ0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxNQUFOLENBQUgsSUFBb0IsSUFBSSxDQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsR0FBZCxDQUF4QjtFQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFELENBQUQsS0FBVyxHQUFmLEVBQW9CO0VBQ3BCLElBQUksVUFBSixFQUFnQixHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBSCxJQUFpQixJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsS0FBSyxDQUFDLENBQUMsR0FBRCxDQUFmLEdBQXVCLEdBQUcsQ0FBQyxJQUFKLENBQVMsTUFBTSxDQUFDLEdBQUQsQ0FBZixDQUFsQyxDQUFyQjs7RUFDaEIsSUFBSSxDQUFDLEtBQUssTUFBVixFQUFrQjtJQUNoQixDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsR0FBVDtFQUNELENBRkQsTUFFTyxJQUFJLENBQUMsSUFBTCxFQUFXO0lBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUQsQ0FBUjtJQUNBLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixFQUFTLEdBQVQsQ0FBSjtFQUNELENBSE0sTUFHQSxJQUFJLENBQUMsQ0FBQyxHQUFELENBQUwsRUFBWTtJQUNqQixDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsR0FBVDtFQUNELENBRk0sTUFFQTtJQUNMLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixFQUFTLEdBQVQsQ0FBSjtFQUNELENBZDRDLENBZS9DOztBQUNDLENBaEJELEVBZ0JHLFFBQVEsQ0FBQyxTQWhCWixFQWdCdUIsU0FoQnZCLEVBZ0JrQyxTQUFTLFFBQVQsR0FBb0I7RUFDcEQsT0FBTyxPQUFPLElBQVAsSUFBZSxVQUFmLElBQTZCLEtBQUssR0FBTCxDQUE3QixJQUEwQyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsQ0FBakQ7QUFDRCxDQWxCRDs7Ozs7QUNaQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCLENBQWxDOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0IsYUFBbEIsQ0FBVjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYyxHQUFkLEVBQW1CLElBQW5CLEVBQXlCO0VBQ3hDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBSCxHQUFRLEVBQUUsQ0FBQyxTQUFyQixFQUFnQyxHQUFoQyxDQUFkLEVBQW9ELEdBQUcsQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVO0lBQUUsWUFBWSxFQUFFLElBQWhCO0lBQXNCLEtBQUssRUFBRTtFQUE3QixDQUFWLENBQUg7QUFDckQsQ0FGRDs7Ozs7QUNKQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCLE1BQXJCLENBQWI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxHQUFWLEVBQWU7RUFDOUIsT0FBTyxNQUFNLENBQUMsR0FBRCxDQUFOLEtBQWdCLE1BQU0sQ0FBQyxHQUFELENBQU4sR0FBYyxHQUFHLENBQUMsR0FBRCxDQUFqQyxDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNGQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFsQjs7QUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFJLE1BQU0sR0FBRyxvQkFBYjtBQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFELENBQU4sS0FBbUIsTUFBTSxDQUFDLE1BQUQsQ0FBTixHQUFpQixFQUFwQyxDQUFaO0FBRUEsQ0FBQyxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0VBQ3RDLE9BQU8sS0FBSyxDQUFDLEdBQUQsQ0FBTCxLQUFlLEtBQUssQ0FBQyxHQUFELENBQUwsR0FBYSxLQUFLLEtBQUssU0FBVixHQUFzQixLQUF0QixHQUE4QixFQUExRCxDQUFQO0FBQ0QsQ0FGRCxFQUVHLFVBRkgsRUFFZSxFQUZmLEVBRW1CLElBRm5CLENBRXdCO0VBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FEUTtFQUV0QixJQUFJLEVBQUUsT0FBTyxDQUFDLFlBQUQsQ0FBUCxHQUF3QixNQUF4QixHQUFpQyxRQUZqQjtFQUd0QixTQUFTLEVBQUU7QUFIVyxDQUZ4Qjs7Ozs7QUNMQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUF2Qjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQixDLENBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxTQUFWLEVBQXFCO0VBQ3BDLE9BQU8sVUFBVSxJQUFWLEVBQWdCLEdBQWhCLEVBQXFCO0lBQzFCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBRCxDQUFSLENBQWQ7SUFDQSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRCxDQUFqQjtJQUNBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFWO0lBQ0EsSUFBSSxDQUFKLEVBQU8sQ0FBUDtJQUNBLElBQUksQ0FBQyxHQUFHLENBQUosSUFBUyxDQUFDLElBQUksQ0FBbEIsRUFBcUIsT0FBTyxTQUFTLEdBQUcsRUFBSCxHQUFRLFNBQXhCO0lBQ3JCLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBRixDQUFhLENBQWIsQ0FBSjtJQUNBLE9BQU8sQ0FBQyxHQUFHLE1BQUosSUFBYyxDQUFDLEdBQUcsTUFBbEIsSUFBNEIsQ0FBQyxHQUFHLENBQUosS0FBVSxDQUF0QyxJQUEyQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBRixDQUFhLENBQUMsR0FBRyxDQUFqQixDQUFMLElBQTRCLE1BQXZFLElBQWlGLENBQUMsR0FBRyxNQUFyRixHQUNILFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsQ0FBSCxHQUFpQixDQUR2QixHQUVILFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsRUFBVyxDQUFDLEdBQUcsQ0FBZixDQUFILEdBQXVCLENBQUMsQ0FBQyxHQUFHLE1BQUosSUFBYyxFQUFmLEtBQXNCLENBQUMsR0FBRyxNQUExQixJQUFvQyxPQUZ4RTtFQUdELENBVkQ7QUFXRCxDQVpEOzs7OztBQ0pBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFmO0FBQ0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQWY7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCO0VBQ3hDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBRCxDQUFqQjtFQUNBLE9BQU8sS0FBSyxHQUFHLENBQVIsR0FBWSxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQVQsRUFBaUIsQ0FBakIsQ0FBZixHQUFxQyxHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBL0M7QUFDRCxDQUhEOzs7OztBQ0hBO0FBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQWhCO0FBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQWpCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0VBQzdCLE9BQU8sS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQVAsQ0FBTCxHQUFrQixDQUFsQixHQUFzQixDQUFDLEVBQUUsR0FBRyxDQUFMLEdBQVMsS0FBVCxHQUFpQixJQUFsQixFQUF3QixFQUF4QixDQUE3QjtBQUNELENBRkQ7Ozs7O0FDSEE7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztFQUM3QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRCxDQUFSLENBQWQ7QUFDRCxDQUZEOzs7OztBQ0hBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQWY7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7RUFDN0IsT0FBTyxFQUFFLEdBQUcsQ0FBTCxHQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRCxDQUFWLEVBQWdCLGdCQUFoQixDQUFaLEdBQWdELENBQXZELENBRDZCLENBQzZCO0FBQzNELENBRkQ7Ozs7O0FDSEE7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztFQUM3QixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRCxDQUFSLENBQWI7QUFDRCxDQUZEOzs7OztBQ0ZBO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEIsQyxDQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLENBQWQsRUFBaUI7RUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFELENBQWIsRUFBbUIsT0FBTyxFQUFQO0VBQ25CLElBQUksRUFBSixFQUFRLEdBQVI7RUFDQSxJQUFJLENBQUMsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBaEIsS0FBNkIsVUFBbEMsSUFBZ0QsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsRUFBUixDQUFQLENBQTdELEVBQWtGLE9BQU8sR0FBUDtFQUNsRixJQUFJLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFoQixLQUE0QixVQUE1QixJQUEwQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUgsQ0FBUSxFQUFSLENBQVAsQ0FBdkQsRUFBNEUsT0FBTyxHQUFQO0VBQzVFLElBQUksQ0FBQyxDQUFELElBQU0sUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQWhCLEtBQTZCLFVBQW5DLElBQWlELENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSCxDQUFRLEVBQVIsQ0FBUCxDQUE5RCxFQUFtRixPQUFPLEdBQVA7RUFDbkYsTUFBTSxTQUFTLENBQUMseUNBQUQsQ0FBZjtBQUNELENBUEQ7Ozs7O0FDSkEsSUFBSSxFQUFFLEdBQUcsQ0FBVDtBQUNBLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFMLEVBQVQ7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxHQUFWLEVBQWU7RUFDOUIsT0FBTyxVQUFVLE1BQVYsQ0FBaUIsR0FBRyxLQUFLLFNBQVIsR0FBb0IsRUFBcEIsR0FBeUIsR0FBMUMsRUFBK0MsSUFBL0MsRUFBcUQsQ0FBQyxFQUFFLEVBQUYsR0FBTyxFQUFSLEVBQVksUUFBWixDQUFxQixFQUFyQixDQUFyRCxDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNGQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCLEtBQXJCLENBQVo7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxPQUFNLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQixNQUFsQzs7QUFDQSxJQUFJLFVBQVUsR0FBRyxPQUFPLE9BQVAsSUFBaUIsVUFBbEM7O0FBRUEsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxJQUFWLEVBQWdCO0VBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUQsQ0FBTCxLQUFnQixLQUFLLENBQUMsSUFBRCxDQUFMLEdBQ3JCLFVBQVUsSUFBSSxPQUFNLENBQUMsSUFBRCxDQUFwQixJQUE4QixDQUFDLFVBQVUsR0FBRyxPQUFILEdBQVksR0FBdkIsRUFBNEIsWUFBWSxJQUF4QyxDQUR6QixDQUFQO0FBRUQsQ0FIRDs7QUFLQSxRQUFRLENBQUMsS0FBVCxHQUFpQixLQUFqQjs7Ozs7QUNWQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQWY7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdkI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQixpQkFBbkIsR0FBdUMsVUFBVSxFQUFWLEVBQWM7RUFDcEUsSUFBSSxFQUFFLElBQUksU0FBVixFQUFxQixPQUFPLEVBQUUsQ0FBQyxRQUFELENBQUYsSUFDdkIsRUFBRSxDQUFDLFlBQUQsQ0FEcUIsSUFFdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFELENBQVIsQ0FGTztBQUd0QixDQUpEOzs7QUNIQTs7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFqQjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF0Qjs7QUFDQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsY0FBRCxDQUFsQjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBekI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQTVCOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBRCxDQUF2Qjs7QUFFQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQVIsR0FBWSxPQUFPLENBQUMsQ0FBUixHQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEIsVUFBVSxJQUFWLEVBQWdCO0VBQUUsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO0FBQW1CLENBQS9ELENBQTFCLEVBQTRGLE9BQTVGLEVBQXFHO0VBQzFHO0VBQ0EsSUFBSSxFQUFFLFNBQVMsSUFBVCxDQUFjO0VBQVU7RUFBeEIsRUFBd0U7SUFDNUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQUQsQ0FBaEI7SUFDQSxJQUFJLENBQUMsR0FBRyxPQUFPLElBQVAsSUFBZSxVQUFmLEdBQTRCLElBQTVCLEdBQW1DLEtBQTNDO0lBQ0EsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQXJCO0lBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQVAsR0FBVyxTQUFTLENBQUMsQ0FBRCxDQUFwQixHQUEwQixTQUF0QztJQUNBLElBQUksT0FBTyxHQUFHLEtBQUssS0FBSyxTQUF4QjtJQUNBLElBQUksS0FBSyxHQUFHLENBQVo7SUFDQSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBRCxDQUF0QjtJQUNBLElBQUksTUFBSixFQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBMEIsUUFBMUI7SUFDQSxJQUFJLE9BQUosRUFBYSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUQsRUFBUSxJQUFJLEdBQUcsQ0FBUCxHQUFXLFNBQVMsQ0FBQyxDQUFELENBQXBCLEdBQTBCLFNBQWxDLEVBQTZDLENBQTdDLENBQVgsQ0FUK0QsQ0FVNUU7O0lBQ0EsSUFBSSxNQUFNLElBQUksU0FBVixJQUF1QixFQUFFLENBQUMsSUFBSSxLQUFMLElBQWMsV0FBVyxDQUFDLE1BQUQsQ0FBM0IsQ0FBM0IsRUFBaUU7TUFDL0QsS0FBSyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFaLENBQVgsRUFBMkIsTUFBTSxHQUFHLElBQUksQ0FBSixFQUF6QyxFQUFrRCxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFULEVBQVIsRUFBeUIsSUFBNUUsRUFBa0YsS0FBSyxFQUF2RixFQUEyRjtRQUN6RixjQUFjLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixDQUFDLElBQUksQ0FBQyxLQUFOLEVBQWEsS0FBYixDQUFsQixFQUF1QyxJQUF2QyxDQUFQLEdBQXNELElBQUksQ0FBQyxLQUFsRixDQUFkO01BQ0Q7SUFDRixDQUpELE1BSU87TUFDTCxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFILENBQWpCOztNQUNBLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBSixDQUFNLE1BQU4sQ0FBZCxFQUE2QixNQUFNLEdBQUcsS0FBdEMsRUFBNkMsS0FBSyxFQUFsRCxFQUFzRDtRQUNwRCxjQUFjLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBRCxDQUFGLEVBQVcsS0FBWCxDQUFSLEdBQTRCLENBQUMsQ0FBQyxLQUFELENBQXBELENBQWQ7TUFDRDtJQUNGOztJQUNELE1BQU0sQ0FBQyxNQUFQLEdBQWdCLEtBQWhCO0lBQ0EsT0FBTyxNQUFQO0VBQ0Q7QUF6QnlHLENBQXJHLENBQVA7Ozs7O0FDVkE7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFFQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQVIsR0FBWSxPQUFPLENBQUMsQ0FBckIsRUFBd0IsUUFBeEIsRUFBa0M7RUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLGtCQUFEO0FBQWpCLENBQWxDLENBQVA7OztBQ0hBOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IsSUFBeEIsQ0FBVixDLENBRUE7OztBQUNBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLENBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLFVBQVUsUUFBVixFQUFvQjtFQUM5RCxLQUFLLEVBQUwsR0FBVSxNQUFNLENBQUMsUUFBRCxDQUFoQixDQUQ4RCxDQUNsQzs7RUFDNUIsS0FBSyxFQUFMLEdBQVUsQ0FBVixDQUY4RCxDQUVsQztFQUM5QjtBQUNDLENBSkQsRUFJRyxZQUFZO0VBQ2IsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFiO0VBQ0EsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFqQjtFQUNBLElBQUksS0FBSjtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFmLEVBQXVCLE9BQU87SUFBRSxLQUFLLEVBQUUsU0FBVDtJQUFvQixJQUFJLEVBQUU7RUFBMUIsQ0FBUDtFQUN2QixLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUQsRUFBSSxLQUFKLENBQVg7RUFDQSxLQUFLLEVBQUwsSUFBVyxLQUFLLENBQUMsTUFBakI7RUFDQSxPQUFPO0lBQUUsS0FBSyxFQUFFLEtBQVQ7SUFBZ0IsSUFBSSxFQUFFO0VBQXRCLENBQVA7QUFDRCxDQVpEOzs7OztBQ0pBO0FBRUEsQ0FBQyxZQUFZO0VBRVgsSUFBSSx3QkFBd0IsR0FBRztJQUM3QixRQUFRLEVBQUUsUUFEbUI7SUFFN0IsSUFBSSxFQUFFO01BQ0osR0FBRyxRQURDO01BRUosR0FBRyxNQUZDO01BR0osR0FBRyxXQUhDO01BSUosR0FBRyxLQUpDO01BS0osSUFBSSxPQUxBO01BTUosSUFBSSxPQU5BO01BT0osSUFBSSxPQVBBO01BUUosSUFBSSxTQVJBO01BU0osSUFBSSxLQVRBO01BVUosSUFBSSxPQVZBO01BV0osSUFBSSxVQVhBO01BWUosSUFBSSxRQVpBO01BYUosSUFBSSxTQWJBO01BY0osSUFBSSxZQWRBO01BZUosSUFBSSxRQWZBO01BZ0JKLElBQUksWUFoQkE7TUFpQkosSUFBSSxHQWpCQTtNQWtCSixJQUFJLFFBbEJBO01BbUJKLElBQUksVUFuQkE7TUFvQkosSUFBSSxLQXBCQTtNQXFCSixJQUFJLE1BckJBO01Bc0JKLElBQUksV0F0QkE7TUF1QkosSUFBSSxTQXZCQTtNQXdCSixJQUFJLFlBeEJBO01BeUJKLElBQUksV0F6QkE7TUEwQkosSUFBSSxRQTFCQTtNQTJCSixJQUFJLE9BM0JBO01BNEJKLElBQUksU0E1QkE7TUE2QkosSUFBSSxhQTdCQTtNQThCSixJQUFJLFFBOUJBO01BK0JKLElBQUksUUEvQkE7TUFnQ0osSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBaENBO01BaUNKLElBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQWpDQTtNQWtDSixJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FsQ0E7TUFtQ0osSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBbkNBO01Bb0NKLElBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQXBDQTtNQXFDSixJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FyQ0E7TUFzQ0osSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBdENBO01BdUNKLElBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQXZDQTtNQXdDSixJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0F4Q0E7TUF5Q0osSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBekNBO01BMENKLElBQUksSUExQ0E7TUEyQ0osSUFBSSxhQTNDQTtNQTRDSixLQUFLLFNBNUNEO01BNkNKLEtBQUssWUE3Q0Q7TUE4Q0osS0FBSyxZQTlDRDtNQStDSixLQUFLLFlBL0NEO01BZ0RKLEtBQUssVUFoREQ7TUFpREosS0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBakREO01Ba0RKLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQWxERDtNQW1ESixLQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FuREQ7TUFvREosS0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBcEREO01BcURKLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQXJERDtNQXNESixLQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0F0REQ7TUF1REosS0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBdkREO01Bd0RKLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQXhERDtNQXlESixLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0F6REQ7TUEwREosS0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBMUREO01BMkRKLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQTNERDtNQTRESixLQUFLLE1BNUREO01BNkRKLEtBQUssVUE3REQ7TUE4REosS0FBSyxNQTlERDtNQStESixLQUFLLE9BL0REO01BZ0VKLEtBQUssT0FoRUQ7TUFpRUosS0FBSyxVQWpFRDtNQWtFSixLQUFLLE1BbEVEO01BbUVKLEtBQUs7SUFuRUQ7RUFGdUIsQ0FBL0IsQ0FGVyxDQTJFWDs7RUFDQSxJQUFJLENBQUo7O0VBQ0EsS0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxFQUFoQixFQUFvQixDQUFDLEVBQXJCLEVBQXlCO0lBQ3ZCLHdCQUF3QixDQUFDLElBQXpCLENBQThCLE1BQU0sQ0FBcEMsSUFBeUMsTUFBTSxDQUEvQztFQUNELENBL0VVLENBaUZYOzs7RUFDQSxJQUFJLE1BQU0sR0FBRyxFQUFiOztFQUNBLEtBQUssQ0FBQyxHQUFHLEVBQVQsRUFBYSxDQUFDLEdBQUcsRUFBakIsRUFBcUIsQ0FBQyxFQUF0QixFQUEwQjtJQUN4QixNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsQ0FBcEIsQ0FBVDtJQUNBLHdCQUF3QixDQUFDLElBQXpCLENBQThCLENBQTlCLElBQW1DLENBQUMsTUFBTSxDQUFDLFdBQVAsRUFBRCxFQUF1QixNQUFNLENBQUMsV0FBUCxFQUF2QixDQUFuQztFQUNEOztFQUVELFNBQVMsUUFBVCxHQUFxQjtJQUNuQixJQUFJLEVBQUUsbUJBQW1CLE1BQXJCLEtBQ0EsU0FBUyxhQUFhLENBQUMsU0FEM0IsRUFDc0M7TUFDcEMsT0FBTyxLQUFQO0lBQ0QsQ0FKa0IsQ0FNbkI7OztJQUNBLElBQUksS0FBSyxHQUFHO01BQ1YsR0FBRyxFQUFFLGFBQVUsQ0FBVixFQUFhO1FBQ2hCLElBQUksR0FBRyxHQUFHLHdCQUF3QixDQUFDLElBQXpCLENBQThCLEtBQUssS0FBTCxJQUFjLEtBQUssT0FBakQsQ0FBVjs7UUFFQSxJQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFKLEVBQXdCO1VBQ3RCLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVAsQ0FBVDtRQUNEOztRQUVELE9BQU8sR0FBUDtNQUNEO0lBVFMsQ0FBWjtJQVdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLGFBQWEsQ0FBQyxTQUFwQyxFQUErQyxLQUEvQyxFQUFzRCxLQUF0RDtJQUNBLE9BQU8sS0FBUDtFQUNEOztFQUVELElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE1BQU0sQ0FBQyxHQUEzQyxFQUFnRDtJQUM5QyxNQUFNLENBQUMsNEJBQUQsRUFBK0Isd0JBQS9CLENBQU47RUFDRCxDQUZELE1BRU8sSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0MsT0FBTyxNQUFQLEtBQWtCLFdBQXhELEVBQXFFO0lBQzFFLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLHdCQUFqQjtFQUNELENBRk0sTUFFQSxJQUFJLE1BQUosRUFBWTtJQUNqQixNQUFNLENBQUMsd0JBQVAsR0FBa0Msd0JBQWxDO0VBQ0Q7QUFFRixDQXRIRDs7O0FDRkE7O0FBRUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxPQUFQLEtBQW1CLFdBQW5CLEdBQWlDLE9BQU8sQ0FBQyxTQUF6QyxHQUFxRCxFQUFqRTtBQUNBLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFOLElBQ1IsS0FBSyxDQUFDLGVBREUsSUFFUixLQUFLLENBQUMscUJBRkUsSUFHUixLQUFLLENBQUMsa0JBSEUsSUFJUixLQUFLLENBQUMsaUJBSkUsSUFLUixLQUFLLENBQUMsZ0JBTFg7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFqQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQixRQUFuQixFQUE2QjtFQUMzQixJQUFJLENBQUMsRUFBRCxJQUFPLEVBQUUsQ0FBQyxRQUFILEtBQWdCLENBQTNCLEVBQThCLE9BQU8sS0FBUDtFQUM5QixJQUFJLE1BQUosRUFBWSxPQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksRUFBWixFQUFnQixRQUFoQixDQUFQO0VBQ1osSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxnQkFBZCxDQUErQixRQUEvQixDQUFaOztFQUNBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQTFCLEVBQWtDLENBQUMsRUFBbkMsRUFBdUM7SUFDckMsSUFBSSxLQUFLLENBQUMsQ0FBRCxDQUFMLElBQVksRUFBaEIsRUFBb0IsT0FBTyxJQUFQO0VBQ3JCOztFQUNELE9BQU8sS0FBUDtBQUNEOzs7QUM3QkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBQ0EsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQW5DO0FBQ0EsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsY0FBdEM7QUFDQSxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxTQUFQLENBQWlCLG9CQUF4Qzs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7RUFDdEIsSUFBSSxHQUFHLEtBQUssSUFBUixJQUFnQixHQUFHLEtBQUssU0FBNUIsRUFBdUM7SUFDdEMsTUFBTSxJQUFJLFNBQUosQ0FBYyx1REFBZCxDQUFOO0VBQ0E7O0VBRUQsT0FBTyxNQUFNLENBQUMsR0FBRCxDQUFiO0FBQ0E7O0FBRUQsU0FBUyxlQUFULEdBQTJCO0VBQzFCLElBQUk7SUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQVosRUFBb0I7TUFDbkIsT0FBTyxLQUFQO0lBQ0EsQ0FIRSxDQUtIO0lBRUE7OztJQUNBLElBQUksS0FBSyxHQUFHLElBQUksTUFBSixDQUFXLEtBQVgsQ0FBWixDQVJHLENBUTZCOztJQUNoQyxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsSUFBWDs7SUFDQSxJQUFJLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixLQUEzQixFQUFrQyxDQUFsQyxNQUF5QyxHQUE3QyxFQUFrRDtNQUNqRCxPQUFPLEtBQVA7SUFDQSxDQVpFLENBY0g7OztJQUNBLElBQUksS0FBSyxHQUFHLEVBQVo7O0lBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxFQUFwQixFQUF3QixDQUFDLEVBQXpCLEVBQTZCO01BQzVCLEtBQUssQ0FBQyxNQUFNLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQXBCLENBQVAsQ0FBTCxHQUFzQyxDQUF0QztJQUNBOztJQUNELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixLQUEzQixFQUFrQyxHQUFsQyxDQUFzQyxVQUFVLENBQVYsRUFBYTtNQUMvRCxPQUFPLEtBQUssQ0FBQyxDQUFELENBQVo7SUFDQSxDQUZZLENBQWI7O0lBR0EsSUFBSSxNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVosTUFBb0IsWUFBeEIsRUFBc0M7TUFDckMsT0FBTyxLQUFQO0lBQ0EsQ0F4QkUsQ0EwQkg7OztJQUNBLElBQUksS0FBSyxHQUFHLEVBQVo7SUFDQSx1QkFBdUIsS0FBdkIsQ0FBNkIsRUFBN0IsRUFBaUMsT0FBakMsQ0FBeUMsVUFBVSxNQUFWLEVBQWtCO01BQzFELEtBQUssQ0FBQyxNQUFELENBQUwsR0FBZ0IsTUFBaEI7SUFDQSxDQUZEOztJQUdBLElBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBbEIsQ0FBWixFQUFzQyxJQUF0QyxDQUEyQyxFQUEzQyxNQUNGLHNCQURGLEVBQzBCO01BQ3pCLE9BQU8sS0FBUDtJQUNBOztJQUVELE9BQU8sSUFBUDtFQUNBLENBckNELENBcUNFLE9BQU8sR0FBUCxFQUFZO0lBQ2I7SUFDQSxPQUFPLEtBQVA7RUFDQTtBQUNEOztBQUVELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQWUsS0FBSyxNQUFNLENBQUMsTUFBWixHQUFxQixVQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEI7RUFDOUUsSUFBSSxJQUFKO0VBQ0EsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQUQsQ0FBakI7RUFDQSxJQUFJLE9BQUo7O0VBRUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBOUIsRUFBc0MsQ0FBQyxFQUF2QyxFQUEyQztJQUMxQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFELENBQVYsQ0FBYjs7SUFFQSxLQUFLLElBQUksR0FBVCxJQUFnQixJQUFoQixFQUFzQjtNQUNyQixJQUFJLGNBQWMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQUosRUFBb0M7UUFDbkMsRUFBRSxDQUFDLEdBQUQsQ0FBRixHQUFVLElBQUksQ0FBQyxHQUFELENBQWQ7TUFDQTtJQUNEOztJQUVELElBQUkscUJBQUosRUFBMkI7TUFDMUIsT0FBTyxHQUFHLHFCQUFxQixDQUFDLElBQUQsQ0FBL0I7O01BQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBNUIsRUFBb0MsQ0FBQyxFQUFyQyxFQUF5QztRQUN4QyxJQUFJLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLElBQXRCLEVBQTRCLE9BQU8sQ0FBQyxDQUFELENBQW5DLENBQUosRUFBNkM7VUFDNUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFELENBQVIsQ0FBRixHQUFpQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUQsQ0FBUixDQUFyQjtRQUNBO01BQ0Q7SUFDRDtFQUNEOztFQUVELE9BQU8sRUFBUDtBQUNBLENBekJEOzs7Ozs7O0FDaEVBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXRCOztBQUNBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQTNCOztBQUVBLElBQU0sZ0JBQWdCLEdBQUcseUJBQXpCO0FBQ0EsSUFBTSxLQUFLLEdBQUcsR0FBZDs7QUFFQSxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQWUsQ0FBUyxJQUFULEVBQWUsT0FBZixFQUF3QjtFQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLGdCQUFYLENBQVo7RUFDQSxJQUFJLFFBQUo7O0VBQ0EsSUFBSSxLQUFKLEVBQVc7SUFDVCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUQsQ0FBWjtJQUNBLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBRCxDQUFoQjtFQUNEOztFQUVELElBQUksT0FBSjs7RUFDQSxJQUFJLFFBQU8sT0FBUCxNQUFtQixRQUF2QixFQUFpQztJQUMvQixPQUFPLEdBQUc7TUFDUixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQUQsRUFBVSxTQUFWLENBRFA7TUFFUixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQUQsRUFBVSxTQUFWO0lBRlAsQ0FBVjtFQUlEOztFQUVELElBQUksUUFBUSxHQUFHO0lBQ2IsUUFBUSxFQUFFLFFBREc7SUFFYixRQUFRLEVBQUcsUUFBTyxPQUFQLE1BQW1CLFFBQXBCLEdBQ04sV0FBVyxDQUFDLE9BQUQsQ0FETCxHQUVOLFFBQVEsR0FDTixRQUFRLENBQUMsUUFBRCxFQUFXLE9BQVgsQ0FERixHQUVOLE9BTk87SUFPYixPQUFPLEVBQUU7RUFQSSxDQUFmOztFQVVBLElBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLElBQXNCLENBQUMsQ0FBM0IsRUFBOEI7SUFDNUIsT0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsR0FBbEIsQ0FBc0IsVUFBUyxLQUFULEVBQWdCO01BQzNDLE9BQU8sTUFBTSxDQUFDO1FBQUMsSUFBSSxFQUFFO01BQVAsQ0FBRCxFQUFnQixRQUFoQixDQUFiO0lBQ0QsQ0FGTSxDQUFQO0VBR0QsQ0FKRCxNQUlPO0lBQ0wsUUFBUSxDQUFDLElBQVQsR0FBZ0IsSUFBaEI7SUFDQSxPQUFPLENBQUMsUUFBRCxDQUFQO0VBQ0Q7QUFDRixDQWxDRDs7QUFvQ0EsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFTLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUI7RUFDOUIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUQsQ0FBZjtFQUNBLE9BQU8sR0FBRyxDQUFDLEdBQUQsQ0FBVjtFQUNBLE9BQU8sS0FBUDtBQUNELENBSkQ7O0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxRQUFULENBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDO0VBQ2hELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixFQUNmLE1BRGUsQ0FDUixVQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0lBQzNCLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFELEVBQU8sTUFBTSxDQUFDLElBQUQsQ0FBYixDQUE1QjtJQUNBLE9BQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFaLENBQVA7RUFDRCxDQUplLEVBSWIsRUFKYSxDQUFsQjtFQU1BLE9BQU8sTUFBTSxDQUFDO0lBQ1osR0FBRyxFQUFFLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtNQUNqQyxTQUFTLENBQUMsT0FBVixDQUFrQixVQUFTLFFBQVQsRUFBbUI7UUFDbkMsT0FBTyxDQUFDLGdCQUFSLENBQ0UsUUFBUSxDQUFDLElBRFgsRUFFRSxRQUFRLENBQUMsUUFGWCxFQUdFLFFBQVEsQ0FBQyxPQUhYO01BS0QsQ0FORDtJQU9ELENBVFc7SUFVWixNQUFNLEVBQUUsU0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDO01BQ3ZDLFNBQVMsQ0FBQyxPQUFWLENBQWtCLFVBQVMsUUFBVCxFQUFtQjtRQUNuQyxPQUFPLENBQUMsbUJBQVIsQ0FDRSxRQUFRLENBQUMsSUFEWCxFQUVFLFFBQVEsQ0FBQyxRQUZYLEVBR0UsUUFBUSxDQUFDLE9BSFg7TUFLRCxDQU5EO0lBT0Q7RUFsQlcsQ0FBRCxFQW1CVixLQW5CVSxDQUFiO0FBb0JELENBM0JEOzs7OztBQ2pEQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBdkI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCO0VBQzNDLEdBQUc7SUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFELEVBQVUsUUFBVixDQUFYLEVBQWdDO01BQzlCLE9BQU8sT0FBUDtJQUNEO0VBQ0YsQ0FKRCxRQUlTLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFuQixLQUFrQyxPQUFPLENBQUMsUUFBUixLQUFxQixDQUpoRTtBQUtELENBTkQ7Ozs7O0FDRkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWlCLFNBQWpCLEVBQTRCO0VBQzNDLE9BQU8sVUFBUyxDQUFULEVBQVk7SUFDakIsT0FBTyxTQUFTLENBQUMsSUFBVixDQUFlLFVBQVMsRUFBVCxFQUFhO01BQ2pDLE9BQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxNQUFxQixLQUE1QjtJQUNELENBRk0sRUFFSixJQUZJLENBQVA7RUFHRCxDQUpEO0FBS0QsQ0FORDs7Ozs7QUNBQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUF2Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsRUFBNUIsRUFBZ0M7RUFDL0MsT0FBTyxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7SUFDaEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFQLEVBQWUsUUFBZixDQUFwQjs7SUFDQSxJQUFJLE1BQUosRUFBWTtNQUNWLE9BQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFSLEVBQWdCLEtBQWhCLENBQVA7SUFDRDtFQUNGLENBTEQ7QUFNRCxDQVBEOzs7OztBQ0ZBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQXZCOztBQUVBLElBQU0sS0FBSyxHQUFHLEdBQWQ7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxXQUFULENBQXFCLFNBQXJCLEVBQWdDO0VBQy9DLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixDQUFiLENBRCtDLENBRy9DO0VBQ0E7RUFDQTs7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFMLEtBQWdCLENBQWhCLElBQXFCLElBQUksQ0FBQyxDQUFELENBQUosS0FBWSxLQUFyQyxFQUE0QztJQUMxQyxPQUFPLFNBQVMsQ0FBQyxLQUFELENBQWhCO0VBQ0Q7O0VBRUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQUwsQ0FBWSxVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0lBQ3JELElBQUksQ0FBQyxJQUFMLENBQVUsUUFBUSxDQUFDLFFBQUQsRUFBVyxTQUFTLENBQUMsUUFBRCxDQUFwQixDQUFsQjtJQUNBLE9BQU8sSUFBUDtFQUNELENBSGlCLEVBR2YsRUFIZSxDQUFsQjtFQUlBLE9BQU8sT0FBTyxDQUFDLFNBQUQsQ0FBZDtBQUNELENBZkQ7Ozs7O0FDTEEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxNQUFULENBQWdCLE9BQWhCLEVBQXlCLEVBQXpCLEVBQTZCO0VBQzVDLE9BQU8sU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCO0lBQzNCLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxNQUFkLElBQXdCLENBQUMsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBQyxDQUFDLE1BQW5CLENBQTdCLEVBQXlEO01BQ3ZELE9BQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxDQUFQO0lBQ0Q7RUFDRixDQUpEO0FBS0QsQ0FORDs7O0FDQUE7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFDZixRQUFRLEVBQUUsT0FBTyxDQUFDLFlBQUQsQ0FERjtFQUVmLFFBQVEsRUFBRSxPQUFPLENBQUMsWUFBRCxDQUZGO0VBR2YsV0FBVyxFQUFFLE9BQU8sQ0FBQyxlQUFELENBSEw7RUFJZixNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQUQsQ0FKQTtFQUtmLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBRDtBQUxBLENBQWpCOzs7OztBQ0ZBLE9BQU8sQ0FBQyw0QkFBRCxDQUFQLEMsQ0FFQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sU0FBUyxHQUFHO0VBQ2hCLE9BQVksUUFESTtFQUVoQixXQUFZLFNBRkk7RUFHaEIsUUFBWSxTQUhJO0VBSWhCLFNBQVk7QUFKSSxDQUFsQjtBQU9BLElBQU0sa0JBQWtCLEdBQUcsR0FBM0I7O0FBRUEsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQVMsS0FBVCxFQUFnQixZQUFoQixFQUE4QjtFQUNoRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBaEI7O0VBQ0EsSUFBSSxZQUFKLEVBQWtCO0lBQ2hCLEtBQUssSUFBSSxRQUFULElBQXFCLFNBQXJCLEVBQWdDO01BQzlCLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFELENBQVYsQ0FBTCxLQUErQixJQUFuQyxFQUF5QztRQUN2QyxHQUFHLEdBQUcsQ0FBQyxRQUFELEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFxQixrQkFBckIsQ0FBTjtNQUNEO0lBQ0Y7RUFDRjs7RUFDRCxPQUFPLEdBQVA7QUFDRCxDQVZEOztBQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtFQUNyQyxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsQ0FBdUIsVUFBUyxHQUFULEVBQWM7SUFDeEQsT0FBTyxHQUFHLENBQUMsT0FBSixDQUFZLGtCQUFaLElBQWtDLENBQUMsQ0FBMUM7RUFDRCxDQUZvQixDQUFyQjtFQUdBLE9BQU8sVUFBUyxLQUFULEVBQWdCO0lBQ3JCLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFELEVBQVEsWUFBUixDQUFyQjtJQUNBLE9BQU8sQ0FBQyxHQUFELEVBQU0sR0FBRyxDQUFDLFdBQUosRUFBTixFQUNKLE1BREksQ0FDRyxVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUI7TUFDN0IsSUFBSSxJQUFJLElBQUksSUFBWixFQUFrQjtRQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUQsQ0FBSixDQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEtBQXJCLENBQVQ7TUFDRDs7TUFDRCxPQUFPLE1BQVA7SUFDRCxDQU5JLEVBTUYsU0FORSxDQUFQO0VBT0QsQ0FURDtBQVVELENBZEQ7O0FBZ0JBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixHQUEyQixTQUEzQjs7O0FDMUNBOzs7Ozs7O0FBQ0E7O0FBQ0EsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQXRCOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUFELENBQW5DOztBQUNBLElBQU0sTUFBTSxxQ0FBWjtBQUNBLElBQU0sUUFBUSxHQUFHLGVBQWpCO0FBQ0EsSUFBTSxlQUFlLEdBQUcsc0JBQXhCO0FBQ0EsSUFBTSxxQkFBcUIsR0FBRywyQkFBOUI7QUFDQSxJQUFNLDhCQUE4QixHQUFHLDRCQUF2QztBQUNBLElBQUksSUFBSSxHQUFHO0VBQ1QsWUFBWSxVQURIO0VBRVQsYUFBYTtBQUZKLENBQVg7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVMsU0FBVCxDQUFtQixVQUFuQixFQUErQztFQUFBLElBQWhCLE9BQWdCLHVFQUFOLElBQU07O0VBQzdDLElBQUcsQ0FBQyxVQUFKLEVBQWU7SUFDYixNQUFNLElBQUksS0FBSixtQ0FBTjtFQUNEOztFQUNELEtBQUssU0FBTCxHQUFpQixVQUFqQjtFQUNBLElBQUksR0FBRyxPQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLElBQXBCLEdBQTJCLFlBQVU7RUFDbkMsS0FBSyxPQUFMLEdBQWUsS0FBSyxTQUFMLENBQWUsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBZjs7RUFDQSxJQUFHLEtBQUssT0FBTCxDQUFhLE1BQWIsSUFBdUIsQ0FBMUIsRUFBNEI7SUFDMUIsTUFBTSxJQUFJLEtBQUosNkJBQU47RUFDRCxDQUprQyxDQU1uQzs7O0VBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxDQUFDLEVBQTFDLEVBQTZDO0lBQzNDLElBQUksYUFBYSxHQUFHLEtBQUssT0FBTCxDQUFhLENBQWIsQ0FBcEIsQ0FEMkMsQ0FHM0M7O0lBQ0EsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsUUFBM0IsTUFBeUMsTUFBeEQ7SUFDQSxLQUFLLFlBQUwsQ0FBa0IsYUFBbEIsRUFBaUMsUUFBakMsRUFMMkMsQ0FPM0M7O0lBQ0EsYUFBYSxDQUFDLG1CQUFkLENBQWtDLE9BQWxDLEVBQTJDLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixFQUE2QixhQUE3QixDQUEzQyxFQUF3RixLQUF4RjtJQUNBLGFBQWEsQ0FBQyxnQkFBZCxDQUErQixPQUEvQixFQUF3QyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsRUFBNkIsYUFBN0IsQ0FBeEMsRUFBcUYsS0FBckY7RUFDRCxDQWpCa0MsQ0FrQm5DOzs7RUFDQSxJQUFJLFdBQVcsR0FBRyxLQUFLLFNBQUwsQ0FBZSxzQkFBakM7O0VBQ0EsSUFBRyxXQUFXLEtBQUssSUFBaEIsSUFBd0IsV0FBVyxDQUFDLFNBQVosQ0FBc0IsUUFBdEIsQ0FBK0IsdUJBQS9CLENBQTNCLEVBQW1GO0lBQ2pGLEtBQUssa0JBQUwsR0FBMEIsV0FBMUI7SUFDQSxLQUFLLGtCQUFMLENBQXdCLGdCQUF4QixDQUF5QyxPQUF6QyxFQUFrRCxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLENBQWxEO0VBQ0Q7QUFDRixDQXhCRDtBQTBCQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFNBQXBCLEdBQWdDLFlBQVU7RUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBZDs7RUFDQSxJQUFHLENBQUMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsU0FBbEIsQ0FBNEIsUUFBNUIsQ0FBcUMsV0FBckMsQ0FBSixFQUFzRDtJQUNwRCxNQUFNLElBQUksS0FBSiw2QkFBTjtFQUNEOztFQUNELElBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsSUFBMEIsQ0FBN0IsRUFBK0I7SUFDN0IsTUFBTSxJQUFJLEtBQUosNkJBQU47RUFDRDs7RUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFiOztFQUNBLElBQUcsT0FBTyxDQUFDLGtCQUFSLENBQTJCLFlBQTNCLENBQXdDLDhCQUF4QyxNQUE0RSxPQUEvRSxFQUF3RjtJQUN0RixNQUFNLEdBQUcsS0FBVDtFQUNEOztFQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBcEMsRUFBNEMsQ0FBQyxFQUE3QyxFQUFnRDtJQUM5QyxPQUFPLENBQUMsWUFBUixDQUFxQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFoQixDQUFyQixFQUF5QyxNQUF6QyxFQUFpRCxJQUFqRDtFQUNEOztFQUVELE9BQU8sQ0FBQyxrQkFBUixDQUEyQixZQUEzQixDQUF3Qyw4QkFBeEMsRUFBd0UsQ0FBQyxNQUF6RTs7RUFDQSxJQUFHLENBQUMsTUFBRCxLQUFZLElBQWYsRUFBb0I7SUFDbEIsT0FBTyxDQUFDLGtCQUFSLENBQTJCLFNBQTNCLEdBQXVDLElBQUksQ0FBQyxRQUE1QztFQUNELENBRkQsTUFFTTtJQUNKLE9BQU8sQ0FBQyxrQkFBUixDQUEyQixTQUEzQixHQUF1QyxJQUFJLENBQUMsU0FBNUM7RUFDRDtBQUNGLENBdkJEO0FBeUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFlBQXBCLEdBQW1DLFVBQVUsT0FBVixFQUFtQixDQUFuQixFQUFzQjtFQUN2RCxJQUFJLE9BQU8sR0FBRyxJQUFkO0VBQ0EsQ0FBQyxDQUFDLGVBQUY7RUFDQSxDQUFDLENBQUMsY0FBRjtFQUNBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQXJCOztFQUNBLElBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsUUFBckIsTUFBbUMsTUFBdkMsRUFBK0M7SUFDN0M7SUFDQTtJQUNBO0lBQ0EsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQUQsQ0FBeEIsRUFBbUMsT0FBTyxDQUFDLGNBQVI7RUFDcEM7QUFDRixDQVhEO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQyxTQUFTLENBQUMsU0FBVixDQUFvQixZQUFwQixHQUFtQyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBMEM7RUFBQSxJQUFkLElBQWMsdUVBQVAsS0FBTztFQUM1RSxJQUFJLFNBQVMsR0FBRyxJQUFoQjs7RUFDQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQWxCLENBQTZCLFNBQTdCLENBQXVDLFFBQXZDLENBQWdELFdBQWhELENBQUgsRUFBZ0U7SUFDOUQsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQTlCO0VBQ0QsQ0FGRCxNQUVPLElBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBNkIsVUFBN0IsQ0FBd0MsU0FBeEMsQ0FBa0QsUUFBbEQsQ0FBMkQsV0FBM0QsQ0FBSCxFQUEyRTtJQUNoRixTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBNkIsVUFBekM7RUFDRDs7RUFDRCxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQUQsRUFBUyxRQUFULENBQWpCOztFQUNBLElBQUcsUUFBSCxFQUFZO0lBQ1YsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFKLENBQVUsb0JBQVYsQ0FBaEI7SUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixTQUFyQjtFQUNELENBSEQsTUFHTTtJQUNKLElBQUksVUFBVSxHQUFHLElBQUksS0FBSixDQUFVLHFCQUFWLENBQWpCO0lBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsVUFBckI7RUFDRDs7RUFFRCxJQUFJLGVBQWUsR0FBRyxLQUF0Qjs7RUFDQSxJQUFHLFNBQVMsS0FBSyxJQUFkLEtBQXVCLFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLE1BQTRDLE1BQTVDLElBQXNELFNBQVMsQ0FBQyxTQUFWLENBQW9CLFFBQXBCLENBQTZCLHFCQUE3QixDQUE3RSxDQUFILEVBQXFJO0lBQ25JLGVBQWUsR0FBRyxJQUFsQjtJQUNBLElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxzQkFBN0I7O0lBQ0EsSUFBRyxZQUFZLEtBQUssSUFBakIsSUFBeUIsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsdUJBQWhDLENBQTVCLEVBQXFGO01BQ25GLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxnQkFBVixDQUEyQixNQUEzQixDQUFkOztNQUNBLElBQUcsSUFBSSxLQUFLLEtBQVosRUFBa0I7UUFDaEIsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE1BQU0sR0FBQyx3QkFBbEMsQ0FBbEI7UUFDQSxJQUFJLFNBQVMsR0FBRyxJQUFoQjs7UUFFQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQW1CLFdBQVcsQ0FBQyxNQUFsQyxFQUF5QztVQUN2QyxTQUFTLEdBQUcsS0FBWjtRQUNEOztRQUVELFlBQVksQ0FBQyxZQUFiLENBQTBCLDhCQUExQixFQUEwRCxTQUExRDs7UUFDQSxJQUFHLFNBQVMsS0FBSyxJQUFqQixFQUFzQjtVQUNwQixZQUFZLENBQUMsU0FBYixHQUF5QixJQUFJLENBQUMsUUFBOUI7UUFDRCxDQUZELE1BRU07VUFDSixZQUFZLENBQUMsU0FBYixHQUF5QixJQUFJLENBQUMsU0FBOUI7UUFDRDtNQUNGO0lBQ0Y7RUFDRjs7RUFFRCxJQUFJLFFBQVEsSUFBSSxDQUFDLGVBQWpCLEVBQWtDO0lBQ2hDLElBQUksUUFBTyxHQUFHLENBQUUsTUFBRixDQUFkOztJQUNBLElBQUcsU0FBUyxLQUFLLElBQWpCLEVBQXVCO01BQ3JCLFFBQU8sR0FBRyxTQUFTLENBQUMsZ0JBQVYsQ0FBMkIsTUFBM0IsQ0FBVjtJQUNEOztJQUNELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxRQUFPLENBQUMsTUFBM0IsRUFBbUMsQ0FBQyxFQUFwQyxFQUF3QztNQUN0QyxJQUFJLGNBQWMsR0FBRyxRQUFPLENBQUMsQ0FBRCxDQUE1Qjs7TUFDQSxJQUFJLGNBQWMsS0FBSyxNQUFuQixJQUE2QixjQUFjLENBQUMsWUFBZixDQUE0QixvQkFBb0IsSUFBaEQsQ0FBakMsRUFBd0Y7UUFDdEYsTUFBTSxDQUFDLGNBQUQsRUFBaUIsS0FBakIsQ0FBTjs7UUFDQSxJQUFJLFdBQVUsR0FBRyxJQUFJLEtBQUosQ0FBVSxxQkFBVixDQUFqQjs7UUFDQSxjQUFjLENBQUMsYUFBZixDQUE2QixXQUE3QjtNQUNEO0lBQ0Y7RUFDRjtBQUNGLENBdERBOztlQXdEYyxTOzs7O0FDdktmOzs7Ozs7O0FBQ0EsU0FBUyxLQUFULENBQWUsS0FBZixFQUFxQjtFQUNqQixLQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0g7O0FBRUQsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsWUFBVTtFQUM3QixJQUFJLEtBQUssR0FBRyxLQUFLLEtBQUwsQ0FBVyxzQkFBWCxDQUFrQyxhQUFsQyxDQUFaOztFQUNBLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBaUIsQ0FBcEIsRUFBc0I7SUFDbEIsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQW5DO0VBQ0g7QUFDSixDQUxEOztBQU9BLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFlBQVU7RUFDN0IsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUF5QixRQUF6QjtFQUNBLElBQUksU0FBUyxHQUFHLElBQUksS0FBSixDQUFVLGdCQUFWLENBQWhCO0VBQ0EsS0FBSyxLQUFMLENBQVcsYUFBWCxDQUF5QixTQUF6QjtBQUNILENBSkQ7O0FBTUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsWUFBVTtFQUM3QixLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLFFBQTVCO0VBRUEsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFKLENBQVUsZ0JBQVYsQ0FBaEI7RUFDQSxLQUFLLEtBQUwsQ0FBVyxhQUFYLENBQXlCLFNBQXpCO0FBQ0gsQ0FMRDs7ZUFPZSxLOzs7O0FDekJmOzs7Ozs7O0FBRUEsU0FBUyxTQUFULENBQW1CLFNBQW5CLEVBQTZCO0VBQ3pCLEtBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNIOztBQUVELFNBQVMsQ0FBQyxTQUFWLENBQW9CLElBQXBCLEdBQTJCLFlBQVc7RUFDbEMsSUFBSSxlQUFlLEdBQUcsS0FBSyxTQUEzQjtFQUVBLHFCQUFxQixDQUFDLGVBQUQsQ0FBckI7RUFFQSxJQUFNLFFBQVEsR0FBRyxJQUFJLGdCQUFKLENBQXNCLFVBQUEsSUFBSSxFQUFJO0lBQzNDLElBQU0sR0FBRyxHQUFHLElBQUksV0FBSixDQUFnQixhQUFoQixFQUErQjtNQUFDLE1BQU0sRUFBRTtJQUFULENBQS9CLENBQVo7SUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsR0FBNUI7RUFDSCxDQUhnQixDQUFqQixDQUxrQyxDQVVsQzs7RUFDQSxJQUFJLE1BQU0sR0FBRztJQUNULFVBQVUsRUFBYyxJQURmO0lBRVQsaUJBQWlCLEVBQU8sS0FGZjtJQUdULGFBQWEsRUFBVyxJQUhmO0lBSVQscUJBQXFCLEVBQUcsS0FKZjtJQUtULFNBQVMsRUFBZSxJQUxmO0lBTVQsT0FBTyxFQUFpQjtFQU5mLENBQWIsQ0FYa0MsQ0FvQmxDOztFQUNBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFFBQVEsQ0FBQyxJQUExQixFQUFnQyxNQUFoQztFQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsZ0JBQWQsQ0FBK0IsYUFBL0IsRUFBOEMsVUFBUyxDQUFULEVBQVk7SUFDdEQscUJBQXFCLENBQUMsZUFBRCxDQUFyQjtFQUNILENBRkQsRUF0QmtDLENBMEJsQzs7RUFDQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBUyxDQUFULEVBQVk7SUFDMUMscUJBQXFCLENBQUMsZUFBRCxDQUFyQjtFQUNILENBRkQsRUEzQmtDLENBK0JsQzs7RUFDQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBUyxDQUFULEVBQVk7SUFDMUMscUJBQXFCLENBQUMsZUFBRCxDQUFyQjtFQUNILENBRkQ7QUFHSCxDQW5DRDs7QUFxQ0EsU0FBUyxxQkFBVCxDQUErQixNQUEvQixFQUF1QztFQUNuQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBdkI7RUFDQSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBdkI7RUFDQSxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsT0FBTyxDQUFDLFlBQVIsSUFBd0IsQ0FBakMsRUFBb0MsTUFBTSxDQUFDLFdBQVAsSUFBc0IsQ0FBMUQsQ0FBdkI7RUFDQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQU8sQ0FBQyxZQUFqQixFQUErQixPQUFPLENBQUMsWUFBdkMsRUFBcUQsT0FBTyxDQUFDLHFCQUFSLEdBQWdDLE1BQXJGLEVBQ1csT0FBTyxDQUFDLFlBRG5CLEVBQ2lDLE9BQU8sQ0FBQyxZQUR6QyxFQUN1RCxPQUFPLENBQUMscUJBQVIsR0FBZ0MsTUFEdkYsRUFDK0YsT0FBTyxDQUFDLFlBRHZHLENBQW5CO0VBR0EsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBL0IsQ0FQbUMsQ0FPRDtFQUVsQzs7RUFDQSxJQUFJLEtBQUssR0FBRyxZQUFaLEVBQTBCO0lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQixRQUExQixDQUFMLEVBQTBDO01BQ3RDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLFFBQXJCO0lBQ0g7RUFDSixDQUpELENBS0E7RUFMQSxLQU1LO0lBQ0QsSUFBSSxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQixRQUExQixDQUFKLEVBQXlDO01BQ3JDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFFBQXhCO0lBQ0g7O0lBRUQsSUFBSSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsT0FBckM7SUFDQSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0MsQ0FBeEMsQ0FBYixDQU5DLENBTXdEO0lBRXpEOztJQUNBLElBQUksdUJBQXVCLElBQUksS0FBL0IsRUFBc0M7TUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFELENBQWhCLElBQTRCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLGVBQTFCLENBQWhDLEVBQTRFO1FBQ3hFLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGVBQXhCO01BQ0gsQ0FGRCxNQUdLLElBQUksZUFBZSxDQUFDLE1BQUQsQ0FBZixJQUEyQixDQUFDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLGVBQTFCLENBQWhDLEVBQTRFO1FBQzdFLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLGVBQXJCO01BQ0g7SUFDSixDQVBELENBUUE7SUFSQSxLQVNLO01BQ0QsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBZCxDQURDLENBQ3NEOztNQUV2RCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsWUFBUixLQUF5QixJQUF4QyxFQUE4QztRQUFBOztRQUMxQztRQUNBLElBQUksRUFBRSxxQkFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixzQkFBaEIsZ0dBQXlDLHNCQUF6QyxnRkFBaUUsWUFBakUsQ0FBOEUsZUFBOUUsT0FBbUcsTUFBbkcsSUFDTixzQkFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixzQkFBaEIsa0dBQXlDLHNCQUF6QyxnRkFBaUUsWUFBakUsTUFBa0YsSUFEOUUsQ0FBSixFQUN5RjtVQUVyRixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMscUJBQVIsRUFBWDs7VUFDQSxJQUFJLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7WUFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFELENBQWhCLElBQTRCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLGVBQTFCLENBQWhDLEVBQTRFO2NBQ3hFLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGVBQXhCO1lBQ0gsQ0FGRCxNQUdLLElBQUksZUFBZSxDQUFDLE1BQUQsQ0FBZixJQUEyQixDQUFDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLGVBQTFCLENBQWhDLEVBQTRFO2NBQzdFLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLGVBQXJCO1lBQ0g7VUFDSixDQVBELE1BUUs7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsZUFBMUIsQ0FBTCxFQUFpRDtjQUM3QyxNQUFNLENBQUMsU0FBUCxDQUFpQixHQUFqQixDQUFxQixlQUFyQjtZQUNIO1VBQ0o7UUFFSjtNQUNKLENBckJELENBc0JBO01BdEJBLEtBdUJLO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLGVBQTFCLENBQUwsRUFBaUQ7VUFDN0MsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUIsZUFBckI7UUFDSDtNQUNKO0lBQ0o7RUFDSjtBQUVKOztBQUVELFNBQVMsZUFBVCxDQUF5QixhQUF6QixFQUF3QztFQUNwQyxJQUFJLGFBQUosYUFBSSxhQUFKLGVBQUksYUFBYSxDQUFFLGFBQWYsQ0FBNkIsU0FBN0IsQ0FBSixFQUE2QztJQUN6QyxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsYUFBZCxDQUE0QixTQUE1QixFQUF1QyxxQkFBdkMsRUFBWCxDQUR5QyxDQUd6Qzs7SUFDQSxJQUFLLElBQUksQ0FBQyxHQUFMLEdBQVcsTUFBTSxDQUFDLFdBQWxCLElBQWlDLElBQUksQ0FBQyxHQUFMLEdBQVcsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsWUFBMUUsRUFBeUY7TUFDckYsT0FBTyxJQUFQO0lBQ0gsQ0FGRCxDQUdBO0lBSEEsS0FJSztNQUNELE9BQU8sS0FBUDtJQUNIO0VBQ0osQ0FYRCxNQVlLO0lBQ0QsT0FBTyxLQUFQO0VBQ0g7QUFDSjs7ZUFFYyxTOzs7O0FDbklmOzs7Ozs7QUFFQSxJQUFNLFVBQVUsR0FBRyxnQkFBbkI7QUFDQSxJQUFJLElBQUksR0FBRztFQUNQLHVCQUF1Qiw2QkFEaEI7RUFFUCx3QkFBd0IsNkJBRmpCO0VBR1Asc0JBQXNCLCtCQUhmO0VBSVAsdUJBQXVCO0FBSmhCLENBQVg7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNDLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEQ7RUFBQSxJQUFoQixPQUFnQix1RUFBTixJQUFNO0VBQ3ZELEtBQUssU0FBTCxHQUFpQixnQkFBakI7RUFDQSxLQUFLLEtBQUwsR0FBYSxnQkFBZ0IsQ0FBQyxzQkFBakIsQ0FBd0MsWUFBeEMsRUFBc0QsQ0FBdEQsQ0FBYjtFQUNBLEtBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLFVBQTVCLENBQWpCO0VBQ0EsS0FBSyxrQkFBTCxHQUEwQixJQUExQjtFQUNBLEtBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUEzQjtFQUNBLElBQUksR0FBRyxPQUFQO0FBQ0g7O0FBRUQsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsSUFBekIsR0FBZ0MsWUFBVztFQUN2QyxLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBckM7RUFDQSxLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBckM7RUFDQSxLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixNQUE1QixFQUFvQyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBcEM7O0VBRUEsSUFBSSxnQkFBZ0IsTUFBcEIsRUFBNEI7SUFDeEIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixJQUF6QixDQUFwQztFQUNILENBRkQsTUFHSztJQUNELE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQTVDO0VBQ0g7QUFDSixDQVhEOztBQWFBLGNBQWMsQ0FBQyxTQUFmLENBQXlCLGNBQXpCLEdBQTBDLFlBQVk7RUFDbEQsSUFBSSxjQUFjLEdBQUcsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixNQUF0QztFQUNBLE9BQU8sS0FBSyxTQUFMLEdBQWlCLGNBQXhCO0FBQ0gsQ0FIRDs7QUFLQSxTQUFTLHFCQUFULENBQWdDLGVBQWhDLEVBQWlEO0VBQzdDLElBQUksYUFBYSxHQUFHLEVBQXBCOztFQUVBLElBQUksZUFBZSxLQUFLLENBQUMsQ0FBekIsRUFBNEI7SUFDeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxlQUFULENBQWY7SUFDQSxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLFNBQWhDLEVBQTJDLFFBQTNDLENBQWhCO0VBQ0gsQ0FIRCxNQUlLLElBQUksZUFBZSxLQUFLLENBQXhCLEVBQTJCO0lBQzVCLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsT0FBekIsQ0FBaUMsU0FBakMsRUFBNEMsZUFBNUMsQ0FBaEI7RUFDSCxDQUZJLE1BR0EsSUFBSSxlQUFlLElBQUksQ0FBdkIsRUFBMEI7SUFDM0IsYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBTCxDQUEwQixPQUExQixDQUFrQyxTQUFsQyxFQUE2QyxlQUE3QyxDQUFoQjtFQUNILENBRkksTUFHQTtJQUNELElBQUksU0FBUSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsZUFBVCxDQUFmOztJQUNBLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsT0FBekIsQ0FBaUMsU0FBakMsRUFBNEMsU0FBNUMsQ0FBaEI7RUFDSDs7RUFFRCxPQUFPLGFBQVA7QUFDSDs7QUFFRCxjQUFjLENBQUMsU0FBZixDQUF5QixvQkFBekIsR0FBZ0QsWUFBWTtFQUN4RCxJQUFJLGVBQWUsR0FBRyxLQUFLLGNBQUwsRUFBdEI7RUFDQSxJQUFJLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxlQUFELENBQXpDO0VBQ0EsSUFBSSxlQUFlLEdBQUcsS0FBSyxTQUFMLENBQWUsc0JBQWYsQ0FBc0MsaUJBQXRDLEVBQXlELENBQXpELENBQXRCOztFQUVBLElBQUksZUFBZSxHQUFHLENBQXRCLEVBQXlCO0lBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsUUFBMUIsQ0FBbUMsZ0JBQW5DLENBQUwsRUFBMkQ7TUFDdkQsZUFBZSxDQUFDLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLGdCQUE5QjtJQUNIOztJQUNELElBQUksQ0FBQyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFFBQXJCLENBQThCLGtCQUE5QixDQUFMLEVBQXdEO01BQ3BELEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsa0JBQXpCO0lBQ0g7RUFDSixDQVBELE1BUUs7SUFDRCxJQUFJLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixRQUExQixDQUFtQyxnQkFBbkMsQ0FBSixFQUEwRDtNQUN0RCxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsTUFBMUIsQ0FBaUMsZ0JBQWpDO0lBQ0g7O0lBQ0QsSUFBSSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFFBQXJCLENBQThCLGtCQUE5QixDQUFKLEVBQXVEO01BQ25ELEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsa0JBQTVCO0lBQ0g7RUFDSjs7RUFFRCxlQUFlLENBQUMsU0FBaEIsR0FBNEIsYUFBNUI7QUFDSCxDQXZCRDs7QUF5QkEsY0FBYyxDQUFDLFNBQWYsQ0FBeUIseUJBQXpCLEdBQXFELFlBQVk7RUFDN0QsSUFBSSxlQUFlLEdBQUcsS0FBSyxjQUFMLEVBQXRCO0VBQ0EsSUFBSSxhQUFhLEdBQUcscUJBQXFCLENBQUMsZUFBRCxDQUF6QztFQUNBLElBQUksZUFBZSxHQUFHLEtBQUssU0FBTCxDQUFlLHNCQUFmLENBQXNDLHlCQUF0QyxFQUFpRSxDQUFqRSxDQUF0QjtFQUNBLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixhQUE1QjtBQUNILENBTEQ7O0FBT0EsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsd0JBQXpCLEdBQW9ELFlBQVk7RUFDNUQsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLEVBQXpCLEVBQTZCO0lBQ3pCLElBQUksVUFBVSxHQUFHLEtBQUssU0FBTCxDQUFlLHNCQUFmLENBQXNDLHlCQUF0QyxFQUFpRSxDQUFqRSxDQUFqQjtJQUNBLFVBQVUsQ0FBQyxTQUFYLEdBQXVCLEVBQXZCO0VBQ0g7QUFDSixDQUxEOztBQU9BLGNBQWMsQ0FBQyxTQUFmLENBQXlCLGNBQXpCLEdBQTBDLFVBQVUsQ0FBVixFQUFhO0VBQ25ELEtBQUssb0JBQUw7RUFDQSxLQUFLLHlCQUFMO0FBQ0gsQ0FIRDs7QUFLQSxjQUFjLENBQUMsU0FBZixDQUF5QixXQUF6QixHQUF1QyxVQUFVLENBQVYsRUFBYTtFQUNoRCxLQUFLLG9CQUFMO0VBQ0EsS0FBSyxrQkFBTCxHQUEwQixJQUFJLENBQUMsR0FBTCxFQUExQjtBQUNILENBSEQ7O0FBS0EsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsV0FBekIsR0FBdUMsVUFBVSxDQUFWLEVBQWE7RUFDaEQ7RUFDQTtFQUNBO0VBQ0EsS0FBSyx3QkFBTDtFQUVBLEtBQUssVUFBTCxHQUFrQixXQUFXLENBQUMsWUFBWTtJQUN0QztJQUNBO0lBQ0E7SUFDQSxJQUFJLENBQUMsS0FBSyxrQkFBTixJQUE2QixJQUFJLENBQUMsR0FBTCxLQUFhLEdBQWQsSUFBc0IsS0FBSyxrQkFBM0QsRUFBK0U7TUFDM0UsSUFBSSxVQUFVLEdBQUcsS0FBSyxTQUFMLENBQWUsc0JBQWYsQ0FBc0MseUJBQXRDLEVBQWlFLENBQWpFLEVBQW9FLFNBQXJGO01BQ0EsSUFBSSxlQUFlLEdBQUcsS0FBSyxTQUFMLENBQWUsc0JBQWYsQ0FBc0MsaUJBQXRDLEVBQXlELENBQXpELEVBQTRELFNBQWxGLENBRjJFLENBSTNFO01BQ0E7O01BQ0EsSUFBSSxLQUFLLFFBQUwsS0FBa0IsS0FBSyxLQUFMLENBQVcsS0FBN0IsSUFBc0MsVUFBVSxLQUFLLGVBQXpELEVBQTBFO1FBQ3RFLEtBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUEzQjtRQUNBLEtBQUssY0FBTDtNQUNIO0lBQ0o7RUFDRixDQWYyQixDQWUxQixJQWYwQixDQWVyQixJQWZxQixDQUFELEVBZWIsSUFmYSxDQUE3QjtBQWdCSCxDQXRCRDs7QUF3QkEsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsVUFBekIsR0FBc0MsVUFBVSxDQUFWLEVBQWE7RUFDL0MsYUFBYSxDQUFDLEtBQUssVUFBTixDQUFiLENBRCtDLENBRS9DOztFQUNBLElBQUksS0FBSyxRQUFMLEtBQWtCLEtBQUssS0FBTCxDQUFXLEtBQWpDLEVBQXdDO0lBQ3BDLEtBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUEzQjtJQUNBLEtBQUssY0FBTDtFQUNIO0FBQ0osQ0FQRDs7ZUFTZSxjOzs7O0FDakpmOzs7Ozs7O0FBQ0E7O0FBRUEsSUFBTSx1QkFBdUIsR0FBRyxvQkFBaEM7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFTLHFCQUFULENBQStCLGVBQS9CLEVBQStDO0VBQzNDLEtBQUssZUFBTCxHQUF1QixlQUF2QjtFQUNBLEtBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNIO0FBRUQ7QUFDQTtBQUNBOzs7QUFDQSxxQkFBcUIsQ0FBQyxTQUF0QixDQUFnQyxJQUFoQyxHQUF1QyxZQUFVO0VBQzdDLEtBQUssZUFBTCxDQUFxQixnQkFBckIsQ0FBc0MsUUFBdEMsRUFBZ0QsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFoRDtFQUNBLEtBQUssTUFBTDtBQUNILENBSEQ7QUFLQTtBQUNBO0FBQ0E7OztBQUNBLHFCQUFxQixDQUFDLFNBQXRCLENBQWdDLE1BQWhDLEdBQXlDLFlBQVU7RUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBZDtFQUNBLElBQUksVUFBVSxHQUFHLEtBQUssZUFBTCxDQUFxQixZQUFyQixDQUFrQyx1QkFBbEMsQ0FBakI7RUFDQSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixVQUF4QixDQUFmOztFQUNBLElBQUcsUUFBUSxLQUFLLElBQWIsSUFBcUIsUUFBUSxLQUFLLFNBQXJDLEVBQStDO0lBQzNDLE1BQU0sSUFBSSxLQUFKLENBQVUsNkRBQTRELHVCQUF0RSxDQUFOO0VBQ0g7O0VBQ0QsSUFBRyxLQUFLLGVBQUwsQ0FBcUIsT0FBeEIsRUFBZ0M7SUFDNUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxLQUFLLGVBQXBCLEVBQXFDLFFBQXJDO0VBQ0gsQ0FGRCxNQUVLO0lBQ0QsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBSyxlQUF0QixFQUF1QyxRQUF2QztFQUNIO0FBQ0osQ0FaRDtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLHFCQUFxQixDQUFDLFNBQXRCLENBQWdDLE1BQWhDLEdBQXlDLFVBQVMsZUFBVCxFQUEwQixjQUExQixFQUF5QztFQUM5RSxJQUFHLGVBQWUsS0FBSyxJQUFwQixJQUE0QixlQUFlLEtBQUssU0FBaEQsSUFBNkQsY0FBYyxLQUFLLElBQWhGLElBQXdGLGNBQWMsS0FBSyxTQUE5RyxFQUF3SDtJQUNwSCxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsb0JBQTdCLEVBQW1ELE1BQW5EO0lBQ0EsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsTUFBekIsQ0FBZ0MsV0FBaEM7SUFDQSxjQUFjLENBQUMsWUFBZixDQUE0QixhQUE1QixFQUEyQyxPQUEzQztJQUNBLElBQUksU0FBUyxHQUFHLElBQUksS0FBSixDQUFVLHVCQUFWLENBQWhCO0lBQ0EsZUFBZSxDQUFDLGFBQWhCLENBQThCLFNBQTlCO0VBQ0g7QUFDSixDQVJEO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EscUJBQXFCLENBQUMsU0FBdEIsQ0FBZ0MsUUFBaEMsR0FBMkMsVUFBUyxTQUFULEVBQW9CLFFBQXBCLEVBQTZCO0VBQ3BFLElBQUcsU0FBUyxLQUFLLElBQWQsSUFBc0IsU0FBUyxLQUFLLFNBQXBDLElBQWlELFFBQVEsS0FBSyxJQUE5RCxJQUFzRSxRQUFRLEtBQUssU0FBdEYsRUFBZ0c7SUFDNUYsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsb0JBQXZCLEVBQTZDLE9BQTdDO0lBQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7SUFDQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztJQUVBLElBQUksVUFBVSxHQUFHLElBQUksS0FBSixDQUFVLHdCQUFWLENBQWpCO0lBQ0EsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsVUFBeEI7RUFDSDtBQUNKLENBVEQ7O2VBV2UscUI7Ozs7OztBQ3RFZjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQXhCOztBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBRCxDQUF0Qjs7QUFDQSxlQUEyQixPQUFPLENBQUMsV0FBRCxDQUFsQztBQUFBLElBQWdCLE1BQWhCLFlBQVEsTUFBUjs7QUFDQSxnQkFBa0IsT0FBTyxDQUFDLFdBQUQsQ0FBekI7QUFBQSxJQUFRLEtBQVIsYUFBUSxLQUFSOztBQUNBLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUE3Qjs7QUFDQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsd0JBQUQsQ0FBM0I7O0FBRUEsSUFBTSxpQkFBaUIsZ0JBQXZCO0FBQ0EsSUFBTSx5QkFBeUIsYUFBTSxpQkFBTixjQUEvQjtBQUNBLElBQU0sNkJBQTZCLGFBQU0saUJBQU4sa0JBQW5DO0FBQ0EsSUFBTSx3QkFBd0IsYUFBTSxpQkFBTixhQUE5QjtBQUNBLElBQU0sZ0NBQWdDLGFBQU0saUJBQU4scUJBQXRDO0FBQ0EsSUFBTSxnQ0FBZ0MsYUFBTSxpQkFBTixxQkFBdEM7QUFDQSxJQUFNLHdCQUF3QixhQUFNLGlCQUFOLGFBQTlCO0FBQ0EsSUFBTSwwQkFBMEIsYUFBTSxpQkFBTixlQUFoQztBQUNBLElBQU0sd0JBQXdCLGFBQU0saUJBQU4sYUFBOUI7QUFDQSxJQUFNLHVCQUF1QixhQUFNLGlCQUFOLFlBQTdCO0FBQ0EsSUFBTSxtQkFBbUIsYUFBTSwwQkFBTixXQUF6QjtBQUVBLElBQU0sb0JBQW9CLG1CQUExQjtBQUNBLElBQU0sMEJBQTBCLGNBQU8sb0JBQVAsQ0FBaEM7QUFFQSxJQUFNLDJCQUEyQixhQUFNLG1CQUFOLGNBQWpDO0FBQ0EsSUFBTSw0QkFBNEIsYUFBTSxtQkFBTixlQUFsQztBQUNBLElBQU0sa0NBQWtDLGFBQU0sbUJBQU4scUJBQXhDO0FBQ0EsSUFBTSxpQ0FBaUMsYUFBTSxtQkFBTixvQkFBdkM7QUFDQSxJQUFNLDhCQUE4QixhQUFNLG1CQUFOLGlCQUFwQztBQUNBLElBQU0sOEJBQThCLGFBQU0sbUJBQU4saUJBQXBDO0FBQ0EsSUFBTSx5QkFBeUIsYUFBTSxtQkFBTixZQUEvQjtBQUNBLElBQU0sb0NBQW9DLGFBQU0sbUJBQU4sdUJBQTFDO0FBQ0EsSUFBTSxrQ0FBa0MsYUFBTSxtQkFBTixxQkFBeEM7QUFDQSxJQUFNLGdDQUFnQyxhQUFNLG1CQUFOLG1CQUF0QztBQUNBLElBQU0sNEJBQTRCLGFBQU0sMEJBQU4sb0JBQWxDO0FBQ0EsSUFBTSw2QkFBNkIsYUFBTSwwQkFBTixxQkFBbkM7QUFDQSxJQUFNLHdCQUF3QixhQUFNLDBCQUFOLGdCQUE5QjtBQUNBLElBQU0seUJBQXlCLGFBQU0sMEJBQU4saUJBQS9CO0FBQ0EsSUFBTSw4QkFBOEIsYUFBTSwwQkFBTixzQkFBcEM7QUFDQSxJQUFNLDZCQUE2QixhQUFNLDBCQUFOLHFCQUFuQztBQUNBLElBQU0sb0JBQW9CLGFBQU0sMEJBQU4sWUFBMUI7QUFDQSxJQUFNLDRCQUE0QixhQUFNLG9CQUFOLGNBQWxDO0FBQ0EsSUFBTSw2QkFBNkIsYUFBTSxvQkFBTixlQUFuQztBQUNBLElBQU0sbUJBQW1CLGFBQU0sMEJBQU4sV0FBekI7QUFDQSxJQUFNLDJCQUEyQixhQUFNLG1CQUFOLGNBQWpDO0FBQ0EsSUFBTSw0QkFBNEIsYUFBTSxtQkFBTixlQUFsQztBQUNBLElBQU0sa0NBQWtDLGFBQU0sMEJBQU4sMEJBQXhDO0FBQ0EsSUFBTSw4QkFBOEIsYUFBTSwwQkFBTixzQkFBcEM7QUFDQSxJQUFNLDBCQUEwQixhQUFNLDBCQUFOLGtCQUFoQztBQUNBLElBQU0sMkJBQTJCLGFBQU0sMEJBQU4sbUJBQWpDO0FBQ0EsSUFBTSwwQkFBMEIsYUFBTSwwQkFBTixrQkFBaEM7QUFDQSxJQUFNLG9CQUFvQixhQUFNLDBCQUFOLFlBQTFCO0FBQ0EsSUFBTSxrQkFBa0IsYUFBTSwwQkFBTixVQUF4QjtBQUNBLElBQU0sbUJBQW1CLGFBQU0sMEJBQU4sV0FBekI7QUFDQSxJQUFNLGdDQUFnQyxhQUFNLG1CQUFOLG1CQUF0QztBQUNBLElBQU0sMEJBQTBCLGFBQU0sMEJBQU4sa0JBQWhDO0FBQ0EsSUFBTSwwQkFBMEIsYUFBTSwwQkFBTixrQkFBaEM7QUFFQSxJQUFNLFdBQVcsY0FBTyxpQkFBUCxDQUFqQjtBQUNBLElBQU0sa0JBQWtCLGNBQU8sd0JBQVAsQ0FBeEI7QUFDQSxJQUFNLDBCQUEwQixjQUFPLGdDQUFQLENBQWhDO0FBQ0EsSUFBTSwwQkFBMEIsY0FBTyxnQ0FBUCxDQUFoQztBQUNBLElBQU0sb0JBQW9CLGNBQU8sMEJBQVAsQ0FBMUI7QUFDQSxJQUFNLGtCQUFrQixjQUFPLHdCQUFQLENBQXhCO0FBQ0EsSUFBTSxpQkFBaUIsY0FBTyx1QkFBUCxDQUF2QjtBQUNBLElBQU0sYUFBYSxjQUFPLG1CQUFQLENBQW5CO0FBQ0EsSUFBTSxxQkFBcUIsY0FBTywyQkFBUCxDQUEzQjtBQUNBLElBQU0sMkJBQTJCLGNBQU8saUNBQVAsQ0FBakM7QUFDQSxJQUFNLHNCQUFzQixjQUFPLDRCQUFQLENBQTVCO0FBQ0EsSUFBTSx1QkFBdUIsY0FBTyw2QkFBUCxDQUE3QjtBQUNBLElBQU0sa0JBQWtCLGNBQU8sd0JBQVAsQ0FBeEI7QUFDQSxJQUFNLG1CQUFtQixjQUFPLHlCQUFQLENBQXpCO0FBQ0EsSUFBTSx1QkFBdUIsY0FBTyw2QkFBUCxDQUE3QjtBQUNBLElBQU0sd0JBQXdCLGNBQU8sOEJBQVAsQ0FBOUI7QUFDQSxJQUFNLGNBQWMsY0FBTyxvQkFBUCxDQUFwQjtBQUNBLElBQU0sYUFBYSxjQUFPLG1CQUFQLENBQW5CO0FBQ0EsSUFBTSw0QkFBNEIsY0FBTyxrQ0FBUCxDQUFsQztBQUNBLElBQU0sd0JBQXdCLGNBQU8sOEJBQVAsQ0FBOUI7QUFDQSxJQUFNLG9CQUFvQixjQUFPLDBCQUFQLENBQTFCO0FBQ0EsSUFBTSxxQkFBcUIsY0FBTywyQkFBUCxDQUEzQjtBQUNBLElBQU0sb0JBQW9CLGNBQU8sMEJBQVAsQ0FBMUI7QUFDQSxJQUFNLHNCQUFzQixjQUFPLDRCQUFQLENBQTVCO0FBQ0EsSUFBTSxxQkFBcUIsY0FBTywyQkFBUCxDQUEzQjtBQUVBLElBQUksSUFBSSxHQUFHO0VBQ1QsaUJBQWlCLGNBRFI7RUFFVCxpQkFBaUIsY0FGUjtFQUdULHlCQUF5Qiw0RkFIaEI7RUFJVCx3QkFBd0Isd0VBSmY7RUFLVCx1QkFBdUIsK0VBTGQ7RUFNVCxtQkFBbUIsdUNBTlY7RUFPVCwyQkFBMkIsa0NBUGxCO0VBUVQsdUJBQXVCLHNCQVJkO0VBU1Qsc0JBQXNCLHNCQVRiO0VBVVQsaUJBQWlCLHVCQVZSO0VBV1Qsa0JBQWtCLDBCQVhUO0VBWVQsY0FBYyx1QkFaTDtFQWFULGFBQWEsb0JBYko7RUFjVCxnQkFBZ0IsWUFkUDtFQWVULGVBQWUsU0FmTjtFQWdCVCxrQkFBa0IsNEJBaEJUO0VBaUJULGNBQWMseUJBakJMO0VBa0JULFNBQVMsOFFBbEJBO0VBbUJULG9CQUFvQixlQW5CWDtFQW9CVCxtQkFBbUIseUNBcEJWO0VBcUJULFdBQVcsUUFyQkY7RUFzQlQsWUFBWSxTQXRCSDtFQXVCVCxTQUFTLE9BdkJBO0VBd0JULFNBQVMsT0F4QkE7RUF5QlQsT0FBTyxLQXpCRTtFQTBCVCxRQUFRLE1BMUJDO0VBMkJULFFBQVEsTUEzQkM7RUE0QlQsVUFBVSxRQTVCRDtFQTZCVCxhQUFhLFdBN0JKO0VBOEJULFdBQVcsU0E5QkY7RUErQlQsWUFBWSxVQS9CSDtFQWdDVCxZQUFZLFVBaENIO0VBaUNULFVBQVUsUUFqQ0Q7RUFrQ1QsV0FBVyxTQWxDRjtFQW1DVCxhQUFhLFFBbkNKO0VBb0NULFlBQVksU0FwQ0g7RUFxQ1QsVUFBVSxRQXJDRDtFQXNDVCxZQUFZLFFBdENIO0VBdUNULFVBQVU7QUF2Q0QsQ0FBWDtBQTBDQSxJQUFNLGtCQUFrQixHQUFHLGlDQUEzQjtBQUVBLElBQUksWUFBWSxHQUFHLENBQ2pCLElBQUksQ0FBQyxPQURZLEVBRWpCLElBQUksQ0FBQyxRQUZZLEVBR2pCLElBQUksQ0FBQyxLQUhZLEVBSWpCLElBQUksQ0FBQyxLQUpZLEVBS2pCLElBQUksQ0FBQyxHQUxZLEVBTWpCLElBQUksQ0FBQyxJQU5ZLEVBT2pCLElBQUksQ0FBQyxJQVBZLEVBUWpCLElBQUksQ0FBQyxNQVJZLEVBU2pCLElBQUksQ0FBQyxTQVRZLEVBVWpCLElBQUksQ0FBQyxPQVZZLEVBV2pCLElBQUksQ0FBQyxRQVhZLEVBWWpCLElBQUksQ0FBQyxRQVpZLENBQW5CO0FBZUEsSUFBSSxrQkFBa0IsR0FBRyxDQUN2QixJQUFJLENBQUMsTUFEa0IsRUFFdkIsSUFBSSxDQUFDLE9BRmtCLEVBR3ZCLElBQUksQ0FBQyxTQUhrQixFQUl2QixJQUFJLENBQUMsUUFKa0IsRUFLdkIsSUFBSSxDQUFDLE1BTGtCLEVBTXZCLElBQUksQ0FBQyxRQU5rQixFQU92QixJQUFJLENBQUMsTUFQa0IsQ0FBekI7QUFVQSxJQUFNLGFBQWEsR0FBRyxFQUF0QjtBQUVBLElBQU0sVUFBVSxHQUFHLEVBQW5CO0FBRUEsSUFBTSxnQkFBZ0IsR0FBRyxZQUF6QjtBQUNBLElBQU0sNEJBQTRCLEdBQUcsWUFBckM7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFlBQTdCO0FBRUEsSUFBTSxxQkFBcUIsR0FBRyxrQkFBOUI7O0FBRUEsSUFBTSx5QkFBeUIsR0FBRyxTQUE1Qix5QkFBNEI7RUFBQSxrQ0FBSSxTQUFKO0lBQUksU0FBSjtFQUFBOztFQUFBLE9BQ2hDLFNBQVMsQ0FBQyxHQUFWLENBQWMsVUFBQyxLQUFEO0lBQUEsT0FBVyxLQUFLLEdBQUcscUJBQW5CO0VBQUEsQ0FBZCxFQUF3RCxJQUF4RCxDQUE2RCxJQUE3RCxDQURnQztBQUFBLENBQWxDOztBQUdBLElBQU0scUJBQXFCLEdBQUcseUJBQXlCLENBQ3JELHNCQURxRCxFQUVyRCx1QkFGcUQsRUFHckQsdUJBSHFELEVBSXJELHdCQUpxRCxFQUtyRCxrQkFMcUQsRUFNckQsbUJBTnFELEVBT3JELHFCQVBxRCxDQUF2RDtBQVVBLElBQU0sc0JBQXNCLEdBQUcseUJBQXlCLENBQ3RELHNCQURzRCxDQUF4RDtBQUlBLElBQU0scUJBQXFCLEdBQUcseUJBQXlCLENBQ3JELDRCQURxRCxFQUVyRCx3QkFGcUQsRUFHckQscUJBSHFELENBQXZELEMsQ0FNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFzQixDQUFDLFdBQUQsRUFBYyxLQUFkLEVBQXdCO0VBQ2xELElBQUksS0FBSyxLQUFLLFdBQVcsQ0FBQyxRQUFaLEVBQWQsRUFBc0M7SUFDcEMsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBcEI7RUFDRDs7RUFFRCxPQUFPLFdBQVA7QUFDRCxDQU5EO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxJQUFkLEVBQXVCO0VBQ3JDLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLENBQVQsQ0FBaEI7RUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxJQUFqQztFQUNBLE9BQU8sT0FBUDtBQUNELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLEtBQUssR0FBRyxTQUFSLEtBQVEsR0FBTTtFQUNsQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosRUFBaEI7RUFDQSxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBUixFQUFaO0VBQ0EsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVIsRUFBZDtFQUNBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFSLEVBQWI7RUFDQSxPQUFPLE9BQU8sQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEdBQWQsQ0FBZDtBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFDLElBQUQsRUFBVTtFQUM3QixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxDQUFULENBQWhCO0VBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLFdBQUwsRUFBcEIsRUFBd0MsSUFBSSxDQUFDLFFBQUwsRUFBeEMsRUFBeUQsQ0FBekQ7RUFDQSxPQUFPLE9BQVA7QUFDRCxDQUpEO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFpQixDQUFDLElBQUQsRUFBVTtFQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxDQUFULENBQWhCO0VBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLFdBQUwsRUFBcEIsRUFBd0MsSUFBSSxDQUFDLFFBQUwsS0FBa0IsQ0FBMUQsRUFBNkQsQ0FBN0Q7RUFDQSxPQUFPLE9BQVA7QUFDRCxDQUpEO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0VBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLEtBQUssQ0FBQyxPQUFOLEVBQVQsQ0FBaEI7RUFDQSxPQUFPLENBQUMsT0FBUixDQUFnQixPQUFPLENBQUMsT0FBUixLQUFvQixPQUFwQztFQUNBLE9BQU8sT0FBUDtBQUNELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsS0FBRCxFQUFRLE9BQVI7RUFBQSxPQUFvQixPQUFPLENBQUMsS0FBRCxFQUFRLENBQUMsT0FBVCxDQUEzQjtBQUFBLENBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxRQUFSO0VBQUEsT0FBcUIsT0FBTyxDQUFDLEtBQUQsRUFBUSxRQUFRLEdBQUcsQ0FBbkIsQ0FBNUI7QUFBQSxDQUFqQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxLQUFELEVBQVEsUUFBUjtFQUFBLE9BQXFCLFFBQVEsQ0FBQyxLQUFELEVBQVEsQ0FBQyxRQUFULENBQTdCO0FBQUEsQ0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBVztFQUM3QixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTixLQUFlLENBQS9COztFQUNBLElBQUcsU0FBUyxLQUFLLENBQUMsQ0FBbEIsRUFBb0I7SUFDbEIsU0FBUyxHQUFHLENBQVo7RUFDRDs7RUFDRCxPQUFPLE9BQU8sQ0FBQyxLQUFELEVBQVEsU0FBUixDQUFkO0FBQ0QsQ0FORDtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVc7RUFDM0IsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU4sRUFBbEI7O0VBQ0EsT0FBTyxPQUFPLENBQUMsS0FBRCxFQUFRLElBQUksU0FBWixDQUFkO0FBQ0QsQ0FIRDtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVEsU0FBUixFQUFzQjtFQUN0QyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxLQUFLLENBQUMsT0FBTixFQUFULENBQWhCO0VBRUEsSUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUixLQUFxQixFQUFyQixHQUEwQixTQUEzQixJQUF3QyxFQUExRDtFQUNBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLE9BQU8sQ0FBQyxRQUFSLEtBQXFCLFNBQXRDO0VBQ0EsbUJBQW1CLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FBbkI7RUFFQSxPQUFPLE9BQVA7QUFDRCxDQVJEO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBUSxTQUFSO0VBQUEsT0FBc0IsU0FBUyxDQUFDLEtBQUQsRUFBUSxDQUFDLFNBQVQsQ0FBL0I7QUFBQSxDQUFsQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxLQUFELEVBQVEsUUFBUjtFQUFBLE9BQXFCLFNBQVMsQ0FBQyxLQUFELEVBQVEsUUFBUSxHQUFHLEVBQW5CLENBQTlCO0FBQUEsQ0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFXLENBQUMsS0FBRCxFQUFRLFFBQVI7RUFBQSxPQUFxQixRQUFRLENBQUMsS0FBRCxFQUFRLENBQUMsUUFBVCxDQUE3QjtBQUFBLENBQWpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0VBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLEtBQUssQ0FBQyxPQUFOLEVBQVQsQ0FBaEI7RUFFQSxPQUFPLENBQUMsUUFBUixDQUFpQixLQUFqQjtFQUNBLG1CQUFtQixDQUFDLE9BQUQsRUFBVSxLQUFWLENBQW5CO0VBRUEsT0FBTyxPQUFQO0FBQ0QsQ0FQRDtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQVUsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtFQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxLQUFLLENBQUMsT0FBTixFQUFULENBQWhCO0VBRUEsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVIsRUFBZDtFQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQXBCO0VBQ0EsbUJBQW1CLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBbkI7RUFFQSxPQUFPLE9BQVA7QUFDRCxDQVJEO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBTSxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0VBQzVCLElBQUksT0FBTyxHQUFHLEtBQWQ7O0VBRUEsSUFBSSxLQUFLLEdBQUcsS0FBWixFQUFtQjtJQUNqQixPQUFPLEdBQUcsS0FBVjtFQUNEOztFQUVELE9BQU8sSUFBSSxJQUFKLENBQVMsT0FBTyxDQUFDLE9BQVIsRUFBVCxDQUFQO0FBQ0QsQ0FSRDtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLEdBQUcsR0FBRyxTQUFOLEdBQU0sQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFrQjtFQUM1QixJQUFJLE9BQU8sR0FBRyxLQUFkOztFQUVBLElBQUksS0FBSyxHQUFHLEtBQVosRUFBbUI7SUFDakIsT0FBTyxHQUFHLEtBQVY7RUFDRDs7RUFFRCxPQUFPLElBQUksSUFBSixDQUFTLE9BQU8sQ0FBQyxPQUFSLEVBQVQsQ0FBUDtBQUNELENBUkQ7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7RUFDbkMsT0FBTyxLQUFLLElBQUksS0FBVCxJQUFrQixLQUFLLENBQUMsV0FBTixPQUF3QixLQUFLLENBQUMsV0FBTixFQUFqRDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7RUFDcEMsT0FBTyxVQUFVLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBVixJQUE0QixLQUFLLENBQUMsUUFBTixPQUFxQixLQUFLLENBQUMsUUFBTixFQUF4RDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7RUFDbEMsT0FBTyxXQUFXLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBWCxJQUE2QixLQUFLLENBQUMsT0FBTixPQUFvQixLQUFLLENBQUMsT0FBTixFQUF4RDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLEVBQTRCO0VBQzNELElBQUksT0FBTyxHQUFHLElBQWQ7O0VBRUEsSUFBSSxJQUFJLEdBQUcsT0FBWCxFQUFvQjtJQUNsQixPQUFPLEdBQUcsT0FBVjtFQUNELENBRkQsTUFFTyxJQUFJLE9BQU8sSUFBSSxJQUFJLEdBQUcsT0FBdEIsRUFBK0I7SUFDcEMsT0FBTyxHQUFHLE9BQVY7RUFDRDs7RUFFRCxPQUFPLElBQUksSUFBSixDQUFTLE9BQU8sQ0FBQyxPQUFSLEVBQVQsQ0FBUDtBQUNELENBVkQ7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCO0VBQUEsT0FDNUIsSUFBSSxJQUFJLE9BQVIsS0FBb0IsQ0FBQyxPQUFELElBQVksSUFBSSxJQUFJLE9BQXhDLENBRDRCO0FBQUEsQ0FBOUI7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLDJCQUEyQixHQUFHLFNBQTlCLDJCQUE4QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLEVBQTRCO0VBQzlELE9BQ0UsY0FBYyxDQUFDLElBQUQsQ0FBZCxHQUF1QixPQUF2QixJQUFtQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQUQsQ0FBWixHQUFxQixPQURyRTtBQUdELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLDBCQUEwQixHQUFHLFNBQTdCLDBCQUE2QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLEVBQTRCO0VBQzdELE9BQ0UsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFULENBQWQsR0FBcUMsT0FBckMsSUFDQyxPQUFPLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFULENBQVosR0FBa0MsT0FGaEQ7QUFJRCxDQUxEO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBa0IsQ0FDdEIsVUFEc0IsRUFJbkI7RUFBQSxJQUZILFVBRUcsdUVBRlUsb0JBRVY7RUFBQSxJQURILFVBQ0csdUVBRFUsS0FDVjtFQUNILElBQUksSUFBSjtFQUNBLElBQUksS0FBSjtFQUNBLElBQUksR0FBSjtFQUNBLElBQUksSUFBSjtFQUNBLElBQUksTUFBSjs7RUFFQSxJQUFJLFVBQUosRUFBZ0I7SUFDZCxJQUFJLFFBQUosRUFBYyxNQUFkLEVBQXNCLE9BQXRCOztJQUNBLElBQUksVUFBVSxLQUFLLDRCQUFuQixFQUFpRDtNQUFBLHdCQUNqQixVQUFVLENBQUMsS0FBWCxDQUFpQixHQUFqQixDQURpQjs7TUFBQTs7TUFDOUMsTUFEOEM7TUFDdEMsUUFEc0M7TUFDNUIsT0FENEI7SUFFaEQsQ0FGRCxNQUVPO01BQUEseUJBQ3lCLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBRHpCOztNQUFBOztNQUNKLE9BREk7TUFDSyxRQURMO01BQ2UsTUFEZjtJQUVOOztJQUVELElBQUksT0FBSixFQUFhO01BQ1gsTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFELEVBQVUsRUFBVixDQUFqQjs7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLENBQUwsRUFBMkI7UUFDekIsSUFBSSxHQUFHLE1BQVA7O1FBQ0EsSUFBSSxVQUFKLEVBQWdCO1VBQ2QsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQVosQ0FBUDs7VUFDQSxJQUFJLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXJCLEVBQXdCO1lBQ3RCLElBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxXQUFSLEVBQXBCO1lBQ0EsSUFBTSxlQUFlLEdBQ25CLFdBQVcsR0FBSSxXQUFXLFlBQUcsRUFBSCxFQUFTLE9BQU8sQ0FBQyxNQUFqQixDQUQ1QjtZQUVBLElBQUksR0FBRyxlQUFlLEdBQUcsTUFBekI7VUFDRDtRQUNGO01BQ0Y7SUFDRjs7SUFFRCxJQUFJLFFBQUosRUFBYztNQUNaLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBRCxFQUFXLEVBQVgsQ0FBakI7O01BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixDQUFMLEVBQTJCO1FBQ3pCLEtBQUssR0FBRyxNQUFSOztRQUNBLElBQUksVUFBSixFQUFnQjtVQUNkLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFaLENBQVI7VUFDQSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsS0FBYixDQUFSO1FBQ0Q7TUFDRjtJQUNGOztJQUVELElBQUksS0FBSyxJQUFJLE1BQVQsSUFBbUIsSUFBSSxJQUFJLElBQS9CLEVBQXFDO01BQ25DLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FBakI7O01BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixDQUFMLEVBQTJCO1FBQ3pCLEdBQUcsR0FBRyxNQUFOOztRQUNBLElBQUksVUFBSixFQUFnQjtVQUNkLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsQ0FBZCxDQUFQLENBQXdCLE9BQXhCLEVBQTFCO1VBQ0EsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBTjtVQUNBLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLGlCQUFULEVBQTRCLEdBQTVCLENBQU47UUFDRDtNQUNGO0lBQ0Y7O0lBRUQsSUFBSSxLQUFLLElBQUksR0FBVCxJQUFnQixJQUFJLElBQUksSUFBNUIsRUFBa0M7TUFDaEMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFELEVBQU8sS0FBSyxHQUFHLENBQWYsRUFBa0IsR0FBbEIsQ0FBZDtJQUNEO0VBQ0Y7O0VBRUQsT0FBTyxJQUFQO0FBQ0QsQ0FoRUQ7QUFrRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLElBQUQsRUFBNkM7RUFBQSxJQUF0QyxVQUFzQyx1RUFBekIsb0JBQXlCOztFQUM5RCxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtJQUNsQyxPQUFPLGNBQU8sS0FBUCxFQUFlLEtBQWYsQ0FBcUIsQ0FBQyxNQUF0QixDQUFQO0VBQ0QsQ0FGRDs7RUFJQSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBTCxLQUFrQixDQUFoQztFQUNBLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFMLEVBQVo7RUFDQSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBTCxFQUFiOztFQUVBLElBQUksVUFBVSxLQUFLLDRCQUFuQixFQUFpRDtJQUMvQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUQsRUFBTSxDQUFOLENBQVQsRUFBbUIsUUFBUSxDQUFDLEtBQUQsRUFBUSxDQUFSLENBQTNCLEVBQXVDLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUEvQyxFQUEwRCxJQUExRCxDQUErRCxHQUEvRCxDQUFQO0VBQ0Q7O0VBRUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFULEVBQW9CLFFBQVEsQ0FBQyxLQUFELEVBQVEsQ0FBUixDQUE1QixFQUF3QyxRQUFRLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBaEQsRUFBMEQsSUFBMUQsQ0FBK0QsR0FBL0QsQ0FBUDtBQUNELENBZEQsQyxDQWdCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBaUIsQ0FBQyxTQUFELEVBQVksT0FBWixFQUF3QjtFQUM3QyxJQUFNLElBQUksR0FBRyxFQUFiO0VBQ0EsSUFBSSxHQUFHLEdBQUcsRUFBVjtFQUVBLElBQUksQ0FBQyxHQUFHLENBQVI7O0VBQ0EsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQXJCLEVBQTZCO0lBQzNCLEdBQUcsR0FBRyxFQUFOOztJQUNBLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFkLElBQXdCLEdBQUcsQ0FBQyxNQUFKLEdBQWEsT0FBNUMsRUFBcUQ7TUFDbkQsR0FBRyxDQUFDLElBQUosZUFBZ0IsU0FBUyxDQUFDLENBQUQsQ0FBekI7TUFDQSxDQUFDLElBQUksQ0FBTDtJQUNEOztJQUNELElBQUksQ0FBQyxJQUFMLGVBQWlCLEdBQUcsQ0FBQyxJQUFKLENBQVMsRUFBVCxDQUFqQjtFQUNEOztFQUVELE9BQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFWLENBQVA7QUFDRCxDQWZEO0FBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBcUIsQ0FBQyxFQUFELEVBQW9CO0VBQUEsSUFBZixLQUFlLHVFQUFQLEVBQU87RUFDN0MsSUFBTSxlQUFlLEdBQUcsRUFBeEI7RUFDQSxlQUFlLENBQUMsS0FBaEIsR0FBd0IsS0FBeEI7RUFHQSxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUosQ0FBVSxRQUFWLENBQVo7RUFDQSxlQUFlLENBQUMsYUFBaEIsQ0FBOEIsS0FBOUI7QUFDRCxDQVBEO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUF1QixDQUFDLEVBQUQsRUFBUTtFQUNuQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsT0FBSCxDQUFXLFdBQVgsQ0FBckI7O0VBRUEsSUFBSSxDQUFDLFlBQUwsRUFBbUI7SUFDakIsTUFBTSxJQUFJLEtBQUosb0NBQXNDLFdBQXRDLEVBQU47RUFDRDs7RUFFRCxJQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsYUFBYixDQUN0QiwwQkFEc0IsQ0FBeEI7RUFHQSxJQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsYUFBYixDQUN0QiwwQkFEc0IsQ0FBeEI7RUFHQSxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsYUFBYixDQUEyQixvQkFBM0IsQ0FBbkI7RUFDQSxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsYUFBYixDQUEyQixrQkFBM0IsQ0FBcEI7RUFDQSxJQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsYUFBYixDQUEyQixrQkFBM0IsQ0FBakI7RUFDQSxJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYixDQUEyQixpQkFBM0IsQ0FBaEI7RUFDQSxJQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxhQUFiLENBQTJCLGFBQTNCLENBQXpCO0VBQ0EsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsMEJBQTNCLENBQWpCO0VBRUEsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUMvQixlQUFlLENBQUMsS0FEZSxFQUUvQiw0QkFGK0IsRUFHL0IsSUFIK0IsQ0FBakM7RUFLQSxJQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQWpCLENBQXBDO0VBRUEsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEtBQXBCLENBQXBDO0VBQ0EsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXRCLENBQS9CO0VBQ0EsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXRCLENBQS9CO0VBQ0EsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFiLENBQXFCLFNBQXRCLENBQWpDO0VBQ0EsSUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFiLENBQXFCLFdBQXRCLENBQW5DOztFQUVBLElBQUksT0FBTyxJQUFJLE9BQVgsSUFBc0IsT0FBTyxHQUFHLE9BQXBDLEVBQTZDO0lBQzNDLE1BQU0sSUFBSSxLQUFKLENBQVUsMkNBQVYsQ0FBTjtFQUNEOztFQUVELE9BQU87SUFDTCxZQUFZLEVBQVosWUFESztJQUVMLE9BQU8sRUFBUCxPQUZLO0lBR0wsV0FBVyxFQUFYLFdBSEs7SUFJTCxRQUFRLEVBQVIsUUFKSztJQUtMLFlBQVksRUFBWixZQUxLO0lBTUwsT0FBTyxFQUFQLE9BTks7SUFPTCxnQkFBZ0IsRUFBaEIsZ0JBUEs7SUFRTCxZQUFZLEVBQVosWUFSSztJQVNMLFNBQVMsRUFBVCxTQVRLO0lBVUwsZUFBZSxFQUFmLGVBVks7SUFXTCxlQUFlLEVBQWYsZUFYSztJQVlMLFVBQVUsRUFBVixVQVpLO0lBYUwsU0FBUyxFQUFULFNBYks7SUFjTCxXQUFXLEVBQVgsV0FkSztJQWVMLFFBQVEsRUFBUixRQWZLO0lBZ0JMLE9BQU8sRUFBUDtFQWhCSyxDQUFQO0FBa0JELENBdkREO0FBeURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLEVBQUQsRUFBUTtFQUN0Qiw0QkFBeUMsb0JBQW9CLENBQUMsRUFBRCxDQUE3RDtFQUFBLElBQVEsZUFBUix5QkFBUSxlQUFSO0VBQUEsSUFBeUIsV0FBekIseUJBQXlCLFdBQXpCOztFQUVBLFdBQVcsQ0FBQyxRQUFaLEdBQXVCLElBQXZCO0VBQ0EsZUFBZSxDQUFDLFFBQWhCLEdBQTJCLElBQTNCO0FBQ0QsQ0FMRDtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBUyxDQUFDLEVBQUQsRUFBUTtFQUNyQiw2QkFBeUMsb0JBQW9CLENBQUMsRUFBRCxDQUE3RDtFQUFBLElBQVEsZUFBUiwwQkFBUSxlQUFSO0VBQUEsSUFBeUIsV0FBekIsMEJBQXlCLFdBQXpCOztFQUVBLFdBQVcsQ0FBQyxRQUFaLEdBQXVCLEtBQXZCO0VBQ0EsZUFBZSxDQUFDLFFBQWhCLEdBQTJCLEtBQTNCO0FBQ0QsQ0FMRCxDLENBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBcUIsQ0FBQyxFQUFELEVBQVE7RUFDakMsNkJBQThDLG9CQUFvQixDQUFDLEVBQUQsQ0FBbEU7RUFBQSxJQUFRLGVBQVIsMEJBQVEsZUFBUjtFQUFBLElBQXlCLE9BQXpCLDBCQUF5QixPQUF6QjtFQUFBLElBQWtDLE9BQWxDLDBCQUFrQyxPQUFsQzs7RUFFQSxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsS0FBbkM7RUFDQSxJQUFJLFNBQVMsR0FBRyxLQUFoQjs7RUFFQSxJQUFJLFVBQUosRUFBZ0I7SUFDZCxTQUFTLEdBQUcsSUFBWjtJQUVBLElBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQXhCOztJQUNBLDJCQUEyQixlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBQyxHQUFELEVBQVM7TUFDdEQsSUFBSSxLQUFKO01BQ0EsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUQsRUFBTSxFQUFOLENBQXZCO01BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixDQUFMLEVBQTJCLEtBQUssR0FBRyxNQUFSO01BQzNCLE9BQU8sS0FBUDtJQUNELENBTDBCLENBQTNCO0lBQUE7SUFBQSxJQUFPLEdBQVA7SUFBQSxJQUFZLEtBQVo7SUFBQSxJQUFtQixJQUFuQjs7SUFPQSxJQUFJLEtBQUssSUFBSSxHQUFULElBQWdCLElBQUksSUFBSSxJQUE1QixFQUFrQztNQUNoQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBRCxFQUFPLEtBQUssR0FBRyxDQUFmLEVBQWtCLEdBQWxCLENBQXpCOztNQUVBLElBQ0UsU0FBUyxDQUFDLFFBQVYsT0FBeUIsS0FBSyxHQUFHLENBQWpDLElBQ0EsU0FBUyxDQUFDLE9BQVYsT0FBd0IsR0FEeEIsSUFFQSxTQUFTLENBQUMsV0FBVixPQUE0QixJQUY1QixJQUdBLGVBQWUsQ0FBQyxDQUFELENBQWYsQ0FBbUIsTUFBbkIsS0FBOEIsQ0FIOUIsSUFJQSxxQkFBcUIsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQUx2QixFQU1FO1FBQ0EsU0FBUyxHQUFHLEtBQVo7TUFDRDtJQUNGO0VBQ0Y7O0VBRUQsT0FBTyxTQUFQO0FBQ0QsQ0FqQ0Q7QUFtQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBb0IsQ0FBQyxFQUFELEVBQVE7RUFDaEMsNkJBQTRCLG9CQUFvQixDQUFDLEVBQUQsQ0FBaEQ7RUFBQSxJQUFRLGVBQVIsMEJBQVEsZUFBUjs7RUFDQSxJQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxlQUFELENBQXBDOztFQUVBLElBQUksU0FBUyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFsQyxFQUFxRDtJQUNuRCxlQUFlLENBQUMsaUJBQWhCLENBQWtDLGtCQUFsQztFQUNEOztFQUVELElBQUksQ0FBQyxTQUFELElBQWMsZUFBZSxDQUFDLGlCQUFoQixLQUFzQyxrQkFBeEQsRUFBNEU7SUFDMUUsZUFBZSxDQUFDLGlCQUFoQixDQUFrQyxFQUFsQztFQUNEO0FBQ0YsQ0FYRCxDLENBYUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQVE7RUFDbkMsNkJBQXVDLG9CQUFvQixDQUFDLEVBQUQsQ0FBM0Q7RUFBQSxJQUFRLGVBQVIsMEJBQVEsZUFBUjtFQUFBLElBQXlCLFNBQXpCLDBCQUF5QixTQUF6Qjs7RUFDQSxJQUFJLFFBQVEsR0FBRyxFQUFmOztFQUVBLElBQUksU0FBUyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRCxDQUFwQyxFQUEwQztJQUN4QyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQUQsQ0FBckI7RUFDRDs7RUFFRCxJQUFJLGVBQWUsQ0FBQyxLQUFoQixLQUEwQixRQUE5QixFQUF3QztJQUN0QyxrQkFBa0IsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLENBQWxCO0VBQ0Q7QUFDRixDQVhEO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFtQixDQUFDLEVBQUQsRUFBSyxVQUFMLEVBQW9CO0VBQzNDLElBQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFELENBQWxDOztFQUVBLElBQUksVUFBSixFQUFnQjtJQUNkLElBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxVQUFELEVBQWEsNEJBQWIsQ0FBaEM7O0lBRUEsNkJBSUksb0JBQW9CLENBQUMsRUFBRCxDQUp4QjtJQUFBLElBQ0UsWUFERiwwQkFDRSxZQURGO0lBQUEsSUFFRSxlQUZGLDBCQUVFLGVBRkY7SUFBQSxJQUdFLGVBSEYsMEJBR0UsZUFIRjs7SUFNQSxrQkFBa0IsQ0FBQyxlQUFELEVBQWtCLFVBQWxCLENBQWxCO0lBQ0Esa0JBQWtCLENBQUMsZUFBRCxFQUFrQixhQUFsQixDQUFsQjtJQUVBLGlCQUFpQixDQUFDLFlBQUQsQ0FBakI7RUFDRDtBQUNGLENBakJEO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0saUJBQWlCLEdBQUcsU0FBcEIsaUJBQW9CLENBQUMsRUFBRCxFQUFRO0VBQ2hDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxPQUFILENBQVcsV0FBWCxDQUFyQjtFQUNBLElBQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFiLENBQXFCLFlBQTFDO0VBRUEsSUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLGFBQWIsU0FBeEI7O0VBRUEsSUFBSSxDQUFDLGVBQUwsRUFBc0I7SUFDcEIsTUFBTSxJQUFJLEtBQUosV0FBYSxXQUFiLDZCQUFOO0VBQ0Q7O0VBR0QsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUM3QixZQUFZLENBQUMsT0FBYixDQUFxQixPQUFyQixJQUFnQyxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsS0FBN0IsQ0FESCxDQUEvQjtFQUdBLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXJCLEdBQStCLE9BQU8sR0FDbEMsVUFBVSxDQUFDLE9BQUQsQ0FEd0IsR0FFbEMsZ0JBRko7RUFJQSxJQUFNLE9BQU8sR0FBRyxlQUFlLENBQzdCLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXJCLElBQWdDLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixLQUE3QixDQURILENBQS9COztFQUdBLElBQUksT0FBSixFQUFhO0lBQ1gsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsT0FBckIsR0FBK0IsVUFBVSxDQUFDLE9BQUQsQ0FBekM7RUFDRDs7RUFFRCxJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUF4QjtFQUNBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixHQUExQixDQUE4Qix5QkFBOUI7RUFDQSxlQUFlLENBQUMsUUFBaEIsR0FBMkIsSUFBM0I7RUFFQSxJQUFNLGVBQWUsR0FBRyxlQUFlLENBQUMsU0FBaEIsRUFBeEI7RUFDQSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsR0FBMUIsQ0FBOEIsZ0NBQTlCO0VBQ0EsZUFBZSxDQUFDLElBQWhCLEdBQXVCLE1BQXZCO0VBQ0EsZUFBZSxDQUFDLElBQWhCLEdBQXVCLEVBQXZCO0VBRUEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQXZCO0VBQ0EsSUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFNBQVosSUFBeUIsT0FBTyxLQUFLLEVBQXhEO0VBQ0EsSUFBTSxnQkFBZ0IsR0FBSSxPQUFPLEtBQUssU0FBWixJQUF5QixPQUFPLEtBQUssRUFBckMsSUFBMkMsZUFBZSxDQUFDLGdCQUFELENBQWYsQ0FBa0MsT0FBbEMsT0FBZ0QsT0FBTyxDQUFDLE9BQVIsRUFBckg7RUFDQSxJQUFNLFVBQVUsR0FBRyxPQUFPLEtBQUssU0FBWixJQUF5QixPQUFPLEtBQUssRUFBeEQ7O0VBRUEsSUFBSSxVQUFVLElBQUksQ0FBQyxnQkFBZixJQUFtQyxVQUF2QyxFQUFtRDtJQUNqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBUixFQUFmO0lBQ0EsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVIsRUFBakI7SUFDQSxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBRCxDQUFoQztJQUNBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFSLEVBQWhCO0lBQ0EsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQVIsRUFBZjtJQUNBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFSLEVBQWpCO0lBQ0EsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQUQsQ0FBaEM7SUFDQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBUixFQUFoQjtJQUNBLFdBQVcsR0FBRyxJQUFJLENBQUMscUJBQUwsQ0FBMkIsT0FBM0IsQ0FBbUMsVUFBbkMsRUFBK0MsTUFBL0MsRUFBdUQsT0FBdkQsQ0FBK0QsZUFBL0QsRUFBZ0YsV0FBaEYsRUFBNkYsT0FBN0YsQ0FBcUcsV0FBckcsRUFBa0gsT0FBbEgsRUFBMkgsT0FBM0gsQ0FBbUksVUFBbkksRUFBK0ksTUFBL0ksRUFBdUosT0FBdkosQ0FBK0osZUFBL0osRUFBZ0wsV0FBaEwsRUFBNkwsT0FBN0wsQ0FBcU0sV0FBck0sRUFBa04sT0FBbE4sQ0FBZDtFQUNELENBVkQsTUFXSyxJQUFJLFVBQVUsSUFBSSxDQUFDLGdCQUFmLElBQW1DLENBQUMsVUFBeEMsRUFBb0Q7SUFDdkQsSUFBTSxPQUFNLEdBQUcsT0FBTyxDQUFDLE9BQVIsRUFBZjs7SUFDQSxJQUFNLFNBQVEsR0FBRyxPQUFPLENBQUMsUUFBUixFQUFqQjs7SUFDQSxJQUFNLFlBQVcsR0FBRyxZQUFZLENBQUMsU0FBRCxDQUFoQzs7SUFDQSxJQUFNLFFBQU8sR0FBRyxPQUFPLENBQUMsV0FBUixFQUFoQjs7SUFDQSxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFMLENBQXlCLE9BQXpCLENBQWlDLFVBQWpDLEVBQTZDLE9BQTdDLEVBQXFELE9BQXJELENBQTZELGVBQTdELEVBQThFLFlBQTlFLEVBQTJGLE9BQTNGLENBQW1HLFdBQW5HLEVBQWdILFFBQWhILENBQWQ7RUFDRCxDQU5JLE1BT0EsSUFBSSxVQUFKLEVBQWdCO0lBQ25CLElBQU0sT0FBTSxHQUFHLE9BQU8sQ0FBQyxPQUFSLEVBQWY7O0lBQ0EsSUFBTSxTQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVIsRUFBakI7O0lBQ0EsSUFBTSxZQUFXLEdBQUcsWUFBWSxDQUFDLFNBQUQsQ0FBaEM7O0lBQ0EsSUFBTSxRQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVIsRUFBaEI7O0lBQ0EsV0FBVyxHQUFHLElBQUksQ0FBQyxvQkFBTCxDQUEwQixPQUExQixDQUFrQyxVQUFsQyxFQUE4QyxPQUE5QyxFQUFzRCxPQUF0RCxDQUE4RCxlQUE5RCxFQUErRSxZQUEvRSxFQUE0RixPQUE1RixDQUFvRyxXQUFwRyxFQUFpSCxRQUFqSCxDQUFkO0VBQ0Q7O0VBRUQsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFlBQWhCLENBQTZCLElBQTdCLElBQXFDLFFBQXJEO0VBRUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGVBQTVCO0VBQ0EsZUFBZSxDQUFDLGtCQUFoQixDQUNFLFdBREYsRUFFRSwyQ0FDa0Msd0JBRGxDLG9EQUNnRyxJQUFJLENBQUMsYUFEckcsZ0RBRWlCLG9CQUZqQixpRUFFc0YsV0FGdEYsbUNBRXdILE9BRnhILDhEQUUrSywwQkFGL0ssa0VBR3lCLHdCQUh6QixvRkFJeUIsdUJBSnpCLHFCQUl5RCxPQUp6RCx1QkFJNEUsSUFBSSxDQUFDLEtBSmpGLGFBS0UsSUFMRixDQUtPLEVBTFAsQ0FGRjtFQVVBLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixhQUE3QixFQUE0QyxNQUE1QztFQUNBLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixVQUE3QixFQUF5QyxJQUF6QztFQUNBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixHQUExQixDQUNFLFNBREYsRUFFRSxnQ0FGRjtFQUlBLGVBQWUsQ0FBQyxlQUFoQixDQUFnQyxJQUFoQztFQUNBLGVBQWUsQ0FBQyxRQUFoQixHQUEyQixLQUEzQjtFQUVBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGVBQXpCO0VBQ0EsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsNkJBQTNCOztFQUVBLElBQUksWUFBSixFQUFrQjtJQUNoQixnQkFBZ0IsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFoQjtFQUNEOztFQUVELElBQUksZUFBZSxDQUFDLFFBQXBCLEVBQThCO0lBQzVCLE9BQU8sQ0FBQyxZQUFELENBQVA7SUFDQSxlQUFlLENBQUMsUUFBaEIsR0FBMkIsS0FBM0I7RUFDRDs7RUFFRCxJQUFJLGVBQWUsQ0FBQyxLQUFwQixFQUEyQjtJQUN6QixpQkFBaUIsQ0FBQyxlQUFELENBQWpCO0VBQ0Q7QUFDRixDQXRHRCxDLENBd0dBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFpQixDQUFDLEVBQUQsRUFBSyxjQUFMLEVBQXdCO0VBQzdDLDZCQVVJLG9CQUFvQixDQUFDLEVBQUQsQ0FWeEI7RUFBQSxJQUNFLFlBREYsMEJBQ0UsWUFERjtFQUFBLElBRUUsVUFGRiwwQkFFRSxVQUZGO0VBQUEsSUFHRSxRQUhGLDBCQUdFLFFBSEY7RUFBQSxJQUlFLFlBSkYsMEJBSUUsWUFKRjtFQUFBLElBS0UsT0FMRiwwQkFLRSxPQUxGO0VBQUEsSUFNRSxPQU5GLDBCQU1FLE9BTkY7RUFBQSxJQU9FLFNBUEYsMEJBT0UsU0FQRjtFQUFBLElBUUUsUUFSRiwwQkFRRSxRQVJGO0VBQUEsSUFTRSxPQVRGLDBCQVNFLE9BVEY7O0VBV0EsSUFBTSxVQUFVLEdBQUcsS0FBSyxFQUF4QjtFQUNBLElBQUksYUFBYSxHQUFHLGNBQWMsSUFBSSxVQUF0QztFQUVBLElBQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLE1BQXJDO0VBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQUQsRUFBZ0IsQ0FBaEIsQ0FBM0I7RUFDQSxJQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsUUFBZCxFQUFyQjtFQUNBLElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxXQUFkLEVBQXBCO0VBRUEsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsQ0FBaEIsQ0FBM0I7RUFDQSxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBRCxFQUFnQixDQUFoQixDQUEzQjtFQUVBLElBQU0sb0JBQW9CLEdBQUcsVUFBVSxDQUFDLGFBQUQsQ0FBdkM7RUFFQSxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsYUFBRCxDQUFqQztFQUNBLElBQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGFBQUQsRUFBZ0IsT0FBaEIsQ0FBdkM7RUFDQSxJQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxhQUFELEVBQWdCLE9BQWhCLENBQXZDO0VBRUEsSUFBTSxtQkFBbUIsR0FBRyxZQUFZLElBQUksYUFBNUM7RUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFTLElBQUksR0FBRyxDQUFDLG1CQUFELEVBQXNCLFNBQXRCLENBQXZDO0VBQ0EsSUFBTSxZQUFZLEdBQUcsU0FBUyxJQUFJLEdBQUcsQ0FBQyxtQkFBRCxFQUFzQixTQUF0QixDQUFyQztFQUVBLElBQU0sb0JBQW9CLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxjQUFELEVBQWlCLENBQWpCLENBQWpEO0VBQ0EsSUFBTSxrQkFBa0IsR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLFlBQUQsRUFBZSxDQUFmLENBQS9DO0VBRUEsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLFlBQUQsQ0FBL0I7O0VBRUEsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsQ0FBQyxZQUFELEVBQWtCO0lBQ3pDLElBQU0sT0FBTyxHQUFHLENBQUMsbUJBQUQsQ0FBaEI7SUFDQSxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBYixFQUFaO0lBQ0EsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLFFBQWIsRUFBZDtJQUNBLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFiLEVBQWI7SUFDQSxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBYixLQUF3QixDQUF4Qzs7SUFDQSxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQW5CLEVBQXNCO01BQ3BCLFNBQVMsR0FBRyxDQUFaO0lBQ0Q7O0lBRUQsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFlBQUQsQ0FBaEM7SUFFQSxJQUFJLFFBQVEsR0FBRyxJQUFmO0lBRUEsSUFBTSxVQUFVLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFELEVBQWUsT0FBZixFQUF3QixPQUF4QixDQUF6QztJQUNBLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUE1Qjs7SUFFQSxJQUFJLFdBQVcsQ0FBQyxZQUFELEVBQWUsU0FBZixDQUFmLEVBQTBDO01BQ3hDLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0NBQWI7SUFDRDs7SUFFRCxJQUFJLFdBQVcsQ0FBQyxZQUFELEVBQWUsV0FBZixDQUFmLEVBQTRDO01BQzFDLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUNBQWI7SUFDRDs7SUFFRCxJQUFJLFdBQVcsQ0FBQyxZQUFELEVBQWUsU0FBZixDQUFmLEVBQTBDO01BQ3hDLE9BQU8sQ0FBQyxJQUFSLENBQWEsOEJBQWI7SUFDRDs7SUFFRCxJQUFJLFVBQUosRUFBZ0I7TUFDZCxPQUFPLENBQUMsSUFBUixDQUFhLDRCQUFiO0lBQ0Q7O0lBRUQsSUFBSSxTQUFTLENBQUMsWUFBRCxFQUFlLFVBQWYsQ0FBYixFQUF5QztNQUN2QyxPQUFPLENBQUMsSUFBUixDQUFhLHlCQUFiO0lBQ0Q7O0lBRUQsSUFBSSxTQUFKLEVBQWU7TUFDYixJQUFJLFNBQVMsQ0FBQyxZQUFELEVBQWUsU0FBZixDQUFiLEVBQXdDO1FBQ3RDLE9BQU8sQ0FBQyxJQUFSLENBQWEsOEJBQWI7TUFDRDs7TUFFRCxJQUFJLFNBQVMsQ0FBQyxZQUFELEVBQWUsY0FBZixDQUFiLEVBQTZDO1FBQzNDLE9BQU8sQ0FBQyxJQUFSLENBQWEsb0NBQWI7TUFDRDs7TUFFRCxJQUFJLFNBQVMsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFiLEVBQTJDO1FBQ3pDLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0NBQWI7TUFDRDs7TUFFRCxJQUNFLHFCQUFxQixDQUNuQixZQURtQixFQUVuQixvQkFGbUIsRUFHbkIsa0JBSG1CLENBRHZCLEVBTUU7UUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLGdDQUFiO01BQ0Q7SUFDRjs7SUFFRCxJQUFJLFNBQVMsQ0FBQyxZQUFELEVBQWUsV0FBZixDQUFiLEVBQTBDO01BQ3hDLFFBQVEsR0FBRyxHQUFYO01BQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSwyQkFBYjtJQUNEOztJQUVELElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxLQUFELENBQTdCO0lBQ0EsSUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsU0FBRCxDQUFqQztJQUNBLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFMLENBQXFCLE9BQXJCLENBQTZCLFVBQTdCLEVBQXlDLE1BQXpDLEVBQWlELE9BQWpELENBQXlELE9BQXpELEVBQWtFLEdBQWxFLEVBQXVFLE9BQXZFLENBQStFLFlBQS9FLEVBQTZGLFFBQTdGLEVBQXVHLE9BQXZHLENBQStHLFFBQS9HLEVBQXlILElBQXpILENBQXRCO0lBRUEsa0VBRWMsUUFGZCwrQkFHVyxPQUFPLENBQUMsSUFBUixDQUFhLEdBQWIsQ0FIWCxtQ0FJYyxHQUpkLHFDQUtnQixLQUFLLEdBQUcsQ0FMeEIsb0NBTWUsSUFOZixxQ0FPZ0IsYUFQaEIsb0NBUWdCLGFBUmhCLHNDQVNrQixVQUFVLEdBQUcsTUFBSCxHQUFZLE9BVHhDLHVCQVVJLFVBQVUsNkJBQTJCLEVBVnpDLG9CQVdHLEdBWEg7RUFZRCxDQWxGRCxDQXZDNkMsQ0EwSDdDOzs7RUFDQSxhQUFhLEdBQUcsV0FBVyxDQUFDLFlBQUQsQ0FBM0I7RUFFQSxJQUFNLElBQUksR0FBRyxFQUFiOztFQUVBLE9BQ0UsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUFkLElBQ0EsYUFBYSxDQUFDLFFBQWQsT0FBNkIsWUFEN0IsSUFFQSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsS0FBb0IsQ0FIdEIsRUFJRTtJQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsZ0JBQWdCLENBQUMsYUFBRCxDQUExQjtJQUNBLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBRCxFQUFnQixDQUFoQixDQUF2QjtFQUNEOztFQUNELElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFoQztFQUVBLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFYLEVBQXBCO0VBQ0EsV0FBVyxDQUFDLE9BQVosQ0FBb0IsS0FBcEIsR0FBNEIsb0JBQTVCO0VBQ0EsV0FBVyxDQUFDLEtBQVosQ0FBa0IsR0FBbEIsYUFBMkIsWUFBWSxDQUFDLFlBQXhDO0VBQ0EsV0FBVyxDQUFDLE1BQVosR0FBcUIsS0FBckI7RUFDQSxJQUFJLE9BQU8sMENBQWdDLDBCQUFoQyxxQ0FDTyxrQkFEUCx1Q0FFUyxtQkFGVCxjQUVnQyxnQ0FGaEMsdUZBS1EsNEJBTFIsMENBTWEsSUFBSSxDQUFDLGFBTmxCLDZCQU9DLG1CQUFtQiw2QkFBMkIsRUFQL0MsZ0ZBVVMsbUJBVlQsY0FVZ0MsZ0NBVmhDLHVGQWFRLDZCQWJSLDBDQWNhLElBQUksQ0FBQyxjQWRsQiw2QkFlQyxtQkFBbUIsNkJBQTJCLEVBZi9DLGdGQWtCUyxtQkFsQlQsY0FrQmdDLDBCQWxCaEMsdUZBcUJRLDhCQXJCUiw2QkFxQnVELFVBckJ2RCxlQXFCc0UsSUFBSSxDQUFDLFlBckIzRSw2QkFzQkEsVUF0QkEsNkZBeUJRLDZCQXpCUiw2QkF5QnNELFdBekJ0RCxlQXlCc0UsSUFBSSxDQUFDLFdBekIzRSw2QkEwQkEsV0ExQkEsNkRBNEJTLG1CQTVCVCxjQTRCZ0MsZ0NBNUJoQyx1RkErQlEseUJBL0JSLDBDQWdDYSxJQUFJLENBQUMsVUFoQ2xCLDZCQWlDQyxtQkFBbUIsNkJBQTJCLEVBakMvQyxnRkFvQ1MsbUJBcENULGNBb0NnQyxnQ0FwQ2hDLHVGQXVDUSx3QkF2Q1IsMENBd0NhLElBQUksQ0FBQyxTQXhDbEIsNkJBeUNDLG1CQUFtQiw2QkFBMkIsRUF6Qy9DLDhGQTZDUyxvQkE3Q1QsK0RBQVg7O0VBZ0RBLEtBQUksSUFBSSxDQUFSLElBQWEsa0JBQWIsRUFBZ0M7SUFDOUIsT0FBTywwQkFBa0IsMEJBQWxCLDJDQUF5RSxrQkFBa0IsQ0FBQyxDQUFELENBQTNGLGdCQUFtRyxrQkFBa0IsQ0FBQyxDQUFELENBQWxCLENBQXNCLE1BQXRCLENBQTZCLENBQTdCLENBQW5HLFVBQVA7RUFDRDs7RUFDRCxPQUFPLGtFQUdHLFNBSEgsbURBQVA7RUFPQSxXQUFXLENBQUMsU0FBWixHQUF3QixPQUF4QjtFQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLFlBQXRCLENBQW1DLFdBQW5DLEVBQWdELFVBQWhEO0VBRUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsd0JBQTNCOztFQUNBLElBQUksUUFBUSxDQUFDLE1BQVQsS0FBb0IsSUFBeEIsRUFBOEI7SUFDNUIsUUFBUSxDQUFDLE1BQVQsR0FBa0IsS0FBbEI7O0lBQ0EsSUFBSSxPQUFPLENBQUMsTUFBWixFQUFvQjtNQUNsQixPQUFPLENBQUMsTUFBUixHQUFpQixLQUFqQjtJQUNEO0VBQ0Y7O0VBRUQsSUFBTSxRQUFRLEdBQUcsRUFBakI7O0VBRUEsSUFBSSxpQkFBSixFQUF1QjtJQUNyQixRQUFRLENBQUMsV0FBVCxHQUF1QixFQUF2QjtFQUNELENBRkQsTUFHSyxJQUFJLGNBQWMsQ0FBQyxPQUFmLE9BQTZCLE9BQU8sQ0FBQyxPQUFSLEVBQWpDLEVBQW9EO0lBQ3ZELFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBSSxDQUFDLG1CQUFuQjtFQUNELENBRkksTUFHQSxJQUFJLE9BQU8sS0FBSyxTQUFaLElBQXlCLE9BQU8sS0FBSyxFQUFyQyxJQUEyQyxjQUFjLENBQUMsT0FBZixPQUE2QixPQUFPLENBQUMsT0FBUixFQUE1RSxFQUErRjtJQUNsRyxRQUFRLENBQUMsSUFBVCxDQUFjLElBQUksQ0FBQyxrQkFBbkI7RUFDRCxDQUZJLE1BR0E7SUFDSCxRQUFRLENBQUMsSUFBVCxDQUFjLElBQUksQ0FBQyx1QkFBTCxDQUE2QixPQUE3QixDQUFxQyxjQUFyQyxFQUFxRCxVQUFyRCxFQUFpRSxPQUFqRSxDQUF5RSxlQUF6RSxFQUEwRixXQUExRixDQUFkO0VBQ0Q7O0VBRUQsUUFBUSxDQUFDLFdBQVQsR0FBdUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQXZCO0VBRUEsT0FBTyxXQUFQO0FBQ0QsQ0FwT0Q7QUFzT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBc0IsQ0FBQyxTQUFELEVBQWU7RUFDekMsSUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7RUFDeEIsNkJBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtFQUFBLElBQVEsVUFBUiwwQkFBUSxVQUFSO0VBQUEsSUFBb0IsWUFBcEIsMEJBQW9CLFlBQXBCO0VBQUEsSUFBa0MsT0FBbEMsMEJBQWtDLE9BQWxDO0VBQUEsSUFBMkMsT0FBM0MsMEJBQTJDLE9BQTNDOztFQUdBLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFuQjtFQUNBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEvQjtFQUNBLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFsQztFQUVBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHNCQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxTQUFELEVBQWU7RUFDMUMsSUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7RUFDeEIsNkJBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtFQUFBLElBQVEsVUFBUiwwQkFBUSxVQUFSO0VBQUEsSUFBb0IsWUFBcEIsMEJBQW9CLFlBQXBCO0VBQUEsSUFBa0MsT0FBbEMsMEJBQWtDLE9BQWxDO0VBQUEsSUFBMkMsT0FBM0MsMEJBQTJDLE9BQTNDOztFQUdBLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFwQjtFQUNBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEvQjtFQUNBLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFsQztFQUVBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHVCQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsQ0FBQyxTQUFELEVBQWU7RUFDdEMsSUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7RUFDeEIsOEJBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtFQUFBLElBQVEsVUFBUiwyQkFBUSxVQUFSO0VBQUEsSUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0VBQUEsSUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0VBQUEsSUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztFQUdBLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFwQjtFQUNBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEvQjtFQUNBLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFsQztFQUVBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG1CQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBa0IsQ0FBQyxTQUFELEVBQWU7RUFDckMsSUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7RUFDeEIsOEJBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtFQUFBLElBQVEsVUFBUiwyQkFBUSxVQUFSO0VBQUEsSUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0VBQUEsSUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0VBQUEsSUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztFQUdBLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFuQjtFQUNBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEvQjtFQUNBLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFsQztFQUVBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLGtCQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFlLENBQUMsRUFBRCxFQUFRO0VBQzNCLDhCQUErQyxvQkFBb0IsQ0FBQyxFQUFELENBQW5FO0VBQUEsSUFBUSxZQUFSLDJCQUFRLFlBQVI7RUFBQSxJQUFzQixVQUF0QiwyQkFBc0IsVUFBdEI7RUFBQSxJQUFrQyxRQUFsQywyQkFBa0MsUUFBbEM7O0VBRUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBOEIsd0JBQTlCO0VBQ0EsVUFBVSxDQUFDLE1BQVgsR0FBb0IsSUFBcEI7RUFDQSxRQUFRLENBQUMsV0FBVCxHQUF1QixFQUF2QjtBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQWEsQ0FBQyxjQUFELEVBQW9CO0VBQ3JDLElBQUksY0FBYyxDQUFDLFFBQW5CLEVBQTZCOztFQUU3Qiw4QkFBNkQsb0JBQW9CLENBQy9FLGNBRCtFLENBQWpGO0VBQUEsSUFBUSxZQUFSLDJCQUFRLFlBQVI7RUFBQSxJQUFzQixlQUF0QiwyQkFBc0IsZUFBdEI7RUFBQSxJQUF1QyxRQUF2QywyQkFBdUMsUUFBdkM7RUFBQSxJQUFpRCxPQUFqRCwyQkFBaUQsT0FBakQ7O0VBR0EsZ0JBQWdCLENBQUMsY0FBRCxFQUFpQixjQUFjLENBQUMsT0FBZixDQUF1QixLQUF4QyxDQUFoQjtFQUNBLFlBQVksQ0FBQyxZQUFELENBQVo7RUFDQSxRQUFRLENBQUMsTUFBVCxHQUFrQixJQUFsQjtFQUNBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLElBQWpCO0VBRUEsZUFBZSxDQUFDLEtBQWhCO0FBQ0QsQ0FaRDtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWlCLENBQUMsRUFBRCxFQUFRO0VBQzdCLElBQUksRUFBRSxDQUFDLFFBQVAsRUFBaUI7O0VBQ2pCLDhCQVFJLG9CQUFvQixDQUFDLEVBQUQsQ0FSeEI7RUFBQSxJQUNFLFFBREYsMkJBQ0UsUUFERjtFQUFBLElBRUUsVUFGRiwyQkFFRSxVQUZGO0VBQUEsSUFHRSxTQUhGLDJCQUdFLFNBSEY7RUFBQSxJQUlFLE9BSkYsMkJBSUUsT0FKRjtFQUFBLElBS0UsT0FMRiwyQkFLRSxPQUxGO0VBQUEsSUFNRSxXQU5GLDJCQU1FLFdBTkY7RUFBQSxJQU9FLE9BUEYsMkJBT0UsT0FQRjs7RUFVQSxJQUFJLFVBQVUsQ0FBQyxNQUFmLEVBQXVCO0lBQ3JCLElBQU0sYUFBYSxHQUFHLHdCQUF3QixDQUM1QyxTQUFTLElBQUksV0FBYixJQUE0QixLQUFLLEVBRFcsRUFFNUMsT0FGNEMsRUFHNUMsT0FINEMsQ0FBOUM7SUFLQSxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBRCxFQUFhLGFBQWIsQ0FBbEM7SUFDQSxXQUFXLENBQUMsYUFBWixDQUEwQixxQkFBMUIsRUFBaUQsS0FBakQ7RUFDRCxDQVJELE1BUU87SUFDTCxZQUFZLENBQUMsRUFBRCxDQUFaO0lBQ0EsUUFBUSxDQUFDLE1BQVQsR0FBa0IsSUFBbEI7SUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixJQUFqQjtFQUNEO0FBQ0YsQ0F6QkQ7QUEyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSx1QkFBdUIsR0FBRyxTQUExQix1QkFBMEIsQ0FBQyxFQUFELEVBQVE7RUFDdEMsOEJBQW9ELG9CQUFvQixDQUFDLEVBQUQsQ0FBeEU7RUFBQSxJQUFRLFVBQVIsMkJBQVEsVUFBUjtFQUFBLElBQW9CLFNBQXBCLDJCQUFvQixTQUFwQjtFQUFBLElBQStCLE9BQS9CLDJCQUErQixPQUEvQjtFQUFBLElBQXdDLE9BQXhDLDJCQUF3QyxPQUF4Qzs7RUFDQSxJQUFNLGFBQWEsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFsQzs7RUFFQSxJQUFJLGFBQWEsSUFBSSxTQUFyQixFQUFnQztJQUM5QixJQUFNLGFBQWEsR0FBRyx3QkFBd0IsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQUE5QztJQUNBLGNBQWMsQ0FBQyxVQUFELEVBQWEsYUFBYixDQUFkO0VBQ0Q7QUFDRixDQVJELEMsQ0FVQTtBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBQyxFQUFELEVBQUssY0FBTCxFQUF3QjtFQUNwRCw4QkFNSSxvQkFBb0IsQ0FBQyxFQUFELENBTnhCO0VBQUEsSUFDRSxVQURGLDJCQUNFLFVBREY7RUFBQSxJQUVFLFFBRkYsMkJBRUUsUUFGRjtFQUFBLElBR0UsWUFIRiwyQkFHRSxZQUhGO0VBQUEsSUFJRSxPQUpGLDJCQUlFLE9BSkY7RUFBQSxJQUtFLE9BTEYsMkJBS0UsT0FMRjs7RUFRQSxJQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsUUFBYixFQUF0QjtFQUNBLElBQU0sWUFBWSxHQUFHLGNBQWMsSUFBSSxJQUFsQixHQUF5QixhQUF6QixHQUF5QyxjQUE5RDtFQUVBLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFiLENBQWlCLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7SUFDaEQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQUQsRUFBZSxLQUFmLENBQTdCO0lBRUEsSUFBTSxVQUFVLEdBQUcsMkJBQTJCLENBQzVDLFlBRDRDLEVBRTVDLE9BRjRDLEVBRzVDLE9BSDRDLENBQTlDO0lBTUEsSUFBSSxRQUFRLEdBQUcsSUFBZjtJQUVBLElBQU0sT0FBTyxHQUFHLENBQUMsb0JBQUQsQ0FBaEI7SUFDQSxJQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssYUFBN0I7O0lBRUEsSUFBSSxLQUFLLEtBQUssWUFBZCxFQUE0QjtNQUMxQixRQUFRLEdBQUcsR0FBWDtNQUNBLE9BQU8sQ0FBQyxJQUFSLENBQWEsNEJBQWI7SUFDRDs7SUFFRCxJQUFJLFVBQUosRUFBZ0I7TUFDZCxPQUFPLENBQUMsSUFBUixDQUFhLDZCQUFiO0lBQ0Q7O0lBRUQsdUVBRWdCLFFBRmhCLGlDQUdhLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYixDQUhiLHVDQUlrQixLQUpsQixzQ0FLa0IsS0FMbEIsd0NBTW9CLFVBQVUsR0FBRyxNQUFILEdBQVksT0FOMUMseUJBT00sVUFBVSw2QkFBMkIsRUFQM0Msc0JBUUssS0FSTDtFQVNELENBaENjLENBQWY7RUFrQ0EsSUFBTSxVQUFVLDBDQUFnQywyQkFBaEMscUNBQ0Usb0JBREYsK0RBR1IsY0FBYyxDQUFDLE1BQUQsRUFBUyxDQUFULENBSE4sNkNBQWhCO0VBUUEsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFNBQVgsRUFBcEI7RUFDQSxXQUFXLENBQUMsU0FBWixHQUF3QixVQUF4QjtFQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLFlBQXRCLENBQW1DLFdBQW5DLEVBQWdELFVBQWhEO0VBRUEsUUFBUSxDQUFDLFdBQVQsR0FBdUIsSUFBSSxDQUFDLGdCQUE1QjtFQUVBLE9BQU8sV0FBUDtBQUNELENBN0REO0FBK0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBYyxDQUFDLE9BQUQsRUFBYTtFQUMvQixJQUFJLE9BQU8sQ0FBQyxRQUFaLEVBQXNCOztFQUN0Qiw4QkFBdUQsb0JBQW9CLENBQ3pFLE9BRHlFLENBQTNFO0VBQUEsSUFBUSxVQUFSLDJCQUFRLFVBQVI7RUFBQSxJQUFvQixZQUFwQiwyQkFBb0IsWUFBcEI7RUFBQSxJQUFrQyxPQUFsQywyQkFBa0MsT0FBbEM7RUFBQSxJQUEyQyxPQUEzQywyQkFBMkMsT0FBM0M7O0VBR0EsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWpCLEVBQXdCLEVBQXhCLENBQTlCO0VBQ0EsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQUQsRUFBZSxhQUFmLENBQW5CO0VBQ0EsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0VBQ0EsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0VBQ0EsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0QsQ0FWRCxDLENBWUE7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQUssYUFBTCxFQUF1QjtFQUNsRCw4QkFNSSxvQkFBb0IsQ0FBQyxFQUFELENBTnhCO0VBQUEsSUFDRSxVQURGLDJCQUNFLFVBREY7RUFBQSxJQUVFLFFBRkYsMkJBRUUsUUFGRjtFQUFBLElBR0UsWUFIRiwyQkFHRSxZQUhGO0VBQUEsSUFJRSxPQUpGLDJCQUlFLE9BSkY7RUFBQSxJQUtFLE9BTEYsMkJBS0UsT0FMRjs7RUFRQSxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsV0FBYixFQUFyQjtFQUNBLElBQU0sV0FBVyxHQUFHLGFBQWEsSUFBSSxJQUFqQixHQUF3QixZQUF4QixHQUF1QyxhQUEzRDtFQUVBLElBQUksV0FBVyxHQUFHLFdBQWxCO0VBQ0EsV0FBVyxJQUFJLFdBQVcsR0FBRyxVQUE3QjtFQUNBLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxXQUFaLENBQWQ7RUFFQSxJQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUN0RCxPQUFPLENBQUMsWUFBRCxFQUFlLFdBQVcsR0FBRyxDQUE3QixDQUQrQyxFQUV0RCxPQUZzRCxFQUd0RCxPQUhzRCxDQUF4RDtFQU1BLElBQU0scUJBQXFCLEdBQUcsMEJBQTBCLENBQ3RELE9BQU8sQ0FBQyxZQUFELEVBQWUsV0FBVyxHQUFHLFVBQTdCLENBRCtDLEVBRXRELE9BRnNELEVBR3RELE9BSHNELENBQXhEO0VBTUEsSUFBTSxLQUFLLEdBQUcsRUFBZDtFQUNBLElBQUksU0FBUyxHQUFHLFdBQWhCOztFQUNBLE9BQU8sS0FBSyxDQUFDLE1BQU4sR0FBZSxVQUF0QixFQUFrQztJQUNoQyxJQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FDM0MsT0FBTyxDQUFDLFlBQUQsRUFBZSxTQUFmLENBRG9DLEVBRTNDLE9BRjJDLEVBRzNDLE9BSDJDLENBQTdDO0lBTUEsSUFBSSxRQUFRLEdBQUcsSUFBZjtJQUVBLElBQU0sT0FBTyxHQUFHLENBQUMsbUJBQUQsQ0FBaEI7SUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFTLEtBQUssWUFBakM7O0lBRUEsSUFBSSxTQUFTLEtBQUssV0FBbEIsRUFBK0I7TUFDN0IsUUFBUSxHQUFHLEdBQVg7TUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLDJCQUFiO0lBQ0Q7O0lBRUQsSUFBSSxVQUFKLEVBQWdCO01BQ2QsT0FBTyxDQUFDLElBQVIsQ0FBYSw0QkFBYjtJQUNEOztJQUVELEtBQUssQ0FBQyxJQUFOLGlFQUdnQixRQUhoQixpQ0FJYSxPQUFPLENBQUMsSUFBUixDQUFhLEdBQWIsQ0FKYix1Q0FLa0IsU0FMbEIsd0NBTW9CLFVBQVUsR0FBRyxNQUFILEdBQVksT0FOMUMseUJBT00sVUFBVSw2QkFBMkIsRUFQM0Msc0JBUUssU0FSTDtJQVVBLFNBQVMsSUFBSSxDQUFiO0VBQ0Q7O0VBRUQsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUQsRUFBUSxDQUFSLENBQWhDO0VBQ0EsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixPQUFwQixDQUE0QixTQUE1QixFQUF1QyxVQUF2QyxDQUEvQjtFQUNBLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsU0FBeEIsRUFBbUMsVUFBbkMsQ0FBM0I7RUFDQSxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBTCxDQUFxQixPQUFyQixDQUE2QixTQUE3QixFQUF3QyxXQUF4QyxFQUFxRCxPQUFyRCxDQUE2RCxPQUE3RCxFQUFzRSxXQUFXLEdBQUcsVUFBZCxHQUEyQixDQUFqRyxDQUF0QjtFQUVBLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFYLEVBQXBCO0VBQ0EsV0FBVyxDQUFDLFNBQVosMENBQXFELDBCQUFyRCxxQ0FDa0Isb0JBRGxCLDJLQU91QixrQ0FQdkIsK0NBUTRCLHNCQVI1QixpQ0FTZ0IscUJBQXFCLDZCQUEyQixFQVRoRSwrSEFhNEIsb0JBYjVCLG1GQWVrQixTQWZsQixzTEFzQnVCLDhCQXRCdkIsK0NBdUI0QixrQkF2QjVCLGlDQXdCZ0IscUJBQXFCLDZCQUEyQixFQXhCaEU7RUErQkEsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsWUFBdEIsQ0FBbUMsV0FBbkMsRUFBZ0QsVUFBaEQ7RUFFQSxRQUFRLENBQUMsV0FBVCxHQUF1QixhQUF2QjtFQUVBLE9BQU8sV0FBUDtBQUNELENBMUdEO0FBNEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQTJCLENBQUMsRUFBRCxFQUFRO0VBQ3ZDLElBQUksRUFBRSxDQUFDLFFBQVAsRUFBaUI7O0VBRWpCLDhCQUF1RCxvQkFBb0IsQ0FDekUsRUFEeUUsQ0FBM0U7RUFBQSxJQUFRLFVBQVIsMkJBQVEsVUFBUjtFQUFBLElBQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtFQUFBLElBQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztFQUFBLElBQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7RUFHQSxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBWCxDQUF5QixxQkFBekIsQ0FBZjtFQUNBLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBUixFQUFxQixFQUFyQixDQUE3QjtFQUVBLElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFsQztFQUNBLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxZQUFaLENBQWY7RUFFQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBcEI7RUFDQSxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEzQztFQUNBLElBQU0sV0FBVyxHQUFHLG9CQUFvQixDQUN0QyxVQURzQyxFQUV0QyxVQUFVLENBQUMsV0FBWCxFQUZzQyxDQUF4QztFQUtBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLDRCQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBeEJEO0FBMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQXVCLENBQUMsRUFBRCxFQUFRO0VBQ25DLElBQUksRUFBRSxDQUFDLFFBQVAsRUFBaUI7O0VBRWpCLDhCQUF1RCxvQkFBb0IsQ0FDekUsRUFEeUUsQ0FBM0U7RUFBQSxJQUFRLFVBQVIsMkJBQVEsVUFBUjtFQUFBLElBQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtFQUFBLElBQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztFQUFBLElBQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7RUFHQSxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBWCxDQUF5QixxQkFBekIsQ0FBZjtFQUNBLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBUixFQUFxQixFQUFyQixDQUE3QjtFQUVBLElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFsQztFQUNBLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxZQUFaLENBQWY7RUFFQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBcEI7RUFDQSxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEzQztFQUNBLElBQU0sV0FBVyxHQUFHLG9CQUFvQixDQUN0QyxVQURzQyxFQUV0QyxVQUFVLENBQUMsV0FBWCxFQUZzQyxDQUF4QztFQUtBLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHdCQUExQixDQUFsQjs7RUFDQSxJQUFJLFdBQVcsQ0FBQyxRQUFoQixFQUEwQjtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsb0JBQTFCLENBQWQ7RUFDRDs7RUFDRCxXQUFXLENBQUMsS0FBWjtBQUNELENBeEJEO0FBMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLE1BQUQsRUFBWTtFQUM3QixJQUFJLE1BQU0sQ0FBQyxRQUFYLEVBQXFCOztFQUNyQiw4QkFBdUQsb0JBQW9CLENBQ3pFLE1BRHlFLENBQTNFO0VBQUEsSUFBUSxVQUFSLDJCQUFRLFVBQVI7RUFBQSxJQUFvQixZQUFwQiwyQkFBb0IsWUFBcEI7RUFBQSxJQUFrQyxPQUFsQywyQkFBa0MsT0FBbEM7RUFBQSxJQUEyQyxPQUEzQywyQkFBMkMsT0FBM0M7O0VBR0EsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFSLEVBQW1CLEVBQW5CLENBQTdCO0VBQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQUQsRUFBZSxZQUFmLENBQWxCO0VBQ0EsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0VBQ0EsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0VBQ0EsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0QsQ0FWRCxDLENBWUE7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLEtBQUQsRUFBVztFQUMxQyw4QkFBNkQsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE1BQVAsQ0FBakY7RUFBQSxJQUFRLFlBQVIsMkJBQVEsWUFBUjtFQUFBLElBQXNCLGVBQXRCLDJCQUFzQixlQUF0QjtFQUFBLElBQXVDLFFBQXZDLDJCQUF1QyxRQUF2QztFQUFBLElBQWlELE9BQWpELDJCQUFpRCxPQUFqRDs7RUFFQSxZQUFZLENBQUMsWUFBRCxDQUFaO0VBQ0EsUUFBUSxDQUFDLE1BQVQsR0FBa0IsSUFBbEI7RUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixJQUFqQjtFQUNBLGVBQWUsQ0FBQyxLQUFoQjtFQUVBLEtBQUssQ0FBQyxjQUFOO0FBQ0QsQ0FURCxDLENBV0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFpQixDQUFDLFlBQUQsRUFBa0I7RUFDdkMsT0FBTyxVQUFDLEtBQUQsRUFBVztJQUNoQiw4QkFBdUQsb0JBQW9CLENBQ3pFLEtBQUssQ0FBQyxNQURtRSxDQUEzRTtJQUFBLElBQVEsVUFBUiwyQkFBUSxVQUFSO0lBQUEsSUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0lBQUEsSUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0lBQUEsSUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztJQUlBLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxZQUFELENBQXpCO0lBRUEsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBM0M7O0lBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFELEVBQWUsVUFBZixDQUFkLEVBQTBDO01BQ3hDLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUFsQztNQUNBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtJQUNEOztJQUNELEtBQUssQ0FBQyxjQUFOO0VBQ0QsQ0FiRDtBQWNELENBZkQ7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0VBQUEsT0FBVSxRQUFRLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBbEI7QUFBQSxDQUFELENBQXZDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7RUFBQSxPQUFVLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFsQjtBQUFBLENBQUQsQ0FBekM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtFQUFBLE9BQVUsT0FBTyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQWpCO0FBQUEsQ0FBRCxDQUF6QztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0VBQUEsT0FBVSxPQUFPLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBakI7QUFBQSxDQUFELENBQTFDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7RUFBQSxPQUFVLFdBQVcsQ0FBQyxJQUFELENBQXJCO0FBQUEsQ0FBRCxDQUF6QztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0VBQUEsT0FBVSxTQUFTLENBQUMsSUFBRCxDQUFuQjtBQUFBLENBQUQsQ0FBeEM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtFQUFBLE9BQVUsU0FBUyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQW5CO0FBQUEsQ0FBRCxDQUE3QztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0VBQUEsT0FBVSxTQUFTLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBbkI7QUFBQSxDQUFELENBQTNDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLDJCQUEyQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7RUFBQSxPQUFVLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFsQjtBQUFBLENBQUQsQ0FBbEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0seUJBQXlCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtFQUFBLE9BQVUsUUFBUSxDQUFDLElBQUQsRUFBTyxDQUFQLENBQWxCO0FBQUEsQ0FBRCxDQUFoRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUEwQixDQUFDLE1BQUQsRUFBWTtFQUMxQyxJQUFJLE1BQU0sQ0FBQyxRQUFYLEVBQXFCO0VBRXJCLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWYsQ0FBbkI7RUFFQSxJQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEtBQS9DO0VBQ0EsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFqQztFQUVBLElBQUksU0FBUyxLQUFLLG1CQUFsQixFQUF1QztFQUV2QyxJQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsU0FBRCxDQUFyQztFQUNBLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsYUFBYixDQUFsQztFQUNBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtBQUNELENBYkQsQyxDQWVBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSwwQkFBMEIsR0FBRyxTQUE3QiwwQkFBNkIsQ0FBQyxhQUFELEVBQW1CO0VBQ3BELE9BQU8sVUFBQyxLQUFELEVBQVc7SUFDaEIsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQXRCO0lBQ0EsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWpCLEVBQXdCLEVBQXhCLENBQTlCOztJQUNBLDhCQUF1RCxvQkFBb0IsQ0FDekUsT0FEeUUsQ0FBM0U7SUFBQSxJQUFRLFVBQVIsMkJBQVEsVUFBUjtJQUFBLElBQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtJQUFBLElBQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztJQUFBLElBQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7SUFHQSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FBNUI7SUFFQSxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBRCxDQUFqQztJQUNBLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxhQUFiLENBQVosQ0FBaEI7SUFFQSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FBckI7SUFDQSxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEzQzs7SUFDQSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQUQsRUFBYyxVQUFkLENBQWhCLEVBQTJDO01BQ3pDLElBQU0sV0FBVyxHQUFHLHFCQUFxQixDQUN2QyxVQUR1QyxFQUV2QyxVQUFVLENBQUMsUUFBWCxFQUZ1QyxDQUF6QztNQUlBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHNCQUExQixFQUFrRCxLQUFsRDtJQUNEOztJQUNELEtBQUssQ0FBQyxjQUFOO0VBQ0QsQ0FyQkQ7QUFzQkQsQ0F2QkQ7QUF5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxpQkFBaUIsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUQ7RUFBQSxPQUFXLEtBQUssR0FBRyxDQUFuQjtBQUFBLENBQUQsQ0FBcEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQUMsVUFBQyxLQUFEO0VBQUEsT0FBVyxLQUFLLEdBQUcsQ0FBbkI7QUFBQSxDQUFELENBQXREO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLDBCQUEwQixDQUFDLFVBQUMsS0FBRDtFQUFBLE9BQVcsS0FBSyxHQUFHLENBQW5CO0FBQUEsQ0FBRCxDQUF0RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUQ7RUFBQSxPQUFXLEtBQUssR0FBRyxDQUFuQjtBQUFBLENBQUQsQ0FBdkQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQ3BELFVBQUMsS0FBRDtFQUFBLE9BQVcsS0FBSyxHQUFJLEtBQUssR0FBRyxDQUE1QjtBQUFBLENBRG9ELENBQXREO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLDBCQUEwQixDQUNuRCxVQUFDLEtBQUQ7RUFBQSxPQUFXLEtBQUssR0FBRyxDQUFSLEdBQWEsS0FBSyxHQUFHLENBQWhDO0FBQUEsQ0FEbUQsQ0FBckQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sdUJBQXVCLEdBQUcsMEJBQTBCLENBQUM7RUFBQSxPQUFNLEVBQU47QUFBQSxDQUFELENBQTFEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUFDO0VBQUEsT0FBTSxDQUFOO0FBQUEsQ0FBRCxDQUF4RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLE9BQUQsRUFBYTtFQUM1QyxJQUFJLE9BQU8sQ0FBQyxRQUFaLEVBQXNCO0VBQ3RCLElBQUksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsNEJBQTNCLENBQUosRUFBOEQ7RUFFOUQsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWpCLEVBQXdCLEVBQXhCLENBQTNCO0VBRUEsSUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsT0FBRCxFQUFVLFVBQVYsQ0FBekM7RUFDQSxXQUFXLENBQUMsYUFBWixDQUEwQixzQkFBMUIsRUFBa0QsS0FBbEQ7QUFDRCxDQVJELEMsQ0FVQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0seUJBQXlCLEdBQUcsU0FBNUIseUJBQTRCLENBQUMsWUFBRCxFQUFrQjtFQUNsRCxPQUFPLFVBQUMsS0FBRCxFQUFXO0lBQ2hCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFyQjtJQUNBLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQWhCLEVBQXVCLEVBQXZCLENBQTdCOztJQUNBLDhCQUF1RCxvQkFBb0IsQ0FDekUsTUFEeUUsQ0FBM0U7SUFBQSxJQUFRLFVBQVIsMkJBQVEsVUFBUjtJQUFBLElBQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtJQUFBLElBQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztJQUFBLElBQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7SUFHQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBM0I7SUFFQSxJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsWUFBRCxDQUEvQjtJQUNBLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxZQUFaLENBQWY7SUFFQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBcEI7SUFDQSxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEzQzs7SUFDQSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQUQsRUFBYyxVQUFkLENBQWYsRUFBMEM7TUFDeEMsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBRHNDLEVBRXRDLFVBQVUsQ0FBQyxXQUFYLEVBRnNDLENBQXhDO01BSUEsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0lBQ0Q7O0lBQ0QsS0FBSyxDQUFDLGNBQU47RUFDRCxDQXJCRDtBQXNCRCxDQXZCRDtBQXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGdCQUFnQixHQUFHLHlCQUF5QixDQUFDLFVBQUMsSUFBRDtFQUFBLE9BQVUsSUFBSSxHQUFHLENBQWpCO0FBQUEsQ0FBRCxDQUFsRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyx5QkFBeUIsQ0FBQyxVQUFDLElBQUQ7RUFBQSxPQUFVLElBQUksR0FBRyxDQUFqQjtBQUFBLENBQUQsQ0FBcEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sa0JBQWtCLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFEO0VBQUEsT0FBVSxJQUFJLEdBQUcsQ0FBakI7QUFBQSxDQUFELENBQXBEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLHlCQUF5QixDQUFDLFVBQUMsSUFBRDtFQUFBLE9BQVUsSUFBSSxHQUFHLENBQWpCO0FBQUEsQ0FBRCxDQUFyRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyx5QkFBeUIsQ0FDbEQsVUFBQyxJQUFEO0VBQUEsT0FBVSxJQUFJLEdBQUksSUFBSSxHQUFHLENBQXpCO0FBQUEsQ0FEa0QsQ0FBcEQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0saUJBQWlCLEdBQUcseUJBQXlCLENBQ2pELFVBQUMsSUFBRDtFQUFBLE9BQVUsSUFBSSxHQUFHLENBQVAsR0FBWSxJQUFJLEdBQUcsQ0FBN0I7QUFBQSxDQURpRCxDQUFuRDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyx5QkFBeUIsQ0FDcEQsVUFBQyxJQUFEO0VBQUEsT0FBVSxJQUFJLEdBQUcsVUFBakI7QUFBQSxDQURvRCxDQUF0RDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FDdEQsVUFBQyxJQUFEO0VBQUEsT0FBVSxJQUFJLEdBQUcsVUFBakI7QUFBQSxDQURzRCxDQUF4RDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUEwQixDQUFDLE1BQUQsRUFBWTtFQUMxQyxJQUFJLE1BQU0sQ0FBQyxRQUFYLEVBQXFCO0VBQ3JCLElBQUksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsMkJBQTFCLENBQUosRUFBNEQ7RUFFNUQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBaEIsRUFBdUIsRUFBdkIsQ0FBMUI7RUFFQSxJQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUF4QztFQUNBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtBQUNELENBUkQsQyxDQVVBO0FBRUE7OztBQUVBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLFNBQUQsRUFBZTtFQUNoQyxJQUFNLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFzQixDQUFDLEVBQUQsRUFBUTtJQUNsQyw4QkFBdUIsb0JBQW9CLENBQUMsRUFBRCxDQUEzQztJQUFBLElBQVEsVUFBUiwyQkFBUSxVQUFSOztJQUNBLElBQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQUQsRUFBWSxVQUFaLENBQWhDO0lBRUEsSUFBTSxhQUFhLEdBQUcsQ0FBdEI7SUFDQSxJQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxNQUFsQixHQUEyQixDQUFoRDtJQUNBLElBQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLGFBQUQsQ0FBdEM7SUFDQSxJQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxZQUFELENBQXJDO0lBQ0EsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsT0FBbEIsQ0FBMEIsYUFBYSxFQUF2QyxDQUFuQjtJQUVBLElBQU0sU0FBUyxHQUFHLFVBQVUsS0FBSyxZQUFqQztJQUNBLElBQU0sVUFBVSxHQUFHLFVBQVUsS0FBSyxhQUFsQztJQUNBLElBQU0sVUFBVSxHQUFHLFVBQVUsS0FBSyxDQUFDLENBQW5DO0lBRUEsT0FBTztNQUNMLGlCQUFpQixFQUFqQixpQkFESztNQUVMLFVBQVUsRUFBVixVQUZLO01BR0wsWUFBWSxFQUFaLFlBSEs7TUFJTCxVQUFVLEVBQVYsVUFKSztNQUtMLFdBQVcsRUFBWCxXQUxLO01BTUwsU0FBUyxFQUFUO0lBTkssQ0FBUDtFQVFELENBdEJEOztFQXdCQSxPQUFPO0lBQ0wsUUFESyxvQkFDSSxLQURKLEVBQ1c7TUFDZCwyQkFBZ0QsbUJBQW1CLENBQ2pFLEtBQUssQ0FBQyxNQUQyRCxDQUFuRTtNQUFBLElBQVEsWUFBUix3QkFBUSxZQUFSO01BQUEsSUFBc0IsU0FBdEIsd0JBQXNCLFNBQXRCO01BQUEsSUFBaUMsVUFBakMsd0JBQWlDLFVBQWpDOztNQUlBLElBQUksU0FBUyxJQUFJLFVBQWpCLEVBQTZCO1FBQzNCLEtBQUssQ0FBQyxjQUFOO1FBQ0EsWUFBWSxDQUFDLEtBQWI7TUFDRDtJQUNGLENBVkk7SUFXTCxPQVhLLG1CQVdHLEtBWEgsRUFXVTtNQUNiLDRCQUFnRCxtQkFBbUIsQ0FDakUsS0FBSyxDQUFDLE1BRDJELENBQW5FO01BQUEsSUFBUSxXQUFSLHlCQUFRLFdBQVI7TUFBQSxJQUFxQixVQUFyQix5QkFBcUIsVUFBckI7TUFBQSxJQUFpQyxVQUFqQyx5QkFBaUMsVUFBakM7O01BSUEsSUFBSSxVQUFVLElBQUksVUFBbEIsRUFBOEI7UUFDNUIsS0FBSyxDQUFDLGNBQU47UUFDQSxXQUFXLENBQUMsS0FBWjtNQUNEO0lBQ0Y7RUFwQkksQ0FBUDtBQXNCRCxDQS9DRDs7QUFpREEsSUFBTSx5QkFBeUIsR0FBRyxVQUFVLENBQUMscUJBQUQsQ0FBNUM7QUFDQSxJQUFNLDBCQUEwQixHQUFHLFVBQVUsQ0FBQyxzQkFBRCxDQUE3QztBQUNBLElBQU0seUJBQXlCLEdBQUcsVUFBVSxDQUFDLHFCQUFELENBQTVDLEMsQ0FFQTtBQUVBOztBQUVBLElBQU0sZ0JBQWdCLCtEQUNuQixLQURtQix3Q0FFakIsa0JBRmlCLGNBRUs7RUFDckIsY0FBYyxDQUFDLElBQUQsQ0FBZDtBQUNELENBSmlCLDJCQUtqQixhQUxpQixjQUtBO0VBQ2hCLFVBQVUsQ0FBQyxJQUFELENBQVY7QUFDRCxDQVBpQiwyQkFRakIsY0FSaUIsY0FRQztFQUNqQixXQUFXLENBQUMsSUFBRCxDQUFYO0FBQ0QsQ0FWaUIsMkJBV2pCLGFBWGlCLGNBV0E7RUFDaEIsVUFBVSxDQUFDLElBQUQsQ0FBVjtBQUNELENBYmlCLDJCQWNqQix1QkFkaUIsY0FjVTtFQUMxQixvQkFBb0IsQ0FBQyxJQUFELENBQXBCO0FBQ0QsQ0FoQmlCLDJCQWlCakIsbUJBakJpQixjQWlCTTtFQUN0QixnQkFBZ0IsQ0FBQyxJQUFELENBQWhCO0FBQ0QsQ0FuQmlCLDJCQW9CakIsc0JBcEJpQixjQW9CUztFQUN6QixtQkFBbUIsQ0FBQyxJQUFELENBQW5CO0FBQ0QsQ0F0QmlCLDJCQXVCakIsa0JBdkJpQixjQXVCSztFQUNyQixlQUFlLENBQUMsSUFBRCxDQUFmO0FBQ0QsQ0F6QmlCLDJCQTBCakIsNEJBMUJpQixjQTBCZTtFQUMvQix3QkFBd0IsQ0FBQyxJQUFELENBQXhCO0FBQ0QsQ0E1QmlCLDJCQTZCakIsd0JBN0JpQixjQTZCVztFQUMzQixvQkFBb0IsQ0FBQyxJQUFELENBQXBCO0FBQ0QsQ0EvQmlCLDJCQWdDakIsd0JBaENpQixjQWdDVztFQUMzQixJQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxJQUFELENBQXpDO0VBQ0EsV0FBVyxDQUFDLGFBQVosQ0FBMEIsc0JBQTFCLEVBQWtELEtBQWxEO0FBQ0QsQ0FuQ2lCLDJCQW9DakIsdUJBcENpQixjQW9DVTtFQUMxQixJQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQyxJQUFELENBQXhDO0VBQ0EsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0QsQ0F2Q2lCLDZFQTBDakIsb0JBMUNpQixZQTBDSyxLQTFDTCxFQTBDWTtFQUM1QixJQUFNLE9BQU8sR0FBRyxLQUFLLE9BQUwsQ0FBYSxjQUE3Qjs7RUFDQSxJQUFJLFVBQUcsS0FBSyxDQUFDLE9BQVQsTUFBdUIsT0FBM0IsRUFBb0M7SUFDbEMsS0FBSyxDQUFDLGNBQU47RUFDRDtBQUNGLENBL0NpQiw0RkFrRGpCLDBCQWxEaUIsWUFrRFcsS0FsRFgsRUFrRGtCO0VBQ2xDLElBQUksS0FBSyxDQUFDLE9BQU4sS0FBa0IsYUFBdEIsRUFBcUM7SUFDbkMsaUJBQWlCLENBQUMsSUFBRCxDQUFqQjtFQUNEO0FBQ0YsQ0F0RGlCLDZCQXVEakIsYUF2RGlCLEVBdURELElBQUEsZ0JBQUEsRUFBTztFQUN0QixFQUFFLEVBQUUsZ0JBRGtCO0VBRXRCLE9BQU8sRUFBRSxnQkFGYTtFQUd0QixJQUFJLEVBQUUsa0JBSGdCO0VBSXRCLFNBQVMsRUFBRSxrQkFKVztFQUt0QixJQUFJLEVBQUUsa0JBTGdCO0VBTXRCLFNBQVMsRUFBRSxrQkFOVztFQU90QixLQUFLLEVBQUUsbUJBUGU7RUFRdEIsVUFBVSxFQUFFLG1CQVJVO0VBU3RCLElBQUksRUFBRSxrQkFUZ0I7RUFVdEIsR0FBRyxFQUFFLGlCQVZpQjtFQVd0QixRQUFRLEVBQUUsc0JBWFk7RUFZdEIsTUFBTSxFQUFFLG9CQVpjO0VBYXRCLGtCQUFrQiwyQkFiSTtFQWN0QixnQkFBZ0I7QUFkTSxDQUFQLENBdkRDLDZCQXVFakIsb0JBdkVpQixFQXVFTSxJQUFBLGdCQUFBLEVBQU87RUFDN0IsR0FBRyxFQUFFLHlCQUF5QixDQUFDLFFBREY7RUFFN0IsYUFBYSx5QkFBeUIsQ0FBQztBQUZWLENBQVAsQ0F2RU4sNkJBMkVqQixjQTNFaUIsRUEyRUEsSUFBQSxnQkFBQSxFQUFPO0VBQ3ZCLEVBQUUsRUFBRSxpQkFEbUI7RUFFdkIsT0FBTyxFQUFFLGlCQUZjO0VBR3ZCLElBQUksRUFBRSxtQkFIaUI7RUFJdkIsU0FBUyxFQUFFLG1CQUpZO0VBS3ZCLElBQUksRUFBRSxtQkFMaUI7RUFNdkIsU0FBUyxFQUFFLG1CQU5ZO0VBT3ZCLEtBQUssRUFBRSxvQkFQZ0I7RUFRdkIsVUFBVSxFQUFFLG9CQVJXO0VBU3ZCLElBQUksRUFBRSxtQkFUaUI7RUFVdkIsR0FBRyxFQUFFLGtCQVZrQjtFQVd2QixRQUFRLEVBQUUsdUJBWGE7RUFZdkIsTUFBTSxFQUFFO0FBWmUsQ0FBUCxDQTNFQSw2QkF5RmpCLHFCQXpGaUIsRUF5Rk8sSUFBQSxnQkFBQSxFQUFPO0VBQzlCLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxRQURGO0VBRTlCLGFBQWEsMEJBQTBCLENBQUM7QUFGVixDQUFQLENBekZQLDZCQTZGakIsYUE3RmlCLEVBNkZELElBQUEsZ0JBQUEsRUFBTztFQUN0QixFQUFFLEVBQUUsZ0JBRGtCO0VBRXRCLE9BQU8sRUFBRSxnQkFGYTtFQUd0QixJQUFJLEVBQUUsa0JBSGdCO0VBSXRCLFNBQVMsRUFBRSxrQkFKVztFQUt0QixJQUFJLEVBQUUsa0JBTGdCO0VBTXRCLFNBQVMsRUFBRSxrQkFOVztFQU90QixLQUFLLEVBQUUsbUJBUGU7RUFRdEIsVUFBVSxFQUFFLG1CQVJVO0VBU3RCLElBQUksRUFBRSxrQkFUZ0I7RUFVdEIsR0FBRyxFQUFFLGlCQVZpQjtFQVd0QixRQUFRLEVBQUUsc0JBWFk7RUFZdEIsTUFBTSxFQUFFO0FBWmMsQ0FBUCxDQTdGQyw2QkEyR2pCLG9CQTNHaUIsRUEyR00sSUFBQSxnQkFBQSxFQUFPO0VBQzdCLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxRQURGO0VBRTdCLGFBQWEseUJBQXlCLENBQUM7QUFGVixDQUFQLENBM0dOLDZCQStHakIsb0JBL0dpQixZQStHSyxLQS9HTCxFQStHWTtFQUM1QixLQUFLLE9BQUwsQ0FBYSxjQUFiLEdBQThCLEtBQUssQ0FBQyxPQUFwQztBQUNELENBakhpQiw2QkFrSGpCLFdBbEhpQixZQWtISixLQWxISSxFQWtIRztFQUNuQixJQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFBLEVBQU87SUFDcEIsTUFBTSxFQUFFO0VBRFksQ0FBUCxDQUFmO0VBSUEsTUFBTSxDQUFDLEtBQUQsQ0FBTjtBQUNELENBeEhpQiwwR0EySGpCLDBCQTNIaUIsY0EySGE7RUFDN0IsaUJBQWlCLENBQUMsSUFBRCxDQUFqQjtBQUNELENBN0hpQiw4QkE4SGpCLFdBOUhpQixZQThISixLQTlISSxFQThIRztFQUNuQixJQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsS0FBSyxDQUFDLGFBQXBCLENBQUwsRUFBeUM7SUFDdkMsWUFBWSxDQUFDLElBQUQsQ0FBWjtFQUNEO0FBQ0YsQ0FsSWlCLGdGQXFJakIsMEJBcklpQixjQXFJYTtFQUM3QixvQkFBb0IsQ0FBQyxJQUFELENBQXBCO0VBQ0EsdUJBQXVCLENBQUMsSUFBRCxDQUF2QjtBQUNELENBeElpQixzQkFBdEI7O0FBNElBLElBQUksQ0FBQyxXQUFXLEVBQWhCLEVBQW9CO0VBQUE7O0VBQ2xCLGdCQUFnQixDQUFDLFNBQWpCLHVFQUNHLDJCQURILGNBQ2tDO0lBQzlCLHVCQUF1QixDQUFDLElBQUQsQ0FBdkI7RUFDRCxDQUhILDBDQUlHLGNBSkgsY0FJcUI7SUFDakIsd0JBQXdCLENBQUMsSUFBRCxDQUF4QjtFQUNELENBTkgsMENBT0csYUFQSCxjQU9vQjtJQUNoQix1QkFBdUIsQ0FBQyxJQUFELENBQXZCO0VBQ0QsQ0FUSDtBQVdEOztBQUVELElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBRCxFQUFtQjtFQUM1QyxJQUQ0QyxnQkFDdkMsSUFEdUMsRUFDakM7SUFDVCxNQUFNLENBQUMsV0FBRCxFQUFjLElBQWQsQ0FBTixDQUEwQixPQUExQixDQUFrQyxVQUFDLFlBQUQsRUFBa0I7TUFDbEQsSUFBRyxDQUFDLFlBQVksQ0FBQyxTQUFiLENBQXVCLFFBQXZCLENBQWdDLDZCQUFoQyxDQUFKLEVBQW1FO1FBQ2pFLGlCQUFpQixDQUFDLFlBQUQsQ0FBakI7TUFDRDtJQUNGLENBSkQ7RUFLRCxDQVAyQztFQVE1QyxXQVI0Qyx1QkFRaEMsT0FSZ0MsRUFRdkI7SUFDbkIsSUFBSSxHQUFHLE9BQVA7SUFDQSxZQUFZLEdBQUcsQ0FDYixJQUFJLENBQUMsT0FEUSxFQUViLElBQUksQ0FBQyxRQUZRLEVBR2IsSUFBSSxDQUFDLEtBSFEsRUFJYixJQUFJLENBQUMsS0FKUSxFQUtiLElBQUksQ0FBQyxHQUxRLEVBTWIsSUFBSSxDQUFDLElBTlEsRUFPYixJQUFJLENBQUMsSUFQUSxFQVFiLElBQUksQ0FBQyxNQVJRLEVBU2IsSUFBSSxDQUFDLFNBVFEsRUFVYixJQUFJLENBQUMsT0FWUSxFQVdiLElBQUksQ0FBQyxRQVhRLEVBWWIsSUFBSSxDQUFDLFFBWlEsQ0FBZjtJQWNBLGtCQUFrQixHQUFHLENBQ25CLElBQUksQ0FBQyxNQURjLEVBRW5CLElBQUksQ0FBQyxPQUZjLEVBR25CLElBQUksQ0FBQyxTQUhjLEVBSW5CLElBQUksQ0FBQyxRQUpjLEVBS25CLElBQUksQ0FBQyxNQUxjLEVBTW5CLElBQUksQ0FBQyxRQU5jLEVBT25CLElBQUksQ0FBQyxNQVBjLENBQXJCO0VBU0QsQ0FqQzJDO0VBa0M1QyxvQkFBb0IsRUFBcEIsb0JBbEM0QztFQW1DNUMsT0FBTyxFQUFQLE9BbkM0QztFQW9DNUMsTUFBTSxFQUFOLE1BcEM0QztFQXFDNUMsa0JBQWtCLEVBQWxCLGtCQXJDNEM7RUFzQzVDLGdCQUFnQixFQUFoQixnQkF0QzRDO0VBdUM1QyxpQkFBaUIsRUFBakIsaUJBdkM0QztFQXdDNUMsY0FBYyxFQUFkLGNBeEM0QztFQXlDNUMsdUJBQXVCLEVBQXZCO0FBekM0QyxDQUFuQixDQUEzQixDLENBNENBOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQWpCOzs7QUNydkVBOzs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBVCxDQUF1QixTQUF2QixFQUFpQztFQUM3QixLQUFLLFNBQUwsR0FBaUIsU0FBakI7RUFDQSxLQUFLLE1BQUwsR0FBYyxTQUFTLENBQUMsc0JBQVYsQ0FBaUMsc0JBQWpDLEVBQXlELENBQXpELENBQWQsQ0FGNkIsQ0FJN0I7O0VBQ0EsSUFBRyxDQUFDLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsd0NBQTdCLENBQUosRUFBMkU7SUFDdkUsS0FBSyxTQUFMLENBQWUsZ0JBQWYsQ0FBZ0MsbUJBQWhDLEVBQXFELENBQXJELEVBQXdELFlBQXhELENBQXFFLGNBQXJFLEVBQXFGLE1BQXJGO0VBQ0g7O0VBRUQsS0FBSyxtQkFBTDtBQUNIO0FBRUQ7QUFDQTtBQUNBOzs7QUFDQSxZQUFZLENBQUMsU0FBYixDQUF1QixJQUF2QixHQUE4QixZQUFVO0VBQ3BDLEtBQUssWUFBTCxHQUFvQixJQUFJLG9CQUFKLENBQWEsS0FBSyxNQUFsQixFQUEwQixJQUExQixFQUFwQjtFQUVBLElBQUksY0FBYyxHQUFHLEtBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLDBCQUFoQyxDQUFyQjs7RUFDQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQWxDLEVBQTBDLENBQUMsRUFBM0MsRUFBOEM7SUFDMUMsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUQsQ0FBM0I7SUFDQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQWpDO0VBQ0g7QUFDSixDQVJEO0FBVUE7QUFDQTtBQUNBOzs7QUFDQSxZQUFZLENBQUMsU0FBYixDQUF1QixtQkFBdkIsR0FBNkMsWUFBVTtFQUNuRCxJQUFJLFlBQVksR0FBRyxLQUFLLFNBQUwsQ0FBZSxhQUFmLENBQTZCLHdDQUE3QixDQUFuQjtFQUNBLEtBQUssU0FBTCxDQUFlLHNCQUFmLENBQXNDLHNCQUF0QyxFQUE4RCxDQUE5RCxFQUFpRSxzQkFBakUsQ0FBd0YsZ0JBQXhGLEVBQTBHLENBQTFHLEVBQTZHLFNBQTdHLEdBQXlILFlBQVksQ0FBQyxTQUF0STtBQUNILENBSEQ7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsYUFBdkIsR0FBdUMsVUFBUyxDQUFULEVBQVc7RUFDOUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFsQjtFQUNBLEVBQUUsQ0FBQyxVQUFILENBQWMsYUFBZCxDQUE0Qix5QkFBNUIsRUFBdUQsZUFBdkQsQ0FBdUUsY0FBdkU7RUFDQSxFQUFFLENBQUMsWUFBSCxDQUFnQixjQUFoQixFQUFnQyxNQUFoQztFQUVBLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUF5QixVQUF6QixDQUFvQyxzQkFBcEMsQ0FBMkQsc0JBQTNELEVBQW1GLENBQW5GLENBQWI7RUFDQSxJQUFJLGFBQWEsR0FBRyxJQUFJLEtBQUosQ0FBVSx1QkFBVixDQUFwQjtFQUNBLGFBQWEsQ0FBQyxNQUFkLEdBQXVCLEtBQUssTUFBNUI7RUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixhQUFyQjtFQUNBLEtBQUssbUJBQUwsR0FUOEMsQ0FXOUM7O0VBQ0EsSUFBSSxZQUFZLEdBQUcsSUFBSSxvQkFBSixDQUFhLE1BQWIsQ0FBbkI7RUFDQSxZQUFZLENBQUMsSUFBYjtBQUNILENBZEQ7O2VBZ0JlLFk7Ozs7QUM3RGY7Ozs7Ozs7QUFDQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQUQsQ0FBM0I7O0FBQ0EsSUFBTSxNQUFNLEdBQUcsdUJBQWY7QUFDQSxJQUFNLDBCQUEwQixHQUFHLGtDQUFuQyxDLENBQXVFOztBQUN2RSxJQUFNLE1BQU0sR0FBRyxnQkFBZjtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVMsUUFBVCxDQUFtQixhQUFuQixFQUFrQztFQUNoQyxLQUFLLGFBQUwsR0FBcUIsYUFBckI7RUFDQSxLQUFLLFFBQUwsR0FBZ0IsSUFBaEI7RUFDQSxLQUFLLDZCQUFMLEdBQXFDLEtBQXJDOztFQUVBLElBQUcsS0FBSyxhQUFMLEtBQXVCLElBQXZCLElBQThCLEtBQUssYUFBTCxLQUF1QixTQUF4RCxFQUFrRTtJQUNoRSxNQUFNLElBQUksS0FBSixzREFBTjtFQUNEOztFQUNELElBQUksVUFBVSxHQUFHLEtBQUssYUFBTCxDQUFtQixZQUFuQixDQUFnQyxNQUFoQyxDQUFqQjs7RUFDQSxJQUFHLFVBQVUsS0FBSyxJQUFmLElBQXVCLFVBQVUsS0FBSyxTQUF6QyxFQUFtRDtJQUNqRCxNQUFNLElBQUksS0FBSixDQUFVLDhEQUE0RCxNQUF0RSxDQUFOO0VBQ0Q7O0VBQ0QsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsR0FBbkIsRUFBd0IsRUFBeEIsQ0FBeEIsQ0FBZjs7RUFDQSxJQUFHLFFBQVEsS0FBSyxJQUFiLElBQXFCLFFBQVEsS0FBSyxTQUFyQyxFQUErQztJQUM3QyxNQUFNLElBQUksS0FBSixDQUFVLHVEQUFWLENBQU47RUFDRDs7RUFDRCxLQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDtBQUVEO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsSUFBbkIsR0FBMEIsWUFBVztFQUNuQyxJQUFHLEtBQUssYUFBTCxLQUF1QixJQUF2QixJQUErQixLQUFLLGFBQUwsS0FBdUIsU0FBdEQsSUFBbUUsS0FBSyxRQUFMLEtBQWtCLElBQXJGLElBQTZGLEtBQUssUUFBTCxLQUFrQixTQUFsSCxFQUE0SDtJQUUxSCxJQUFHLEtBQUssYUFBTCxDQUFtQixVQUFuQixDQUE4QixTQUE5QixDQUF3QyxRQUF4QyxDQUFpRCxpQ0FBakQsS0FBdUYsS0FBSyxhQUFMLENBQW1CLFVBQW5CLENBQThCLFNBQTlCLENBQXdDLFFBQXhDLENBQWlELGlDQUFqRCxDQUExRixFQUE4SztNQUM1SyxLQUFLLDZCQUFMLEdBQXFDLElBQXJDO0lBQ0QsQ0FKeUgsQ0FNMUg7OztJQUNBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUF1QyxDQUF2QyxFQUEyQyxtQkFBM0MsQ0FBK0QsT0FBL0QsRUFBd0UsWUFBeEU7SUFDQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBdUMsQ0FBdkMsRUFBMkMsZ0JBQTNDLENBQTRELE9BQTVELEVBQXFFLFlBQXJFLEVBUjBILENBUzFIOztJQUNBLEtBQUssYUFBTCxDQUFtQixtQkFBbkIsQ0FBdUMsT0FBdkMsRUFBZ0QsY0FBaEQ7SUFDQSxLQUFLLGFBQUwsQ0FBbUIsZ0JBQW5CLENBQW9DLE9BQXBDLEVBQTZDLGNBQTdDO0lBQ0EsSUFBSSxPQUFPLEdBQUcsSUFBZCxDQVowSCxDQWExSDs7SUFDQSxJQUFHLEtBQUssNkJBQVIsRUFBdUM7TUFDckMsSUFBSSxPQUFPLEdBQUcsS0FBSyxhQUFuQjs7TUFDQSxJQUFJLE1BQU0sQ0FBQyxvQkFBWCxFQUFpQztRQUMvQjtRQUNBLElBQUksUUFBUSxHQUFHLElBQUksb0JBQUosQ0FBeUIsVUFBVSxPQUFWLEVBQW1CO1VBQ3pEO1VBQ0EsSUFBSSxPQUFPLENBQUUsQ0FBRixDQUFQLENBQWEsaUJBQWpCLEVBQW9DO1lBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsZUFBckIsTUFBMEMsT0FBOUMsRUFBdUQ7Y0FDckQsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsQ0FBOEIsYUFBOUIsRUFBNkMsTUFBN0M7WUFDRDtVQUNGLENBSkQsTUFJTztZQUNMO1lBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixNQUFpRCxNQUFyRCxFQUE2RDtjQUMzRCxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixFQUE2QyxPQUE3QztZQUNEO1VBQ0Y7UUFDRixDQVpjLEVBWVo7VUFDRCxJQUFJLEVBQUUsUUFBUSxDQUFDO1FBRGQsQ0FaWSxDQUFmO1FBZUEsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakI7TUFDRCxDQWxCRCxNQWtCTztRQUNMO1FBQ0EsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsU0FBVCxDQUF4QixFQUE2QztVQUMzQztVQUNBLElBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsZUFBckIsTUFBMEMsT0FBOUMsRUFBdUQ7WUFDckQsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsQ0FBOEIsYUFBOUIsRUFBNkMsTUFBN0M7VUFDRCxDQUZELE1BRU07WUFDSixPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixFQUE2QyxPQUE3QztVQUNEO1FBQ0YsQ0FQRCxNQU9PO1VBQ0w7VUFDQSxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixFQUE2QyxPQUE3QztRQUNEOztRQUNELE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFZO1VBQzVDLElBQUksb0JBQW9CLENBQUMsT0FBTyxDQUFDLFNBQVQsQ0FBeEIsRUFBNkM7WUFDM0MsSUFBSSxPQUFPLENBQUMsWUFBUixDQUFxQixlQUFyQixNQUEwQyxPQUE5QyxFQUF1RDtjQUNyRCxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixFQUE2QyxNQUE3QztZQUNELENBRkQsTUFFTTtjQUNKLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLENBQThCLGFBQTlCLEVBQTZDLE9BQTdDO1lBQ0Q7VUFDRixDQU5ELE1BTU87WUFDTCxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixhQUE5QixFQUE2QyxPQUE3QztVQUNEO1FBQ0YsQ0FWRDtNQVdEO0lBQ0Y7O0lBR0QsUUFBUSxDQUFDLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDLGFBQXRDO0lBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLGFBQW5DO0VBQ0Q7QUFDRixDQWxFRDtBQW9FQTtBQUNBO0FBQ0E7OztBQUNBLFFBQVEsQ0FBQyxTQUFULENBQW1CLElBQW5CLEdBQTBCLFlBQVU7RUFDbEMsTUFBTSxDQUFDLEtBQUssYUFBTixDQUFOO0FBQ0QsQ0FGRDtBQUlBO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsSUFBbkIsR0FBMEIsWUFBVTtFQUNsQyxNQUFNLENBQUMsS0FBSyxhQUFOLENBQU47QUFDRCxDQUZEOztBQUlBLElBQUksYUFBYSxHQUFHLFNBQWhCLGFBQWdCLENBQVMsS0FBVCxFQUFlO0VBQ2pDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFOLElBQWUsS0FBSyxDQUFDLE9BQS9COztFQUNBLElBQUksR0FBRyxLQUFLLEVBQVosRUFBZ0I7SUFDZCxRQUFRLENBQUMsS0FBRCxDQUFSO0VBQ0Q7QUFDRixDQUxEO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQWEsQ0FBVSxNQUFWLEVBQWtCO0VBQ2pDLE9BQU8sTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLENBQVA7QUFDRCxDQUZEO0FBSUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUksUUFBUSxHQUFHLFNBQVgsUUFBVyxHQUF1QjtFQUFBLElBQWIsS0FBYSx1RUFBTCxJQUFLO0VBQ3BDLElBQUksT0FBTyxHQUFHLEtBQWQ7RUFDQSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFiO0VBRUEsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLHNCQUFULENBQWdDLGVBQWhDLENBQXJCOztFQUNBLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBZCxFQUFpQixFQUFFLEdBQUcsY0FBYyxDQUFDLE1BQXJDLEVBQTZDLEVBQUUsRUFBL0MsRUFBbUQ7SUFDakQsSUFBSSxxQkFBcUIsR0FBRyxjQUFjLENBQUUsRUFBRixDQUExQztJQUNBLElBQUksU0FBUyxHQUFHLHFCQUFxQixDQUFDLGFBQXRCLENBQW9DLE1BQU0sR0FBQyx3QkFBM0MsQ0FBaEI7O0lBQ0EsSUFBRyxTQUFTLEtBQUssSUFBakIsRUFBc0I7TUFDcEIsT0FBTyxHQUFHLElBQVY7TUFDQSxJQUFJLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxhQUF0QixDQUFvQyxNQUFJLFNBQVMsQ0FBQyxZQUFWLENBQXVCLE1BQXZCLEVBQStCLE9BQS9CLENBQXVDLEdBQXZDLEVBQTRDLEVBQTVDLENBQXhDLENBQWY7O01BRUUsSUFBSSxRQUFRLEtBQUssSUFBYixJQUFxQixTQUFTLEtBQUssSUFBdkMsRUFBNkM7UUFDM0MsSUFBRyxvQkFBb0IsQ0FBQyxTQUFELENBQXZCLEVBQW1DO1VBQ2pDLElBQUcsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsZUFBdkIsTUFBNEMsSUFBL0MsRUFBb0Q7WUFDbEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFKLENBQVUsb0JBQVYsQ0FBakI7WUFDQSxTQUFTLENBQUMsYUFBVixDQUF3QixVQUF4QjtVQUNEOztVQUNELFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE9BQXhDO1VBQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7VUFDQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztRQUNEO01BQ0Y7SUFDSjtFQUNGOztFQUVELElBQUcsT0FBTyxJQUFJLEtBQUssS0FBSyxJQUF4QixFQUE2QjtJQUMzQixLQUFLLENBQUMsd0JBQU47RUFDRDtBQUNGLENBN0JEOztBQThCQSxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQVMsQ0FBVSxFQUFWLEVBQWM7RUFDekIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLHFCQUFILEVBQVg7RUFBQSxJQUNFLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBUCxJQUFzQixRQUFRLENBQUMsZUFBVCxDQUF5QixVQUQ5RDtFQUFBLElBRUUsU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFQLElBQXNCLFFBQVEsQ0FBQyxlQUFULENBQXlCLFNBRjdEO0VBR0EsT0FBTztJQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBTCxHQUFXLFNBQWxCO0lBQTZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBTCxHQUFZO0VBQS9DLENBQVA7QUFDRCxDQUxEOztBQU9BLElBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWlCLENBQVUsS0FBVixFQUFxQztFQUFBLElBQXBCLFVBQW9CLHVFQUFQLEtBQU87RUFDeEQsS0FBSyxDQUFDLGVBQU47RUFDQSxLQUFLLENBQUMsY0FBTjtFQUVBLE1BQU0sQ0FBQyxJQUFELEVBQU8sVUFBUCxDQUFOO0FBRUQsQ0FORDs7QUFRQSxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQVMsQ0FBUyxNQUFULEVBQW9DO0VBQUEsSUFBbkIsVUFBbUIsdUVBQU4sS0FBTTtFQUMvQyxJQUFJLFNBQVMsR0FBRyxNQUFoQjtFQUNBLElBQUksUUFBUSxHQUFHLElBQWY7O0VBQ0EsSUFBRyxTQUFTLEtBQUssSUFBZCxJQUFzQixTQUFTLEtBQUssU0FBdkMsRUFBaUQ7SUFDL0MsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsTUFBdkIsQ0FBakI7O0lBQ0EsSUFBRyxVQUFVLEtBQUssSUFBZixJQUF1QixVQUFVLEtBQUssU0FBekMsRUFBbUQ7TUFDakQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEdBQW5CLEVBQXdCLEVBQXhCLENBQXhCLENBQVg7SUFDRDtFQUNGOztFQUNELElBQUcsU0FBUyxLQUFLLElBQWQsSUFBc0IsU0FBUyxLQUFLLFNBQXBDLElBQWlELFFBQVEsS0FBSyxJQUE5RCxJQUFzRSxRQUFRLEtBQUssU0FBdEYsRUFBZ0c7SUFDOUY7SUFFQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsSUFBdEI7SUFDQSxRQUFRLENBQUMsS0FBVCxDQUFlLEtBQWYsR0FBdUIsSUFBdkI7O0lBRUEsSUFBRyxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixNQUE0QyxNQUE1QyxJQUFzRCxVQUF6RCxFQUFvRTtNQUNsRTtNQUNBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE9BQXhDO01BQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7TUFDQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztNQUNBLElBQUksVUFBVSxHQUFHLElBQUksS0FBSixDQUFVLG9CQUFWLENBQWpCO01BQ0EsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsVUFBeEI7SUFDRCxDQVBELE1BT0s7TUFFSCxJQUFHLENBQUMsUUFBUSxDQUFDLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDLFNBQXpDLENBQW1ELFFBQW5ELENBQTRELG1CQUE1RCxDQUFKLEVBQXFGO1FBQ25GLFFBQVE7TUFDVCxDQUpFLENBS0g7OztNQUNBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE1BQXhDO01BQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBMEIsV0FBMUI7TUFDQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxPQUFyQztNQUNBLElBQUksU0FBUyxHQUFHLElBQUksS0FBSixDQUFVLG1CQUFWLENBQWhCO01BQ0EsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsU0FBeEI7TUFDQSxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBRCxDQUF6Qjs7TUFFQSxJQUFHLFlBQVksQ0FBQyxJQUFiLEdBQW9CLENBQXZCLEVBQXlCO1FBQ3ZCLFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBZixHQUFzQixLQUF0QjtRQUNBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixNQUF2QjtNQUNEOztNQUNELElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFiLEdBQW9CLFFBQVEsQ0FBQyxXQUF6Qzs7TUFDQSxJQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBbEIsRUFBNkI7UUFDM0IsUUFBUSxDQUFDLEtBQVQsQ0FBZSxJQUFmLEdBQXNCLE1BQXRCO1FBQ0EsUUFBUSxDQUFDLEtBQVQsQ0FBZSxLQUFmLEdBQXVCLEtBQXZCO01BQ0Q7O01BRUQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQUQsQ0FBeEI7O01BRUEsSUFBRyxXQUFXLENBQUMsSUFBWixHQUFtQixDQUF0QixFQUF3QjtRQUV0QixRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsS0FBdEI7UUFDQSxRQUFRLENBQUMsS0FBVCxDQUFlLEtBQWYsR0FBdUIsTUFBdkI7TUFDRDs7TUFDRCxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQVosR0FBbUIsUUFBUSxDQUFDLFdBQXBDOztNQUNBLElBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFsQixFQUE2QjtRQUUzQixRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsTUFBdEI7UUFDQSxRQUFRLENBQUMsS0FBVCxDQUFlLEtBQWYsR0FBdUIsS0FBdkI7TUFDRDtJQUNGO0VBRUY7QUFDRixDQTdERDs7QUErREEsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQVUsS0FBVixFQUFpQixhQUFqQixFQUErQjtFQUM3QyxJQUFHLEtBQUssQ0FBQyxVQUFOLENBQWlCLE9BQWpCLEtBQTZCLGFBQWhDLEVBQThDO0lBQzVDLE9BQU8sSUFBUDtFQUNELENBRkQsTUFFTyxJQUFHLGFBQWEsS0FBSyxNQUFsQixJQUE0QixLQUFLLENBQUMsVUFBTixDQUFpQixPQUFqQixLQUE2QixNQUE1RCxFQUFtRTtJQUN4RSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBUCxFQUFtQixhQUFuQixDQUFoQjtFQUNELENBRk0sTUFFRjtJQUNILE9BQU8sS0FBUDtFQUNEO0FBQ0YsQ0FSRDs7QUFVQSxJQUFJLFlBQVksR0FBRyxTQUFmLFlBQWUsQ0FBVSxHQUFWLEVBQWM7RUFDL0IsSUFBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxFQUF5QyxTQUF6QyxDQUFtRCxRQUFuRCxDQUE0RCxtQkFBNUQsQ0FBSixFQUFxRjtJQUNuRixJQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHdCQUF2QixNQUFxRCxJQUFyRCxJQUE2RCxDQUFDLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBWCxDQUFxQixRQUFyQixDQUE4QixtQkFBOUIsQ0FBakUsRUFBcUg7TUFDbkgsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQTBCLE1BQU0sR0FBQyxzQkFBakMsQ0FBcEI7O01BQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBbEMsRUFBMEMsQ0FBQyxFQUEzQyxFQUErQztRQUM3QyxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBRCxDQUE3QjtRQUNBLElBQUksUUFBUSxHQUFHLElBQWY7UUFDQSxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBVixDQUF1QixNQUF2QixDQUFqQjs7UUFDQSxJQUFJLFVBQVUsS0FBSyxJQUFmLElBQXVCLFVBQVUsS0FBSyxTQUExQyxFQUFxRDtVQUNuRCxJQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEdBQW5CLE1BQTRCLENBQUMsQ0FBaEMsRUFBa0M7WUFDaEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEdBQW5CLEVBQXdCLEVBQXhCLENBQWI7VUFDRDs7VUFDRCxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBWDtRQUNEOztRQUNELElBQUksb0JBQW9CLENBQUMsU0FBRCxDQUFwQixJQUFvQyxTQUFTLENBQUMsU0FBRCxFQUFZLFFBQVosQ0FBVCxJQUFrQyxDQUFDLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBWCxDQUFxQixRQUFyQixDQUE4QixTQUE5QixDQUEzRSxFQUFzSDtVQUNwSDtVQUNBLElBQUksR0FBRyxDQUFDLE1BQUosS0FBZSxTQUFuQixFQUE4QjtZQUM1QjtZQUNBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE9BQXhDO1lBQ0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7WUFDQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztZQUNBLElBQUksVUFBVSxHQUFHLElBQUksS0FBSixDQUFVLG9CQUFWLENBQWpCO1lBQ0EsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsVUFBeEI7VUFDRDtRQUNGO01BQ0Y7SUFDRjtFQUNGO0FBQ0YsQ0E1QkQ7O0FBOEJBLElBQUksb0JBQW9CLEdBQUcsU0FBdkIsb0JBQXVCLENBQVUsU0FBVixFQUFvQjtFQUM3QyxJQUFHLENBQUMsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsUUFBcEIsQ0FBNkIsMEJBQTdCLENBQUosRUFBNkQ7SUFDM0Q7SUFDQSxJQUFHLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFNBQXJCLENBQStCLFFBQS9CLENBQXdDLGlDQUF4QyxLQUE4RSxTQUFTLENBQUMsVUFBVixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxpQ0FBeEMsQ0FBakYsRUFBNko7TUFDM0o7TUFDQSxJQUFJLE1BQU0sQ0FBQyxVQUFQLElBQXFCLHNCQUFzQixDQUFDLFNBQUQsQ0FBL0MsRUFBNEQ7UUFDMUQ7UUFDQSxPQUFPLElBQVA7TUFDRDtJQUNGLENBTkQsTUFNTTtNQUNKO01BQ0EsT0FBTyxJQUFQO0lBQ0Q7RUFDRjs7RUFFRCxPQUFPLEtBQVA7QUFDRCxDQWhCRDs7QUFrQkEsSUFBSSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBeUIsQ0FBVSxNQUFWLEVBQWlCO0VBQzVDLElBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FBNEIsUUFBNUIsQ0FBcUMsaUNBQXJDLENBQUgsRUFBMkU7SUFDekUsT0FBTyxXQUFXLENBQUMsRUFBbkI7RUFDRDs7RUFDRCxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBQTRCLFFBQTVCLENBQXFDLGlDQUFyQyxDQUFILEVBQTJFO0lBQ3pFLE9BQU8sV0FBVyxDQUFDLEVBQW5CO0VBQ0Q7QUFDRixDQVBEOztlQVNlLFE7Ozs7QUN0VGY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQUNBLFNBQVMsWUFBVCxDQUF1QixPQUF2QixFQUFnQztFQUM5QixLQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLFlBQVksQ0FBQyxTQUFiLENBQXVCLElBQXZCLEdBQThCLFlBQVk7RUFDeEMsSUFBSSxDQUFDLEtBQUssT0FBVixFQUFtQjtJQUNqQjtFQUNEOztFQUNELEtBQUssT0FBTCxDQUFhLEtBQWI7RUFFQSxLQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBdkM7QUFDRCxDQVBEO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsV0FBdkIsR0FBcUMsVUFBVSxLQUFWLEVBQWlCO0VBQ3BELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFuQjs7RUFDQSxJQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFKLEVBQThCO0lBQzVCLEtBQUssQ0FBQyxjQUFOO0VBQ0Q7QUFDRixDQUxEO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxZQUFZLENBQUMsU0FBYixDQUF1QixXQUF2QixHQUFxQyxVQUFVLE9BQVYsRUFBbUI7RUFDdEQ7RUFDQSxJQUFJLE9BQU8sQ0FBQyxPQUFSLEtBQW9CLEdBQXBCLElBQTJCLE9BQU8sQ0FBQyxJQUFSLEtBQWlCLEtBQWhELEVBQXVEO0lBQ3JELE9BQU8sS0FBUDtFQUNEOztFQUVELElBQUksT0FBTyxHQUFHLEtBQUssa0JBQUwsQ0FBd0IsT0FBTyxDQUFDLElBQWhDLENBQWQ7RUFDQSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4QixDQUFiOztFQUNBLElBQUksQ0FBQyxNQUFMLEVBQWE7SUFDWCxPQUFPLEtBQVA7RUFDRDs7RUFFRCxJQUFJLGNBQWMsR0FBRyxLQUFLLDBCQUFMLENBQWdDLE1BQWhDLENBQXJCOztFQUNBLElBQUksQ0FBQyxjQUFMLEVBQXFCO0lBQ25CLE9BQU8sS0FBUDtFQUNELENBZnFELENBaUJ0RDtFQUNBO0VBQ0E7OztFQUNBLGNBQWMsQ0FBQyxjQUFmO0VBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBYTtJQUFFLGFBQWEsRUFBRTtFQUFqQixDQUFiO0VBRUEsT0FBTyxJQUFQO0FBQ0QsQ0F4QkQ7QUEwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxZQUFZLENBQUMsU0FBYixDQUF1QixrQkFBdkIsR0FBNEMsVUFBVSxHQUFWLEVBQWU7RUFDekQsSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQVosTUFBcUIsQ0FBQyxDQUExQixFQUE2QjtJQUMzQixPQUFPLEtBQVA7RUFDRDs7RUFFRCxPQUFPLEdBQUcsQ0FBQyxLQUFKLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBUDtBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFlBQVksQ0FBQyxTQUFiLENBQXVCLDBCQUF2QixHQUFvRCxVQUFVLE1BQVYsRUFBa0I7RUFDcEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLENBQWhCOztFQUVBLElBQUksU0FBSixFQUFlO0lBQ2IsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLG9CQUFWLENBQStCLFFBQS9CLENBQWQ7O0lBRUEsSUFBSSxPQUFPLENBQUMsTUFBWixFQUFvQjtNQUNsQixJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxDQUFELENBQTlCLENBRGtCLENBR2xCO01BQ0E7O01BQ0EsSUFBSSxNQUFNLENBQUMsSUFBUCxLQUFnQixVQUFoQixJQUE4QixNQUFNLENBQUMsSUFBUCxLQUFnQixPQUFsRCxFQUEyRDtRQUN6RCxPQUFPLGdCQUFQO01BQ0QsQ0FQaUIsQ0FTbEI7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBOzs7TUFDQSxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBakIsR0FBeUMsR0FBekQ7TUFDQSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMscUJBQVAsRUFBaEIsQ0FoQmtCLENBa0JsQjtNQUNBOztNQUNBLElBQUksU0FBUyxDQUFDLE1BQVYsSUFBb0IsTUFBTSxDQUFDLFdBQS9CLEVBQTRDO1FBQzFDLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFWLEdBQWdCLFNBQVMsQ0FBQyxNQUE1Qzs7UUFFQSxJQUFJLFdBQVcsR0FBRyxTQUFkLEdBQTBCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLENBQW5ELEVBQXNEO1VBQ3BELE9BQU8sZ0JBQVA7UUFDRDtNQUNGO0lBQ0Y7RUFDRjs7RUFFRCxPQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUFnQixNQUFNLENBQUMsWUFBUCxDQUFvQixJQUFwQixDQUFoQixHQUE0QyxJQUFuRSxLQUNMLE1BQU0sQ0FBQyxPQUFQLENBQWUsT0FBZixDQURGO0FBRUQsQ0F0Q0Q7O2VBd0NlLFk7Ozs7QUNySmY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQUNBLFNBQVMsS0FBVCxDQUFnQixNQUFoQixFQUF3QjtFQUNwQixLQUFLLE1BQUwsR0FBYyxNQUFkO0VBQ0EsSUFBSSxFQUFFLEdBQUcsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5QixJQUF6QixDQUFUO0VBQ0EsS0FBSyxRQUFMLEdBQWdCLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQix3Q0FBc0MsRUFBdEMsR0FBeUMsSUFBbkUsQ0FBaEI7QUFDSDtBQUVEO0FBQ0E7QUFDQTs7O0FBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsWUFBWTtFQUNqQyxJQUFJLFFBQVEsR0FBRyxLQUFLLFFBQXBCOztFQUNBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQTdCLEVBQXFDLENBQUMsRUFBdEMsRUFBeUM7SUFDdkMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFFLENBQUYsQ0FBdEI7SUFDQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBbEM7RUFDRDs7RUFDRCxJQUFJLE9BQU8sR0FBRyxLQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixvQkFBN0IsQ0FBZDs7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUE1QixFQUFvQyxDQUFDLEVBQXJDLEVBQXdDO0lBQ3RDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBRSxDQUFGLENBQXBCO0lBQ0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQWpDO0VBQ0Q7QUFDRixDQVhEO0FBYUE7QUFDQTtBQUNBOzs7QUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFXO0VBQ2hDLElBQUksWUFBWSxHQUFHLEtBQUssTUFBeEI7O0VBQ0EsSUFBRyxZQUFZLEtBQUssSUFBcEIsRUFBeUI7SUFDdkIsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsYUFBMUIsRUFBeUMsTUFBekM7SUFFQSxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFqQjtJQUNBLFVBQVUsQ0FBQyxTQUFYLENBQXFCLGtCQUFyQixFQUF5QyxJQUF6QyxFQUErQyxJQUEvQztJQUNBLFlBQVksQ0FBQyxhQUFiLENBQTJCLFVBQTNCO0lBRUEsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWhCO0lBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsV0FBckIsQ0FBaUMsU0FBakM7SUFFQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsWUFBMUQ7SUFDQSxRQUFRLENBQUMsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsU0FBeEMsRUFBbUQsSUFBbkQ7O0lBRUEsSUFBRyxDQUFDLGVBQWUsQ0FBQyxZQUFELENBQW5CLEVBQWtDO01BQ2hDLFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixPQUE3QixFQUFzQyxZQUF0QztJQUNEOztJQUNELElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQyxZQUFiLENBQTBCLG1CQUExQixDQUF0Qjs7SUFDQSxJQUFHLGVBQWUsS0FBSyxJQUF2QixFQUE0QjtNQUMxQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixlQUF4QixDQUFiOztNQUNBLElBQUcsTUFBTSxLQUFLLElBQWQsRUFBbUI7UUFDakIsTUFBTSxDQUFDLEtBQVA7TUFDRDs7TUFDRCxZQUFZLENBQUMsZUFBYixDQUE2QixtQkFBN0I7SUFDRDtFQUNGO0FBQ0YsQ0EzQkQ7QUE2QkE7QUFDQTtBQUNBOzs7QUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFtQjtFQUFBLElBQVQsQ0FBUyx1RUFBTCxJQUFLO0VBQ3hDLElBQUksWUFBWSxHQUFHLEtBQUssTUFBeEI7O0VBQ0EsSUFBRyxZQUFZLEtBQUssSUFBcEIsRUFBeUI7SUFDdkIsSUFBRyxDQUFDLEtBQUssSUFBVCxFQUFjO01BQ1osSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxZQUFULENBQXNCLElBQXRCLENBQWY7O01BQ0EsSUFBRyxRQUFRLEtBQUssSUFBaEIsRUFBcUI7UUFDbkIsUUFBUSxHQUFHLGtCQUFnQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxNQUFMLE1BQWlCLE9BQU8sSUFBUCxHQUFjLENBQS9CLElBQW9DLElBQS9DLENBQTNCO1FBQ0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCLFFBQTVCO01BQ0Q7O01BQ0QsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsbUJBQTFCLEVBQStDLFFBQS9DO0lBQ0QsQ0FSc0IsQ0FVdkI7OztJQUNBLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQiwrQkFBMUIsQ0FBbkI7O0lBQ0EsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFoQyxFQUF3QyxDQUFDLEVBQXpDLEVBQTRDO01BQzFDLElBQUksS0FBSixDQUFVLFlBQVksQ0FBQyxDQUFELENBQXRCLEVBQTJCLElBQTNCO0lBQ0Q7O0lBRUQsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsYUFBMUIsRUFBeUMsT0FBekM7SUFDQSxZQUFZLENBQUMsWUFBYixDQUEwQixVQUExQixFQUFzQyxJQUF0QztJQUVBLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCLENBQWhCO0lBQ0EsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsaUJBQXBCLEVBQXVDLElBQXZDLEVBQTZDLElBQTdDO0lBQ0EsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsU0FBM0I7SUFFQSxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFoQjtJQUNBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLEdBQXBCLENBQXdCLGdCQUF4QjtJQUNBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLElBQXZCLEVBQTZCLGdCQUE3QjtJQUNBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxFQUF5QyxXQUF6QyxDQUFxRCxTQUFyRDtJQUVBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxFQUF5QyxTQUF6QyxDQUFtRCxHQUFuRCxDQUF1RCxZQUF2RDtJQUVBLFlBQVksQ0FBQyxLQUFiO0lBRUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFNBQXJDLEVBQWdELElBQWhEOztJQUNBLElBQUcsQ0FBQyxlQUFlLENBQUMsWUFBRCxDQUFuQixFQUFrQztNQUNoQyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBbkM7SUFDRDtFQUVGO0FBQ0YsQ0F4Q0Q7QUEwQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQUksWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFVLEtBQVYsRUFBaUI7RUFDbEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQU4sSUFBZSxLQUFLLENBQUMsT0FBL0I7RUFDQSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FBbkI7RUFDQSxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUosQ0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FBVixDQUFuQjs7RUFDQSxJQUFJLEdBQUcsS0FBSyxFQUFaLEVBQWU7SUFDYixJQUFJLHFCQUFxQixHQUFHLFlBQVksQ0FBQyxnQkFBYixDQUE4Qiw2Q0FBOUIsQ0FBNUI7O0lBQ0EsSUFBRyxxQkFBcUIsQ0FBQyxNQUF0QixLQUFpQyxDQUFwQyxFQUFzQztNQUNwQyxZQUFZLENBQUMsSUFBYjtJQUNEO0VBQ0Y7QUFDRixDQVZEO0FBWUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNDLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtFQUNwQixJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FBcEI7O0VBQ0EsSUFBRyxhQUFhLEtBQUssSUFBckIsRUFBMEI7SUFDeEIsSUFBSSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsK1hBQS9CLENBQXhCO0lBRUEsSUFBSSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxDQUFELENBQTdDO0lBQ0EsSUFBSSxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFsQixHQUEyQixDQUE1QixDQUE1QztJQUVBLElBQUksWUFBWSxHQUFJLENBQUMsQ0FBQyxHQUFGLEtBQVUsS0FBVixJQUFtQixDQUFDLENBQUMsT0FBRixLQUFjLENBQXJEOztJQUVBLElBQUksQ0FBQyxZQUFMLEVBQW1CO01BQ2pCO0lBQ0Q7O0lBRUQsSUFBSyxDQUFDLENBQUMsUUFBUDtNQUFrQjtNQUFrQjtRQUNsQyxJQUFJLFFBQVEsQ0FBQyxhQUFULEtBQTJCLHFCQUEvQixFQUFzRDtVQUNwRCxvQkFBb0IsQ0FBQyxLQUFyQjtVQUNFLENBQUMsQ0FBQyxjQUFGO1FBQ0g7TUFDRixDQUxEO01BS087TUFBVTtRQUNmLElBQUksUUFBUSxDQUFDLGFBQVQsS0FBMkIsb0JBQS9CLEVBQXFEO1VBQ25ELHFCQUFxQixDQUFDLEtBQXRCO1VBQ0UsQ0FBQyxDQUFDLGNBQUY7UUFDSDtNQUNGO0VBQ0Y7QUFDRjs7QUFBQTs7QUFFRCxTQUFTLGVBQVQsQ0FBMEIsS0FBMUIsRUFBZ0M7RUFDOUIsSUFBRyxLQUFLLENBQUMsWUFBTixDQUFtQiwwQkFBbkIsTUFBbUQsSUFBdEQsRUFBMkQ7SUFDekQsT0FBTyxLQUFQO0VBQ0Q7O0VBQ0QsT0FBTyxJQUFQO0FBQ0Q7O2VBRWMsSzs7OztBQy9KZjs7Ozs7Ozs7Ozs7OztBQUNBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBRCxDQUF0Qjs7QUFFQSxJQUFNLEdBQUcsU0FBVDtBQUNBLElBQU0sU0FBUyxhQUFNLEdBQU4sT0FBZjtBQUNBLElBQU0sT0FBTyxrQkFBYjtBQUNBLElBQU0sWUFBWSxtQkFBbEI7QUFDQSxJQUFNLE9BQU8sYUFBYjtBQUNBLElBQU0sT0FBTyxhQUFNLFlBQU4sZUFBYjtBQUNBLElBQU0sT0FBTyxHQUFHLENBQUUsR0FBRixFQUFPLE9BQVAsRUFBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBaEI7QUFFQSxJQUFNLFlBQVksR0FBRyxtQkFBckI7QUFDQSxJQUFNLGFBQWEsR0FBRyxZQUF0QjtBQUVBO0FBQ0E7QUFDQTs7SUFDTSxVOzs7Ozs7OztJQUNKO0FBQ0Y7QUFDQTtJQUNFLGdCQUFRO01BQ04sTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFVBQWxDLEVBQThDLEtBQTlDO01BQ0EsVUFBVTtJQUNYO0lBRUQ7QUFDRjtBQUNBOzs7O1dBQ0Usb0JBQVk7TUFDVixNQUFNLENBQUMsbUJBQVAsQ0FBMkIsUUFBM0IsRUFBcUMsVUFBckMsRUFBaUQsS0FBakQ7SUFDRDs7Ozs7QUFHSDtBQUNBO0FBQ0E7OztBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxHQUFXO0VBQzVCLElBQUksTUFBTSxHQUFHLEtBQWI7RUFDQSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsQ0FBZDs7RUFDQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQTNCLEVBQW1DLENBQUMsRUFBcEMsRUFBd0M7SUFDdEMsSUFBRyxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBTyxDQUFDLENBQUQsQ0FBL0IsRUFBb0MsSUFBcEMsRUFBMEMsT0FBMUMsS0FBc0QsTUFBekQsRUFBaUU7TUFDL0QsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFNBQXJDO01BQ0EsTUFBTSxHQUFHLElBQVQ7SUFDRDtFQUNGLENBUjJCLENBVTVCOzs7RUFDQSxJQUFHLE1BQUgsRUFBVTtJQUNSLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixDQUFkOztJQUNBLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBM0IsRUFBbUMsQ0FBQyxFQUFwQyxFQUF3QztNQUN0QyxPQUFPLENBQUUsQ0FBRixDQUFQLENBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsU0FBdkM7SUFDRDs7SUFFRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsU0FBMUIsQ0FBZjs7SUFDQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQTVCLEVBQW9DLENBQUMsRUFBckMsRUFBeUM7TUFDdkMsUUFBUSxDQUFFLENBQUYsQ0FBUixDQUFjLGdCQUFkLENBQStCLE9BQS9CLEVBQXdDLFlBQVU7UUFDaEQ7UUFDQTtRQUNBO1FBRUE7UUFDQTtRQUdBO1FBQ0EsSUFBSSxRQUFRLEVBQVosRUFBZ0I7VUFDZCxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsS0FBckI7UUFDRDtNQUNGLENBYkQ7SUFjRDs7SUFFRCxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBMUIsQ0FBdkI7O0lBQ0EsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFsQyxFQUEwQyxDQUFDLEVBQTNDLEVBQThDO01BQzVDLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUQsQ0FBZixDQUF0QjtJQUNEO0VBRUY7O0VBRUQsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQVQsQ0FBYyxhQUFkLENBQTRCLFlBQTVCLENBQWY7O0VBRUEsSUFBSSxRQUFRLE1BQU0sTUFBZCxJQUF3QixNQUFNLENBQUMscUJBQVAsR0FBK0IsS0FBL0IsS0FBeUMsQ0FBckUsRUFBd0U7SUFDdEU7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsRUFBdUIsS0FBdkI7RUFDRDtBQUNGLENBbkREO0FBcURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVc7RUFBQSxPQUFNLFFBQVEsQ0FBQyxJQUFULENBQWMsU0FBZCxDQUF3QixRQUF4QixDQUFpQyxZQUFqQyxDQUFOO0FBQUEsQ0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFhLENBQUMsYUFBRCxFQUFtQjtFQUVwQztFQUNBLElBQU0sdUJBQXVCLEdBQUcsZ0xBQWhDO0VBQ0EsSUFBSSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsdUJBQS9CLENBQXhCO0VBQ0EsSUFBSSxZQUFZLEdBQUcsaUJBQWlCLENBQUUsQ0FBRixDQUFwQzs7RUFFQSxTQUFTLFVBQVQsQ0FBcUIsQ0FBckIsRUFBd0I7SUFDdEIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQU4sSUFBZSxLQUFLLENBQUMsT0FBL0IsQ0FEc0IsQ0FFdEI7O0lBQ0EsSUFBSSxHQUFHLEtBQUssQ0FBWixFQUFlO01BRWIsSUFBSSxXQUFXLEdBQUcsSUFBbEI7O01BQ0EsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQXJDLEVBQTZDLENBQUMsRUFBOUMsRUFBaUQ7UUFDL0MsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBbEIsR0FBMkIsQ0FBeEM7UUFDQSxJQUFJLE9BQU8sR0FBRyxpQkFBaUIsQ0FBRSxNQUFNLEdBQUcsQ0FBWCxDQUEvQjs7UUFDQSxJQUFJLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLENBQXRCLElBQTJCLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLENBQXRELEVBQXlEO1VBQ3ZELFdBQVcsR0FBRyxPQUFkO1VBQ0E7UUFDRDtNQUNGLENBVlksQ0FZYjs7O01BQ0EsSUFBSSxDQUFDLENBQUMsUUFBTixFQUFnQjtRQUNkLElBQUksUUFBUSxDQUFDLGFBQVQsS0FBMkIsWUFBL0IsRUFBNkM7VUFDM0MsQ0FBQyxDQUFDLGNBQUY7VUFDQSxXQUFXLENBQUMsS0FBWjtRQUNELENBSmEsQ0FNaEI7O01BQ0MsQ0FQRCxNQU9PO1FBQ0wsSUFBSSxRQUFRLENBQUMsYUFBVCxLQUEyQixXQUEvQixFQUE0QztVQUMxQyxDQUFDLENBQUMsY0FBRjtVQUNBLFlBQVksQ0FBQyxLQUFiO1FBQ0Q7TUFDRjtJQUNGLENBN0JxQixDQStCdEI7OztJQUNBLElBQUksQ0FBQyxDQUFDLEdBQUYsS0FBVSxRQUFkLEVBQXdCO01BQ3RCLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixLQUFyQjtJQUNEO0VBQ0Y7O0VBRUQsT0FBTztJQUNMLE1BREssb0JBQ0s7TUFDTjtNQUNBLFlBQVksQ0FBQyxLQUFiLEdBRk0sQ0FHUjs7TUFDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBckM7SUFDRCxDQU5JO0lBUUwsT0FSSyxxQkFRTTtNQUNULFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxVQUF4QztJQUNEO0VBVkksQ0FBUDtBQVlELENBeEREOztBQTBEQSxJQUFJLFNBQUo7O0FBRUEsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQVUsTUFBVixFQUFrQjtFQUNsQyxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBdEI7O0VBQ0EsSUFBSSxPQUFPLE1BQVAsS0FBa0IsU0FBdEIsRUFBaUM7SUFDL0IsTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFsQjtFQUNEOztFQUNELElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUFzQixZQUF0QixFQUFvQyxNQUFwQztFQUVBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBRCxDQUFQLEVBQWtCLFVBQUEsRUFBRSxFQUFJO0lBQzdCLEVBQUUsQ0FBQyxTQUFILENBQWEsTUFBYixDQUFvQixhQUFwQixFQUFtQyxNQUFuQztFQUNELENBRk0sQ0FBUDs7RUFHQSxJQUFJLE1BQUosRUFBWTtJQUNWLFNBQVMsQ0FBQyxNQUFWO0VBQ0QsQ0FGRCxNQUVPO0lBQ0wsU0FBUyxDQUFDLE9BQVY7RUFDRDs7RUFFRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBTCxDQUFtQixZQUFuQixDQUFwQjtFQUNBLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFMLENBQW1CLE9BQW5CLENBQW5COztFQUVBLElBQUksTUFBTSxJQUFJLFdBQWQsRUFBMkI7SUFDekI7SUFDQTtJQUNBLFdBQVcsQ0FBQyxLQUFaO0VBQ0QsQ0FKRCxNQUlPLElBQUksQ0FBQyxNQUFELElBQVcsUUFBUSxDQUFDLGFBQVQsS0FBMkIsV0FBdEMsSUFDQSxVQURKLEVBQ2dCO0lBQ3JCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxVQUFVLENBQUMsS0FBWDtFQUNEOztFQUVELE9BQU8sTUFBUDtBQUNELENBbENEOztlQW9DZSxVOzs7O0FDck1mOzs7Ozs7QUFDQSxJQUFNLGdCQUFnQixHQUFHLGVBQXpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixnQkFBMUIsRUFBMkM7RUFDdkMsS0FBSyxVQUFMLEdBQWtCLGdCQUFsQjtFQUNBLEtBQUssUUFBTCxHQUFnQixJQUFoQjtFQUNBLEtBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNIO0FBRUQ7QUFDQTtBQUNBOzs7QUFDQSxnQkFBZ0IsQ0FBQyxTQUFqQixDQUEyQixJQUEzQixHQUFrQyxZQUFXO0VBQ3pDLEtBQUssUUFBTCxHQUFnQixLQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLENBQWlDLHFCQUFqQyxDQUFoQjs7RUFDQSxJQUFHLEtBQUssUUFBTCxDQUFjLE1BQWQsS0FBeUIsQ0FBNUIsRUFBOEI7SUFDMUIsTUFBTSxJQUFJLEtBQUosQ0FBVSw2Q0FBVixDQUFOO0VBQ0g7O0VBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBWDs7RUFFQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsS0FBSyxRQUFMLENBQWMsTUFBakMsRUFBeUMsQ0FBQyxFQUExQyxFQUE2QztJQUN6QyxJQUFJLEtBQUssR0FBRyxLQUFLLFFBQUwsQ0FBZSxDQUFmLENBQVo7SUFFQSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsUUFBdkIsRUFBaUMsWUFBVztNQUN4QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFqQyxFQUF5QyxDQUFDLEVBQTFDLEVBQThDO1FBQzFDLElBQUksQ0FBQyxNQUFMLENBQVksSUFBSSxDQUFDLFFBQUwsQ0FBZSxDQUFmLENBQVo7TUFDSDtJQUNKLENBSkQ7SUFLQSxLQUFLLE1BQUwsQ0FBWSxLQUFaO0VBQ0g7QUFDSixDQWpCRDtBQW1CQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsZ0JBQWdCLENBQUMsU0FBakIsQ0FBMkIsTUFBM0IsR0FBb0MsVUFBVSxpQkFBVixFQUE0QjtFQUM1RCxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxZQUFsQixDQUErQixnQkFBL0IsQ0FBaEI7O0VBQ0EsSUFBRyxTQUFTLEtBQUssSUFBZCxJQUFzQixTQUFTLEtBQUssU0FBcEMsSUFBaUQsU0FBUyxLQUFLLEVBQWxFLEVBQXFFO0lBQ2pFLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFNBQXZCLENBQXJCOztJQUNBLElBQUcsY0FBYyxLQUFLLElBQW5CLElBQTJCLGNBQWMsS0FBSyxTQUFqRCxFQUEyRDtNQUN2RCxNQUFNLElBQUksS0FBSixDQUFVLDZEQUE0RCxnQkFBdEUsQ0FBTjtJQUNIOztJQUNELElBQUcsaUJBQWlCLENBQUMsT0FBckIsRUFBNkI7TUFDekIsS0FBSyxNQUFMLENBQVksaUJBQVosRUFBK0IsY0FBL0I7SUFDSCxDQUZELE1BRUs7TUFDRCxLQUFLLFFBQUwsQ0FBYyxpQkFBZCxFQUFpQyxjQUFqQztJQUNIO0VBQ0o7QUFDSixDQWJEO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsZ0JBQWdCLENBQUMsU0FBakIsQ0FBMkIsTUFBM0IsR0FBb0MsVUFBVSxpQkFBVixFQUE2QixjQUE3QixFQUE0QztFQUM1RSxJQUFHLGlCQUFpQixLQUFLLElBQXRCLElBQThCLGlCQUFpQixLQUFLLFNBQXBELElBQWlFLGNBQWMsS0FBSyxJQUFwRixJQUE0RixjQUFjLEtBQUssU0FBbEgsRUFBNEg7SUFDeEgsaUJBQWlCLENBQUMsWUFBbEIsQ0FBK0IsZUFBL0IsRUFBZ0QsTUFBaEQ7SUFDQSxjQUFjLENBQUMsWUFBZixDQUE0QixhQUE1QixFQUEyQyxPQUEzQztJQUNBLElBQUksU0FBUyxHQUFHLElBQUksS0FBSixDQUFVLG9CQUFWLENBQWhCO0lBQ0EsaUJBQWlCLENBQUMsYUFBbEIsQ0FBZ0MsU0FBaEM7RUFDSDtBQUNKLENBUEQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxnQkFBZ0IsQ0FBQyxTQUFqQixDQUEyQixRQUEzQixHQUFzQyxVQUFTLGlCQUFULEVBQTRCLGNBQTVCLEVBQTJDO0VBQzdFLElBQUcsaUJBQWlCLEtBQUssSUFBdEIsSUFBOEIsaUJBQWlCLEtBQUssU0FBcEQsSUFBaUUsY0FBYyxLQUFLLElBQXBGLElBQTRGLGNBQWMsS0FBSyxTQUFsSCxFQUE0SDtJQUN4SCxpQkFBaUIsQ0FBQyxZQUFsQixDQUErQixlQUEvQixFQUFnRCxPQUFoRDtJQUNBLGNBQWMsQ0FBQyxZQUFmLENBQTRCLGFBQTVCLEVBQTJDLE1BQTNDO0lBQ0EsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFKLENBQVUscUJBQVYsQ0FBakI7SUFDQSxpQkFBaUIsQ0FBQyxhQUFsQixDQUFnQyxVQUFoQztFQUNIO0FBQ0osQ0FQRDs7ZUFTZSxnQjs7OztBQ2pGZjs7Ozs7Ozs7Ozs7OztBQUNBLElBQU0sYUFBYSxHQUFHO0VBQ3BCLEtBQUssRUFBRSxLQURhO0VBRXBCLEdBQUcsRUFBRSxLQUZlO0VBR3BCLElBQUksRUFBRSxLQUhjO0VBSXBCLE9BQU8sRUFBRTtBQUpXLENBQXRCO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztJQUNNLGMsNkJBQ0osd0JBQWEsT0FBYixFQUFxQjtFQUFBOztFQUNuQixPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsU0FBbEM7RUFDQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBekIsRUFBb0MsU0FBcEM7QUFDRCxDOztBQUVILElBQUksU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFVLEtBQVYsRUFBaUI7RUFDL0IsSUFBRyxhQUFhLENBQUMsSUFBZCxJQUFzQixhQUFhLENBQUMsT0FBdkMsRUFBZ0Q7SUFDOUM7RUFDRDs7RUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFkOztFQUNBLElBQUcsT0FBTyxLQUFLLENBQUMsR0FBYixLQUFxQixXQUF4QixFQUFvQztJQUNsQyxJQUFHLEtBQUssQ0FBQyxHQUFOLENBQVUsTUFBVixLQUFxQixDQUF4QixFQUEwQjtNQUN4QixPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQWhCO0lBQ0Q7RUFDRixDQUpELE1BSU87SUFDTCxJQUFHLENBQUMsS0FBSyxDQUFDLFFBQVYsRUFBbUI7TUFDakIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEtBQUssQ0FBQyxPQUExQixDQUFWO0lBQ0QsQ0FGRCxNQUVPO01BQ0wsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEtBQUssQ0FBQyxRQUExQixDQUFWO0lBQ0Q7RUFDRjs7RUFFRCxJQUFJLFFBQVEsR0FBRyxLQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLENBQWY7O0VBRUEsSUFBRyxLQUFLLENBQUMsSUFBTixLQUFlLFNBQWYsSUFBNEIsS0FBSyxDQUFDLElBQU4sS0FBZSxPQUE5QyxFQUFzRDtJQUNwRCxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7RUFDRCxDQUZELE1BRU07SUFDSixJQUFJLE9BQU8sR0FBRyxJQUFkOztJQUNBLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBaUIsU0FBcEIsRUFBOEI7TUFDNUIsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFoQjtJQUNEOztJQUNELElBQUcsT0FBTyxLQUFLLElBQVosSUFBb0IsT0FBTyxLQUFLLElBQW5DLEVBQXlDO01BQ3ZDLElBQUcsT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBcEIsRUFBc0I7UUFDcEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxLQUFwQjs7UUFDQSxJQUFHLE9BQU8sQ0FBQyxJQUFSLEtBQWlCLFFBQXBCLEVBQTZCO1VBQzNCLFFBQVEsR0FBRyxLQUFLLEtBQWhCLENBRDJCLENBQ0w7UUFDdkIsQ0FGRCxNQUVLO1VBQ0gsUUFBUSxHQUFHLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsT0FBTyxDQUFDLGNBQTVCLElBQThDLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsT0FBTyxDQUFDLFlBQXpCLENBQTlDLEdBQXVGLE9BQWxHLENBREcsQ0FDd0c7UUFDNUc7O1FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFKLENBQVcsUUFBWCxDQUFSOztRQUNBLElBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFQLE1BQXFCLElBQXhCLEVBQTZCO1VBQzNCLElBQUksS0FBSyxDQUFDLGNBQVYsRUFBMEI7WUFDeEIsS0FBSyxDQUFDLGNBQU47VUFDRCxDQUZELE1BRU87WUFDTCxLQUFLLENBQUMsV0FBTixHQUFvQixLQUFwQjtVQUNEO1FBQ0Y7TUFDRjtJQUNGO0VBQ0Y7QUFDRixDQTlDRDs7ZUFnRGUsYzs7OztBQ25FZjtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBQ0EsU0FBUyxtQkFBVCxDQUE4QixLQUE5QixFQUFxQztFQUNuQyxLQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLG1CQUFtQixDQUFDLFNBQXBCLENBQThCLElBQTlCLEdBQXFDLFlBQVU7RUFDN0MsS0FBSyxhQUFMLEdBQXFCLEtBQUssZ0JBQUwsRUFBckI7RUFDQSxLQUFLLGlCQUFMLEdBQXlCLEtBQUssZUFBTCxFQUF6Qjs7RUFDQSxJQUFHLEtBQUssaUJBQUwsQ0FBdUIsTUFBdkIsS0FBa0MsQ0FBckMsRUFBdUM7SUFDckMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLEtBQUssaUJBQUwsQ0FBdUIsTUFBMUMsRUFBa0QsQ0FBQyxFQUFuRCxFQUFzRDtNQUNwRCxJQUFJLFFBQVEsR0FBRyxLQUFLLGlCQUFMLENBQXVCLENBQXZCLENBQWY7TUFDQSxRQUFRLENBQUMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBdUMsZ0JBQXZDO01BQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLGdCQUFwQztJQUNEO0VBQ0Y7O0VBQ0QsSUFBRyxLQUFLLGFBQUwsS0FBdUIsS0FBMUIsRUFBZ0M7SUFDOUIsS0FBSyxhQUFMLENBQW1CLG1CQUFuQixDQUF1QyxRQUF2QyxFQUFpRCxrQkFBakQ7SUFDQSxLQUFLLGFBQUwsQ0FBbUIsZ0JBQW5CLENBQW9DLFFBQXBDLEVBQThDLGtCQUE5QztFQUNEO0FBQ0YsQ0FkRDtBQWdCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsbUJBQW1CLENBQUMsU0FBcEIsQ0FBOEIsZ0JBQTlCLEdBQWlELFlBQVU7RUFDekQsSUFBSSxRQUFRLEdBQUcsS0FBSyxLQUFMLENBQVcsb0JBQVgsQ0FBZ0MsT0FBaEMsRUFBeUMsQ0FBekMsRUFBNEMsc0JBQTVDLENBQW1FLGVBQW5FLENBQWY7O0VBQ0EsSUFBRyxRQUFRLENBQUMsTUFBVCxLQUFvQixDQUF2QixFQUF5QjtJQUN2QixPQUFPLEtBQVA7RUFDRDs7RUFDRCxPQUFPLFFBQVEsQ0FBQyxDQUFELENBQWY7QUFDRCxDQU5EO0FBT0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLG1CQUFtQixDQUFDLFNBQXBCLENBQThCLGVBQTlCLEdBQWdELFlBQVU7RUFDeEQsT0FBTyxLQUFLLEtBQUwsQ0FBVyxvQkFBWCxDQUFnQyxPQUFoQyxFQUF5QyxDQUF6QyxFQUE0QyxzQkFBNUMsQ0FBbUUsZUFBbkUsQ0FBUDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxrQkFBVCxDQUE0QixDQUE1QixFQUE4QjtFQUM1QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBakI7RUFDQSxRQUFRLENBQUMsZUFBVCxDQUF5QixjQUF6QjtFQUNBLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxDQUFvQixVQUFwQixDQUErQixVQUEvQixDQUEwQyxVQUF0RDtFQUNBLElBQUksbUJBQW1CLEdBQUcsSUFBSSxtQkFBSixDQUF3QixLQUF4QixDQUExQjtFQUNBLElBQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDLGVBQXBCLEVBQW5CO0VBQ0EsSUFBSSxhQUFhLEdBQUcsQ0FBcEI7O0VBQ0EsSUFBRyxRQUFRLENBQUMsT0FBWixFQUFvQjtJQUNsQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQWhDLEVBQXdDLENBQUMsRUFBekMsRUFBNEM7TUFDMUMsWUFBWSxDQUFDLENBQUQsQ0FBWixDQUFnQixPQUFoQixHQUEwQixJQUExQjtNQUNBLFlBQVksQ0FBQyxDQUFELENBQVosQ0FBZ0IsVUFBaEIsQ0FBMkIsVUFBM0IsQ0FBc0MsU0FBdEMsQ0FBZ0QsR0FBaEQsQ0FBb0Qsb0JBQXBEO0lBQ0Q7O0lBRUQsYUFBYSxHQUFHLFlBQVksQ0FBQyxNQUE3QjtFQUNELENBUEQsTUFPTTtJQUNKLEtBQUksSUFBSSxFQUFDLEdBQUcsQ0FBWixFQUFlLEVBQUMsR0FBRyxZQUFZLENBQUMsTUFBaEMsRUFBd0MsRUFBQyxFQUF6QyxFQUE0QztNQUMxQyxZQUFZLENBQUMsRUFBRCxDQUFaLENBQWdCLE9BQWhCLEdBQTBCLEtBQTFCOztNQUNBLFlBQVksQ0FBQyxFQUFELENBQVosQ0FBZ0IsVUFBaEIsQ0FBMkIsVUFBM0IsQ0FBc0MsU0FBdEMsQ0FBZ0QsTUFBaEQsQ0FBdUQsb0JBQXZEO0lBQ0Q7RUFDRjs7RUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQUosQ0FBZ0IsOEJBQWhCLEVBQWdEO0lBQzVELE9BQU8sRUFBRSxJQURtRDtJQUU1RCxVQUFVLEVBQUUsSUFGZ0Q7SUFHNUQsTUFBTSxFQUFFO01BQUMsYUFBYSxFQUFiO0lBQUQ7RUFIb0QsQ0FBaEQsQ0FBZDtFQUtBLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixDQUExQixFQUE0QjtFQUMxQjtFQUNBLElBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxPQUFaLEVBQW9CO0lBQ2xCLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxDQUFvQixVQUFwQixDQUErQixTQUEvQixDQUF5QyxHQUF6QyxDQUE2QyxvQkFBN0M7RUFDRCxDQUZELE1BRU07SUFDSixDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsQ0FBb0IsVUFBcEIsQ0FBK0IsU0FBL0IsQ0FBeUMsTUFBekMsQ0FBZ0Qsb0JBQWhEO0VBQ0Q7O0VBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULENBQW9CLFVBQXBCLENBQStCLFVBQS9CLENBQTBDLFVBQXREO0VBQ0EsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLG1CQUFKLENBQXdCLEtBQXhCLENBQTFCO0VBQ0EsSUFBSSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsZ0JBQXBCLEVBQXBCOztFQUNBLElBQUcsYUFBYSxLQUFLLEtBQXJCLEVBQTJCO0lBQ3pCLElBQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDLGVBQXBCLEVBQW5CLENBRHlCLENBR3pCOztJQUNBLElBQUksYUFBYSxHQUFHLENBQXBCOztJQUNBLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBaEMsRUFBd0MsQ0FBQyxFQUF6QyxFQUE0QztNQUMxQyxJQUFJLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBRCxDQUFqQzs7TUFDQSxJQUFHLGNBQWMsQ0FBQyxPQUFsQixFQUEwQjtRQUN4QixhQUFhO01BQ2Q7SUFDRjs7SUFFRCxJQUFHLGFBQWEsS0FBSyxZQUFZLENBQUMsTUFBbEMsRUFBeUM7TUFBRTtNQUN6QyxhQUFhLENBQUMsZUFBZCxDQUE4QixjQUE5QjtNQUNBLGFBQWEsQ0FBQyxPQUFkLEdBQXdCLElBQXhCO0lBQ0QsQ0FIRCxNQUdPLElBQUcsYUFBYSxJQUFJLENBQXBCLEVBQXNCO01BQUU7TUFDN0IsYUFBYSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUI7TUFDQSxhQUFhLENBQUMsT0FBZCxHQUF3QixLQUF4QjtJQUNELENBSE0sTUFHRDtNQUFFO01BQ04sYUFBYSxDQUFDLFlBQWQsQ0FBMkIsY0FBM0IsRUFBMkMsT0FBM0M7TUFDQSxhQUFhLENBQUMsT0FBZCxHQUF3QixLQUF4QjtJQUNEOztJQUNELElBQU0sS0FBSyxHQUFHLElBQUksV0FBSixDQUFnQiw4QkFBaEIsRUFBZ0Q7TUFDNUQsT0FBTyxFQUFFLElBRG1EO01BRTVELFVBQVUsRUFBRSxJQUZnRDtNQUc1RCxNQUFNLEVBQUU7UUFBQyxhQUFhLEVBQWI7TUFBRDtJQUhvRCxDQUFoRCxDQUFkO0lBS0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEI7RUFDRDtBQUNGOztlQUVjLG1COzs7Ozs7Ozs7Ozs7Ozs7OztBQzlIZixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBdEI7QUFFQTtBQUNBO0FBQ0E7OztJQUNNLGUsNkJBQ0YseUJBQVksS0FBWixFQUFtQjtFQUFBOztFQUNmLHdCQUF3QixDQUFDLEtBQUQsQ0FBeEI7QUFDSCxDO0FBR0w7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsd0JBQVQsQ0FBa0MsT0FBbEMsRUFBMkM7RUFDdkMsSUFBSSxDQUFDLE9BQUwsRUFBYztFQUVkLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixPQUE3QixDQUFiOztFQUNBLElBQUksTUFBTSxDQUFDLE1BQVAsS0FBa0IsQ0FBdEIsRUFBeUI7SUFDckIsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVLG9CQUFWLENBQStCLElBQS9CLENBQXBCOztJQUNBLElBQUksYUFBYSxDQUFDLE1BQWQsSUFBd0IsQ0FBNUIsRUFBK0I7TUFDM0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVSxvQkFBVixDQUErQixJQUEvQixDQUFoQjtJQUNIOztJQUVELElBQUksYUFBYSxDQUFDLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEI7TUFDMUIsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQUQsRUFBYSxPQUFiLENBQXpCO01BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFYLEVBQXVCLE9BQXZCLENBQStCLFVBQUEsS0FBSyxFQUFJO1FBQ3BDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFwQjs7UUFDQSxJQUFJLE9BQU8sQ0FBQyxNQUFSLEtBQW1CLGFBQWEsQ0FBQyxNQUFyQyxFQUE2QztVQUN6QyxLQUFLLENBQUMsSUFBTixDQUFXLGFBQVgsRUFBMEIsT0FBMUIsQ0FBa0MsVUFBQyxZQUFELEVBQWUsQ0FBZixFQUFxQjtZQUNuRDtZQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBRCxDQUFQLENBQVcsWUFBWCxDQUF3QixZQUF4QixDQUFELElBQTBDLFlBQVksQ0FBQyxPQUFiLEtBQXlCLElBQW5FLElBQTJFLENBQUMsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsZ0JBQWhDLENBQWhGLEVBQW1JO2NBQy9ILE9BQU8sQ0FBQyxDQUFELENBQVAsQ0FBVyxZQUFYLENBQXdCLFlBQXhCLEVBQXNDLFlBQVksQ0FBQyxXQUFuRDtZQUNIO1VBQ0osQ0FMRDtRQU1IO01BQ0osQ0FWRDtJQVdIO0VBQ0o7QUFDSjs7ZUFFYyxlOzs7O0FDMUNmOzs7Ozs7QUFDQSxJQUFJLFdBQVcsR0FBRztFQUNoQixNQUFNLENBRFU7RUFFaEIsTUFBTSxHQUZVO0VBR2hCLE1BQU0sR0FIVTtFQUloQixNQUFNLEdBSlU7RUFLaEIsTUFBTTtBQUxVLENBQWxCLEMsQ0FRQTs7QUFDQSxJQUFJLElBQUksR0FBRztFQUNULEdBQUcsRUFBRSxFQURJO0VBRVQsSUFBSSxFQUFFLEVBRkc7RUFHVCxJQUFJLEVBQUUsRUFIRztFQUlULEVBQUUsRUFBRSxFQUpLO0VBS1QsS0FBSyxFQUFFLEVBTEU7RUFNVCxJQUFJLEVBQUUsRUFORztFQU9ULFVBQVE7QUFQQyxDQUFYLEMsQ0FVQTs7QUFDQSxJQUFJLFNBQVMsR0FBRztFQUNkLElBQUksQ0FBQyxDQURTO0VBRWQsSUFBSSxDQUFDLENBRlM7RUFHZCxJQUFJLENBSFU7RUFJZCxJQUFJO0FBSlUsQ0FBaEI7QUFPQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFTLE1BQVQsQ0FBaUIsTUFBakIsRUFBeUI7RUFDdkIsS0FBSyxNQUFMLEdBQWMsTUFBZDtFQUNBLEtBQUssSUFBTCxHQUFZLEtBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLG9CQUE3QixDQUFaO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLElBQWpCLEdBQXdCLFlBQVU7RUFDaEMsSUFBRyxLQUFLLElBQUwsQ0FBVSxNQUFWLEtBQXFCLENBQXhCLEVBQTBCO0lBQ3hCLE1BQU0sSUFBSSxLQUFKLDhIQUFOO0VBQ0QsQ0FIK0IsQ0FLaEM7OztFQUNBLElBQUksQ0FBQyxnQkFBZ0IsRUFBckIsRUFBeUI7SUFDdkI7SUFDQSxJQUFJLEdBQUcsR0FBRyxLQUFLLElBQUwsQ0FBVyxDQUFYLENBQVYsQ0FGdUIsQ0FJdkI7O0lBQ0EsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLEtBQUssTUFBTixDQUFqQzs7SUFDQSxJQUFJLGFBQWEsQ0FBQyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO01BQzlCLEdBQUcsR0FBRyxhQUFhLENBQUUsQ0FBRixDQUFuQjtJQUNELENBUnNCLENBVXZCOzs7SUFDQSxLQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsS0FBdEI7RUFDRDs7RUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFkLENBbkJnQyxDQW9CaEM7O0VBQ0EsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLEtBQUssSUFBTCxDQUFVLE1BQTdCLEVBQXFDLENBQUMsRUFBdEMsRUFBMEM7SUFDeEMsS0FBSyxJQUFMLENBQVcsQ0FBWCxFQUFlLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLFlBQVU7TUFBQyxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFwQixFQUEwQixLQUExQjtJQUFpQyxDQUFyRjtJQUNBLEtBQUssSUFBTCxDQUFXLENBQVgsRUFBZSxnQkFBZixDQUFnQyxTQUFoQyxFQUEyQyxvQkFBM0M7SUFDQSxLQUFLLElBQUwsQ0FBVyxDQUFYLEVBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsa0JBQXpDO0VBQ0Q7QUFDRixDQTFCRDtBQTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQyxNQUFNLENBQUMsU0FBUCxDQUFpQixXQUFqQixHQUErQixVQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCO0VBQ3RELElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUQsQ0FBM0IsQ0FEc0QsQ0FHdEQ7O0VBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxLQUFLLElBQUwsQ0FBVSxNQUE5QixFQUFzQyxDQUFDLEVBQXZDLEVBQTJDO0lBQ3pDLElBQUksSUFBSSxDQUFFLENBQUYsQ0FBSixLQUFjLEdBQWxCLEVBQXVCO01BQ3JCO0lBQ0Q7O0lBRUQsSUFBSSxJQUFJLENBQUUsQ0FBRixDQUFKLENBQVUsWUFBVixDQUF1QixlQUF2QixNQUE0QyxNQUFoRCxFQUF3RDtNQUN0RCxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUosQ0FBVSxrQkFBVixDQUFqQjtNQUNBLElBQUksQ0FBRSxDQUFGLENBQUosQ0FBVSxhQUFWLENBQXdCLFVBQXhCO0lBQ0Q7O0lBRUQsSUFBSSxDQUFFLENBQUYsQ0FBSixDQUFVLFlBQVYsQ0FBdUIsVUFBdkIsRUFBbUMsSUFBbkM7SUFDQSxJQUFJLENBQUUsQ0FBRixDQUFKLENBQVUsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4Qzs7SUFDQSxJQUFJLFdBQVUsR0FBRyxJQUFJLENBQUUsQ0FBRixDQUFKLENBQVUsWUFBVixDQUF1QixlQUF2QixDQUFqQjs7SUFDQSxJQUFJLFNBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixXQUF4QixDQUFmOztJQUNBLElBQUcsU0FBUSxLQUFLLElBQWhCLEVBQXFCO01BQ25CLE1BQU0sSUFBSSxLQUFKLDRCQUFOO0lBQ0Q7O0lBQ0QsU0FBUSxDQUFDLFlBQVQsQ0FBc0IsYUFBdEIsRUFBcUMsTUFBckM7RUFDRCxDQXRCcUQsQ0F3QnREOzs7RUFDQSxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBSixDQUFpQixlQUFqQixDQUFqQjtFQUNBLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLFVBQXhCLENBQWY7O0VBQ0EsSUFBRyxRQUFRLEtBQUssSUFBaEIsRUFBcUI7SUFDbkIsTUFBTSxJQUFJLEtBQUosbUNBQU47RUFDRDs7RUFFRCxHQUFHLENBQUMsWUFBSixDQUFpQixlQUFqQixFQUFrQyxNQUFsQztFQUNBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE9BQXJDO0VBQ0EsR0FBRyxDQUFDLGVBQUosQ0FBb0IsVUFBcEIsRUFqQ3NELENBbUN0RDs7RUFDQSxJQUFJLFFBQUosRUFBYztJQUNaLEdBQUcsQ0FBQyxLQUFKO0VBQ0Q7O0VBRUQsSUFBSSxZQUFZLEdBQUcsSUFBSSxLQUFKLENBQVUsb0JBQVYsQ0FBbkI7RUFDQSxHQUFHLENBQUMsVUFBSixDQUFlLGFBQWYsQ0FBNkIsWUFBN0I7RUFFQSxJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFoQjtFQUNBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFNBQWxCO0FBQ0QsQ0E3Q0E7QUErQ0Q7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBc0M7RUFDcEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQWhCOztFQUVBLFFBQVEsR0FBUjtJQUNFLEtBQUssSUFBSSxDQUFDLEdBQVY7TUFDRSxLQUFLLENBQUMsY0FBTixHQURGLENBRUU7O01BQ0EsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFQLENBQVo7TUFDQTs7SUFDRixLQUFLLElBQUksQ0FBQyxJQUFWO01BQ0UsS0FBSyxDQUFDLGNBQU4sR0FERixDQUVFOztNQUNBLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBUCxDQUFiO01BQ0E7SUFDRjtJQUNBOztJQUNBLEtBQUssSUFBSSxDQUFDLEVBQVY7SUFDQSxLQUFLLElBQUksQ0FBQyxJQUFWO01BQ0Usb0JBQW9CLENBQUMsS0FBRCxDQUFwQjtNQUNBO0VBaEJKO0FBa0JEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsa0JBQVQsQ0FBNkIsS0FBN0IsRUFBb0M7RUFDbEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQWhCOztFQUVBLFFBQVEsR0FBUjtJQUNFLEtBQUssSUFBSSxDQUFDLElBQVY7SUFDQSxLQUFLLElBQUksQ0FBQyxLQUFWO01BQ0Usb0JBQW9CLENBQUMsS0FBRCxDQUFwQjtNQUNBOztJQUNGLEtBQUssSUFBSSxVQUFUO01BQ0U7O0lBQ0YsS0FBSyxJQUFJLENBQUMsS0FBVjtJQUNBLEtBQUssSUFBSSxDQUFDLEtBQVY7TUFDRSxJQUFJLE1BQUosQ0FBVyxLQUFLLENBQUMsTUFBTixDQUFhLFVBQXhCLEVBQW9DLFdBQXBDLENBQWdELEtBQUssQ0FBQyxNQUF0RCxFQUE4RCxJQUE5RDtNQUNBO0VBVko7QUFZRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBc0M7RUFDcEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQWhCO0VBRUEsSUFBSSxDQUFDLEdBQUMsTUFBTjtFQUFBLElBQ0UsQ0FBQyxHQUFDLFFBREo7RUFBQSxJQUVFLENBQUMsR0FBQyxDQUFDLENBQUMsZUFGTjtFQUFBLElBR0UsQ0FBQyxHQUFDLENBQUMsQ0FBQyxvQkFBRixDQUF1QixNQUF2QixFQUFnQyxDQUFoQyxDQUhKO0VBQUEsSUFJRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLFVBQUYsSUFBYyxDQUFDLENBQUMsV0FBaEIsSUFBNkIsQ0FBQyxDQUFDLFdBSm5DO0VBQUEsSUFLRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLFdBQUYsSUFBZSxDQUFDLENBQUMsWUFBakIsSUFBK0IsQ0FBQyxDQUFDLFlBTHJDO0VBT0EsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUEvQjtFQUNBLElBQUksT0FBTyxHQUFHLEtBQWQ7O0VBRUEsSUFBSSxRQUFKLEVBQWM7SUFDWixJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBYixJQUFtQixHQUFHLEtBQUssSUFBSSxDQUFDLElBQXBDLEVBQTBDO01BQ3hDLEtBQUssQ0FBQyxjQUFOO01BQ0EsT0FBTyxHQUFHLElBQVY7SUFDRDtFQUNGLENBTEQsTUFNSztJQUNILElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFiLElBQXFCLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBdEMsRUFBNkM7TUFDM0MsT0FBTyxHQUFHLElBQVY7SUFDRDtFQUNGOztFQUNELElBQUksT0FBSixFQUFhO0lBQ1gscUJBQXFCLENBQUMsS0FBRCxDQUFyQjtFQUNEO0FBQ0Y7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxxQkFBVCxDQUFnQyxLQUFoQyxFQUF1QztFQUNyQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBcEI7O0VBQ0EsSUFBSSxTQUFTLENBQUUsT0FBRixDQUFiLEVBQTBCO0lBQ3hCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFuQjtJQUNBLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLE1BQUQsQ0FBM0I7SUFDQSxJQUFJLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxNQUFELEVBQVMsSUFBVCxDQUFuQzs7SUFDQSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7TUFDaEIsSUFBSSxJQUFJLENBQUUsS0FBSyxHQUFHLFNBQVMsQ0FBRSxPQUFGLENBQW5CLENBQVIsRUFBMEM7UUFDeEMsSUFBSSxDQUFFLEtBQUssR0FBRyxTQUFTLENBQUUsT0FBRixDQUFuQixDQUFKLENBQXFDLEtBQXJDO01BQ0QsQ0FGRCxNQUdLLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFqQixJQUF5QixPQUFPLEtBQUssSUFBSSxDQUFDLEVBQTlDLEVBQWtEO1FBQ3JELFlBQVksQ0FBQyxNQUFELENBQVo7TUFDRCxDQUZJLE1BR0EsSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQWpCLElBQTBCLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBOUMsRUFBb0Q7UUFDdkQsYUFBYSxDQUFDLE1BQUQsQ0FBYjtNQUNEO0lBQ0Y7RUFDRjtBQUNGO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxhQUFULENBQXdCLE1BQXhCLEVBQWdDO0VBQzlCLE9BQU8sTUFBTSxDQUFDLGdCQUFQLENBQXdCLHdDQUF4QixDQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLGdCQUFULENBQTJCLEdBQTNCLEVBQWdDO0VBQzlCLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFyQjs7RUFDQSxJQUFJLFVBQVUsQ0FBQyxTQUFYLENBQXFCLFFBQXJCLENBQThCLFFBQTlCLENBQUosRUFBNkM7SUFDM0MsT0FBTyxVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsb0JBQTVCLENBQVA7RUFDRDs7RUFDRCxPQUFPLEVBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyx1QkFBVCxDQUFrQyxPQUFsQyxFQUEyQyxJQUEzQyxFQUFnRDtFQUM5QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQWI7O0VBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBekIsRUFBaUMsQ0FBQyxFQUFsQyxFQUFzQztJQUNwQyxJQUFHLElBQUksQ0FBRSxDQUFGLENBQUosS0FBYyxPQUFqQixFQUF5QjtNQUN2QixLQUFLLEdBQUcsQ0FBUjtNQUNBO0lBQ0Q7RUFDRjs7RUFFRCxPQUFPLEtBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLGdCQUFULEdBQTZCO0VBQzNCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxDQUFzQixHQUF0QixFQUEyQixFQUEzQixDQUFYOztFQUNBLElBQUksSUFBSSxLQUFLLEVBQWIsRUFBaUI7SUFDZixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1Qix3Q0FBd0MsSUFBeEMsR0FBK0MsSUFBdEUsQ0FBVjs7SUFDQSxJQUFJLEdBQUcsS0FBSyxJQUFaLEVBQWtCO01BQ2hCLFdBQVcsQ0FBQyxHQUFELEVBQU0sS0FBTixDQUFYO01BQ0EsT0FBTyxJQUFQO0lBQ0Q7RUFDRjs7RUFDRCxPQUFPLEtBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLGFBQVQsQ0FBd0IsR0FBeEIsRUFBNkI7RUFDM0IsZ0JBQWdCLENBQUMsR0FBRCxDQUFoQixDQUF1QixDQUF2QixFQUEyQixLQUEzQjtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsWUFBVCxDQUF1QixHQUF2QixFQUE0QjtFQUMxQixJQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFELENBQTNCO0VBQ0EsSUFBSSxDQUFFLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBaEIsQ0FBSixDQUF3QixLQUF4QjtBQUNEOztlQUVjLE07Ozs7QUMzU2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQUNBLFNBQVMsS0FBVCxDQUFnQixPQUFoQixFQUF3QjtFQUNwQixLQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0g7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFlBQVU7RUFDN0IsS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixNQUF2QixDQUE4QixNQUE5QjtFQUNBLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsU0FBM0I7RUFDQSxLQUFLLE9BQUwsQ0FBYSxzQkFBYixDQUFvQyxhQUFwQyxFQUFtRCxDQUFuRCxFQUFzRCxnQkFBdEQsQ0FBdUUsT0FBdkUsRUFBZ0YsWUFBVTtJQUN0RixJQUFJLEtBQUssR0FBRyxLQUFLLFVBQUwsQ0FBZ0IsVUFBNUI7SUFDQSxJQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCLElBQWpCO0VBQ0gsQ0FIRDtFQUlBLHFCQUFxQixDQUFDLFNBQUQsQ0FBckI7QUFDSCxDQVJEO0FBVUE7QUFDQTtBQUNBOzs7QUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFVO0VBQzdCLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBOEIsTUFBOUI7RUFDQSxLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEdBQXZCLENBQTJCLE1BQTNCO0FBQ0gsQ0FIRDtBQUtBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxTQUFULEdBQW9CO0VBQ2hCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixnQkFBMUIsQ0FBYjs7RUFDQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQTFCLEVBQWtDLENBQUMsRUFBbkMsRUFBc0M7SUFDbEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUQsQ0FBbEI7SUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixNQUFoQixDQUF1QixTQUF2QjtJQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLEdBQWhCLENBQW9CLE1BQXBCO0VBQ0g7QUFDSjs7ZUFFYyxLOzs7O0FDMUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsU0FBUyxPQUFULENBQWlCLE9BQWpCLEVBQTBCO0VBQ3RCLEtBQUssT0FBTCxHQUFlLE9BQWY7O0VBQ0EsSUFBSSxLQUFLLE9BQUwsQ0FBYSxZQUFiLENBQTBCLGNBQTFCLE1BQThDLElBQWxELEVBQXdEO0lBQ3BELE1BQU0sSUFBSSxLQUFKLGdHQUFOO0VBQ0g7QUFDSjtBQUVEO0FBQ0E7QUFDQTs7O0FBQ0EsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsSUFBbEIsR0FBeUIsWUFBWTtFQUNqQyxJQUFJLE1BQU0sR0FBRyxJQUFiO0VBQ0EsS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsWUFBOUIsRUFBNEMsVUFBVSxDQUFWLEVBQWE7SUFDckQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQWhCOztJQUNBLElBQUksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsZUFBM0IsTUFBZ0QsS0FBaEQsSUFBeUQsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsZUFBM0IsTUFBZ0QsS0FBN0csRUFBb0g7TUFDaEgsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQjtNQUNBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLEdBQWxCLENBQXNCLGVBQXRCO01BQ0EsVUFBVSxDQUFDLFlBQVk7UUFDbkIsSUFBSSxPQUFPLENBQUMsU0FBUixDQUFrQixRQUFsQixDQUEyQixlQUEzQixDQUFKLEVBQWlEO1VBQzdDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFoQjtVQUVBLElBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsa0JBQXJCLE1BQTZDLElBQWpELEVBQXVEO1VBQ3ZELFVBQVUsQ0FBQyxPQUFELENBQVY7UUFDSDtNQUNKLENBUFMsRUFPUCxHQVBPLENBQVY7SUFRSDtFQUNKLENBZEQ7RUFnQkEsS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsWUFBOUIsRUFBNEMsVUFBVSxDQUFWLEVBQWE7SUFDckQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQWhCOztJQUNBLElBQUksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsZUFBM0IsQ0FBSixFQUFpRDtNQUM3QyxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixlQUF6QjtNQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGtCQUFyQixDQUFoQjtNQUNBLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCLENBQXJCOztNQUNBLElBQUksY0FBYyxLQUFLLElBQXZCLEVBQTZCO1FBQ3pCLGlCQUFpQixDQUFDLE9BQUQsQ0FBakI7TUFDSDtJQUNKO0VBQ0osQ0FWRDtFQVlBLEtBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFVBQVUsS0FBVixFQUFpQjtJQUNwRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBTixJQUFlLEtBQUssQ0FBQyxPQUEvQjs7SUFDQSxJQUFJLEdBQUcsS0FBSyxFQUFaLEVBQWdCO01BQ1osSUFBSSxPQUFPLEdBQUcsS0FBSyxZQUFMLENBQWtCLGtCQUFsQixDQUFkOztNQUNBLElBQUksT0FBTyxLQUFLLElBQVosSUFBb0IsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBeEIsTUFBcUMsSUFBN0QsRUFBbUU7UUFDL0QsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLENBQTFCO01BQ0g7O01BQ0QsS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixRQUF0QjtNQUNBLEtBQUssZUFBTCxDQUFxQixrQkFBckI7SUFDSDtFQUNKLENBVkQ7O0VBWUEsSUFBSSxLQUFLLE9BQUwsQ0FBYSxZQUFiLENBQTBCLHNCQUExQixNQUFzRCxPQUExRCxFQUFtRTtJQUMvRCxLQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxVQUFVLENBQVYsRUFBYTtNQUNoRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBaEI7TUFDQSxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCO01BQ0EsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsZUFBdEI7TUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixlQUF6QjtNQUNBLElBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsa0JBQXJCLE1BQTZDLElBQWpELEVBQXVEO01BQ3ZELFVBQVUsQ0FBQyxPQUFELENBQVY7SUFDSCxDQVBEO0VBUUg7O0VBRUQsUUFBUSxDQUFDLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDLG1CQUF6QyxDQUE2RCxPQUE3RCxFQUFzRSxnQkFBdEU7RUFDQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLGdCQUFuRTtBQUNILENBdkREO0FBeURBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxRQUFULEdBQW9CO0VBQ2hCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQiwrQkFBMUIsQ0FBZjs7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQTBDO0lBQ3RDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFELENBQVIsQ0FBWSxZQUFaLENBQXlCLGtCQUF6QixDQUFiO0lBQ0EsUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZLGVBQVosQ0FBNEIsa0JBQTVCO0lBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLENBQTFCO0VBQ0g7QUFDSjs7QUFFRCxTQUFTLFVBQVQsQ0FBb0IsT0FBcEIsRUFBNkI7RUFDekIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsdUJBQXJCLEtBQWlELEtBQTNEO0VBRUEsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQUQsRUFBVSxHQUFWLENBQTNCO0VBRUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCO0VBRUEsVUFBVSxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CLEdBQW5CLENBQVY7QUFDSDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxhQUFULENBQXVCLE9BQXZCLEVBQWdDLEdBQWhDLEVBQXFDO0VBQ2pDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQWQ7RUFDQSxPQUFPLENBQUMsU0FBUixHQUFvQixnQkFBcEI7RUFDQSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsc0JBQVQsQ0FBZ0MsZ0JBQWhDLENBQWQ7RUFDQSxJQUFJLEVBQUUsR0FBRyxhQUFhLE9BQU8sQ0FBQyxNQUFyQixHQUE4QixDQUF2QztFQUNBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLElBQXJCLEVBQTJCLEVBQTNCO0VBQ0EsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsU0FBN0I7RUFDQSxPQUFPLENBQUMsWUFBUixDQUFxQixhQUFyQixFQUFvQyxHQUFwQztFQUNBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGtCQUFyQixFQUF5QyxFQUF6QztFQUVBLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0VBQ0EsWUFBWSxDQUFDLFNBQWIsR0FBeUIsU0FBekI7RUFFQSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFuQjtFQUNBLFlBQVksQ0FBQyxTQUFiLEdBQXlCLGVBQXpCO0VBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsWUFBekI7RUFFQSxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFyQjtFQUNBLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLGlCQUEzQjtFQUNBLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGNBQXJCLENBQTNCO0VBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsY0FBekI7RUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixZQUFwQjtFQUVBLE9BQU8sT0FBUDtBQUNIO0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsT0FBNUIsRUFBcUMsR0FBckMsRUFBMEM7RUFDdEMsSUFBSSxPQUFPLEdBQUcsTUFBZDtFQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxzQkFBUixDQUErQixlQUEvQixFQUFnRCxDQUFoRCxDQUFaO0VBQ0EsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLHFCQUFQLEVBQXRCO0VBRUEsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLHFCQUFQLEVBQW5CO0VBQUEsSUFBbUQsSUFBbkQ7RUFBQSxJQUF5RCxHQUF6RDtFQUVBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUEzQjtFQUVBLElBQUksSUFBSSxHQUFHLEVBQVg7RUFDQSxJQUFJLGNBQWMsR0FBRyxNQUFyQjtFQUNBLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQWQsQ0FBUixHQUErQixDQUFDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLE9BQU8sQ0FBQyxXQUE5QixJQUE2QyxDQUFuRjs7RUFFQSxRQUFRLEdBQVI7SUFDSSxLQUFLLFFBQUw7TUFDSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFkLENBQVIsR0FBZ0MsSUFBdEM7TUFDQSxjQUFjLEdBQUcsSUFBakI7TUFDQTs7SUFFSjtJQUNBLEtBQUssS0FBTDtNQUNJLEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQWQsQ0FBUixHQUE2QixPQUFPLENBQUMsWUFBckMsR0FBb0QsSUFBMUQ7RUFSUixDQWJzQyxDQXdCdEM7OztFQUNBLElBQUksSUFBSSxHQUFHLENBQVgsRUFBYztJQUNWLElBQUksR0FBRyxJQUFQO0lBQ0EsSUFBSSxpQkFBaUIsR0FBRyxlQUFlLENBQUMsSUFBaEIsR0FBd0IsT0FBTyxDQUFDLFdBQVIsR0FBc0IsQ0FBdEU7SUFDQSxJQUFJLHFCQUFxQixHQUFHLENBQTVCO0lBQ0EsSUFBSSxpQkFBaUIsR0FBRyxpQkFBaUIsR0FBRyxJQUFwQixHQUEyQixxQkFBbkQ7SUFDQSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBaEQsRUFBbUQsS0FBbkQsQ0FBeUQsSUFBekQsR0FBZ0UsaUJBQWlCLEdBQUcsSUFBcEY7RUFDSCxDQS9CcUMsQ0FpQ3RDOzs7RUFDQSxJQUFLLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBZixJQUFnQyxNQUFNLENBQUMsV0FBM0MsRUFBd0Q7SUFDcEQsR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBZCxDQUFSLEdBQTZCLE9BQU8sQ0FBQyxZQUFyQyxHQUFvRCxJQUExRDtJQUNBLGNBQWMsR0FBRyxNQUFqQjtFQUNILENBckNxQyxDQXVDdEM7OztFQUNBLElBQUksR0FBRyxHQUFHLENBQVYsRUFBYTtJQUNULEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQWQsQ0FBUixHQUFnQyxJQUF0QztJQUNBLGNBQWMsR0FBRyxJQUFqQjtFQUNIOztFQUVELElBQUksTUFBTSxDQUFDLFVBQVAsR0FBcUIsSUFBSSxHQUFHLFlBQWhDLEVBQStDO0lBQzNDLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxHQUFzQixJQUFJLEdBQUcsSUFBN0I7O0lBQ0EsSUFBSSxrQkFBaUIsR0FBRyxlQUFlLENBQUMsS0FBaEIsR0FBeUIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsQ0FBdkU7O0lBQ0EsSUFBSSxzQkFBcUIsR0FBRyxDQUE1QjtJQUNBLElBQUksa0JBQWtCLEdBQUcsTUFBTSxDQUFDLFVBQVAsR0FBb0Isa0JBQXBCLEdBQXdDLElBQXhDLEdBQStDLHNCQUF4RTtJQUNBLE9BQU8sQ0FBQyxzQkFBUixDQUErQixlQUEvQixFQUFnRCxDQUFoRCxFQUFtRCxLQUFuRCxDQUF5RCxLQUF6RCxHQUFpRSxrQkFBa0IsR0FBRyxJQUF0RjtJQUNBLE9BQU8sQ0FBQyxzQkFBUixDQUErQixlQUEvQixFQUFnRCxDQUFoRCxFQUFtRCxLQUFuRCxDQUF5RCxJQUF6RCxHQUFnRSxNQUFoRTtFQUNILENBUEQsTUFPTztJQUNILE9BQU8sQ0FBQyxLQUFSLENBQWMsSUFBZCxHQUFxQixJQUFJLEdBQUcsSUFBNUI7RUFDSDs7RUFDRCxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsR0FBb0IsR0FBRyxHQUFHLFdBQU4sR0FBb0IsSUFBeEM7RUFDQSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBaEQsRUFBbUQsU0FBbkQsQ0FBNkQsR0FBN0QsQ0FBaUUsY0FBakU7QUFDSDs7QUFHRCxTQUFTLGdCQUFULENBQTBCLEtBQTFCLEVBQWdEO0VBQUEsSUFBZixLQUFlLHVFQUFQLEtBQU87O0VBQzVDLElBQUksS0FBSyxJQUFLLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxZQUFiLENBQTBCLGNBQTFCLENBQUQsSUFBOEMsQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsU0FBaEMsQ0FBL0MsSUFBNkYsQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsaUJBQWhDLENBQTVHLEVBQWlLO0lBQzdKLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixpQkFBMUIsQ0FBZjs7SUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQTBDO01BQ3RDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHVCQUF1QixRQUFRLENBQUMsQ0FBRCxDQUFSLENBQVksWUFBWixDQUF5QixJQUF6QixDQUF2QixHQUF3RCxHQUEvRSxDQUFkO01BQ0EsT0FBTyxDQUFDLGVBQVIsQ0FBd0IscUJBQXhCO01BQ0EsT0FBTyxDQUFDLGVBQVIsQ0FBd0Isa0JBQXhCO01BQ0EsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsZUFBekI7TUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixlQUF6QjtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixRQUFRLENBQUMsQ0FBRCxDQUFsQztJQUNIO0VBQ0o7QUFDSjs7QUFFRCxTQUFTLGlCQUFULENBQTJCLE9BQTNCLEVBQW9DO0VBQ2hDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGtCQUFyQixDQUFoQjtFQUNBLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCLENBQXJCO0VBQ0EsY0FBYyxDQUFDLG1CQUFmLENBQW1DLFlBQW5DLEVBQWlELGNBQWpEO0VBQ0EsY0FBYyxDQUFDLGdCQUFmLENBQWdDLFlBQWhDLEVBQThDLGNBQTlDO0VBQ0EsVUFBVSxDQUFDLFlBQVk7SUFDbkIsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBckI7O0lBQ0EsSUFBSSxjQUFjLEtBQUssSUFBdkIsRUFBNkI7TUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFFBQWxCLENBQTJCLGVBQTNCLENBQUwsRUFBa0Q7UUFDOUMsYUFBYSxDQUFDLE9BQUQsQ0FBYjtNQUNIO0lBQ0o7RUFDSixDQVBTLEVBT1AsR0FQTyxDQUFWO0FBUUg7O0FBRUQsU0FBUyxjQUFULENBQXdCLENBQXhCLEVBQTJCO0VBQ3ZCLElBQUksY0FBYyxHQUFHLElBQXJCO0VBRUEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsdUJBQXVCLGNBQWMsQ0FBQyxZQUFmLENBQTRCLElBQTVCLENBQXZCLEdBQTJELEdBQWxGLENBQWQ7RUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixHQUFsQixDQUFzQixlQUF0QjtFQUVBLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxZQUFoQyxFQUE4QyxZQUFZO0lBQ3RELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHVCQUF1QixjQUFjLENBQUMsWUFBZixDQUE0QixJQUE1QixDQUF2QixHQUEyRCxHQUFsRixDQUFkOztJQUNBLElBQUksT0FBTyxLQUFLLElBQWhCLEVBQXNCO01BQ2xCLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQXlCLGVBQXpCO01BQ0EsaUJBQWlCLENBQUMsT0FBRCxDQUFqQjtJQUNIO0VBQ0osQ0FORDtBQU9IOztBQUVELFNBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztFQUM1QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckIsQ0FBaEI7RUFDQSxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4QixDQUFyQjs7RUFFQSxJQUFJLFNBQVMsS0FBSyxJQUFkLElBQXNCLGNBQWMsS0FBSyxJQUE3QyxFQUFtRDtJQUMvQyxRQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsY0FBMUI7RUFDSDs7RUFDRCxPQUFPLENBQUMsZUFBUixDQUF3QixrQkFBeEI7RUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixlQUF6QjtFQUNBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQXlCLGVBQXpCO0FBQ0g7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBakI7Ozs7O0FDNVBBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0VBQ2YsTUFBTSxFQUFFO0FBRE8sQ0FBakI7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUFELENBQTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE9BQU8sQ0FBQyxhQUFELENBQVA7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSSxJQUFJLEdBQUcsU0FBUCxJQUFPLENBQVUsT0FBVixFQUFtQjtFQUM1QjtFQUNBLE9BQU8sR0FBRyxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsR0FBaUMsT0FBakMsR0FBMkMsRUFBckQsQ0FGNEIsQ0FJNUI7RUFDQTs7RUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLE9BQU8sQ0FBQyxLQUFmLEtBQXlCLFdBQXpCLEdBQXVDLE9BQU8sQ0FBQyxLQUEvQyxHQUF1RCxRQUFuRTtFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBQ0UsSUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsc0JBQU4sQ0FBNkIsV0FBN0IsQ0FBNUI7O0VBQ0EsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE1BQXZDLEVBQStDLENBQUMsRUFBaEQsRUFBbUQ7SUFDakQsSUFBSSxxQkFBSixDQUFjLG1CQUFtQixDQUFFLENBQUYsQ0FBakMsRUFBd0MsSUFBeEM7RUFDRDs7RUFDRCxJQUFNLDJCQUEyQixHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixxQ0FBdkIsQ0FBcEM7O0VBQ0EsS0FBSSxJQUFJLEVBQUMsR0FBRyxDQUFaLEVBQWUsRUFBQyxHQUFHLDJCQUEyQixDQUFDLE1BQS9DLEVBQXVELEVBQUMsRUFBeEQsRUFBMkQ7SUFDekQsSUFBSSxxQkFBSixDQUFjLDJCQUEyQixDQUFFLEVBQUYsQ0FBekMsRUFBZ0QsSUFBaEQ7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUVFLElBQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLGtCQUF2QixDQUE5Qjs7RUFDQSxLQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcscUJBQXFCLENBQUMsTUFBekMsRUFBaUQsR0FBQyxFQUFsRCxFQUFxRDtJQUNuRCxJQUFJLGlCQUFKLENBQVUscUJBQXFCLENBQUUsR0FBRixDQUEvQixFQUFzQyxJQUF0QztFQUNEO0VBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O0VBRUUsSUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsc0JBQU4sQ0FBNkIsb0JBQTdCLENBQXpCOztFQUNBLEtBQUksSUFBSSxHQUFDLEdBQUcsQ0FBWixFQUFlLEdBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFwQyxFQUE0QyxHQUFDLEVBQTdDLEVBQWdEO0lBQzlDLElBQUkscUJBQUosQ0FBYyxnQkFBZ0IsQ0FBRSxHQUFGLENBQTlCLEVBQXFDLElBQXJDO0VBQ0Q7RUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7RUFDRSxJQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxzQkFBTixDQUE2QixZQUE3QixDQUF6Qjs7RUFDQSxLQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBcEMsRUFBNEMsR0FBQyxFQUE3QyxFQUFnRDtJQUU5QyxJQUFJLDBCQUFKLENBQW1CLGdCQUFnQixDQUFFLEdBQUYsQ0FBbkMsRUFBMEMsSUFBMUM7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0sMEJBQTBCLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLDRCQUE3QixDQUFuQzs7RUFDQSxLQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsMEJBQTBCLENBQUMsTUFBOUMsRUFBc0QsR0FBQyxFQUF2RCxFQUEwRDtJQUN4RCxJQUFJLGlDQUFKLENBQTBCLDBCQUEwQixDQUFFLEdBQUYsQ0FBcEQsRUFBMkQsSUFBM0Q7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLGFBQTdCLENBQTNCOztFQUNBLEtBQUksSUFBSSxHQUFDLEdBQUcsQ0FBWixFQUFlLEdBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUF0QyxFQUE4QyxHQUFDLEVBQS9DLEVBQWtEO0lBQ2hELElBQUksb0JBQUosQ0FBYSxrQkFBa0IsQ0FBRSxHQUFGLENBQS9CLEVBQXNDLElBQXRDO0VBQ0Q7RUFHRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7RUFDRSxJQUFNLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBTixDQUE2QixxQkFBN0IsQ0FBL0I7O0VBQ0EsS0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFaLEVBQWUsR0FBQyxHQUFHLHNCQUFzQixDQUFDLE1BQTFDLEVBQWtELEdBQUMsRUFBbkQsRUFBc0Q7SUFDcEQsSUFBSSx3QkFBSixDQUFpQixzQkFBc0IsQ0FBRSxHQUFGLENBQXZDLEVBQThDLElBQTlDO0VBQ0Q7RUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7RUFDRSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQ7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUNFLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFOLENBQW9CLCtCQUFwQixDQUFwQjtFQUNBLElBQUksd0JBQUosQ0FBaUIsYUFBakIsRUFBZ0MsSUFBaEM7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUNFLElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1Qix5QkFBdkIsQ0FBeEI7O0VBQ0EsS0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFaLEVBQWUsR0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFuQyxFQUEyQyxHQUFDLEVBQTVDLEVBQStDO0lBQzdDLElBQUksMEJBQUosQ0FBbUIsZUFBZSxDQUFFLEdBQUYsQ0FBbEM7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixZQUF2QixDQUFmOztFQUNBLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBMUIsRUFBa0MsQ0FBQyxFQUFuQyxFQUF1QztJQUNyQyxJQUFJLGlCQUFKLENBQVUsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUIsSUFBckI7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQUksc0JBQUosR0FBaUIsSUFBakI7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUNFLElBQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLHVCQUE3QixDQUFoQzs7RUFDQSxLQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsdUJBQXVCLENBQUMsTUFBM0MsRUFBbUQsR0FBQyxFQUFwRCxFQUF1RDtJQUNyRCxJQUFJLDhCQUFKLENBQXFCLHVCQUF1QixDQUFFLEdBQUYsQ0FBNUMsRUFBbUQsSUFBbkQ7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixpQ0FBdkIsQ0FBeEI7O0VBQ0EsS0FBSSxJQUFJLElBQUMsR0FBRyxDQUFaLEVBQWUsSUFBQyxHQUFHLGVBQWUsQ0FBQyxNQUFuQyxFQUEyQyxJQUFDLEVBQTVDLEVBQStDO0lBQzdDLElBQUksaUJBQUosQ0FBb0IsZUFBZSxDQUFFLElBQUYsQ0FBbkM7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLHlCQUF2QixDQUExQjs7RUFDQSxLQUFJLElBQUksSUFBQyxHQUFHLENBQVosRUFBZSxJQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBckMsRUFBNkMsSUFBQyxFQUE5QyxFQUFpRDtJQUMvQyxJQUFJLDJCQUFKLENBQXdCLGlCQUFpQixDQUFFLElBQUYsQ0FBekMsRUFBZ0QsSUFBaEQ7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztFQUNFLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLFFBQTdCLENBQXpCOztFQUNBLEtBQUksSUFBSSxJQUFDLEdBQUcsQ0FBWixFQUFlLElBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFwQyxFQUE0QyxJQUFDLEVBQTdDLEVBQWdEO0lBQzlDLElBQUksa0JBQUosQ0FBVyxnQkFBZ0IsQ0FBRSxJQUFGLENBQTNCLEVBQWtDLElBQWxDO0VBQ0Q7RUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7RUFDRSxJQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixnQkFBdkIsQ0FBMUI7O0VBQ0EsS0FBSSxJQUFJLElBQUMsR0FBRyxDQUFaLEVBQWUsSUFBQyxHQUFHLGlCQUFpQixDQUFDLE1BQXJDLEVBQTZDLElBQUMsRUFBOUMsRUFBaUQ7SUFDL0MsSUFBSSxtQkFBSixDQUFZLGlCQUFpQixDQUFFLElBQUYsQ0FBN0IsRUFBb0MsSUFBcEM7RUFDRDtBQUVGLENBbExEOztBQW9MQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtFQUFFLElBQUksRUFBSixJQUFGO0VBQVEsU0FBUyxFQUFULHFCQUFSO0VBQW1CLEtBQUssRUFBTCxpQkFBbkI7RUFBMEIsU0FBUyxFQUFULHFCQUExQjtFQUFxQyxjQUFjLEVBQWQsMEJBQXJDO0VBQXFELHFCQUFxQixFQUFyQixpQ0FBckQ7RUFBNEUsUUFBUSxFQUFSLG9CQUE1RTtFQUFzRixZQUFZLEVBQVosd0JBQXRGO0VBQW9HLFVBQVUsRUFBVixVQUFwRztFQUFnSCxZQUFZLEVBQVosd0JBQWhIO0VBQThILGNBQWMsRUFBZCwwQkFBOUg7RUFBOEksS0FBSyxFQUFMLGlCQUE5STtFQUFxSixVQUFVLEVBQVYsc0JBQXJKO0VBQWlLLGdCQUFnQixFQUFoQiw4QkFBaks7RUFBbUwsZUFBZSxFQUFmLGlCQUFuTDtFQUFvTSxtQkFBbUIsRUFBbkIsMkJBQXBNO0VBQXlOLE1BQU0sRUFBTixrQkFBek47RUFBaU8sS0FBSyxFQUFMLGlCQUFqTztFQUF3TyxPQUFPLEVBQVA7QUFBeE8sQ0FBakI7Ozs7O0FDak5BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0VBQ2Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsS0FBSyxFQUFFO0FBYlEsQ0FBakI7Ozs7OztBQ0FBOzs7O0FBRUEsQ0FBQyxVQUFTLFNBQVQsRUFBb0I7RUFDbkI7RUFDQSxJQUFJLE1BQU0sSUFBRyxVQUFVLFFBQVEsQ0FBQyxTQUF0QixDQUFWO0VBRUEsSUFBSSxNQUFKLEVBQVksT0FKTyxDQU1uQjs7RUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixRQUFRLENBQUMsU0FBL0IsRUFBMEMsTUFBMUMsRUFBa0Q7SUFDOUMsS0FBSyxFQUFFLFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0I7TUFBRTtNQUN6QjtNQUNBLElBQUksTUFBTSxHQUFHLEtBQWI7TUFDQSxJQUFJLE9BQU8sR0FBRyxNQUFkO01BQ0EsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLFNBQTlCO01BQ0EsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQTVCOztNQUNBLElBQUksS0FBSyxHQUFHLFNBQVMsS0FBVCxHQUFpQixDQUFFLENBQS9COztNQUNBLElBQUksU0FBUyxHQUFHLGVBQWUsQ0FBQyxRQUFoQztNQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxRQUFPLE1BQU0sQ0FBQyxXQUFkLE1BQThCLFFBQW5GO01BQ0EsSUFBSSxVQUFKO01BQWdCOztNQUFpRCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBVCxDQUFtQixRQUFqQztNQUFBLElBQTJDLGlCQUFpQixHQUFHLFNBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsRUFBa0M7UUFBRSxJQUFJO1VBQUUsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiO1VBQXFCLE9BQU8sSUFBUDtRQUFjLENBQXpDLENBQTBDLE9BQU8sQ0FBUCxFQUFVO1VBQUUsT0FBTyxLQUFQO1FBQWU7TUFBRSxDQUExSztNQUFBLElBQTRLLE9BQU8sR0FBRyxtQkFBdEw7TUFBQSxJQUEyTSxRQUFRLEdBQUcsNEJBQXROOztNQUFvUCxVQUFVLEdBQUcsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCO1FBQUUsSUFBSSxPQUFPLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7VUFBRSxPQUFPLEtBQVA7UUFBZTs7UUFBQyxJQUFJLGNBQUosRUFBb0I7VUFBRSxPQUFPLGlCQUFpQixDQUFDLEtBQUQsQ0FBeEI7UUFBa0M7O1FBQUMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxLQUFmLENBQWY7UUFBc0MsT0FBTyxRQUFRLEtBQUssT0FBYixJQUF3QixRQUFRLEtBQUssUUFBNUM7TUFBdUQsQ0FBblA7O01BQ3JULElBQUksV0FBVyxHQUFHLGNBQWMsQ0FBQyxLQUFqQztNQUNBLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxNQUFsQztNQUNBLElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQyxJQUFoQztNQUNBLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFmLENBYnVCLENBY3ZCO01BRUE7O01BQ0EsSUFBSSxNQUFNLEdBQUcsSUFBYixDQWpCdUIsQ0FrQnZCOztNQUNBLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBRCxDQUFmLEVBQXlCO1FBQ3JCLE1BQU0sSUFBSSxTQUFKLENBQWMsb0RBQW9ELE1BQWxFLENBQU47TUFDSCxDQXJCc0IsQ0FzQnZCO01BQ0E7TUFDQTs7O01BQ0EsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBakIsRUFBNEIsQ0FBNUIsQ0FBWCxDQXpCdUIsQ0F5Qm9CO01BQzNDO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFDQSxJQUFJLEtBQUo7O01BQ0EsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFTLEdBQVk7UUFFckIsSUFBSSxnQkFBZ0IsS0FBcEIsRUFBMkI7VUFDdkI7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBRUEsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQVAsQ0FDVCxJQURTLEVBRVQsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBakIsQ0FBeEIsQ0FGUyxDQUFiOztVQUlBLElBQUksT0FBTyxDQUFDLE1BQUQsQ0FBUCxLQUFvQixNQUF4QixFQUFnQztZQUM1QixPQUFPLE1BQVA7VUFDSDs7VUFDRCxPQUFPLElBQVA7UUFFSCxDQTFCRCxNQTBCTztVQUNIO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFFQTtVQUNBLE9BQU8sTUFBTSxDQUFDLEtBQVAsQ0FDSCxJQURHLEVBRUgsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBakIsQ0FBeEIsQ0FGRyxDQUFQO1FBS0g7TUFFSixDQXZERCxDQXBDdUIsQ0E2RnZCO01BQ0E7TUFDQTtNQUNBO01BQ0E7OztNQUVBLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFELEVBQUksTUFBTSxDQUFDLE1BQVAsR0FBZ0IsSUFBSSxDQUFDLE1BQXpCLENBQXJCLENBbkd1QixDQXFHdkI7TUFDQTs7TUFDQSxJQUFJLFNBQVMsR0FBRyxFQUFoQjs7TUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFdBQXBCLEVBQWlDLENBQUMsRUFBbEMsRUFBc0M7UUFDbEMsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsU0FBaEIsRUFBMkIsTUFBTSxDQUFqQztNQUNILENBMUdzQixDQTRHdkI7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBOzs7TUFDQSxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQUQsRUFBVyxzQkFBc0IsU0FBUyxDQUFDLElBQVYsQ0FBZSxHQUFmLENBQXRCLEdBQTRDLDRDQUF2RCxDQUFSLENBQTZHLE1BQTdHLENBQVI7O01BRUEsSUFBSSxNQUFNLENBQUMsU0FBWCxFQUFzQjtRQUNsQixLQUFLLENBQUMsU0FBTixHQUFrQixNQUFNLENBQUMsU0FBekI7UUFDQSxLQUFLLENBQUMsU0FBTixHQUFrQixJQUFJLEtBQUosRUFBbEIsQ0FGa0IsQ0FHbEI7O1FBQ0EsS0FBSyxDQUFDLFNBQU4sR0FBa0IsSUFBbEI7TUFDSCxDQXpIc0IsQ0EySHZCO01BQ0E7TUFFQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUVBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFFQTs7O01BQ0EsT0FBTyxLQUFQO0lBQ0g7RUFsSjZDLENBQWxEO0FBb0pELENBM0pELEVBNEpDLElBNUpELENBNEpNLHFCQUFvQixNQUFwQix5Q0FBb0IsTUFBcEIsTUFBOEIsTUFBOUIsSUFBd0MscUJBQW9CLElBQXBCLHlDQUFvQixJQUFwQixNQUE0QixJQUFwRSxJQUE0RSxxQkFBb0IsTUFBcEIseUNBQW9CLE1BQXBCLE1BQThCLE1BQTFHLElBQW9ILEVBNUoxSDs7Ozs7Ozs7OztBQ0ZBLENBQUMsVUFBUyxTQUFULEVBQW9CO0VBRXJCO0VBQ0EsSUFBSSxNQUFNLEdBQ1I7RUFDQTtFQUNBLG9CQUFvQixNQUFwQixJQUErQixZQUFXO0lBQ3pDLElBQUk7TUFDSCxJQUFJLENBQUMsR0FBRyxFQUFSO01BQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBdEIsRUFBeUIsTUFBekIsRUFBaUM7UUFBQyxLQUFLLEVBQUM7TUFBUCxDQUFqQztNQUNBLE9BQU8sSUFBUDtJQUNBLENBSkQsQ0FJRSxPQUFNLENBQU4sRUFBUztNQUNWLE9BQU8sS0FBUDtJQUNBO0VBQ0QsQ0FSOEIsRUFIakM7O0VBY0EsSUFBSSxNQUFKLEVBQVksT0FqQlMsQ0FtQnJCOztFQUNDLFdBQVUsb0JBQVYsRUFBZ0M7SUFFaEMsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsU0FBUCxDQUFpQixjQUFqQixDQUFnQyxrQkFBaEMsQ0FBeEI7SUFDQSxJQUFJLDJCQUEyQixHQUFHLCtEQUFsQztJQUNBLElBQUksbUJBQW1CLEdBQUcsdUVBQTFCOztJQUVBLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLFNBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQyxFQUEwQyxVQUExQyxFQUFzRDtNQUU3RTtNQUNBLElBQUksb0JBQW9CLEtBQUssTUFBTSxLQUFLLE1BQVgsSUFBcUIsTUFBTSxLQUFLLFFBQWhDLElBQTRDLE1BQU0sS0FBSyxPQUFPLENBQUMsU0FBL0QsSUFBNEUsTUFBTSxZQUFZLE9BQW5HLENBQXhCLEVBQXFJO1FBQ3BJLE9BQU8sb0JBQW9CLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsVUFBbkIsQ0FBM0I7TUFDQTs7TUFFRCxJQUFJLE1BQU0sS0FBSyxJQUFYLElBQW1CLEVBQUUsTUFBTSxZQUFZLE1BQWxCLElBQTRCLFFBQU8sTUFBUCxNQUFrQixRQUFoRCxDQUF2QixFQUFrRjtRQUNqRixNQUFNLElBQUksU0FBSixDQUFjLDRDQUFkLENBQU47TUFDQTs7TUFFRCxJQUFJLEVBQUUsVUFBVSxZQUFZLE1BQXhCLENBQUosRUFBcUM7UUFDcEMsTUFBTSxJQUFJLFNBQUosQ0FBYyx3Q0FBZCxDQUFOO01BQ0E7O01BRUQsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQUQsQ0FBM0I7TUFDQSxJQUFJLGtCQUFrQixHQUFHLFdBQVcsVUFBWCxJQUF5QixjQUFjLFVBQWhFOztNQUNBLElBQUksVUFBVSxHQUFHLFNBQVMsVUFBVCxZQUE4QixVQUFVLENBQUMsR0FBekMsQ0FBakI7O01BQ0EsSUFBSSxVQUFVLEdBQUcsU0FBUyxVQUFULFlBQThCLFVBQVUsQ0FBQyxHQUF6QyxDQUFqQixDQWxCNkUsQ0FvQjdFOzs7TUFDQSxJQUFJLFVBQUosRUFBZ0I7UUFDZixJQUFJLFVBQVUsS0FBSyxVQUFuQixFQUErQjtVQUM5QixNQUFNLElBQUksU0FBSixDQUFjLDJCQUFkLENBQU47UUFDQTs7UUFDRCxJQUFJLENBQUMsaUJBQUwsRUFBd0I7VUFDdkIsTUFBTSxJQUFJLFNBQUosQ0FBYywyQkFBZCxDQUFOO1FBQ0E7O1FBQ0QsSUFBSSxrQkFBSixFQUF3QjtVQUN2QixNQUFNLElBQUksU0FBSixDQUFjLG1CQUFkLENBQU47UUFDQTs7UUFDRCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsSUFBeEIsQ0FBNkIsTUFBN0IsRUFBcUMsY0FBckMsRUFBcUQsVUFBVSxDQUFDLEdBQWhFO01BQ0EsQ0FYRCxNQVdPO1FBQ04sTUFBTSxDQUFDLGNBQUQsQ0FBTixHQUF5QixVQUFVLENBQUMsS0FBcEM7TUFDQSxDQWxDNEUsQ0FvQzdFOzs7TUFDQSxJQUFJLFVBQUosRUFBZ0I7UUFDZixJQUFJLFVBQVUsS0FBSyxVQUFuQixFQUErQjtVQUM5QixNQUFNLElBQUksU0FBSixDQUFjLDJCQUFkLENBQU47UUFDQTs7UUFDRCxJQUFJLENBQUMsaUJBQUwsRUFBd0I7VUFDdkIsTUFBTSxJQUFJLFNBQUosQ0FBYywyQkFBZCxDQUFOO1FBQ0E7O1FBQ0QsSUFBSSxrQkFBSixFQUF3QjtVQUN2QixNQUFNLElBQUksU0FBSixDQUFjLG1CQUFkLENBQU47UUFDQTs7UUFDRCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsSUFBeEIsQ0FBNkIsTUFBN0IsRUFBcUMsY0FBckMsRUFBcUQsVUFBVSxDQUFDLEdBQWhFO01BQ0EsQ0FoRDRFLENBa0Q3RTs7O01BQ0EsSUFBSSxXQUFXLFVBQWYsRUFBMkI7UUFDMUIsTUFBTSxDQUFDLGNBQUQsQ0FBTixHQUF5QixVQUFVLENBQUMsS0FBcEM7TUFDQTs7TUFFRCxPQUFPLE1BQVA7SUFDQSxDQXhERDtFQXlEQSxDQS9EQSxFQStEQyxNQUFNLENBQUMsY0EvRFIsQ0FBRDtBQWdFQyxDQXBGRCxFQXFGQyxJQXJGRCxDQXFGTSxxQkFBb0IsTUFBcEIseUNBQW9CLE1BQXBCLE1BQThCLE1BQTlCLElBQXdDLHFCQUFvQixJQUFwQix5Q0FBb0IsSUFBcEIsTUFBNEIsSUFBcEUsSUFBNEUscUJBQW9CLE1BQXBCLHlDQUFvQixNQUFwQixNQUE4QixNQUExRyxJQUFvSCxFQXJGMUg7Ozs7Ozs7QUNBQTs7QUFDQTtBQUNBLENBQUMsWUFBWTtFQUNYLElBQUksT0FBTyxNQUFNLENBQUMsV0FBZCxLQUE4QixVQUFsQyxFQUE4QyxPQUFPLEtBQVA7O0VBRTlDLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QixPQUE1QixFQUFxQztJQUNuQyxJQUFNLE1BQU0sR0FBRyxPQUFPLElBQUk7TUFDeEIsT0FBTyxFQUFFLEtBRGU7TUFFeEIsVUFBVSxFQUFFLEtBRlk7TUFHeEIsTUFBTSxFQUFFO0lBSGdCLENBQTFCO0lBS0EsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsYUFBckIsQ0FBWjtJQUNBLEdBQUcsQ0FBQyxlQUFKLENBQ0UsS0FERixFQUVFLE1BQU0sQ0FBQyxPQUZULEVBR0UsTUFBTSxDQUFDLFVBSFQsRUFJRSxNQUFNLENBQUMsTUFKVDtJQU1BLE9BQU8sR0FBUDtFQUNEOztFQUVELE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0QsQ0FwQkQ7OztBQ0ZBOztBQUNBLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFNBQW5DO0FBQ0EsSUFBTSxNQUFNLEdBQUcsUUFBZjs7QUFFQSxJQUFJLEVBQUUsTUFBTSxJQUFJLE9BQVosQ0FBSixFQUEwQjtFQUN4QixNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixNQUEvQixFQUF1QztJQUNyQyxHQUFHLEVBQUUsZUFBWTtNQUNmLE9BQU8sS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQVA7SUFDRCxDQUhvQztJQUlyQyxHQUFHLEVBQUUsYUFBVSxLQUFWLEVBQWlCO01BQ3BCLElBQUksS0FBSixFQUFXO1FBQ1QsS0FBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCO01BQ0QsQ0FGRCxNQUVPO1FBQ0wsS0FBSyxlQUFMLENBQXFCLE1BQXJCO01BQ0Q7SUFDRjtFQVZvQyxDQUF2QztBQVlEOzs7QUNqQkQsYSxDQUNBOztBQUNBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQLEMsQ0FDQTs7O0FBQ0EsT0FBTyxDQUFDLGtCQUFELENBQVAsQyxDQUVBOzs7QUFDQSxPQUFPLENBQUMsaUJBQUQsQ0FBUCxDLENBRUE7OztBQUNBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUVBLE9BQU8sQ0FBQywwQkFBRCxDQUFQOztBQUNBLE9BQU8sQ0FBQyx1QkFBRCxDQUFQOzs7OztBQ2JBLE1BQU0sQ0FBQyxLQUFQLEdBQ0UsTUFBTSxDQUFDLEtBQVAsSUFDQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0VBQ3BCO0VBQ0EsT0FBTyxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsS0FBSyxLQUFLLEtBQTlDO0FBQ0QsQ0FMSDs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtFQUFBLElBQUMsWUFBRCx1RUFBZ0IsUUFBaEI7RUFBQSxPQUE2QixZQUFZLENBQUMsYUFBMUM7QUFBQSxDQUFqQjs7Ozs7QUNBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBRCxDQUF0Qjs7QUFDQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF4QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVc7RUFBQSxrQ0FBSSxHQUFKO0lBQUksR0FBSjtFQUFBOztFQUFBLE9BQ2YsU0FBUyxTQUFULEdBQTJDO0lBQUE7O0lBQUEsSUFBeEIsTUFBd0IsdUVBQWYsUUFBUSxDQUFDLElBQU07SUFDekMsR0FBRyxDQUFDLE9BQUosQ0FBWSxVQUFDLE1BQUQsRUFBWTtNQUN0QixJQUFJLE9BQU8sS0FBSSxDQUFDLE1BQUQsQ0FBWCxLQUF3QixVQUE1QixFQUF3QztRQUN0QyxLQUFJLENBQUMsTUFBRCxDQUFKLENBQWEsSUFBYixDQUFrQixLQUFsQixFQUF3QixNQUF4QjtNQUNEO0lBQ0YsQ0FKRDtFQUtELENBUGM7QUFBQSxDQUFqQjtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQyxNQUFELEVBQVMsS0FBVDtFQUFBLE9BQ2YsUUFBUSxDQUFDLFFBQVQsQ0FDRSxNQURGLEVBRUUsTUFBTSxDQUNKO0lBQ0UsRUFBRSxFQUFFLFFBQVEsQ0FBQyxNQUFELEVBQVMsS0FBVCxDQURkO0lBRUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxVQUFELEVBQWEsUUFBYjtFQUZmLENBREksRUFLSixLQUxJLENBRlIsQ0FEZTtBQUFBLENBQWpCOzs7QUN6QkE7O0FBQ0EsSUFBSSxXQUFXLEdBQUc7RUFDaEIsTUFBTSxDQURVO0VBRWhCLE1BQU0sR0FGVTtFQUdoQixNQUFNLEdBSFU7RUFJaEIsTUFBTSxHQUpVO0VBS2hCLE1BQU07QUFMVSxDQUFsQjtBQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQWpCOzs7OztBQ1RBO0FBQ0EsU0FBUyxtQkFBVCxDQUE4QixFQUE5QixFQUM4RDtFQUFBLElBRDVCLEdBQzRCLHVFQUR4QixNQUN3QjtFQUFBLElBQWhDLEtBQWdDLHVFQUExQixRQUFRLENBQUMsZUFBaUI7RUFDNUQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLHFCQUFILEVBQVg7RUFFQSxPQUNFLElBQUksQ0FBQyxHQUFMLElBQVksQ0FBWixJQUNBLElBQUksQ0FBQyxJQUFMLElBQWEsQ0FEYixJQUVBLElBQUksQ0FBQyxNQUFMLEtBQWdCLEdBQUcsQ0FBQyxXQUFKLElBQW1CLEtBQUssQ0FBQyxZQUF6QyxDQUZBLElBR0EsSUFBSSxDQUFDLEtBQUwsS0FBZSxHQUFHLENBQUMsVUFBSixJQUFrQixLQUFLLENBQUMsV0FBdkMsQ0FKRjtBQU1EOztBQUVELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQUFqQjs7Ozs7QUNiQTtBQUNBLFNBQVMsV0FBVCxHQUF1QjtFQUNyQixPQUNFLE9BQU8sU0FBUCxLQUFxQixXQUFyQixLQUNDLFNBQVMsQ0FBQyxTQUFWLENBQW9CLEtBQXBCLENBQTBCLHFCQUExQixLQUNFLFNBQVMsQ0FBQyxRQUFWLEtBQXVCLFVBQXZCLElBQXFDLFNBQVMsQ0FBQyxjQUFWLEdBQTJCLENBRm5FLEtBR0EsQ0FBQyxNQUFNLENBQUMsUUFKVjtBQU1EOztBQUVELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQWpCOzs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQUMsS0FBRDtFQUFBLE9BQ2hCLEtBQUssSUFBSSxRQUFPLEtBQVAsTUFBaUIsUUFBMUIsSUFBc0MsS0FBSyxDQUFDLFFBQU4sS0FBbUIsQ0FEekM7QUFBQSxDQUFsQjtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUMsUUFBRCxFQUFXLE9BQVgsRUFBdUI7RUFDdEMsSUFBSSxPQUFPLFFBQVAsS0FBb0IsUUFBeEIsRUFBa0M7SUFDaEMsT0FBTyxFQUFQO0VBQ0Q7O0VBRUQsSUFBSSxDQUFDLE9BQUQsSUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFELENBQTFCLEVBQXFDO0lBQ25DLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBakIsQ0FEbUMsQ0FDUjtFQUM1Qjs7RUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsUUFBekIsQ0FBbEI7RUFDQSxPQUFPLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVA7QUFDRCxDQVhEOzs7QUNqQkE7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsZUFBakI7QUFDQSxJQUFNLFFBQVEsR0FBRyxlQUFqQjtBQUNBLElBQU0sTUFBTSxHQUFHLGFBQWY7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQyxNQUFELEVBQVMsUUFBVCxFQUFzQjtFQUVyQyxJQUFJLE9BQU8sUUFBUCxLQUFvQixTQUF4QixFQUFtQztJQUNqQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBcEIsTUFBa0MsT0FBN0M7RUFDRDs7RUFDRCxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixFQUE4QixRQUE5QjtFQUNBLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLENBQVg7RUFDQSxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QixDQUFqQjs7RUFDQSxJQUFJLENBQUMsUUFBTCxFQUFlO0lBQ2IsTUFBTSxJQUFJLEtBQUosQ0FDSixzQ0FBc0MsRUFBdEMsR0FBMkMsR0FEdkMsQ0FBTjtFQUdEOztFQUVELFFBQVEsQ0FBQyxZQUFULENBQXNCLE1BQXRCLEVBQThCLENBQUMsUUFBL0I7RUFDQSxPQUFPLFFBQVA7QUFDRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogYXJyYXktZm9yZWFjaFxuICogICBBcnJheSNmb3JFYWNoIHBvbnlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICogICAoUG9ueWZpbGw6IEEgcG9seWZpbGwgdGhhdCBkb2Vzbid0IG92ZXJ3cml0ZSB0aGUgbmF0aXZlIG1ldGhvZClcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2hcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBUYWt1dG8gV2FkYVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogICBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaC9ibG9iL21hc3Rlci9NSVQtTElDRU5TRVxuICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAoYXJ5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChhcnkuZm9yRWFjaCkge1xuICAgICAgICBhcnkuZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgYXJ5W2ldLCBpLCBhcnkpO1xuICAgIH1cbn07XG4iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjEuMjAxNzA0MjdcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuaWYgKFwiZG9jdW1lbnRcIiBpbiB3aW5kb3cuc2VsZikge1xuXG4vLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG4vLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbmlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4oZnVuY3Rpb24gKHZpZXcpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG52YXJcblx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHQsIG9iakN0ciA9IE9iamVjdFxuXHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0fVxuXHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgaSA9IDBcblx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdCwgXCJBbiBpbnZhbGlkIG9yIGlsbGVnYWwgc3RyaW5nIHdhcyBzcGVjaWZpZWRcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHQsIFwiU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdH1cblx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdHZhclxuXHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0fVxuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHR9O1xuXHR9XG5cdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHR9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG59O1xuY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0dG9rZW4gKz0gXCJcIjtcblx0cmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0LCBpbmRleFxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdHdoaWxlIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0dG9rZW4gKz0gXCJcIjtcblxuXHR2YXJcblx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdDpcblx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdDtcblxuXHRpZiAobWV0aG9kKSB7XG5cdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0fVxuXG5cdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gZm9yY2U7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICFyZXN1bHQ7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG59O1xuXG5pZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0fTtcblx0dHJ5IHtcblx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fVxuXHR9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcbn1cblxufSh3aW5kb3cuc2VsZikpO1xuXG59XG5cbi8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHR9XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9XG5cblx0dGVzdEVsZW1lbnQgPSBudWxsO1xufSgpKTtcblxufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IGlzRW51bS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvdG8gPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IHt9O1xudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyk7XG5cbmNvbnN0IERFTEVHQVRFX1BBVFRFUk4gPSAvXiguKyk6ZGVsZWdhdGVcXCgoLispXFwpJC87XG5jb25zdCBTUEFDRSA9ICcgJztcblxuY29uc3QgZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSwgaGFuZGxlcikge1xuICB2YXIgbWF0Y2ggPSB0eXBlLm1hdGNoKERFTEVHQVRFX1BBVFRFUk4pO1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmIChtYXRjaCkge1xuICAgIHR5cGUgPSBtYXRjaFsxXTtcbiAgICBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICB9XG5cbiAgdmFyIG9wdGlvbnM7XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgY2FwdHVyZTogcG9wS2V5KGhhbmRsZXIsICdjYXB0dXJlJyksXG4gICAgICBwYXNzaXZlOiBwb3BLZXkoaGFuZGxlciwgJ3Bhc3NpdmUnKVxuICAgIH07XG4gIH1cblxuICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGRlbGVnYXRlOiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKVxuICAgICAgPyBkZWxlZ2F0ZUFsbChoYW5kbGVyKVxuICAgICAgOiBzZWxlY3RvclxuICAgICAgICA/IGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICA6IGhhbmRsZXIsXG4gICAgb3B0aW9uczogb3B0aW9uc1xuICB9O1xuXG4gIGlmICh0eXBlLmluZGV4T2YoU1BBQ0UpID4gLTEpIHtcbiAgICByZXR1cm4gdHlwZS5zcGxpdChTUEFDRSkubWFwKGZ1bmN0aW9uKF90eXBlKSB7XG4gICAgICByZXR1cm4gYXNzaWduKHt0eXBlOiBfdHlwZX0sIGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lci50eXBlID0gdHlwZTtcbiAgICByZXR1cm4gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxudmFyIHBvcEtleSA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICBkZWxldGUgb2JqW2tleV07XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVoYXZpb3IoZXZlbnRzLCBwcm9wcykge1xuICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyhldmVudHMpXG4gICAgLnJlZHVjZShmdW5jdGlvbihtZW1vLCB0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHR5cGUsIGV2ZW50c1t0eXBlXSk7XG4gICAgICByZXR1cm4gbWVtby5jb25jYXQobGlzdGVuZXJzKTtcbiAgICB9LCBbXSk7XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgYWRkOiBmdW5jdGlvbiBhZGRCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBwcm9wcyk7XG59O1xuIiwiY29uc3QgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICBkbyB7XG4gICAgaWYgKG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKTtcbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkZWxlZ2F0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZ25vcmUoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yYW5jZShlKSB7XG4gICAgaWYgKGVsZW1lbnQgIT09IGUudGFyZ2V0ICYmICFlbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJlaGF2aW9yOiByZXF1aXJlKCcuL2JlaGF2aW9yJyksXG4gIGRlbGVnYXRlOiByZXF1aXJlKCcuL2RlbGVnYXRlJyksXG4gIGRlbGVnYXRlQWxsOiByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyksXG4gIGlnbm9yZTogcmVxdWlyZSgnLi9pZ25vcmUnKSxcbiAga2V5bWFwOiByZXF1aXJlKCcuL2tleW1hcCcpLFxufTtcbiIsInJlcXVpcmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJyk7XG5cbi8vIHRoZXNlIGFyZSB0aGUgb25seSByZWxldmFudCBtb2RpZmllcnMgc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsXG4vLyBhY2NvcmRpbmcgdG8gTUROOlxuLy8gPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2dldE1vZGlmaWVyU3RhdGU+XG5jb25zdCBNT0RJRklFUlMgPSB7XG4gICdBbHQnOiAgICAgICdhbHRLZXknLFxuICAnQ29udHJvbCc6ICAnY3RybEtleScsXG4gICdDdHJsJzogICAgICdjdHJsS2V5JyxcbiAgJ1NoaWZ0JzogICAgJ3NoaWZ0S2V5J1xufTtcblxuY29uc3QgTU9ESUZJRVJfU0VQQVJBVE9SID0gJysnO1xuXG5jb25zdCBnZXRFdmVudEtleSA9IGZ1bmN0aW9uKGV2ZW50LCBoYXNNb2RpZmllcnMpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleTtcbiAgaWYgKGhhc01vZGlmaWVycykge1xuICAgIGZvciAodmFyIG1vZGlmaWVyIGluIE1PRElGSUVSUykge1xuICAgICAgaWYgKGV2ZW50W01PRElGSUVSU1ttb2RpZmllcl1dID09PSB0cnVlKSB7XG4gICAgICAgIGtleSA9IFttb2RpZmllciwga2V5XS5qb2luKE1PRElGSUVSX1NFUEFSQVRPUik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleW1hcChrZXlzKSB7XG4gIGNvbnN0IGhhc01vZGlmaWVycyA9IE9iamVjdC5rZXlzKGtleXMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKE1PRElGSUVSX1NFUEFSQVRPUikgPiAtMTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBrZXkgPSBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKTtcbiAgICByZXR1cm4gW2tleSwga2V5LnRvTG93ZXJDYXNlKCldXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgX2tleSkge1xuICAgICAgICBpZiAoX2tleSBpbiBrZXlzKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5c1trZXldLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LCB1bmRlZmluZWQpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMuTU9ESUZJRVJTID0gTU9ESUZJRVJTO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xyXG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcclxuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRV9DTEFTUyA9ICdhY2NvcmRpb24tbXVsdGlzZWxlY3RhYmxlJztcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5sZXQgdGV4dCA9IHtcclxuICBcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsXHJcbiAgXCJjbG9zZV9hbGxcIjogXCJMdWsgYWxsZVwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gYWNjb3JkaW9uIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGFjY29yZGlvbiB0aGUgYWNjb3JkaW9uIHVsIGVsZW1lbnRcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsIFwiY2xvc2VfYWxsXCI6IFwiTHVrIGFsbGVcIn1cclxuICovXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigkYWNjb3JkaW9uLCBzdHJpbmdzID0gdGV4dCkge1xyXG4gIGlmKCEkYWNjb3JkaW9uKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gIH1cclxuICB0aGlzLmFjY29yZGlvbiA9ICRhY2NvcmRpb247XHJcbiAgdGV4dCA9IHN0cmluZ3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnMgb24gY2xpY2sgZWxlbWVudHMgaW4gYWNjb3JkaW9uIGxpc3RcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5idXR0b25zID0gdGhpcy5hY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gIGlmKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcblxyXG4gIC8vIGxvb3AgYnV0dG9ucyBpbiBsaXN0XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XHJcbiAgICBcclxuICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXHJcbiAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICB9XHJcbiAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGJ1bGsgYnV0dG9uIGlmIHByZXNlbnRcclxuICBsZXQgcHJldlNpYmxpbmcgPSB0aGlzLmFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDtcclxuICBpZihwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uID0gcHJldlNpYmxpbmc7XHJcbiAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnVsa0V2ZW50LmJpbmQodGhpcykpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1bGsgZXZlbnQgaGFuZGxlcjogVHJpZ2dlcmVkIHdoZW4gY2xpY2tpbmcgb24gLmFjY29yZGlvbi1idWxrLWJ1dHRvblxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5idWxrRXZlbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcztcclxuICBpZighJG1vZHVsZS5hY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7ICBcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uLmApO1xyXG4gIH1cclxuICBpZigkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoID09IDApe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgfVxyXG4gICAgXHJcbiAgbGV0IGV4cGFuZCA9IHRydWU7XHJcbiAgaWYoJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSkgPT09IFwiZmFsc2VcIikge1xyXG4gICAgZXhwYW5kID0gZmFsc2U7XHJcbiAgfVxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgJG1vZHVsZS5idXR0b25zLmxlbmd0aDsgaSsrKXtcclxuICAgICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRtb2R1bGUuYnV0dG9uc1tpXSwgZXhwYW5kLCB0cnVlKTtcclxuICB9XHJcbiAgXHJcbiAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgIWV4cGFuZCk7XHJcbiAgaWYoIWV4cGFuZCA9PT0gdHJ1ZSl7XHJcbiAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSB0ZXh0Lm9wZW5fYWxsO1xyXG4gIH0gZWxzZXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IHRleHQuY2xvc2VfYWxsO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFjY29yZGlvbiBidXR0b24gZXZlbnQgaGFuZGxlcjogVG9nZ2xlcyBhY2NvcmRpb25cclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gJGJ1dHRvbiBcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGUgXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmV2ZW50T25DbGljayA9IGZ1bmN0aW9uICgkYnV0dG9uLCBlKSB7XHJcbiAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRidXR0b24pO1xyXG4gIGlmICgkYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXHJcbiAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCgkYnV0dG9uKSkgJGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG4gQWNjb3JkaW9uLnByb3RvdHlwZS50b2dnbGVCdXR0b24gPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCwgYnVsayA9IGZhbHNlKSB7XHJcbiAgbGV0IGFjY29yZGlvbiA9IG51bGw7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgfSBlbHNlIGlmKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9XHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgaWYoZXhwYW5kZWQpeyAgICBcclxuICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICB9IGVsc2V7XHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbXVsdGlzZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgaWYoYWNjb3JkaW9uICE9PSBudWxsICYmIChhY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJyB8fCBhY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKE1VTFRJU0VMRUNUQUJMRV9DTEFTUykpKXtcclxuICAgIG11bHRpc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZihidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgIGlmKGJ1bGsgPT09IGZhbHNlKXtcclxuICAgICAgICBsZXQgYnV0dG9uc09wZW4gPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgIGxldCBuZXdTdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKXtcclxuICAgICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBidWxrRnVuY3Rpb24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgbmV3U3RhdHVzKTtcclxuICAgICAgICBpZihuZXdTdGF0dXMgPT09IHRydWUpe1xyXG4gICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRleHQub3Blbl9hbGw7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRleHQuY2xvc2VfYWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uICYmIGN1cnJlbnRCdXR0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcgPT09IHRydWUpKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uOyIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xyXG4gICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgY2xvc2UgPSB0aGlzLmFsZXJ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIGNsb3NlWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgbGV0IGV2ZW50SGlkZSA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LmhpZGUnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG59O1xyXG5cclxuQWxlcnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgIFxyXG4gICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LnNob3cnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQmFja1RvVG9wKGJhY2t0b3RvcCl7XHJcbiAgICB0aGlzLmJhY2t0b3RvcCA9IGJhY2t0b3RvcDtcclxufVxyXG5cclxuQmFja1RvVG9wLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgYmFja3RvdG9wYnV0dG9uID0gdGhpcy5iYWNrdG90b3A7XHJcblxyXG4gICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlciggbGlzdCA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkb20tY2hhbmdlZCcsIHtkZXRhaWw6IGxpc3R9KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2hpY2ggbXV0YXRpb25zIHRvIG9ic2VydmVcclxuICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICAgIDogdHJ1ZSxcclxuICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZSAgICAgOiBmYWxzZSxcclxuICAgICAgICBjaGFyYWN0ZXJEYXRhICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZSA6IGZhbHNlLFxyXG4gICAgICAgIGNoaWxkTGlzdCAgICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgc3VidHJlZSAgICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBET00gY2hhbmdlc1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNjcm9sbCBhY3Rpb25zXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2luZG93IHJlc2l6ZXNcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJ1dHRvbikge1xyXG4gICAgbGV0IGRvY0JvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgbGV0IGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBsZXQgaGVpZ2h0T2ZWaWV3cG9ydCA9IE1hdGgubWF4KGRvY0VsZW0uY2xpZW50SGVpZ2h0IHx8IDAsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuICAgIGxldCBoZWlnaHRPZlBhZ2UgPSBNYXRoLm1heChkb2NCb2R5LnNjcm9sbEhlaWdodCwgZG9jQm9keS5vZmZzZXRIZWlnaHQsIGRvY0JvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsZW0uc2Nyb2xsSGVpZ2h0LCBkb2NFbGVtLm9mZnNldEhlaWdodCwgZG9jRWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcclxuICAgIFxyXG4gICAgbGV0IGxpbWl0ID0gaGVpZ2h0T2ZWaWV3cG9ydCAqIDI7IC8vIFRoZSB0aHJlc2hvbGQgc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBiYWNrLXRvLXRvcC1idXR0b24gc2hvdWxkIGJlIGRpc3BsYXllZFxyXG4gICAgXHJcbiAgICAvLyBOZXZlciBzaG93IHRoZSBidXR0b24gaWYgdGhlIHBhZ2UgaXMgdG9vIHNob3J0XHJcbiAgICBpZiAobGltaXQgPiBoZWlnaHRPZlBhZ2UpIHtcclxuICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiB0aGUgcGFnZSBpcyBsb25nLCBjYWxjdWxhdGUgd2hlbiB0byBzaG93IHRoZSBidXR0b25cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdEtub3duU2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgICAgICBsZXQgZm9vdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJmb290ZXJcIilbMF07IC8vIElmIHRoZXJlIGFyZSBzZXZlcmFsIGZvb3RlcnMsIHRoZSBjb2RlIG9ubHkgYXBwbGllcyB0byB0aGUgZmlyc3QgZm9vdGVyXHJcblxyXG4gICAgICAgIC8vIFNob3cgdGhlIGJ1dHRvbiwgaWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHRvbyBmYXIgZG93blxyXG4gICAgICAgIGlmIChsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA+PSBsaW1pdCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzaWRlbmF2LCB3ZSBtaWdodCB3YW50IHRvIHNob3cgdGhlIGJ1dHRvbiBhbnl3YXlcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNpZGVuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZW5hdi1saXN0Jyk7IC8vIEZpbmRzIHNpZGUgbmF2aWdhdGlvbnMgKGxlZnQgbWVudXMpIGFuZCBzdGVwIGd1aWRlc1xyXG5cclxuICAgICAgICAgICAgaWYgKHNpZGVuYXYgJiYgc2lkZW5hdi5vZmZzZXRQYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVhY3QgdG8gc2lkZW5hdnMsIHdoaWNoIGFyZSBhbHdheXMgdmlzaWJsZSAoaS5lLiBub3Qgb3BlbmVkIGZyb20gb3ZlcmZsb3ctbWVudSBidXR0b25zKVxyXG4gICAgICAgICAgICAgICAgaWYgKCEoc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSBcInRydWVcIiAmJlxyXG4gICAgICAgICAgICAgICAgc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IHNpZGVuYXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QuYm90dG9tIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gVGhlcmUncyBubyBzaWRlbmF2IGFuZCB3ZSBrbm93IHRoZSB1c2VyIGhhc24ndCByZWFjaGVkIHRoZSBzY3JvbGwgbGltaXQ6IEVuc3VyZSB0aGUgYnV0dG9uIGlzIGhpZGRlblxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRm9vdGVyVmlzaWJsZShmb290ZXJFbGVtZW50KSB7XHJcbiAgICBpZiAoZm9vdGVyRWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmZvb3RlcicpKSB7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBmb290ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgLy8gRm9vdGVyIGlzIHZpc2libGUgb3IgcGFydGx5IHZpc2libGVcclxuICAgICAgICBpZiAoKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0IHx8IHJlY3QudG9wIDwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEZvb3RlciBpcyBoaWRkZW5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja1RvVG9wOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE1BWF9MRU5HVEggPSAnZGF0YS1tYXhsZW5ndGgnO1xyXG5sZXQgdGV4dCA9IHtcclxuICAgIFwiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIlxyXG59XHJcblxyXG4vKipcclxuICogTnVtYmVyIG9mIGNoYXJhY3RlcnMgbGVmdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLCBcImNoYXJhY3RlcnNfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsIFwiY2hhcmFjdGVyX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIiwgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIn1cclxuICovXHJcbiBmdW5jdGlvbiBDaGFyYWN0ZXJMaW1pdChjb250YWluZXJFbGVtZW50LCBzdHJpbmdzID0gdGV4dCkge1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5pbnB1dCA9IGNvbnRhaW5lckVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1pbnB1dCcpWzBdO1xyXG4gICAgdGhpcy5tYXhsZW5ndGggPSB0aGlzLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoTUFYX0xFTkdUSCk7XHJcbiAgICB0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCA9IG51bGw7XHJcbiAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgIHRleHQgPSBzdHJpbmdzO1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoJ29ucGFnZXNob3cnIGluIHdpbmRvdykge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIHRoaXMudXBkYXRlTWVzc2FnZXMuYmluZCh0aGlzKSk7XHJcbiAgICB9IFxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLnVwZGF0ZU1lc3NhZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuY2hhcmFjdGVyc0xlZnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY3VycmVudF9sZW5ndGggPSB0aGlzLmlucHV0LnZhbHVlLmxlbmd0aDtcclxuICAgIHJldHVybiB0aGlzLm1heGxlbmd0aCAtIGN1cnJlbnRfbGVuZ3RoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UgKGNoYXJhY3RlcnNfbGVmdCkge1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPT09IC0xKSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gdGV4dC5jaGFyYWN0ZXJfdG9vX21hbnkucmVwbGFjZSgve3ZhbHVlfS8sIGV4Y2VlZGVkKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJhY3RlcnNfbGVmdCA9PT0gMSkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSB0ZXh0LmNoYXJhY3Rlcl9yZW1haW5pbmcucmVwbGFjZSgve3ZhbHVlfS8sIGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFyYWN0ZXJzX2xlZnQgPj0gMCkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSB0ZXh0LmNoYXJhY3RlcnNfcmVtYWluaW5nLnJlcGxhY2UoL3t2YWx1ZX0vLCBjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gdGV4dC5jaGFyYWN0ZXJzX3Rvb19tYW55LnJlcGxhY2UoL3t2YWx1ZX0vLCBleGNlZWRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS51cGRhdGVWaXNpYmxlTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjaGFyYWN0ZXJzX2xlZnQgPSB0aGlzLmNoYXJhY3RlcnNMZWZ0KCk7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IGNoYXJhY3RlckxpbWl0TWVzc2FnZShjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPCAwKSB7XHJcbiAgICAgICAgaWYgKCFjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC1leGNlZWRlZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuYWRkKCdsaW1pdC1leGNlZWRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWxpbWl0LWVycm9yJykpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdmb3JtLWxpbWl0LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcclxuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbWl0LWV4Y2VlZGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1saW1pdC1lcnJvcicpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZm9ybS1saW1pdC1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY2hhcmFjdGVyc19sZWZ0ID0gdGhpcy5jaGFyYWN0ZXJzTGVmdCgpO1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgIGxldCBjaGFyYWN0ZXJfbGFiZWwgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdO1xyXG4gICAgY2hhcmFjdGVyX2xhYmVsLmlubmVySFRNTCA9IGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5yZXNldFNjcmVlblJlYWRlck1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5pbnB1dC52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcclxuICAgICAgICBzcl9tZXNzYWdlLmlubmVySFRNTCA9ICcnO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUudXBkYXRlTWVzc2FnZXMgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdGhpcy51cGRhdGVWaXNpYmxlTWVzc2FnZSgpO1xyXG4gICAgdGhpcy51cGRhdGVTY3JlZW5SZWFkZXJNZXNzYWdlKCk7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5oYW5kbGVLZXlVcCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVZpc2libGVNZXNzYWdlKCk7XHJcbiAgICB0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5oYW5kbGVGb2N1cyA9IGZ1bmN0aW9uIChlKSB7ICAgIFxyXG4gICAgLy8gUmVzZXQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZSBvbiBmb2N1cyB0byBmb3JjZSBhbiB1cGRhdGUgb2YgdGhlIG1lc3NhZ2UuXHJcbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCBhIHNjcmVlbiByZWFkZXIgaW5mb3JtcyB0aGUgdXNlciBvZiBob3cgbWFueSBjaGFyYWN0ZXJzIHRoZXJlIGlzIGxlZnRcclxuICAgIC8vIG9uIGZvY3VzIGFuZCBub3QganVzdCB3aGF0IHRoZSBjaGFyYWN0ZXIgbGltaXQgaXMuXHJcbiAgICB0aGlzLnJlc2V0U2NyZWVuUmVhZGVyTWVzc2FnZSgpO1xyXG5cclxuICAgIHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEb24ndCB1cGRhdGUgdGhlIFNjcmVlbiBSZWFkZXIgbWVzc2FnZSB1bmxlc3MgaXQncyBiZWVuIGF3aGlsZVxyXG4gICAgICAgIC8vIHNpbmNlIHRoZSBsYXN0IGtleSB1cCBldmVudC4gT3RoZXJ3aXNlLCB0aGUgdXNlciB3aWxsIGJlIHNwYW1tZWRcclxuICAgICAgICAvLyB3aXRoIGF1ZGlvIG5vdGlmaWNhdGlvbnMgd2hpbGUgdHlwaW5nLlxyXG4gICAgICAgIGlmICghdGhpcy5sYXN0S2V5VXBUaW1lc3RhbXAgfHwgKERhdGUubm93KCkgLSA1MDApID49IHRoaXMubGFzdEtleVVwVGltZXN0YW1wKSB7XHJcbiAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIGxldCB2aXNpYmxlX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQnKVswXS5pbm5lckhUTUw7ICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXMgdW5sZXNzIHRoZSB2YWx1ZSBvZiB0aGUgdGV4dGFyZWEvdGV4dCBpbnB1dCBoYXMgY2hhbmdlZCBvciBpZiB0aGVyZVxyXG4gICAgICAgICAgICAvLyBpcyBhIG1pc21hdGNoIGJldHdlZW4gdGhlIHZpc2libGUgbWVzc2FnZSBhbmQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZS5cclxuICAgICAgICAgICAgaWYgKHRoaXMub2xkVmFsdWUgIT09IHRoaXMuaW5wdXQudmFsdWUgfHwgc3JfbWVzc2FnZSAhPT0gdmlzaWJsZV9tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmhhbmRsZUJsdXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSUQpO1xyXG4gICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyBvbiBibHVyIHVubGVzcyB0aGUgdmFsdWUgb2YgdGhlIHRleHRhcmVhL3RleHQgaW5wdXQgaGFzIGNoYW5nZWRcclxuICAgIGlmICh0aGlzLm9sZFZhbHVlICE9PSB0aGlzLmlucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJMaW1pdDsiLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuXHJcbmNvbnN0IFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFID0gJ2RhdGEtYXJpYS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGNoZWNrYm94IGNvbGxhcHNlIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIENoZWNrYm94VG9nZ2xlQ29udGVudChjaGVja2JveEVsZW1lbnQpe1xyXG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQgPSBjaGVja2JveEVsZW1lbnQ7XHJcbiAgICB0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50cyBvbiBjaGVja2JveCBzdGF0ZSBjaGFuZ2VcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMudG9nZ2xlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgY2hlY2tib3ggY29udGVudFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgdmFyIHRhcmdldEF0dHIgPSB0aGlzLmNoZWNrYm94RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUpXHJcbiAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSk7XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmNoZWNrYm94RWxlbWVudC5jaGVja2VkKXtcclxuICAgICAgICAkbW9kdWxlLmV4cGFuZCh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJG1vZHVsZS5jb2xsYXBzZSh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24oY2hlY2tib3hFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihjaGVja2JveEVsZW1lbnQgIT09IG51bGwgJiYgY2hlY2tib3hFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxhcHNlIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XHJcbiIsImltcG9ydCB7a2V5bWFwfSBmcm9tICdyZWNlcHRvcic7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xyXG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xyXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xyXG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xyXG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X193cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWluaXRpYWxpemVkYDtcclxuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9faW50ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZXh0ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19jYWxlbmRhcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVU19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fc3RhdHVzYDtcclxuY29uc3QgREFURV9QSUNLRVJfR1VJREVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2d1aWRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XHJcblxyXG5jb25zdCBESUFMT0dfV1JBUFBFUl9DTEFTUyA9IGBkaWFsb2ctd3JhcHBlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0RJQUxPR19XUkFQUEVSID0gYC4ke0RJQUxPR19XUkFQUEVSX0NMQVNTfWA7XHJcblxyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLWVuZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xyXG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2NlbGxgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF5LW9mLXdlZWtgO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OID0gYC4ke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUiA9IGAuJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0dVSURFID0gYC4ke0RBVEVfUElDS0VSX0dVSURFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USCA9IGAuJHtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUiA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1N9YDtcclxuXHJcbmxldCB0ZXh0ID0ge1xyXG4gIFwib3Blbl9jYWxlbmRhclwiOiBcIsOFYm4ga2FsZW5kZXJcIixcclxuICBcImNob29zZV9hX2RhdGVcIjogXCJWw6ZsZyBlbiBkYXRvXCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlX2JldHdlZW5cIjogXCJWw6ZsZyBlbiBkYXRvIG1lbGxlbSB7bWluRGF5fS4ge21pbk1vbnRoU3RyfSB7bWluWWVhcn0gb2cge21heERheX0uIHttYXhNb250aFN0cn0ge21heFllYXJ9XCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlX2JlZm9yZVwiOiBcIlbDpmxnIGVuIGRhdG8uIERlciBrYW4gdsOmbGdlcyBpbmR0aWwge21heERheX0uIHttYXhNb250aFN0cn0ge21heFllYXJ9LlwiLFxyXG4gIFwiY2hvb3NlX2FfZGF0ZV9hZnRlclwiOiBcIlbDpmxnIGVuIGRhdG8uIERlciBrYW4gdsOmbGdlcyBmcmEge21pbkRheX0uIHttaW5Nb250aFN0cn0ge21pblllYXJ9IG9nIGZyZW1hZC5cIixcclxuICBcImFyaWFfbGFiZWxfZGF0ZVwiOiBcIntkYXlTdHJ9IGRlbiB7ZGF5fS4ge21vbnRoU3RyfSB7eWVhcn1cIixcclxuICBcImN1cnJlbnRfbW9udGhfZGlzcGxheWVkXCI6IFwiVmlzZXIge21vbnRoTGFiZWx9IHtmb2N1c2VkWWVhcn1cIixcclxuICBcImZpcnN0X3Bvc3NpYmxlX2RhdGVcIjogXCJGw7hyc3RlIHZhbGdiYXJlIGRhdG9cIixcclxuICBcImxhc3RfcG9zc2libGVfZGF0ZVwiOiBcIlNpZHN0ZSB2YWxnYmFyZSBkYXRvXCIsXHJcbiAgXCJwcmV2aW91c195ZWFyXCI6IFwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCIsXHJcbiAgXCJwcmV2aW91c19tb250aFwiOiBcIk5hdmlnw6lyIMOpbiBtw6VuZWQgdGlsYmFnZVwiLFxyXG4gIFwibmV4dF9tb250aFwiOiBcIk5hdmlnw6lyIMOpbiBtw6VuZWQgZnJlbVwiLFxyXG4gIFwibmV4dF95ZWFyXCI6IFwiTmF2aWfDqXIgw6l0IMOlciBmcmVtXCIsXHJcbiAgXCJzZWxlY3RfbW9udGhcIjogXCJWw6ZsZyBtw6VuZWRcIixcclxuICBcInNlbGVjdF95ZWFyXCI6IFwiVsOmbGcgw6VyXCIsXHJcbiAgXCJwcmV2aW91c195ZWFyc1wiOiBcIk5hdmlnw6lyIHt5ZWFyc30gw6VyIHRpbGJhZ2VcIixcclxuICBcIm5leHRfeWVhcnNcIjogXCJOYXZpZ8OpciB7eWVhcnN9IMOlciBmcmVtXCIsXHJcbiAgXCJndWlkZVwiOiBcIk5hdmlnZXJlciBkdSBtZWQgdGFzdGF0dXIsIGthbiBkdSBza2lmdGUgZGFnIG1lZCBow7hqcmUgb2cgdmVuc3RyZSBwaWxldGFzdGVyLCB1Z2VyIG1lZCBvcCBvZyBuZWQgcGlsZXRhc3RlciwgbcOlbmVkZXIgbWVkIHBhZ2UgdXAgb2cgcGFnZSBkb3duLXRhc3Rlcm5lIG9nIMOlciBtZWQgc2hpZnQtdGFzdGVuIHBsdXMgcGFnZSB1cCBlbGxlciBwYWdlIGRvd24uIEhvbWUgb2cgZW5kLXRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIixcclxuICBcIm1vbnRoc19kaXNwbGF5ZWRcIjogXCJWw6ZsZyBlbiBtw6VuZWRcIixcclxuICBcInllYXJzX2Rpc3BsYXllZFwiOiBcIlZpc2VyIMOlciB7c3RhcnR9IHRpbCB7ZW5kfS4gVsOmbGcgZXQgw6VyLlwiLFxyXG4gIFwiamFudWFyeVwiOiBcImphbnVhclwiLFxyXG4gIFwiZmVicnVhcnlcIjogXCJmZWJydWFyXCIsXHJcbiAgXCJtYXJjaFwiOiBcIm1hcnRzXCIsXHJcbiAgXCJhcHJpbFwiOiBcImFwcmlsXCIsXHJcbiAgXCJtYXlcIjogXCJtYWpcIixcclxuICBcImp1bmVcIjogXCJqdW5pXCIsXHJcbiAgXCJqdWx5XCI6IFwianVsaVwiLFxyXG4gIFwiYXVndXN0XCI6IFwiYXVndXN0XCIsXHJcbiAgXCJzZXB0ZW1iZXJcIjogXCJzZXB0ZW1iZXJcIixcclxuICBcIm9jdG9iZXJcIjogXCJva3RvYmVyXCIsXHJcbiAgXCJub3ZlbWJlclwiOiBcIm5vdmVtYmVyXCIsXHJcbiAgXCJkZWNlbWJlclwiOiBcImRlY2VtYmVyXCIsXHJcbiAgXCJtb25kYXlcIjogXCJtYW5kYWdcIixcclxuICBcInR1ZXNkYXlcIjogXCJ0aXJzZGFnXCIsXHJcbiAgXCJ3ZWRuZXNkYXlcIjogXCJvbnNkYWdcIixcclxuICBcInRodXJzZGF5XCI6IFwidG9yc2RhZ1wiLFxyXG4gIFwiZnJpZGF5XCI6IFwiZnJlZGFnXCIsXHJcbiAgXCJzYXR1cmRheVwiOiBcImzDuHJkYWdcIixcclxuICBcInN1bmRheVwiOiBcInPDuG5kYWdcIlxyXG59XHJcblxyXG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIkluZHRhc3QgdmVubGlnc3QgZW4gZ3lsZGlnIGRhdG9cIjtcclxuXHJcbmxldCBNT05USF9MQUJFTFMgPSBbXHJcbiAgdGV4dC5qYW51YXJ5LFxyXG4gIHRleHQuZmVicnVhcnksXHJcbiAgdGV4dC5tYXJjaCxcclxuICB0ZXh0LmFwcmlsLFxyXG4gIHRleHQubWF5LFxyXG4gIHRleHQuanVuZSxcclxuICB0ZXh0Lmp1bHksXHJcbiAgdGV4dC5hdWd1c3QsXHJcbiAgdGV4dC5zZXB0ZW1iZXIsXHJcbiAgdGV4dC5vY3RvYmVyLFxyXG4gIHRleHQubm92ZW1iZXIsXHJcbiAgdGV4dC5kZWNlbWJlclxyXG5dO1xyXG5cclxubGV0IERBWV9PRl9XRUVLX0xBQkVMUyA9IFtcclxuICB0ZXh0Lm1vbmRheSxcclxuICB0ZXh0LnR1ZXNkYXksXHJcbiAgdGV4dC53ZWRuZXNkYXksXHJcbiAgdGV4dC50aHVyc2RheSxcclxuICB0ZXh0LmZyaWRheSxcclxuICB0ZXh0LnNhdHVyZGF5LFxyXG4gIHRleHQuc3VuZGF5XHJcbl07XHJcblxyXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XHJcblxyXG5jb25zdCBZRUFSX0NIVU5LID0gMTI7XHJcblxyXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XHJcbmNvbnN0IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQgPSBcIkREL01NL1lZWVlcIjtcclxuY29uc3QgSU5URVJOQUxfREFURV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcclxuXHJcbmNvbnN0IE5PVF9ESVNBQkxFRF9TRUxFQ1RPUiA9IFwiOm5vdChbZGlzYWJsZWRdKVwiO1xyXG5cclxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XHJcbiAgc2VsZWN0b3JzLm1hcCgocXVlcnkpID0+IHF1ZXJ5ICsgTk9UX0RJU0FCTEVEX1NFTEVDVE9SKS5qb2luKFwiLCBcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVIsXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUixcclxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxyXG4gIENBTEVOREFSX0RBVEVfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgWUVBUl9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURcclxuKTtcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogS2VlcCBkYXRlIHdpdGhpbiBtb250aC4gTW9udGggd291bGQgb25seSBiZSBvdmVyIGJ5IDEgdG8gMyBkYXlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvQ2hlY2sgdGhlIGRhdGUgb2JqZWN0IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgY29ycmVjdCBtb250aFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlV2l0aGluTW9udGggPSAoZGF0ZVRvQ2hlY2ssIG1vbnRoKSA9PiB7XHJcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XHJcbiAgICBkYXRlVG9DaGVjay5zZXREYXRlKDApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGVUb0NoZWNrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIGZyb20gbW9udGggZGF5IHllYXJcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgbW9udGggdG8gc2V0ICh6ZXJvLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHNldCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIGRhdGUpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRvZGF5cyBkYXRlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxyXG4gKi9cclxuY29uc3QgdG9kYXkgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgZGF5ID0gbmV3RGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcclxuICByZXR1cm4gc2V0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGxhc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBsYXN0RGF5T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF5cyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGREYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcbiAgbmV3RGF0ZS5zZXREYXRlKG5ld0RhdGUuZ2V0RGF0ZSgpICsgbnVtRGF5cyk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XHJcblxyXG4vKipcclxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcclxuICBpZihkYXlPZldlZWsgPT09IC0xKXtcclxuICAgIGRheU9mV2VlayA9IDY7XHJcbiAgfVxyXG4gIHJldHVybiBzdWJEYXlzKF9kYXRlLCBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFN1bmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgZW5kT2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGFkZERheXMoX2RhdGUsIDcgLSBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb250aHMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZE1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IGRhdGVNb250aCA9IChuZXdEYXRlLmdldE1vbnRoKCkgKyAxMiArIG51bU1vbnRocykgJSAxMjtcclxuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBkYXRlTW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBtb250aHMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IGFkZE1vbnRocyhfZGF0ZSwgLW51bU1vbnRocyk7XHJcblxyXG4vKipcclxuICogQWRkIHllYXJzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRNb250aHMoX2RhdGUsIG51bVllYXJzICogMTIpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHllYXJzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZFllYXJzKF9kYXRlLCAtbnVtWWVhcnMpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBtb250aHMgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggemVyby1pbmRleGVkIG1vbnRoIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldE1vbnRoID0gKF9kYXRlLCBtb250aCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHllYXIgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRZZWFyID0gKF9kYXRlLCB5ZWFyKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGVhcmxpZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1pbiA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPCBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbGF0ZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIHllYXJcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVZZWFyID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSBtb250aFxyXG4gKi9cclxuY29uc3QgaXNTYW1lTW9udGggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZVllYXIoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXRNb250aCgpID09PSBkYXRlQi5nZXRNb250aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyB0aGUgc2FtZSBkYXRlXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZU1vbnRoKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0RGF0ZSgpID09PSBkYXRlQi5nZXREYXRlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmV0dXJuIGEgbmV3IGRhdGUgd2l0aGluIG1pbmltdW0gYW5kIG1heGltdW0gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlIGJldHdlZW4gbWluIGFuZCBtYXhcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlO1xyXG5cclxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtaW5EYXRlO1xyXG4gIH0gZWxzZSBpZiAobWF4RGF0ZSAmJiBkYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGlzIHZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZVdpdGhpbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PlxyXG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyB5ZWFyIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDExKSkgPCBtaW5EYXRlIHx8XHJcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGEgZGF0ZSB3aXRoIGZvcm1hdCBELU0tWVlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgdGhlIGRhdGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxyXG4gIGRhdGVTdHJpbmcsXHJcbiAgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gIGFkanVzdERhdGUgPSBmYWxzZVxyXG4pID0+IHtcclxuICBsZXQgZGF0ZTtcclxuICBsZXQgbW9udGg7XHJcbiAgbGV0IGRheTtcclxuICBsZXQgeWVhcjtcclxuICBsZXQgcGFyc2VkO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XHJcbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xyXG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh5ZWFyU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIHllYXIgPSBNYXRoLm1heCgwLCB5ZWFyKTtcclxuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyU3R1YiA9XHJcbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHllYXIgPSBjdXJyZW50WWVhclN0dWIgKyBwYXJzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KG1vbnRoU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBtb250aCA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWluKDEyLCBtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoZGF5U3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBkYXkgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIGNvbnN0IGxhc3REYXlPZlRoZU1vbnRoID0gc2V0RGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWluKGxhc3REYXlPZlRoZU1vbnRoLCBkYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGRhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IE1NLURELVlZWVlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xyXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcclxuICAgIHJldHVybiBgMDAwMCR7dmFsdWV9YC5zbGljZSgtbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi9cIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3BhZFplcm9zKHllYXIsIDQpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKGRheSwgMildLmpvaW4oXCItXCIpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBncmlkIHN0cmluZyBmcm9tIGFuIGFycmF5IG9mIGh0bWwgc3RyaW5nc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IHJvd1NpemUgdGhlIGxlbmd0aCBvZiBhIHJvd1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ3JpZCBzdHJpbmdcclxuICovXHJcbmNvbnN0IGxpc3RUb0dyaWRIdG1sID0gKGh0bWxBcnJheSwgcm93U2l6ZSkgPT4ge1xyXG4gIGNvbnN0IGdyaWQgPSBbXTtcclxuICBsZXQgcm93ID0gW107XHJcblxyXG4gIGxldCBpID0gMDtcclxuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcclxuICAgIHJvdyA9IFtdO1xyXG4gICAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoICYmIHJvdy5sZW5ndGggPCByb3dTaXplKSB7XHJcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IGFuZCBkaXNwYXRjaCBhIGNoYW5nZSBldmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbGVtZW50VG9DaGFuZ2UgPSBlbDtcclxuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcclxuXHJcblxyXG4gIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBkaWFsb2dFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBndWlkZUVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGZpcnN0WWVhckNodW5rRWxcclxuICogQHByb3BlcnR5IHtEYXRlfSBjYWxlbmRhckRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtaW5EYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWF4RGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHNlbGVjdGVkRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHJhbmdlRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGRlZmF1bHREYXRlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqIEByZXR1cm5zIHtEYXRlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcclxuICovXHJcbmNvbnN0IGdldERhdGVQaWNrZXJDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcblxyXG4gIGlmICghZGF0ZVBpY2tlckVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUElDS0VSfWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuICBjb25zdCB0b2dnbGVCdG5FbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0JVVFRPTik7XHJcbiAgY29uc3Qgc3RhdHVzRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9TVEFUVVMpO1xyXG4gIGNvbnN0IGd1aWRlRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9HVUlERSk7XHJcbiAgY29uc3QgZmlyc3RZZWFyQ2h1bmtFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVIpO1xyXG4gIGNvbnN0IGRpYWxvZ0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfRElBTE9HX1dSQVBQRVIpO1xyXG5cclxuICBjb25zdCBpbnB1dERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBleHRlcm5hbElucHV0RWwudmFsdWUsXHJcbiAgICBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gICAgdHJ1ZVxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGludGVybmFsSW5wdXRFbC52YWx1ZSk7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhjYWxlbmRhckVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSk7XHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlKTtcclxuICBjb25zdCByYW5nZURhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQucmFuZ2VEYXRlKTtcclxuICBjb25zdCBkZWZhdWx0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0RGF0ZSk7XHJcblxyXG4gIGlmIChtaW5EYXRlICYmIG1heERhdGUgJiYgbWluRGF0ZSA+IG1heERhdGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gZGF0ZSBjYW5ub3QgYmUgYWZ0ZXIgbWF4aW11bSBkYXRlXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICB0b2dnbGVCdG5FbCxcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGd1aWRlRWxcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IEQvTS9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBsZXQgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGU7XHJcbiAgY29uc3QgaGFzTWluRGF0ZSA9IG1pbkRhdGUgIT09IHVuZGVmaW5lZCAmJiBtaW5EYXRlICE9PSBcIlwiO1xyXG4gIGNvbnN0IGlzRGVmYXVsdE1pbkRhdGUgPSAgbWluRGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1pbkRhdGUgIT09IFwiXCIgJiYgcGFyc2VEYXRlU3RyaW5nKERFRkFVTFRfTUlOX0RBVEUpLmdldFRpbWUoKSA9PT0gbWluRGF0ZS5nZXRUaW1lKCk7XHJcbiAgY29uc3QgaGFzTWF4RGF0ZSA9IG1heERhdGUgIT09IHVuZGVmaW5lZCAmJiBtYXhEYXRlICE9PSBcIlwiO1xyXG4gIFxyXG4gIGlmIChoYXNNaW5EYXRlICYmICFpc0RlZmF1bHRNaW5EYXRlICYmIGhhc01heERhdGUpIHtcclxuICAgIGNvbnN0IG1pbkRheSA9IG1pbkRhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbWluTW9udGggPSBtaW5EYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtaW5Nb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttaW5Nb250aF07XHJcbiAgICBjb25zdCBtaW5ZZWFyID0gbWluRGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbWF4RGF5ID0gbWF4RGF0ZS5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtYXhNb250aCA9IG1heERhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21heE1vbnRoXTtcclxuICAgIGNvbnN0IG1heFllYXIgPSBtYXhEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZV9iZXR3ZWVuLnJlcGxhY2UoL3ttaW5EYXl9LywgbWluRGF5KS5yZXBsYWNlKC97bWluTW9udGhTdHJ9LywgbWluTW9udGhTdHIpLnJlcGxhY2UoL3ttaW5ZZWFyfS8sIG1pblllYXIpLnJlcGxhY2UoL3ttYXhEYXl9LywgbWF4RGF5KS5yZXBsYWNlKC97bWF4TW9udGhTdHJ9LywgbWF4TW9udGhTdHIpLnJlcGxhY2UoL3ttYXhZZWFyfS8sIG1heFllYXIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChoYXNNaW5EYXRlICYmICFpc0RlZmF1bHRNaW5EYXRlICYmICFoYXNNYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtaW5EYXkgPSBtaW5EYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1pbk1vbnRoID0gbWluRGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWluTW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWluTW9udGhdO1xyXG4gICAgY29uc3QgbWluWWVhciA9IG1pbkRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2FmdGVyLnJlcGxhY2UoL3ttaW5EYXl9LywgbWluRGF5KS5yZXBsYWNlKC97bWluTW9udGhTdHJ9LywgbWluTW9udGhTdHIpLnJlcGxhY2UoL3ttaW5ZZWFyfS8sIG1pblllYXIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChoYXNNYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtYXhEYXkgPSBtYXhEYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoID0gbWF4RGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWF4TW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWF4TW9udGhdO1xyXG4gICAgY29uc3QgbWF4WWVhciA9IG1heERhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2JlZm9yZS5yZXBsYWNlKC97bWF4RGF5fS8sIG1heERheSkucmVwbGFjZSgve21heE1vbnRoU3RyfS8sIG1heE1vbnRoU3RyKS5yZXBsYWNlKC97bWF4WWVhcn0vLCBtYXhZZWFyKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGd1aWRlSUQgPSBleHRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwiaWRcIikgKyBcIi1ndWlkZVwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm9wZW5fY2FsZW5kYXJ9XCI+Jm5ic3A7PC9idXR0b24+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCIke0RJQUxPR19XUkFQUEVSX0NMQVNTfVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCIke2RpYWxvZ1RpdGxlfVwiIGFyaWEtZGVzY3JpYmVkYnk9XCIke2d1aWRlSUR9XCIgaGlkZGVuPjxkaXYgcm9sZT1cImFwcGxpY2F0aW9uXCI+PGRpdiBjbGFzcz1cIiR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9XCIgaGlkZGVuPjwvZGl2PjwvZGl2PjwvZGl2PmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwic3Itb25seSAke0RBVEVfUElDS0VSX1NUQVRVU19DTEFTU31cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfR1VJREVfQ0xBU1N9XCIgaWQ9XCIke2d1aWRlSUR9XCIgaGlkZGVuPiR7dGV4dC5ndWlkZX08L2Rpdj5gXHJcbiAgICBdLmpvaW4oXCJcIilcclxuICApO1xyXG5cclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgXCJzci1vbmx5XCIsXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU1xyXG4gICk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcclxuICBpbnRlcm5hbElucHV0RWwucmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmFwcGVuZENoaWxkKGNhbGVuZGFyV3JhcHBlcik7XHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpO1xyXG5cclxuICBpZiAoZGVmYXVsdFZhbHVlKSB7XHJcbiAgICBzZXRDYWxlbmRhclZhbHVlKGRhdGVQaWNrZXJFbCwgZGVmYXVsdFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQpIHtcclxuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcclxuICAgIGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXh0ZXJuYWxJbnB1dEVsLnZhbHVlKSB7XHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChleHRlcm5hbElucHV0RWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogcmVuZGVyIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlVG9EaXNwbGF5IGEgZGF0ZSB0byByZW5kZXIgb24gdGhlIGNhbGVuZGFyXHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCByZW5kZXJDYWxlbmRhciA9IChlbCwgX2RhdGVUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHJhbmdlRGF0ZSxcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgZ3VpZGVFbFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgdG9kYXlzRGF0ZSA9IHRvZGF5KCk7XHJcbiAgbGV0IGRhdGVUb0Rpc3BsYXkgPSBfZGF0ZVRvRGlzcGxheSB8fCB0b2RheXNEYXRlO1xyXG5cclxuICBjb25zdCBjYWxlbmRhcldhc0hpZGRlbiA9IGNhbGVuZGFyRWwuaGlkZGVuO1xyXG5cclxuICBjb25zdCBmb2N1c2VkRGF0ZSA9IGFkZERheXMoZGF0ZVRvRGlzcGxheSwgMCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gZGF0ZVRvRGlzcGxheS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IGZvY3VzZWRZZWFyID0gZGF0ZVRvRGlzcGxheS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICBjb25zdCBwcmV2TW9udGggPSBzdWJNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcbiAgY29uc3QgbmV4dE1vbnRoID0gYWRkTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Rm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoZGF0ZVRvRGlzcGxheSk7XHJcblxyXG4gIGNvbnN0IGZpcnN0T2ZNb250aCA9IHN0YXJ0T2ZNb250aChkYXRlVG9EaXNwbGF5KTtcclxuICBjb25zdCBwcmV2QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWluRGF0ZSk7XHJcbiAgY29uc3QgbmV4dEJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1heERhdGUpO1xyXG5cclxuICBjb25zdCByYW5nZUNvbmNsdXNpb25EYXRlID0gc2VsZWN0ZWREYXRlIHx8IGRhdGVUb0Rpc3BsYXk7XHJcbiAgY29uc3QgcmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgbWluKHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcbiAgY29uc3QgcmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIG1heChyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xyXG5cclxuICBjb25zdCB3aXRoaW5SYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBhZGREYXlzKHJhbmdlU3RhcnREYXRlLCAxKTtcclxuICBjb25zdCB3aXRoaW5SYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgc3ViRGF5cyhyYW5nZUVuZERhdGUsIDEpO1xyXG5cclxuICBjb25zdCBtb250aExhYmVsID0gTU9OVEhfTEFCRUxTW2ZvY3VzZWRNb250aF07XHJcblxyXG4gIGNvbnN0IGdlbmVyYXRlRGF0ZUh0bWwgPSAoZGF0ZVRvUmVuZGVyKSA9PiB7XHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX0RBVEVfQ0xBU1NdO1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZVRvUmVuZGVyLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZVRvUmVuZGVyLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZVRvUmVuZGVyLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBsZXQgZGF5T2ZXZWVrID0gZGF0ZVRvUmVuZGVyLmdldERheSgpIC0gMTtcclxuICAgIGlmIChkYXlPZldlZWsgPT09IC0xKSB7XHJcbiAgICAgIGRheU9mV2VlayA9IDY7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoZGF0ZVRvUmVuZGVyKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9ICFpc0RhdGVXaXRoaW5NaW5BbmRNYXgoZGF0ZVRvUmVuZGVyLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBzZWxlY3RlZERhdGUpO1xyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIHByZXZNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBuZXh0TW9udGgpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgdG9kYXlzRGF0ZSkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfVE9EQVlfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyYW5nZURhdGUpIHtcclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlU3RhcnREYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfU1RBUlRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VFbmREYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChcclxuICAgICAgICAgIGRhdGVUb1JlbmRlcixcclxuICAgICAgICAgIHdpdGhpblJhbmdlU3RhcnREYXRlLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VFbmREYXRlXHJcbiAgICAgICAgKVxyXG4gICAgICApIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttb250aF07XHJcbiAgICBjb25zdCBkYXlTdHIgPSBEQVlfT0ZfV0VFS19MQUJFTFNbZGF5T2ZXZWVrXTtcclxuICAgIGNvbnN0IGFyaWFMYWJlbERhdGUgPSB0ZXh0LmFyaWFfbGFiZWxfZGF0ZS5yZXBsYWNlKC97ZGF5U3RyfS8sIGRheVN0cikucmVwbGFjZSgve2RheX0vLCBkYXkpLnJlcGxhY2UoL3ttb250aFN0cn0vLCBtb250aFN0cikucmVwbGFjZSgve3llYXJ9LywgeWVhcik7XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uXHJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgIGRhdGEtZGF5PVwiJHtkYXl9XCIgXHJcbiAgICAgIGRhdGEtbW9udGg9XCIke21vbnRoICsgMX1cIiBcclxuICAgICAgZGF0YS15ZWFyPVwiJHt5ZWFyfVwiIFxyXG4gICAgICBkYXRhLXZhbHVlPVwiJHtmb3JtYXR0ZWREYXRlfVwiXHJcbiAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbERhdGV9XCJcclxuICAgICAgYXJpYS1jdXJyZW50PVwiJHtpc1NlbGVjdGVkID8gXCJkYXRlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5wcmV2aW91c195ZWFyfVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0LnByZXZpb3VzX21vbnRofVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7bW9udGhMYWJlbH0uICR7dGV4dC5zZWxlY3RfbW9udGh9LlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uICR7dGV4dC5zZWxlY3RfeWVhcn0uXCJcclxuICAgICAgICAgID4ke2ZvY3VzZWRZZWFyfTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X21vbnRofVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X3llYXJ9XCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGlmIChkaWFsb2dFbC5oaWRkZW4gPT09IHRydWUpIHtcclxuICAgIGRpYWxvZ0VsLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgaWYgKGd1aWRlRWwuaGlkZGVuKSB7XHJcbiAgICAgIGd1aWRlRWwuaGlkZGVuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IHN0YXR1c2VzID0gW107XHJcblxyXG4gIGlmIChjYWxlbmRhcldhc0hpZGRlbikge1xyXG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIH0gXHJcbiAgZWxzZSBpZiAoX2RhdGVUb0Rpc3BsYXkuZ2V0VGltZSgpID09PSBtaW5EYXRlLmdldFRpbWUoKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaCh0ZXh0LmZpcnN0X3Bvc3NpYmxlX2RhdGUpO1xyXG4gIH1cclxuICBlbHNlIGlmIChtYXhEYXRlICE9PSB1bmRlZmluZWQgJiYgbWF4RGF0ZSAhPT0gXCJcIiAmJiBfZGF0ZVRvRGlzcGxheS5nZXRUaW1lKCkgPT09IG1heERhdGUuZ2V0VGltZSgpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQubGFzdF9wb3NzaWJsZV9kYXRlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQuY3VycmVudF9tb250aF9kaXNwbGF5ZWQucmVwbGFjZSgve21vbnRoTGFiZWx9LywgbW9udGhMYWJlbCkucmVwbGFjZSgve2ZvY3VzZWRZZWFyfS8sIGZvY3VzZWRZZWFyKSk7XHJcbiAgfVxyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0TW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhpZGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgZGF0ZSB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcclxuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCwgZGlhbG9nRWwsIGd1aWRlRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgY2FsZW5kYXJEYXRlRWxcclxuICApO1xyXG4gIHNldENhbGVuZGFyVmFsdWUoY2FsZW5kYXJEYXRlRWwsIGNhbGVuZGFyRGF0ZUVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGRpYWxvZ0VsLmhpZGRlbiA9IHRydWU7XHJcbiAgZ3VpZGVFbC5oaWRkZW4gPSB0cnVlO1xyXG5cclxuICBleHRlcm5hbElucHV0RWwuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB0b2dnbGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHtcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBndWlkZUVsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxyXG4gICAgICBpbnB1dERhdGUgfHwgZGVmYXVsdERhdGUgfHwgdG9kYXkoKSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcclxuICAgIGRpYWxvZ0VsLmhpZGRlbiA9IHRydWU7XHJcbiAgICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgY2FsZW5kYXIgd2hlbiB2aXNpYmxlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcclxuICovXHJcbmNvbnN0IHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBjYWxlbmRhclNob3duID0gIWNhbGVuZGFyRWwuaGlkZGVuO1xyXG5cclxuICBpZiAoY2FsZW5kYXJTaG93biAmJiBpbnB1dERhdGUpIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuLyoqXHJcbiAqIERpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TW9udGhTZWxlY3Rpb24gPSAoZWwsIG1vbnRoVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IGNhbGVuZGFyRGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IG1vbnRoVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZE1vbnRoIDogbW9udGhUb0Rpc3BsYXk7XHJcblxyXG4gIGNvbnN0IG1vbnRocyA9IE1PTlRIX0xBQkVMUy5tYXAoKG1vbnRoLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgbW9udGhUb0NoZWNrID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBpbmRleCk7XHJcblxyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heChcclxuICAgICAgbW9udGhUb0NoZWNrLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX01PTlRIX0NMQVNTXTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRNb250aDtcclxuXHJcbiAgICBpZiAoaW5kZXggPT09IGZvY3VzZWRNb250aCkge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYDxidXR0b24gXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgICAgZGF0YS12YWx1ZT1cIiR7aW5kZXh9XCJcclxuICAgICAgICBkYXRhLWxhYmVsPVwiJHttb250aH1cIlxyXG4gICAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHttb250aH08L2J1dHRvbj5gO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBtb250aHNIdG1sID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHRib2R5PlxyXG4gICAgICAgICR7bGlzdFRvR3JpZEh0bWwobW9udGhzLCAzKX1cclxuICAgICAgPC90Ym9keT5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+YDtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IG1vbnRoc0h0bWw7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gdGV4dC5tb250aHNfZGlzcGxheWVkO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgbW9udGggaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBtb250aEVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyVG9EaXNwbGF5IHllYXIgdG8gZGlzcGxheSBpbiB5ZWFyIHNlbGVjdGlvblxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVllYXJTZWxlY3Rpb24gPSAoZWwsIHllYXJUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBjYWxlbmRhckRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XHJcblxyXG4gIGxldCB5ZWFyVG9DaHVuayA9IGZvY3VzZWRZZWFyO1xyXG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcclxuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcclxuXHJcbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeWVhcnMgPSBbXTtcclxuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XHJcbiAgd2hpbGUgKHllYXJzLmxlbmd0aCA8IFlFQVJfQ0hVTkspIHtcclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfWUVBUl9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XHJcblxyXG4gICAgaWYgKHllYXJJbmRleCA9PT0gZm9jdXNlZFllYXIpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHllYXJzLnB1c2goXHJcbiAgICAgIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxyXG4gICAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHt5ZWFySW5kZXh9PC9idXR0b24+YFxyXG4gICAgKTtcclxuICAgIHllYXJJbmRleCArPSAxO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgeWVhcnNIdG1sID0gbGlzdFRvR3JpZEh0bWwoeWVhcnMsIDMpO1xyXG4gIGNvbnN0IGFyaWFMYWJlbFByZXZpb3VzWWVhcnMgPSB0ZXh0LnByZXZpb3VzX3llYXJzLnJlcGxhY2UoL3t5ZWFyc30vLCBZRUFSX0NIVU5LKTtcclxuICBjb25zdCBhcmlhTGFiZWxOZXh0WWVhcnMgPSB0ZXh0Lm5leHRfeWVhcnMucmVwbGFjZSgve3llYXJzfS8sIFlFQVJfQ0hVTkspO1xyXG4gIGNvbnN0IGFubm91bmNlWWVhcnMgPSB0ZXh0LnllYXJzX2Rpc3BsYXllZC5yZXBsYWNlKC97c3RhcnR9LywgeWVhclRvQ2h1bmspLnJlcGxhY2UoL3tlbmR9LywgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LIC0gMSk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbFByZXZpb3VzWWVhcnN9XCJcclxuICAgICAgICAgICAgICAgICR7cHJldlllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICR7eWVhcnNIdG1sfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsTmV4dFllYXJzfVwiXHJcbiAgICAgICAgICAgICAgICAke25leHRZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IGFubm91bmNlWWVhcnM7XHJcblxyXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBlbFxyXG4gICk7XHJcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLnRleHRDb250ZW50LCAxMCk7XHJcblxyXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgLSBZRUFSX0NIVU5LO1xyXG4gIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcclxuICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXJDaHVuayA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBlbFxyXG4gICk7XHJcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLnRleHRDb250ZW50LCAxMCk7XHJcblxyXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgKyBZRUFSX0NIVU5LO1xyXG4gIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcclxuICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSB5ZWFyIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHllYXJFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0WWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgeWVhckVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuaW5uZXJIVE1MLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRZZWFyKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gWWVhciBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIgPSAoZXZlbnQpID0+IHtcclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsLCBkaWFsb2dFbCwgZ3VpZGVFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZGlhbG9nRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0RGF0ZUZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBldmVudC50YXJnZXRcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgY2FwcGVkRGF0ZSk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YldlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGREYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogZGlzcGxheSB0aGUgY2FsZW5kYXIgZm9yIHRoZSBtb3VzZW1vdmUgZGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xyXG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xyXG5cclxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBwYXJzZURhdGVTdHJpbmcoaG92ZXJEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdE1vbnRoRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBtb250aFxyXG4gKi9cclxuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIG1vbnRoRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xyXG4gICAgYWRqdXN0ZWRNb250aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDExLCBhZGp1c3RlZE1vbnRoKSk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMTEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBmaXJzdCBtb250aCAoSmFudWFyeSkgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24obW9udGhFbCwgZm9jdXNNb250aCk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHllYXJFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIHllYXJFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xyXG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVZZWFyKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgMiAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHllYXJFbCwgZm9jdXNZZWFyKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcclxuICBjb25zdCBnZXRGb2N1c2FibGVDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XHJcblxyXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XHJcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZmlyc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xyXG5cclxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNOb3RGb3VuZCA9IGZvY3VzSW5kZXggPT09IC0xO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICBpc05vdEZvdW5kLFxyXG4gICAgICBmaXJzdFRhYlN0b3AsXHJcbiAgICAgIGlzRmlyc3RUYWIsXHJcbiAgICAgIGxhc3RUYWJTdG9wLFxyXG4gICAgICBpc0xhc3RUYWIsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0YWJBaGVhZChldmVudCkge1xyXG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzTGFzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRhYkJhY2soZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBsYXN0VGFiU3RvcCwgaXNGaXJzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKERBVEVfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcclxuXHJcbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XHJcbiAgW0NMSUNLXToge1xyXG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XHJcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcclxuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXl1cDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlkb3duID0gdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlO1xyXG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleWRvd246IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcclxuICAgICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbURhdGUsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21Nb250aCxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5TWFwID0ga2V5bWFwKHtcclxuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBrZXlNYXAoZXZlbnQpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGZvY3Vzb3V0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xyXG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcclxuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcclxuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcclxuICAgIFtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGF0ZVBpY2tlciA9IGJlaGF2aW9yKGRhdGVQaWNrZXJFdmVudHMsIHtcclxuICBpbml0KHJvb3QpIHtcclxuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XHJcbiAgICAgIGlmKCFkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKSl7XHJcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBzZXRMYW5ndWFnZShzdHJpbmdzKSB7XHJcbiAgICB0ZXh0ID0gc3RyaW5ncztcclxuICAgIE1PTlRIX0xBQkVMUyA9IFtcclxuICAgICAgdGV4dC5qYW51YXJ5LFxyXG4gICAgICB0ZXh0LmZlYnJ1YXJ5LFxyXG4gICAgICB0ZXh0Lm1hcmNoLFxyXG4gICAgICB0ZXh0LmFwcmlsLFxyXG4gICAgICB0ZXh0Lm1heSxcclxuICAgICAgdGV4dC5qdW5lLFxyXG4gICAgICB0ZXh0Lmp1bHksXHJcbiAgICAgIHRleHQuYXVndXN0LFxyXG4gICAgICB0ZXh0LnNlcHRlbWJlcixcclxuICAgICAgdGV4dC5vY3RvYmVyLFxyXG4gICAgICB0ZXh0Lm5vdmVtYmVyLFxyXG4gICAgICB0ZXh0LmRlY2VtYmVyXHJcbiAgICBdO1xyXG4gICAgREFZX09GX1dFRUtfTEFCRUxTID0gW1xyXG4gICAgICB0ZXh0Lm1vbmRheSxcclxuICAgICAgdGV4dC50dWVzZGF5LFxyXG4gICAgICB0ZXh0LndlZG5lc2RheSxcclxuICAgICAgdGV4dC50aHVyc2RheSxcclxuICAgICAgdGV4dC5mcmlkYXksXHJcbiAgICAgIHRleHQuc2F0dXJkYXksXHJcbiAgICAgIHRleHQuc3VuZGF5XHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXHJcbiAgZGlzYWJsZSxcclxuICBlbmFibGUsXHJcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxyXG4gIHNldENhbGVuZGFyVmFsdWUsXHJcbiAgdmFsaWRhdGVEYXRlSW5wdXQsXHJcbiAgcmVuZGVyQ2FsZW5kYXIsXHJcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUsXHJcbn0pO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRlUGlja2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHNvcnRpbmcgdmFyaWFudCBvZiBPdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLm92ZXJmbG93LW1lbnUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd25Tb3J0IChjb250YWluZXIpe1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB0aGlzLmJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG5cclxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXHJcbiAgICBpZighdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1jdXJyZW50PVwidHJ1ZVwiXScpKXtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaScpWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGNsaWNrIGV2ZW50cyBvbiBvdmVyZmxvdyBtZW51IGFuZCBvcHRpb25zIGluIG1lbnVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bih0aGlzLmJ1dHRvbikuaW5pdCgpO1xyXG5cclxuICAgIGxldCBzb3J0aW5nT3B0aW9ucyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvbicpO1xyXG4gICAgZm9yKGxldCBzID0gMDsgcyA8IHNvcnRpbmdPcHRpb25zLmxlbmd0aDsgcysrKXtcclxuICAgICAgICBsZXQgb3B0aW9uID0gc29ydGluZ09wdGlvbnNbc107XHJcbiAgICAgICAgb3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbk9wdGlvbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGJ1dHRvbiB0ZXh0IHRvIHNlbGVjdGVkIHZhbHVlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkVmFsdWUgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpW2FyaWEtY3VycmVudD1cInRydWVcIl0nKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQtdmFsdWUnKVswXS5pbm5lclRleHQgPSBzZWxlY3RlZEl0ZW0uaW5uZXJUZXh0O1xyXG59XHJcblxyXG4vKipcclxuICogVHJpZ2dlcnMgd2hlbiBjaG9vc2luZyBvcHRpb24gaW4gbWVudVxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5vbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZSl7XHJcbiAgICBsZXQgbGkgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgbGkucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdsaVthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcclxuICAgIGxpLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuICAgIGxldCBldmVudFNlbGVjdGVkID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uc2VsZWN0ZWQnKTtcclxuICAgIGV2ZW50U2VsZWN0ZWQuZGV0YWlsID0gdGhpcy50YXJnZXQ7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNlbGVjdGVkKTtcclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG5cclxuICAgIC8vIGhpZGUgbWVudVxyXG4gICAgbGV0IG92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bihidXR0b24pO1xyXG4gICAgb3ZlcmZsb3dNZW51LmhpZGUoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25Tb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJyZWFrcG9pbnRzID0gcmVxdWlyZSgnLi4vdXRpbHMvYnJlYWtwb2ludHMnKTtcclxuY29uc3QgQlVUVE9OID0gJy5idXR0b24tb3ZlcmZsb3ctbWVudSc7XHJcbmNvbnN0IGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyID0gJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJzsgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxyXG5jb25zdCBUQVJHRVQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvbkVsZW1lbnQgT3ZlcmZsb3cgbWVudSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duIChidXR0b25FbGVtZW50KSB7XHJcbiAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbWVudDtcclxuICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxuICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gbnVsbCB8fHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnV0dG9uIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudC5gKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLmJ1dHRvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgaWYodGFyZ2V0QXR0ciA9PT0gbnVsbCB8fCB0YXJnZXRBdHRyID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgY291bGQgbm90IGJlIGZvdW5kIG9uIG92ZXJmbG93IG1lbnUgY29tcG9uZW50OiAnK1RBUkdFVCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XHJcbiAgfVxyXG4gIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBjbGljayBldmVudHNcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ICE9PSBudWxsICYmIHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcclxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxyXG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcclxuICAgICAgICAgIGlmIChlbnRyaWVzWyAwIF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcclxuICAgICAgICAgICAgaWYgKCRtb2R1bGUudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgLy8gc21hbGwgc2NyZWVuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNsb3NlT25Fc2NhcGUpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG5sZXQgY2xvc2VPbkVzY2FwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgY2xvc2VBbGwoZXZlbnQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gQXJyYXkgb2YgYnV0dG9uIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogYWNjb3JkaW9uIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBwYXJlbnQgYWNjb3JkaW9uIGVsZW1lbnRcclxuICogQHJldHVybnMge05vZGVMaXN0T2Y8U1ZHRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEVsZW1lbnQ+fVxyXG4gKi9cclxubGV0IGdldEJ1dHRvbnMgPSBmdW5jdGlvbiAocGFyZW50KSB7XHJcbiAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIG92ZXJmbG93IG1lbnVzXHJcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IGRlZmF1bHQgaXMgbnVsbFxyXG4gKi9cclxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XHJcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xyXG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xyXG4gICAgbGV0IHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwpe1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSl7XHJcbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKGNoYW5nZWQgJiYgZXZlbnQgIT09IG51bGwpe1xyXG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG59O1xyXG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoZXZlbnQsIGZvcmNlQ2xvc2UgPSBmYWxzZSkge1xyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIHRvZ2dsZSh0aGlzLCBmb3JjZUNsb3NlKTtcclxuXHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlID0gZnVuY3Rpb24oYnV0dG9uLCBmb3JjZUNsb3NlID0gZmFsc2Upe1xyXG4gIGxldCB0cmlnZ2VyRWwgPSBidXR0b247XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuXHJcbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcclxuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcclxuXHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICBcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBcclxuICAgICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcclxuICAgICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vb3BlblxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLm9wZW4nKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZih0YXJnZXRPZmZzZXQubGVmdCA8IDApe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgcmlnaHQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBvZmZzZXRBZ2FpbiA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZihvZmZzZXRBZ2Fpbi5sZWZ0IDwgMCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcbmxldCBoYXNQYXJlbnQgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudFRhZ05hbWUpe1xyXG4gIGlmKGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gcGFyZW50VGFnTmFtZSl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2UgaWYocGFyZW50VGFnTmFtZSAhPT0gJ0JPRFknICYmIGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKXtcclxuICAgIHJldHVybiBoYXNQYXJlbnQoY2hpbGQucGFyZW50Tm9kZSwgcGFyZW50VGFnTmFtZSk7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IG91dHNpZGVDbG9zZSA9IGZ1bmN0aW9uIChldnQpe1xyXG4gIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24tbWVudS1jbG9zZScpKSB7XHJcbiAgICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPXRydWVdJyk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB0cmlnZ2VyRWwgPSBvcGVuRHJvcGRvd25zW2ldO1xyXG4gICAgICAgIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgICAgaWYgKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBpZih0YXJnZXRBdHRyLmluZGV4T2YoJyMnKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICB0YXJnZXRBdHRyID0gdGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkgfHwgKGhhc1BhcmVudCh0cmlnZ2VyRWwsICdIRUFERVInKSAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJsYXknKSkpIHtcclxuICAgICAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlXHJcbiAgICAgICAgICBpZiAoZXZ0LnRhcmdldCAhPT0gdHJpZ2dlckVsKSB7XHJcbiAgICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBpZighdHJpZ2dlckVsLmNsYXNzTGlzdC5jb250YWlucyhqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllcikpe1xyXG4gICAgLy8gbm90IG5hdiBvdmVyZmxvdyBtZW51XHJcbiAgICBpZih0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSkge1xyXG4gICAgICAvLyB0cmluaW5kaWthdG9yIG92ZXJmbG93IG1lbnVcclxuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQodHJpZ2dlckVsKSkge1xyXG4gICAgICAgIC8vIG92ZXJmbG93IG1lbnUgcMOlIHJlc3BvbnNpdiB0cmluZ3VpZGUgYWt0aXZlcmV0XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZXtcclxuICAgICAgLy8gbm9ybWFsIG92ZXJmbG93IG1lbnVcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5sZXQgZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCA9IGZ1bmN0aW9uIChidXR0b24pe1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5tZDtcclxuICB9XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLmxnO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duOyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIEhhbmRsZSBmb2N1cyBvbiBpbnB1dCBlbGVtZW50cyB1cG9uIGNsaWNraW5nIGxpbmsgaW4gZXJyb3IgbWVzc2FnZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVycm9yIHN1bW1hcnkgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRXJyb3JTdW1tYXJ5IChlbGVtZW50KSB7XHJcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHMgb24gbGlua3MgaW4gZXJyb3Igc3VtbWFyeVxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdGhpcy5lbGVtZW50LmZvY3VzKClcclxuXHJcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKVxyXG59XHJcblxyXG4vKipcclxuKiBDbGljayBldmVudCBoYW5kbGVyXHJcbipcclxuKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gQ2xpY2sgZXZlbnRcclxuKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXRcclxuICBpZiAodGhpcy5mb2N1c1RhcmdldCh0YXJnZXQpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRm9jdXMgdGhlIHRhcmdldCBlbGVtZW50XHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIHRoZSBicm93c2VyIHdpbGwgc2Nyb2xsIHRoZSB0YXJnZXQgaW50byB2aWV3LiBCZWNhdXNlIG91ciBsYWJlbHNcclxuICogb3IgbGVnZW5kcyBhcHBlYXIgYWJvdmUgdGhlIGlucHV0LCB0aGlzIG1lYW5zIHRoZSB1c2VyIHdpbGwgYmUgcHJlc2VudGVkIHdpdGhcclxuICogYW4gaW5wdXQgd2l0aG91dCBhbnkgY29udGV4dCwgYXMgdGhlIGxhYmVsIG9yIGxlZ2VuZCB3aWxsIGJlIG9mZiB0aGUgdG9wIG9mXHJcbiAqIHRoZSBzY3JlZW4uXHJcbiAqXHJcbiAqIE1hbnVhbGx5IGhhbmRsaW5nIHRoZSBjbGljayBldmVudCwgc2Nyb2xsaW5nIHRoZSBxdWVzdGlvbiBpbnRvIHZpZXcgYW5kIHRoZW5cclxuICogZm9jdXNzaW5nIHRoZSBlbGVtZW50IHNvbHZlcyB0aGlzLlxyXG4gKlxyXG4gKiBUaGlzIGFsc28gcmVzdWx0cyBpbiB0aGUgbGFiZWwgYW5kL29yIGxlZ2VuZCBiZWluZyBhbm5vdW5jZWQgY29ycmVjdGx5IGluXHJcbiAqIE5WREEgKGFzIHRlc3RlZCBpbiAyMDE4LjMuMikgLSB3aXRob3V0IHRoaXMgb25seSB0aGUgZmllbGQgdHlwZSBpcyBhbm5vdW5jZWRcclxuICogKGUuZy4gXCJFZGl0LCBoYXMgYXV0b2NvbXBsZXRlXCIpLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkdGFyZ2V0IC0gRXZlbnQgdGFyZ2V0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB0YXJnZXQgd2FzIGFibGUgdG8gYmUgZm9jdXNzZWRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZm9jdXNUYXJnZXQgPSBmdW5jdGlvbiAoJHRhcmdldCkge1xyXG4gIC8vIElmIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWQgd2FzIG5vdCBhIGxpbmssIHJldHVybiBlYXJseVxyXG4gIGlmICgkdGFyZ2V0LnRhZ05hbWUgIT09ICdBJyB8fCAkdGFyZ2V0LmhyZWYgPT09IGZhbHNlKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciBpbnB1dElkID0gdGhpcy5nZXRGcmFnbWVudEZyb21VcmwoJHRhcmdldC5ocmVmKVxyXG4gIHZhciAkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKVxyXG4gIGlmICghJGlucHV0KSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciAkbGVnZW5kT3JMYWJlbCA9IHRoaXMuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwoJGlucHV0KVxyXG4gIGlmICghJGxlZ2VuZE9yTGFiZWwpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gU2Nyb2xsIHRoZSBsZWdlbmQgb3IgbGFiZWwgaW50byB2aWV3ICpiZWZvcmUqIGNhbGxpbmcgZm9jdXMgb24gdGhlIGlucHV0IHRvXHJcbiAgLy8gYXZvaWQgZXh0cmEgc2Nyb2xsaW5nIGluIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBgcHJldmVudFNjcm9sbGAgKHdoaWNoXHJcbiAgLy8gYXQgdGltZSBvZiB3cml0aW5nIGlzIG1vc3Qgb2YgdGhlbS4uLilcclxuICAkbGVnZW5kT3JMYWJlbC5zY3JvbGxJbnRvVmlldygpXHJcbiAgJGlucHV0LmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZyYWdtZW50IGZyb20gVVJMXHJcbiAqXHJcbiAqIEV4dHJhY3QgdGhlIGZyYWdtZW50IChldmVyeXRoaW5nIGFmdGVyIHRoZSBoYXNoKSBmcm9tIGEgVVJMLCBidXQgbm90IGluY2x1ZGluZ1xyXG4gKiB0aGUgaGFzaC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGcmFnbWVudCBmcm9tIFVSTCwgd2l0aG91dCB0aGUgaGFzaFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRGcmFnbWVudEZyb21VcmwgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgaWYgKHVybC5pbmRleE9mKCcjJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmwuc3BsaXQoJyMnKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBleGlzdHMgZnJvbSB0aGlzIGxpc3Q6XHJcbiAqXHJcbiAqIC0gVGhlIGA8bGVnZW5kPmAgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbG9zZXN0IGA8ZmllbGRzZXQ+YCBhbmNlc3RvciwgYXMgbG9uZ1xyXG4gKiAgIGFzIHRoZSB0b3Agb2YgaXQgaXMgbm8gbW9yZSB0aGFuIGhhbGYgYSB2aWV3cG9ydCBoZWlnaHQgYXdheSBmcm9tIHRoZVxyXG4gKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcclxuICogLSBUaGUgZmlyc3QgYDxsYWJlbD5gIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCB1c2luZyBmb3I9XCJpbnB1dElkXCJcclxuICogLSBUaGUgY2xvc2VzdCBwYXJlbnQgYDxsYWJlbD5gXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRpbnB1dCAtIFRoZSBpbnB1dFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsLCBvciBudWxsIGlmIG5vIGFzc29jaWF0ZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQgb3IgbGFiZWwgY2FuIGJlIGZvdW5kXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsID0gZnVuY3Rpb24gKCRpbnB1dCkge1xyXG4gIHZhciAkZmllbGRzZXQgPSAkaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKVxyXG5cclxuICBpZiAoJGZpZWxkc2V0KSB7XHJcbiAgICB2YXIgbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcclxuXHJcbiAgICBpZiAobGVnZW5kcy5sZW5ndGgpIHtcclxuICAgICAgdmFyICRjYW5kaWRhdGVMZWdlbmQgPSBsZWdlbmRzWzBdXHJcblxyXG4gICAgICAvLyBJZiB0aGUgaW5wdXQgdHlwZSBpcyByYWRpbyBvciBjaGVja2JveCwgYWx3YXlzIHVzZSB0aGUgbGVnZW5kIGlmIHRoZXJlXHJcbiAgICAgIC8vIGlzIG9uZS5cclxuICAgICAgaWYgKCRpbnB1dC50eXBlID09PSAnY2hlY2tib3gnIHx8ICRpbnB1dC50eXBlID09PSAncmFkaW8nKSB7XHJcbiAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9yIG90aGVyIGlucHV0IHR5cGVzLCBvbmx5IHNjcm9sbCB0byB0aGUgZmllbGRzZXTigJlzIGxlZ2VuZCAoaW5zdGVhZCBvZlxyXG4gICAgICAvLyB0aGUgbGFiZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCkgaWYgdGhlIGlucHV0IHdvdWxkIGVuZCB1cCBpbiB0aGVcclxuICAgICAgLy8gdG9wIGhhbGYgb2YgdGhlIHNjcmVlbi5cclxuICAgICAgLy9cclxuICAgICAgLy8gVGhpcyBzaG91bGQgYXZvaWQgc2l0dWF0aW9ucyB3aGVyZSB0aGUgaW5wdXQgZWl0aGVyIGVuZHMgdXAgb2ZmIHRoZVxyXG4gICAgICAvLyBzY3JlZW4sIG9yIG9ic2N1cmVkIGJ5IGEgc29mdHdhcmUga2V5Ym9hcmQuXHJcbiAgICAgIHZhciBsZWdlbmRUb3AgPSAkY2FuZGlkYXRlTGVnZW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICB2YXIgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuICAgICAgLy8gb3Igd2luZG93LmlubmVySGVpZ2h0IChsaWtlIElFOCksIGJhaWwgYW5kIGp1c3QgbGluayB0byB0aGUgbGFiZWwuXHJcbiAgICAgIGlmIChpbnB1dFJlY3QuaGVpZ2h0ICYmIHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgIHZhciBpbnB1dEJvdHRvbSA9IGlucHV0UmVjdC50b3AgKyBpbnB1dFJlY3QuaGVpZ2h0XHJcblxyXG4gICAgICAgIGlmIChpbnB1dEJvdHRvbSAtIGxlZ2VuZFRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcclxuICAgICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxhYmVsW2Zvcj0nXCIgKyAkaW5wdXQuZ2V0QXR0cmlidXRlKCdpZCcpICsgXCInXVwiKSB8fFxyXG4gICAgJGlucHV0LmNsb3Nlc3QoJ2xhYmVsJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdW1tYXJ5OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBtb2RhbFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkbW9kYWwgTW9kYWwgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gTW9kYWwgKCRtb2RhbCkge1xyXG4gICAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XHJcbiAgICBsZXQgaWQgPSB0aGlzLiRtb2RhbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICB0aGlzLnRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlPVwibW9kYWxcIl1bZGF0YS10YXJnZXQ9XCInK2lkKydcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHNcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0cmlnZ2VycyA9IHRoaXMudHJpZ2dlcnM7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmlnZ2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHRyaWdnZXJzWyBpIF07XHJcbiAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBsZXQgY2xvc2VycyA9IHRoaXMuJG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsLWNsb3NlXScpO1xyXG4gIGZvciAobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKyl7XHJcbiAgICBsZXQgY2xvc2VyID0gY2xvc2Vyc1sgYyBdO1xyXG4gICAgY2xvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIG1vZGFsXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLm1vZGFsLmhpZGRlbicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuICAgIGxldCBkYXRhTW9kYWxPcGVuZXIgPSBtb2RhbEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xyXG4gICAgaWYoZGF0YU1vZGFsT3BlbmVyICE9PSBudWxsKXtcclxuICAgICAgbGV0IG9wZW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGFNb2RhbE9wZW5lcilcclxuICAgICAgaWYob3BlbmVyICE9PSBudWxsKXtcclxuICAgICAgICBvcGVuZXIuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTaG93IG1vZGFsXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChlID0gbnVsbCl7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xyXG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBpZihlICE9PSBudWxsKXtcclxuICAgICAgbGV0IG9wZW5lcklkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICBpZihvcGVuZXJJZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgb3BlbmVySWQgPSAnbW9kYWwtb3BlbmVyLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk5OTkgLSAxMDAwICsgMSkgKyAxMDAwKTtcclxuICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgb3BlbmVySWQpXHJcbiAgICAgIH1cclxuICAgICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInLCBvcGVuZXJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGlkZSBvcGVuIG1vZGFscyAtIEZEUyBkbyBub3QgcmVjb21tZW5kIG1vcmUgdGhhbiBvbmUgb3BlbiBtb2RhbCBhdCBhIHRpbWVcclxuICAgIGxldCBhY3RpdmVNb2RhbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFjdGl2ZU1vZGFscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIG5ldyBNb2RhbChhY3RpdmVNb2RhbHNbaV0pLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMubW9kYWwuc2hvd24nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgJGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWJhY2tkcm9wJyk7XHJcbiAgICAkYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdpZCcsIFwibW9kYWwtYmFja2Ryb3BcIik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LmZvY3VzKCk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcbiAgICBpZighaGFzRm9yY2VkQWN0aW9uKG1vZGFsRWxlbWVudCkpe1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBtb2RhbCB3aGVuIGhpdHRpbmcgRVNDXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5sZXQgaGFuZGxlRXNjYXBlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgbGV0IGN1cnJlbnRNb2RhbCA9IG5ldyBNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpKTtcclxuICBpZiAoa2V5ID09PSAyNyl7XHJcbiAgICBsZXQgcG9zc2libGVPdmVyZmxvd01lbnVzID0gbW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tb3ZlcmZsb3ctbWVudVthcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYocG9zc2libGVPdmVyZmxvd01lbnVzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIGN1cnJlbnRNb2RhbC5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9kYWwgd2hlbiBvcGVuXHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAqL1xyXG4gZnVuY3Rpb24gdHJhcEZvY3VzKGUpe1xyXG4gIHZhciBjdXJyZW50RGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBpZihjdXJyZW50RGlhbG9nICE9PSBudWxsKXtcclxuICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IGN1cnJlbnREaWFsb2cucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgZGV0YWlsczpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSknKTtcclxuICAgIFxyXG4gICAgdmFyIGZpcnN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xyXG4gICAgdmFyIGxhc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgdmFyIGlzVGFiUHJlc3NlZCA9IChlLmtleSA9PT0gJ1RhYicgfHwgZS5rZXlDb2RlID09PSA5KTtcclxuXHJcbiAgICBpZiAoIWlzVGFiUHJlc3NlZCkgeyBcclxuICAgICAgcmV0dXJuOyBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIGUuc2hpZnRLZXkgKSAvKiBzaGlmdCArIHRhYiAqLyB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgLyogdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RGb2N1c2FibGVFbGVtZW50KSB7XHJcbiAgICAgICAgZmlyc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBoYXNGb3JjZWRBY3Rpb24gKG1vZGFsKXtcclxuICBpZihtb2RhbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtZm9yY2VkLWFjdGlvbicpID09PSBudWxsKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1vZGFsO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG4vKipcclxuICogQWRkIG1vYmlsZSBtZW51IGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmNsYXNzIE5hdmlnYXRpb24ge1xyXG4gIC8qKlxyXG4gICAqIFNldCBldmVudHNcclxuICAgKi9cclxuICBpbml0ICgpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBtb2JpbGVNZW51LCBmYWxzZSk7XHJcbiAgICBtb2JpbGVNZW51KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgZXZlbnRzXHJcbiAgICovXHJcbiAgdGVhcmRvd24gKCkge1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBtb2JpbGUgbWVudVxyXG4gKi9cclxuY29uc3QgbW9iaWxlTWVudSA9IGZ1bmN0aW9uKCkge1xyXG4gIGxldCBtb2JpbGUgPSBmYWxzZTtcclxuICBsZXQgb3BlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoT1BFTkVSUyk7XHJcbiAgZm9yKGxldCBvID0gMDsgbyA8IG9wZW5lcnMubGVuZ3RoOyBvKyspIHtcclxuICAgIGlmKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG9wZW5lcnNbb10sIG51bGwpLmRpc3BsYXkgIT09ICdub25lJykge1xyXG4gICAgICBvcGVuZXJzW29dLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgICAgbW9iaWxlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIG1vYmlsZVxyXG4gIGlmKG1vYmlsZSl7XHJcbiAgICBsZXQgY2xvc2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ0xPU0VSUyk7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKykge1xyXG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcclxuICAgIGZvcihsZXQgbiA9IDA7IG4gPCBuYXZMaW5rcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICBuYXZMaW5rc1sgbiBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXHJcbiAgICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cclxuXHJcbiAgICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgZHJvcGRvd25zOyB3aGVuIHRoZXkncmVcclxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGRyb3Bkb3ducy5cclxuXHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxyXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0cmFwQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGZvY3VzVHJhcCA9IF9mb2N1c1RyYXAodHJhcENvbnRhaW5lcnNbaV0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG5cclxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiBpcyBhY3RpdmUsIGJ1dCB0aGUgY2xvc2UgYm94IGlzbid0IHZpc2libGUsIHdoaWNoXHJcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcclxuICAgIC8vIGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cclxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBtb2JpbGUgbWVudSBpcyBhY3RpdmVcclxuICogQHJldHVybnMgdHJ1ZSBpZiBtb2JpbGUgbWVudSBpcyBhY3RpdmUgYW5kIGZhbHNlIGlmIG5vdCBhY3RpdmVcclxuICovXHJcbmNvbnN0IGlzQWN0aXZlID0gKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoQUNUSVZFX0NMQVNTKTtcclxuXHJcbi8qKlxyXG4gKiBUcmFwIGZvY3VzIGluIG1vYmlsZSBtZW51IGlmIGFjdGl2ZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0cmFwQ29udGFpbmVyIFxyXG4gKi9cclxuY29uc3QgX2ZvY3VzVHJhcCA9ICh0cmFwQ29udGFpbmVyKSA9PiB7XHJcblxyXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxyXG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcclxuICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGxldCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXHJcbiAgICBpZiAoa2V5ID09PSA5KSB7XHJcblxyXG4gICAgICBsZXQgbGFzdFRhYlN0b3AgPSBudWxsO1xyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGxldCBudW1iZXIgPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbIG51bWJlciAtIGkgXTtcclxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgJiYgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNISUZUICsgVEFCXHJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAvLyBUQUJcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVTQ0FQRVxyXG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAvLyBMaXN0ZW4gZm9yIGFuZCB0cmFwIHRoZSBrZXlib2FyZFxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgZm9jdXNUcmFwO1xyXG5cclxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xyXG4gIH1cclxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xyXG5cclxuICBmb3JFYWNoKHNlbGVjdChUT0dHTEVTKSwgZWwgPT4ge1xyXG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xyXG4gIH0pO1xyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZpZ2F0aW9uOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVE9HR0xFX0FUVFJJQlVURSA9ICdkYXRhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gcmFkaW9idXR0b24gY29sbGFwc2UgbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gUmFkaW9Ub2dnbGVHcm91cChjb250YWluZXJFbGVtZW50KXtcclxuICAgIHRoaXMucmFkaW9Hcm91cCA9IGNvbnRhaW5lckVsZW1lbnQ7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcclxuICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50c1xyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpe1xyXG4gICAgdGhpcy5yYWRpb0VscyA9IHRoaXMucmFkaW9Hcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcclxuICAgIGlmKHRoaXMucmFkaW9FbHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJhZGlvYnV0dG9ucyBmb3VuZCBpbiByYWRpb2J1dHRvbiBncm91cC4nKTtcclxuICAgIH1cclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIHJhZGlvID0gdGhpcy5yYWRpb0Vsc1sgaSBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGEgPSAwOyBhIDwgdGhhdC5yYWRpb0Vscy5sZW5ndGg7IGErKyApe1xyXG4gICAgICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5yYWRpb0Vsc1sgYSBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKHJhZGlvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSByYWRpb2J1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFkaW9JbnB1dEVsZW1lbnQgXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQpe1xyXG4gICAgdmFyIGNvbnRlbnRJZCA9IHJhZGlvSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfQVRUUklCVVRFKTtcclxuICAgIGlmKGNvbnRlbnRJZCAhPT0gbnVsbCAmJiBjb250ZW50SWQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50SWQgIT09IFwiXCIpe1xyXG4gICAgICAgIHZhciBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGVudElkKTtcclxuICAgICAgICBpZihjb250ZW50RWxlbWVudCA9PT0gbnVsbCB8fCBjb250ZW50RWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihyYWRpb0lucHV0RWxlbWVudC5jaGVja2VkKXtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4cGFuZCByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihyYWRpb0lucHV0RWxlbWVudCAhPT0gbnVsbCAmJiByYWRpb0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5yYWRpby5leHBhbmRlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQ29sbGFwc2UgcmFkaW8gYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHt9IHJhZGlvSW5wdXRFbGVtZW50IFJhZGlvIElucHV0IGVsZW1lbnRcclxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmNvbGxhcHNlID0gZnVuY3Rpb24ocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5yYWRpby5jb2xsYXBzZWQnKTtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSYWRpb1RvZ2dsZUdyb3VwOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgbW9kaWZpZXJTdGF0ZSA9IHtcclxuICBzaGlmdDogZmFsc2UsXHJcbiAgYWx0OiBmYWxzZSxcclxuICBjdHJsOiBmYWxzZSxcclxuICBjb21tYW5kOiBmYWxzZVxyXG59O1xyXG4vKlxyXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXHJcbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LlxyXG4qIFVzZWNhc2U6IG51bWJlciBpbnB1dCBmb3IgZGF0ZS1jb21wb25lbnQuXHJcbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XHJcbiovXHJcbmNsYXNzIElucHV0UmVnZXhNYXNrIHtcclxuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgcmVnZXhNYXNrKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJlZ2V4TWFzayk7XHJcbiAgfVxyXG59XHJcbnZhciByZWdleE1hc2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW5wdXRSZWdleE1hc2s7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlIFRhYmxlIEVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIFRhYmxlU2VsZWN0YWJsZVJvd3MgKHRhYmxlKSB7XHJcbiAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG59XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZSBldmVudGxpc3RlbmVycyBmb3IgY2hlY2tib3hlcyBpbiB0YWJsZVxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5ncm91cENoZWNrYm94ID0gdGhpcy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgdGhpcy50Ym9keUNoZWNrYm94TGlzdCA9IHRoaXMuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcbiAgaWYodGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGggIT09IDApe1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBsZXQgY2hlY2tib3ggPSB0aGlzLnRib2R5Q2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBjaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRoaXMuZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgICB0aGlzLmdyb3VwQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICB9XHJcbn1cclxuICBcclxuLyoqXHJcbiAqIEdldCBncm91cCBjaGVja2JveCBpbiB0YWJsZSBoZWFkZXJcclxuICogQHJldHVybnMgZWxlbWVudCBvbiB0cnVlIC0gZmFsc2UgaWYgbm90IGZvdW5kXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRHcm91cENoZWNrYm94ID0gZnVuY3Rpb24oKXtcclxuICBsZXQgY2hlY2tib3ggPSB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxuICBpZihjaGVja2JveC5sZW5ndGggPT09IDApe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gY2hlY2tib3hbMF07XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0YWJsZSBib2R5IGNoZWNrYm94ZXNcclxuICogQHJldHVybnMgSFRNTENvbGxlY3Rpb25cclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmdldENoZWNrYm94TGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuIHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGNoZWNrYm94ZXMgaW4gdGFibGUgYm9keSB3aGVuIGdyb3VwIGNoZWNrYm94IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUNoZWNrYm94TGlzdChlKXtcclxuICBsZXQgY2hlY2tib3ggPSBlLnRhcmdldDtcclxuICBjaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gIGxldCB0YWJsZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XHJcbiAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcbiAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gIGlmKGNoZWNrYm94LmNoZWNrZWQpe1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2VkTnVtYmVyID0gY2hlY2tib3hMaXN0Lmxlbmd0aDtcclxuICB9IGVsc2V7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICB9KTtcclxuICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBncm91cCBjaGVja2JveCB3aGVuIGNoZWNrYm94IGluIHRhYmxlIGJvZHkgaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlR3JvdXBDaGVjayhlKXtcclxuICAvLyB1cGRhdGUgbGFiZWwgZm9yIGV2ZW50IGNoZWNrYm94XHJcbiAgaWYoZS50YXJnZXQuY2hlY2tlZCl7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gIH1cclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBncm91cENoZWNrYm94ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgaWYoZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcblxyXG4gICAgLy8gaG93IG1hbnkgcm93IGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGxvb3BlZENoZWNrYm94ID0gY2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBpZihsb29wZWRDaGVja2JveC5jaGVja2VkKXtcclxuICAgICAgICBjaGVja2VkTnVtYmVyKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoY2hlY2tlZE51bWJlciA9PT0gY2hlY2tib3hMaXN0Lmxlbmd0aCl7IC8vIGlmIGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZihjaGVja2VkTnVtYmVyID09IDApeyAvLyBpZiBubyByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICB9IGVsc2V7IC8vIGlmIHNvbWUgYnV0IG5vdCBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnNldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ21peGVkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICAgIH0pO1xyXG4gICAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJsZVNlbGVjdGFibGVSb3dzOyIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRhLXRpdGxlIG9uIGNlbGxzLCB3aGVyZSB0aGUgYXR0cmlidXRlIGlzIG1pc3NpbmdcclxuICovXHJcbmNsYXNzIFJlc3BvbnNpdmVUYWJsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YWJsZSkge1xyXG4gICAgICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlRWwgVGFibGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlRWwpIHtcclxuICAgIGlmICghdGFibGVFbCkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBoZWFkZXIgPSB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xyXG4gICAgaWYgKGhlYWRlci5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGgnKTtcclxuICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsRWxzLmxlbmd0aCA9PT0gaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsRWxzW2ldLmhhc0F0dHJpYnV0ZSgnZGF0YS10aXRsZScpICYmIGhlYWRlckNlbGxFbC50YWdOYW1lID09PSBcIlRIXCIgJiYgIWhlYWRlckNlbGxFbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3Rpb25zLWhlYWRlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZVRhYmxlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuXHJcbi8vIEZvciBlYXN5IHJlZmVyZW5jZVxyXG52YXIga2V5cyA9IHtcclxuICBlbmQ6IDM1LFxyXG4gIGhvbWU6IDM2LFxyXG4gIGxlZnQ6IDM3LFxyXG4gIHVwOiAzOCxcclxuICByaWdodDogMzksXHJcbiAgZG93bjogNDAsXHJcbiAgZGVsZXRlOiA0NlxyXG59O1xyXG5cclxuLy8gQWRkIG9yIHN1YnN0cmFjdCBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxudmFyIGRpcmVjdGlvbiA9IHtcclxuICAzNzogLTEsXHJcbiAgMzg6IC0xLFxyXG4gIDM5OiAxLFxyXG4gIDQwOiAxXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YWJuYXYgVGFibmF2IGNvbnRhaW5lclxyXG4gKi9cclxuZnVuY3Rpb24gVGFibmF2ICh0YWJuYXYpIHtcclxuICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcclxuICB0aGlzLnRhYnMgPSB0aGlzLnRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudCBvbiBjb21wb25lbnRcclxuICovXHJcblRhYm5hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgaWYodGhpcy50YWJzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRhYm5hdiBIVE1MIHNlZW1zIHRvIGJlIG1pc3NpbmcgdGFibmF2LWl0ZW0uIEFkZCB0YWJuYXYgaXRlbXMgdG8gZW5zdXJlIGVhY2ggcGFuZWwgaGFzIGEgYnV0dG9uIGluIHRoZSB0YWJuYXZzIG5hdmlnYXRpb24uYCk7XHJcbiAgfVxyXG5cclxuICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gIGlmICghc2V0QWN0aXZlSGFzaFRhYigpKSB7XHJcbiAgICAvLyBzZXQgZmlyc3QgdGFiIGFzIGFjdGl2ZVxyXG4gICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgIC8vIGNoZWNrIG5vIG90aGVyIHRhYnMgYXMgYmVlbiBzZXQgYXQgZGVmYXVsdFxyXG4gICAgbGV0IGFscmVhZHlBY3RpdmUgPSBnZXRBY3RpdmVUYWJzKHRoaXMudGFibmF2KTtcclxuICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0YWIgPSBhbHJlYWR5QWN0aXZlWyAwIF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgdGhpcy5hY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICB9XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzO1xyXG4gIC8vIGFkZCBldmVudGxpc3RlbmVycyBvbiBidXR0b25zXHJcbiAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpeyRtb2R1bGUuYWN0aXZhdGVUYWIodGhpcywgZmFsc2UpfSk7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkV2ZW50TGlzdGVuZXIpO1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cEV2ZW50TGlzdGVuZXIpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqKlxyXG4gKiBTaG93IHRhYiBhbmQgaGlkZSBvdGhlcnNcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIGJ1dHRvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2V0Rm9jdXMgVHJ1ZSBpZiB0YWIgYnV0dG9uIHNob3VsZCBiZSBmb2N1c2VkXHJcbiAqL1xyXG4gVGFibmF2LnByb3RvdHlwZS5hY3RpdmF0ZVRhYiA9IGZ1bmN0aW9uKHRhYiwgc2V0Rm9jdXMpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuXHJcbiAgLy8gY2xvc2UgYWxsIHRhYnMgZXhjZXB0IHNlbGVjdGVkXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0YWJzWyBpIF0gPT09IHRhYikge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2xvc2UnKTtcclxuICAgICAgdGFic1sgaSBdLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIHRhYnNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgIGxldCB0YWJwYW5lbElEID0gdGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcclxuICAgIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YWJwYW5lbC5gKTtcclxuICAgIH1cclxuICAgIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gIH1cclxuICBcclxuICAvLyBTZXQgc2VsZWN0ZWQgdGFiIHRvIGFjdGl2ZVxyXG4gIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpO1xyXG4gIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uIHBhbmVsLmApO1xyXG4gIH1cclxuXHJcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XHJcbiAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gIHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XHJcblxyXG4gIC8vIFNldCBmb2N1cyB3aGVuIHJlcXVpcmVkXHJcbiAgaWYgKHNldEZvY3VzKSB7XHJcbiAgICB0YWIuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIGxldCBldmVudENoYW5nZWQgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2hhbmdlZCcpO1xyXG4gIHRhYi5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQoZXZlbnRDaGFuZ2VkKTtcclxuXHJcbiAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5vcGVuJyk7XHJcbiAgdGFiLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXlkb3duIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXlkb3duRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2Uga2V5cy5lbmQ6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGxhc3QgdGFiXHJcbiAgICAgIGZvY3VzTGFzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5ob21lOlxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWJcclxuICAgICAgZm9jdXNGaXJzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIC8vIFVwIGFuZCBkb3duIGFyZSBpbiBrZXlkb3duXHJcbiAgICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gcHJldmVudCBwYWdlIHNjcm9sbCA+OilcclxuICAgIGNhc2Uga2V5cy51cDpcclxuICAgIGNhc2Uga2V5cy5kb3duOlxyXG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXl1cCBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxuZnVuY3Rpb24ga2V5dXBFdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmxlZnQ6XHJcbiAgICBjYXNlIGtleXMucmlnaHQ6XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuZGVsZXRlOlxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5lbnRlcjpcclxuICAgIGNhc2Uga2V5cy5zcGFjZTpcclxuICAgICAgbmV3IFRhYm5hdihldmVudC50YXJnZXQucGFyZW50Tm9kZSkuYWN0aXZhdGVUYWIoZXZlbnQudGFyZ2V0LCB0cnVlKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbiAqIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4gKiBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGRldGVybWluZU9yaWVudGF0aW9uIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBsZXQgdz13aW5kb3csXHJcbiAgICBkPWRvY3VtZW50LFxyXG4gICAgZT1kLmRvY3VtZW50RWxlbWVudCxcclxuICAgIGc9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0sXHJcbiAgICB4PXcuaW5uZXJXaWR0aHx8ZS5jbGllbnRXaWR0aHx8Zy5jbGllbnRXaWR0aCxcclxuICAgIHk9dy5pbm5lckhlaWdodHx8ZS5jbGllbnRIZWlnaHR8fGcuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBsZXQgdmVydGljYWwgPSB4IDwgYnJlYWtwb2ludHMubWQ7XHJcbiAgbGV0IHByb2NlZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKHZlcnRpY2FsKSB7XHJcbiAgICBpZiAoa2V5ID09PSBrZXlzLnVwIHx8IGtleSA9PT0ga2V5cy5kb3duKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMubGVmdCB8fCBrZXkgPT09IGtleXMucmlnaHQpIHtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChwcm9jZWVkKSB7XHJcbiAgICBzd2l0Y2hUYWJPbkFycm93UHJlc3MoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVpdGhlciBmb2N1cyB0aGUgbmV4dCwgcHJldmlvdXMsIGZpcnN0LCBvciBsYXN0IHRhYlxyXG4gKiBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxuICovXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgaW5kZXggb2YgZWxlbWVudCBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTENvbGxlY3Rpb259IGxpc3QgXHJcbiAqIEByZXR1cm5zIHtpbmRleH1cclxuICovXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZmlyc3QgdGFiIGJ5IHRhYiBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzRmlyc3RUYWIgKHRhYikge1xyXG4gIGdldEFsbFRhYnNJbkxpc3QodGFiKVsgMCBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgbGFzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJuYXY7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2hvdy9oaWRlIHRvYXN0IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gVG9hc3QgKGVsZW1lbnQpe1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvd2luZycpO1xyXG4gICAgdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RvYXN0LWNsb3NlJylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgIG5ldyBUb2FzdCh0b2FzdCkuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpOyAgICAgICAgIFxyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBjbGFzc2VzIHRvIG1ha2Ugc2hvdyBhbmltYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHNob3dUb2FzdCgpe1xyXG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XHJcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdG9hc3RzLmxlbmd0aDsgdCsrKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0b2FzdHNbdF07XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVG9hc3Q7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2V0IHRvb2x0aXAgb24gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggaGFzIHRvb2x0aXBcclxuICovXHJcbmZ1bmN0aW9uIFRvb2x0aXAoZWxlbWVudCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVG9vbHRpcCB0ZXh0IGlzIG1pc3NpbmcuIEFkZCBhdHRyaWJ1dGUgZGF0YS10b29sdGlwIGFuZCB0aGUgY29udGVudCBvZiB0aGUgdG9vbHRpcCBhcyB2YWx1ZS5gKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudGxpc3RlbmVyc1xyXG4gKi9cclxuVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBtb2R1bGUgPSB0aGlzO1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGxldCB0cmlnZ2VyID0gZS50YXJnZXQ7XHJcbiAgICAgICAgaWYgKHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWhvdmVyJykgPT09IGZhbHNlICYmIHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWZvY3VzJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGNsb3NlQWxsVG9vbHRpcHMoZSk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZChcInRvb2x0aXAtaG92ZXJcIik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWhvdmVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZFRvb2x0aXAoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGxldCB0cmlnZ2VyID0gZS50YXJnZXQ7XHJcbiAgICAgICAgaWYgKHRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWhvdmVyJykpIHtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIHZhciB0b29sdGlwSWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICAgICAgICBpZiAodG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNsb3NlSG92ZXJUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICBpZiAodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXRyaWdnZXInKSA9PT0gJ2NsaWNrJykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGNsb3NlQWxsVG9vbHRpcHMoZSk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1mb2N1cycpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgaWYgKHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgYWRkVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VBbGxUb29sdGlwcyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VBbGxUb29sdGlwcyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIHRvb2x0aXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZUFsbCgpIHtcclxuICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10b29sdGlwW2FyaWEtZGVzY3JpYmVkYnldJyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHBvcHBlciA9IGVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIGVsZW1lbnRzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wcGVyKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHBvcyA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuXHJcbiAgICB2YXIgdG9vbHRpcCA9IGNyZWF0ZVRvb2x0aXAodHJpZ2dlciwgcG9zKTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgIHBvc2l0aW9uQXQodHJpZ2dlciwgdG9vbHRpcCwgcG9zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSB0b29sdGlwIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIHRoZSB0b29sdGlwIGlzIGF0dGFjaGVkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3MgUG9zaXRpb24gb2YgdG9vbHRpcCAodG9wIHwgYm90dG9tKVxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAoZWxlbWVudCwgcG9zKSB7XHJcbiAgICB2YXIgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xyXG4gICAgdmFyIHBvcHBlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLXBvcHBlcicpO1xyXG4gICAgdmFyIGlkID0gJ3Rvb2x0aXAtJyArIHBvcHBlcnMubGVuZ3RoICsgMTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBvcyk7XHJcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGlkKTtcclxuXHJcbiAgICB2YXIgdG9vbHRpcElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwSW5uZXIuY2xhc3NOYW1lID0gJ3Rvb2x0aXAnO1xyXG5cclxuICAgIHZhciB0b29sdGlwQXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXBBcnJvdy5jbGFzc05hbWUgPSAndG9vbHRpcC1hcnJvdyc7XHJcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcEFycm93KTtcclxuXHJcbiAgICB2YXIgdG9vbHRpcENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXBDb250ZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwLWNvbnRlbnQnO1xyXG4gICAgdG9vbHRpcENvbnRlbnQuaW5uZXJIVE1MID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpO1xyXG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBDb250ZW50KTtcclxuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQodG9vbHRpcElubmVyKTtcclxuXHJcbiAgICByZXR1cm4gdG9vbHRpcDtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cclxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcG9zaXRpb25BdChwYXJlbnQsIHRvb2x0aXAsIHBvcykge1xyXG4gICAgbGV0IHRyaWdnZXIgPSBwYXJlbnQ7XHJcbiAgICBsZXQgYXJyb3cgPSB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXTtcclxuICAgIGxldCB0cmlnZ2VyUG9zaXRpb24gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgdmFyIHBhcmVudENvb3JkcyA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbGVmdCwgdG9wO1xyXG5cclxuICAgIHZhciB0b29sdGlwV2lkdGggPSB0b29sdGlwLm9mZnNldFdpZHRoO1xyXG5cclxuICAgIHZhciBkaXN0ID0gMTI7XHJcbiAgICBsZXQgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCkgKyAoKHBhcmVudC5vZmZzZXRXaWR0aCAtIHRvb2x0aXAub2Zmc2V0V2lkdGgpIC8gMik7XHJcblxyXG4gICAgc3dpdGNoIChwb3MpIHtcclxuICAgICAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gbGVmdCBzaWRlXHJcbiAgICBpZiAobGVmdCA8IDApIHtcclxuICAgICAgICBsZWZ0ID0gZGlzdDtcclxuICAgICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICAgICAgbGV0IGFycm93TGVmdFBvc2l0aW9uID0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbiArICdweCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIHRoZSBib3R0b20gb2YgdGhlIHBhZ2VcclxuICAgIGlmICgodG9wICsgdG9vbHRpcC5vZmZzZXRIZWlnaHQpID49IHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgICAgIGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIHRoZSB0b3Agb2YgdGhlIHBhZ2VcclxuICAgIGlmICh0b3AgPCAwKSB7XHJcbiAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IChsZWZ0ICsgdG9vbHRpcFdpZHRoKSkge1xyXG4gICAgICAgIHRvb2x0aXAuc3R5bGUucmlnaHQgPSBkaXN0ICsgJ3B4JztcclxuICAgICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ucmlnaHQgLSAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgICAgIGxldCBhcnJvd1JpZ2h0UG9zaXRpb24gPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5yaWdodCA9IGFycm93UmlnaHRQb3NpdGlvbiArICdweCc7XHJcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICB9XHJcbiAgICB0b29sdGlwLnN0eWxlLnRvcCA9IHRvcCArIHBhZ2VZT2Zmc2V0ICsgJ3B4JztcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLmNsYXNzTGlzdC5hZGQoYXJyb3dEaXJlY3Rpb24pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2xvc2VBbGxUb29sdGlwcyhldmVudCwgZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgaWYgKGZvcmNlIHx8ICghZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS10b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1jb250ZW50JykpKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9vbHRpcC1ob3ZlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uVG9vbHRpcEhvdmVyKGUpIHtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1ob3ZlcicpO1xyXG5cclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgICAgICBpZiAodHJpZ2dlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG5cclxuICAgIGlmICh0b29sdGlwSWQgIT09IG51bGwgJiYgdG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXBFbGVtZW50KTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJztcclxuaW1wb3J0IEFsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9hbGVydCc7XHJcbmltcG9ydCBCYWNrVG9Ub3AgZnJvbSAnLi9jb21wb25lbnRzL2JhY2stdG8tdG9wJztcclxuaW1wb3J0IENoYXJhY3RlckxpbWl0IGZyb20gJy4vY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG4vKipcclxuICogSW5pdCBhbGwgY29tcG9uZW50c1xyXG4gKiBAcGFyYW0ge0pTT059IG9wdGlvbnMge3Njb3BlOiBIVE1MRWxlbWVudH0gLSBJbml0IGFsbCBjb21wb25lbnRzIHdpdGhpbiBzY29wZSAoZGVmYXVsdCBpcyBkb2N1bWVudClcclxuICovXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBY2NvcmRpb25zXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWxlcnRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYWxlcnRzV2l0aENsb3NlQnV0dG9uID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFsZXJ0Lmhhcy1jbG9zZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBhbGVydHNXaXRoQ2xvc2VCdXR0b24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEJhY2sgdG8gdG9wIGJ1dHRvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ1dHRvbnMgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrLXRvLXRvcC1idXR0b24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYmFja1RvVG9wQnV0dG9ucy5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQmFja1RvVG9wKGJhY2tUb1RvcEJ1dHRvbnNbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGFyYWN0ZXIgbGltaXRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzQ2hhcmFjdGVyTGltaXQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWxpbWl0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzQ2hhcmFjdGVyTGltaXQubGVuZ3RoOyBjKyspe1xyXG5cclxuICAgIG5ldyBDaGFyYWN0ZXJMaW1pdChqc0NoYXJhY3RlckxpbWl0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGVja2JveCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBPdmVyZmxvdyBtZW51IHNvcnRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93blNvcnQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51LS1zb3J0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93blNvcnQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duU29ydChqc1NlbGVjdG9yRHJvcGRvd25Tb3J0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRGF0ZXBpY2tlclxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgZGF0ZVBpY2tlci5vbihzY29wZSk7XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBFcnJvciBzdW1tYXJ5XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICB2YXIgJGVycm9yU3VtbWFyeSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1vZHVsZT1cImVycm9yLXN1bW1hcnlcIl0nKTtcclxuICBuZXcgRXJyb3JTdW1tYXJ5KCRlcnJvclN1bW1hcnkpLmluaXQoKTtcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBJbnB1dCBSZWdleCAtIHVzZWQgb24gZGF0ZSBmaWVsZHNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSZWdleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBNb2RhbFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QgbW9kYWxzID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbCcpO1xyXG4gIGZvcihsZXQgZCA9IDA7IGQgPCBtb2RhbHMubGVuZ3RoOyBkKyspIHtcclxuICAgIG5ldyBNb2RhbChtb2RhbHNbZF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBOYXZpZ2F0aW9uXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBuZXcgTmF2aWdhdGlvbigpLmluaXQoKTtcclxuICAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSYWRpb2J1dHRvbiBncm91cCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJhZGlvQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSZXNwb25zaXZlIHRhYmxlc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXJlc3BvbnNpdmUtaGVhZGVycycpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdG9vbHRpcF0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRvb2x0aXAubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBpbml0LCBBY2NvcmRpb24sIEFsZXJ0LCBCYWNrVG9Ub3AsIENoYXJhY3RlckxpbWl0LCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBEcm9wZG93blNvcnQsIGRhdGVQaWNrZXIsIEVycm9yU3VtbWFyeSwgSW5wdXRSZWdleE1hc2ssIE1vZGFsLCBOYXZpZ2F0aW9uLCBSYWRpb1RvZ2dsZUdyb3VwLCBSZXNwb25zaXZlVGFibGUsIFRhYmxlU2VsZWN0YWJsZVJvd3MsIFRhYm5hdiwgVG9hc3QsIFRvb2x0aXB9OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiaW1wb3J0ICcuLi8uLi9PYmplY3QvZGVmaW5lUHJvcGVydHknXHJcblxyXG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcbiAgLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kL2RldGVjdC5qc1xyXG4gIHZhciBkZXRlY3QgPSAnYmluZCcgaW4gRnVuY3Rpb24ucHJvdG90eXBlXHJcblxyXG4gIGlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuICAvLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJmZsYWdzPWFsd2F5c1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdiaW5kJywge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxyXG4gICAgICAgICAgLy8gYWRkIG5lY2Vzc2FyeSBlczUtc2hpbSB1dGlsaXRpZXNcclxuICAgICAgICAgIHZhciAkQXJyYXkgPSBBcnJheTtcclxuICAgICAgICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xyXG4gICAgICAgICAgdmFyIE9iamVjdFByb3RvdHlwZSA9ICRPYmplY3QucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEFycmF5UHJvdG90eXBlID0gJEFycmF5LnByb3RvdHlwZTtcclxuICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XHJcbiAgICAgICAgICB2YXIgdG9fc3RyaW5nID0gT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nO1xyXG4gICAgICAgICAgdmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcclxuICAgICAgICAgIHZhciBpc0NhbGxhYmxlOyAvKiBpbmxpbmVkIGZyb20gaHR0cHM6Ly9ucG1qcy5jb20vaXMtY2FsbGFibGUgKi8gdmFyIGZuVG9TdHIgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgZm5Ub1N0ci5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLCBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7IGlzQ2FsbGFibGUgPSBmdW5jdGlvbiBpc0NhbGxhYmxlKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IHZhciBzdHJDbGFzcyA9IHRvX3N0cmluZy5jYWxsKHZhbHVlKTsgcmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzczsgfTtcclxuICAgICAgICAgIHZhciBhcnJheV9zbGljZSA9IEFycmF5UHJvdG90eXBlLnNsaWNlO1xyXG4gICAgICAgICAgdmFyIGFycmF5X2NvbmNhdCA9IEFycmF5UHJvdG90eXBlLmNvbmNhdDtcclxuICAgICAgICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcclxuICAgICAgICAgIHZhciBtYXggPSBNYXRoLm1heDtcclxuICAgICAgICAgIC8vIC9hZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG5cclxuICAgICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXHJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxyXG4gICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICcgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcclxuICAgICAgICAgIC8vICAgYXJndW1lbnQgdmFsdWVzIHByb3ZpZGVkIGFmdGVyIHRoaXNBcmcgKGFyZzEsIGFyZzIgZXRjKSwgaW4gb3JkZXIuXHJcbiAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXHJcbiAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXHJcbiAgICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXHJcbiAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXHJcbiAgICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxyXG4gICAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cclxuICAgICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMi5cclxuICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxyXG4gICAgICAgICAgdmFyIGJvdW5kO1xyXG4gICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XHJcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cclxuICAgICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjEgW1tDYWxsXV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxyXG4gICAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMgdmFsdWUgYW5kIGEgbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgb2YgdGFyZ2V0IHByb3ZpZGluZyBib3VuZFRoaXMgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXHJcbiAgICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxyXG4gICAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xyXG4gICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxyXG4gICAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cclxuXHJcbiAgICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBtYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xyXG4gICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXHJcbiAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XHJcbiAgICAgICAgICAvLyB3YXkgdG8gc2V0IHRoZSBsZW5ndGggcHJvcGVydHkgb2YgYSBmdW5jdGlvbi5cclxuICAgICAgICAgIC8vIEluIGVudmlyb25tZW50cyB3aGVyZSBDb250ZW50IFNlY3VyaXR5IFBvbGljaWVzIGVuYWJsZWQgKENocm9tZSBleHRlbnNpb25zLFxyXG4gICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cclxuICAgICAgICAgIC8vIEhvd2V2ZXIgaW4gYWxsIG9mIHRoZXNlIGVudmlyb25tZW50cyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBleGlzdHNcclxuICAgICAgICAgIC8vIGFuZCBzbyB0aGlzIGNvZGUgd2lsbCBuZXZlciBiZSBleGVjdXRlZC5cclxuICAgICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xyXG4gICAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXHJcbiAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXHJcblxyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxyXG4gICAgICAgICAgLy8gMjAuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXHJcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XHJcbiAgICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcclxuICAgICAgICAgIC8vICAgZmFsc2UuXHJcbiAgICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcclxuICAgICAgICAgIC8vICAgW1tTZXRdXTogdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sXHJcbiAgICAgICAgICAvLyAgIGFuZCBmYWxzZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcclxuICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXHJcbiAgICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cclxuICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXHJcblxyXG4gICAgICAgICAgLy8gMjIuIFJldHVybiBGLlxyXG4gICAgICAgICAgcmV0dXJuIGJvdW5kO1xyXG4gICAgICB9XHJcbiAgfSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIoZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcblxyXG4vLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5L2RldGVjdC5qc1xyXG52YXIgZGV0ZWN0ID0gKFxyXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcclxuICAvLyBmb3IgdGhlIGZlYXR1cmUgcmVxdWlyZXMgdGhlIGFiaWxpdHkgdG8gc2V0IGEgcHJvcGVydHkgb24gYW4gYXJiaXRyYXJ5IG9iamVjdFxyXG4gICdkZWZpbmVQcm9wZXJ0eScgaW4gT2JqZWN0ICYmIChmdW5jdGlvbigpIHtcclxuICBcdHRyeSB7XHJcbiAgXHRcdHZhciBhID0ge307XHJcbiAgXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLCAndGVzdCcsIHt2YWx1ZTo0Mn0pO1xyXG4gIFx0XHRyZXR1cm4gdHJ1ZTtcclxuICBcdH0gY2F0Y2goZSkge1xyXG4gIFx0XHRyZXR1cm4gZmFsc2VcclxuICBcdH1cclxuICB9KCkpXHJcbilcclxuXHJcbmlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1PYmplY3QuZGVmaW5lUHJvcGVydHkmZmxhZ3M9YWx3YXlzXHJcbihmdW5jdGlvbiAobmF0aXZlRGVmaW5lUHJvcGVydHkpIHtcclxuXHJcblx0dmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19kZWZpbmVHZXR0ZXJfXycpO1xyXG5cdHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSAnR2V0dGVycyAmIHNldHRlcnMgY2Fubm90IGJlIGRlZmluZWQgb24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZSc7XHJcblx0dmFyIEVSUl9WQUxVRV9BQ0NFU1NPUlMgPSAnQSBwcm9wZXJ0eSBjYW5ub3QgYm90aCBoYXZlIGFjY2Vzc29ycyBhbmQgYmUgd3JpdGFibGUgb3IgaGF2ZSBhIHZhbHVlJztcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcikge1xyXG5cclxuXHRcdC8vIFdoZXJlIG5hdGl2ZSBzdXBwb3J0IGV4aXN0cywgYXNzdW1lIGl0XHJcblx0XHRpZiAobmF0aXZlRGVmaW5lUHJvcGVydHkgJiYgKG9iamVjdCA9PT0gd2luZG93IHx8IG9iamVjdCA9PT0gZG9jdW1lbnQgfHwgb2JqZWN0ID09PSBFbGVtZW50LnByb3RvdHlwZSB8fCBvYmplY3QgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iamVjdCA9PT0gbnVsbCB8fCAhKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JykpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEoZGVzY3JpcHRvciBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcHJvcGVydHlTdHJpbmcgPSBTdHJpbmcocHJvcGVydHkpO1xyXG5cdFx0dmFyIGhhc1ZhbHVlT3JXcml0YWJsZSA9ICd2YWx1ZScgaW4gZGVzY3JpcHRvciB8fCAnd3JpdGFibGUnIGluIGRlc2NyaXB0b3I7XHJcblx0XHR2YXIgZ2V0dGVyVHlwZSA9ICdnZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0O1xyXG5cdFx0dmFyIHNldHRlclR5cGUgPSAnc2V0JyBpbiBkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldDtcclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5nZXRcclxuXHRcdGlmIChnZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChnZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLmdldCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5zZXRcclxuXHRcdGlmIChzZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChzZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignU2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLnNldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT0sgdG8gZGVmaW5lIHZhbHVlIHVuY29uZGl0aW9uYWxseSAtIGlmIGEgZ2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZCBhcyB3ZWxsLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gYWJvdmVcclxuXHRcdGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIHtcclxuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdDtcclxuXHR9O1xyXG59KE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkpO1xyXG59KVxyXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcclxuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cclxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1uYW1lcyAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIF9wYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXMgfHwge1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgIGRldGFpbDogbnVsbCxcclxuICAgIH07XHJcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHBhcmFtcy5idWJibGVzLFxyXG4gICAgICBwYXJhbXMuY2FuY2VsYWJsZSxcclxuICAgICAgcGFyYW1zLmRldGFpbFxyXG4gICAgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxufSkoKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxyXG5yZXF1aXJlKFwiLi9udW1iZXItaXMtbmFuXCIpO1xyXG5cclxuLy8gcG9seWZpbGxzIEN1c3RvbUV2ZW50XHJcbnJlcXVpcmUoXCIuL2N1c3RvbS1ldmVudFwiKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCJOdW1iZXIuaXNOYU4gPVxyXG4gIE51bWJlci5pc05hTiB8fFxyXG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXHJcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiICYmIGlucHV0ICE9PSBpbnB1dDtcclxuICB9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChodG1sRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4gaHRtbERvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpO1xyXG5jb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZXF1ZW5jZVxyXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBzZXEgYW4gYXJyYXkgb2YgZnVuY3Rpb25zXHJcbiAqIEByZXR1cm4geyBjbG9zdXJlIH0gY2FsbEhvb2tzXHJcbiAqL1xyXG4vLyBXZSB1c2UgYSBuYW1lZCBmdW5jdGlvbiBoZXJlIGJlY2F1c2Ugd2Ugd2FudCBpdCB0byBpbmhlcml0IGl0cyBsZXhpY2FsIHNjb3BlXHJcbi8vIGZyb20gdGhlIGJlaGF2aW9yIHByb3BzIG9iamVjdCwgbm90IGZyb20gdGhlIG1vZHVsZVxyXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XHJcbiAgZnVuY3Rpb24gY2FsbEhvb2tzKHRhcmdldCA9IGRvY3VtZW50LmJvZHkpIHtcclxuICAgIHNlcS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cclxuICByZWNlcHRvci5iZWhhdmlvcihcclxuICAgIGV2ZW50cyxcclxuICAgIGFzc2lnbihcclxuICAgICAge1xyXG4gICAgICAgIG9uOiBzZXF1ZW5jZShcImluaXRcIiwgXCJhZGRcIiksXHJcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wc1xyXG4gICAgKVxyXG4gICk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBicmVha3BvaW50cztcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIi8vIGlPUyBkZXRlY3Rpb24gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTAzOTg4NS8xNzc3MTBcclxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcclxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxyXG4gICAgIXdpbmRvdy5NU1N0cmVhbVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XHJcbiAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
