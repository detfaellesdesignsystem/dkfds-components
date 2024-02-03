(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DKFDS"] = factory();
	else
		root["DKFDS"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 84:
/***/ ((module) => {

"use strict";
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


module.exports = function forEach (ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i+=1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};


/***/ }),

/***/ 241:
/***/ (() => {

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
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
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
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

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
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
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

}(window.self));

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
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

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

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}


/***/ }),

/***/ 764:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global define, KeyboardEvent, module */

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
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill () {
    if (!('KeyboardEvent' in window) ||
        'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function (x) {
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

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (keyboardeventKeyPolyfill),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})();


/***/ }),

/***/ 670:
/***/ ((module) => {

"use strict";


var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

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


/***/ }),

/***/ 418:
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


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
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
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
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
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


/***/ }),

/***/ 220:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const assign = __webpack_require__(418);
const delegate = __webpack_require__(956);
const delegateAll = __webpack_require__(70);

const DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
const SPACE = ' ';

const getListeners = function(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }

  var options;
  if (typeof handler === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: (typeof handler === 'object')
      ? delegateAll(handler)
      : selector
        ? delegate(selector, handler)
        : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function(_type) {
      return assign({type: _type}, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};

var popKey = function(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};

module.exports = function behavior(events, props) {
  const listeners = Object.keys(events)
    .reduce(function(memo, type) {
      var listeners = getListeners(type, events[type]);
      return memo.concat(listeners);
    }, []);

  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function(listener) {
        element.addEventListener(
          listener.type,
          listener.delegate,
          listener.options
        );
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function(listener) {
        element.removeEventListener(
          listener.type,
          listener.delegate,
          listener.options
        );
      });
    }
  }, props);
};


/***/ }),

/***/ 525:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const matches = __webpack_require__(670);

module.exports = function(element, selector) {
  do {
    if (matches(element, selector)) {
      return element;
    }
  } while ((element = element.parentNode) && element.nodeType === 1);
};



/***/ }),

/***/ 787:
/***/ ((module) => {

module.exports = function compose(functions) {
  return function(e) {
    return functions.some(function(fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};


/***/ }),

/***/ 956:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const closest = __webpack_require__(525);

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = closest(event.target, selector);
    if (target) {
      return fn.call(target, event);
    }
  }
};


/***/ }),

/***/ 70:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const delegate = __webpack_require__(956);
const compose = __webpack_require__(787);

const SPLAT = '*';

module.exports = function delegateAll(selectors) {
  const keys = Object.keys(selectors)

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  const delegates = keys.reduce(function(memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};


/***/ }),

/***/ 435:
/***/ ((module) => {

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};


/***/ }),

/***/ 425:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = {
  behavior: __webpack_require__(220),
  delegate: __webpack_require__(956),
  delegateAll: __webpack_require__(70),
  ignore: __webpack_require__(435),
  keymap: __webpack_require__(715),
};


/***/ }),

/***/ 715:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(764);

// these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>
const MODIFIERS = {
  'Alt':      'altKey',
  'Control':  'ctrlKey',
  'Ctrl':     'ctrlKey',
  'Shift':    'shiftKey'
};

const MODIFIER_SEPARATOR = '+';

const getEventKey = function(event, hasModifiers) {
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
  const hasModifiers = Object.keys(keys).some(function(key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function(event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()]
      .reduce(function(result, _key) {
        if (_key in keys) {
          result = keys[key].call(this, event);
        }
        return result;
      }, undefined);
  };
};

module.exports.MODIFIERS = MODIFIERS;


/***/ }),

/***/ 561:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ date_picker)
});

// EXTERNAL MODULE: ./node_modules/receptor/lib/index.js
var lib = __webpack_require__(425);
// EXTERNAL MODULE: ./node_modules/object-assign/index.js
var object_assign = __webpack_require__(418);
var object_assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
;// CONCATENATED MODULE: ./src/js/utils/behavior.js

const receptor = __webpack_require__(425);

/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
const sequence = (...seq) =>
  function callHooks(target = document.body) {
    seq.forEach((method) => {
      if (typeof this[method] === "function") {
        this[method].call(this, target);
      }
    });
  };

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
/* harmony default export */ const behavior = ((events, props) =>
  receptor.behavior(
    events,
    object_assign_default()(
      {
        on: sequence("init", "add"),
        off: sequence("teardown", "remove"),
      },
      props
    )
  ));

// EXTERNAL MODULE: ./src/js/utils/select.js
var utils_select = __webpack_require__(231);
;// CONCATENATED MODULE: ./src/js/utils/active-element.js
/* harmony default export */ const active_element = ((htmlDocument = document) => htmlDocument.activeElement);

;// CONCATENATED MODULE: ./src/js/utils/is-ios-device.js
// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return (
    typeof navigator !== "undefined" &&
    (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  );
}

/* harmony default export */ const is_ios_device = (isIosDevice);

;// CONCATENATED MODULE: ./src/js/components/date-picker.js





const CLICK = 'click';

const DATE_PICKER_CLASS = `date-picker`;
const DATE_PICKER_WRAPPER_CLASS = `${DATE_PICKER_CLASS}__wrapper`;
const DATE_PICKER_INITIALIZED_CLASS = `${DATE_PICKER_CLASS}--initialized`;
const DATE_PICKER_ACTIVE_CLASS = `${DATE_PICKER_CLASS}--active`;
const DATE_PICKER_INTERNAL_INPUT_CLASS = `${DATE_PICKER_CLASS}__internal-input`;
const DATE_PICKER_EXTERNAL_INPUT_CLASS = `${DATE_PICKER_CLASS}__external-input`;
const DATE_PICKER_BUTTON_CLASS = `${DATE_PICKER_CLASS}__button`;
const DATE_PICKER_CALENDAR_CLASS = `${DATE_PICKER_CLASS}__calendar`;
const DATE_PICKER_STATUS_CLASS = `${DATE_PICKER_CLASS}__status`;
const DATE_PICKER_GUIDE_CLASS = `${DATE_PICKER_CLASS}__guide`;
const CALENDAR_DATE_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__date`;

const DIALOG_WRAPPER_CLASS = `dialog-wrapper`;
const DATE_PICKER_DIALOG_WRAPPER = `.${DIALOG_WRAPPER_CLASS}`;

const CALENDAR_DATE_FOCUSED_CLASS = `${CALENDAR_DATE_CLASS}--focused`;
const CALENDAR_DATE_SELECTED_CLASS = `${CALENDAR_DATE_CLASS}--selected`;
const CALENDAR_DATE_PREVIOUS_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--previous-month`;
const CALENDAR_DATE_CURRENT_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--current-month`;
const CALENDAR_DATE_NEXT_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--next-month`;
const CALENDAR_DATE_RANGE_DATE_CLASS = `${CALENDAR_DATE_CLASS}--range-date`;
const CALENDAR_DATE_TODAY_CLASS = `${CALENDAR_DATE_CLASS}--today`;
const CALENDAR_DATE_RANGE_DATE_START_CLASS = `${CALENDAR_DATE_CLASS}--range-date-start`;
const CALENDAR_DATE_RANGE_DATE_END_CLASS = `${CALENDAR_DATE_CLASS}--range-date-end`;
const CALENDAR_DATE_WITHIN_RANGE_CLASS = `${CALENDAR_DATE_CLASS}--within-range`;
const CALENDAR_PREVIOUS_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-year`;
const CALENDAR_PREVIOUS_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-month`;
const CALENDAR_NEXT_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-year`;
const CALENDAR_NEXT_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-month`;
const CALENDAR_MONTH_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-selection`;
const CALENDAR_YEAR_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-selection`;
const CALENDAR_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month`;
const CALENDAR_MONTH_FOCUSED_CLASS = `${CALENDAR_MONTH_CLASS}--focused`;
const CALENDAR_MONTH_SELECTED_CLASS = `${CALENDAR_MONTH_CLASS}--selected`;
const CALENDAR_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year`;
const CALENDAR_YEAR_FOCUSED_CLASS = `${CALENDAR_YEAR_CLASS}--focused`;
const CALENDAR_YEAR_SELECTED_CLASS = `${CALENDAR_YEAR_CLASS}--selected`;
const CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-year-chunk`;
const CALENDAR_NEXT_YEAR_CHUNK_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-year-chunk`;
const CALENDAR_DATE_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__date-picker`;
const CALENDAR_MONTH_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-picker`;
const CALENDAR_YEAR_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-picker`;
const CALENDAR_TABLE_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__table`;
const CALENDAR_ROW_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__row`;
const CALENDAR_CELL_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__cell`;
const CALENDAR_CELL_CENTER_ITEMS_CLASS = `${CALENDAR_CELL_CLASS}--center-items`;
const CALENDAR_MONTH_LABEL_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-label`;
const CALENDAR_DAY_OF_WEEK_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__day-of-week`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const DATE_PICKER_BUTTON = `.${DATE_PICKER_BUTTON_CLASS}`;
const DATE_PICKER_INTERNAL_INPUT = `.${DATE_PICKER_INTERNAL_INPUT_CLASS}`;
const DATE_PICKER_EXTERNAL_INPUT = `.${DATE_PICKER_EXTERNAL_INPUT_CLASS}`;
const DATE_PICKER_CALENDAR = `.${DATE_PICKER_CALENDAR_CLASS}`;
const DATE_PICKER_STATUS = `.${DATE_PICKER_STATUS_CLASS}`;
const DATE_PICKER_GUIDE = `.${DATE_PICKER_GUIDE_CLASS}`;
const CALENDAR_DATE = `.${CALENDAR_DATE_CLASS}`;
const CALENDAR_DATE_FOCUSED = `.${CALENDAR_DATE_FOCUSED_CLASS}`;
const CALENDAR_DATE_CURRENT_MONTH = `.${CALENDAR_DATE_CURRENT_MONTH_CLASS}`;
const CALENDAR_PREVIOUS_YEAR = `.${CALENDAR_PREVIOUS_YEAR_CLASS}`;
const CALENDAR_PREVIOUS_MONTH = `.${CALENDAR_PREVIOUS_MONTH_CLASS}`;
const CALENDAR_NEXT_YEAR = `.${CALENDAR_NEXT_YEAR_CLASS}`;
const CALENDAR_NEXT_MONTH = `.${CALENDAR_NEXT_MONTH_CLASS}`;
const CALENDAR_YEAR_SELECTION = `.${CALENDAR_YEAR_SELECTION_CLASS}`;
const CALENDAR_MONTH_SELECTION = `.${CALENDAR_MONTH_SELECTION_CLASS}`;
const CALENDAR_MONTH = `.${CALENDAR_MONTH_CLASS}`;
const CALENDAR_YEAR = `.${CALENDAR_YEAR_CLASS}`;
const CALENDAR_PREVIOUS_YEAR_CHUNK = `.${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}`;
const CALENDAR_NEXT_YEAR_CHUNK = `.${CALENDAR_NEXT_YEAR_CHUNK_CLASS}`;
const CALENDAR_DATE_PICKER = `.${CALENDAR_DATE_PICKER_CLASS}`;
const CALENDAR_MONTH_PICKER = `.${CALENDAR_MONTH_PICKER_CLASS}`;
const CALENDAR_YEAR_PICKER = `.${CALENDAR_YEAR_PICKER_CLASS}`;
const CALENDAR_MONTH_FOCUSED = `.${CALENDAR_MONTH_FOCUSED_CLASS}`;
const CALENDAR_YEAR_FOCUSED = `.${CALENDAR_YEAR_FOCUSED_CLASS}`;

let date_picker_text = {
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
}

const VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";

let MONTH_LABELS = [
  date_picker_text.january,
  date_picker_text.february,
  date_picker_text.march,
  date_picker_text.april,
  date_picker_text.may,
  date_picker_text.june,
  date_picker_text.july,
  date_picker_text.august,
  date_picker_text.september,
  date_picker_text.october,
  date_picker_text.november,
  date_picker_text.december
];

let DAY_OF_WEEK_LABELS = [
  date_picker_text.monday,
  date_picker_text.tuesday,
  date_picker_text.wednesday,
  date_picker_text.thursday,
  date_picker_text.friday,
  date_picker_text.saturday,
  date_picker_text.sunday
];

const ENTER_KEYCODE = 13;

const YEAR_CHUNK = 12;

const DEFAULT_MIN_DATE = "0000-01-01";
const DATE_FORMAT_OPTION_1 = "DD/MM/YYYY";
const DATE_FORMAT_OPTION_2 = "DD-MM-YYYY";
const DATE_FORMAT_OPTION_3 = "DD.MM.YYYY";
const DATE_FORMAT_OPTION_4 = "DD MM YYYY";
const DATE_FORMAT_OPTION_5 = "DD/MM-YYYY";
const INTERNAL_DATE_FORMAT = "YYYY-MM-DD";

const NOT_DISABLED_SELECTOR = ":not([disabled])";

const processFocusableSelectors = (...selectors) =>
  selectors.map((query) => query + NOT_DISABLED_SELECTOR).join(", ");

const DATE_PICKER_FOCUSABLE = processFocusableSelectors(
  CALENDAR_PREVIOUS_YEAR,
  CALENDAR_PREVIOUS_MONTH,
  CALENDAR_YEAR_SELECTION,
  CALENDAR_MONTH_SELECTION,
  CALENDAR_NEXT_YEAR,
  CALENDAR_NEXT_MONTH,
  CALENDAR_DATE_FOCUSED
);

const MONTH_PICKER_FOCUSABLE = processFocusableSelectors(
  CALENDAR_MONTH_FOCUSED
);

const YEAR_PICKER_FOCUSABLE = processFocusableSelectors(
  CALENDAR_PREVIOUS_YEAR_CHUNK,
  CALENDAR_NEXT_YEAR_CHUNK,
  CALENDAR_YEAR_FOCUSED
);

