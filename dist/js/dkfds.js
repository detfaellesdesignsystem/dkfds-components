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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLXNvcnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnkuanMiLCJzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25hdmlnYXRpb24uanMiLCJzcmMvanMvY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90b2FzdC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2RrZmRzLmpzIiwic3JjL2pzL2V2ZW50cy5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQuanMiLCJzcmMvanMvcG9seWZpbGxzL09iamVjdC9kZWZpbmVQcm9wZXJ0eS5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvY3VzdG9tLWV2ZW50LmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvcG9seWZpbGxzL251bWJlci1pcy1uYW4uanMiLCJzcmMvanMvdXRpbHMvYWN0aXZlLWVsZW1lbnQuanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvYnJlYWtwb2ludHMuanMiLCJzcmMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW9zLWRldmljZS5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxNQUFJLEdBQUcsQ0FBQyxPQUFSLEVBQWlC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LEVBQThCLFFBQTlCO0FBQ0EsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBcEIsQ0FBWDtBQUNBLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCLENBQWpCOztBQUNBLE1BQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixVQUFNLElBQUksS0FBSixDQUNKLHNDQUFzQyxFQUF0QyxHQUEyQyxHQUR2QyxDQUFOO0FBR0Q7O0FBRUQsRUFBQSxRQUFRLENBQUMsWUFBVCxDQUFzQixNQUF0QixFQUE4QixDQUFDLFFBQS9CO0FBQ0EsU0FBTyxRQUFQO0FBQ0QsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBpc0VudW0uY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjAgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3RvID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiB7fTtcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsImNvbnN0IG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgZG8ge1xuICAgIGlmIChtYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWdub3JlKGVsZW1lbnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmFuY2UoZSkge1xuICAgIGlmIChlbGVtZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiZWhhdmlvcjogcmVxdWlyZSgnLi9iZWhhdmlvcicpLFxuICBkZWxlZ2F0ZTogcmVxdWlyZSgnLi9kZWxlZ2F0ZScpLFxuICBkZWxlZ2F0ZUFsbDogcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpLFxuICBpZ25vcmU6IHJlcXVpcmUoJy4vaWdub3JlJyksXG4gIGtleW1hcDogcmVxdWlyZSgnLi9rZXltYXAnKSxcbn07XG4iLCJyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICAnQWx0JzogICAgICAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAgJ2N0cmxLZXknLFxuICAnQ3RybCc6ICAgICAnY3RybEtleScsXG4gICdTaGlmdCc6ICAgICdzaGlmdEtleSdcbn07XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJztcblxuY29uc3QgZ2V0RXZlbnRLZXkgPSBmdW5jdGlvbihldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXk7XG4gIGlmIChoYXNNb2RpZmllcnMpIHtcbiAgICBmb3IgKHZhciBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXltYXAoa2V5cykge1xuICBjb25zdCBoYXNNb2RpZmllcnMgPSBPYmplY3Qua2V5cyhrZXlzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTE7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQsIGhhc01vZGlmaWVycyk7XG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIF9rZXkpIHtcbiAgICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICAgIHJlc3VsdCA9IGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSwgdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1PRElGSUVSUyA9IE1PRElGSUVSUztcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XHJcbmNvbnN0IEJVVFRPTiA9IGAuYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEVfQ0xBU1MgPSAnYWNjb3JkaW9uLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUID0gXCLDhWJuIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9DTE9TRV9URVhUID0gXCJMdWsgYWxsZVwiO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUgPSBcImRhdGEtYWNjb3JkaW9uLWJ1bGstZXhwYW5kXCI7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGFjY29yZGlvbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRhY2NvcmRpb24gdGhlIGFjY29yZGlvbiB1bCBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBBY2NvcmRpb24oJGFjY29yZGlvbil7XHJcbiAgaWYoISRhY2NvcmRpb24pe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBncm91cCBlbGVtZW50YCk7XHJcbiAgfVxyXG4gIHRoaXMuYWNjb3JkaW9uID0gJGFjY29yZGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudGxpc3RlbmVycyBvbiBjbGljayBlbGVtZW50cyBpbiBhY2NvcmRpb24gbGlzdFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgaWYodGhpcy5idXR0b25zLmxlbmd0aCA9PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gIH1cclxuXHJcbiAgLy8gbG9vcCBidXR0b25zIGluIGxpc3RcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XHJcbiAgICBsZXQgY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcclxuICAgIFxyXG4gICAgLy8gVmVyaWZ5IHN0YXRlIG9uIGJ1dHRvbiBhbmQgc3RhdGUgb24gcGFuZWxcclxuICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xyXG4gICAgdGhpcy50b2dnbGVCdXR0b24oY3VycmVudEJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYWNjb3JkaW9uIGJ1dHRvbnNcclxuICAgIGN1cnJlbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XHJcbiAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYnVsayBidXR0b24gaWYgcHJlc2VudFxyXG4gICAgbGV0IHByZXZTaWJsaW5nID0gdGhpcy5hY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZyA7XHJcbiAgICBpZihwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24gPSBwcmV2U2libGluZztcclxuICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ1bGtFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCdWxrIGV2ZW50IGhhbmRsZXI6IFRyaWdnZXJlZCB3aGVuIGNsaWNraW5nIG9uIC5hY2NvcmRpb24tYnVsay1idXR0b25cclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuYnVsa0V2ZW50ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgaWYoISRtb2R1bGUuYWNjb3JkaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpeyAgXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjY29yZGlvbi5gKTtcclxuICB9XHJcbiAgaWYoJG1vZHVsZS5idXR0b25zLmxlbmd0aCA9PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gIH1cclxuICAgIFxyXG4gIGxldCBleHBhbmQgPSB0cnVlO1xyXG4gIGlmKCRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmdldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUpID09PSBcImZhbHNlXCIpIHtcclxuICAgIGV4cGFuZCA9IGZhbHNlO1xyXG4gIH1cclxuICBmb3IgKHZhciBpID0gMDsgaSA8ICRtb2R1bGUuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XHJcbiAgICAkbW9kdWxlLnRvZ2dsZUJ1dHRvbigkbW9kdWxlLmJ1dHRvbnNbaV0sIGV4cGFuZCk7XHJcbiAgfVxyXG4gIFxyXG4gICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsICFleHBhbmQpO1xyXG4gIGlmKCFleHBhbmQgPT09IHRydWUpe1xyXG4gICAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9PUEVOX1RFWFQ7XHJcbiAgfSBlbHNle1xyXG4gICAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9DTE9TRV9URVhUO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFjY29yZGlvbiBidXR0b24gZXZlbnQgaGFuZGxlcjogVG9nZ2xlcyBhY2NvcmRpb25cclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gJGJ1dHRvbiBcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGUgXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmV2ZW50T25DbGljayA9IGZ1bmN0aW9uICgkYnV0dG9uLCBlKSB7XHJcbiAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRidXR0b24pO1xyXG4gIGlmICgkYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXHJcbiAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCgkYnV0dG9uKSkgJGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG4gQWNjb3JkaW9uLnByb3RvdHlwZS50b2dnbGVCdXR0b24gPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCkge1xyXG4gIGxldCBhY2NvcmRpb24gPSBudWxsO1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7XHJcbiAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIH0gZWxzZSBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7XHJcbiAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgfVxyXG5cclxuICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcclxuICBpZihleHBhbmRlZCl7ICAgIFxyXG4gICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJyk7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gIH0gZWxzZXtcclxuICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICB9XHJcblxyXG4gIGxldCBtdWx0aXNlbGVjdGFibGUgPSBmYWxzZTtcclxuICBpZihhY2NvcmRpb24gIT09IG51bGwgJiYgKGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnIHx8IGFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoTVVMVElTRUxFQ1RBQkxFX0NMQVNTKSkpe1xyXG4gICAgbXVsdGlzZWxlY3RhYmxlID0gdHJ1ZTtcclxuICAgIGxldCBidWxrRnVuY3Rpb24gPSBhY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgIGlmKGJ1bGtGdW5jdGlvbiAhPT0gbnVsbCAmJiBidWxrRnVuY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSl7XHJcbiAgICAgIGxldCBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgICAgbGV0IGJ1dHRvbnNPcGVuID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgICAgbGV0IGJ1dHRvbnNDbG9zZWQgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwiZmFsc2VcIl0nKTtcclxuICAgICAgbGV0IG5ld1N0YXR1cyA9IHRydWU7XHJcbiAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zT3Blbi5sZW5ndGgpe1xyXG4gICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zQ2xvc2VkLmxlbmd0aCl7XHJcbiAgICAgICAgbmV3U3RhdHVzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBidWxrRnVuY3Rpb24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgbmV3U3RhdHVzKTtcclxuICAgICAgaWYobmV3U3RhdHVzID09PSB0cnVlKXtcclxuICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9PUEVOX1RFWFQ7XHJcbiAgICAgIH0gZWxzZXtcclxuICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9DTE9TRV9URVhUO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uICYmIGN1cnJlbnRCdXR0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcgPT09IHRydWUpKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uOyIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xyXG4gICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgY2xvc2UgPSB0aGlzLmFsZXJ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIGNsb3NlWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgbGV0IGV2ZW50SGlkZSA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LmhpZGUnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG59O1xyXG5cclxuQWxlcnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgIFxyXG4gICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LnNob3cnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcblxyXG5jb25zdCBUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSA9ICdkYXRhLWFyaWEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBjaGVja2JveCBjb2xsYXBzZSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBDaGVja2JveFRvZ2dsZUNvbnRlbnQoY2hlY2tib3hFbGVtZW50KXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50ID0gY2hlY2tib3hFbGVtZW50O1xyXG4gICAgdGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHMgb24gY2hlY2tib3ggc3RhdGUgY2hhbmdlXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy50b2dnbGUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLnRvZ2dsZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIGNoZWNrYm94IGNvbnRlbnRcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciAkbW9kdWxlID0gdGhpcztcclxuICAgIHZhciB0YXJnZXRBdHRyID0gdGhpcy5jaGVja2JveEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKVxyXG4gICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUpO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5jaGVja2JveEVsZW1lbnQuY2hlY2tlZCl7XHJcbiAgICAgICAgJG1vZHVsZS5leHBhbmQodGhpcy5jaGVja2JveEVsZW1lbnQsIHRhcmdldEVsKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgICRtb2R1bGUuY29sbGFwc2UodGhpcy5jaGVja2JveEVsZW1lbnQsIHRhcmdldEVsKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4cGFuZCBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgY29udGFpbmVyIGVsZW1lbnQgXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uKGNoZWNrYm94RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYoY2hlY2tib3hFbGVtZW50ICE9PSBudWxsICYmIGNoZWNrYm94RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGNoZWNrYm94RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5leHBhbmRlZCcpO1xyXG4gICAgICAgIGNoZWNrYm94RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb2xsYXBzZSBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgY29udGFpbmVyIGVsZW1lbnQgXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmNvbGxhcHNlID0gZnVuY3Rpb24odHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jb2xsYXBzZWQnKTtcclxuICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tib3hUb2dnbGVDb250ZW50O1xyXG4iLCJpbXBvcnQge2tleW1hcH0gZnJvbSAncmVjZXB0b3InO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3NlbGVjdFwiKTtcclxuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcclxuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcclxuY29uc3QgYWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoXCIuLi91dGlscy9hY3RpdmUtZWxlbWVudFwiKTtcclxuY29uc3QgaXNJb3NEZXZpY2UgPSByZXF1aXJlKFwiLi4vdXRpbHMvaXMtaW9zLWRldmljZVwiKTtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSX0NMQVNTID0gYGRhdGUtcGlja2VyYDtcclxuY29uc3QgREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fd3JhcHBlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1pbml0aWFsaXplZGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0tYWN0aXZlYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2ludGVybmFsLWlucHV0YDtcclxuY29uc3QgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2V4dGVybmFsLWlucHV0YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19idXR0b25gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fY2FsZW5kYXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3N0YXR1c2A7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGVgO1xyXG5cclxuY29uc3QgQ0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1jdXJyZW50LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLW5leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfVE9EQVlfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tdG9kYXlgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfU1RBUlRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1zdGFydGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1lbmRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS13aXRoaW4tcmFuZ2VgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1zZWxlY3Rpb25gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1zZWxlY3Rpb25gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX1lFQVJfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX1lFQVJfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfVEFCTEVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3RhYmxlYDtcclxuY29uc3QgQ0FMRU5EQVJfUk9XX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19yb3dgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19jZWxsYDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1MgPSBgJHtDQUxFTkRBUl9DRUxMX0NMQVNTfS0tY2VudGVyLWl0ZW1zYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLWxhYmVsYDtcclxuY29uc3QgQ0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RheS1vZi13ZWVrYDtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSID0gYC4ke0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTiA9IGAuJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVQgPSBgLiR7REFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVQgPSBgLiR7REFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVIgPSBgLiR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTID0gYC4ke0RBVEVfUElDS0VSX1NUQVRVU19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFID0gYC4ke0NBTEVOREFSX0RBVEVfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9GT0NVU0VEID0gYC4ke0NBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEggPSBgLiR7Q0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVIgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USCA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVIgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIID0gYC4ke0NBTEVOREFSX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSID0gYC4ke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTfWA7XHJcblxyXG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIkluZHRhc3QgdmVubGlnc3QgZW4gZ3lsZGlnIGRhdG9cIjtcclxuXHJcbmNvbnN0IE1PTlRIX0xBQkVMUyA9IFtcclxuICBcIkphbnVhclwiLFxyXG4gIFwiRmVicnVhclwiLFxyXG4gIFwiTWFydHNcIixcclxuICBcIkFwcmlsXCIsXHJcbiAgXCJNYWpcIixcclxuICBcIkp1bmlcIixcclxuICBcIkp1bGlcIixcclxuICBcIkF1Z3VzdFwiLFxyXG4gIFwiU2VwdGVtYmVyXCIsXHJcbiAgXCJPa3RvYmVyXCIsXHJcbiAgXCJOb3ZlbWJlclwiLFxyXG4gIFwiRGVjZW1iZXJcIixcclxuXTtcclxuXHJcbmNvbnN0IERBWV9PRl9XRUVLX0xBQkVMUyA9IFtcclxuICBcIk1hbmRhZ1wiLFxyXG4gIFwiVGlyc2RhZ1wiLFxyXG4gIFwiT25zZGFnXCIsXHJcbiAgXCJUb3JzZGFnXCIsXHJcbiAgXCJGcmVkYWdcIixcclxuICBcIkzDuHJkYWdcIixcclxuICBcIlPDuG5kYWdcIixcclxuXTtcclxuXHJcbmNvbnN0IEVOVEVSX0tFWUNPREUgPSAxMztcclxuXHJcbmNvbnN0IFlFQVJfQ0hVTksgPSAxMjtcclxuXHJcbmNvbnN0IERFRkFVTFRfTUlOX0RBVEUgPSBcIjAwMDAtMDEtMDFcIjtcclxuY29uc3QgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCA9IFwiREQvTU0vWVlZWVwiO1xyXG5jb25zdCBJTlRFUk5BTF9EQVRFX0ZPUk1BVCA9IFwiWVlZWS1NTS1ERFwiO1xyXG5cclxuY29uc3QgTk9UX0RJU0FCTEVEX1NFTEVDVE9SID0gXCI6bm90KFtkaXNhYmxlZF0pXCI7XHJcblxyXG5jb25zdCBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzID0gKC4uLnNlbGVjdG9ycykgPT5cclxuICBzZWxlY3RvcnMubWFwKChxdWVyeSkgPT4gcXVlcnkgKyBOT1RfRElTQUJMRURfU0VMRUNUT1IpLmpvaW4oXCIsIFwiKTtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUixcclxuICBDQUxFTkRBUl9QUkVWSU9VU19NT05USCxcclxuICBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSLFxyXG4gIENBTEVOREFSX05FWFRfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfREFURV9GT0NVU0VEXHJcbik7XHJcblxyXG5jb25zdCBNT05USF9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9NT05USF9GT0NVU0VEXHJcbik7XHJcblxyXG5jb25zdCBZRUFSX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX1lFQVJfRk9DVVNFRFxyXG4pO1xyXG5cclxuLy8gI3JlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBLZWVwIGRhdGUgd2l0aGluIG1vbnRoLiBNb250aCB3b3VsZCBvbmx5IGJlIG92ZXIgYnkgMSB0byAzIGRheXNcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlVG9DaGVjayB0aGUgZGF0ZSBvYmplY3QgdG8gY2hlY2tcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBjb3JyZWN0IG1vbnRoXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSwgY29ycmVjdGVkIGlmIG5lZWRlZFxyXG4gKi9cclxuY29uc3Qga2VlcERhdGVXaXRoaW5Nb250aCA9IChkYXRlVG9DaGVjaywgbW9udGgpID0+IHtcclxuICBpZiAobW9udGggIT09IGRhdGVUb0NoZWNrLmdldE1vbnRoKCkpIHtcclxuICAgIGRhdGVUb0NoZWNrLnNldERhdGUoMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZVRvQ2hlY2s7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgZnJvbSBtb250aCBkYXkgeWVhclxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBtb250aCB0byBzZXQgKHplcm8taW5kZXhlZClcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgc2V0IGRhdGVcclxuICovXHJcbmNvbnN0IHNldERhdGUgPSAoeWVhciwgbW9udGgsIGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyLCBtb250aCwgZGF0ZSk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogdG9kYXlzIGRhdGVcclxuICpcclxuICogQHJldHVybnMge0RhdGV9IHRvZGF5cyBkYXRlXHJcbiAqL1xyXG5jb25zdCB0b2RheSA9ICgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCBkYXkgPSBuZXdEYXRlLmdldERhdGUoKTtcclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCB5ZWFyID0gbmV3RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIHJldHVybiBzZXREYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGZpcnN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZk1vbnRoID0gKGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgMSk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gbGFzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGxhc3REYXlPZk1vbnRoID0gKGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSArIDEsIDApO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBkYXlzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZERheXMgPSAoX2RhdGUsIG51bURheXMpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuICBuZXdEYXRlLnNldERhdGUobmV3RGF0ZS5nZXREYXRlKCkgKyBudW1EYXlzKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBkYXlzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4gYWRkRGF5cyhfZGF0ZSwgLW51bURheXMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB3ZWVrcyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFdlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkRGF5cyhfZGF0ZSwgbnVtV2Vla3MgKiA3KTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB3ZWVrcyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGRXZWVrcyhfZGF0ZSwgLW51bVdlZWtzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgKE1vbmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGxldCBkYXlPZldlZWsgPSBfZGF0ZS5nZXREYXkoKS0xO1xyXG4gIGlmKGRheU9mV2VlayA9PT0gLTEpe1xyXG4gICAgZGF5T2ZXZWVrID0gNjtcclxuICB9XHJcbiAgcmV0dXJuIHN1YkRheXMoX2RhdGUsIGRheU9mV2Vlayk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIGVuZCBvZiB0aGUgd2VlayAoU3VuZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBlbmRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBjb25zdCBkYXlPZldlZWsgPSBfZGF0ZS5nZXREYXkoKTtcclxuICByZXR1cm4gYWRkRGF5cyhfZGF0ZSwgNyAtIGRheU9mV2Vlayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIG1vbnRocyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgY29uc3QgZGF0ZU1vbnRoID0gKG5ld0RhdGUuZ2V0TW9udGgoKSArIDEyICsgbnVtTW9udGhzKSAlIDEyO1xyXG4gIG5ld0RhdGUuc2V0TW9udGgobmV3RGF0ZS5nZXRNb250aCgpICsgbnVtTW9udGhzKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIGRhdGVNb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IG1vbnRocyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4gYWRkTW9udGhzKF9kYXRlLCAtbnVtTW9udGhzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgeWVhcnMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZE1vbnRocyhfZGF0ZSwgbnVtWWVhcnMgKiAxMik7XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgeWVhcnMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YlllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkWWVhcnMoX2RhdGUsIC1udW1ZZWFycyk7XHJcblxyXG4vKipcclxuICogU2V0IG1vbnRocyBvZiBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB6ZXJvLWluZGV4ZWQgbW9udGggdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0TW9udGggPSAoX2RhdGUsIG1vbnRoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIG5ld0RhdGUuc2V0TW9udGgobW9udGgpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgeWVhciBvZiBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldFllYXIgPSAoX2RhdGUsIHllYXIpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKi9cclxuY29uc3QgbWluID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XHJcblxyXG4gIGlmIChkYXRlQiA8IGRhdGVBKSB7XHJcbiAgICBuZXdEYXRlID0gZGF0ZUI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgbGF0ZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBsYXRlc3QgZGF0ZVxyXG4gKi9cclxuY29uc3QgbWF4ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XHJcblxyXG4gIGlmIChkYXRlQiA+IGRhdGVBKSB7XHJcbiAgICBuZXdEYXRlID0gZGF0ZUI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgeWVhclxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIHllYXJcclxuICovXHJcbmNvbnN0IGlzU2FtZVllYXIgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGRhdGVBICYmIGRhdGVCICYmIGRhdGVBLmdldEZ1bGxZZWFyKCkgPT09IGRhdGVCLmdldEZ1bGxZZWFyKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVNb250aCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gaXNTYW1lWWVhcihkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldE1vbnRoKCkgPT09IGRhdGVCLmdldE1vbnRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBzYW1lIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIHRoZSBzYW1lIGRhdGVcclxuICovXHJcbmNvbnN0IGlzU2FtZURheSA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gaXNTYW1lTW9udGgoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXREYXRlKCkgPT09IGRhdGVCLmdldERhdGUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiByZXR1cm4gYSBuZXcgZGF0ZSB3aXRoaW4gbWluaW11bSBhbmQgbWF4aW11bSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUgYmV0d2VlbiBtaW4gYW5kIG1heFxyXG4gKi9cclxuY29uc3Qga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGU7XHJcblxyXG4gIGlmIChkYXRlIDwgbWluRGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1pbkRhdGU7XHJcbiAgfSBlbHNlIGlmIChtYXhEYXRlICYmIGRhdGUgPiBtYXhEYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWF4RGF0ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgaXMgdmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGVyZSBhIGRheSB3aXRoaW4gdGhlIG1vbnRoIHdpdGhpbiBtaW4gYW5kIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlV2l0aGluTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+XHJcbiAgZGF0ZSA+PSBtaW5EYXRlICYmICghbWF4RGF0ZSB8fCBkYXRlIDw9IG1heERhdGUpO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIG1vbnRoIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChkYXRlKSA8IG1pbkRhdGUgfHwgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKGRhdGUpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIHllYXIgaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMTEpKSA8IG1pbkRhdGUgfHxcclxuICAgIChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChzZXRNb250aChkYXRlLCAwKSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogUGFyc2UgYSBkYXRlIHdpdGggZm9ybWF0IE0tRC1ZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyB0aGUgZGF0ZSBzdHJpbmcgdG8gcGFyc2VcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHBhcmFtIHtib29sZWFufSBhZGp1c3REYXRlIHNob3VsZCB0aGUgZGF0ZSBiZSBhZGp1c3RlZFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHBhcnNlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBwYXJzZURhdGVTdHJpbmcgPSAoXHJcbiAgZGF0ZVN0cmluZyxcclxuICBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQsXHJcbiAgYWRqdXN0RGF0ZSA9IGZhbHNlXHJcbikgPT4ge1xyXG4gIGxldCBkYXRlO1xyXG4gIGxldCBtb250aDtcclxuICBsZXQgZGF5O1xyXG4gIGxldCB5ZWFyO1xyXG4gIGxldCBwYXJzZWQ7XHJcblxyXG4gIGlmIChkYXRlU3RyaW5nKSB7XHJcbiAgICBsZXQgbW9udGhTdHIsIGRheVN0ciwgeWVhclN0cjtcclxuICAgIGlmIChkYXRlRm9ybWF0ID09PSBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKSB7XHJcbiAgICAgIFtkYXlTdHIsIG1vbnRoU3RyLCB5ZWFyU3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCIvXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgW3llYXJTdHIsIG1vbnRoU3RyLCBkYXlTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHllYXJTdHIpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgeWVhciA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgeWVhciA9IE1hdGgubWF4KDAsIHllYXIpO1xyXG4gICAgICAgICAgaWYgKHllYXJTdHIubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhciA9IHRvZGF5KCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJTdHViID1cclxuICAgICAgICAgICAgICBjdXJyZW50WWVhciAtIChjdXJyZW50WWVhciAlIDEwICoqIHllYXJTdHIubGVuZ3RoKTtcclxuICAgICAgICAgICAgeWVhciA9IGN1cnJlbnRZZWFyU3R1YiArIHBhcnNlZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGhTdHIpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQobW9udGhTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIG1vbnRoID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWF4KDEsIG1vbnRoKTtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5taW4oMTIsIG1vbnRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5U3RyICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChkYXlTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIGRheSA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgY29uc3QgbGFzdERheU9mVGhlTW9udGggPSBzZXREYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1heCgxLCBkYXkpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5taW4obGFzdERheU9mVGhlTW9udGgsIGRheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgZGF0ZSA9IHNldERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0IGEgZGF0ZSB0byBmb3JtYXQgTU0tREQtWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgdGhlIGRhdGUgdG8gZm9ybWF0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmb3JtYXR0ZWQgZGF0ZSBzdHJpbmdcclxuICovXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSwgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFUKSA9PiB7XHJcbiAgY29uc3QgcGFkWmVyb3MgPSAodmFsdWUsIGxlbmd0aCkgPT4ge1xyXG4gICAgcmV0dXJuIGAwMDAwJHt2YWx1ZX1gLnNsaWNlKC1sZW5ndGgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xyXG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiL1wiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbcGFkWmVyb3MoeWVhciwgNCksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoZGF5LCAyKV0uam9pbihcIi1cIik7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIGdyaWQgc3RyaW5nIGZyb20gYW4gYXJyYXkgb2YgaHRtbCBzdHJpbmdzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IGh0bWxBcnJheSB0aGUgYXJyYXkgb2YgaHRtbCBpdGVtc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gcm93U2l6ZSB0aGUgbGVuZ3RoIG9mIGEgcm93XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBncmlkIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgbGlzdFRvR3JpZEh0bWwgPSAoaHRtbEFycmF5LCByb3dTaXplKSA9PiB7XHJcbiAgY29uc3QgZ3JpZCA9IFtdO1xyXG4gIGxldCByb3cgPSBbXTtcclxuXHJcbiAgbGV0IGkgPSAwO1xyXG4gIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCkge1xyXG4gICAgcm93ID0gW107XHJcbiAgICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGggJiYgcm93Lmxlbmd0aCA8IHJvd1NpemUpIHtcclxuICAgICAgcm93LnB1c2goYDx0ZD4ke2h0bWxBcnJheVtpXX08L3RkPmApO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBncmlkLnB1c2goYDx0cj4ke3Jvdy5qb2luKFwiXCIpfTwvdHI+YCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ3JpZC5qb2luKFwiXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgYW5kIGRpc3BhdGNoIGEgY2hhbmdlIGV2ZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gZWwgVGhlIGVsZW1lbnQgdG8gdXBkYXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBjaGFuZ2VFbGVtZW50VmFsdWUgPSAoZWwsIHZhbHVlID0gXCJcIikgPT4ge1xyXG4gIGNvbnN0IGVsZW1lbnRUb0NoYW5nZSA9IGVsO1xyXG4gIGVsZW1lbnRUb0NoYW5nZS52YWx1ZSA9IHZhbHVlO1xyXG5cclxuXHJcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnKTtcclxuICBlbGVtZW50VG9DaGFuZ2UuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGVQaWNrZXJDb250ZXh0XHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGNhbGVuZGFyRWxcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0ZVBpY2tlckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gaW50ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gZXh0ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IHN0YXR1c0VsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGZpcnN0WWVhckNodW5rRWxcclxuICogQHByb3BlcnR5IHtEYXRlfSBjYWxlbmRhckRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtaW5EYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWF4RGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHNlbGVjdGVkRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHJhbmdlRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGRlZmF1bHREYXRlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqIEByZXR1cm5zIHtEYXRlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcclxuICovXHJcbmNvbnN0IGdldERhdGVQaWNrZXJDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcblxyXG4gIGlmICghZGF0ZVBpY2tlckVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUElDS0VSfWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuICBjb25zdCB0b2dnbGVCdG5FbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0JVVFRPTik7XHJcbiAgY29uc3Qgc3RhdHVzRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9TVEFUVVMpO1xyXG4gIGNvbnN0IGZpcnN0WWVhckNodW5rRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSKTtcclxuXHJcbiAgY29uc3QgaW5wdXREYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnZhbHVlLFxyXG4gICAgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICAgIHRydWVcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhpbnRlcm5hbElucHV0RWwudmFsdWUpO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckRhdGUgPSBwYXJzZURhdGVTdHJpbmcoY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUpO1xyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSk7XHJcbiAgY29uc3QgcmFuZ2VEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LnJhbmdlRGF0ZSk7XHJcbiAgY29uc3QgZGVmYXVsdERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdERhdGUpO1xyXG5cclxuICBpZiAobWluRGF0ZSAmJiBtYXhEYXRlICYmIG1pbkRhdGUgPiBtYXhEYXRlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIGRhdGUgY2Fubm90IGJlIGFmdGVyIG1heGltdW0gZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgdG9nZ2xlQnRuRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZmlyc3RZZWFyQ2h1bmtFbCxcclxuICAgIGRhdGVQaWNrZXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgIGV4dGVybmFsSW5wdXRFbCxcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICAgIHN0YXR1c0VsLFxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogRGlzYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc2FibGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZW5hYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gZmFsc2U7XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIFZhbGlkYXRpb25cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGUgdmFsdWUgaW4gdGhlIGlucHV0IGFzIGEgdmFsaWQgZGF0ZSBvZiBmb3JtYXQgTS9EL1lZWVlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaXNEYXRlSW5wdXRJbnZhbGlkID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3QgZGF0ZVN0cmluZyA9IGV4dGVybmFsSW5wdXRFbC52YWx1ZTtcclxuICBsZXQgaXNJbnZhbGlkID0gZmFsc2U7XHJcblxyXG4gIGlmIChkYXRlU3RyaW5nKSB7XHJcbiAgICBpc0ludmFsaWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGRhdGVTdHJpbmdQYXJ0cyA9IGRhdGVTdHJpbmcuc3BsaXQoXCIvXCIpO1xyXG4gICAgY29uc3QgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZ1BhcnRzLm1hcCgoc3RyKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHZhbHVlID0gcGFyc2VkO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBjaGVja0RhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBjaGVja0RhdGUuZ2V0TW9udGgoKSA9PT0gbW9udGggLSAxICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldERhdGUoKSA9PT0gZGF5ICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiZcclxuICAgICAgICBkYXRlU3RyaW5nUGFydHNbMl0ubGVuZ3RoID09PSA0ICYmXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KGNoZWNrRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgaXNJbnZhbGlkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpc0ludmFsaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHZhbGlkYXRlRGF0ZUlucHV0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBpc0ludmFsaWQgPSBpc0RhdGVJbnB1dEludmFsaWQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuXHJcbiAgaWYgKGlzSW52YWxpZCAmJiAhZXh0ZXJuYWxJbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoVkFMSURBVElPTl9NRVNTQUdFKTtcclxuICB9XHJcblxyXG4gIGlmICghaXNJbnZhbGlkICYmIGV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSA9PT0gVkFMSURBVElPTl9NRVNTQUdFKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgcmVjb25jaWxlSW5wdXRWYWx1ZXMgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGludGVybmFsSW5wdXRFbCwgaW5wdXREYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgbGV0IG5ld1ZhbHVlID0gXCJcIjtcclxuXHJcbiAgaWYgKGlucHV0RGF0ZSAmJiAhaXNEYXRlSW5wdXRJbnZhbGlkKGVsKSkge1xyXG4gICAgbmV3VmFsdWUgPSBmb3JtYXREYXRlKGlucHV0RGF0ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLnZhbHVlICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgbmV3VmFsdWUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRlIHBpY2tlciBpbnB1dHMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgVGhlIGRhdGUgc3RyaW5nIHRvIHVwZGF0ZSBpbiBZWVlZLU1NLUREIGZvcm1hdFxyXG4gKi9cclxuY29uc3Qgc2V0Q2FsZW5kYXJWYWx1ZSA9IChlbCwgZGF0ZVN0cmluZykgPT4ge1xyXG4gIGNvbnN0IHBhcnNlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVN0cmluZyk7XHJcblxyXG4gIGlmIChwYXJzZWREYXRlKSB7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShwYXJzZWREYXRlLCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKTtcclxuXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGRhdGVQaWNrZXJFbCxcclxuICAgICAgaW50ZXJuYWxJbnB1dEVsLFxyXG4gICAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIGRhdGVTdHJpbmcpO1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGV4dGVybmFsSW5wdXRFbCwgZm9ybWF0dGVkRGF0ZSk7XHJcblxyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZGF0ZVBpY2tlckVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBUaGUgaW5pdGlhbCB3cmFwcGluZyBlbGVtZW50IG9mIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuaGFuY2VEYXRlUGlja2VyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xyXG5cclxuICBjb25zdCBpbnRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihgaW5wdXRgKTtcclxuXHJcbiAgaWYgKCFpbnRlcm5hbElucHV0RWwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgJHtEQVRFX1BJQ0tFUn0gaXMgbWlzc2luZyBpbm5lciBpbnB1dGApO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtaW5cIilcclxuICApO1xyXG4gIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlXHJcbiAgICA/IGZvcm1hdERhdGUobWluRGF0ZSlcclxuICAgIDogREVGQVVMVF9NSU5fREFURTtcclxuXHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1heFwiKVxyXG4gICk7XHJcbiAgaWYgKG1heERhdGUpIHtcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgPSBmb3JtYXREYXRlKG1heERhdGUpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBjYWxlbmRhcldyYXBwZXIuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTKTtcclxuICBjYWxlbmRhcldyYXBwZXIudGFiSW5kZXggPSBcIi0xXCI7XHJcblxyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGludGVybmFsSW5wdXRFbC5jbG9uZU5vZGUoKTtcclxuICBleHRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLnR5cGUgPSBcInRleHRcIjtcclxuICBleHRlcm5hbElucHV0RWwubmFtZSA9IFwiXCI7XHJcblxyXG4gIGNhbGVuZGFyV3JhcHBlci5hcHBlbmRDaGlsZChleHRlcm5hbElucHV0RWwpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXHJcbiAgICBcImJlZm9yZWVuZFwiLFxyXG4gICAgW1xyXG4gICAgICBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCLDhWJuIGthbGVuZGVyXCI+Jm5ic3A7PC9idXR0b24+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCIke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGhpZGRlbj48L2Rpdj5gLFxyXG4gICAgICBgPGRpdiBjbGFzcz1cInNyLW9ubHkgJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9XCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPjwvZGl2PmAsXHJcbiAgICBdLmpvaW4oXCJcIilcclxuICApO1xyXG5cclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgXCJzci1vbmx5XCIsXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU1xyXG4gICk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcclxuICBpbnRlcm5hbElucHV0RWwucmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmFwcGVuZENoaWxkKGNhbGVuZGFyV3JhcHBlcik7XHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpO1xyXG5cclxuICBpZiAoZGVmYXVsdFZhbHVlKSB7XHJcbiAgICBzZXRDYWxlbmRhclZhbHVlKGRhdGVQaWNrZXJFbCwgZGVmYXVsdFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQpIHtcclxuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcclxuICAgIGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXh0ZXJuYWxJbnB1dEVsLnZhbHVlKSB7XHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChleHRlcm5hbElucHV0RWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogcmVuZGVyIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlVG9EaXNwbGF5IGEgZGF0ZSB0byByZW5kZXIgb24gdGhlIGNhbGVuZGFyXHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCByZW5kZXJDYWxlbmRhciA9IChlbCwgX2RhdGVUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHJhbmdlRGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IHRvZGF5c0RhdGUgPSB0b2RheSgpO1xyXG4gIGxldCBkYXRlVG9EaXNwbGF5ID0gX2RhdGVUb0Rpc3BsYXkgfHwgdG9kYXlzRGF0ZTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXYXNIaWRkZW4gPSBjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgY29uc3QgZm9jdXNlZERhdGUgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDApO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IGRhdGVUb0Rpc3BsYXkuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgY29uc3QgcHJldk1vbnRoID0gc3ViTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xyXG4gIGNvbnN0IG5leHRNb250aCA9IGFkZE1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuXHJcbiAgY29uc3QgY3VycmVudEZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb0Rpc3BsYXkpO1xyXG5cclxuICBjb25zdCBmaXJzdE9mTW9udGggPSBzdGFydE9mTW9udGgoZGF0ZVRvRGlzcGxheSk7XHJcbiAgY29uc3QgcHJldkJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1pbkRhdGUpO1xyXG4gIGNvbnN0IG5leHRCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtYXhEYXRlKTtcclxuXHJcbiAgY29uc3QgcmFuZ2VDb25jbHVzaW9uRGF0ZSA9IHNlbGVjdGVkRGF0ZSB8fCBkYXRlVG9EaXNwbGF5O1xyXG4gIGNvbnN0IHJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIG1pbihyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBtYXgocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuXHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgYWRkRGF5cyhyYW5nZVN0YXJ0RGF0ZSwgMSk7XHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIHN1YkRheXMocmFuZ2VFbmREYXRlLCAxKTtcclxuXHJcbiAgY29uc3QgbW9udGhMYWJlbCA9IE1PTlRIX0xBQkVMU1tmb2N1c2VkTW9udGhdO1xyXG5cclxuICBjb25zdCBnZW5lcmF0ZURhdGVIdG1sID0gKGRhdGVUb1JlbmRlcikgPT4ge1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9EQVRFX0NMQVNTXTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGVUb1JlbmRlci5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtb250aCA9IGRhdGVUb1JlbmRlci5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGVUb1JlbmRlci5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF5T2ZXZWVrID0gZGF0ZVRvUmVuZGVyLmdldERheSgpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb1JlbmRlcik7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhaXNEYXRlV2l0aGluTWluQW5kTWF4KGRhdGVUb1JlbmRlciwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgc2VsZWN0ZWREYXRlKTtcclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBwcmV2TW9udGgpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgbmV4dE1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHRvZGF5c0RhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmFuZ2VEYXRlKSB7XHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZURhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZVN0YXJ0RGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRW5kRGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoXHJcbiAgICAgICAgICBkYXRlVG9SZW5kZXIsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZVN0YXJ0RGF0ZSxcclxuICAgICAgICAgIHdpdGhpblJhbmdlRW5kRGF0ZVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhTdHIgPSBNT05USF9MQUJFTFNbbW9udGhdO1xyXG4gICAgY29uc3QgZGF5U3RyID0gREFZX09GX1dFRUtfTEFCRUxTW2RheU9mV2Vla107XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uXHJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgIGRhdGEtZGF5PVwiJHtkYXl9XCIgXHJcbiAgICAgIGRhdGEtbW9udGg9XCIke21vbnRoICsgMX1cIiBcclxuICAgICAgZGF0YS15ZWFyPVwiJHt5ZWFyfVwiIFxyXG4gICAgICBkYXRhLXZhbHVlPVwiJHtmb3JtYXR0ZWREYXRlfVwiXHJcbiAgICAgIGFyaWEtbGFiZWw9XCIke2RheVN0cn0gZGVuICR7ZGF5fSAke21vbnRoU3RyfSAke3llYXJ9IFwiXHJcbiAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICA+JHtkYXl9PC9idXR0b24+YDtcclxuICB9O1xyXG4gIC8vIHNldCBkYXRlIHRvIGZpcnN0IHJlbmRlcmVkIGRheVxyXG4gIGRhdGVUb0Rpc3BsYXkgPSBzdGFydE9mV2VlayhmaXJzdE9mTW9udGgpO1xyXG5cclxuICBjb25zdCBkYXlzID0gW107XHJcblxyXG4gIHdoaWxlIChcclxuICAgIGRheXMubGVuZ3RoIDwgMjggfHxcclxuICAgIGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKSA9PT0gZm9jdXNlZE1vbnRoIHx8XHJcbiAgICBkYXlzLmxlbmd0aCAlIDcgIT09IDBcclxuICApIHtcclxuICAgIGRheXMucHVzaChnZW5lcmF0ZURhdGVIdG1sKGRhdGVUb0Rpc3BsYXkpKTtcclxuICAgIGRhdGVUb0Rpc3BsYXkgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDEpOyAgICBcclxuICB9XHJcbiAgY29uc3QgZGF0ZXNIdG1sID0gbGlzdFRvR3JpZEh0bWwoZGF5cywgNyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5kYXRhc2V0LnZhbHVlID0gY3VycmVudEZvcm1hdHRlZERhdGU7XHJcbiAgbmV3Q2FsZW5kYXIuc3R5bGUudG9wID0gYCR7ZGF0ZVBpY2tlckVsLm9mZnNldEhlaWdodH1weGA7XHJcbiAgbmV3Q2FsZW5kYXIuaGlkZGVuID0gZmFsc2U7XHJcbiAgbGV0IGNvbnRlbnQgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9ST1dfQ0xBU1N9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciDDqXQgw6VyIHRpbGJhZ2VcIlxyXG4gICAgICAgICAgICAke3ByZXZCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke21vbnRoTGFiZWx9LiBWw6ZsZyBtw6VuZWQuXCJcclxuICAgICAgICAgID4ke21vbnRoTGFiZWx9PC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke2ZvY3VzZWRZZWFyfS4gVsOmbGcgw6VyLlwiXHJcbiAgICAgICAgICA+JHtmb2N1c2VkWWVhcn08L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciDDqW4gbcOlbmVkIGZyZW1cIlxyXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOTmF2aWfDqXIgw6l0IMOlciBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG5cclxuICBjb25zdCBzdGF0dXNlcyA9IFtdO1xyXG5cclxuICBpZiAoaXNTYW1lRGF5KHNlbGVjdGVkRGF0ZSwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKFwiU2VsZWN0ZWQgZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIGlmIChjYWxlbmRhcldhc0hpZGRlbikge1xyXG4gICAgc3RhdHVzZXMucHVzaChcclxuICAgICAgXCJEdSBrYW4gbmF2aWdlcmUgbWVsbGVtIGRhZ2UgdmVkIGF0IGJydWdlIGjDuGpyZSBvZyB2ZW5zdHJlIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwidWdlciB2ZWQgYXQgYnJ1Z2Ugb3Agb2cgbmVkIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwibcOlbmVkZXIgdmVkIHRhIGJydWdlIHBhZ2UgdXAgb2cgcGFnZSBkb3duIHRhc3Rlcm5lIFwiLFxyXG4gICAgICBcIm9nIMOlciB2ZWQgYXQgYXQgdGFzdGUgc2hpZnQgb2cgcGFnZSB1cCBlbGxlciBuZWQuXCIsXHJcbiAgICAgIFwiSG9tZSBvZyBlbmQgdGFzdGVuIG5hdmlnZXJlciB0aWwgc3RhcnQgZWxsZXIgc2x1dG5pbmcgYWYgZW4gdWdlLlwiXHJcbiAgICApO1xyXG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKGAke21vbnRoTGFiZWx9ICR7Zm9jdXNlZFllYXJ9YCk7XHJcbiAgfVxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gc3RhdHVzZXMuam9pbihcIi4gXCIpO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c01vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZE1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhciBvZiBhIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGlkZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGNhbGVuZGFyRWwsIHN0YXR1c0VsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QucmVtb3ZlKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XHJcbiAgY2FsZW5kYXJFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSBkYXRlIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBjYWxlbmRhckRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0RGF0ZSA9IChjYWxlbmRhckRhdGVFbCkgPT4ge1xyXG4gIGlmIChjYWxlbmRhckRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGNhbGVuZGFyRGF0ZUVsXHJcbiAgKTtcclxuICBzZXRDYWxlbmRhclZhbHVlKGNhbGVuZGFyRGF0ZUVsLCBjYWxlbmRhckRhdGVFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcclxuXHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBpZiAoY2FsZW5kYXJFbC5oaWRkZW4pIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoXHJcbiAgICAgIGlucHV0RGF0ZSB8fCBkZWZhdWx0RGF0ZSB8fCB0b2RheSgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG4gICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoaWRlQ2FsZW5kYXIoZWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIGNhbGVuZGFyIHdoZW4gdmlzaWJsZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqL1xyXG5jb25zdCB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgY2FsZW5kYXJTaG93biA9ICFjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgaWYgKGNhbGVuZGFyU2hvd24gJiYgaW5wdXREYXRlKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU1vbnRoU2VsZWN0aW9uID0gKGVsLCBtb250aFRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBjYWxlbmRhckRhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBtb250aFRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRNb250aCA6IG1vbnRoVG9EaXNwbGF5O1xyXG5cclxuICBjb25zdCBtb250aHMgPSBNT05USF9MQUJFTFMubWFwKChtb250aCwgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoVG9DaGVjayA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgaW5kZXgpO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIG1vbnRoVG9DaGVjayxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9NT05USF9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkTW9udGg7XHJcblxyXG4gICAgaWYgKGluZGV4ID09PSBmb2N1c2VkTW9udGgpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke2luZGV4fVwiXHJcbiAgICAgICAgZGF0YS1sYWJlbD1cIiR7bW9udGh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke21vbnRofTwvYnV0dG9uPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoc0h0bWwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgICAgICAgJHtsaXN0VG9HcmlkSHRtbChtb250aHMsIDMpfVxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5gO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gbW9udGhzSHRtbDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBhIG1vbnRoLlwiO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgbW9udGggaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBtb250aEVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyVG9EaXNwbGF5IHllYXIgdG8gZGlzcGxheSBpbiB5ZWFyIHNlbGVjdGlvblxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVllYXJTZWxlY3Rpb24gPSAoZWwsIHllYXJUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBjYWxlbmRhckRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XHJcblxyXG4gIGxldCB5ZWFyVG9DaHVuayA9IGZvY3VzZWRZZWFyO1xyXG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcclxuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcclxuXHJcbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeWVhcnMgPSBbXTtcclxuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XHJcbiAgd2hpbGUgKHllYXJzLmxlbmd0aCA8IFlFQVJfQ0hVTkspIHtcclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfWUVBUl9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XHJcblxyXG4gICAgaWYgKHllYXJJbmRleCA9PT0gZm9jdXNlZFllYXIpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHllYXJzLnB1c2goXHJcbiAgICAgIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxyXG4gICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7eWVhckluZGV4fTwvYnV0dG9uPmBcclxuICAgICk7XHJcbiAgICB5ZWFySW5kZXggKz0gMTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHllYXJzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKHllYXJzLCAzKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIHRpbGJhZ2VcIlxyXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cclxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgJHtZRUFSX0NIVU5LfSDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICAgICAke25leHRZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IGBTaG93aW5nIHllYXJzICR7eWVhclRvQ2h1bmt9IHRvICR7XHJcbiAgICB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxXHJcbiAgfS4gU2VsZWN0IGEgeWVhci5gO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyIC0gWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyICsgWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgeWVhciBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB5ZWFyRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdFllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIHllYXJFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmlubmVySFRNTCwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0RGF0ZUZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBldmVudC50YXJnZXRcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgY2FwcGVkRGF0ZSk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YldlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGREYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogZGlzcGxheSB0aGUgY2FsZW5kYXIgZm9yIHRoZSBtb3VzZW1vdmUgZGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xyXG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xyXG5cclxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBwYXJzZURhdGVTdHJpbmcoaG92ZXJEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdE1vbnRoRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBtb250aFxyXG4gKi9cclxuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIG1vbnRoRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xyXG4gICAgYWRqdXN0ZWRNb250aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDExLCBhZGp1c3RlZE1vbnRoKSk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMTEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBmaXJzdCBtb250aCAoSmFudWFyeSkgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24obW9udGhFbCwgZm9jdXNNb250aCk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHllYXJFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIHllYXJFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xyXG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVZZWFyKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgMiAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHllYXJFbCwgZm9jdXNZZWFyKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcclxuICBjb25zdCBnZXRGb2N1c2FibGVDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XHJcblxyXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XHJcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZmlyc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xyXG5cclxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNOb3RGb3VuZCA9IGZvY3VzSW5kZXggPT09IC0xO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICBpc05vdEZvdW5kLFxyXG4gICAgICBmaXJzdFRhYlN0b3AsXHJcbiAgICAgIGlzRmlyc3RUYWIsXHJcbiAgICAgIGxhc3RUYWJTdG9wLFxyXG4gICAgICBpc0xhc3RUYWIsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0YWJBaGVhZChldmVudCkge1xyXG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzTGFzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRhYkJhY2soZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBsYXN0VGFiU3RvcCwgaXNGaXJzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKERBVEVfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcclxuXHJcbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XHJcbiAgW0NMSUNLXToge1xyXG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XHJcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcclxuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXl1cDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlkb3duID0gdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlO1xyXG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleWRvd246IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcclxuICAgICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbURhdGUsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21Nb250aCxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5TWFwID0ga2V5bWFwKHtcclxuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBrZXlNYXAoZXZlbnQpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGZvY3Vzb3V0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xyXG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcclxuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcclxuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcclxuICAgIFtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGF0ZVBpY2tlciA9IGJlaGF2aW9yKGRhdGVQaWNrZXJFdmVudHMsIHtcclxuICBpbml0KHJvb3QpIHtcclxuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XHJcbiAgICAgIGlmKCFkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKSl7XHJcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXREYXRlUGlja2VyQ29udGV4dCxcclxuICBkaXNhYmxlLFxyXG4gIGVuYWJsZSxcclxuICBpc0RhdGVJbnB1dEludmFsaWQsXHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZSxcclxuICB2YWxpZGF0ZURhdGVJbnB1dCxcclxuICByZW5kZXJDYWxlbmRhcixcclxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSxcclxufSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gc29ydGluZyB2YXJpYW50IG9mIE92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAub3ZlcmZsb3ctbWVudSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBEcm9wZG93blNvcnQgKGNvbnRhaW5lcil7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIHRoaXMuYnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF07XHJcblxyXG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQsIGNob29zZSBmaXJzdCBvcHRpb25cclxuICAgIGlmKCF0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpKXtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaScpWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBjbGljayBldmVudHMgb24gb3ZlcmZsb3cgbWVudSBhbmQgb3B0aW9ucyBpbiBtZW51XHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5vdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24odGhpcy5idXR0b24pLmluaXQoKTtcclxuXHJcbiAgICBsZXQgc29ydGluZ09wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKTtcclxuICAgIGZvcihsZXQgcyA9IDA7IHMgPCBzb3J0aW5nT3B0aW9ucy5sZW5ndGg7IHMrKyl7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IHNvcnRpbmdPcHRpb25zW3NdO1xyXG4gICAgICAgIG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25PcHRpb25DbGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBidXR0b24gdGV4dCB0byBzZWxlY3RlZCB2YWx1ZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS51cGRhdGVTZWxlY3RlZFZhbHVlID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZC12YWx1ZScpWzBdLmlubmVyVGV4dCA9IHNlbGVjdGVkSXRlbS5pbm5lclRleHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmlnZ2VycyB3aGVuIGNob29zaW5nIG9wdGlvbiBpbiBtZW51XHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLm9uT3B0aW9uQ2xpY2sgPSBmdW5jdGlvbihlKXtcclxuICAgIGxldCBsaSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICBsaS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2xpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XHJcbiAgICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBidXR0b24gPSBsaS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG4gICAgbGV0IGV2ZW50U2VsZWN0ZWQgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5zZWxlY3RlZCcpO1xyXG4gICAgZXZlbnRTZWxlY3RlZC5kZXRhaWwgPSB0aGlzLnRhcmdldDtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50U2VsZWN0ZWQpO1xyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcblxyXG4gICAgLy8gaGlkZSBtZW51XHJcbiAgICBsZXQgb3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKGJ1dHRvbik7XHJcbiAgICBvdmVyZmxvd01lbnUuaGlkZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xyXG5jb25zdCBCVVRUT04gPSAnLmpzLWRyb3Bkb3duJztcclxuY29uc3QganNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIgPSAnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnOyAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gb3ZlcmZsb3cgbWVudSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uRWxlbWVudCBPdmVyZmxvdyBtZW51IGJ1dHRvblxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd24gKGJ1dHRvbkVsZW1lbnQpIHtcclxuICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtZW50O1xyXG4gIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG4gIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ID09PSBudWxsIHx8dGhpcy5idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBidXR0b24gZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50LmApO1xyXG4gIH1cclxuICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMuYnV0dG9uRWxlbWVudC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICBpZih0YXJnZXRBdHRyID09PSBudWxsIHx8IHRhcmdldEF0dHIgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSBjb3VsZCBub3QgYmUgZm91bmQgb24gb3ZlcmZsb3cgbWVudSBjb21wb25lbnQ6ICcrVEFSR0VUKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGFuZWwgZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50IGNvdWxkIG5vdCBiZSBmb3VuZC4nKTtcclxuICB9XHJcbiAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGNsaWNrIGV2ZW50c1xyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5idXR0b25FbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG5cclxuICAgIGlmKHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIGxldCAkbW9kdWxlID0gdGhpcztcclxuICAgIC8vIHNldCBhcmlhLWhpZGRlbiBjb3JyZWN0bHkgZm9yIHNjcmVlbnJlYWRlcnMgKFRyaW5ndWlkZSByZXNwb25zaXZlKVxyXG4gICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xyXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuYnV0dG9uRWxlbWVudDtcclxuICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XHJcbiAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XHJcbiAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxyXG4gICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoJG1vZHVsZS50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcclxuICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UoJG1vZHVsZS50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cclxuICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcclxuICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICBjbG9zZUFsbChlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGlkZSBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gQXJyYXkgb2YgYnV0dG9uIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogYWNjb3JkaW9uIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBwYXJlbnQgYWNjb3JkaW9uIGVsZW1lbnRcclxuICogQHJldHVybnMge05vZGVMaXN0T2Y8U1ZHRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEVsZW1lbnQ+fVxyXG4gKi9cclxubGV0IGdldEJ1dHRvbnMgPSBmdW5jdGlvbiAocGFyZW50KSB7XHJcbiAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIG92ZXJmbG93IG1lbnVzXHJcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IGRlZmF1bHQgaXMgbnVsbFxyXG4gKi9cclxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XHJcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xyXG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xyXG4gICAgbGV0IHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwpe1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSl7XHJcbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKGNoYW5nZWQgJiYgZXZlbnQgIT09IG51bGwpe1xyXG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG59O1xyXG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoZXZlbnQsIGZvcmNlQ2xvc2UgPSBmYWxzZSkge1xyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIHRvZ2dsZSh0aGlzLCBmb3JjZUNsb3NlKTtcclxuXHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlID0gZnVuY3Rpb24oYnV0dG9uLCBmb3JjZUNsb3NlID0gZmFsc2Upe1xyXG4gIGxldCB0cmlnZ2VyRWwgPSBidXR0b247XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuXHJcbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcclxuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcclxuXHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICBcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBcclxuICAgICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcclxuICAgICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vb3BlblxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLm9wZW4nKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZih0YXJnZXRPZmZzZXQubGVmdCA8IDApe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgcmlnaHQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBvZmZzZXRBZ2FpbiA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZihvZmZzZXRBZ2Fpbi5sZWZ0IDwgMCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcbmxldCBoYXNQYXJlbnQgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudFRhZ05hbWUpe1xyXG4gIGlmKGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gcGFyZW50VGFnTmFtZSl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2UgaWYocGFyZW50VGFnTmFtZSAhPT0gJ0JPRFknICYmIGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKXtcclxuICAgIHJldHVybiBoYXNQYXJlbnQoY2hpbGQucGFyZW50Tm9kZSwgcGFyZW50VGFnTmFtZSk7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IG91dHNpZGVDbG9zZSA9IGZ1bmN0aW9uIChldnQpe1xyXG4gIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24tbWVudS1jbG9zZScpKSB7XHJcbiAgICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWRyb3Bkb3duW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0nKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuRHJvcGRvd25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXJFbCA9IG9wZW5Ecm9wZG93bnNbaV07XHJcbiAgICAgICAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICAgICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgICAgICBpZiAodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmKHRhcmdldEF0dHIuaW5kZXhPZignIycpICE9PSAtMSl7XHJcbiAgICAgICAgICAgIHRhcmdldEF0dHIgPSB0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSB8fCAoaGFzUGFyZW50KHRyaWdnZXJFbCwgJ0hFQURFUicpICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmxheScpKSkge1xyXG4gICAgICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGVcclxuICAgICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcclxuICAgICAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmxldCBkb1Jlc3BvbnNpdmVDb2xsYXBzZSA9IGZ1bmN0aW9uICh0cmlnZ2VyRWwpe1xyXG4gIGlmKCF0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyKSl7XHJcbiAgICAvLyBub3QgbmF2IG92ZXJmbG93IG1lbnVcclxuICAgIGlmKHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKSB7XHJcbiAgICAgIC8vIHRyaW5pbmRpa2F0b3Igb3ZlcmZsb3cgbWVudVxyXG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCh0cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgLy8gb3ZlcmZsb3cgbWVudSBww6UgcmVzcG9uc2l2IHRyaW5ndWlkZSBha3RpdmVyZXRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNle1xyXG4gICAgICAvLyBub3JtYWwgb3ZlcmZsb3cgbWVudVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmxldCBnZXRUcmluZ3VpZGVCcmVha3BvaW50ID0gZnVuY3Rpb24gKGJ1dHRvbil7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLm1kO1xyXG4gIH1cclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubGc7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd247IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogSGFuZGxlIGZvY3VzIG9uIGlucHV0IGVsZW1lbnRzIHVwb24gY2xpY2tpbmcgbGluayBpbiBlcnJvciBtZXNzYWdlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRXJyb3Igc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBFcnJvclN1bW1hcnkgKGVsZW1lbnQpIHtcclxuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGxpbmtzIGluIGVycm9yIHN1bW1hcnlcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHRoaXMuZWxlbWVudC5mb2N1cygpXHJcblxyXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcclxufVxyXG5cclxuLyoqXHJcbiogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qXHJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XHJcbiovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XHJcbiAgaWYgKHRoaXMuZm9jdXNUYXJnZXQodGFyZ2V0KSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXHJcbiAqIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlIHByZXNlbnRlZCB3aXRoXHJcbiAqIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZSBvZmYgdGhlIHRvcCBvZlxyXG4gKiB0aGUgc2NyZWVuLlxyXG4gKlxyXG4gKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZCB0aGVuXHJcbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cclxuICpcclxuICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxyXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXHJcbiAqIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcclxuICAvLyBJZiB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkIHdhcyBub3QgYSBsaW5rLCByZXR1cm4gZWFybHlcclxuICBpZiAoJHRhcmdldC50YWdOYW1lICE9PSAnQScgfHwgJHRhcmdldC5ocmVmID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcclxuICB2YXIgJGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZClcclxuICBpZiAoISRpbnB1dCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcclxuICBpZiAoISRsZWdlbmRPckxhYmVsKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dCB0b1xyXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxyXG4gIC8vIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXHJcbiAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxyXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxyXG4gKlxyXG4gKiBFeHRyYWN0IHRoZSBmcmFnbWVudCAoZXZlcnl0aGluZyBhZnRlciB0aGUgaGFzaCkgZnJvbSBhIFVSTCwgYnV0IG5vdCBpbmNsdWRpbmdcclxuICogdGhlIGhhc2guXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkxcclxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXJsLnNwbGl0KCcjJykucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbFxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgZXhpc3RzIGZyb20gdGhpcyBsaXN0OlxyXG4gKlxyXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcclxuICogICBhcyB0aGUgdG9wIG9mIGl0IGlzIG5vIG1vcmUgdGhhbiBoYWxmIGEgdmlld3BvcnQgaGVpZ2h0IGF3YXkgZnJvbSB0aGVcclxuICogICBib3R0b20gb2YgdGhlIGlucHV0XHJcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXHJcbiAqIC0gVGhlIGNsb3Nlc3QgcGFyZW50IGA8bGFiZWw+YFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBBc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCwgb3IgbnVsbCBpZiBubyBhc3NvY2lhdGVkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kIG9yIGxhYmVsIGNhbiBiZSBmb3VuZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcclxuICB2YXIgJGZpZWxkc2V0ID0gJGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0JylcclxuXHJcbiAgaWYgKCRmaWVsZHNldCkge1xyXG4gICAgdmFyIGxlZ2VuZHMgPSAkZmllbGRzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xlZ2VuZCcpXHJcblxyXG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkY2FuZGlkYXRlTGVnZW5kID0gbGVnZW5kc1swXVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGlucHV0IHR5cGUgaXMgcmFkaW8gb3IgY2hlY2tib3gsIGFsd2F5cyB1c2UgdGhlIGxlZ2VuZCBpZiB0aGVyZVxyXG4gICAgICAvLyBpcyBvbmUuXHJcbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZvciBvdGhlciBpbnB1dCB0eXBlcywgb25seSBzY3JvbGwgdG8gdGhlIGZpZWxkc2V04oCZcyBsZWdlbmQgKGluc3RlYWQgb2ZcclxuICAgICAgLy8gdGhlIGxhYmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQpIGlmIHRoZSBpbnB1dCB3b3VsZCBlbmQgdXAgaW4gdGhlXHJcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGlucHV0IGVpdGhlciBlbmRzIHVwIG9mZiB0aGVcclxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxyXG4gICAgICB2YXIgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcclxuICAgICAgdmFyIGlucHV0UmVjdCA9ICRpbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxyXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB2YXIgaW5wdXRCb3R0b20gPSBpbnB1dFJlY3QudG9wICsgaW5wdXRSZWN0LmhlaWdodFxyXG5cclxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFtmb3I9J1wiICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSArIFwiJ11cIikgfHxcclxuICAgICRpbnB1dC5jbG9zZXN0KCdsYWJlbCcpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVycm9yU3VtbWFyeTsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gbW9kYWxcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJG1vZGFsIE1vZGFsIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpIHtcclxuICAgIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdGhpcy50cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZT1cIm1vZGFsXCJdW2RhdGEtdGFyZ2V0PVwiJytpZCsnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuXHJcbiAgICBpZighaGFzRm9yY2VkQWN0aW9uKG1vZGFsRWxlbWVudCkpe1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgICB9XHJcbiAgICBsZXQgZGF0YU1vZGFsT3BlbmVyID0gbW9kYWxFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIGlmKGRhdGFNb2RhbE9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhTW9kYWxPcGVuZXIpXHJcbiAgICAgIGlmKG9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgICAgb3BlbmVyLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgbW9kYWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdyBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoZSA9IG51bGwpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgaWYoZSAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXJJZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgaWYob3BlbmVySWQgPT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lcklkID0gJ21vZGFsLW9wZW5lci0nK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OTk5IC0gMTAwMCArIDEpICsgMTAwMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIG9wZW5lcklkKVxyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJywgb3BlbmVySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhpZGUgb3BlbiBtb2RhbHMgLSBGRFMgZG8gbm90IHJlY29tbWVuZCBtb3JlIHRoYW4gb25lIG9wZW4gbW9kYWwgYXQgYSB0aW1lXHJcbiAgICBsZXQgYWN0aXZlTW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhY3RpdmVNb2RhbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBuZXcgTW9kYWwoYWN0aXZlTW9kYWxzW2ldKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcblxyXG4gICAgbGV0IGV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLm1vZGFsLnNob3duJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBtb2RhbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnaWQnLCBcIm1vZGFsLWJhY2tkcm9wXCIpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cclxuICAgIG1vZGFsRWxlbWVudC5mb2N1cygpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgbW9kYWwgd2hlbiBoaXR0aW5nIEVTQ1xyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgaWYgKGtleSA9PT0gMjcpe1xyXG4gICAgbGV0IHBvc3NpYmxlT3ZlcmZsb3dNZW51cyA9IG1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLW92ZXJmbG93LW1lbnVbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHBvc3NpYmxlT3ZlcmZsb3dNZW51cy5sZW5ndGggPT09IDApe1xyXG4gICAgICBjdXJyZW50TW9kYWwuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmFwIGZvY3VzIGluIG1vZGFsIHdoZW4gb3BlblxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuIGZ1bmN0aW9uIHRyYXBGb2N1cyhlKXtcclxuICB2YXIgY3VycmVudERpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgaWYoY3VycmVudERpYWxvZyAhPT0gbnVsbCl7XHJcbiAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBjdXJyZW50RGlhbG9nLnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl06bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGRldGFpbHM6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pJyk7XHJcbiAgICBcclxuICAgIHZhciBmaXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcclxuICAgIHZhciBsYXN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgIHZhciBpc1RhYlByZXNzZWQgPSAoZS5rZXkgPT09ICdUYWInIHx8IGUua2V5Q29kZSA9PT0gOSk7XHJcblxyXG4gICAgaWYgKCFpc1RhYlByZXNzZWQpIHsgXHJcbiAgICAgIHJldHVybjsgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBlLnNoaWZ0S2V5ICkgLyogc2hpZnQgKyB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtZW50KSB7XHJcbiAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIC8qIHRhYiAqLyB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gaGFzRm9yY2VkQWN0aW9uIChtb2RhbCl7XHJcbiAgaWYobW9kYWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWZvcmNlZC1hY3Rpb24nKSA9PT0gbnVsbCl7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbmNvbnN0IE5BViA9IGAubmF2YDtcclxuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcclxuY29uc3QgT1BFTkVSUyA9IGAuanMtbWVudS1vcGVuYDtcclxuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcclxuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XHJcbmNvbnN0IENMT1NFUlMgPSBgJHtDTE9TRV9CVVRUT059LCAub3ZlcmxheWA7XHJcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XHJcblxyXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbW9iaWxlX25hdi1hY3RpdmUnO1xyXG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb2JpbGUgbWVudSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5jbGFzcyBOYXZpZ2F0aW9uIHtcclxuICAvKipcclxuICAgKiBTZXQgZXZlbnRzXHJcbiAgICovXHJcbiAgaW5pdCAoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gICAgbW9iaWxlTWVudSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGV2ZW50c1xyXG4gICAqL1xyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBtb2JpbGVNZW51LCBmYWxzZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gbW9iaWxlIG1lbnVcclxuICovXHJcbmNvbnN0IG1vYmlsZU1lbnUgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgbW9iaWxlID0gZmFsc2U7XHJcbiAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xyXG4gIGZvcihsZXQgbyA9IDA7IG8gPCBvcGVuZXJzLmxlbmd0aDsgbysrKSB7XHJcbiAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShvcGVuZXJzW29dLCBudWxsKS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcclxuICAgICAgb3BlbmVyc1tvXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICAgIG1vYmlsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBtb2JpbGVcclxuICBpZihtb2JpbGUpe1xyXG4gICAgbGV0IGNsb3NlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKENMT1NFUlMpO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgY2xvc2Vyc1sgYyBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVl9MSU5LUyk7XHJcbiAgICBmb3IobGV0IG4gPSAwOyBuIDwgbmF2TGlua3MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgbmF2TGlua3NbIG4gXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcclxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAgIC8vIGNhbiBmb2N1cyBvbiB3aGF0ZXZlciB0aGV5J3ZlIGp1c3Qgc2VsZWN0ZWQuXHJcblxyXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGRyb3Bkb3duczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgICAgLy8gY2xpY2tlZCwgd2Ugd2FudCB0byBjb2xsYXBzZSB0aG9zZSBkcm9wZG93bnMuXHJcblxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgbW9iaWxlIG5hdmlnYXRpb24gbWVudSBpcyBhY3RpdmUsIHdlIHdhbnQgdG8gaGlkZSBpdC5cclxuICAgICAgICBpZiAoaXNBY3RpdmUoKSkge1xyXG4gICAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJhcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVik7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXJzW2ldKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuXHJcbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxyXG4gICAgLy8gbWVhbnMgdGhlIHVzZXIncyB2aWV3cG9ydCBoYXMgYmVlbiByZXNpemVkIHNvIHRoYXQgaXQgaXMgbm8gbG9uZ2VyXHJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XHJcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXHJcbiAgICB0b2dnbGVOYXYuY2FsbChjbG9zZXIsIGZhbHNlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlXHJcbiAqIEByZXR1cm5zIHRydWUgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlIGFuZCBmYWxzZSBpZiBub3QgYWN0aXZlXHJcbiAqL1xyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2JpbGUgbWVudSBpZiBhY3RpdmVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdHJhcENvbnRhaW5lciBcclxuICovXHJcbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xyXG5cclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gdHJhcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcclxuICBsZXQgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIDAgXTtcclxuXHJcbiAgZnVuY3Rpb24gdHJhcFRhYktleSAoZSkge1xyXG4gICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGtleSA9PT0gOSkge1xyXG5cclxuICAgICAgbGV0IGxhc3RUYWJTdG9wID0gbnVsbDtcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBsZXQgbnVtYmVyID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBudW1iZXIgLSBpIF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwICYmIGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AgPSBlbGVtZW50O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTSElGVCArIFRBQlxyXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgLy8gVEFCXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFU0NBUEVcclxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcclxuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVuYWJsZSAoKSB7XHJcbiAgICAgICAgLy8gRm9jdXMgZmlyc3QgY2hpbGRcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZWxlYXNlICgpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxubGV0IGZvY3VzVHJhcDtcclxuXHJcbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcclxuICB9XHJcbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcclxuXHJcbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcclxuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcclxuICB9KTtcclxuICBpZiAoYWN0aXZlKSB7XHJcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvY3VzVHJhcC5yZWxlYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XHJcblxyXG4gIGlmIChhY3RpdmUgJiYgY2xvc2VCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcclxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXHJcbiAgICBjbG9zZUJ1dHRvbi5mb2N1cygpO1xyXG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxyXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgZGVhY3RpdmF0ZWQsIGFuZCBmb2N1cyB3YXMgb24gdGhlIGNsb3NlXHJcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xyXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXHJcbiAgICAvLyB2aXNpYmxlICh0aGlzIG1heSBoYXZlIGJlZW4gd2hhdCB0aGUgdXNlciB3YXMganVzdCBmb2N1c2VkIG9uLFxyXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXHJcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aXZlO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRPR0dMRV9BVFRSSUJVVEUgPSAnZGF0YS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIHJhZGlvYnV0dG9uIGNvbGxhcHNlIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIFJhZGlvVG9nZ2xlR3JvdXAoY29udGFpbmVyRWxlbWVudCl7XHJcbiAgICB0aGlzLnJhZGlvR3JvdXAgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHNcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICBpZih0aGlzLnJhZGlvRWxzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByYWRpb2J1dHRvbnMgZm91bmQgaW4gcmFkaW9idXR0b24gZ3JvdXAuJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcclxuICAgICAgICBcclxuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgcmFkaW9idXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhZGlvSW5wdXRFbGVtZW50IFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50KXtcclxuICAgIHZhciBjb250ZW50SWQgPSByYWRpb0lucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICBpZihjb250ZW50SWQgIT09IG51bGwgJiYgY29udGVudElkICE9PSB1bmRlZmluZWQgJiYgY29udGVudElkICE9PSBcIlwiKXtcclxuICAgICAgICB2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRlbnRJZCk7XHJcbiAgICAgICAgaWYoY29udGVudEVsZW1lbnQgPT09IG51bGwgfHwgY29udGVudEVsZW1lbnQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfQVRUUklCVVRFKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmFkaW9JbnB1dEVsZW1lbnQuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2UocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgcmFkaW8gYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHt9IHJhZGlvSW5wdXRFbGVtZW50IFJhZGlvIElucHV0IGVsZW1lbnRcclxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uZXhwYW5kZWQnKTtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENvbGxhcHNlIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihyYWRpb0lucHV0RWxlbWVudCAhPT0gbnVsbCAmJiByYWRpb0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uY29sbGFwc2VkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmFkaW9Ub2dnbGVHcm91cDsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XHJcbiAgc2hpZnQ6IGZhbHNlLFxyXG4gIGFsdDogZmFsc2UsXHJcbiAgY3RybDogZmFsc2UsXHJcbiAgY29tbWFuZDogZmFsc2VcclxufTtcclxuLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQpe1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xyXG4gIH1cclxufVxyXG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxubGV0IGRrID0ge1xyXG4gIFwic2VsZWN0X3Jvd1wiOiBcIlbDpmxnIHLDpmtrZVwiLFxyXG4gIFwidW5zZWxlY3Rfcm93XCI6IFwiRnJhdsOmbGcgcsOma2tlXCIsXHJcbiAgXCJzZWxlY3RfYWxsX3Jvd3NcIjogXCJWw6ZsZyBhbGxlIHLDpmtrZXJcIixcclxuICBcInVuc2VsZWN0X2FsbF9yb3dzXCI6IFwiRnJhdsOmbGcgYWxsZSByw6Zra2VyXCJcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlIFRhYmxlIEVsZW1lbnRcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcInNlbGVjdF9yb3dcIjogXCJWw6ZsZyByw6Zra2VcIiwgXCJ1bnNlbGVjdF9yb3dcIjogXCJGcmF2w6ZsZyByw6Zra2VcIiwgXCJzZWxlY3RfYWxsX3Jvd3NcIjogXCJWw6ZsZyBhbGxlIHLDpmtrZXJcIiwgXCJ1bnNlbGVjdF9hbGxfcm93c1wiOiBcIkZyYXbDpmxnIGFsbGUgcsOma2tlclwifVxyXG4gKi9cclxuZnVuY3Rpb24gVGFibGVTZWxlY3RhYmxlUm93cyAodGFibGUsIHN0cmluZ3MgPSBkayl7XHJcbiAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG4gIGRrID0gc3RyaW5ncztcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZ3JvdXBDaGVja2JveCA9IHRoaXMuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0aGlzLmdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgfVxyXG59XHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXHJcbiAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNoZWNrYm94ID0gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRDaGVja2JveExpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBjaGVja2JveGVzIGluIHRhYmxlIGJvZHkgd2hlbiBncm91cCBjaGVja2JveCBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVDaGVja2JveExpc3QoZSl7XHJcbiAgbGV0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICBpZihjaGVja2JveC5jaGVja2VkKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3Rfcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2VkTnVtYmVyID0gY2hlY2tib3hMaXN0Lmxlbmd0aDtcclxuICAgIGNoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgfSBlbHNle1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X3Jvdyk7XHJcbiAgICB9XHJcbiAgICBjaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICB9KTtcclxuICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBncm91cCBjaGVja2JveCB3aGVuIGNoZWNrYm94IGluIHRhYmxlIGJvZHkgaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlR3JvdXBDaGVjayhlKXtcclxuICAvLyB1cGRhdGUgbGFiZWwgZm9yIGV2ZW50IGNoZWNrYm94XHJcbiAgaWYoZS50YXJnZXQuY2hlY2tlZCl7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3Rfcm93KTtcclxuICB9IGVsc2V7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X3Jvdyk7XHJcbiAgfVxyXG4gIGxldCB0YWJsZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XHJcbiAgbGV0IGdyb3VwQ2hlY2tib3ggPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldEdyb3VwQ2hlY2tib3goKTtcclxuICBpZihncm91cENoZWNrYm94ICE9PSBmYWxzZSl7XHJcbiAgICBsZXQgY2hlY2tib3hMaXN0ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRDaGVja2JveExpc3QoKTtcclxuXHJcbiAgICAvLyBob3cgbWFueSByb3cgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBsZXQgbG9vcGVkQ2hlY2tib3ggPSBjaGVja2JveExpc3RbY107XHJcbiAgICAgIGlmKGxvb3BlZENoZWNrYm94LmNoZWNrZWQpe1xyXG4gICAgICAgIGNoZWNrZWROdW1iZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihjaGVja2VkTnVtYmVyID09PSBjaGVja2JveExpc3QubGVuZ3RoKXsgLy8gaWYgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfSBlbHNleyAvLyBpZiBzb21lIGJ1dCBub3QgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXHJcbiAqL1xyXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xyXG4gICAgY29uc3RydWN0b3IgKHRhYmxlKSB7XHJcbiAgICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlRWwgVGFibGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcclxuICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xyXG4gIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcclxuICAgIGxldCBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XHJcbiAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XHJcbiAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcclxuICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cclxuICAgICAgICAgICAgaWYoIWNlbGxFbHNbIGkgXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSApe1xyXG4gICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZVRhYmxlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuXHJcbi8vIEZvciBlYXN5IHJlZmVyZW5jZVxyXG52YXIga2V5cyA9IHtcclxuICBlbmQ6IDM1LFxyXG4gIGhvbWU6IDM2LFxyXG4gIGxlZnQ6IDM3LFxyXG4gIHVwOiAzOCxcclxuICByaWdodDogMzksXHJcbiAgZG93bjogNDAsXHJcbiAgZGVsZXRlOiA0NlxyXG59O1xyXG5cclxuLy8gQWRkIG9yIHN1YnN0cmFjdCBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxudmFyIGRpcmVjdGlvbiA9IHtcclxuICAzNzogLTEsXHJcbiAgMzg6IC0xLFxyXG4gIDM5OiAxLFxyXG4gIDQwOiAxXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YWJuYXYgVGFibmF2IGNvbnRhaW5lclxyXG4gKi9cclxuZnVuY3Rpb24gVGFibmF2ICh0YWJuYXYpIHtcclxuICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcclxuICB0aGlzLnRhYnMgPSB0aGlzLnRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudCBvbiBjb21wb25lbnRcclxuICovXHJcblRhYm5hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgaWYodGhpcy50YWJzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRhYm5hdiBIVE1MIHNlZW1zIHRvIGJlIG1pc3NpbmcgdGFibmF2LWl0ZW0uIEFkZCB0YWJuYXYgaXRlbXMgdG8gZW5zdXJlIGVhY2ggcGFuZWwgaGFzIGEgYnV0dG9uIGluIHRoZSB0YWJuYXZzIG5hdmlnYXRpb24uYCk7XHJcbiAgfVxyXG5cclxuICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gIGlmICghc2V0QWN0aXZlSGFzaFRhYigpKSB7XHJcbiAgICAvLyBzZXQgZmlyc3QgdGFiIGFzIGFjdGl2ZVxyXG4gICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgIC8vIGNoZWNrIG5vIG90aGVyIHRhYnMgYXMgYmVlbiBzZXQgYXQgZGVmYXVsdFxyXG4gICAgbGV0IGFscmVhZHlBY3RpdmUgPSBnZXRBY3RpdmVUYWJzKHRoaXMudGFibmF2KTtcclxuICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0YWIgPSBhbHJlYWR5QWN0aXZlWyAwIF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgdGhpcy5hY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICB9XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzO1xyXG4gIC8vIGFkZCBldmVudGxpc3RlbmVycyBvbiBidXR0b25zXHJcbiAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpeyRtb2R1bGUuYWN0aXZhdGVUYWIodGhpcywgZmFsc2UpfSk7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkV2ZW50TGlzdGVuZXIpO1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cEV2ZW50TGlzdGVuZXIpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqKlxyXG4gKiBTaG93IHRhYiBhbmQgaGlkZSBvdGhlcnNcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIGJ1dHRvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2V0Rm9jdXMgVHJ1ZSBpZiB0YWIgYnV0dG9uIHNob3VsZCBiZSBmb2N1c2VkXHJcbiAqL1xyXG4gVGFibmF2LnByb3RvdHlwZS5hY3RpdmF0ZVRhYiA9IGZ1bmN0aW9uKHRhYiwgc2V0Rm9jdXMpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuXHJcbiAgLy8gY2xvc2UgYWxsIHRhYnMgZXhjZXB0IHNlbGVjdGVkXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0YWJzWyBpIF0gPT09IHRhYikge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2xvc2UnKTtcclxuICAgICAgdGFic1sgaSBdLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIHRhYnNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgIGxldCB0YWJwYW5lbElEID0gdGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcclxuICAgIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YWJwYW5lbC5gKTtcclxuICAgIH1cclxuICAgIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gIH1cclxuICBcclxuICAvLyBTZXQgc2VsZWN0ZWQgdGFiIHRvIGFjdGl2ZVxyXG4gIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpO1xyXG4gIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uIHBhbmVsLmApO1xyXG4gIH1cclxuXHJcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XHJcbiAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gIHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XHJcblxyXG4gIC8vIFNldCBmb2N1cyB3aGVuIHJlcXVpcmVkXHJcbiAgaWYgKHNldEZvY3VzKSB7XHJcbiAgICB0YWIuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIGxldCBldmVudENoYW5nZWQgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2hhbmdlZCcpO1xyXG4gIHRhYi5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQoZXZlbnRDaGFuZ2VkKTtcclxuXHJcbiAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5vcGVuJyk7XHJcbiAgdGFiLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXlkb3duIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXlkb3duRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2Uga2V5cy5lbmQ6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGxhc3QgdGFiXHJcbiAgICAgIGZvY3VzTGFzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5ob21lOlxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWJcclxuICAgICAgZm9jdXNGaXJzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIC8vIFVwIGFuZCBkb3duIGFyZSBpbiBrZXlkb3duXHJcbiAgICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gcHJldmVudCBwYWdlIHNjcm9sbCA+OilcclxuICAgIGNhc2Uga2V5cy51cDpcclxuICAgIGNhc2Uga2V5cy5kb3duOlxyXG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXl1cCBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxuZnVuY3Rpb24ga2V5dXBFdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmxlZnQ6XHJcbiAgICBjYXNlIGtleXMucmlnaHQ6XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuZGVsZXRlOlxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5lbnRlcjpcclxuICAgIGNhc2Uga2V5cy5zcGFjZTpcclxuICAgICAgbmV3IFRhYm5hdihldmVudC50YXJnZXQucGFyZW50Tm9kZSkuYWN0aXZhdGVUYWIoZXZlbnQudGFyZ2V0LCB0cnVlKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbiAqIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4gKiBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGRldGVybWluZU9yaWVudGF0aW9uIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBsZXQgdz13aW5kb3csXHJcbiAgICBkPWRvY3VtZW50LFxyXG4gICAgZT1kLmRvY3VtZW50RWxlbWVudCxcclxuICAgIGc9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0sXHJcbiAgICB4PXcuaW5uZXJXaWR0aHx8ZS5jbGllbnRXaWR0aHx8Zy5jbGllbnRXaWR0aCxcclxuICAgIHk9dy5pbm5lckhlaWdodHx8ZS5jbGllbnRIZWlnaHR8fGcuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBsZXQgdmVydGljYWwgPSB4IDwgYnJlYWtwb2ludHMubWQ7XHJcbiAgbGV0IHByb2NlZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKHZlcnRpY2FsKSB7XHJcbiAgICBpZiAoa2V5ID09PSBrZXlzLnVwIHx8IGtleSA9PT0ga2V5cy5kb3duKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMubGVmdCB8fCBrZXkgPT09IGtleXMucmlnaHQpIHtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChwcm9jZWVkKSB7XHJcbiAgICBzd2l0Y2hUYWJPbkFycm93UHJlc3MoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVpdGhlciBmb2N1cyB0aGUgbmV4dCwgcHJldmlvdXMsIGZpcnN0LCBvciBsYXN0IHRhYlxyXG4gKiBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxuICovXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgaW5kZXggb2YgZWxlbWVudCBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTENvbGxlY3Rpb259IGxpc3QgXHJcbiAqIEByZXR1cm5zIHtpbmRleH1cclxuICovXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZmlyc3QgdGFiIGJ5IHRhYiBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzRmlyc3RUYWIgKHRhYikge1xyXG4gIGdldEFsbFRhYnNJbkxpc3QodGFiKVsgMCBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgbGFzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJuYXY7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2hvdy9oaWRlIHRvYXN0IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gVG9hc3QgKGVsZW1lbnQpe1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvd2luZycpO1xyXG4gICAgdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RvYXN0LWNsb3NlJylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgIG5ldyBUb2FzdCh0b2FzdCkuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpOyAgICAgICAgIFxyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBjbGFzc2VzIHRvIG1ha2Ugc2hvdyBhbmltYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHNob3dUb2FzdCgpe1xyXG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XHJcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdG9hc3RzLmxlbmd0aDsgdCsrKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0b2FzdHNbdF07XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVG9hc3Q7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2V0IHRvb2x0aXAgb24gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggaGFzIHRvb2x0aXBcclxuICovXHJcbmZ1bmN0aW9uIFRvb2x0aXAoZWxlbWVudCl7XHJcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRvb2x0aXAgdGV4dCBpcyBtaXNzaW5nLiBBZGQgYXR0cmlidXRlIGRhdGEtdG9vbHRpcCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHRvb2x0aXAgYXMgdmFsdWUuYCk7XHJcbiAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnNcclxuICovXHJcblRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgXHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSl7XHJcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuXHJcbiAgICAgICAgICB2YXIgdG9vbHRpcCA9IGNyZWF0ZVRvb2x0aXAoZWxlbWVudCwgcG9zKTtcclxuXHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICAgIHBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwMCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsZXQgdHJpZ2dlciA9IHRoaXM7XHJcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICBpZighdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKXtcclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuICAgICAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcbiAgICAgIHBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gIGlmKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC10cmlnZ2VyJykgPT09ICdjbGljaycpe1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBwb3MgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcbiAgICAgICAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuICAgICAgICBwb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKXtcclxuICAgICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtY29udGVudCcpKSB7XHJcbiAgICAgIGNsb3NlQWxsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIHRvb2x0aXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZUFsbCAoKXtcclxuICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHBvcHBlciA9IGVsZW1lbnRzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBlbGVtZW50c1sgaSBdLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICB9XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZSB0b29sdGlwIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIHRoZSB0b29sdGlwIGlzIGF0dGFjaGVkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3MgUG9zaXRpb24gb2YgdG9vbHRpcCAodG9wIHwgYm90dG9tKVxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xyXG4gIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xyXG4gIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcclxuICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICB2YXIgdG9vbHRpcElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBBcnJvdy5jbGFzc05hbWUgPSAndG9vbHRpcC1hcnJvdyc7XHJcbiAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBDb250ZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwLWNvbnRlbnQnO1xyXG4gIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gIHRvb2x0aXAuYXBwZW5kQ2hpbGQodG9vbHRpcElubmVyKTtcclxuXHJcbiAgcmV0dXJuIHRvb2x0aXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cclxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcG9zaXRpb25BdCAocGFyZW50LCB0b29sdGlwLCBwb3MpIHtcclxuICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICBsZXQgYXJyb3cgPSB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXTtcclxuICBsZXQgdHJpZ2dlclBvc2l0aW9uID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIFxyXG4gIHZhciBwYXJlbnRDb29yZHMgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGxlZnQsIHRvcDtcclxuXHJcbiAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gIHZhciBkaXN0ID0gMTI7XHJcbiAgbGV0IGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XHJcbiAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcclxuXHJcbiAgc3dpdGNoIChwb3MpIHtcclxuICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICBjYXNlICd0b3AnOlxyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICB9XHJcblxyXG4gIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICBpZihsZWZ0IDwgMCkge1xyXG4gICAgbGVmdCA9IGRpc3Q7XHJcbiAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgIGxldCBhcnJvd0xlZnRQb3NpdGlvbiA9IGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbisncHgnO1xyXG4gIH1cclxuXHJcbiAgLy8gXHJcbiAgaWYoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG4gICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICB9XHJcbiAgXHJcbiAgaWYodG9wIDwgMCkge1xyXG4gICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgfVxyXG4gIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKXtcclxuICAgIHRvb2x0aXAuc3R5bGUucmlnaHQgPSBkaXN0ICsgJ3B4JztcclxuICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgIGxldCBhcnJvd1JpZ2h0UG9zaXRpb24gPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uKydweCc7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICB9XHJcbiAgdG9vbHRpcC5zdHlsZS50b3AgID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xyXG4gIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLmNsYXNzTGlzdC5hZGQoYXJyb3dEaXJlY3Rpb24pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBwcmVmaXg6ICcnLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICcuL2NvbXBvbmVudHMvYWxlcnQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG4vKipcclxuICogSW5pdCBhbGwgY29tcG9uZW50c1xyXG4gKiBAcGFyYW0ge0pTT059IG9wdGlvbnMge3Njb3BlOiBIVE1MRWxlbWVudH0gLSBJbml0IGFsbCBjb21wb25lbnRzIHdpdGhpbiBzY29wZSAoZGVmYXVsdCBpcyBkb2N1bWVudClcclxuICovXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBY2NvcmRpb25zXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWxlcnRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYWxlcnRzV2l0aENsb3NlQnV0dG9uID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFsZXJ0Lmhhcy1jbG9zZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBhbGVydHNXaXRoQ2xvc2VCdXR0b24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hlY2tib3ggY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93bi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd24oanNTZWxlY3RvckRyb3Bkb3duWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudSBzb3J0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudS0tc29ydCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93blNvcnQoanNTZWxlY3RvckRyb3Bkb3duU29ydFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIERhdGVwaWNrZXJcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGRhdGVQaWNrZXIub24oc2NvcGUpO1xyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRXJyb3Igc3VtbWFyeVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgdmFyICRlcnJvclN1bW1hcnkgPSBzY29wZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb2R1bGU9XCJlcnJvci1zdW1tYXJ5XCJdJyk7XHJcbiAgbmV3IEVycm9yU3VtbWFyeSgkZXJyb3JTdW1tYXJ5KS5pbml0KCk7XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgSW5wdXQgUmVnZXggLSB1c2VkIG9uIGRhdGUgZmllbGRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IElucHV0UmVnZXhNYXNrKGpzU2VsZWN0b3JSZWdleFsgYyBdKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTW9kYWxcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IG1vZGFscyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWwnKTtcclxuICBmb3IobGV0IGQgPSAwOyBkIDwgbW9kYWxzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICBuZXcgTW9kYWwobW9kYWxzW2RdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTmF2aWdhdGlvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgbmV3IE5hdmlnYXRpb24oKS5pbml0KCk7XHJcbiAgIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmFkaW9idXR0b24gZ3JvdXAgY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmVzcG9uc2l2ZSB0YWJsZXNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcclxuXHJcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXHJcbiAgdmFyIGRldGVjdCA9ICdiaW5kJyBpbiBGdW5jdGlvbi5wcm90b3R5cGVcclxuXHJcbiAgaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4gIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmZmxhZ3M9YWx3YXlzXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAvLyBhZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xyXG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbiAgICAgICAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcclxuICAgICAgICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xyXG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3NsaWNlID0gQXJyYXlQcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xyXG4gICAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXHJcblxyXG4gICAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cclxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cclxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcclxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cclxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXHJcbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxyXG4gICAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxyXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXHJcbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjMuXHJcbiAgICAgICAgICB2YXIgYm91bmQ7XHJcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXHJcbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxyXG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cclxuICAgICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXHJcbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXHJcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXHJcbiAgICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxyXG5cclxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cclxuICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcclxuICAgICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xyXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXHJcbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcclxuICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxyXG4gICAgICAgICAgLy8gICBmYWxzZS5cclxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxyXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcclxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxyXG4gICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcclxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cclxuXHJcbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXHJcbiAgICAgICAgICByZXR1cm4gYm91bmQ7XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XHJcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuXHJcbi8vIERldGVjdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9PYmplY3QvZGVmaW5lUHJvcGVydHkvZGV0ZWN0LmpzXHJcbnZhciBkZXRlY3QgPSAoXHJcbiAgLy8gSW4gSUU4LCBkZWZpbmVQcm9wZXJ0eSBjb3VsZCBvbmx5IGFjdCBvbiBET00gZWxlbWVudHMsIHNvIGZ1bGwgc3VwcG9ydFxyXG4gIC8vIGZvciB0aGUgZmVhdHVyZSByZXF1aXJlcyB0aGUgYWJpbGl0eSB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBhcmJpdHJhcnkgb2JqZWN0XHJcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xyXG4gIFx0dHJ5IHtcclxuICBcdFx0dmFyIGEgPSB7fTtcclxuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XHJcbiAgXHRcdHJldHVybiB0cnVlO1xyXG4gIFx0fSBjYXRjaChlKSB7XHJcbiAgXHRcdHJldHVybiBmYWxzZVxyXG4gIFx0fVxyXG4gIH0oKSlcclxuKVxyXG5cclxuaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSZmbGFncz1hbHdheXNcclxuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xyXG5cclxuXHR2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2RlZmluZUdldHRlcl9fJyk7XHJcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcclxuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblxyXG5cdFx0Ly8gV2hlcmUgbmF0aXZlIHN1cHBvcnQgZXhpc3RzLCBhc3N1bWUgaXRcclxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShkZXNjcmlwdG9yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XHJcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcclxuXHRcdHZhciBnZXR0ZXJUeXBlID0gJ2dldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5nZXQ7XHJcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLmdldFxyXG5cdFx0aWYgKGdldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdHZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxyXG5cdFx0aWYgKHNldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKHNldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3Iuc2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPSyB0byBkZWZpbmUgdmFsdWUgdW5jb25kaXRpb25hbGx5IC0gaWYgYSBnZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkIGFzIHdlbGwsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBhYm92ZVxyXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH07XHJcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgX3BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgZGV0YWlsOiBudWxsLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxyXG4gICAgICBldmVudCxcclxuICAgICAgcGFyYW1zLmJ1YmJsZXMsXHJcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxyXG4gICAgICBwYXJhbXMuZGV0YWlsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxuLy8gcG9seWZpbGxzIE51bWJlci5pc05hTigpXHJcbnJlcXVpcmUoXCIuL251bWJlci1pcy1uYW5cIik7XHJcblxyXG4vLyBwb2x5ZmlsbHMgQ3VzdG9tRXZlbnRcclxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIk51bWJlci5pc05hTiA9XHJcbiAgTnVtYmVyLmlzTmFOIHx8XHJcbiAgZnVuY3Rpb24gaXNOYU4oaW5wdXQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcclxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xyXG4gIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGh0bWxEb2N1bWVudCA9IGRvY3VtZW50KSA9PiBodG1sRG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XHJcbmNvbnN0IHJlY2VwdG9yID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHNlcSBhbiBhcnJheSBvZiBmdW5jdGlvbnNcclxuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcclxuICovXHJcbi8vIFdlIHVzZSBhIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIGluaGVyaXQgaXRzIGxleGljYWwgc2NvcGVcclxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXHJcbmNvbnN0IHNlcXVlbmNlID0gKC4uLnNlcSkgPT5cclxuICBmdW5jdGlvbiBjYWxsSG9va3ModGFyZ2V0ID0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PlxyXG4gIHJlY2VwdG9yLmJlaGF2aW9yKFxyXG4gICAgZXZlbnRzLFxyXG4gICAgYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcclxuICAgICAgICBvZmY6IHNlcXVlbmNlKFwidGVhcmRvd25cIiwgXCJyZW1vdmVcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BzXHJcbiAgICApXHJcbiAgKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxyXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxyXG4gICAgICAobmF2aWdhdG9yLnBsYXRmb3JtID09PSBcIk1hY0ludGVsXCIgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMSkpICYmXHJcbiAgICAhd2luZG93Lk1TU3RyZWFtXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcclxuIiwiLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9ICh2YWx1ZSkgPT5cclxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIl19
