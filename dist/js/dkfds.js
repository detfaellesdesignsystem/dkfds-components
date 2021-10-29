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

  return function ()
  /* ...args */
  {
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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
"use strict";

var delegate = require('../delegate');

var compose = require('../compose');

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

},{"../compose":65,"../delegate":67}],67:[function(require,module,exports){
"use strict";

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

},{"element-closest":61}],68:[function(require,module,exports){
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

},{"keyboardevent-key-polyfill":62}],69:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };

  return wrapped;
};

},{}],70:[function(require,module,exports){
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

},{"../utils/is-in-viewport":99,"../utils/toggle":102}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
"use strict";

var _CLICK, _keydown, _focusout, _datePickerEvents;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var keymap = require("receptor/keymap");

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
}), _defineProperty(_keydown, CALENDAR_DATE, keymap({
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
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, keymap({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, keymap({
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
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, keymap({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, keymap({
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
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, keymap({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = keymap({
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

},{"../config":88,"../events":90,"../utils/active-element":95,"../utils/behavior":96,"../utils/is-ios-device":100,"../utils/select":101,"receptor/keymap":68}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generateUniqueId = require("../utils/generate-unique-id.js");

/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 */
var KEY_ENTER = 13;
var KEY_SPACE = 32;

function Details($module) {
  this.$module = $module;
}

Details.prototype.init = function () {
  if (!this.$module) {
    return;
  } // If there is native details support, we want to avoid running code to polyfill native behaviour.


  var hasNativeDetails = typeof this.$module.open === 'boolean';

  if (hasNativeDetails) {
    return;
  }

  this.polyfillDetails();
};

Details.prototype.polyfillDetails = function () {
  var $module = this.$module; // Save shortcuts to the inner summary and content elements

  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
  var $content = this.$content = $module.getElementsByTagName('div').item(0); // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop

  if (!$summary || !$content) {
    throw new Error("Missing important HTML structure of component: summary and div representing the content.");
  } // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment


  if (!$content.id) {
    $content.id = 'details-content-' + (0, _generateUniqueId.generateUniqueID)();
  } // Add ARIA role="group" to details


  $module.setAttribute('role', 'group'); // Add role=button to summary

  $summary.setAttribute('role', 'button'); // Add aria-controls

  $summary.setAttribute('aria-controls', $content.id); // Set tabIndex so the summary is keyboard accessible for non-native elements
  //
  // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
  // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.

  $summary.tabIndex = 0; // Detect initial open state

  var openAttr = $module.getAttribute('open') !== null;

  if (openAttr === true) {
    $summary.setAttribute('aria-expanded', 'true');
    $content.setAttribute('aria-hidden', 'false');
  } else {
    $summary.setAttribute('aria-expanded', 'false');
    $content.setAttribute('aria-hidden', 'true');
  } // Bind an event to handle summary elements


  this.polyfillHandleInputs($summary, this.polyfillSetAttributes.bind(this));
};
/**
 * Define a statechange function that updates aria-expanded and style.display
 * @param {object} summary element
 */


Details.prototype.polyfillSetAttributes = function () {
  var $module = this.$module;
  var $summary = this.$summary;
  var $content = this.$content;
  var expanded = $summary.getAttribute('aria-expanded') === 'true';
  var hidden = $content.getAttribute('aria-hidden') === 'true';
  $summary.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  $content.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  var hasOpenAttr = $module.getAttribute('open') !== null;

  if (!hasOpenAttr) {
    $module.setAttribute('open', 'open');
  } else {
    $module.removeAttribute('open');
  }

  return true;
};
/**
 * Handle cross-modal click events
 * @param {object} node element
 * @param {function} callback function
 */


Details.prototype.polyfillHandleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target; // When the key gets pressed - check if it is enter or space

    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault(); // Click to let the click event do all the necessary action

        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event);
        }
      }
    }
  }); // Prevent keyup to prevent clicking twice in Firefox when using space key

  node.addEventListener('keyup', function (event) {
    var target = event.target;

    if (event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault();
      }
    }
  });
  node.addEventListener('click', callback);
};

var _default = Details;
exports["default"] = _default;

},{"../utils/generate-unique-id.js":98}],75:[function(require,module,exports){
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

},{"./dropdown":76}],76:[function(require,module,exports){
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

},{"../utils/breakpoints":97}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
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

},{"../utils/select":101,"./dropdown":76,"array-foreach":1}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var once = require('receptor/once');

var SetTabIndex = function SetTabIndex(element) {
  _classCallCheck(this, SetTabIndex);

  element.addEventListener('click', function () {
    // NB: we know because of the selector we're delegating to below that the
    // href already begins with '#'
    var id = this.getAttribute('href').slice(1);
    var target = document.getElementById(id);

    if (target) {
      target.setAttribute('tabindex', 0);
      target.addEventListener('blur', once(function (event) {
        target.setAttribute('tabindex', -1);
      }));
    } else {// throw an error?
    }
  });
};

module.exports = SetTabIndex;

},{"receptor/once":69}],84:[function(require,module,exports){
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

},{"../utils/select":101}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],89:[function(require,module,exports){
'use strict';

var _details = _interopRequireDefault(require("./components/details"));

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
  var details = scope.querySelectorAll('.js-details');

  for (var d = 0; d < details.length; d++) {
    new _details["default"](details[d]).init();
  }

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

  for (var _d = 0; _d < modals.length; _d++) {
    new _modal["default"](modals[_d]).init();
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
  Details: _details["default"],
  datePicker: datePicker,
  Toast: Toast,
  TableSelectableRows: TableSelectableRows,
  ErrorSummary: _errorSummary["default"]
};

},{"./components/accordion":70,"./components/checkbox-toggle-content":71,"./components/collapse":72,"./components/date-picker":73,"./components/details":74,"./components/dropdown":76,"./components/dropdown-sort":75,"./components/error-summary":77,"./components/modal":78,"./components/navigation":79,"./components/radio-toggle-content":80,"./components/regex-input-mask":81,"./components/selectable-table":82,"./components/skipnav":83,"./components/table":84,"./components/tabnav":85,"./components/toast":86,"./components/tooltip":87,"./polyfills":93}],90:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
'use strict'; // polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill'); // polyfills HTMLElement.prototype.hidden


require('./element-hidden'); // polyfills Number.isNaN()


require("./number-is-nan"); // polyfills CustomEvent


require("./custom-event");

require('core-js/fn/object/assign');

require('core-js/fn/array/from');

},{"./custom-event":91,"./element-hidden":92,"./number-is-nan":94,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],94:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],95:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],96:[function(require,module,exports){
"use strict";

var assign = require("object-assign");

var Behavior = require("receptor/behavior");
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
  return Behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":63,"receptor/behavior":64}],97:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUniqueID = generateUniqueID;

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
function generateUniqueID() {
  var d = new Date().getTime();

  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now(); // use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}

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

},{}]},{},[89])(89)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvYmVoYXZpb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvY29tcG9zZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZUFsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9rZXltYXAvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivb25jZS9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NoZWNrYm94LXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29sbGFwc2UuanMiLCJzcmMvanMvY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RldGFpbHMuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi1zb3J0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24uanMiLCJzcmMvanMvY29tcG9uZW50cy9lcnJvci1zdW1tYXJ5LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJzcmMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc2VsZWN0YWJsZS10YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NraXBuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9nZW5lcmF0ZS11bmlxdWUtaWQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW9zLWRldmljZS5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxNQUFJLEdBQUcsQ0FBQyxPQUFSLEVBQWlCO0FBQ2IsSUFBQSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsT0FB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O0FBQ2pDLElBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLE1BQWtDLE9BQTdDO0FBQ0Q7O0FBQ0QsRUFBQSxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixFQUE4QixRQUE5QjtBQUNBLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLENBQVg7QUFDQSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QixDQUFqQjs7QUFDQSxNQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsVUFBTSxJQUFJLEtBQUosQ0FDSixzQ0FBc0MsRUFBdEMsR0FBMkMsR0FEdkMsQ0FBTjtBQUdEOztBQUVELEVBQUEsUUFBUSxDQUFDLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsQ0FBQyxRQUEvQjtBQUNBLFNBQU8sUUFBUDtBQUNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjEyJyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCduYXRpdmUtZnVuY3Rpb24tdG8tc3RyaW5nJywgRnVuY3Rpb24udG9TdHJpbmcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIHtcbiAgICAgIGtleSA9IGtleXNbaisrXTtcbiAgICAgIGlmICghREVTQ1JJUFRPUlMgfHwgaXNFbnVtLmNhbGwoUywga2V5KSkgVFtrZXldID0gU1trZXldO1xuICAgIH1cbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuL19mdW5jdGlvbi10by1zdHJpbmcnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIwIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvLyBlbGVtZW50LWNsb3Nlc3QgfCBDQzAtMS4wIHwgZ2l0aHViLmNvbS9qb25hdGhhbnRuZWFsL2Nsb3Nlc3RcblxuKGZ1bmN0aW9uIChFbGVtZW50UHJvdG8pIHtcblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8ubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5tYXRjaGVzID0gRWxlbWVudFByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnRQcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiBtYXRjaGVzKHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSAoZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50Lm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIGluZGV4ID0gMDtcblxuXHRcdFx0d2hpbGUgKGVsZW1lbnRzW2luZGV4XSAmJiBlbGVtZW50c1tpbmRleF0gIT09IGVsZW1lbnQpIHtcblx0XHRcdFx0KytpbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIEJvb2xlYW4oZWxlbWVudHNbaW5kZXhdKTtcblx0XHR9O1xuXHR9XG5cblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8uY2xvc2VzdCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5jbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXHR9XG59KSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUpO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi4vZGVsZWdhdGVBbGwnKTtcblxuY29uc3QgREVMRUdBVEVfUEFUVEVSTiA9IC9eKC4rKTpkZWxlZ2F0ZVxcKCguKylcXCkkLztcbmNvbnN0IFNQQUNFID0gJyAnO1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlLCBoYW5kbGVyKSB7XG4gIHZhciBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTik7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdO1xuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gIH1cblxuICB2YXIgb3B0aW9ucztcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgZGVsZWdhdGU6ICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpXG4gICAgICA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpXG4gICAgICA6IHNlbGVjdG9yXG4gICAgICAgID8gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgIDogaGFuZGxlcixcbiAgICBvcHRpb25zOiBvcHRpb25zXG4gIH07XG5cbiAgaWYgKHR5cGUuaW5kZXhPZihTUEFDRSkgPiAtMSkge1xuICAgIHJldHVybiB0eXBlLnNwbGl0KFNQQUNFKS5tYXAoZnVuY3Rpb24oX3R5cGUpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RlbmVyLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG52YXIgcG9wS2V5ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cylcbiAgICAucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnModHlwZSwgZXZlbnRzW3R5cGVdKTtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChsaXN0ZW5lcnMpO1xuICAgIH0sIFtdKTtcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZEJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmVCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHByb3BzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4uL2NvbXBvc2UnKTtcblxuY29uc3QgU1BMQVQgPSAnKic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGVBbGwoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnMpXG5cbiAgLy8gWFhYIG9wdGltaXphdGlvbjogaWYgdGhlcmUgaXMgb25seSBvbmUgaGFuZGxlciBhbmQgaXQgYXBwbGllcyB0b1xuICAvLyBhbGwgZWxlbWVudHMgKHRoZSBcIipcIiBDU1Mgc2VsZWN0b3IpLCB0aGVuIGp1c3QgcmV0dXJuIHRoYXRcbiAgLy8gaGFuZGxlclxuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYga2V5c1swXSA9PT0gU1BMQVQpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JzW1NQTEFUXTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIFtdKTtcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKTtcbn07XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5yZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsInJlcXVpcmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJyk7XG5cbi8vIHRoZXNlIGFyZSB0aGUgb25seSByZWxldmFudCBtb2RpZmllcnMgc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsXG4vLyBhY2NvcmRpbmcgdG8gTUROOlxuLy8gPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2dldE1vZGlmaWVyU3RhdGU+XG5jb25zdCBNT0RJRklFUlMgPSB7XG4gICdBbHQnOiAgICAgICdhbHRLZXknLFxuICAnQ29udHJvbCc6ICAnY3RybEtleScsXG4gICdDdHJsJzogICAgICdjdHJsS2V5JyxcbiAgJ1NoaWZ0JzogICAgJ3NoaWZ0S2V5J1xufTtcblxuY29uc3QgTU9ESUZJRVJfU0VQQVJBVE9SID0gJysnO1xuXG5jb25zdCBnZXRFdmVudEtleSA9IGZ1bmN0aW9uKGV2ZW50LCBoYXNNb2RpZmllcnMpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleTtcbiAgaWYgKGhhc01vZGlmaWVycykge1xuICAgIGZvciAodmFyIG1vZGlmaWVyIGluIE1PRElGSUVSUykge1xuICAgICAgaWYgKGV2ZW50W01PRElGSUVSU1ttb2RpZmllcl1dID09PSB0cnVlKSB7XG4gICAgICAgIGtleSA9IFttb2RpZmllciwga2V5XS5qb2luKE1PRElGSUVSX1NFUEFSQVRPUik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleW1hcChrZXlzKSB7XG4gIGNvbnN0IGhhc01vZGlmaWVycyA9IE9iamVjdC5rZXlzKGtleXMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKE1PRElGSUVSX1NFUEFSQVRPUikgPiAtMTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBrZXkgPSBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKTtcbiAgICByZXR1cm4gW2tleSwga2V5LnRvTG93ZXJDYXNlKCldXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgX2tleSkge1xuICAgICAgICBpZiAoX2tleSBpbiBrZXlzKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5c1trZXldLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LCB1bmRlZmluZWQpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMuTU9ESUZJRVJTID0gTU9ESUZJRVJTO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHZhciB3cmFwcGVkID0gZnVuY3Rpb24gd3JhcHBlZE9uY2UoZSkge1xuICAgIGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgd3JhcHBlZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVkO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XHJcbmNvbnN0IEJVVFRPTiA9IGAuYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEVfQ0xBU1MgPSAnYWNjb3JkaW9uLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUID0gXCLDhWJuIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9DTE9TRV9URVhUID0gXCJMdWsgYWxsZVwiO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUgPSBcImRhdGEtYWNjb3JkaW9uLWJ1bGstZXhwYW5kXCI7XHJcblxyXG5jbGFzcyBBY2NvcmRpb257XHJcbiAgY29uc3RydWN0b3IgKGFjY29yZGlvbil7XHJcbiAgICBpZighYWNjb3JkaW9uKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBncm91cCBlbGVtZW50YCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbjtcclxuICAgIGxldCBwcmV2U2libGluZyA9IGFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDtcclxuICAgIGlmKHByZXZTaWJsaW5nICE9PSBudWxsICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbiA9IHByZXZTaWJsaW5nO1xyXG4gICAgfVxyXG4gICAgdGhpcy5idXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIGlmKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gICAgfSBlbHNle1xyXG4gICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScsIHRydWUsIHRydWUpO1xyXG4gICAgICB0aGlzLmV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicsIHRydWUsIHRydWUpO1xyXG4gICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQgKCl7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xyXG4gICAgICBcclxuICAgICAgLy8gVmVyaWZ5IHN0YXRlIG9uIGJ1dHRvbiBhbmQgc3RhdGUgb24gcGFuZWxcclxuICAgICAgbGV0IGV4cGFuZGVkID0gY3VycmVudEJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZSc7XHJcbiAgICAgIHRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XHJcblxyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgY3VycmVudEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoYXQuZXZlbnRPbkNsaWNrLCBmYWxzZSk7XHJcbiAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGF0LmV2ZW50T25DbGljaywgZmFsc2UpO1xyXG4gICAgICB0aGlzLmVuYWJsZUJ1bGtGdW5jdGlvbigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW5hYmxlQnVsa0Z1bmN0aW9uKCl7XHJcbiAgICBpZih0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbiAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCBhY2NvcmRpb24gPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgICAgaWYoIWFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXsgIFxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICBsZXQgZXhwYW5kID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmdldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUpID09PSBcImZhbHNlXCIpIHtcclxuICAgICAgICAgIGV4cGFuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbnNbaV0sIGV4cGFuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgIWV4cGFuZCk7XHJcbiAgICAgICAgaWYoIWV4cGFuZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICB0aGlzLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgIHRoaXMuaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9DTE9TRV9URVhUO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBcclxuICBldmVudE9uQ2xpY2sgKGV2ZW50KXtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgbGV0IGJ1dHRvbiA9IHRoaXM7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbik7XHJcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XHJcbiAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KGJ1dHRvbikpIGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gICAqIHN0YXRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAgICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XHJcbiAgICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAgICovXHJcbn1cclxuXHJcbnZhciB0b2dnbGVCdXR0b24gID0gZnVuY3Rpb24gKGJ1dHRvbiwgZXhwYW5kZWQpIHtcclxuICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9IGVsc2UgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScsIHRydWUsIHRydWUpO1xyXG4gIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nLCB0cnVlLCB0cnVlKTtcclxuICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcclxuXHJcbiAgaWYoZXhwYW5kZWQpe1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICB9IGVsc2V7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICB9XHJcblxyXG4gIGxldCBtdWx0aXNlbGVjdGFibGUgPSBmYWxzZTtcclxuICBpZihhY2NvcmRpb24gIT09IG51bGwgJiYgKGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnIHx8IGFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoTVVMVElTRUxFQ1RBQkxFX0NMQVNTKSkpe1xyXG4gICAgbXVsdGlzZWxlY3RhYmxlID0gdHJ1ZTtcclxuICAgIGxldCBidWxrRnVuY3Rpb24gPSBhY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgIGlmKGJ1bGtGdW5jdGlvbiAhPT0gbnVsbCAmJiBidWxrRnVuY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSl7XHJcbiAgICAgIGxldCBzdGF0dXMgPSBidWxrRnVuY3Rpb24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSk7XHJcbiAgICAgIGxldCBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgICAgbGV0IGJ1dHRvbnNPcGVuID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgICAgbGV0IGJ1dHRvbnNDbG9zZWQgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwiZmFsc2VcIl0nKTtcclxuICAgICAgbGV0IG5ld1N0YXR1cyA9IHRydWU7XHJcbiAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zT3Blbi5sZW5ndGgpe1xyXG4gICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zQ2xvc2VkLmxlbmd0aCl7XHJcbiAgICAgICAgbmV3U3RhdHVzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBidWxrRnVuY3Rpb24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgbmV3U3RhdHVzKTtcclxuICAgICAgaWYobmV3U3RhdHVzID09PSB0cnVlKXtcclxuICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9PUEVOX1RFWFQ7XHJcbiAgICAgIH0gZWxzZXtcclxuICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9DTE9TRV9URVhUO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgY3VycmVudEJ1dHR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jbGFzcyBDaGVja2JveFRvZ2dsZUNvbnRlbnR7XHJcbiAgICBjb25zdHJ1Y3RvcihlbCl7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSAnLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVGFyZ2V0ID0gJ2RhdGEtYXJpYS1jb250cm9scyc7XHJcbiAgICAgICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KGVsKXtcclxuICAgICAgICB0aGlzLmNoZWNrYm94RWwgPSBlbDtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCl7XHJcbiAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQuY2hlY2tib3hFbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUodGhpcy5jaGVja2JveEVsKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUodHJpZ2dlckVsKXtcclxuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc1RvZ2dsZVRhcmdldClcclxuICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgICAgICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIHRoaXMuanNUb2dnbGVUYXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrYm94VG9nZ2xlQ29udGVudDtcclxuIiwiLyoqXHJcbiAqIENvbGxhcHNlL2V4cGFuZC5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCdcclxuXHJcbmNsYXNzIENvbGxhcHNlIHtcclxuICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgYWN0aW9uID0gJ3RvZ2dsZScpe1xyXG4gICAgdGhpcy5qc0NvbGxhcHNlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuICAgIHRoaXMudHJpZ2dlckVsID0gZWxlbWVudDtcclxuICAgIHRoaXMudGFyZ2V0RWw7XHJcbiAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIHRoaXMuZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5jbG9zZScsIHRydWUsIHRydWUpO1xyXG4gICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgIHRoYXQudG9nZ2xlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUNvbGxhcHNlIChmb3JjZUNsb3NlKSB7XHJcbiAgICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzQ29sbGFwc2VUYXJnZXQpO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XHJcbiAgICBpZih0aGlzLnRhcmdldEVsID09PSBudWxsIHx8IHRoaXMudGFyZ2V0RWwgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIHRoaXMuanNDb2xsYXBzZVRhcmdldCk7XHJcbiAgICB9XHJcbiAgICAvL2NoYW5nZSBzdGF0ZVxyXG4gICAgaWYodGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdW5kZWZpbmVkIHx8IGZvcmNlQ2xvc2UgKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0aGlzLmFuaW1hdGVDb2xsYXBzZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vb3BlblxyXG4gICAgICB0aGlzLmFuaW1hdGVFeHBhbmQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZSAoKXtcclxuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0aGlzLnRvZ2dsZUNvbGxhcHNlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgYW5pbWF0ZUNvbGxhcHNlICgpIHtcclxuICAgIGlmKCF0aGlzLmFuaW1hdGVJblByb2dyZXNzKXtcclxuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9IHRoaXMudGFyZ2V0RWwuY2xpZW50SGVpZ2h0KyAncHgnO1xyXG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2UnKTtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgICB9LCA1KTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xyXG5cclxuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIHRoYXQuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB0aGF0LnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoYXQuZXZlbnRDbG9zZSk7XHJcbiAgICAgIH0sIDIwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhbmltYXRlRXhwYW5kICgpIHtcclxuICAgIGlmKCF0aGlzLmFuaW1hdGVJblByb2dyZXNzKXtcclxuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XHJcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgIGxldCBleHBhbmRlZEhlaWdodCA9IHRoaXMudGFyZ2V0RWwuY2xpZW50SGVpZ2h0O1xyXG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9ICcwcHgnO1xyXG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kJyk7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnN0eWxlLmhlaWdodCA9IGV4cGFuZGVkSGVpZ2h0KyAncHgnO1xyXG4gICAgICB9LCA1KTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xyXG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG5cclxuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIHRoYXQuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB0aGF0LnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoYXQuZXZlbnRPcGVuKTtcclxuICAgICAgfSwgMjAwKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sbGFwc2U7XHJcbiIsImNvbnN0IGtleW1hcCA9IHJlcXVpcmUoXCJyZWNlcHRvci9rZXltYXBcIik7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xyXG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xyXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xyXG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xyXG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X193cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWluaXRpYWxpemVkYDtcclxuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9faW50ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZXh0ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19jYWxlbmRhcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVU19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fc3RhdHVzYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XHJcblxyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLWVuZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xyXG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2NlbGxgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF5LW9mLXdlZWtgO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OID0gYC4ke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUiA9IGAuJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USCA9IGAuJHtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUiA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1N9YDtcclxuXHJcbmNvbnN0IFZBTElEQVRJT05fTUVTU0FHRSA9IFwiSW5kdGFzdCB2ZW5saWdzdCBlbiBneWxkaWcgZGF0b1wiO1xyXG5cclxuY29uc3QgTU9OVEhfTEFCRUxTID0gW1xyXG4gIFwiSmFudWFyXCIsXHJcbiAgXCJGZWJydWFyXCIsXHJcbiAgXCJNYXJ0c1wiLFxyXG4gIFwiQXByaWxcIixcclxuICBcIk1halwiLFxyXG4gIFwiSnVuaVwiLFxyXG4gIFwiSnVsaVwiLFxyXG4gIFwiQXVndXN0XCIsXHJcbiAgXCJTZXB0ZW1iZXJcIixcclxuICBcIk9rdG9iZXJcIixcclxuICBcIk5vdmVtYmVyXCIsXHJcbiAgXCJEZWNlbWJlclwiLFxyXG5dO1xyXG5cclxuY29uc3QgREFZX09GX1dFRUtfTEFCRUxTID0gW1xyXG4gIFwiTWFuZGFnXCIsXHJcbiAgXCJUaXJzZGFnXCIsXHJcbiAgXCJPbnNkYWdcIixcclxuICBcIlRvcnNkYWdcIixcclxuICBcIkZyZWRhZ1wiLFxyXG4gIFwiTMO4cmRhZ1wiLFxyXG4gIFwiU8O4bmRhZ1wiLFxyXG5dO1xyXG5cclxuY29uc3QgRU5URVJfS0VZQ09ERSA9IDEzO1xyXG5cclxuY29uc3QgWUVBUl9DSFVOSyA9IDEyO1xyXG5cclxuY29uc3QgREVGQVVMVF9NSU5fREFURSA9IFwiMDAwMC0wMS0wMVwiO1xyXG5jb25zdCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUID0gXCJERC9NTS9ZWVlZXCI7XHJcbmNvbnN0IElOVEVSTkFMX0RBVEVfRk9STUFUID0gXCJZWVlZLU1NLUREXCI7XHJcblxyXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcclxuXHJcbmNvbnN0IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMgPSAoLi4uc2VsZWN0b3JzKSA9PlxyXG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX01PTlRILFxyXG4gIENBTEVOREFSX1lFQVJfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9ORVhUX1lFQVIsXHJcbiAgQ0FMRU5EQVJfTkVYVF9NT05USCxcclxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX01PTlRIX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEXHJcbik7XHJcblxyXG4vLyAjcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIEtlZXAgZGF0ZSB3aXRoaW4gbW9udGguIE1vbnRoIHdvdWxkIG9ubHkgYmUgb3ZlciBieSAxIHRvIDMgZGF5c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIGNvcnJlY3QgbW9udGhcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlLCBjb3JyZWN0ZWQgaWYgbmVlZGVkXHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZVdpdGhpbk1vbnRoID0gKGRhdGVUb0NoZWNrLCBtb250aCkgPT4ge1xyXG4gIGlmIChtb250aCAhPT0gZGF0ZVRvQ2hlY2suZ2V0TW9udGgoKSkge1xyXG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlVG9DaGVjaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSBmcm9tIG1vbnRoIGRheSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIG1vbnRoIHRvIHNldCAoemVyby1pbmRleGVkKVxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0RGF0ZSA9ICh5ZWFyLCBtb250aCwgZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiB0b2RheXMgZGF0ZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdG9kYXlzIGRhdGVcclxuICovXHJcbmNvbnN0IHRvZGF5ID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IHllYXIgPSBuZXdEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gZmlyc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCAxKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBsYXN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSwgMCk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGRheXMgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IGRheXMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJEYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiBhZGREYXlzKF9kYXRlLCAtbnVtRGF5cyk7XHJcblxyXG4vKipcclxuICogQWRkIHdlZWtzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGREYXlzKF9kYXRlLCBudW1XZWVrcyAqIDcpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHdlZWtzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZFdlZWtzKF9kYXRlLCAtbnVtV2Vla3MpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayAoTW9uZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgbGV0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpLTE7XHJcbiAgaWYoZGF5T2ZXZWVrID09PSAtMSl7XHJcbiAgICBkYXlPZldlZWsgPSA2O1xyXG4gIH1cclxuICByZXR1cm4gc3ViRGF5cyhfZGF0ZSwgZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIChTdW5kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGVuZE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpO1xyXG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA3IC0gZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9udGhzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBkYXRlTW9udGggPSAobmV3RGF0ZS5nZXRNb250aCgpICsgMTIgKyBudW1Nb250aHMpICUgMTI7XHJcbiAgbmV3RGF0ZS5zZXRNb250aChuZXdEYXRlLmdldE1vbnRoKCkgKyBudW1Nb250aHMpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB5ZWFyIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0WWVhciA9IChfZGF0ZSwgeWVhcikgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBsYXRlc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtYXggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCID4gZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgeWVhclxyXG4gKi9cclxuY29uc3QgaXNTYW1lWWVhciA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gZGF0ZUEgJiYgZGF0ZUIgJiYgZGF0ZUEuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZUIuZ2V0RnVsbFllYXIoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgbW9udGhcclxuICovXHJcbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVZZWFyKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0TW9udGgoKSA9PT0gZGF0ZUIuZ2V0TW9udGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIHNhbWUgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxyXG4gKi9cclxuY29uc3QgaXNTYW1lRGF5ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIG5ldyBkYXRlIHdpdGhpbiBtaW5pbXVtIGFuZCBtYXhpbXVtIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcclxuXHJcbiAgaWYgKGRhdGUgPCBtaW5EYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcclxuICB9IGVsc2UgaWYgKG1heERhdGUgJiYgZGF0ZSA+IG1heERhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtYXhEYXRlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZXJlIGEgZGF5IHdpdGhpbiB0aGUgbW9udGggd2l0aGluIG1pbiBhbmQgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVXaXRoaW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT5cclxuICBkYXRlID49IG1pbkRhdGUgJiYgKCFtYXhEYXRlIHx8IGRhdGUgPD0gbWF4RGF0ZSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgbW9udGggaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKGRhdGUpIDwgbWluRGF0ZSB8fCAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoZGF0ZSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgeWVhciBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChzZXRNb250aChkYXRlLCAxMSkpIDwgbWluRGF0ZSB8fFxyXG4gICAgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDApKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBhIGRhdGUgd2l0aCBmb3JtYXQgTS1ELVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFkanVzdERhdGUgc2hvdWxkIHRoZSBkYXRlIGJlIGFkanVzdGVkXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcclxuICovXHJcbmNvbnN0IHBhcnNlRGF0ZVN0cmluZyA9IChcclxuICBkYXRlU3RyaW5nLFxyXG4gIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICBhZGp1c3REYXRlID0gZmFsc2VcclxuKSA9PiB7XHJcbiAgbGV0IGRhdGU7XHJcbiAgbGV0IG1vbnRoO1xyXG4gIGxldCBkYXk7XHJcbiAgbGV0IHllYXI7XHJcbiAgbGV0IHBhcnNlZDtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtb250aFN0ciwgZGF5U3RyLCB5ZWFyU3RyO1xyXG4gICAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgICAgW2RheVN0ciwgbW9udGhTdHIsIHllYXJTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi9cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBbeWVhclN0ciwgbW9udGhTdHIsIGRheVN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiLVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeWVhclN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICB5ZWFyID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICB5ZWFyID0gTWF0aC5tYXgoMCwgeWVhcik7XHJcbiAgICAgICAgICBpZiAoeWVhclN0ci5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhclN0dWIgPVxyXG4gICAgICAgICAgICAgIGN1cnJlbnRZZWFyIC0gKGN1cnJlbnRZZWFyICUgMTAgKiogeWVhclN0ci5sZW5ndGgpO1xyXG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aFN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChtb250aFN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5tYXgoMSwgbW9udGgpO1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXlTdHIgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgZGF5ID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBjb25zdCBsYXN0RGF5T2ZUaGVNb250aCA9IHNldERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWF4KDEsIGRheSk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBkYXRlIHRvIGZvcm1hdCBNTS1ERC1ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlLCBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQpID0+IHtcclxuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XHJcbiAgICByZXR1cm4gYDAwMDAke3ZhbHVlfWAuc2xpY2UoLWxlbmd0aCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGlmIChkYXRlRm9ybWF0ID09PSBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIvXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gaHRtbEFycmF5IHRoZSBhcnJheSBvZiBodG1sIGl0ZW1zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGdyaWQgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcclxuICBjb25zdCBncmlkID0gW107XHJcbiAgbGV0IHJvdyA9IFtdO1xyXG5cclxuICBsZXQgaSA9IDA7XHJcbiAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoKSB7XHJcbiAgICByb3cgPSBbXTtcclxuICAgIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCAmJiByb3cubGVuZ3RoIDwgcm93U2l6ZSkge1xyXG4gICAgICByb3cucHVzaChgPHRkPiR7aHRtbEFycmF5W2ldfTwvdGQ+YCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGdyaWQucHVzaChgPHRyPiR7cm93LmpvaW4oXCJcIil9PC90cj5gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBncmlkLmpvaW4oXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byB1cGRhdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGNoYW5nZUVsZW1lbnRWYWx1ZSA9IChlbCwgdmFsdWUgPSBcIlwiKSA9PiB7XHJcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2hhbmdlXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7IHZhbHVlIH0sXHJcbiAgfSk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gY2FsZW5kYXJEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBzZWxlY3RlZERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gb2JqZWN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXHJcbiAqL1xyXG5jb25zdCBnZXREYXRlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG5cclxuICBpZiAoIWRhdGVQaWNrZXJFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xyXG4gIGNvbnN0IHN0YXR1c0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfU1RBVFVTKTtcclxuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XHJcblxyXG4gIGNvbnN0IGlucHV0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcclxuICAgIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQsXHJcbiAgICB0cnVlXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xyXG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcclxuXHJcbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHRvZ2dsZUJ0bkVsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiw4VibiBrYWxlbmRlclwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBoaWRkZW4+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxyXG4gICAgICBkYXRhLW1vbnRoPVwiJHttb250aCArIDF9XCIgXHJcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcclxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxyXG4gICAgICBhcmlhLWxhYmVsPVwiJHtkYXlTdHJ9IGRlbiAke2RheX0gJHttb250aFN0cn0gJHt5ZWFyfSBcIlxyXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gVsOmbGcgbcOlbmVkLlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uIFbDpmxnIMOlci5cIlxyXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTk5hdmlnw6lyIMOpdCDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgIDx0cj5gO1xyXG4gIGZvcihsZXQgZCBpbiBEQVlfT0ZfV0VFS19MQUJFTFMpe1xyXG4gICAgY29udGVudCArPSBgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCIke0RBWV9PRl9XRUVLX0xBQkVMU1tkXX1cIj4ke0RBWV9PRl9XRUVLX0xBQkVMU1tkXS5jaGFyQXQoMCl9PC90aD5gO1xyXG4gIH1cclxuICBjb250ZW50ICs9IGA8L3RyPlxyXG4gICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgJHtkYXRlc0h0bWx9XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gY29udGVudDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuXHJcbiAgY29uc3Qgc3RhdHVzZXMgPSBbXTtcclxuXHJcbiAgaWYgKGlzU2FtZURheShzZWxlY3RlZERhdGUsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaChcIlNlbGVjdGVkIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FsZW5kYXJXYXNIaWRkZW4pIHtcclxuICAgIHN0YXR1c2VzLnB1c2goXHJcbiAgICAgIFwiRHUga2FuIG5hdmlnZXJlIG1lbGxlbSBkYWdlIHZlZCBhdCBicnVnZSBow7hqcmUgb2cgdmVuc3RyZSBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcInVnZXIgdmVkIGF0IGJydWdlIG9wIG9nIG5lZCBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcIm3DpW5lZGVyIHZlZCB0YSBicnVnZSBwYWdlIHVwIG9nIHBhZ2UgZG93biB0YXN0ZXJuZSBcIixcclxuICAgICAgXCJvZyDDpXIgdmVkIGF0IGF0IHRhc3RlIHNoaWZ0IG9nIHBhZ2UgdXAgZWxsZXIgbmVkLlwiLFxyXG4gICAgICBcIkhvbWUgb2cgZW5kIHRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIlxyXG4gICAgKTtcclxuICAgIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RhdHVzZXMucHVzaChgJHttb250aExhYmVsfSAke2ZvY3VzZWRZZWFyfWApO1xyXG4gIH1cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0TW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhpZGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgZGF0ZSB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcclxuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBjYWxlbmRhckRhdGVFbFxyXG4gICk7XHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZShjYWxlbmRhckRhdGVFbCwgY2FsZW5kYXJEYXRlRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcblxyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHRvZ2dsZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxyXG4gICAgICBpbnB1dERhdGUgfHwgZGVmYXVsdERhdGUgfHwgdG9kYXkoKSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBjYWxlbmRhciB3aGVuIHZpc2libGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKi9cclxuY29uc3QgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGNhbGVuZGFyU2hvd24gPSAhY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGlmIChjYWxlbmRhclNob3duICYmIGlucHV0RGF0ZSkge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG4vKipcclxuICogRGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlNb250aFNlbGVjdGlvbiA9IChlbCwgbW9udGhUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gY2FsZW5kYXJEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gbW9udGhUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkTW9udGggOiBtb250aFRvRGlzcGxheTtcclxuXHJcbiAgY29uc3QgbW9udGhzID0gTU9OVEhfTEFCRUxTLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBtb250aFRvQ2hlY2sgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGluZGV4KTtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgICBtb250aFRvQ2hlY2ssXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfTU9OVEhfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZE1vbnRoO1xyXG5cclxuICAgIGlmIChpbmRleCA9PT0gZm9jdXNlZE1vbnRoKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHtpbmRleH1cIlxyXG4gICAgICAgIGRhdGEtbGFiZWw9XCIke21vbnRofVwiXHJcbiAgICAgICAgYXJpYS1zZWxlY3RlZD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHttb250aH08L2J1dHRvbj5gO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBtb250aHNIdG1sID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHRib2R5PlxyXG4gICAgICAgICR7bGlzdFRvR3JpZEh0bWwobW9udGhzLCAzKX1cclxuICAgICAgPC90Ym9keT5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+YDtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IG1vbnRoc0h0bWw7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJTZWxlY3QgYSBtb250aC5cIjtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0TW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgbW9udGhFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSB5ZWFyVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZFllYXIgOiB5ZWFyVG9EaXNwbGF5O1xyXG5cclxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcclxuICB5ZWFyVG9DaHVuayAtPSB5ZWFyVG9DaHVuayAlIFlFQVJfQ0hVTks7XHJcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XHJcblxyXG4gIGNvbnN0IHByZXZZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5leHRZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHllYXJzID0gW107XHJcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xyXG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHllYXJJbmRleCA9PT0gc2VsZWN0ZWRZZWFyO1xyXG5cclxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICB5ZWFycy5wdXNoKFxyXG4gICAgICBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXHJcbiAgICApO1xyXG4gICAgeWVhckluZGV4ICs9IDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciAke1lFQVJfQ0hVTkt9IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgICAgICR7cHJldlllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICR7eWVhcnNIdG1sfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIGZyZW1cIlxyXG4gICAgICAgICAgICAgICAgJHtuZXh0WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBgU2hvd2luZyB5ZWFycyAke3llYXJUb0NodW5rfSB0byAke1xyXG4gICAgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LIC0gMVxyXG4gIH0uIFNlbGVjdCBhIHllYXIuYDtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciArIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIHllYXIgaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICB5ZWFyRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5pbm5lckhUTUwsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XHJcblxyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG5cclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBkYXRlIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhciBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcclxuXHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN0YXJ0T2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1Yk1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xyXG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuXHJcbiAgY29uc3QgY3VycmVudENhbGVuZGFyRGF0ZSA9IGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZTtcclxuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcclxuXHJcbiAgaWYgKGhvdmVyRGF0ZSA9PT0gY3VycmVudENhbGVuZGFyRGF0ZSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcclxuICovXHJcbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBtb250aEVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBtb250aEVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcclxuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lTW9udGgoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRNb250aCgpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggKyAyIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAwKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgbW9udGggd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEEgbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c01vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxyXG4gKi9cclxuY29uc3QgYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RZZWFyRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICB5ZWFyRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZFllYXIgPSBhZGp1c3RZZWFyRm4oc2VsZWN0ZWRZZWFyKTtcclxuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gYmFjayAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgeWVhciB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XHJcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0VGFiSW5kZXggPSAwO1xyXG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tsYXN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcclxuXHJcbiAgICBjb25zdCBpc0xhc3RUYWIgPSBmb2N1c0luZGV4ID09PSBsYXN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcclxuICAgICAgaXNOb3RGb3VuZCxcclxuICAgICAgZmlyc3RUYWJTdG9wLFxyXG4gICAgICBpc0ZpcnN0VGFiLFxyXG4gICAgICBsYXN0VGFiU3RvcCxcclxuICAgICAgaXNMYXN0VGFiLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFiQWhlYWQoZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0YWJCYWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNGaXJzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xyXG4gIFtDTElDS106IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9CVVRUT05dKCkge1xyXG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV0oKSB7XHJcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5dXA6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcclxuICAgICAgaWYgKGAke2V2ZW50LmtleUNvZGV9YCAhPT0ga2V5ZG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXlkb3duOiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XHJcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21EYXRlLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlRG93blwiOiBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9EQVRFX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21Nb250aCxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tWWVhcixcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleU1hcCA9IGtleW1hcCh7XHJcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAga2V5TWFwKGV2ZW50KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBmb2N1c291dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcclxuICAgICAgICBoaWRlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgcmVjb25jaWxlSW5wdXRWYWx1ZXModGhpcyk7XHJcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKCFpc0lvc0RldmljZSgpKSB7XHJcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XHJcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XHJcbiAgaW5pdChyb290KSB7XHJcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xyXG4gICAgICBpZighZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5jb250YWlucyhEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUykpe1xyXG4gICAgICAgIGVuaGFuY2VEYXRlUGlja2VyKGRhdGVQaWNrZXJFbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXHJcbiAgZGlzYWJsZSxcclxuICBlbmFibGUsXHJcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxyXG4gIHNldENhbGVuZGFyVmFsdWUsXHJcbiAgdmFsaWRhdGVEYXRlSW5wdXQsXHJcbiAgcmVuZGVyQ2FsZW5kYXIsXHJcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUsXHJcbn0pO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRlUGlja2VyO1xyXG4iLCIvKipcclxuICogSmF2YVNjcmlwdCAncG9seWZpbGwnIGZvciBIVE1MNSdzIDxkZXRhaWxzPiBhbmQgPHN1bW1hcnk+IGVsZW1lbnRzXHJcbiAqIGFuZCAnc2hpbScgdG8gYWRkIGFjY2Vzc2libGl0eSBlbmhhbmNlbWVudHMgZm9yIGFsbCBicm93c2Vyc1xyXG4gKlxyXG4gKiBodHRwOi8vY2FuaXVzZS5jb20vI2ZlYXQ9ZGV0YWlsc1xyXG4gKi9cclxuaW1wb3J0IHsgZ2VuZXJhdGVVbmlxdWVJRCB9IGZyb20gJy4uL3V0aWxzL2dlbmVyYXRlLXVuaXF1ZS1pZC5qcyc7XHJcblxyXG5jb25zdCBLRVlfRU5URVIgPSAxMztcclxuY29uc3QgS0VZX1NQQUNFID0gMzI7XHJcblxyXG5mdW5jdGlvbiBEZXRhaWxzICgkbW9kdWxlKSB7XHJcbiAgdGhpcy4kbW9kdWxlID0gJG1vZHVsZTtcclxufVxyXG5cclxuRGV0YWlscy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuJG1vZHVsZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhlcmUgaXMgbmF0aXZlIGRldGFpbHMgc3VwcG9ydCwgd2Ugd2FudCB0byBhdm9pZCBydW5uaW5nIGNvZGUgdG8gcG9seWZpbGwgbmF0aXZlIGJlaGF2aW91ci5cclxuICBsZXQgaGFzTmF0aXZlRGV0YWlscyA9IHR5cGVvZiB0aGlzLiRtb2R1bGUub3BlbiA9PT0gJ2Jvb2xlYW4nO1xyXG5cclxuICBpZiAoaGFzTmF0aXZlRGV0YWlscykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5wb2x5ZmlsbERldGFpbHMoKTtcclxufTtcclxuXHJcbkRldGFpbHMucHJvdG90eXBlLnBvbHlmaWxsRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgJG1vZHVsZSA9IHRoaXMuJG1vZHVsZTtcclxuXHJcbiAgLy8gU2F2ZSBzaG9ydGN1dHMgdG8gdGhlIGlubmVyIHN1bW1hcnkgYW5kIGNvbnRlbnQgZWxlbWVudHNcclxuICBsZXQgJHN1bW1hcnkgPSB0aGlzLiRzdW1tYXJ5ID0gJG1vZHVsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3VtbWFyeScpLml0ZW0oMCk7XHJcbiAgbGV0ICRjb250ZW50ID0gdGhpcy4kY29udGVudCA9ICRtb2R1bGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpLml0ZW0oMCk7XHJcblxyXG4gIC8vIElmIDxkZXRhaWxzPiBkb2Vzbid0IGhhdmUgYSA8c3VtbWFyeT4gYW5kIGEgPGRpdj4gcmVwcmVzZW50aW5nIHRoZSBjb250ZW50XHJcbiAgLy8gaXQgbWVhbnMgdGhlIHJlcXVpcmVkIEhUTUwgc3RydWN0dXJlIGlzIG5vdCBtZXQgc28gdGhlIHNjcmlwdCB3aWxsIHN0b3BcclxuICBpZiAoISRzdW1tYXJ5IHx8ICEkY29udGVudCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGltcG9ydGFudCBIVE1MIHN0cnVjdHVyZSBvZiBjb21wb25lbnQ6IHN1bW1hcnkgYW5kIGRpdiByZXByZXNlbnRpbmcgdGhlIGNvbnRlbnQuYCk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgY29udGVudCBkb2Vzbid0IGhhdmUgYW4gSUQsIGFzc2lnbiBpdCBvbmUgbm93XHJcbiAgLy8gd2hpY2ggd2UnbGwgbmVlZCBmb3IgdGhlIHN1bW1hcnkncyBhcmlhLWNvbnRyb2xzIGFzc2lnbm1lbnRcclxuICBpZiAoISRjb250ZW50LmlkKSB7XHJcbiAgICAkY29udGVudC5pZCA9ICdkZXRhaWxzLWNvbnRlbnQtJyArIGdlbmVyYXRlVW5pcXVlSUQoKTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCBBUklBIHJvbGU9XCJncm91cFwiIHRvIGRldGFpbHNcclxuICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xyXG5cclxuICAvLyBBZGQgcm9sZT1idXR0b24gdG8gc3VtbWFyeVxyXG4gICRzdW1tYXJ5LnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcclxuXHJcbiAgLy8gQWRkIGFyaWEtY29udHJvbHNcclxuICAkc3VtbWFyeS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCAkY29udGVudC5pZCk7XHJcblxyXG4gIC8vIFNldCB0YWJJbmRleCBzbyB0aGUgc3VtbWFyeSBpcyBrZXlib2FyZCBhY2Nlc3NpYmxlIGZvciBub24tbmF0aXZlIGVsZW1lbnRzXHJcbiAgLy9cclxuICAvLyBXZSBoYXZlIHRvIHVzZSB0aGUgY2FtZWxjYXNlIGB0YWJJbmRleGAgcHJvcGVydHkgYXMgdGhlcmUgaXMgYSBidWcgaW4gSUU2L0lFNyB3aGVuIHdlIHNldCB0aGUgY29ycmVjdCBhdHRyaWJ1dGUgbG93ZXJjYXNlOlxyXG4gIC8vIFNlZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE3MDEyMDE5NDAzNi9odHRwOi8vd3d3LnNhbGllbmNlcy5jb20vYnJvd3NlckJ1Z3MvdGFiSW5kZXguaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cclxuICAkc3VtbWFyeS50YWJJbmRleCA9IDA7XHJcblxyXG4gIC8vIERldGVjdCBpbml0aWFsIG9wZW4gc3RhdGVcclxuICBsZXQgb3BlbkF0dHIgPSAkbW9kdWxlLmdldEF0dHJpYnV0ZSgnb3BlbicpICE9PSBudWxsO1xyXG4gIGlmIChvcGVuQXR0ciA9PT0gdHJ1ZSkge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAkY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcblxyXG4gIC8vIEJpbmQgYW4gZXZlbnQgdG8gaGFuZGxlIHN1bW1hcnkgZWxlbWVudHNcclxuICB0aGlzLnBvbHlmaWxsSGFuZGxlSW5wdXRzKCRzdW1tYXJ5LCB0aGlzLnBvbHlmaWxsU2V0QXR0cmlidXRlcy5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgYSBzdGF0ZWNoYW5nZSBmdW5jdGlvbiB0aGF0IHVwZGF0ZXMgYXJpYS1leHBhbmRlZCBhbmQgc3R5bGUuZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5EZXRhaWxzLnByb3RvdHlwZS5wb2x5ZmlsbFNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XHJcbiAgbGV0ICRzdW1tYXJ5ID0gdGhpcy4kc3VtbWFyeTtcclxuICBsZXQgJGNvbnRlbnQgPSB0aGlzLiRjb250ZW50O1xyXG5cclxuICBsZXQgZXhwYW5kZWQgPSAkc3VtbWFyeS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xyXG4gIGxldCBoaWRkZW4gPSAkY29udGVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJztcclxuXHJcbiAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKGV4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG4gICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAoaGlkZGVuID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG5cclxuXHJcbiAgbGV0IGhhc09wZW5BdHRyID0gJG1vZHVsZS5nZXRBdHRyaWJ1dGUoJ29wZW4nKSAhPT0gbnVsbDtcclxuICBpZiAoIWhhc09wZW5BdHRyKSB7XHJcbiAgICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgICRtb2R1bGUucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZSBjcm9zcy1tb2RhbCBjbGljayBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3R9IG5vZGUgZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuRGV0YWlscy5wcm90b3R5cGUucG9seWZpbGxIYW5kbGVJbnB1dHMgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgLy8gV2hlbiB0aGUga2V5IGdldHMgcHJlc3NlZCAtIGNoZWNrIGlmIGl0IGlzIGVudGVyIG9yIHNwYWNlXHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSkge1xyXG4gICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdW1tYXJ5Jykge1xyXG4gICAgICAgIC8vIFByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2VcclxuICAgICAgICAvLyBhbmQgZW50ZXIgZnJvbSBzdWJtaXR0aW5nIGEgZm9ybVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8gQ2xpY2sgdG8gbGV0IHRoZSBjbGljayBldmVudCBkbyBhbGwgdGhlIG5lY2Vzc2FyeSBhY3Rpb25cclxuICAgICAgICBpZiAodGFyZ2V0LmNsaWNrKSB7XHJcbiAgICAgICAgICB0YXJnZXQuY2xpY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gZXhjZXB0IFNhZmFyaSA1LjEgYW5kIHVuZGVyIGRvbid0IHN1cHBvcnQgLmNsaWNrKCkgaGVyZVxyXG4gICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBQcmV2ZW50IGtleXVwIHRvIHByZXZlbnQgY2xpY2tpbmcgdHdpY2UgaW4gRmlyZWZveCB3aGVuIHVzaW5nIHNwYWNlIGtleVxyXG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFKSB7XHJcbiAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N1bW1hcnknKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGV0YWlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBEcm9wZG93biA9IHJlcXVpcmUoJy4vZHJvcGRvd24nKTtcclxuZnVuY3Rpb24gRHJvcGRvd25Tb3J0IChjb250YWluZXIpe1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB0aGlzLmJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG5cclxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXHJcbiAgICBpZighdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKSl7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGknKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2VsZWN0ZWRWYWx1ZSh0aGlzLmNvbnRhaW5lcik7XHJcbn1cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMub3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKHRoaXMuYnV0dG9uKTtcclxuXHJcbiAgICBsZXQgc29ydGluZ09wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKTtcclxuICAgIGZvcihsZXQgcyA9IDA7IHMgPCBzb3J0aW5nT3B0aW9ucy5sZW5ndGg7IHMrKyl7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IHNvcnRpbmdPcHRpb25zW3NdO1xyXG4gICAgICAgIG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3B0aW9uQ2xpY2spO1xyXG4gICAgfVxyXG59XHJcbmxldCB1cGRhdGVTZWxlY3RlZFZhbHVlID0gZnVuY3Rpb24oY29udGFpbmVyKXtcclxuICAgIGxldCBzZWxlY3RlZEl0ZW0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcclxuICAgIGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkLXZhbHVlJylbMF0uaW5uZXJUZXh0ID0gc2VsZWN0ZWRJdGVtLmlubmVyVGV4dDtcclxufVxyXG5cclxubGV0IG9uT3B0aW9uQ2xpY2sgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgICBsZXQgbGkgPSB0aGlzLnBhcmVudE5vZGU7XHJcbiAgICBsaS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2xpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XHJcbiAgICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBidXR0b24gPSBsaS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG4gICAgbGV0IGV2ZW50U2VsZWN0ZWQgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5zZWxlY3RlZCcpO1xyXG4gICAgZXZlbnRTZWxlY3RlZC5kZXRhaWwgPSB0aGlzO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRTZWxlY3RlZCk7XHJcbiAgICB1cGRhdGVTZWxlY3RlZFZhbHVlKGxpLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcclxuXHJcbiAgICBcclxuICAgIGxldCBvdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24oYnV0dG9uKTtcclxuICAgIG92ZXJmbG93TWVudS5oaWRlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duU29ydDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBicmVha3BvaW50cyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JyZWFrcG9pbnRzJyk7XHJcbmNvbnN0IEJVVFRPTiA9ICcuanMtZHJvcGRvd24nO1xyXG5jb25zdCBqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllciA9ICdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7IC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cclxuY29uc3QgVEFSR0VUID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuY29uc3QgZXZlbnRDbG9zZU5hbWUgPSAnZmRzLmRyb3Bkb3duLmNsb3NlJztcclxuY29uc3QgZXZlbnRPcGVuTmFtZSA9ICdmZHMuZHJvcGRvd24ub3Blbic7XHJcblxyXG5jbGFzcyBEcm9wZG93biB7XHJcbiAgY29uc3RydWN0b3IgKGVsKXtcclxuICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcblxyXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcblxyXG4gICAgICBpZih0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxyXG4gICAgICB0aGlzLnRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcblxyXG4gICAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy50cmlnZ2VyRWw7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgICAgLy8gdHJpZ2dlciBldmVudCB3aGVuIGJ1dHRvbiBjaGFuZ2VzIHZpc2liaWxpdHlcclxuICAgICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoZW50cmllc1sgMCBdLmludGVyc2VjdGlvblJhdGlvKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICAgIGlmICh0aGF0LnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBJRTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCwgc28gd2UgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplIGFuZCBncmlkIGJyZWFrcG9pbnQgaW5zdGVhZFxyXG4gICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRoYXQudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIExhcmdlIHNjcmVlblxyXG4gICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0aGF0LnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgICAgIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICAgICAgICBjbG9zZUFsbChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQgKCl7ICAgIFxyXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgPT09IG51bGwgfHx0aGlzLnRyaWdnZXJFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBidXR0b24gZm9yIERldGFpbHMgY29tcG9uZW50LmApO1xyXG4gICAgfVxyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgIGlmKHRhcmdldEF0dHIgPT09IG51bGwgfHwgdGFyZ2V0QXR0ciA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgY291bGQgbm90IGJlIGZvdW5kIG9uIGRldGFpbHMgY29tcG9uZW50OiAnK1RBUkdFVCk7XHJcbiAgICB9XHJcbiAgICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFuZWwgZm9yIERldGFpbHMgY29tcG9uZW50IGNvdWxkIG5vdCBiZSBmb3VuZC4nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsOyAgXHJcbiAgfVxyXG5cclxuICBoaWRlKCl7XHJcbiAgICB0b2dnbGUodGhpcy50cmlnZ2VyRWwpO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpe1xyXG4gICAgdG9nZ2xlKHRoaXMudHJpZ2dlckVsKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGFjY29yZGlvbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gcGFyZW50IGFjY29yZGlvbiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPFNWR0VsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxFbGVtZW50Pn1cclxuICovXHJcbmxldCBnZXRCdXR0b25zID0gZnVuY3Rpb24gKHBhcmVudCkge1xyXG4gIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG59O1xyXG5cclxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XHJcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudENsb3NlLmluaXRFdmVudChldmVudENsb3NlTmFtZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG4gIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcclxuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XHJcbiAgICBsZXQgY3VycmVudE92ZXJmbG93TWVudUVMID0gb3ZlcmZsb3dNZW51RWxbIG9pIF07XHJcbiAgICBsZXQgdHJpZ2dlckVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCl7XHJcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICBsZXQgdGFyZ2V0RWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcignIycrdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpLnJlcGxhY2UoJyMnLCAnJykpO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0RWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpKXtcclxuICAgICAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZihjaGFuZ2VkICYmIGV2ZW50ICE9PSBudWxsKXtcclxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufTtcclxubGV0IG9mZnNldCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xyXG59O1xyXG5cclxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICB0b2dnbGUodGhpcywgZm9yY2VDbG9zZSk7XHJcblxyXG59O1xyXG5cclxubGV0IHRvZ2dsZSA9IGZ1bmN0aW9uKGJ1dHRvbiwgZm9yY2VDbG9zZSA9IGZhbHNlKXtcclxuICBcclxuICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KGV2ZW50Q2xvc2VOYW1lLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgbGV0IGV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gIGV2ZW50T3Blbi5pbml0RXZlbnQoZXZlbnRPcGVuTmFtZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgbGV0IHRyaWdnZXJFbCA9IGJ1dHRvbjtcclxuICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAvL2NoYW5nZSBzdGF0ZVxyXG5cclxuICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xyXG4gICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSBudWxsO1xyXG5cclxuICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IGZvcmNlQ2xvc2Upe1xyXG4gICAgICAvL2Nsb3NlXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICAvL29wZW5cclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJpZ2h0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0QWdhaW4gPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgaGFzUGFyZW50ID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnRUYWdOYW1lKXtcclxuICBpZihjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IHBhcmVudFRhZ05hbWUpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmKHBhcmVudFRhZ05hbWUgIT09ICdCT0RZJyAmJiBjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdCT0RZJyl7XHJcbiAgICByZXR1cm4gaGFzUGFyZW50KGNoaWxkLnBhcmVudE5vZGUsIHBhcmVudFRhZ05hbWUpO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcclxuICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwpIHtcclxuICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWRyb3Bkb3duW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1tpXTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgIGlmICh0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmKHRhcmdldEF0dHIuaW5kZXhPZignIycpICE9PSAtMSl7XHJcbiAgICAgICAgICB0YXJnZXRBdHRyID0gdGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpIHx8IChoYXNQYXJlbnQodHJpZ2dlckVsLCAnSEVBREVSJykgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVybGF5JykpKSB7XHJcbiAgICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGVcclxuICAgICAgICBpZiAoZXZ0LnRhcmdldCAhPT0gdHJpZ2dlckVsKSB7XHJcbiAgICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxyXG4gICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgICAgICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGRvUmVzcG9uc2l2ZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCl7XHJcbiAgaWYoIXRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoanNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIpKXtcclxuICAgIC8vIG5vdCBuYXYgb3ZlcmZsb3cgbWVudVxyXG4gICAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpIHtcclxuICAgICAgLy8gdHJpbmluZGlrYXRvciBvdmVyZmxvdyBtZW51XHJcbiAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBnZXRUcmluZ3VpZGVCcmVha3BvaW50KHRyaWdnZXJFbCkpIHtcclxuICAgICAgICAvLyBvdmVyZmxvdyBtZW51IHDDpSByZXNwb25zaXYgdHJpbmd1aWRlIGFrdGl2ZXJldFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2V7XHJcbiAgICAgIC8vIG5vcm1hbCBvdmVyZmxvdyBtZW51XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubGV0IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoYnV0dG9uKXtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubWQ7XHJcbiAgfVxyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5sZztcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duO1xyXG4iLCJcclxuXHJcbmZ1bmN0aW9uIEVycm9yU3VtbWFyeSAoJG1vZHVsZSkge1xyXG4gIHRoaXMuJG1vZHVsZSA9ICRtb2R1bGVcclxufVxyXG5cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcy4kbW9kdWxlXHJcbiAgaWYgKCEkbW9kdWxlKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgJG1vZHVsZS5mb2N1cygpXHJcblxyXG4gICRtb2R1bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcykpXHJcbn1cclxuXHJcbi8qKlxyXG4qIENsaWNrIGV2ZW50IGhhbmRsZXJcclxuKlxyXG4qIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBDbGljayBldmVudFxyXG4qL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldFxyXG4gIGlmICh0aGlzLmZvY3VzVGFyZ2V0KHRhcmdldCkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb2N1cyB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuICpcclxuICogQnkgZGVmYXVsdCwgdGhlIGJyb3dzZXIgd2lsbCBzY3JvbGwgdGhlIHRhcmdldCBpbnRvIHZpZXcuIEJlY2F1c2Ugb3VyIGxhYmVsc1xyXG4gKiBvciBsZWdlbmRzIGFwcGVhciBhYm92ZSB0aGUgaW5wdXQsIHRoaXMgbWVhbnMgdGhlIHVzZXIgd2lsbCBiZSBwcmVzZW50ZWQgd2l0aFxyXG4gKiBhbiBpbnB1dCB3aXRob3V0IGFueSBjb250ZXh0LCBhcyB0aGUgbGFiZWwgb3IgbGVnZW5kIHdpbGwgYmUgb2ZmIHRoZSB0b3Agb2ZcclxuICogdGhlIHNjcmVlbi5cclxuICpcclxuICogTWFudWFsbHkgaGFuZGxpbmcgdGhlIGNsaWNrIGV2ZW50LCBzY3JvbGxpbmcgdGhlIHF1ZXN0aW9uIGludG8gdmlldyBhbmQgdGhlblxyXG4gKiBmb2N1c3NpbmcgdGhlIGVsZW1lbnQgc29sdmVzIHRoaXMuXHJcbiAqXHJcbiAqIFRoaXMgYWxzbyByZXN1bHRzIGluIHRoZSBsYWJlbCBhbmQvb3IgbGVnZW5kIGJlaW5nIGFubm91bmNlZCBjb3JyZWN0bHkgaW5cclxuICogTlZEQSAoYXMgdGVzdGVkIGluIDIwMTguMy4yKSAtIHdpdGhvdXQgdGhpcyBvbmx5IHRoZSBmaWVsZCB0eXBlIGlzIGFubm91bmNlZFxyXG4gKiAoZS5nLiBcIkVkaXQsIGhhcyBhdXRvY29tcGxldGVcIikuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICR0YXJnZXQgLSBFdmVudCB0YXJnZXRcclxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHRhcmdldCB3YXMgYWJsZSB0byBiZSBmb2N1c3NlZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5mb2N1c1RhcmdldCA9IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XHJcbiAgLy8gSWYgdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCB3YXMgbm90IGEgbGluaywgcmV0dXJuIGVhcmx5XHJcbiAgaWYgKCR0YXJnZXQudGFnTmFtZSAhPT0gJ0EnIHx8ICR0YXJnZXQuaHJlZiA9PT0gZmFsc2UpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgdmFyIGlucHV0SWQgPSB0aGlzLmdldEZyYWdtZW50RnJvbVVybCgkdGFyZ2V0LmhyZWYpXHJcbiAgdmFyICRpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpXHJcbiAgaWYgKCEkaW5wdXQpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgdmFyICRsZWdlbmRPckxhYmVsID0gdGhpcy5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCgkaW5wdXQpXHJcbiAgaWYgKCEkbGVnZW5kT3JMYWJlbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvLyBTY3JvbGwgdGhlIGxlZ2VuZCBvciBsYWJlbCBpbnRvIHZpZXcgKmJlZm9yZSogY2FsbGluZyBmb2N1cyBvbiB0aGUgaW5wdXQgdG9cclxuICAvLyBhdm9pZCBleHRyYSBzY3JvbGxpbmcgaW4gYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGBwcmV2ZW50U2Nyb2xsYCAod2hpY2hcclxuICAvLyBhdCB0aW1lIG9mIHdyaXRpbmcgaXMgbW9zdCBvZiB0aGVtLi4uKVxyXG4gICRsZWdlbmRPckxhYmVsLnNjcm9sbEludG9WaWV3KClcclxuICAkaW5wdXQuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pXHJcblxyXG4gIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZnJhZ21lbnQgZnJvbSBVUkxcclxuICpcclxuICogRXh0cmFjdCB0aGUgZnJhZ21lbnQgKGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGhhc2gpIGZyb20gYSBVUkwsIGJ1dCBub3QgaW5jbHVkaW5nXHJcbiAqIHRoZSBoYXNoLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVVJMXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEZyYWdtZW50IGZyb20gVVJMLCB3aXRob3V0IHRoZSBoYXNoXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEZyYWdtZW50RnJvbVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICBpZiAodXJsLmluZGV4T2YoJyMnKSA9PT0gLTEpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVybC5zcGxpdCgnIycpLnBvcCgpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWxcclxuICpcclxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGV4aXN0cyBmcm9tIHRoaXMgbGlzdDpcclxuICpcclxuICogLSBUaGUgYDxsZWdlbmQ+YCBhc3NvY2lhdGVkIHdpdGggdGhlIGNsb3Nlc3QgYDxmaWVsZHNldD5gIGFuY2VzdG9yLCBhcyBsb25nXHJcbiAqICAgYXMgdGhlIHRvcCBvZiBpdCBpcyBubyBtb3JlIHRoYW4gaGFsZiBhIHZpZXdwb3J0IGhlaWdodCBhd2F5IGZyb20gdGhlXHJcbiAqICAgYm90dG9tIG9mIHRoZSBpbnB1dFxyXG4gKiAtIFRoZSBmaXJzdCBgPGxhYmVsPmAgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0IHVzaW5nIGZvcj1cImlucHV0SWRcIlxyXG4gKiAtIFRoZSBjbG9zZXN0IHBhcmVudCBgPGxhYmVsPmBcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGlucHV0IC0gVGhlIGlucHV0XHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gQXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWwsIG9yIG51bGwgaWYgbm8gYXNzb2NpYXRlZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZCBvciBsYWJlbCBjYW4gYmUgZm91bmRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwgPSBmdW5jdGlvbiAoJGlucHV0KSB7XHJcbiAgdmFyICRmaWVsZHNldCA9ICRpbnB1dC5jbG9zZXN0KCdmaWVsZHNldCcpXHJcblxyXG4gIGlmICgkZmllbGRzZXQpIHtcclxuICAgIHZhciBsZWdlbmRzID0gJGZpZWxkc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsZWdlbmQnKVxyXG5cclxuICAgIGlmIChsZWdlbmRzLmxlbmd0aCkge1xyXG4gICAgICB2YXIgJGNhbmRpZGF0ZUxlZ2VuZCA9IGxlZ2VuZHNbMF1cclxuXHJcbiAgICAgIC8vIElmIHRoZSBpbnB1dCB0eXBlIGlzIHJhZGlvIG9yIGNoZWNrYm94LCBhbHdheXMgdXNlIHRoZSBsZWdlbmQgaWYgdGhlcmVcclxuICAgICAgLy8gaXMgb25lLlxyXG4gICAgICBpZiAoJGlucHV0LnR5cGUgPT09ICdjaGVja2JveCcgfHwgJGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcclxuICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGb3Igb3RoZXIgaW5wdXQgdHlwZXMsIG9ubHkgc2Nyb2xsIHRvIHRoZSBmaWVsZHNldOKAmXMgbGVnZW5kIChpbnN0ZWFkIG9mXHJcbiAgICAgIC8vIHRoZSBsYWJlbCBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0KSBpZiB0aGUgaW5wdXQgd291bGQgZW5kIHVwIGluIHRoZVxyXG4gICAgICAvLyB0b3AgaGFsZiBvZiB0aGUgc2NyZWVuLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBUaGlzIHNob3VsZCBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIHRoZSBpbnB1dCBlaXRoZXIgZW5kcyB1cCBvZmYgdGhlXHJcbiAgICAgIC8vIHNjcmVlbiwgb3Igb2JzY3VyZWQgYnkgYSBzb2Z0d2FyZSBrZXlib2FyZC5cclxuICAgICAgdmFyIGxlZ2VuZFRvcCA9ICRjYW5kaWRhdGVMZWdlbmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXHJcbiAgICAgIHZhciBpbnB1dFJlY3QgPSAkaW5wdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgICAgIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxyXG4gICAgICAvLyBvciB3aW5kb3cuaW5uZXJIZWlnaHQgKGxpa2UgSUU4KSwgYmFpbCBhbmQganVzdCBsaW5rIHRvIHRoZSBsYWJlbC5cclxuICAgICAgaWYgKGlucHV0UmVjdC5oZWlnaHQgJiYgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdmFyIGlucHV0Qm90dG9tID0gaW5wdXRSZWN0LnRvcCArIGlucHV0UmVjdC5oZWlnaHRcclxuXHJcbiAgICAgICAgaWYgKGlucHV0Qm90dG9tIC0gbGVnZW5kVG9wIDwgd2luZG93LmlubmVySGVpZ2h0IC8gMikge1xyXG4gICAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGFiZWxbZm9yPSdcIiArICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyBcIiddXCIpIHx8XHJcbiAgICAkaW5wdXQuY2xvc2VzdCgnbGFiZWwnKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFcnJvclN1bW1hcnkiLCJcclxuZnVuY3Rpb24gTW9kYWwgKCRtb2RhbCl7XHJcbiAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XHJcbiAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJtb2RhbFwiXVtkYXRhLXRhcmdldD1cIicraWQrJ1wiXScpO1xyXG4gIHdpbmRvdy5tb2RhbCA9IHtcImxhc3RGb2N1c1wiOiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LCBcImlnbm9yZVV0aWxGb2N1c0NoYW5nZXNcIjogZmFsc2V9O1xyXG59XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLm1vZGFsLmhpZGRlbicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy50cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuICAgIHdpbmRvdy5tb2RhbC5sYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy50cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuXHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgaWYgKGtleSA9PT0gMjcpe1xyXG4gICAgbGV0IHBvc3NpYmxlT3ZlcmZsb3dNZW51cyA9IG1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLW92ZXJmbG93LW1lbnVbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHBvc3NpYmxlT3ZlcmZsb3dNZW51cy5sZW5ndGggPT09IDApe1xyXG4gICAgICBjdXJyZW50TW9kYWwuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUudHJhcEZvY3VzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgaWYgKHdpbmRvdy5tb2RhbC5pZ25vcmVVdGlsRm9jdXNDaGFuZ2VzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50RGlhbG9nID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gICAgaWYgKGN1cnJlbnREaWFsb2cuJG1vZGFsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWNvbnRlbnQnKVswXS5jb250YWlucyhldmVudC50YXJnZXQpIHx8IGN1cnJlbnREaWFsb2cuJG1vZGFsID09IGV2ZW50LnRhcmdldCkge1xyXG4gICAgICB3aW5kb3cubW9kYWwubGFzdEZvY3VzID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGN1cnJlbnREaWFsb2cuZm9jdXNGaXJzdERlc2NlbmRhbnQoY3VycmVudERpYWxvZy4kbW9kYWwpO1xyXG4gICAgICBpZiAod2luZG93Lm1vZGFsLmxhc3RGb2N1cyA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgY3VycmVudERpYWxvZy5mb2N1c0xhc3REZXNjZW5kYW50KGN1cnJlbnREaWFsb2cuJG1vZGFsKTtcclxuICAgICAgfVxyXG4gICAgICB3aW5kb3cubW9kYWwubGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5pc0ZvY3VzYWJsZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgaWYgKGVsZW1lbnQudGFiSW5kZXggPiAwIHx8IChlbGVtZW50LnRhYkluZGV4ID09PSAwICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJJbmRleCcpICE9PSBudWxsKSkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoZWxlbWVudC5kaXNhYmxlZCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgc3dpdGNoIChlbGVtZW50Lm5vZGVOYW1lKSB7XHJcbiAgICBjYXNlICdBJzpcclxuICAgICAgcmV0dXJuICEhZWxlbWVudC5ocmVmICYmIGVsZW1lbnQucmVsICE9ICdpZ25vcmUnO1xyXG4gICAgY2FzZSAnSU5QVVQnOlxyXG4gICAgICByZXR1cm4gZWxlbWVudC50eXBlICE9ICdoaWRkZW4nICYmIGVsZW1lbnQudHlwZSAhPSAnZmlsZSc7XHJcbiAgICBjYXNlICdCVVRUT04nOlxyXG4gICAgY2FzZSAnU0VMRUNUJzpcclxuICAgIGNhc2UgJ1RFWFRBUkVBJzpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5mb2N1c0ZpcnN0RGVzY2VuZGFudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuY2hpbGROb2Rlc1tpXTtcclxuICAgIGlmICh0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHxcclxuICAgICAgdGhpcy5mb2N1c0ZpcnN0RGVzY2VuZGFudChjaGlsZCkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuZm9jdXNMYXN0RGVzY2VuZGFudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgZm9yICh2YXIgaSA9IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgdmFyIGNoaWxkID0gZWxlbWVudC5jaGlsZE5vZGVzW2ldO1xyXG4gICAgaWYgKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fFxyXG4gICAgICB0aGlzLmZvY3VzTGFzdERlc2NlbmRhbnQoY2hpbGQpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuYXR0ZW1wdEZvY3VzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBpZiAoIXRoaXMuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5tb2RhbC5pZ25vcmVVdGlsRm9jdXNDaGFuZ2VzID0gdHJ1ZTtcclxuICB0cnkge1xyXG4gICAgZWxlbWVudC5mb2N1cygpO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gIH1cclxuICB3aW5kb3cubW9kYWwuaWdub3JlVXRpbEZvY3VzQ2hhbmdlcyA9IGZhbHNlO1xyXG4gIHJldHVybiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWxlbWVudCk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTW9kYWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGRyb3Bkb3duID0gcmVxdWlyZSgnLi9kcm9wZG93bicpO1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuXHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgbGV0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChrZXkgPT09IDkpIHtcclxuXHJcbiAgICAgIGxldCBsYXN0VGFiU3RvcCA9IG51bGw7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1sgbnVtYmVyIC0gaSBdO1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wID0gZWxlbWVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcclxuXHJcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gIGxldCBvcGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChPUEVORVJTKTtcclxuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xyXG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIG9wZW5lcnNbb10uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgICBtb2JpbGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYobW9iaWxlKXtcclxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgIGNsb3NlcnNbIGMgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVZfTElOS1MpO1xyXG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxyXG5cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyYXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVYpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRyYXBDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY2xhc3MgTmF2aWdhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IgKCl7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplLCBmYWxzZSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGluaXQgKCkge1xyXG5cclxuICAgIHJlc2l6ZSgpO1xyXG4gIH1cclxuXHJcbiAgdGVhcmRvd24gKCkge1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBSYWRpb1RvZ2dsZUdyb3Vwe1xyXG4gICAgY29uc3RydWN0b3IoZWwpe1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1yYWRpby10b2dnbGUtZ3JvdXAnO1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCAoZWwpe1xyXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICAgICAgaWYodGhpcy5yYWRpb0Vscy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJhZGlvYnV0dG9ucyBmb3VuZCBpbiByYWRpb2J1dHRvbiBncm91cC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUgKHRyaWdnZXJFbCl7XHJcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpO1xyXG4gICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEF0dHIgIT09IFwiXCIpe1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyB0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYWRpb1RvZ2dsZUdyb3VwO1xyXG4iLCIvKlxyXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXHJcbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LlxyXG4qIFVzZWNhc2U6IG51bWJlciBpbnB1dCBmb3IgZGF0ZS1jb21wb25lbnQuXHJcbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XHJcbiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XHJcbiAgc2hpZnQ6IGZhbHNlLFxyXG4gIGFsdDogZmFsc2UsXHJcbiAgY3RybDogZmFsc2UsXHJcbiAgY29tbWFuZDogZmFsc2VcclxufTtcclxuXHJcbmNsYXNzIElucHV0UmVnZXhNYXNrIHtcclxuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgcmVnZXhNYXNrKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJlZ2V4TWFzayk7XHJcbiAgfVxyXG59XHJcbnZhciByZWdleE1hc2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFJlZ2V4TWFzaztcclxuIiwibGV0IGRrID0ge1xyXG4gIFwic2VsZWN0X3Jvd1wiOiBcIlbDpmxnIHLDpmtrZVwiLFxyXG4gIFwidW5zZWxlY3Rfcm93XCI6IFwiRnJhdsOmbGcgcsOma2tlXCIsXHJcbiAgXCJzZWxlY3RfYWxsX3Jvd3NcIjogXCJWw6ZsZyBhbGxlIHLDpmtrZXJcIixcclxuICBcInVuc2VsZWN0X2FsbF9yb3dzXCI6IFwiRnJhdsOmbGcgYWxsZSByw6Zra2VyXCJcclxufVxyXG5cclxuY2xhc3MgVGFibGVTZWxlY3RhYmxlUm93cyB7XHJcbiAgY29uc3RydWN0b3IgKHRhYmxlLCBzdHJpbmdzID0gZGspIHtcclxuICAgIHRoaXMudGFibGUgPSB0YWJsZTtcclxuICAgIGRrID0gc3RyaW5ncztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICAgKi9cclxuICBpbml0KCl7XHJcbiAgICB0aGlzLmdyb3VwQ2hlY2tib3ggPSB0aGlzLmdldEdyb3VwQ2hlY2tib3goKTtcclxuICAgIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gICAgaWYodGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGggIT09IDApe1xyXG4gICAgICBmb3IobGV0IGMgPSAwOyBjIDwgdGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgICBjaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5ncm91cENoZWNrYm94ICE9PSBmYWxzZSl7XHJcbiAgICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgICB0aGlzLmdyb3VwQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLyoqXHJcbiAgICogR2V0IGdyb3VwIGNoZWNrYm94IGluIHRhYmxlIGhlYWRlclxyXG4gICAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gICAqL1xyXG4gIGdldEdyb3VwQ2hlY2tib3goKXtcclxuICAgIGxldCBjaGVja2JveCA9IHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xyXG4gICAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAgICogQHJldHVybnMgSFRNTENvbGxlY3Rpb25cclxuICAgKi9cclxuICBnZXRDaGVja2JveExpc3QoKXtcclxuICAgIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgY2hlY2tib3hlcyBpbiB0YWJsZSBib2R5IHdoZW4gZ3JvdXAgY2hlY2tib3ggaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQ2hlY2tib3hMaXN0KGUpe1xyXG4gIGxldCBjaGVja2JveCA9IGUudGFyZ2V0O1xyXG4gIGNoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgY2hlY2tib3hMaXN0ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRDaGVja2JveExpc3QoKTtcclxuICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgaWYoY2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X3Jvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tlZE51bWJlciA9IGNoZWNrYm94TGlzdC5sZW5ndGg7XHJcbiAgICBjaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gIH0gZWxzZXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9yb3cpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgfSk7XHJcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgZ3JvdXAgY2hlY2tib3ggd2hlbiBjaGVja2JveCBpbiB0YWJsZSBib2R5IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyb3VwQ2hlY2soZSl7XHJcbiAgLy8gdXBkYXRlIGxhYmVsIGZvciBldmVudCBjaGVja2JveFxyXG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X3Jvdyk7XHJcbiAgfSBlbHNle1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9yb3cpO1xyXG4gIH1cclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBncm91cENoZWNrYm94ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgaWYoZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcblxyXG4gICAgLy8gaG93IG1hbnkgcm93IGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGxvb3BlZENoZWNrYm94ID0gY2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBpZihsb29wZWRDaGVja2JveC5jaGVja2VkKXtcclxuICAgICAgICBjaGVja2VkTnVtYmVyKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoY2hlY2tlZE51bWJlciA9PT0gY2hlY2tib3hMaXN0Lmxlbmd0aCl7IC8vIGlmIGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfSBlbHNlIGlmKGNoZWNrZWROdW1iZXIgPT0gMCl7IC8vIGlmIG5vIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH0gZWxzZXsgLy8gaWYgc29tZSBidXQgbm90IGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3guc2V0QXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnLCAnbWl4ZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxyXG4gICAgfSk7XHJcbiAgICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFibGVTZWxlY3RhYmxlUm93cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xyXG5cclxuY2xhc3MgU2V0VGFiSW5kZXgge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcclxuICAgICAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxyXG4gICAgICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXHJcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zbGljZSgxKTtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uY2UoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRocm93IGFuIGVycm9yP1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2V0VGFiSW5kZXg7XHJcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcclxuICAgICAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xyXG4gICAgICAgIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgIGxldCBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcclxuICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cclxuICAgICAgICAgICAgICAgICAgaWYoIWNlbGxFbHNbIGkgXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5jbGFzcyBUYWJuYXYge1xyXG5cclxuICBjb25zdHJ1Y3RvciAodGFibmF2KSB7XHJcbiAgICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcclxuICAgIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gICAgaWYodGhpcy50YWJzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gICAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcclxuICAgICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICAgIGxldCBhbHJlYWR5QWN0aXZlID0gZ2V0QWN0aXZlVGFicyh0aGlzLnRhYm5hdik7XHJcbiAgICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgZXZlbnRsaXN0ZW5lcnMgb24gYnV0dG9uc1xyXG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgICBhZGRMaXN0ZW5lcnModGhpcy50YWJzWyB0IF0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnMgKHRhYikge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcclxufVxyXG5cclxuLy8gV2hlbiBhIHRhYiBpcyBjbGlja2VkLCBhY3RpdmF0ZVRhYiBpcyBmaXJlZCB0byBhY3RpdmF0ZSBpdFxyXG5mdW5jdGlvbiBjbGlja0V2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgdmFyIHRhYiA9IHRoaXM7XHJcbiAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbn1cclxuXHJcblxyXG4vLyBIYW5kbGUga2V5ZG93biBvbiB0YWJzXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBIYW5kbGUga2V5dXAgb24gdGFic1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBhY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuLy8gV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbi8vIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4vLyBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcclxuLy8gZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKipcclxuICogQWN0aXZhdGUvc2hvdyB0YWIgYW5kIGhpZGUgb3RoZXJzXHJcbiAqIEBwYXJhbSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGFjdGl2YXRlVGFiICh0YWIsIHNldEZvY3VzKSB7XHJcbiAgZGVhY3RpdmF0ZUFsbFRhYnNFeGNlcHQodGFiKTtcclxuXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgb3V0cHV0RXZlbnQodGFiLCAnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgb3V0cHV0RXZlbnQodGFiLnBhcmVudE5vZGUsICdmZHMudGFibmF2Lm9wZW4nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlYWN0aXZhdGUgYWxsIHRhYnMgaW4gbGlzdCBleGNlcHQgdGhlIG9uZSBwYXNzZWRcclxuICogQHBhcmFtIGFjdGl2ZVRhYiBidXR0b24gdGFiIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGRlYWN0aXZhdGVBbGxUYWJzRXhjZXB0IChhY3RpdmVUYWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QoYWN0aXZlVGFiKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgdGFiID0gdGFic1sgaSBdO1xyXG4gICAgaWYgKHRhYiA9PT0gYWN0aXZlVGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBvdXRwdXRFdmVudCh0YWIsICdmZHMudGFibmF2LmNsb3NlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcclxuICAgIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YWJwYW5lbC5gKTtcclxuICAgIH1cclxuICAgIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIG91dHB1dCBhbiBldmVudCBvbiB0aGUgcGFzc2VkIGVsZW1lbnRcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHBhcmFtIGV2ZW50TmFtZVxyXG4gKi9cclxuZnVuY3Rpb24gb3V0cHV0RXZlbnQgKGVsZW1lbnQsIGV2ZW50TmFtZSkge1xyXG4gIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gIGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpO1xyXG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8vIE1ha2UgYSBndWVzc1xyXG5mdW5jdGlvbiBmb2N1c0ZpcnN0VGFiICh0YWIpIHtcclxuICBnZXRBbGxUYWJzSW5MaXN0KHRhYilbIDAgXS5mb2N1cygpO1xyXG59XHJcblxyXG4vLyBNYWtlIGEgZ3Vlc3NcclxuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJuYXY7XHJcbiIsImNsYXNzIFRvYXN0e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBuZXcgVG9hc3QodG9hc3QpLmhpZGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCl7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dUb2FzdCgpe1xyXG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XHJcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdG9hc3RzLmxlbmd0aDsgdCsrKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0b2FzdHNbdF07XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2FzdDtcclxuIiwiY2xhc3MgVG9vbHRpcHtcclxuICBjb25zdHJ1Y3RvcihlbGVtZW50KXtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVG9vbHRpcCB0ZXh0IGlzIG1pc3NpbmcuIEFkZCBhdHRyaWJ1dGUgZGF0YS10b29sdGlwIGFuZCB0aGUgY29udGVudCBvZiB0aGUgdG9vbHRpcCBhcyB2YWx1ZS5gKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0RXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBzZXRFdmVudHMgKCl7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBcclxuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKXtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuXHJcbiAgICAgICAgICAgIHRoYXQucG9zaXRpb25BdChlbGVtZW50LCB0b29sdGlwLCBwb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDMwMCk7XHJcblxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgdHJpZ2dlciA9IHRoaXM7XHJcbiAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgaWYoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICAgIGlmKHRvb2x0aXAgIT09IG51bGwgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC10cmlnZ2VyJykgPT09ICdjbGljaycpe1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhhdC5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG4gICAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBpZiAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXRvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWNvbnRlbnQnKSkge1xyXG4gICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY2xvc2VBbGwgKCl7XHJcbiAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBlbGVtZW50c1sgaSBdLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjcmVhdGVUb29sdGlwIChlbGVtZW50LCBwb3MpIHtcclxuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgICB2YXIgcG9wcGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZCk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgICB2YXIgdG9vbHRpcEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQXJyb3cuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtYXJyb3cnO1xyXG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQ29udGVudC5jbGFzc05hbWUgPSAndG9vbHRpcC1jb250ZW50JztcclxuICAgIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQ29udGVudCk7XHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKHRvb2x0aXBJbm5lcik7XHJcblxyXG4gICAgcmV0dXJuIHRvb2x0aXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyZW50IC0gVGhlIHRyaWdnZXIgb2YgdGhlIHRvb2x0aXAuXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc1ZlcnRpY2FsIC0gRGVzaXJlZCB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyICh0b3AvY2VudGVyL2JvdHRvbSlcclxuICAgKlxyXG4gICAqL1xyXG4gIHBvc2l0aW9uQXQgKHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gICAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIFxyXG4gICAgdmFyIHBhcmVudENvb3JkcyA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbGVmdCwgdG9wO1xyXG5cclxuICAgIHZhciB0b29sdGlwV2lkdGggPSB0b29sdGlwLm9mZnNldFdpZHRoO1xyXG5cclxuICAgIHZhciBkaXN0ID0gMTI7XHJcbiAgICBsZXQgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCkgKyAoKHBhcmVudC5vZmZzZXRXaWR0aCAtIHRvb2x0aXAub2Zmc2V0V2lkdGgpIC8gMik7XHJcblxyXG4gICAgc3dpdGNoIChwb3MpIHtcclxuICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICAgIGlmKGxlZnQgPCAwKSB7XHJcbiAgICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbisncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFxyXG4gICAgaWYoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKHRvcCA8IDApIHtcclxuICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICAgIH1cclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKXtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ucmlnaHQgLSAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5yaWdodCA9IGFycm93UmlnaHRQb3NpdGlvbisncHgnO1xyXG4gICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICB9XHJcbiAgICB0b29sdGlwLnN0eWxlLnRvcCAgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5jbGFzc0xpc3QuYWRkKGFycm93RGlyZWN0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcHJlZml4OiAnJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb2xsYXBzZScpO1xyXG5jb25zdCBSYWRpb1RvZ2dsZUdyb3VwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XHJcbmNvbnN0IENoZWNrYm94VG9nZ2xlQ29udGVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG5jb25zdCBEcm9wZG93biA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kcm9wZG93bicpO1xyXG5jb25zdCBBY2NvcmRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XHJcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RvYXN0Jyk7XHJcbmNvbnN0IFJlc3BvbnNpdmVUYWJsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJsZScpO1xyXG5jb25zdCBUYWJsZVNlbGVjdGFibGVSb3dzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUnKTtcclxuY29uc3QgVGFibmF2ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYm5hdicpO1xyXG4vL2NvbnN0IERldGFpbHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGV0YWlscycpO1xyXG5jb25zdCBUb29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcclxuY29uc3QgU2V0VGFiSW5kZXggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2tpcG5hdicpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdmlnYXRpb24nKTtcclxuY29uc3QgSW5wdXRSZWdleE1hc2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzaycpO1xyXG5pbXBvcnQgRGV0YWlscyBmcm9tICcuL2NvbXBvbmVudHMvZGV0YWlscyc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmNvbnN0IGRhdGVQaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXInKTtcclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxudmFyIGluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIC8vIFNldCB0aGUgb3B0aW9ucyB0byBhbiBlbXB0eSBvYmplY3QgYnkgZGVmYXVsdCBpZiBubyBvcHRpb25zIGFyZSBwYXNzZWQuXHJcbiAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fVxyXG5cclxuICAvLyBBbGxvdyB0aGUgdXNlciB0byBpbml0aWFsaXNlIEZEUyBpbiBvbmx5IGNlcnRhaW4gc2VjdGlvbnMgb2YgdGhlIHBhZ2VcclxuICAvLyBEZWZhdWx0cyB0byB0aGUgZW50aXJlIGRvY3VtZW50IGlmIG5vdGhpbmcgaXMgc2V0LlxyXG4gIHZhciBzY29wZSA9IHR5cGVvZiBvcHRpb25zLnNjb3BlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2NvcGUgOiBkb2N1bWVudFxyXG5cclxuICBkYXRlUGlja2VyLm9uKHNjb3BlKTtcclxuXHJcbiAgY29uc3QgZGV0YWlscyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1kZXRhaWxzJyk7XHJcbiAgZm9yKGxldCBkID0gMDsgZCA8IGRldGFpbHMubGVuZ3RoOyBkKyspe1xyXG4gICAgbmV3IERldGFpbHMoZGV0YWlsc1sgZCBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IElucHV0UmVnZXhNYXNrKGpzU2VsZWN0b3JSZWdleFsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvclRhYmluZGV4ID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLnNraXBuYXZbaHJlZl49XCIjXCJdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJpbmRleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgU2V0VGFiSW5kZXgoanNTZWxlY3RvclRhYmluZGV4WyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yVG9vbHRpcCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXRvb2x0aXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRvb2x0aXAubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJuYXYgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWJuYXYnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYm5hdi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibmF2KGpzU2VsZWN0b3JUYWJuYXZbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJvcmRlcmVkOm5vdCguYWNjb3JkaW9uKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWRbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdGFibGVUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlLnRhYmxlLS1zZWxlY3RhYmxlJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0YWJsZVRhYmxlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKGpzU2VsZWN0YWJsZVRhYmxlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQ29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jb2xsYXBzZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENvbGxhcHNlKGpzU2VsZWN0b3JDb2xsYXBzZVsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duU29ydCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUtLXNvcnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duU29ydC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd25Tb3J0KGpzU2VsZWN0b3JEcm9wZG93blNvcnRbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSk7XHJcbiAgfVxyXG5cclxuICB2YXIgbW9kYWxzID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbCcpO1xyXG4gIGZvcihsZXQgZCA9IDA7IGQgPCBtb2RhbHMubGVuZ3RoOyBkKyspIHtcclxuICAgIG5ldyBNb2RhbChtb2RhbHNbZF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8vIEZpbmQgZmlyc3QgZXJyb3Igc3VtbWFyeSBtb2R1bGUgdG8gZW5oYW5jZS5cclxuICB2YXIgJGVycm9yU3VtbWFyeSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1vZHVsZT1cImVycm9yLXN1bW1hcnlcIl0nKVxyXG4gIG5ldyBFcnJvclN1bW1hcnkoJGVycm9yU3VtbWFyeSkuaW5pdCgpXHJcblxyXG4gIG5ldyBOYXZpZ2F0aW9uKCk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIENvbGxhcHNlLCBSYWRpb1RvZ2dsZUdyb3VwLCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBEcm9wZG93blNvcnQsIFJlc3BvbnNpdmVUYWJsZSwgQWNjb3JkaW9uLCBUYWJuYXYsIFRvb2x0aXAsIFNldFRhYkluZGV4LCBOYXZpZ2F0aW9uLCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIERldGFpbHMsIGRhdGVQaWNrZXIsIFRvYXN0LCBUYWJsZVNlbGVjdGFibGVSb3dzLCBFcnJvclN1bW1hcnl9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAvLyBUaGlzIHVzZWQgdG8gYmUgY29uZGl0aW9uYWxseSBkZXBlbmRlbnQgb24gd2hldGhlciB0aGVcclxuICAvLyBicm93c2VyIHN1cHBvcnRlZCB0b3VjaCBldmVudHM7IGlmIGl0IGRpZCwgYENMSUNLYCB3YXMgc2V0IHRvXHJcbiAgLy8gYHRvdWNoc3RhcnRgLiAgSG93ZXZlciwgdGhpcyBoYWQgZG93bnNpZGVzOlxyXG4gIC8vXHJcbiAgLy8gKiBJdCBwcmUtZW1wdGVkIG1vYmlsZSBicm93c2VycycgZGVmYXVsdCBiZWhhdmlvciBvZiBkZXRlY3RpbmdcclxuICAvLyAgIHdoZXRoZXIgYSB0b3VjaCB0dXJuZWQgaW50byBhIHNjcm9sbCwgdGhlcmVieSBwcmV2ZW50aW5nXHJcbiAgLy8gICB1c2VycyBmcm9tIHVzaW5nIHNvbWUgb2Ygb3VyIGNvbXBvbmVudHMgYXMgc2Nyb2xsIHN1cmZhY2VzLlxyXG4gIC8vXHJcbiAgLy8gKiBTb21lIGRldmljZXMsIHN1Y2ggYXMgdGhlIE1pY3Jvc29mdCBTdXJmYWNlIFBybywgc3VwcG9ydCAqYm90aCpcclxuICAvLyAgIHRvdWNoIGFuZCBjbGlja3MuIFRoaXMgbWVhbnQgdGhlIGNvbmRpdGlvbmFsIGVmZmVjdGl2ZWx5IGRyb3BwZWRcclxuICAvLyAgIHN1cHBvcnQgZm9yIHRoZSB1c2VyJ3MgbW91c2UsIGZydXN0cmF0aW5nIHVzZXJzIHdobyBwcmVmZXJyZWRcclxuICAvLyAgIGl0IG9uIHRob3NlIHN5c3RlbXMuXHJcbiAgQ0xJQ0s6ICdjbGljaycsXHJcbn07XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXHJcbi8qIGVzbGludC1kaXNhYmxlIGZ1bmMtbmFtZXMgKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBfcGFyYW1zKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBfcGFyYW1zIHx8IHtcclxuICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxyXG4gICAgICBkZXRhaWw6IG51bGwsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtcclxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBwYXJhbXMuYnViYmxlcyxcclxuICAgICAgcGFyYW1zLmNhbmNlbGFibGUsXHJcbiAgICAgIHBhcmFtcy5kZXRhaWxcclxuICAgICk7XHJcbiAgICByZXR1cm4gZXZ0O1xyXG4gIH1cclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XHJcbn0pKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZWxwcm90byA9IHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGU7XHJcbmNvbnN0IEhJRERFTiA9ICdoaWRkZW4nO1xyXG5cclxuaWYgKCEoSElEREVOIGluIGVscHJvdG8pKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVscHJvdG8sIEhJRERFTiwge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShISURERU4pO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEhJRERFTiwgJycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzTGlzdCBhbmQgRE9NVG9rZW5MaXN0XHJcbnJlcXVpcmUoJ2NsYXNzbGlzdC1wb2x5ZmlsbCcpO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGRlblxyXG5yZXF1aXJlKCcuL2VsZW1lbnQtaGlkZGVuJyk7XHJcblxyXG4vLyBwb2x5ZmlsbHMgTnVtYmVyLmlzTmFOKClcclxucmVxdWlyZShcIi4vbnVtYmVyLWlzLW5hblwiKTtcclxuXHJcbi8vIHBvbHlmaWxscyBDdXN0b21FdmVudFxyXG5yZXF1aXJlKFwiLi9jdXN0b20tZXZlbnRcIik7XHJcblxyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24nKTtcclxucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9mcm9tJyk7IiwiTnVtYmVyLmlzTmFOID1cclxuICBOdW1iZXIuaXNOYU4gfHxcclxuICBmdW5jdGlvbiBpc05hTihpbnB1dCkge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxyXG4gICAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dCAhPT0gaW5wdXQ7XHJcbiAgfTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAoaHRtbERvY3VtZW50ID0gZG9jdW1lbnQpID0+IGh0bWxEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKFwib2JqZWN0LWFzc2lnblwiKTtcclxuY29uc3QgQmVoYXZpb3IgPSByZXF1aXJlKFwicmVjZXB0b3IvYmVoYXZpb3JcIik7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VxdWVuY2VcclxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gc2VxIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1xyXG4gKiBAcmV0dXJuIHsgY2xvc3VyZSB9IGNhbGxIb29rc1xyXG4gKi9cclxuLy8gV2UgdXNlIGEgbmFtZWQgZnVuY3Rpb24gaGVyZSBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gaW5oZXJpdCBpdHMgbGV4aWNhbCBzY29wZVxyXG4vLyBmcm9tIHRoZSBiZWhhdmlvciBwcm9wcyBvYmplY3QsIG5vdCBmcm9tIHRoZSBtb2R1bGVcclxuY29uc3Qgc2VxdWVuY2UgPSAoLi4uc2VxKSA9PlxyXG4gIGZ1bmN0aW9uIGNhbGxIb29rcyh0YXJnZXQgPSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICBzZXEuZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpc1ttZXRob2RdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGJlaGF2aW9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3Q/fSBwcm9wc1xyXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGV2ZW50cywgcHJvcHMpID0+XHJcbiAgQmVoYXZpb3IoXHJcbiAgICBldmVudHMsXHJcbiAgICBhc3NpZ24oXHJcbiAgICAgIHtcclxuICAgICAgICBvbjogc2VxdWVuY2UoXCJpbml0XCIsIFwiYWRkXCIpLFxyXG4gICAgICAgIG9mZjogc2VxdWVuY2UoXCJ0ZWFyZG93blwiLCBcInJlbW92ZVwiKSxcclxuICAgICAgfSxcclxuICAgICAgcHJvcHNcclxuICAgIClcclxuICApO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYnJlYWtwb2ludHM7XHJcbiIsIi8vIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgc3RyaW5nLCBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIHRoZSBjb21wb25lbnQgd2l0aG91dFxyXG4vLyBUaGVtIGNvbmZsaWN0aW5nIHdpdGggZWFjaCBvdGhlci5cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzJcclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlSUQgKCkge1xyXG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICBpZiAodHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGQgKz0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8vIHVzZSBoaWdoLXByZWNpc2lvbiB0aW1lciBpZiBhdmFpbGFibGVcclxuICB9XHJcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcclxuICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwXHJcbiAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpXHJcbiAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KVxyXG4gIH0pXHJcbn1cclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIi8vIGlPUyBkZXRlY3Rpb24gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTAzOTg4NS8xNzc3MTBcclxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcclxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxyXG4gICAgIXdpbmRvdy5NU1N0cmVhbVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XHJcbiAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