// #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */
const keepDateWithinMonth = (dateToCheck, month) => {
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
const setDate = (year, month, date) => {
  const newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * todays date
 *
 * @returns {Date} todays date
 */
const today = () => {
  const newDate = new Date();
  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  return setDate(year, month, day);
};

/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
const startOfMonth = (date) => {
  const newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};

/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
const lastDayOfMonth = (date) => {
  const newDate = new Date(0);
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
const addDays = (_date, numDays) => {
  const newDate = new Date(_date.getTime());
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
const subDays = (_date, numDays) => addDays(_date, -numDays);

/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const addWeeks = (_date, numWeeks) => addDays(_date, numWeeks * 7);

/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const subWeeks = (_date, numWeeks) => addWeeks(_date, -numWeeks);

/**
 * Set date to the start of the week (Monday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
const startOfWeek = (_date) => {
  let dayOfWeek = _date.getDay()-1;
  if(dayOfWeek === -1){
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
const endOfWeek = (_date) => {
  const dayOfWeek = _date.getDay();
  return addDays(_date, 7 - dayOfWeek);
};

/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
const addMonths = (_date, numMonths) => {
  const newDate = new Date(_date.getTime());

  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
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
const subMonths = (_date, numMonths) => addMonths(_date, -numMonths);

/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
const addYears = (_date, numYears) => addMonths(_date, numYears * 12);

/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
const subYears = (_date, numYears) => addYears(_date, -numYears);

/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
const setMonth = (_date, month) => {
  const newDate = new Date(_date.getTime());

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
const setYear = (_date, year) => {
  const newDate = new Date(_date.getTime());

  const month = newDate.getMonth();
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
const min = (dateA, dateB) => {
  let newDate = dateA;

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
const max = (dateA, dateB) => {
  let newDate = dateA;

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
const isSameYear = (dateA, dateB) => {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};

/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */
const isSameMonth = (dateA, dateB) => {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};

/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateB the date to compare
 * @returns {boolean} are dates the same date
 */
const isSameDay = (dateA, dateB) => {
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
const keepDateBetweenMinAndMax = (date, minDate, maxDate) => {
  let newDate = date;

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
const isDateWithinMinAndMax = (date, minDate, maxDate) =>
  date >= minDate && (!maxDate || date <= maxDate);

/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
const isDatesMonthOutsideMinOrMax = (date, minDate, maxDate) => {
  return (
    lastDayOfMonth(date) < minDate || (maxDate && startOfMonth(date) > maxDate)
  );
};

/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
const isDatesYearOutsideMinOrMax = (date, minDate, maxDate) => {
  return (
    lastDayOfMonth(setMonth(date, 11)) < minDate ||
    (maxDate && startOfMonth(setMonth(date, 0)) > maxDate)
  );
};

/**
 * Parse a date with format D-M-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */
const parseDateString = (
  dateString,
  dateFormat = INTERNAL_DATE_FORMAT,
  adjustDate = false
) => {
  let date;
  let month;
  let day;
  let year;
  let parsed;
  
  if (dateString) {
    let monthStr, dayStr, yearStr;
    if (dateFormat === DATE_FORMAT_OPTION_1 || dateFormat === DATE_FORMAT_OPTION_2 || dateFormat === DATE_FORMAT_OPTION_3 || dateFormat === DATE_FORMAT_OPTION_4 || dateFormat === DATE_FORMAT_OPTION_5) {
      [dayStr, monthStr, yearStr] = dateString.split(/-|\.|\/|\s/);
    } else {
      [yearStr, monthStr, dayStr] = dateString.split("-");
    }

    if (yearStr) {
      parsed = parseInt(yearStr, 10);
      if (!Number.isNaN(parsed)) {
        year = parsed;
        if (adjustDate) {
          year = Math.max(0, year);
          if (yearStr.length < 3) {
            const currentYear = today().getFullYear();
            const currentYearStub =
              currentYear - (currentYear % Math.pow(10, yearStr.length));
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
          const lastDayOfTheMonth = setDate(year, month, 0).getDate();
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
 * Format a date to format DD-MM-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */
const formatDate = (date, dateFormat = INTERNAL_DATE_FORMAT) => {
  const padZeros = (value, length) => {
    return `0000${value}`.slice(-length);
  };

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  if (dateFormat === DATE_FORMAT_OPTION_1) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("/");
  }
  else if (dateFormat === DATE_FORMAT_OPTION_2) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("-");
  }
  else if (dateFormat === DATE_FORMAT_OPTION_3) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(".");
  }
  else if (dateFormat === DATE_FORMAT_OPTION_4) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(" ");
  }
  else if (dateFormat === DATE_FORMAT_OPTION_5) {
    let tempDayMonth = [padZeros(day, 2), padZeros(month, 2)].join("/");
    return [tempDayMonth, padZeros(year, 4)].join("-");
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
};

// #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */
const listToGridHtml = (htmlArray, rowSize) => {
  const grid = [];
  let row = [];

  let i = 0;
  while (i < htmlArray.length) {
    row = [];
    while (i < htmlArray.length && row.length < rowSize) {
      row.push(`<td>${htmlArray[i]}</td>`);
      i += 1;
    }
    grid.push(`<tr>${row.join("")}</tr>`);
  }

  return grid.join("");
};

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */
const changeElementValue = (el, value = "") => {
  const elementToChange = el;
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
const getDatePickerContext = (el) => {
  const datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER}`);
  }

  const internalInputEl = datePickerEl.querySelector(
    DATE_PICKER_INTERNAL_INPUT
  );
  const externalInputEl = datePickerEl.querySelector(
    DATE_PICKER_EXTERNAL_INPUT
  );
  const calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  const toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  const statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  const guideEl = datePickerEl.querySelector(DATE_PICKER_GUIDE);
  const firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  const dialogEl = datePickerEl.querySelector(DATE_PICKER_DIALOG_WRAPPER);

  // Set date format
  let selectedDateFormat = DATE_FORMAT_OPTION_1;
  if (datePickerEl.hasAttribute("data-dateformat")) {
    switch (datePickerEl.dataset.dateformat) {
      case DATE_FORMAT_OPTION_1:
        selectedDateFormat = DATE_FORMAT_OPTION_1;
        break;
      case DATE_FORMAT_OPTION_2:
        selectedDateFormat = DATE_FORMAT_OPTION_2;
        break;
      case DATE_FORMAT_OPTION_3:
        selectedDateFormat = DATE_FORMAT_OPTION_3;
        break;
      case DATE_FORMAT_OPTION_4:
        selectedDateFormat = DATE_FORMAT_OPTION_4;
        break;
      case DATE_FORMAT_OPTION_5:
        selectedDateFormat = DATE_FORMAT_OPTION_5;
    }
  }
  const dateFormatOption = selectedDateFormat; 

  const inputDate = parseDateString(
    externalInputEl.value,
    dateFormatOption,
    true
  );
  const selectedDate = parseDateString(internalInputEl.value);

  const calendarDate = parseDateString(calendarEl.dataset.value);
  const minDate = parseDateString(datePickerEl.dataset.minDate);
  const maxDate = parseDateString(datePickerEl.dataset.maxDate);
  const rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  const defaultDate = parseDateString(datePickerEl.dataset.defaultDate);

  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }

  return {
    calendarDate,
    minDate,
    toggleBtnEl,
    dialogEl,
    selectedDate,
    maxDate,
    firstYearChunkEl,
    datePickerEl,
    inputDate,
    internalInputEl,
    externalInputEl,
    calendarEl,
    rangeDate,
    defaultDate,
    statusEl,
    guideEl,
    dateFormatOption
  };
};

/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const disable = (el) => {
  const { externalInputEl, toggleBtnEl } = getDatePickerContext(el);

  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const enable = (el) => {
  const { externalInputEl, toggleBtnEl } = getDatePickerContext(el);

  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
};

// #region Validation

/**
 * Validate the value in the input as a valid date of format D/M/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const isDateInputInvalid = (el) => {
  const { externalInputEl, minDate, maxDate } = getDatePickerContext(el);

  const dateString = externalInputEl.value;
  let isInvalid = false;

  if (dateString) {
    isInvalid = true;

    const dateStringParts = dateString.split(/-|\.|\/|\s/);
    const [day, month, year] = dateStringParts.map((str) => {
      let value;
      const parsed = parseInt(str, 10);
      if (!Number.isNaN(parsed)) value = parsed;
      return value;
    });

    if (month && day && year != null) {
      const checkDate = setDate(year, month - 1, day);

      if (
        checkDate.getMonth() === month - 1 &&
        checkDate.getDate() === day &&
        checkDate.getFullYear() === year &&
        dateStringParts[2].length === 4 &&
        isDateWithinMinAndMax(checkDate, minDate, maxDate)
      ) {
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
const validateDateInput = (el) => {
  const { externalInputEl } = getDatePickerContext(el);
  const isInvalid = isDateInputInvalid(externalInputEl);

  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
};

// #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const reconcileInputValues = (el) => {
  const { internalInputEl, inputDate } = getDatePickerContext(el);
  let newValue = "";

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
const setCalendarValue = (el, dateString) => {
  const parsedDate = parseDateString(dateString);

  if (parsedDate) {
    
    const {
      datePickerEl,
      internalInputEl,
      externalInputEl,
      dateFormatOption
    } = getDatePickerContext(el);

    const formattedDate = formatDate(parsedDate, dateFormatOption);

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
const enhanceDatePicker = (el) => {
  const datePickerEl = el.closest(DATE_PICKER);
  const defaultValue = datePickerEl.dataset.defaultValue;

  const internalInputEl = datePickerEl.querySelector(`input`);

  if (!internalInputEl) {
    throw new Error(`${DATE_PICKER} is missing inner input`);
  }

  const minDate = parseDateString(
    datePickerEl.dataset.minDate || internalInputEl.getAttribute("min")
  );
  datePickerEl.dataset.minDate = minDate
    ? formatDate(minDate)
    : DEFAULT_MIN_DATE;

  const maxDate = parseDateString(
    datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max")
  );
  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }

  const calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";

  const externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";

  let dialogTitle = date_picker_text.choose_a_date;
  const hasMinDate = minDate !== undefined && minDate !== "";
  const isDefaultMinDate =  minDate !== undefined && minDate !== "" && parseDateString(DEFAULT_MIN_DATE).getTime() === minDate.getTime();
  const hasMaxDate = maxDate !== undefined && maxDate !== "";
  
  if (hasMinDate && !isDefaultMinDate && hasMaxDate) {
    const minDay = minDate.getDate();
    const minMonth = minDate.getMonth();
    const minMonthStr = MONTH_LABELS[minMonth];
    const minYear = minDate.getFullYear();
    const maxDay = maxDate.getDate();
    const maxMonth = maxDate.getMonth();
    const maxMonthStr = MONTH_LABELS[maxMonth];
    const maxYear = maxDate.getFullYear();
    dialogTitle = date_picker_text.choose_a_date_between.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear).replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  }
  else if (hasMinDate && !isDefaultMinDate && !hasMaxDate) {
    const minDay = minDate.getDate();
    const minMonth = minDate.getMonth();
    const minMonthStr = MONTH_LABELS[minMonth];
    const minYear = minDate.getFullYear();
    dialogTitle = date_picker_text.choose_a_date_after.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear);
  }
  else if (hasMaxDate) {
    const maxDay = maxDate.getDate();
    const maxMonth = maxDate.getMonth();
    const maxMonthStr = MONTH_LABELS[maxMonth];
    const maxYear = maxDate.getFullYear();
    dialogTitle = date_picker_text.choose_a_date_before.replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  }

  const guideID = externalInputEl.getAttribute("id") + "-guide";

  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML(
    "beforeend",
    [
      `<button type="button" class="${DATE_PICKER_BUTTON_CLASS}" aria-haspopup="true" aria-label="${date_picker_text.open_calendar}">&nbsp;</button>`,
      `<div class="${DIALOG_WRAPPER_CLASS}" role="dialog" aria-modal="true" aria-label="${dialogTitle}" aria-describedby="${guideID}" hidden><div role="application"><div class="${DATE_PICKER_CALENDAR_CLASS}" hidden></div></div></div>`,
      `<div class="sr-only ${DATE_PICKER_STATUS_CLASS}" role="status" aria-live="polite"></div>`,
      `<div class="sr-only ${DATE_PICKER_GUIDE_CLASS}" id="${guideID}" hidden>${date_picker_text.guide}</div>`
    ].join("")
  );

  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add(
    "sr-only",
    DATE_PICKER_INTERNAL_INPUT_CLASS
  );
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
};

// #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */
const renderCalendar = (el, _dateToDisplay) => {
  const {
    datePickerEl,
    calendarEl,
    statusEl,
    selectedDate,
    maxDate,
    minDate,
    rangeDate,
    dialogEl,
    guideEl
  } = getDatePickerContext(el);
  const todaysDate = today();
  let dateToDisplay = _dateToDisplay || todaysDate;

  const calendarWasHidden = calendarEl.hidden;

  const focusedDate = addDays(dateToDisplay, 0);
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const prevMonth = subMonths(dateToDisplay, 1);
  const nextMonth = addMonths(dateToDisplay, 1);

  const currentFormattedDate = formatDate(dateToDisplay);

  const firstOfMonth = startOfMonth(dateToDisplay);
  const prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  const nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);

  const rangeConclusionDate = selectedDate || dateToDisplay;
  const rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  const rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);

  const withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  const withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);

  const monthLabel = MONTH_LABELS[focusedMonth];

  const generateDateHtml = (dateToRender) => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();
    let dayOfWeek = dateToRender.getDay() - 1;
    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }

    const formattedDate = formatDate(dateToRender);

    let tabindex = "-1";

    const isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    const isSelected = isSameDay(dateToRender, selectedDate);

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

      if (
        isDateWithinMinAndMax(
          dateToRender,
          withinRangeStartDate,
          withinRangeEndDate
        )
      ) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }

    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    const monthStr = MONTH_LABELS[month];
    const dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    const ariaLabelDate = date_picker_text.aria_label_date.replace(/{dayStr}/, dayStr).replace(/{day}/, day).replace(/{monthStr}/, monthStr).replace(/{year}/, year);

    return `<button
      type="button"
      tabindex="${tabindex}"
      class="${classes.join(" ")}" 
      data-day="${day}" 
      data-month="${month + 1}" 
      data-year="${year}" 
      data-value="${formattedDate}"
      aria-label="${ariaLabelDate}"
      aria-current="${isSelected ? "date" : "false"}"
      ${isDisabled ? `disabled="disabled"` : ""}
    >${day}</button>`;
  };
  // set date to first rendered day
  dateToDisplay = startOfWeek(firstOfMonth);

  const days = [];

  while (
    days.length < 28 ||
    dateToDisplay.getMonth() === focusedMonth ||
    days.length % 7 !== 0
  ) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);    
  }
  const datesHtml = listToGridHtml(days, 7);

  const newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = `${datePickerEl.offsetHeight}px`;
  newCalendar.hidden = false;
  let content = `<div tabindex="-1" class="${CALENDAR_DATE_PICKER_CLASS}">
      <div class="${CALENDAR_ROW_CLASS}">
        <div class="${CALENDAR_CELL_CLASS} ${CALENDAR_CELL_CENTER_ITEMS_CLASS}">
          <button 
            type="button"
            class="${CALENDAR_PREVIOUS_YEAR_CLASS}"
            aria-label="${date_picker_text.previous_year}"
            ${prevButtonsDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="${CALENDAR_CELL_CLASS} ${CALENDAR_CELL_CENTER_ITEMS_CLASS}">
          <button 
            type="button"
            class="${CALENDAR_PREVIOUS_MONTH_CLASS}"
            aria-label="${date_picker_text.previous_month}"
            ${prevButtonsDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="${CALENDAR_CELL_CLASS} ${CALENDAR_MONTH_LABEL_CLASS}">
          <button 
            type="button"
            class="${CALENDAR_MONTH_SELECTION_CLASS}" aria-label="${monthLabel}. ${date_picker_text.select_month}."
          >${monthLabel}</button>
          <button 
            type="button"
            class="${CALENDAR_YEAR_SELECTION_CLASS}" aria-label="${focusedYear}. ${date_picker_text.select_year}."
          >${focusedYear}</button>
        </div>
        <div class="${CALENDAR_CELL_CLASS} ${CALENDAR_CELL_CENTER_ITEMS_CLASS}">
          <button 
            type="button"
            class="${CALENDAR_NEXT_MONTH_CLASS}"
            aria-label="${date_picker_text.next_month}"
            ${nextButtonsDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="${CALENDAR_CELL_CLASS} ${CALENDAR_CELL_CENTER_ITEMS_CLASS}">
          <button 
            type="button"
            class="${CALENDAR_NEXT_YEAR_CLASS}"
            aria-label="${date_picker_text.next_year}"
            ${nextButtonsDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
      </div>
      <table class="${CALENDAR_TABLE_CLASS}" role="presentation">
        <thead>
          <tr>`;
  for(let d in DAY_OF_WEEK_LABELS){
    content += `<th class="${CALENDAR_DAY_OF_WEEK_CLASS}" scope="col" aria-label="${DAY_OF_WEEK_LABELS[d]}">${DAY_OF_WEEK_LABELS[d].charAt(0)}</th>`;
  }
  content += `</tr>
        </thead>
        <tbody>
          ${datesHtml}
        </tbody>
      </table>
    </div>`;
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  if (dialogEl.hidden === true) {
    dialogEl.hidden = false;
    if (guideEl.hidden) {
      guideEl.hidden = false;
    }
  }
  
  const statuses = [];

  if (calendarWasHidden) {
    statusEl.textContent = "";
  } 
  else if (_dateToDisplay.getTime() === minDate.getTime()) {
    statuses.push(date_picker_text.first_possible_date);
  }
  else if (maxDate !== undefined && maxDate !== "" && _dateToDisplay.getTime() === maxDate.getTime()) {
    statuses.push(date_picker_text.last_possible_date);
  }
  else {
    statuses.push(date_picker_text.current_month_displayed.replace(/{monthLabel}/, monthLabel).replace(/{focusedYear}/, focusedYear));
  }

  statusEl.textContent = statuses.join(". ");

  return newCalendar;
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
const displayPreviousYear = (_buttonEl) => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);

  let nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);
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
const displayPreviousMonth = (_buttonEl) => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);

  let nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);
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
const displayNextMonth = (_buttonEl) => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);

  let nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);
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
const displayNextYear = (_buttonEl) => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);

  let nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);
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
const hideCalendar = (el) => {
  const { datePickerEl, calendarEl, statusEl } = getDatePickerContext(el);

  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
const selectDate = (calendarDateEl) => {
  if (calendarDateEl.disabled) return;

  const { datePickerEl, externalInputEl, dialogEl, guideEl } = getDatePickerContext(
    calendarDateEl
  );
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
const toggleCalendar = (el) => {
  if (el.disabled) return;
  const {
    dialogEl,
    calendarEl,
    inputDate,
    minDate,
    maxDate,
    defaultDate,
    guideEl
  } = getDatePickerContext(el);

  if (calendarEl.hidden) {
    const dateToDisplay = keepDateBetweenMinAndMax(
      inputDate || defaultDate || today(),
      minDate,
      maxDate
    );
    const newCalendar = renderCalendar(calendarEl, dateToDisplay);
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
const updateCalendarIfVisible = (el) => {
  const { calendarEl, inputDate, minDate, maxDate } = getDatePickerContext(el);
  const calendarShown = !calendarEl.hidden;

  if (calendarShown && inputDate) {
    const dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
};

// #endregion Calendar - Date Selection View

// #region Calendar - Month Selection View
/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */
const displayMonthSelection = (el, monthToDisplay) => {
  const {
    calendarEl,
    statusEl,
    calendarDate,
    minDate,
    maxDate,
  } = getDatePickerContext(el);

  const selectedMonth = calendarDate.getMonth();
  const focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;

  const months = MONTH_LABELS.map((month, index) => {
    const monthToCheck = setMonth(calendarDate, index);

    const isDisabled = isDatesMonthOutsideMinOrMax(
      monthToCheck,
      minDate,
      maxDate
    );

    let tabindex = "-1";

    const classes = [CALENDAR_MONTH_CLASS];
    const isSelected = index === selectedMonth;

    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }

    return `<button 
        type="button"
        tabindex="${tabindex}"
        class="${classes.join(" ")}" 
        data-value="${index}"
        data-label="${month}"
        aria-current="${isSelected ? "true" : "false"}"
        ${isDisabled ? `disabled="disabled"` : ""}
      >${month}</button>`;
  });

  const monthsHtml = `<div tabindex="-1" class="${CALENDAR_MONTH_PICKER_CLASS}">
    <table class="${CALENDAR_TABLE_CLASS}" role="presentation">
      <tbody>
        ${listToGridHtml(months, 3)}
      </tbody>
    </table>
  </div>`;

  const newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  statusEl.textContent = date_picker_text.months_displayed;

  return newCalendar;
};

/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */
const selectMonth = (monthEl) => {
  if (monthEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    monthEl
  );
  const selectedMonth = parseInt(monthEl.dataset.value, 10);
  let date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Month Selection View

// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */
const displayYearSelection = (el, yearToDisplay) => {
  const {
    calendarEl,
    statusEl,
    calendarDate,
    minDate,
    maxDate,
  } = getDatePickerContext(el);

  const selectedYear = calendarDate.getFullYear();
  const focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;

  let yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);

  const prevYearChunkDisabled = isDatesYearOutsideMinOrMax(
    setYear(calendarDate, yearToChunk - 1),
    minDate,
    maxDate
  );

  const nextYearChunkDisabled = isDatesYearOutsideMinOrMax(
    setYear(calendarDate, yearToChunk + YEAR_CHUNK),
    minDate,
    maxDate
  );

  const years = [];
  let yearIndex = yearToChunk;
  while (years.length < YEAR_CHUNK) {
    const isDisabled = isDatesYearOutsideMinOrMax(
      setYear(calendarDate, yearIndex),
      minDate,
      maxDate
    );

    let tabindex = "-1";

    const classes = [CALENDAR_YEAR_CLASS];
    const isSelected = yearIndex === selectedYear;

    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }

    years.push(
      `<button 
        type="button"
        tabindex="${tabindex}"
        class="${classes.join(" ")}" 
        data-value="${yearIndex}"
        aria-current="${isSelected ? "true" : "false"}"
        ${isDisabled ? `disabled="disabled"` : ""}
      >${yearIndex}</button>`
    );
    yearIndex += 1;
  }

  const yearsHtml = listToGridHtml(years, 3);
  const ariaLabelPreviousYears = date_picker_text.previous_years.replace(/{years}/, YEAR_CHUNK);
  const ariaLabelNextYears = date_picker_text.next_years.replace(/{years}/, YEAR_CHUNK);
  const announceYears = date_picker_text.years_displayed.replace(/{start}/, yearToChunk).replace(/{end}/, yearToChunk + YEAR_CHUNK - 1);

  const newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = `<div tabindex="-1" class="${CALENDAR_YEAR_PICKER_CLASS}">
    <table class="${CALENDAR_TABLE_CLASS}" role="presentation">
        <tbody>
          <tr>
            <td>
              <button
                type="button"
                class="${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}" 
                aria-label="${ariaLabelPreviousYears}"
                ${prevYearChunkDisabled ? `disabled="disabled"` : ""}
              >&nbsp;</button>
            </td>
            <td colspan="3">
              <table class="${CALENDAR_TABLE_CLASS}" role="presentation">
                <tbody>
                  ${yearsHtml}
                </tbody>
              </table>
            </td>
            <td>
              <button
                type="button"
                class="${CALENDAR_NEXT_YEAR_CHUNK_CLASS}" 
                aria-label="${ariaLabelNextYears}"
                ${nextYearChunkDisabled ? `disabled="disabled"` : ""}
              >&nbsp;</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  statusEl.textContent = announceYears;

  return newCalendar;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayPreviousYearChunk = (el) => {
  if (el.disabled) return;

  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    el
  );
  const yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  const selectedYear = parseInt(yearEl.textContent, 10);

  let adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);

  const date = setYear(calendarDate, adjustedYear);
  const cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = displayYearSelection(
    calendarEl,
    cappedDate.getFullYear()
  );

  let nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);
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
const displayNextYearChunk = (el) => {
  if (el.disabled) return;

  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    el
  );
  const yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  const selectedYear = parseInt(yearEl.textContent, 10);

  let adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);

  const date = setYear(calendarDate, adjustedYear);
  const cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = displayYearSelection(
    calendarEl,
    cappedDate.getFullYear()
  );

  let nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);
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
const selectYear = (yearEl) => {
  if (yearEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    yearEl
  );
  const selectedYear = parseInt(yearEl.innerHTML, 10);
  let date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  const newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Year Selection View

// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEscapeFromCalendar = (event) => {
  const { datePickerEl, externalInputEl, dialogEl, guideEl } = getDatePickerContext(event.target);

  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();

  event.preventDefault();
};

// #endregion Calendar Event Handling

// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */
const adjustCalendar = (adjustDateFn) => {
  return (event) => {
    const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
      event.target
    );

    const date = adjustDateFn(calendarDate);

    const cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameDay(calendarDate, cappedDate)) {
      const newCalendar = renderCalendar(calendarEl, cappedDate);
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
const handleUpFromDate = adjustCalendar((date) => subWeeks(date, 1));

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleDownFromDate = adjustCalendar((date) => addWeeks(date, 1));

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeftFromDate = adjustCalendar((date) => subDays(date, 1));

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleRightFromDate = adjustCalendar((date) => addDays(date, 1));

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHomeFromDate = adjustCalendar((date) => startOfWeek(date));

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEndFromDate = adjustCalendar((date) => endOfWeek(date));

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDownFromDate = adjustCalendar((date) => addMonths(date, 1));

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUpFromDate = adjustCalendar((date) => subMonths(date, 1));

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageDownFromDate = adjustCalendar((date) => addYears(date, 1));

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageUpFromDate = adjustCalendar((date) => subYears(date, 1));

/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */
const handleMousemoveFromDate = (dateEl) => {
  if (dateEl.disabled) return;

  const calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);

  const currentCalendarDate = calendarEl.dataset.value;
  const hoverDate = dateEl.dataset.value;

  if (hoverDate === currentCalendarDate) return;

  const dateToDisplay = parseDateString(hoverDate);
  const newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar Date Event Handling

// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */
const adjustMonthSelectionScreen = (adjustMonthFn) => {
  return (event) => {
    const monthEl = event.target;
    const selectedMonth = parseInt(monthEl.dataset.value, 10);
    const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
      monthEl
    );
    const currentDate = setMonth(calendarDate, selectedMonth);

    let adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));

    const date = setMonth(calendarDate, adjustedMonth);
    const cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameMonth(currentDate, cappedDate)) {
      const newCalendar = displayMonthSelection(
        calendarEl,
        cappedDate.getMonth()
      );
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
const handleUpFromMonth = adjustMonthSelectionScreen((month) => month - 3);

/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleDownFromMonth = adjustMonthSelectionScreen((month) => month + 3);

/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeftFromMonth = adjustMonthSelectionScreen((month) => month - 1);

/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleRightFromMonth = adjustMonthSelectionScreen((month) => month + 1);

/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHomeFromMonth = adjustMonthSelectionScreen(
  (month) => month - (month % 3)
);

/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEndFromMonth = adjustMonthSelectionScreen(
  (month) => month + 2 - (month % 3)
);

/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDownFromMonth = adjustMonthSelectionScreen(() => 11);

/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUpFromMonth = adjustMonthSelectionScreen(() => 0);

/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */
const handleMousemoveFromMonth = (monthEl) => {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;

  const focusMonth = parseInt(monthEl.dataset.value, 10);

  const newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
};

// #endregion Calendar Month Event Handling

// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */
const adjustYearSelectionScreen = (adjustYearFn) => {
  return (event) => {
    const yearEl = event.target;
    const selectedYear = parseInt(yearEl.dataset.value, 10);
    const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
      yearEl
    );
    const currentDate = setYear(calendarDate, selectedYear);

    let adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);

    const date = setYear(calendarDate, adjustedYear);
    const cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameYear(currentDate, cappedDate)) {
      const newCalendar = displayYearSelection(
        calendarEl,
        cappedDate.getFullYear()
      );
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
const handleUpFromYear = adjustYearSelectionScreen((year) => year - 3);

/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleDownFromYear = adjustYearSelectionScreen((year) => year + 3);

/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeftFromYear = adjustYearSelectionScreen((year) => year - 1);

/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleRightFromYear = adjustYearSelectionScreen((year) => year + 1);

/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHomeFromYear = adjustYearSelectionScreen(
  (year) => year - (year % 3)
);

/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEndFromYear = adjustYearSelectionScreen(
  (year) => year + 2 - (year % 3)
);

/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUpFromYear = adjustYearSelectionScreen(
  (year) => year - YEAR_CHUNK
);

/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDownFromYear = adjustYearSelectionScreen(
  (year) => year + YEAR_CHUNK
);

/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */
const handleMousemoveFromYear = (yearEl) => {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;

  const focusYear = parseInt(yearEl.dataset.value, 10);

  const newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
};

// #endregion Calendar Year Event Handling

// #region Focus Handling Event Handling

const tabHandler = (focusable) => {
  const getFocusableContext = (el) => {
    const { calendarEl } = getDatePickerContext(el);
    const focusableElements = (0,utils_select/* default */.Z)(focusable, calendarEl);

    const firstTabIndex = 0;
    const lastTabIndex = focusableElements.length - 1;
    const firstTabStop = focusableElements[firstTabIndex];
    const lastTabStop = focusableElements[lastTabIndex];
    const focusIndex = focusableElements.indexOf(active_element());

    const isLastTab = focusIndex === lastTabIndex;
    const isFirstTab = focusIndex === firstTabIndex;
    const isNotFound = focusIndex === -1;

    return {
      focusableElements,
      isNotFound,
      firstTabStop,
      isFirstTab,
      lastTabStop,
      isLastTab,
    };
  };

  return {
    tabAhead(event) {
      const { firstTabStop, isLastTab, isNotFound } = getFocusableContext(
        event.target
      );

      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack(event) {
      const { lastTabStop, isFirstTab, isNotFound } = getFocusableContext(
        event.target
      );

      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    },
  };
};

const datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
const monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
const yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE);

// #endregion Focus Handling Event Handling

// #region Date Picker Event Delegation Registration / Component

const datePickerEvents = {
  [CLICK]: {
    [DATE_PICKER_BUTTON]() {
      toggleCalendar(this);
    },
    [CALENDAR_DATE]() {
      selectDate(this);
    },
    [CALENDAR_MONTH]() {
      selectMonth(this);
    },
    [CALENDAR_YEAR]() {
      selectYear(this);
    },
    [CALENDAR_PREVIOUS_MONTH]() {
      displayPreviousMonth(this);
    },
    [CALENDAR_NEXT_MONTH]() {
      displayNextMonth(this);
    },
    [CALENDAR_PREVIOUS_YEAR]() {
      displayPreviousYear(this);
    },
    [CALENDAR_NEXT_YEAR]() {
      displayNextYear(this);
    },
    [CALENDAR_PREVIOUS_YEAR_CHUNK]() {
      displayPreviousYearChunk(this);
    },
    [CALENDAR_NEXT_YEAR_CHUNK]() {
      displayNextYearChunk(this);
    },
    [CALENDAR_MONTH_SELECTION]() {
      const newCalendar = displayMonthSelection(this);
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    },
    [CALENDAR_YEAR_SELECTION]() {
      const newCalendar = displayYearSelection(this);
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    },
  },
  keyup: {
    [DATE_PICKER_CALENDAR](event) {
      const keydown = this.dataset.keydownKeyCode;
      if (`${event.keyCode}` !== keydown) {
        event.preventDefault();
      }
    },
  },
  keydown: {
    [DATE_PICKER_EXTERNAL_INPUT](event) {
      if (event.keyCode === ENTER_KEYCODE) {
        validateDateInput(this);
      }
    },
    [CALENDAR_DATE]: (0,lib.keymap)({
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
      "Shift+PageUp": handleShiftPageUpFromDate,
    }),
    [CALENDAR_DATE_PICKER]: (0,lib.keymap)({
      Tab: datePickerTabEventHandler.tabAhead,
      "Shift+Tab": datePickerTabEventHandler.tabBack,
    }),
    [CALENDAR_MONTH]: (0,lib.keymap)({
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
      PageUp: handlePageUpFromMonth,
    }),
    [CALENDAR_MONTH_PICKER]: (0,lib.keymap)({
      Tab: monthPickerTabEventHandler.tabAhead,
      "Shift+Tab": monthPickerTabEventHandler.tabBack,
    }),
    [CALENDAR_YEAR]: (0,lib.keymap)({
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
      PageUp: handlePageUpFromYear,
    }),
    [CALENDAR_YEAR_PICKER]: (0,lib.keymap)({
      Tab: yearPickerTabEventHandler.tabAhead,
      "Shift+Tab": yearPickerTabEventHandler.tabBack,
    }),
    [DATE_PICKER_CALENDAR](event) {
      this.dataset.keydownKeyCode = event.keyCode;
    },
    [DATE_PICKER](event) {
      const keyMap = (0,lib.keymap)({
        Escape: handleEscapeFromCalendar,
      });

      keyMap(event);
    },
  },
  focusout: {
    [DATE_PICKER_EXTERNAL_INPUT]() {
      validateDateInput(this);
    },
    [DATE_PICKER](event) {
      if (!this.contains(event.relatedTarget)) {
        hideCalendar(this);
      }
    },
  },
  input: {
    [DATE_PICKER_EXTERNAL_INPUT]() {
      reconcileInputValues(this);
      updateCalendarIfVisible(this);
    },
  },
};

if (!is_ios_device()) {
  datePickerEvents.mousemove = {
    [CALENDAR_DATE_CURRENT_MONTH]() {
      handleMousemoveFromDate(this);
    },
    [CALENDAR_MONTH]() {
      handleMousemoveFromMonth(this);
    },
    [CALENDAR_YEAR]() {
      handleMousemoveFromYear(this);
    },
  };
}

const datePicker = behavior(datePickerEvents, {
  init(root) {
    (0,utils_select/* default */.Z)(DATE_PICKER, root).forEach((datePickerEl) => {
      if(!datePickerEl.classList.contains(DATE_PICKER_INITIALIZED_CLASS)){
        enhanceDatePicker(datePickerEl);
      }
    });
  },
  setLanguage(strings) {
    date_picker_text = strings;
    MONTH_LABELS = [
      date_picker_text.january,
      date_picker_text.february,
      date_picker_text.march,
      date_picker_text.april,
      date_picker_text.may,
      date_picker_text.june,
      date_picker_text.july,
      date_picker_text.august,
      date_picker_text.september,
      date_picker_text.october,
      date_picker_text.november,
      date_picker_text.december
    ];
    DAY_OF_WEEK_LABELS = [
      date_picker_text.monday,
      date_picker_text.tuesday,
      date_picker_text.wednesday,
      date_picker_text.thursday,
      date_picker_text.friday,
      date_picker_text.saturday,
      date_picker_text.sunday
    ];
  },
  getDatePickerContext,
  disable,
  enable,
  isDateInputInvalid,
  setCalendarValue,
  validateDateInput,
  renderCalendar,
  updateCalendarIfVisible
});

// #endregion Date Picker Event Delegation Registration / Component

/* harmony default export */ const date_picker = (datePicker);


/***/ }),

/***/ 11:
/***/ (() => {

/* eslint-disable consistent-return */
/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, _params) {
    const params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null,
    };
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();


/***/ }),

/***/ 762:
/***/ (() => {

"use strict";

const elproto = window.HTMLElement.prototype;
const HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function () {
      return this.hasAttribute(HIDDEN);
    },
    set: function (value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    },
  });
}


/***/ }),

/***/ 742:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// polyfills HTMLElement.prototype.classList and DOMTokenList
__webpack_require__(241);

// polyfills HTMLElement.prototype.hidden
__webpack_require__(762);

// polyfills Number.isNaN()
__webpack_require__(737);

// polyfills CustomEvent
__webpack_require__(11);

/***/ }),

/***/ 737:
/***/ (() => {

Number.isNaN =
  Number.isNaN ||
  function isNaN(input) {
    // eslint-disable-next-line no-self-compare
    return typeof input === "number" && input !== input;
  };


/***/ }),

/***/ 660:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

let breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (breakpoints);


/***/ }),

/***/ 843:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// https://stackoverflow.com/a/7557433
function isElementInViewport (el, win=window,
                              docEl=document.documentElement) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || docEl.clientHeight) &&
    rect.right <= (win.innerWidth || docEl.clientWidth)
  );
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isElementInViewport);


/***/ }),

/***/ 231:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
const isElement = (value) =>
  value && typeof value === "object" && value.nodeType === 1;

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((selector, context) => {
  if (typeof selector !== "string") {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  const selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
});


/***/ }),

/***/ 95:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((button, expanded) => {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);
  const id = button.getAttribute(CONTROLS);
  const controls = document.getElementById(id);
  if (!controls) {
    throw new Error(
      'No toggle target found with id: "' + id + '"'
    );
  }

  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Accordion: () => (/* reexport */ accordion),
  Alert: () => (/* reexport */ components_alert),
  BackToTop: () => (/* reexport */ back_to_top),
  CharacterLimit: () => (/* reexport */ character_limit),
  CheckboxToggleContent: () => (/* reexport */ checkbox_toggle_content),
  Dropdown: () => (/* reexport */ dropdown),
  DropdownSort: () => (/* reexport */ dropdown_sort),
  ErrorSummary: () => (/* reexport */ error_summary),
  MenuDropdown: () => (/* reexport */ navigation_drawer_overflow),
  Modal: () => (/* reexport */ modal),
  Navigation: () => (/* reexport */ navigation),
  RadioToggleGroup: () => (/* reexport */ radio_toggle_content),
  ResponsiveTable: () => (/* reexport */ table),
  TableSelectableRows: () => (/* reexport */ selectable_table),
  Tabs: () => (/* reexport */ tabs),
  Toast: () => (/* reexport */ toast),
  Tooltip: () => (/* reexport */ tooltip),
  datePicker: () => (/* binding */ datePicker),
  init: () => (/* binding */ init)
});

;// CONCATENATED MODULE: ./src/js/components/accordion.js

const toggle = (__webpack_require__(95)/* ["default"] */ .Z);
const isElementInViewport = (__webpack_require__(843)/* ["default"] */ .Z);
const BUTTON = `.accordion-button[aria-controls]`;
const EXPANDED = 'aria-expanded';
const BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
const TEXT_ACCORDION = {
    "open_all": "Åbn alle",
    "close_all": "Luk alle"
}

/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
function Accordion($accordion, strings = TEXT_ACCORDION) {
    if (!$accordion) {
        throw new Error(`Missing accordion group element`);
    }
    this.accordion = $accordion;
    this.text = strings;
}

/**
 * Set eventlisteners on click elements in accordion list
 */
Accordion.prototype.init = function () {
    this.buttons = this.accordion.querySelectorAll(BUTTON);
    if (this.buttons.length == 0) {
        throw new Error(`Missing accordion buttons`);
    }

    // loop buttons in list
    for (var i = 0; i < this.buttons.length; i++) {
        let currentButton = this.buttons[i];

        // Verify state on button and state on panel
        let expanded = currentButton.getAttribute(EXPANDED) === 'true';
        this.toggleButton(currentButton, expanded);

        // Set click event on accordion buttons
        currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
        currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    }
    // Set click event on bulk button if present
    let prevSibling = this.accordion.previousElementSibling;
    if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
        this.bulkFunctionButton = prevSibling;
        this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
    }
}

/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */
Accordion.prototype.bulkEvent = function () {
    var $module = this;
    if (!$module.accordion.classList.contains('accordion')) {
        throw new Error(`Could not find accordion.`);
    }
    if ($module.buttons.length == 0) {
        throw new Error(`Missing accordion buttons`);
    }

    let expand = true;
    if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
        expand = false;
    }
    for (var i = 0; i < $module.buttons.length; i++) {
        $module.toggleButton($module.buttons[i], expand, true);
    }

    $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
    if (!expand === true) {
        $module.bulkFunctionButton.innerText = this.text.open_all;
    } else {
        $module.bulkFunctionButton.innerText = this.text.close_all;
    }
}

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
Accordion.prototype.toggleButton = function (button, expanded, bulk = false) {
    let accordion = null;
    if (button.parentNode.parentNode.classList.contains('accordion')) {
        accordion = button.parentNode.parentNode;
    } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
        accordion = button.parentNode.parentNode.parentNode;
    }
    expanded = toggle(button, expanded);
    if (expanded) {
        let eventOpen = new Event('fds.accordion.open');
        button.dispatchEvent(eventOpen);
    } else {
        let eventClose = new Event('fds.accordion.close');
        button.dispatchEvent(eventClose);
    }

    if (accordion !== null) {
        let bulkFunction = accordion.previousElementSibling;
        if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
            let buttons = accordion.querySelectorAll(BUTTON);
            if (bulk === false) {
                let buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
                let newStatus = true;

                if (buttons.length === buttonsOpen.length) {
                    newStatus = false;
                }

                bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
                if (newStatus === true) {
                    bulkFunction.innerText = this.text.open_all;
                } else {
                    bulkFunction.innerText = this.text.close_all;
                }
            }
        }
    }
};

/* harmony default export */ const accordion = (Accordion);
;// CONCATENATED MODULE: ./src/js/components/alert.js

function Alert(alert){
    this.alert = alert;
}

Alert.prototype.init = function(){
    let close = this.alert.getElementsByClassName('alert-close');
    if(close.length === 1){
        close[0].addEventListener('click', this.hide.bind(this));
    }
}

Alert.prototype.hide = function(){
    this.alert.classList.add('d-none');
    let eventHide = new Event('fds.alert.hide');
    this.alert.dispatchEvent(eventHide);
};

Alert.prototype.show = function(){
    this.alert.classList.remove('d-none');
    
    let eventShow = new Event('fds.alert.show');
    this.alert.dispatchEvent(eventShow);
};

/* harmony default export */ const components_alert = (Alert);
;// CONCATENATED MODULE: ./src/js/components/back-to-top.js


function BackToTop(backtotop) {
    this.backtotop = backtotop;
}

BackToTop.prototype.init = function () {
    let backtotopbutton = this.backtotop;

    updateBackToTopButton(backtotopbutton);

    const observer = new MutationObserver(list => {
        const evt = new CustomEvent('dom-changed', { detail: list });
        document.body.dispatchEvent(evt)
    });

    // Which mutations to observe
    let config = {
        attributes: true,
        attributeOldValue: false,
        characterData: true,
        characterDataOldValue: false,
        childList: true,
        subtree: true
    };

    // DOM changes
    observer.observe(document.body, config);
    document.body.addEventListener('dom-changed', function (e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Scroll actions
    window.addEventListener('scroll', function (e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Window resizes
    window.addEventListener('resize', function (e) {
        updateBackToTopButton(backtotopbutton);
    });
}

function updateBackToTopButton(button) {
    let docBody = document.body;
    let docElem = document.documentElement;
    let heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
    let heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height,
        docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);

    let limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed

    // Never show the button if the page is too short
    if (limit > heightOfPage) {
        if (!button.classList.contains('d-none')) {
            button.classList.add('d-none');
        }
    }
    // If the page is long, calculate when to show the button
    else {
        if (button.classList.contains('d-none')) {
            button.classList.remove('d-none');
        }

        let lastKnownScrollPosition = window.scrollY;
        let footerVisible = isFooterVisible(document.getElementsByTagName("footer")[0]);

        // Show the button, if the user has scrolled too far down
        if (lastKnownScrollPosition >= limit) {
            // If the footer is visible, place the button on top of the footer
            if (footerVisible && !button.classList.contains('footer-sticky')) {
                button.classList.add('footer-sticky');
            }
            // If the footer is not visible, place the button in the lower right corner
            else if (!footerVisible && button.classList.contains('footer-sticky')) {
                button.classList.remove('footer-sticky');
            }
        }
        // If the page has a sidenav, the threshold is always ignored when the bottom of the sidenav is no longer visible
        else {
            let maybeShowButton = false;

            // Check whether the page has a sidenav (left menu or step guide)
            let sidenav = document.querySelector('.sidenav-list');
            if (sidenav) {
                // Ensure that the sidenav hasn't been hidden, e.g. due to a window resize
                let sidenavParentNotHidden = (sidenav.offsetParent !== null);
                if (sidenavParentNotHidden) {
                    // If the sidenav is responsive, ensure that it is not collapsed
                    let sidenavContainer = sidenav.closest(".overflow-menu-inner");
                    if (sidenavContainer) {
                        if (sidenavContainer.getAttribute('aria-hidden') === "false") {
                            // Check that the sidenav was not opened from an overflow menu
                            let overflowMenu = sidenavContainer.previousElementSibling;
                            if (overflowMenu) {
                                let overflowMenuParentNotHidden = overflowMenu.offsetParent === null;
                                if (overflowMenuParentNotHidden) {
                                    maybeShowButton = true;
                                }
                            }
                        }
                    }
                    else {
                        maybeShowButton = true;
                    }
                }
            }

            if (!maybeShowButton) {
                if (!button.classList.contains('footer-sticky')) {
                    button.classList.add('footer-sticky');
                }
            }
            else {
                let rect = sidenav.getBoundingClientRect();
                // If the sidenav isn't visible, check where to place the button
                if (rect.bottom < 0) {
                    if (!footerVisible && button.classList.contains('footer-sticky')) {
                        button.classList.remove('footer-sticky');
                    }
                    else if (footerVisible && !button.classList.contains('footer-sticky')) {
                        button.classList.add('footer-sticky');
                    }
                }
                // If the sidenav is visible and the scroll threshold hasn't been met, place the button at the footer
                else {
                    if (!button.classList.contains('footer-sticky')) {
                        button.classList.add('footer-sticky');
                    }
                }
            }
        }
    }

}

function isFooterVisible(footerElement) {
    if (footerElement) {
        if (footerElement.querySelector('.footer')) {
            let rect = footerElement.querySelector('.footer').getBoundingClientRect();
            if ((rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight)) {
                // Footer is (partly) visible
                return true;
            }
            else {
                // Footer is not visible
                return false;
            }
        }
        else {
            // Footer class is missing
            return false;
        }
    }
    else {
        // Footer element is missing
        return false;
    }
}

/* harmony default export */ const back_to_top = (BackToTop);
;// CONCATENATED MODULE: ./src/js/components/character-limit.js


const MAX_LENGTH = 'data-maxlength';
const TEXT_CHARACTERLIMIT = {
    "character_remaining": "Du har {value} tegn tilbage",
    "characters_remaining": "Du har {value} tegn tilbage",
    "character_too_many": "Du har {value} tegn for meget",
    "characters_too_many": "Du har {value} tegn for meget"
};

/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
 function CharacterLimit(containerElement, strings = TEXT_CHARACTERLIMIT) {
    if (!containerElement) {
        throw new Error(`Missing form-limit element`);
    }
    this.container = containerElement;
    this.input = containerElement.getElementsByClassName('form-input')[0];
    this.maxlength = this.container.getAttribute(MAX_LENGTH);
    this.text = strings;

    let lastKeyUpTimestamp = null;
    let oldValue = this.input.value;
    let intervalID = null;

    let handleKeyUp = () => {
        updateVisibleMessage(this);
        lastKeyUpTimestamp = Date.now();
    }

    let handleFocus = () => {
        /* Reset the screen reader message on focus to force an update of the message.
        This ensures that a screen reader informs the user of how many characters there is left
        on focus and not just what the character limit is. */
        if (this.input.value !== "") {
            let sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0];
            sr_message.innerHTML = '';
        }
    
        intervalID = setInterval(function () {
            /* Don't update the Screen Reader message unless it's been awhile
            since the last key up event. Otherwise, the user will be spammed
            with audio notifications while typing. */
            if (!lastKeyUpTimestamp || (Date.now() - 500) >= lastKeyUpTimestamp) {
                let sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
                let visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML;     
    
                /* Don't update the messages unless the input has changed or if there
                is a mismatch between the visible message and the screen reader message. */
                if (oldValue !== this.input.value || sr_message !== visible_message) {
                    oldValue = this.input.value;
                    this.updateMessages();
                }
            }
        }.bind(this), 1000);
    }
    
    let handleBlur = () => {
        clearInterval(intervalID);
        // Don't update the messages on blur unless the value of the textarea/text input has changed
        if (oldValue !== this.input.value) {
            oldValue = this.input.value;
            this.updateMessages();
        }
    }

    this.init = function() {
        if (!this.maxlength) {
            throw new Error(`Character limit is missing attribute ${MAX_LENGTH}`);
        }

        this.input.addEventListener('keyup', function() {
            handleKeyUp();
        });
        this.input.addEventListener('focus', function() {
            handleFocus();
        });
        this.input.addEventListener('blur', function() {
            handleBlur();
        });

        /* If the browser supports the pageshow event, use it to update the character limit
        message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
        This ensures that if the user navigates to another page in the browser and goes back, the 
        message and sr-message will show/tell the correct amount of characters left. */
        if ('onpageshow' in window) {
            window.addEventListener('pageshow', () => {
                this.updateMessages();
            });
        } 
        else {
            window.addEventListener('DOMContentLoaded', () => {
                this.updateMessages();
            });
        }
    };
}

CharacterLimit.prototype.charactersLeft = function () {
    let current_length = this.input.value.length;
    return this.maxlength - current_length;
}

function characterLimitMessage(formLimit) {
    let count_message = "";
    let characters_left = formLimit.charactersLeft();

    if (characters_left === -1) {
        let exceeded = Math.abs(characters_left);
        count_message = formLimit.text.character_too_many.replace(/{value}/, exceeded);
    }
    else if (characters_left === 1) {
        count_message = formLimit.text.character_remaining.replace(/{value}/, characters_left);
    }
    else if (characters_left >= 0) {
        count_message = formLimit.text.characters_remaining.replace(/{value}/, characters_left);
    }
    else {
        let exceeded = Math.abs(characters_left);
        count_message = formLimit.text.characters_too_many.replace(/{value}/, exceeded);
    }

    return count_message;
}

function updateVisibleMessage(formLimit) {
    let characters_left = formLimit.charactersLeft();
    let count_message = characterLimitMessage(formLimit);
    let character_label = formLimit.container.getElementsByClassName('character-limit')[0];

    if (characters_left < 0) {
        if (!character_label.classList.contains('limit-exceeded')) {
            character_label.classList.add('limit-exceeded');
        }
        if (!formLimit.input.classList.contains('form-limit-error')) {
            formLimit.input.classList.add('form-limit-error');
        }
    }
    else {
        if (character_label.classList.contains('limit-exceeded')) {
            character_label.classList.remove('limit-exceeded');
        }
        if (formLimit.input.classList.contains('form-limit-error')) {
            formLimit.input.classList.remove('form-limit-error');
        }
    }

    character_label.innerHTML = count_message;
}

function updateScreenReaderMessage(formLimit) {
    let count_message = characterLimitMessage(formLimit);
    let character_label = formLimit.container.getElementsByClassName('character-limit-sr-only')[0];
    character_label.innerHTML = count_message;
}

CharacterLimit.prototype.updateMessages = function () {
    updateVisibleMessage(this);
    updateScreenReaderMessage(this);
}

/* harmony default export */ const character_limit = (CharacterLimit);
;// CONCATENATED MODULE: ./src/js/components/checkbox-toggle-content.js


const TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';

/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */
function CheckboxToggleContent(checkboxElement){
    this.checkboxElement = checkboxElement;
    this.targetElement = null;
}

/**
 * Set events on checkbox state change
 */
CheckboxToggleContent.prototype.init = function(){
    this.checkboxElement.addEventListener('change', this.toggle.bind(this));
    this.toggle();
}

/**
 * Toggle checkbox content
 */
CheckboxToggleContent.prototype.toggle = function(){
    var $module = this;
    var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE)
    var targetEl = document.getElementById(targetAttr);
    if(targetEl === null || targetEl === undefined){
        throw new Error(`Could not find panel element. Verify value of attribute `+ TOGGLE_TARGET_ATTRIBUTE);
    }
    if(this.checkboxElement.checked){
        $module.expand(this.checkboxElement, targetEl);
    }else{
        $module.collapse(this.checkboxElement, targetEl);
    }
}

/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.expand = function(checkboxElement, contentElement){
    if(checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined){
        checkboxElement.setAttribute('data-aria-expanded', 'true');
        contentElement.classList.remove('collapsed');
        contentElement.setAttribute('aria-hidden', 'false');
        let eventOpen = new Event('fds.collapse.expanded');
        checkboxElement.dispatchEvent(eventOpen);
    }
}

/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.collapse = function(triggerEl, targetEl){
    if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
        triggerEl.setAttribute('data-aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');
        
        let eventClose = new Event('fds.collapse.collapsed');
        triggerEl.dispatchEvent(eventClose);
    }
}

/* harmony default export */ const checkbox_toggle_content = (CheckboxToggleContent);

;// CONCATENATED MODULE: ./src/js/components/dropdown.js

const breakpoints = (__webpack_require__(660)/* ["default"] */ .Z);
const dropdown_BUTTON = '.button-overflow-menu';
const jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
const TARGET = 'data-js-target';

/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
function Dropdown (buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;

  if(this.buttonElement === null ||this.buttonElement === undefined){
    throw new Error(`Could not find button for overflow menu component.`);
  }
  let targetAttr = this.buttonElement.getAttribute(TARGET);
  if(targetAttr === null || targetAttr === undefined){
    throw new Error('Attribute could not be found on overflow menu component: '+TARGET);
  }
  let targetEl = document.getElementById(targetAttr.replace('#', ''));
  if(targetEl === null || targetEl === undefined){
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;
}

/**
 * Set click events
 */
Dropdown.prototype.init = function (){
  if(this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined){

    if(this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')){
      this.responsiveListCollapseEnabled = true;
    }

    //Clicked outside dropdown -> close it
    document.getElementsByTagName('body')[ 0 ].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[ 0 ].addEventListener('click', outsideClose);
    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
    let $module = this;
    // set aria-hidden correctly for screenreaders (Tringuide responsive)
    if(this.responsiveListCollapseEnabled) {
      let element = this.buttonElement;
      if (window.IntersectionObserver) {
        // trigger event when button changes visibility
        let observer = new IntersectionObserver(function (entries) {
          // button is visible
          if (entries[ 0 ].intersectionRatio) {
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
          } else{
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
            } else{
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
}

/**
 * Hide overflow menu
 */
Dropdown.prototype.hide = function(){
  dropdown_toggle(this.buttonElement);
}

/**
 * Show overflow menu
 */
Dropdown.prototype.show = function(){
  dropdown_toggle(this.buttonElement);
}

let closeOnEscape = function(event){
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
let getButtons = function (parent) {
  return parent.querySelectorAll(dropdown_BUTTON);
};

/**
 * Close all overflow menus
 * @param {event} event default is null
 */
let closeAll = function (event = null){
  let changed = false;
  const body = document.querySelector('body');

  let overflowMenuEl = document.querySelectorAll(".overflow-menu, .submenu");
  for (let oi = 0; oi < overflowMenuEl.length; oi++) {
    let currentOverflowMenuEL = overflowMenuEl[ oi ];
    let triggerEl = currentOverflowMenuEL.querySelector(dropdown_BUTTON+'[aria-expanded="true"]');
    if(triggerEl !== null){
      changed = true;
      let targetEl = document.getElementById(triggerEl.getAttribute(TARGET).replace('#', ''));

        if (targetEl !== null && triggerEl !== null) {
          if(doResponsiveCollapse(triggerEl)){
            if(triggerEl.getAttribute('aria-expanded') === true){
              let eventClose = new Event('fds.dropdown.close');
              triggerEl.dispatchEvent(eventClose);
            }
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
          }
        }
    }
  }

  if(changed && event !== null){
    event.stopImmediatePropagation();
  }
};
let offset = function (el) {
  let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

let toggleDropdown = function (event, forceClose = false) {
  event.stopPropagation();
  event.preventDefault();

  dropdown_toggle(this, forceClose);

};

let dropdown_toggle = function(button, forceClose = false){
  let triggerEl = button;
  let targetEl = null;
  if(triggerEl !== null && triggerEl !== undefined){
    let targetAttr = triggerEl.getAttribute(TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;

    if(triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');      
      let eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    }else{
      
      if(!document.getElementsByTagName('body')[0].classList.contains('mobile-nav-active')){
        closeAll();
      }
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      let eventOpen = new Event('fds.dropdown.open');
      triggerEl.dispatchEvent(eventOpen);

      let targetOffset = offset(targetEl);
      if(targetOffset.left < 0){
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';

        if(parseInt(window.getComputedStyle(targetEl).marginLeft) < 0) {
          targetEl.style.marginLeft = 0;
        }
      }
      
      let right = targetOffset.left + targetEl.offsetWidth;
      if(right > document.body.clientWidth){
        targetEl.style.left = 'auto';
        targetEl.style.right = '-4px'; // Focus outline
      }
    }

  }
}

let hasParent = function (child, parentTagName){
  if(child.parentNode.tagName === parentTagName){
    return true;
  } else if(parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY'){
    return hasParent(child.parentNode, parentTagName);
  }else{
    return false;
  }
};

let outsideClose = function (evt){
  if(!document.getElementsByTagName('body')[0].classList.contains('mobile-nav-active')){
    if(document.querySelector('body.mobile-nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      let openDropdowns = document.querySelectorAll(dropdown_BUTTON+'[aria-expanded=true]');
      for (let i = 0; i < openDropdowns.length; i++) {
        let triggerEl = openDropdowns[i];
        let targetEl = null;
        let targetAttr = triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          if(targetAttr.indexOf('#') !== -1){
            targetAttr = targetAttr.replace('#', '');
          }
          targetEl = document.getElementById(targetAttr);
        }
        if (doResponsiveCollapse(triggerEl) || (hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay'))) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');          
            let eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
        }
      }
    }
  }
};

let doResponsiveCollapse = function (triggerEl){
  if(!triggerEl.classList.contains(jsDropdownCollapseModifier)){
    // not nav overflow menu
    if(triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else{
      // normal overflow menu
      return true;
    }
  }

  return false;
};

let getTringuideBreakpoint = function (button){
  if(button.parentNode.classList.contains('overflow-menu--md-no-responsive')){
    return breakpoints.md;
  }
  if(button.parentNode.classList.contains('overflow-menu--lg-no-responsive')){
    return breakpoints.lg;
  }
};

/* harmony default export */ const dropdown = (Dropdown);
;// CONCATENATED MODULE: ./src/js/components/dropdown-sort.js



/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort (container){
    this.container = container;
    this.button = container.getElementsByClassName('button-overflow-menu')[0];

    // if no value is selected, choose first option
    if(!this.container.querySelector('.overflow-list li button[aria-current="true"]')){
        this.container.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', "true");
    }

    this.updateSelectedValue();
}

/**
 * Add click events on overflow menu and options in menu
 */
DropdownSort.prototype.init = function(){
    this.overflowMenu = new dropdown(this.button).init();

    let sortingOptions = this.container.querySelectorAll('.overflow-list li button');
    for(let s = 0; s < sortingOptions.length; s++){
        let option = sortingOptions[s];
        option.addEventListener('click', this.onOptionClick.bind(this));
    }
}

/**
 * Update button text to selected value
 */
DropdownSort.prototype.updateSelectedValue = function(){
    let selectedItem = this.container.querySelector('.overflow-list li button[aria-current="true"]');
    this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
}

/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */
DropdownSort.prototype.onOptionClick = function(e){
    let li = e.target.parentNode;
    li.parentNode.querySelector('li button[aria-current="true"]').removeAttribute('aria-current');
    li.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', 'true');

    let button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
    let eventSelected = new Event('fds.dropdown.selected');
    eventSelected.detail = this.target;
    button.dispatchEvent(eventSelected);
    this.updateSelectedValue();

    // hide menu
    let overflowMenu = new dropdown(button);
    overflowMenu.hide();
}

/* harmony default export */ const dropdown_sort = (DropdownSort);

;// CONCATENATED MODULE: ./src/js/components/error-summary.js

/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */
function ErrorSummary (element) {
  this.element = element;
}

/**
 * Set events on links in error summary
 */
ErrorSummary.prototype.init = function () {
  if (!this.element) {
    return
  }
  this.element.focus()

  this.element.addEventListener('click', this.handleClick.bind(this))
}

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target
  if (this.focusTarget(target)) {
    event.preventDefault()
  }
}

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
    return false
  }

  var inputId = this.getFragmentFromUrl($target.href)
  var $input = document.getElementById(inputId)
  if (!$input) {
    return false
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input)
  if (!$legendOrLabel) {
    return false
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView()
  $input.focus({ preventScroll: true })

  return true
}

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
    return false
  }

  return url.split('#').pop()
}

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
  var $fieldset = $input.closest('fieldset')

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend')

    if (legends.length) {
      var $candidateLegend = legends[0]

      // If the input type is radio or checkbox, always use the legend if there
      // is one.
      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend
      }

      // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.
      var legendTop = $candidateLegend.getBoundingClientRect().top
      var inputRect = $input.getBoundingClientRect()

      // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.
      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height

        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend
        }
      }
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
    $input.closest('label')
}

/* harmony default export */ const error_summary = (ErrorSummary);
;// CONCATENATED MODULE: ./src/js/components/modal.js

/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
function Modal($modal) {
    this.$modal = $modal;
    let id = this.$modal.getAttribute('id');
    this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
}

/**
 * Set events
 */
Modal.prototype.init = function () {
    let triggers = this.triggers;
    for (let i = 0; i < triggers.length; i++) {
        let trigger = triggers[i];
        trigger.addEventListener('click', this.show.bind(this));
    }
    let closers = this.$modal.querySelectorAll('[data-modal-close]');
    for (let c = 0; c < closers.length; c++) {
        let closer = closers[c];
        closer.addEventListener('click', this.hide.bind(this));
    }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function () {
    let modalElement = this.$modal;
    if (modalElement !== null) {
        modalElement.setAttribute('aria-hidden', 'true');

        let eventClose = new Event('fds.modal.hidden');
        modalElement.dispatchEvent(eventClose);

        let $backdrop = document.querySelector('#modal-backdrop');
        if ($backdrop) {
            $backdrop.parentNode.removeChild($backdrop);
        }

        document.getElementsByTagName('body')[0].classList.remove('modal-open');

        if (!hasForcedAction(modalElement)) {
            document.removeEventListener('keyup', handleEscape);
        }
        let dataModalOpener = modalElement.getAttribute('data-modal-opener');
        if (dataModalOpener !== null) {
            let opener = document.getElementById(dataModalOpener)
            if (opener !== null) {
                opener.focus();
            }
            modalElement.removeAttribute('data-modal-opener');
        }

        /* Release the focus from the modal */
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            if (bodyChildren[c].classList.contains('fds-modal-inert')) {
                bodyChildren[c].removeAttribute('inert');
                bodyChildren[c].classList.remove('fds-modal-inert');
            }
        }
    }
};

/**
 * Show modal
 */
Modal.prototype.show = function (e = null) {
    let modalElement = this.$modal;
    if (modalElement !== null) {
        if (e !== null) {
            let openerId = e.target.getAttribute('id');
            if (openerId === null) {
                openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
                e.target.setAttribute('id', openerId)
            }
            modalElement.setAttribute('data-modal-opener', openerId);
        }

        // Hide open modals - FDS do not recommend more than one open modal at a time
        let activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
        for (let i = 0; i < activeModals.length; i++) {
            new Modal(activeModals[i]).hide();
        }

        modalElement.setAttribute('aria-hidden', 'false');
        modalElement.setAttribute('tabindex', '-1');

        let eventOpen = new Event('fds.modal.shown');
        modalElement.dispatchEvent(eventOpen);

        let $backdrop = document.createElement('div');
        $backdrop.classList.add('modal-backdrop');
        $backdrop.setAttribute('id', "modal-backdrop");
        document.getElementsByTagName('body')[0].appendChild($backdrop);

        document.getElementsByTagName('body')[0].classList.add('modal-open');

        modalElement.focus();

        if (!hasForcedAction(modalElement)) {
            document.addEventListener('keyup', handleEscape);
        }

        /* Trap the focus inside the modal */
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            let child = bodyChildren[c];
            if (child.tagName !== 'SCRIPT' && !child.classList.contains('fds-modal-container') && !child.hasAttribute('inert')) {
                child.setAttribute('inert', '');
                child.classList.add('fds-modal-inert');
            }
        }
    }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
let handleEscape = function (event) {
    let key = event.key;
    let modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
    let currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
    if (key === 'Escape') {
        let possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
        if (possibleOverflowMenus.length === 0) {
            currentModal.hide();
        }
    }
};

function hasForcedAction(modal) {
    if (modal.getAttribute('data-modal-forced-action') === null) {
        return false;
    }
    return true;
}

/* harmony default export */ const modal = (Modal);

;// CONCATENATED MODULE: ./src/js/components/navigation.js


const forEach = __webpack_require__(84);
const navigation_select = (__webpack_require__(231)/* ["default"] */ .Z);

//const NAV_DESKTOP = `.navigation-header`;
const MOBILE_DRAWER = `.mobile-drawer`;
const NAV_LINKS = `.navigation-menu-mobile a`;
const OPENERS = `.js-menu-open`;
const CLOSE_BUTTON = `.js-menu-close`;
const OVERLAY = `.overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .overlay`;
const TOGGLES = [MOBILE_DRAWER, OVERLAY].join(', ');

const ACTIVE_CLASS = 'mobile-nav-active';
const VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
class Navigation {
    /**
     * Set events
     */
    init() {
        window.addEventListener('resize', mobileMenu, false);
        mobileMenu();

        if (document.getElementsByClassName('mainmenu').length > 0) {
            /* Add an invisible more button to the main menu navigation on desktop */
            createMoreMenu();

            /* Sometimes, it's possible to correctly calculate the width of the menu items
               very early during page load - if it fails, all widths are the same. If possible,
               update the more menu as soon as possible for a better user experience. */
            let widths = [];
            let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
            for (let i = 0; i < mainMenuItems.length - 1; i++) {
                let w = getVisibleWidth(mainMenuItems[i]);
                widths.push(w);
            }
            let allWidthsEqual = (new Set(widths).size === 1); // The same value can't appear twice in a Set. If the size is 1, all widths in the array were equal.
            if (!allWidthsEqual) {
                updateMoreMenu();
            }

            /* Update more menu on window resize */
            window.addEventListener('resize', updateMoreMenu, false);

            // Observe DOM changes to the main menu
            let config = {
                attributes: false,
                attributeOldValue: false,
                characterData: false,
                characterDataOldValue: false,
                childList: true,
                subtree: false
            };
            const callback = function (mutationsList, observer) {
                updateMoreMenu();
            };
            const observer = new MutationObserver(callback);
            observer.observe(document.querySelector('.navigation-menu .mainmenu'), config);
            
            /* Ensure the more menu is correctly displayed when all resources have loaded */
            window.onload = (event) => {
                updateMoreMenu();
            };
        }
    }

    /**
     * Remove events
     */
    teardown() {
        window.removeEventListener('resize', mobileMenu, false);

        if (document.getElementsByClassName('mainmenu').length > 0) {
            document.querySelectorAll('.navigation-menu .more-option')[0].remove;
            window.removeEventListener('resize', updateMoreMenu, false);
        }
    }
}

const createMoreMenu = function () {
    let mainMenu = document.querySelectorAll('.navigation-menu .mainmenu')[0];
    let moreMenu = document.createElement('li');
    moreMenu.classList.add('more-option');
    moreMenu.classList.add('d-none');
    moreMenu.innerHTML = '<div class="submenu"><button class="more-button button-overflow-menu js-dropdown" data-js-target="fds-more-menu" aria-haspopup="true" aria-expanded="false"><span>Mere</span></button><div class="overflow-menu-inner collapsed" id="fds-more-menu" aria-hidden="true"><ul class="overflow-list"></ul></div></div>';
    mainMenu.append(moreMenu);
    new dropdown(document.getElementsByClassName('more-button')[0]).init();
}

const updateMoreMenu = function () {
    let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
    let moreMenu = mainMenuItems[mainMenuItems.length - 1];
    let moreMenuList = document.querySelectorAll('.navigation-menu .more-option .overflow-list')[0];

    /* Calculate available space for main menu items */
    let menuWidth = Math.floor(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0].getBoundingClientRect().width);
    let searchWidth = 0;
    let paddingMoreMenu = 0;
    if (document.querySelectorAll('.navigation-menu.contains-search').length > 0) {
        searchWidth = getVisibleWidth(document.querySelectorAll('.navigation-menu .search')[0]);
    }
    else {
        paddingMoreMenu = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .more-option .more-button')[0]).paddingRight);
    }
    let containerPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0]).paddingRight);
    let availableSpace = menuWidth - searchWidth - containerPadding + paddingMoreMenu;

    /* Find the max amount of main menu items, it is possible to show */
    let widthNeeded = 0;
    for (let i = 0; i < mainMenuItems.length - 1; i++) {
        widthNeeded = widthNeeded + getVisibleWidth(mainMenuItems[i]);
        if (widthNeeded >= availableSpace) {
            break;
        }
    }

    if (widthNeeded < availableSpace) {
        /* More menu not needed */
        for (let l = 0; l < mainMenuItems.length - 1; l++) {
            mainMenuItems[l].classList.remove('d-none');
        }
        moreMenu.classList.add('d-none');
    }
    else {
        let widthNeededWithMoreMenu = getVisibleWidth(moreMenu);
        moreMenuList.innerHTML = "";
        for (let j = 0; j < mainMenuItems.length - 1; j++) {
            widthNeededWithMoreMenu = widthNeededWithMoreMenu + getVisibleWidth(mainMenuItems[j]);
            if (widthNeededWithMoreMenu >= availableSpace) {
                mainMenuItems[j].classList.remove('d-none'); // Make visible temporarily for cloning to the more menu
                if (mainMenuItems[j].getElementsByClassName('submenu').length > 0) {
                    /* The menu items contains subitems */
                    let subMenu = document.createElement('li');
                    if (mainMenuItems[j].getElementsByClassName('active').length > 0) {
                        subMenu.classList.add('active');
                    }
                    let subMenuText = mainMenuItems[j].getElementsByClassName('button-overflow-menu')[0].getElementsByTagName('SPAN')[0].innerText;
                    subMenu.innerHTML = '<ul aria-label="' + subMenuText + '"><span class="sub-title" aria-hidden="true">' + subMenuText + '</span></ul>';
                    let subElements = mainMenuItems[j].getElementsByTagName('LI');
                    for (let k = 0; k < subElements.length; k++) {
                        subMenu.getElementsByTagName('UL')[0].append(subElements[k].cloneNode(true));
                    }
                    moreMenuList.append(subMenu);
                }
                else {
                    /* No subitems - cloning can be done without any issues */
                    moreMenuList.append(mainMenuItems[j].cloneNode(true));
                }
                mainMenuItems[j].classList.add('d-none'); // Hide once cloning is done
            }
            else {
                /* There's room for the main menu item - ensure it is visible */
                mainMenuItems[j].classList.remove('d-none');
            }
        }
        moreMenu.classList.remove('d-none');
    }
}

/* Get the width of an element, even if the element isn't visible */
const getVisibleWidth = function (element) {
    let width = 0;
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
        width = element.getBoundingClientRect().width;
        element.classList.add('d-none')
    }
    else {
        width = element.getBoundingClientRect().width;
    }
    return Math.ceil(width);
}

/**
 * Add functionality to mobile menu
 */
const mobileMenu = function () {
    let mobile = false;

    // Find all menu buttons on page and add toggleNav function
    let openers = document.querySelectorAll(OPENERS);
    for (let o = 0; o < openers.length; o++) {
        if (window.getComputedStyle(openers[o], null).display !== 'none') {
            openers[o].addEventListener('click', toggleNav);
            mobile = true;
        }
    }

    // if mobile
    if (mobile) {

        // Add click listeners to all close elements (e.g. close button and overlay)
        let closers = document.querySelectorAll(CLOSERS);
        for (let c = 0; c < closers.length; c++) {
            closers[c].addEventListener('click', toggleNav);
        }

        let navLinks = document.querySelectorAll(NAV_LINKS);
        for (let n = 0; n < navLinks.length; n++) {
            navLinks[n].addEventListener('click', function () {
                // If a navigation link is clicked inside the mobile menu, ensure that the menu gets hidden
                if (isActive()) {
                    toggleNav.call(this, false);
                }
            });
        }

        const trapContainers = document.querySelectorAll(MOBILE_DRAWER);
        for (let i = 0; i < trapContainers.length; i++) {
            focusTrap = _focusTrap(trapContainers[i]);
        }

    }

    const closer = document.body.querySelector(CLOSE_BUTTON);

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
const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */
const _focusTrap = (trapContainer) => {

    // Find all focusable children
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElements = trapContainer.querySelectorAll(focusableElementsString);
    let firstTabStop = focusableElements[0];

    function trapTabKey(e) {
        var key = event.which || event.keyCode;
        // Check for TAB key press
        if (key === 9) {

            let lastTabStop = null;
            for (let i = 0; i < focusableElements.length; i++) {
                let number = focusableElements.length - 1;
                let element = focusableElements[number - i];
                if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                    lastTabStop = element;
                    break;
                }
            }

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
        if (e.key === 'Escape') {
            toggleNav.call(this, false);
        }
    }

    return {
        enable() {
            // Focus first child
            firstTabStop.focus();
            // Listen for and trap the keyboard
            document.addEventListener('keydown', trapTabKey);
        },

        release() {
            document.removeEventListener('keydown', trapTabKey);
        },
    };
};

let focusTrap;

const toggleNav = function (active) {
    const body = document.body;
    if (typeof active !== 'boolean') {
        active = !isActive();
    }
    body.classList.toggle(ACTIVE_CLASS, active);

    forEach(navigation_select(TOGGLES), el => {
        el.classList.toggle(VISIBLE_CLASS, active);
    });

    if (active) {
        focusTrap.enable();
    } else {
        focusTrap.release();
    }

    const closeButton = body.querySelector(CLOSE_BUTTON);
    const menuButton = body.querySelector(OPENERS);

    if (active && closeButton) {
        // The mobile nav was just activated, so focus on the close button,
        // which is just before all the nav elements in the tab order.
        closeButton.focus();
    } else if (!active && document.activeElement === closeButton &&
        menuButton) {
        // The mobile nav was just deactivated, and focus was on the close
        // button, which is no longer visible. We don't want the focus to
        // disappear into the void, so focus on the menu button if it's
        // visible (this may have been what the user was just focused on,
        // if they triggered the mobile nav by mistake).
        menuButton.focus();
    }

    return active;
};

/* harmony default export */ const navigation = (Navigation);
;// CONCATENATED MODULE: ./src/js/components/navigation-drawer-overflow.js

const navigation_drawer_overflow_TARGET = 'data-js-target';

/**
 * Add functionality to overflow buttons in mobile menu
 * @param {HTMLButtonElement} buttonElement Mobile menu button
 */
function MenuDropdown (buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;

  if(this.buttonElement === null ||this.buttonElement === undefined){
    throw new Error(`Could not find button for overflow menu component.`);
  }
  let targetAttr = this.buttonElement.getAttribute(navigation_drawer_overflow_TARGET);
  if(targetAttr === null || targetAttr === undefined){
    throw new Error('Attribute could not be found on overflow menu component: ' + navigation_drawer_overflow_TARGET);
  }
  let targetEl = document.getElementById(targetAttr.replace('#', ''));
  if(targetEl === null || targetEl === undefined){
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;
}

/**
 * Set click events
 */
MenuDropdown.prototype.init = function (){
  if(this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined){

    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', navigation_drawer_overflow_toggleDropdown);
    this.buttonElement.addEventListener('click', navigation_drawer_overflow_toggleDropdown);
  }
}

/**
 * Hide overflow menu
 */
MenuDropdown.prototype.hide = function(){
  navigation_drawer_overflow_toggle(this.buttonElement);
}

/**
 * Show overflow menu
 */
MenuDropdown.prototype.show = function(){
  navigation_drawer_overflow_toggle(this.buttonElement);
}

let navigation_drawer_overflow_toggleDropdown = function (event, forceClose = false) {
  event.stopPropagation();
  event.preventDefault();

  navigation_drawer_overflow_toggle(this, forceClose);
};

let navigation_drawer_overflow_toggle = function(button, forceClose = false){
  let triggerEl = button;
  let targetEl = null;
  if(triggerEl !== null && triggerEl !== undefined){
    let targetAttr = triggerEl.getAttribute(navigation_drawer_overflow_TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
    if(triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.setAttribute('aria-hidden', 'true');      
      let eventClose = new Event('fds.menudropdown.close');
      triggerEl.dispatchEvent(eventClose);
    }else{
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.setAttribute('aria-hidden', 'false');
      let eventOpen = new Event('fds.menudropdown.open');
      triggerEl.dispatchEvent(eventOpen);
    }

  }
}

/* harmony default export */ const navigation_drawer_overflow = (MenuDropdown);
;// CONCATENATED MODULE: ./src/js/components/radio-toggle-content.js

const TOGGLE_ATTRIBUTE = 'data-controls';

/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */
function RadioToggleGroup(containerElement){
    this.radioGroup = containerElement;
    this.radioEls = null;
    this.targetEl = null;
}

/**
 * Set events
 */
RadioToggleGroup.prototype.init = function (){
    this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
    if(this.radioEls.length === 0){
        throw new Error('No radiobuttons found in radiobutton group.');
    }
    var that = this;

    for(let i = 0; i < this.radioEls.length; i++){
        var radio = this.radioEls[ i ];
        
        radio.addEventListener('change', function (){
            for(let a = 0; a < that.radioEls.length; a++ ){
                that.toggle(that.radioEls[ a ]);
            }
        });
        this.toggle(radio);
    }
}

/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */
RadioToggleGroup.prototype.toggle = function (radioInputElement){
    var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);
    if(contentId !== null && contentId !== undefined && contentId !== ""){
        var contentElement = document.querySelector(contentId);
        if(contentElement === null || contentElement === undefined){
            throw new Error(`Could not find panel element. Verify value of attribute `+ TOGGLE_ATTRIBUTE);
        }
        if(radioInputElement.checked){
            this.expand(radioInputElement, contentElement);
        }else{
            this.collapse(radioInputElement, contentElement);
        }
    }
}

/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement){
    if(radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined){
        radioInputElement.setAttribute('data-expanded', 'true');
        contentElement.setAttribute('aria-hidden', 'false');
        let eventOpen = new Event('fds.radio.expanded');
        radioInputElement.dispatchEvent(eventOpen);
    }
}
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.collapse = function(radioInputElement, contentElement){
    if(radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined){
        radioInputElement.setAttribute('data-expanded', 'false');
        contentElement.setAttribute('aria-hidden', 'true');
        let eventClose = new Event('fds.radio.collapsed');
        radioInputElement.dispatchEvent(eventClose);
    }
}

/* harmony default export */ const radio_toggle_content = (RadioToggleGroup);
;// CONCATENATED MODULE: ./src/js/components/table.js
const table_select = (__webpack_require__(231)/* ["default"] */ .Z);

/**
 * Set data-title on cells, where the attribute is missing
 */
class ResponsiveTable {
    constructor(table) {
        insertHeaderAsAttributes(table);
    }
}

/**
 * Add data attributes needed for responsive mode.
 * @param {HTMLTableElement} tableEl Table element
 */
function insertHeaderAsAttributes(tableEl) {
    if (!tableEl) return;

    let header = tableEl.getElementsByTagName('thead');
    if (header.length !== 0) {
        let headerCellEls = header[0].getElementsByTagName('th');
        if (headerCellEls.length == 0) {
            headerCellEls = header[0].getElementsByTagName('td');
        }

        if (headerCellEls.length > 0) {
            const bodyRowEls = table_select('tbody tr', tableEl);
            Array.from(bodyRowEls).forEach(rowEl => {
                let cellEls = rowEl.children;
                if (cellEls.length === headerCellEls.length) {
                    Array.from(headerCellEls).forEach((headerCellEl, i) => {
                        // Grab header cell text and use it body cell data title.
                        if (!cellEls[i].hasAttribute('data-title') && headerCellEl.tagName === "TH" && !headerCellEl.classList.contains("sr-header")) {
                            cellEls[i].setAttribute('data-title', headerCellEl.textContent);
                        }
                    });
                }
            });
        }
    }
}

/* harmony default export */ const table = (ResponsiveTable);

;// CONCATENATED MODULE: ./src/js/components/tabs.js


// Add or substract depending on key pressed
var direction = {
    'ArrowLeft': -1,
    'ArrowRight': 1,
};

/**
 * Adds functionality to tab container component without URL change
 * @param {HTMLElement} tabContainer Tab container
 */
function Tabs(tabContainer) {
    if (!tabContainer) {
        throw new Error(`Missing tab container element`);
    }
    this.tabContainer = tabContainer;
    this.tabs = this.tabContainer.querySelectorAll('.tab-button');
}

/**
 * Set event on component
 */
Tabs.prototype.init = function () {
    if (this.tabs.length === 0) {
        throw new Error(`tabContainer element seems to be missing a child tab-button. There needs to be atleast one tab of class tab-button to set an active tab`);
    }

    // if no hash is set on load, set active tab
    if (!setActiveHashTab()) {
        // set first tab as active
        let tab = this.tabs[0];

        // check no other tabs has been set at default. If so set tab to the first active tab found
        let alreadyActive = getActiveTabs(this.tabContainer);
        if (alreadyActive.length !== 0) {
            tab = alreadyActive[0];
        }

        // activate and deactivate tabs
        this.activateTab(tab, false);
    }
    let $module = this;
    // add eventlisteners on buttons
    for (let t = 0; t < this.tabs.length; t++) {
        this.tabs[t].addEventListener('click', function () { $module.activateTab(this, false) });
        this.tabs[t].addEventListener('keydown', keydownEventListener);
    }
}

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabs.prototype.activateTab = function (tab, setFocus) {
    let tabs = getAllTabsInList(tab);

    if (tab.getAttribute('aria-selected') !== null) {

        // close all tabs except selected
        for (let i = 0; i < this.tabs.length; i++) {
            if (tabs[i] === tab) {
                continue;
            }

            if (tabs[i].getAttribute('aria-selected') === 'true') {
                let eventClose = new Event('fds.tab.close');
                tabs[i].dispatchEvent(eventClose);
            }

            tabs[i].setAttribute('aria-selected', 'false');
            tabs[i].setAttribute('tabindex', '-1');
            let tabpanelID = tabs[i].getAttribute('aria-controls');
            let tabpanel = document.getElementById(tabpanelID)
            if (tabpanel === null) {
                throw new Error(`Could not find tabpanel from ID.`);
            }
            tabpanel.setAttribute('hidden', '');
        }

        // Set selected tab to active
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        let tabpanelID = tab.getAttribute('aria-controls');
        let tabpanel = document.getElementById(tabpanelID);
        if (tabpanel === null) {
            throw new Error(`Could not find tabpanel to set active.`);
        }
        tabpanel.removeAttribute('hidden');

        // Set focus when required
        if (setFocus) {
            tab.focus();
        }

        let eventChanged = new Event('fds.tab.changed');
        tab.parentNode.parentNode.parentNode.dispatchEvent(eventChanged);

        let eventOpen = new Event('fds.tab.open');
        tab.dispatchEvent(eventOpen);
    }
}

function keydownEventListener(event) {
    let key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
        event.preventDefault();
        if (event.repeat) {
            return;
        }
        switchTabOnKeyPress(event);
    }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnKeyPress(event) {
    let pressed = event.key;
    let target = event.target;
    let greatGrandparentNode = target.parentNode.parentNode.parentNode;
    let tabs = getAllTabsInList(target);
    if (direction[pressed]) {
        let index = getIndexOfElementInList(target, tabs);
        if (index !== -1) {
            if (tabs[index + direction[pressed]]) {
                new Tabs(greatGrandparentNode).activateTab(tabs[index + direction[pressed]], true);
            }
            else if (pressed === 'ArrowLeft') {
                new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
            }
            else if (pressed === 'ArrowRight') {
                new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
            }
        }
    } else if (pressed === 'Home') {
        new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
    } else if (pressed === 'End') {
        new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
    }
}

/**
 * Get all active tabs in list
 * @param tabContainer parent .tab-container element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabContainer) {
    if (tabContainer.querySelector('button.tab-button') !== null) {
        return tabContainer.querySelectorAll('.tab-button[aria-selected=true]');
    } else {
        throw new Error(`tabContainer HTML seems to be missing a tab-button in the tab-container.`);
    }
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
    let greatGrandparentNode = tab.parentNode.parentNode.parentNode;
    if (greatGrandparentNode.classList.contains('tab-container')) {
        return greatGrandparentNode.querySelectorAll('.tab-button');
    } else {
        return [];
    }
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
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
    let hash = location.hash.replace('#', '');
    if (hash !== '' && hash !== "tab-component") {
        let selector = '.tab-button[aria-controls="' + hash + '"]';
        let tab = document.querySelector(selector);
        if (tab !== null) {
            new Tabs(tab.parentNode.parentNode.parentNode).activateTab(tab, false);
            return true;
        }
    }
    return false;
}

/* harmony default export */ const tabs = (Tabs);
;// CONCATENATED MODULE: ./src/js/components/selectable-table.js


/**
 * 
 * @param {HTMLTableElement} table Table Element
 */
function TableSelectableRows (table) {
  this.table = table;
}

/**
 * Initialize eventlisteners for checkboxes in table
 */
TableSelectableRows.prototype.init = function(){
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();
  if(this.tbodyCheckboxList.length !== 0){
    for(let c = 0; c < this.tbodyCheckboxList.length; c++){
      let checkbox = this.tbodyCheckboxList[c];
      checkbox.removeEventListener('change', updateGroupCheck);
      checkbox.addEventListener('change', updateGroupCheck);
    }
  }
  if(this.groupCheckbox !== false){
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
}
  
/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */
TableSelectableRows.prototype.getGroupCheckbox = function(){
  let checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');
  if(checkbox.length === 0){
    return false;
  }
  return checkbox[0];
}
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */
TableSelectableRows.prototype.getCheckboxList = function(){
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
}

/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */
function updateCheckboxList(e){
  let checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  let table = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  let tableSelectableRows = new TableSelectableRows(table);
  let checkboxList = tableSelectableRows.getCheckboxList();
  let checkedNumber = 0;
  if(checkbox.checked){
    for(let c = 0; c < checkboxList.length; c++){
      checkboxList[c].checked = true;
      checkboxList[c].parentNode.parentNode.parentNode.classList.add('table-row-selected');
    }

    checkedNumber = checkboxList.length;
  } else{
    for(let c = 0; c < checkboxList.length; c++){
      checkboxList[c].checked = false;
      checkboxList[c].parentNode.parentNode.parentNode.classList.remove('table-row-selected');
    }
  }
  
  const event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {checkedNumber}
  });
  table.dispatchEvent(event);
}

/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */
function updateGroupCheck(e){
  // update label for event checkbox
  if(e.target.checked){
    e.target.parentNode.parentNode.parentNode.classList.add('table-row-selected');
  } else{
    e.target.parentNode.parentNode.parentNode.classList.remove('table-row-selected');
  }
  let table = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  let tableSelectableRows = new TableSelectableRows(table);
  let groupCheckbox = tableSelectableRows.getGroupCheckbox();
  if(groupCheckbox !== false){
    let checkboxList = tableSelectableRows.getCheckboxList();

    // how many row has been selected
    let checkedNumber = 0;
    for(let c = 0; c < checkboxList.length; c++){
      let loopedCheckbox = checkboxList[c];
      if(loopedCheckbox.checked){
        checkedNumber++;
      }
    }
    
    if(checkedNumber === checkboxList.length){ // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = true;
    } else if(checkedNumber == 0){ // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
    } else{ // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
    }
    const event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {checkedNumber}
    });
    table.dispatchEvent(event);
  }
}

/* harmony default export */ const selectable_table = (TableSelectableRows);
;// CONCATENATED MODULE: ./src/js/components/toast.js

/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */
function Toast (element){
    this.element = element;
}

/**
 * Show toast
 */
Toast.prototype.show = function(){
    this.element.classList.remove('hide');
    this.element.classList.add('showing');
    this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function(){
        let toast = this.parentNode.parentNode;
        new Toast(toast).hide();
    });
    requestAnimationFrame(showToast);
}

/**
 * Hide toast
 */
Toast.prototype.hide = function(){
    this.element.classList.remove('show');
    this.element.classList.add('hide');         
}

/**
 * Adds classes to make show animation
 */
function showToast(){
    let toasts = document.querySelectorAll('.toast.showing');
    for(let t = 0; t < toasts.length; t++){
        let toast = toasts[t];
        toast.classList.remove('showing');
        toast.classList.add('show');
    }
}

/* harmony default export */ const toast = (Toast);
;// CONCATENATED MODULE: ./src/js/components/tooltip.js


const ARROW_DISTANCE_TO_TARGET = 4;     // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8;                 // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const PAGE_MARGIN = 32 * 0.5;           // Must match '$grid-gutter-width' in 'src\stylesheets\variables\variables\_grid.scss'

function Tooltip(wrapper) {
    if ((wrapper.getElementsByClassName('tooltip-target')).length === 0) {
        throw new Error(`Tooltip target is missing. Add class 'tooltip-target' to first element inside tooltip wrapper.`);
    }
    else if ((wrapper.getElementsByClassName('tooltip')).length === 0) {
        throw new Error(`Tooltip element is missing. Add class 'tooltip' to second element inside tooltip wrapper.`);
    }
    else {
        this.wrapper = wrapper;
        this.target = wrapper.getElementsByClassName('tooltip-target')[0];
        this.tooltip = wrapper.getElementsByClassName('tooltip')[0];
    }
}

Tooltip.prototype.init = function () {
    let wrapper = this.wrapper;
    let tooltipTarget = this.target;
    let tooltipEl = this.tooltip;

    hideTooltip(wrapper, tooltipEl);

    window.addEventListener('resize', function () {
        updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
    });
    document.addEventListener('scroll', function () {
        updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
    });
    document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
    document.getElementsByTagName('body')[0].addEventListener('keyup', closeOnTab);

    /* A "true" tooltip describes the element which triggered it and is triggered on hover */
    let trueTooltip = tooltipEl.classList.contains('onhover');
    if (trueTooltip) {

        tooltipTarget.addEventListener('focus', function () {
            showTooltip(wrapper, tooltipEl);
            updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
        });

        tooltipTarget.addEventListener('mouseover', function (e) {
            /* The tooltip should not appear if the user just briefly moves the cursor 
               across the component. Use the 'js-hover' class as a flag to check, if
               the hover action is persistant. */
            tooltipTarget.classList.add('js-hover');
            setTimeout(function () {
                if (tooltipTarget.classList.contains('js-hover')) {
                    showTooltip(wrapper, tooltipEl);
                    updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
                }
            }, 300);
        });
    
        tooltipTarget.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let onTooltip = false;
            if (wrapper.classList.contains('place-above')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && 
                            tooltipTarget.getBoundingClientRect().top >= e.clientY;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && 
                            tooltipTarget.getBoundingClientRect().bottom <= e.clientY;
            }
            /* WCAG 1.4.13: It must be possible to hover on the tooltip */
            if (!onTooltip) {
                hideTooltip(wrapper, tooltipEl);
            }
        });

        tooltipEl.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let onTarget = false;
            if (wrapper.classList.contains('place-above')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && 
                           tooltipEl.getBoundingClientRect().top <= e.clientY;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && 
                           tooltipEl.getBoundingClientRect().bottom >= e.clientY;
            }
            /* Don't remove tooltip, if hover returns to the target which triggered the tooltip */
            if (!onTarget) {
                hideTooltip(wrapper, tooltipEl);
            }
        });
    }
    /* The "tooltip" is actually a "toggletip", i.e. a button which turns a tip on or off */
    else {
        tooltipTarget.addEventListener('click', function () {
            if (wrapper.classList.contains('hide-tooltip')) {
                showTooltip(wrapper, tooltipEl);
                updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
            }
            else {
                hideTooltip(wrapper, tooltipEl);
            }
        });
    }

    tooltipTarget.addEventListener('keyup', function (e) {
        let key = e.key;
        if (key === 'Escape') {
            hideTooltip(wrapper, tooltipEl);
        }
    });
};

function setWidth(tooltipEl) {
    tooltipEl.style.width = 'max-content';
    let WCAG_Reflow_criteria = 320; // Width of 320 px defined in WCAG 2.1, Criterion 1.4.10 "Reflow"
    let accessibleMaxWidth = WCAG_Reflow_criteria - (PAGE_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > accessibleMaxWidth) {
        tooltipEl.style.width = accessibleMaxWidth + 'px';
    }
    let screenMaxWidth = document.body.clientWidth - (PAGE_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > screenMaxWidth) {
        tooltipEl.style.width = screenMaxWidth + 'px';
    }
}

function placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl) {
    let spaceAbove = tooltipTarget.getBoundingClientRect().top;
    let spaceBelow = window.screen.availHeight - tooltipTarget.getBoundingClientRect().bottom;
    let height = tooltipEl.getBoundingClientRect().height + ARROW_DISTANCE_TO_TARGET + ARROW_HEIGHT;
    let placement = 'above'; // Default
    if (tooltipEl.classList.contains('below') && spaceBelow >= height || (height > spaceAbove && height <= spaceBelow)) {
        placement = 'below';
    }
    if (placement === 'above') {
        tooltipWrapper.classList.add('place-above');
        tooltipWrapper.classList.remove('place-below');
    }
    else if (placement === 'below') {
        tooltipWrapper.classList.add('place-below');
        tooltipWrapper.classList.remove('place-above');
    }
}

function setLeft(tooltipTarget, tooltipEl) {
    // Center the tooltip on the tooltip arrow
    let left = (parseInt(tooltipTarget.getBoundingClientRect().width) - parseInt(tooltipEl.getBoundingClientRect().width))/2;
    tooltipEl.style.left = left + 'px';
    // If the tooltip exceeds the left side of the screen, adjust it
    if (tooltipEl.getBoundingClientRect().left < PAGE_MARGIN) {
        let adjustedLeft = 0 - parseInt(tooltipTarget.getBoundingClientRect().left) + PAGE_MARGIN;
        tooltipEl.style.left = adjustedLeft + 'px';
    }
    // If the tooltip exceeds the right side of the screen, adjust it
    else if (tooltipEl.getBoundingClientRect().right > (document.body.clientWidth - PAGE_MARGIN)) {
        let adjustedLeft = parseInt(window.getComputedStyle(tooltipEl).left) - (tooltipEl.getBoundingClientRect().right - document.body.clientWidth + PAGE_MARGIN);
        tooltipEl.style.left = adjustedLeft + 'px';
    }
}

function setBottomAndTop(tooltipWrapper, tooltipEl) {
    let total = 0 - tooltipEl.getBoundingClientRect().height - ARROW_HEIGHT - ARROW_DISTANCE_TO_TARGET + 1;
    if (tooltipWrapper.classList.contains('place-above')) {
        tooltipEl.style.top = total + 'px';
        tooltipEl.style.bottom = 'auto';
    }
    else if (tooltipWrapper.classList.contains('place-below')) {
        tooltipEl.style.bottom = total + 'px';
        tooltipEl.style.top = 'auto';
    }
}

function updateTooltipPosition(tooltipWrapper, tooltipTarget, tooltipEl) {
    setWidth(tooltipEl);
    placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl);
    setLeft(tooltipTarget, tooltipEl);
    setBottomAndTop(tooltipWrapper, tooltipEl);
}

function hideTooltip(tooltipWrapper, tooltipEl) {
    tooltipEl.setAttribute("aria-hidden", "true");
    tooltipWrapper.classList.add('hide-tooltip');
}

function showTooltip(tooltipWrapper, tooltipEl) {
    tooltipEl.setAttribute("aria-hidden", "false");
    tooltipWrapper.classList.remove('hide-tooltip');
}

function closeAllTooltips(event) {
    let tooltips = document.getElementsByClassName('tooltip-wrapper');
    for (let t = 0; t < tooltips.length; t++) {
        let wrapper = tooltips[t];
        let target = wrapper.getElementsByClassName('tooltip-target')[0];
        let tooltip = wrapper.getElementsByClassName('tooltip')[0];
        let clickedOnTarget = target.getBoundingClientRect().left <= event.clientX && 
                              event.clientX <= target.getBoundingClientRect().right && 
                              target.getBoundingClientRect().top <= event.clientY && 
                              event.clientY <= target.getBoundingClientRect().bottom;
        let clickedOnTooltip = window.getComputedStyle(tooltip).display !== 'none' &&
                               tooltip.getBoundingClientRect().left <= event.clientX && 
                               event.clientX <= tooltip.getBoundingClientRect().right && 
                               tooltip.getBoundingClientRect().top <= event.clientY && 
                               event.clientY <= tooltip.getBoundingClientRect().bottom;
        if (!clickedOnTarget && target !== document.activeElement && !clickedOnTooltip) {
            hideTooltip(wrapper, tooltip);
        }
    }
}

function closeOnTab(e) {
    let key = e.key;
    if (key === 'Tab') {
        let tooltips = document.getElementsByClassName('tooltip-wrapper');
        for (let t = 0; t < tooltips.length; t++) {
            let wrapper = tooltips[t];
            let target = wrapper.getElementsByClassName('tooltip-target')[0];
            let tooltip = wrapper.getElementsByClassName('tooltip')[0];
            if (document.activeElement !== target) {
                hideTooltip(wrapper, tooltip);
            }
        }
    }
}

/* harmony default export */ const tooltip = (Tooltip);

;// CONCATENATED MODULE: ./src/js/dkfds.js


















const datePicker = (__webpack_require__(561)/* ["default"] */ .Z);
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
__webpack_require__(742);

/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */
var init = function (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  /*
  ---------------------
  Accordions
  ---------------------
  */
  const jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for(let c = 0; c < jsSelectorAccordion.length; c++){
    new accordion(jsSelectorAccordion[ c ]).init();
  }
  const jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for(let c = 0; c < jsSelectorAccordionBordered.length; c++){
    new accordion(jsSelectorAccordionBordered[ c ]).init();
  }

  /*
  ---------------------
  Alerts
  ---------------------
  */

  const alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');
  for(let c = 0; c < alertsWithCloseButton.length; c++){
    new components_alert(alertsWithCloseButton[ c ]).init();
  }

  /*
  ---------------------
  Back to top button
  ---------------------
  */

  const backToTopButtons = scope.getElementsByClassName('back-to-top-button');
  for(let c = 0; c < backToTopButtons.length; c++){
    new back_to_top(backToTopButtons[ c ]).init();
  }

  /*
  ---------------------
  Character limit
  ---------------------
  */
  const jsCharacterLimit = scope.getElementsByClassName('form-limit');
  for(let c = 0; c < jsCharacterLimit.length; c++){

    new character_limit(jsCharacterLimit[ c ]).init();
  }
  
  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */
  const jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for(let c = 0; c < jsSelectorCheckboxCollapse.length; c++){
    new checkbox_toggle_content(jsSelectorCheckboxCollapse[ c ]).init();
  }

  /*
  ---------------------
  Overflow menu
  ---------------------
  */
  const jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for(let c = 0; c < jsSelectorDropdown.length; c++){
    new dropdown(jsSelectorDropdown[ c ]).init();
  }

  
  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */
  const jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for(let c = 0; c < jsSelectorDropdownSort.length; c++){
    new dropdown_sort(jsSelectorDropdownSort[ c ]).init();
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
  new error_summary($errorSummary).init();

  /*
  ---------------------
  Modal
  ---------------------
  */
  const modals = scope.querySelectorAll('.fds-modal');
  for(let d = 0; d < modals.length; d++) {
    new modal(modals[d]).init();
  }
  
  /*
  ---------------------
  Navigation
  ---------------------
  */
  new navigation().init();

  /*
  ---------------------
  Navigation Drawer Overflow Menus
  ---------------------
  */
  const jsSelectorMenuDropdown = scope.getElementsByClassName('js-menudropdown');
  for(let c = 0; c < jsSelectorMenuDropdown.length; c++){
    new navigation_drawer_overflow(jsSelectorMenuDropdown[ c ]).init();
  }

  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */
  const jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for(let c = 0; c < jsSelectorRadioCollapse.length; c++){
    new radio_toggle_content(jsSelectorRadioCollapse[ c ]).init();
  }

  /*
  ---------------------
  Responsive tables
  ---------------------
  */
  const jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers, table.table-sm-responsive-headers, table.table-md-responsive-headers, table.table-lg-responsive-headers');
  for(let c = 0; c < jsSelectorTable.length; c++){
    new table(jsSelectorTable[ c ]);
  }

  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */
  const jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for(let c = 0; c < jsSelectableTable.length; c++){
    new selectable_table(jsSelectableTable[ c ]).init();
  }

  /*
  ---------------------
  Tabs
  ---------------------
  */
  const jsSelectorTabs = scope.querySelectorAll('div.tab-container');
  for(let c = 0; c < jsSelectorTabs.length; c++){
    new tabs(jsSelectorTabs[ c ]).init();
  }

  /*
  ---------------------
  Tooltip
  ---------------------
  */
  const jsSelectorTooltip = scope.getElementsByClassName('tooltip-wrapper');
  for(let c = 0; c < jsSelectorTooltip.length; c++){
    new tooltip(jsSelectorTooltip[ c ]).init();
  }
  
};



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});