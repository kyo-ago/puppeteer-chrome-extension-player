/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/Puppeteer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/Extension.ts":
/*!*****************************!*\
  !*** ./client/Extension.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Extension; });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);

class Extension extends events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"] {
    constructor(sendCall, closeCall) {
        super();
        this.sendCall = sendCall;
        this.closeCall = closeCall;
    }
    static async create(tabId) {
        let extension;
        return new Promise(resolve => {
            chrome.runtime.onConnect.addListener(port => {
                port.onMessage.addListener(msg => {
                    if (msg.type === 'created') {
                        return resolve(new Extension((message) => {
                            port.postMessage({
                                type: 'send',
                                message,
                            });
                        }, () => {
                            port.disconnect();
                        }));
                    }
                    if (msg.type === 'result') {
                        return extension.emit('message', msg.result);
                    }
                    if (msg.type === 'onEvent') {
                        return extension.emit('message', msg.result);
                    }
                    if (msg.type === 'disconnect') {
                        console.log(msg.reason);
                        return extension.emit('close');
                    }
                });
                port.postMessage({
                    type: 'create',
                    tabId,
                });
            });
        });
    }
    async send(message) {
        this.sendCall(message);
    }
    close() {
        this.closeCall();
    }
}


/***/ }),

/***/ "./client/Launcher.js":
/*!****************************!*\
  !*** ./client/Launcher.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { Connection } = __webpack_require__(/*! ../node_modules/puppeteer-core/lib/Connection */ "./node_modules/puppeteer-core/lib/Connection.js");
const { default: Extension } = __webpack_require__(/*! ./Extension */ "./client/Extension.ts");
const { Browser } = __webpack_require__(/*! ../node_modules/puppeteer-core/lib/Browser */ "./node_modules/puppeteer-core/lib/Browser.js");
const { debugError } = __webpack_require__(/*! ../node_modules/puppeteer-core/lib/helper */ "./node_modules/puppeteer-core/lib/helper.js");

class Launcher {
  /**
   * @param {!(BrowserOptions & {browserWSEndpoint: string})=} options
   * @return {!Promise<!Browser>}
   */
  static async connect(options) {
    const {
      tabId = null,
      ignoreHTTPSErrors = false,
      defaultViewport = { width: 800, height: 600 },
      slowMo = 0,
    } = options;
    let extension = await Extension.create(tabId);
    const connection = new Connection('', extension, slowMo);
    const { browserContextIds } = await connection.send(
      'Target.getBrowserContexts'
    );
    return Browser.create(
      connection,
      browserContextIds,
      ignoreHTTPSErrors,
      defaultViewport,
      null,
      () => connection.send('Browser.close').catch(debugError)
    );
  }
}

module.exports = Launcher;


/***/ }),

/***/ "./client/Puppeteer.js":
/*!*****************************!*\
  !*** ./client/Puppeteer.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { helper } = __webpack_require__(/*! ../node_modules/puppeteer-core/lib/helper */ "./node_modules/puppeteer-core/lib/helper.js");
const Launcher = __webpack_require__(/*! ./Launcher */ "./client/Launcher.js");

module.exports = class {
  /**
   * @param {!Object=} options
   * @return {!Promise<!Puppeteer.Browser>}
   */
  static launch(options) {
    return Launcher.launch(options);
  }

  /**
   * @param {{browserWSEndpoint: string, ignoreHTTPSErrors: boolean}} options
   * @return {!Promise<!Puppeteer.Browser>}
   */
  static connect(options) {
    return Launcher.connect(options);
  }

  /**
   * @return {string}
   */
  static executablePath() {
    return Launcher.executablePath();
  }

  /**
   * @return {!Array<string>}
   */
  static defaultArgs(options) {
    return Launcher.defaultArgs(options);
  }
};

helper.tracePublicAPI(module.exports, 'Puppeteer');


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "./node_modules/node-libs-browser/mock/empty.js":
/*!******************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/empty.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Browser.js":
/*!****************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Browser.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { helper, assert } = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const {Target} = __webpack_require__(/*! ./Target */ "./node_modules/puppeteer-core/lib/Target.js");
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const {TaskQueue} = __webpack_require__(/*! ./TaskQueue */ "./node_modules/puppeteer-core/lib/TaskQueue.js");

class Browser extends EventEmitter {
  /**
   * @param {!Puppeteer.Connection} connection
   * @param {!Array<string>} contextIds
   * @param {boolean} ignoreHTTPSErrors
   * @param {?Puppeteer.Viewport} defaultViewport
   * @param {?Puppeteer.ChildProcess} process
   * @param {(function():Promise)=} closeCallback
   */
  constructor(connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback) {
    super();
    this._ignoreHTTPSErrors = ignoreHTTPSErrors;
    this._defaultViewport = defaultViewport;
    this._process = process;
    this._screenshotTaskQueue = new TaskQueue();
    this._connection = connection;
    this._closeCallback = closeCallback || new Function();

    this._defaultContext = new BrowserContext(this, null);
    /** @type {Map<string, BrowserContext>} */
    this._contexts = new Map();
    for (const contextId of contextIds)
      this._contexts.set(contextId, new BrowserContext(this, contextId));

    /** @type {Map<string, Target>} */
    this._targets = new Map();
    this._connection.setClosedCallback(() => {
      this.emit(Browser.Events.Disconnected);
    });
    this._connection.on('Target.targetCreated', this._targetCreated.bind(this));
    this._connection.on('Target.targetDestroyed', this._targetDestroyed.bind(this));
    this._connection.on('Target.targetInfoChanged', this._targetInfoChanged.bind(this));
  }

  /**
   * @return {?Puppeteer.ChildProcess}
   */
  process() {
    return this._process;
  }

  /**
   * @return {!Promise<!BrowserContext>}
   */
  async createIncognitoBrowserContext() {
    const {browserContextId} = await this._connection.send('Target.createBrowserContext');
    const context = new BrowserContext(this, browserContextId);
    this._contexts.set(browserContextId, context);
    return context;
  }

  /**
   * @return {!Array<!BrowserContext>}
   */
  browserContexts() {
    return [this._defaultContext, ...Array.from(this._contexts.values())];
  }

  /**
   * @param {?string} contextId
   */
  async _disposeContext(contextId) {
    await this._connection.send('Target.disposeBrowserContext', {browserContextId: contextId || undefined});
    this._contexts.delete(contextId);
  }

  /**
   * @param {!Puppeteer.Connection} connection
   * @param {!Array<string>} contextIds
   * @param {boolean} ignoreHTTPSErrors
   * @param {?Puppeteer.Viewport} defaultViewport
   * @param {?Puppeteer.ChildProcess} process
   * @param {function()=} closeCallback
   */
  static async create(connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback) {
    const browser = new Browser(connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback);
    await connection.send('Target.setDiscoverTargets', {discover: true});
    return browser;
  }

  /**
   * @param {!Protocol.Target.targetCreatedPayload} event
   */
  async _targetCreated(event) {
    const targetInfo = event.targetInfo;
    const {browserContextId} = targetInfo;
    const context = (browserContextId && this._contexts.has(browserContextId)) ? this._contexts.get(browserContextId) : this._defaultContext;

    const target = new Target(targetInfo, context, () => this._connection.createSession(targetInfo), this._ignoreHTTPSErrors, this._defaultViewport, this._screenshotTaskQueue);
    assert(!this._targets.has(event.targetInfo.targetId), 'Target should not exist before targetCreated');
    this._targets.set(event.targetInfo.targetId, target);

    if (await target._initializedPromise) {
      this.emit(Browser.Events.TargetCreated, target);
      context.emit(BrowserContext.Events.TargetCreated, target);
    }
  }

  /**
   * @param {{targetId: string}} event
   */
  async _targetDestroyed(event) {
    const target = this._targets.get(event.targetId);
    target._initializedCallback(false);
    this._targets.delete(event.targetId);
    target._closedCallback();
    if (await target._initializedPromise) {
      this.emit(Browser.Events.TargetDestroyed, target);
      target.browserContext().emit(BrowserContext.Events.TargetDestroyed, target);
    }
  }

  /**
   * @param {!Protocol.Target.targetInfoChangedPayload} event
   */
  _targetInfoChanged(event) {
    const target = this._targets.get(event.targetInfo.targetId);
    assert(target, 'target should exist before targetInfoChanged');
    const previousURL = target.url();
    const wasInitialized = target._isInitialized;
    target._targetInfoChanged(event.targetInfo);
    if (wasInitialized && previousURL !== target.url()) {
      this.emit(Browser.Events.TargetChanged, target);
      target.browserContext().emit(BrowserContext.Events.TargetChanged, target);
    }
  }

  /**
   * @return {string}
   */
  wsEndpoint() {
    return this._connection.url();
  }

  /**
   * @return {!Promise<!Puppeteer.Page>}
   */
  async newPage() {
    return this._defaultContext.newPage();
  }

  /**
   * @param {string} contextId
   * @return {!Promise<!Puppeteer.Page>}
   */
  async _createPageInContext(contextId) {
    const {targetId} = await this._connection.send('Target.createTarget', {url: 'about:blank', browserContextId: contextId || undefined});
    const target = await this._targets.get(targetId);
    assert(await target._initializedPromise, 'Failed to create target for page');
    const page = await target.page();
    return page;
  }

  /**
   * @return {!Array<!Target>}
   */
  targets() {
    return Array.from(this._targets.values()).filter(target => target._isInitialized);
  }

  /**
   * @return {!Promise<!Array<!Puppeteer.Page>>}
   */
  async pages() {
    const contextPages = await Promise.all(this.browserContexts().map(context => context.pages()));
    // Flatten array.
    return contextPages.reduce((acc, x) => acc.concat(x), []);
  }

  /**
   * @return {!Promise<string>}
   */
  async version() {
    const version = await this._getVersion();
    return version.product;
  }

  /**
   * @return {!Promise<string>}
   */
  async userAgent() {
    const version = await this._getVersion();
    return version.userAgent;
  }

  async close() {
    await this._closeCallback.call(null);
    this.disconnect();
  }

  disconnect() {
    this._connection.dispose();
  }

  /**
   * @return {!Promise<!Object>}
   */
  _getVersion() {
    return this._connection.send('Browser.getVersion');
  }
}

/** @enum {string} */
Browser.Events = {
  TargetCreated: 'targetcreated',
  TargetDestroyed: 'targetdestroyed',
  TargetChanged: 'targetchanged',
  Disconnected: 'disconnected'
};

class BrowserContext extends EventEmitter {
  /**
   * @param {!Browser} browser
   * @param {?string} contextId
   */
  constructor(browser, contextId) {
    super();
    this._browser = browser;
    this._id = contextId;
  }

  /**
   * @return {!Array<!Target>} target
   */
  targets() {
    return this._browser.targets().filter(target => target.browserContext() === this);
  }

  /**
   * @return {!Promise<!Array<!Puppeteer.Page>>}
   */
  async pages() {
    const pages = await Promise.all(
        this.targets()
            .filter(target => target.type() === 'page')
            .map(target => target.page())
    );
    return pages.filter(page => !!page);
  }

  /**
   * @return {boolean}
   */
  isIncognito() {
    return !!this._id;
  }

  /**
   * @return {!Promise<!Puppeteer.Page>}
   */
  newPage() {
    return this._browser._createPageInContext(this._id);
  }

  /**
   * @return {!Browser}
   */
  browser() {
    return this._browser;
  }

  async close() {
    assert(this._id, 'Non-incognito profiles cannot be closed!');
    await this._browser._disposeContext(this._id);
  }
}

/** @enum {string} */
BrowserContext.Events = {
  TargetCreated: 'targetcreated',
  TargetDestroyed: 'targetdestroyed',
  TargetChanged: 'targetchanged',
};

helper.tracePublicAPI(BrowserContext);
helper.tracePublicAPI(Browser);

module.exports = {Browser, BrowserContext};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Connection.js":
/*!*******************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Connection.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const debugProtocol = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('puppeteer:protocol');
const debugSession = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('puppeteer:session');

const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const WebSocket = __webpack_require__(/*! ws */ "ws");
const Pipe = __webpack_require__(/*! ./Pipe */ "./node_modules/puppeteer-core/lib/Pipe.js");

class Connection extends EventEmitter {
  /**
   * @param {string} url
   * @param {number=} delay
   * @return {!Promise<!Connection>}
   */
  static async createForWebSocket(url, delay = 0) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url, { perMessageDeflate: false });
      ws.on('open', () => resolve(new Connection(url, ws, delay)));
      ws.on('error', reject);
    });
  }

  /**
   * @param {!NodeJS.WritableStream} pipeWrite
   * @param {!NodeJS.ReadableStream} pipeRead
   * @param {number=} delay
   * @return {!Connection}
   */
  static createForPipe(pipeWrite, pipeRead, delay = 0) {
    return new Connection('', new Pipe(pipeWrite, pipeRead), delay);
  }

  /**
   * @param {string} url
   * @param {!Puppeteer.ConnectionTransport} transport
   * @param {number=} delay
   */
  constructor(url, transport, delay = 0) {
    super();
    this._url = url;
    this._lastId = 0;
    /** @type {!Map<number, {resolve: function, reject: function, error: !Error, method: string}>}*/
    this._callbacks = new Map();
    this._delay = delay;

    this._transport = transport;
    this._transport.on('message', this._onMessage.bind(this));
    this._transport.on('close', this._onClose.bind(this));
    /** @type {!Map<string, !CDPSession>}*/
    this._sessions = new Map();
  }

  /**
   * @return {string}
   */
  url() {
    return this._url;
  }

  /**
   * @param {string} method
   * @param {!Object=} params
   * @return {!Promise<?Object>}
   */
  send(method, params = {}) {
    const id = ++this._lastId;
    const message = JSON.stringify({id, method, params});
    debugProtocol('SEND ► ' + message);
    this._transport.send(message);
    return new Promise((resolve, reject) => {
      this._callbacks.set(id, {resolve, reject, error: new Error(), method});
    });
  }

  /**
   * @param {function()} callback
   */
  setClosedCallback(callback) {
    this._closeCallback = callback;
  }

  /**
   * @param {string} message
   */
  async _onMessage(message) {
    if (this._delay)
      await new Promise(f => setTimeout(f, this._delay));
    debugProtocol('◀ RECV ' + message);
    const object = JSON.parse(message);
    if (object.id) {
      const callback = this._callbacks.get(object.id);
      // Callbacks could be all rejected if someone has called `.dispose()`.
      if (callback) {
        this._callbacks.delete(object.id);
        if (object.error)
          callback.reject(createProtocolError(callback.error, callback.method, object));
        else
          callback.resolve(object.result);
      }
    } else {
      if (object.method === 'Target.receivedMessageFromTarget') {
        const session = this._sessions.get(object.params.sessionId);
        if (session)
          session._onMessage(object.params.message);
      } else if (object.method === 'Target.detachedFromTarget') {
        const session = this._sessions.get(object.params.sessionId);
        if (session)
          session._onClosed();
        this._sessions.delete(object.params.sessionId);
      } else {
        this.emit(object.method, object.params);
      }
    }
  }

  _onClose() {
    if (this._closeCallback) {
      this._closeCallback();
      this._closeCallback = null;
    }
    this._transport.removeAllListeners();
    // If transport throws any error at this point of time, we don't care and should swallow it.
    this._transport.on('error', () => {});
    for (const callback of this._callbacks.values())
      callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Target closed.`));
    this._callbacks.clear();
    for (const session of this._sessions.values())
      session._onClosed();
    this._sessions.clear();
  }

  dispose() {
    this._onClose();
    this._transport.close();
  }

  /**
   * @param {Protocol.Target.TargetInfo} targetInfo
   * @return {!Promise<!CDPSession>}
   */
  async createSession(targetInfo) {
    const {sessionId} = await this.send('Target.attachToTarget', {targetId: targetInfo.targetId});
    const session = new CDPSession(this, targetInfo.type, sessionId);
    this._sessions.set(sessionId, session);
    return session;
  }
}

class CDPSession extends EventEmitter {
  /**
   * @param {!Connection|!CDPSession} connection
   * @param {string} targetType
   * @param {string} sessionId
   */
  constructor(connection, targetType, sessionId) {
    super();
    this._lastId = 0;
    /** @type {!Map<number, {resolve: function, reject: function, error: !Error, method: string}>}*/
    this._callbacks = new Map();
    this._connection = connection;
    this._targetType = targetType;
    this._sessionId = sessionId;
    /** @type {!Map<string, !CDPSession>}*/
    this._sessions = new Map();
  }

  /**
   * @param {string} method
   * @param {!Object=} params
   * @return {!Promise<?Object>}
   */
  send(method, params = {}) {
    if (!this._connection)
      return Promise.reject(new Error(`Protocol error (${method}): Session closed. Most likely the ${this._targetType} has been closed.`));
    const id = ++this._lastId;
    const message = JSON.stringify({id, method, params});
    debugSession('SEND ► ' + message);
    this._connection.send('Target.sendMessageToTarget', {sessionId: this._sessionId, message}).catch(e => {
      // The response from target might have been already dispatched.
      if (!this._callbacks.has(id))
        return;
      const callback = this._callbacks.get(id);
      this._callbacks.delete(id);
      callback.reject(rewriteError(callback.error, e && e.message));
    });
    return new Promise((resolve, reject) => {
      this._callbacks.set(id, {resolve, reject, error: new Error(), method});
    });
  }

  /**
   * @param {string} message
   */
  _onMessage(message) {
    debugSession('◀ RECV ' + message);
    const object = JSON.parse(message);
    if (object.id && this._callbacks.has(object.id)) {
      const callback = this._callbacks.get(object.id);
      this._callbacks.delete(object.id);
      if (object.error)
        callback.reject(createProtocolError(callback.error, callback.method, object));
      else
        callback.resolve(object.result);
    } else {
      if (object.method === 'Target.receivedMessageFromTarget') {
        const session = this._sessions.get(object.params.sessionId);
        if (session)
          session._onMessage(object.params.message);
      } else if (object.method === 'Target.detachedFromTarget') {
        const session = this._sessions.get(object.params.sessionId);
        if (session) {
          session._onClosed();
          this._sessions.delete(object.params.sessionId);
        }
      }
      assert(!object.id);
      this.emit(object.method, object.params);
    }
  }

  async detach() {
    await this._connection.send('Target.detachFromTarget',  {sessionId: this._sessionId});
  }

  _onClosed() {
    for (const callback of this._callbacks.values())
      callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Target closed.`));
    this._callbacks.clear();
    this._connection = null;
  }

  /**
   * @param {string} targetType
   * @param {string} sessionId
   */
  _createSession(targetType, sessionId) {
    const session = new CDPSession(this, targetType, sessionId);
    this._sessions.set(sessionId, session);
    return session;
  }
}
helper.tracePublicAPI(CDPSession);

/**
 * @param {!Error} error
 * @param {string} method
 * @param {{error: {message: string, data: any}}} object
 * @return {!Error}
 */
function createProtocolError(error, method, object) {
  let message = `Protocol error (${method}): ${object.error.message}`;
  if ('data' in object.error)
    message += ` ${object.error.data}`;
  if (object.error.message)
    return rewriteError(error, message);
}

/**
 * @param {!Error} error
 * @param {string} message
 * @return {!Error}
 */
function rewriteError(error, message) {
  error.message = message;
  return error;
}

module.exports = {Connection, CDPSession};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Coverage.js":
/*!*****************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Coverage.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {helper, debugError, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");

const {EVALUATION_SCRIPT_URL} = __webpack_require__(/*! ./ExecutionContext */ "./node_modules/puppeteer-core/lib/ExecutionContext.js");

/**
 * @typedef {Object} CoverageEntry
 * @property {string} url
 * @property {string} text
 * @property {!Array<!{start: number, end: number}>} ranges
 */

class Coverage {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._jsCoverage = new JSCoverage(client);
    this._cssCoverage = new CSSCoverage(client);
  }

  /**
   * @param {!Object} options
   */
  async startJSCoverage(options) {
    return await this._jsCoverage.start(options);
  }

  /**
   * @return {!Promise<!Array<!CoverageEntry>>}
   */
  async stopJSCoverage() {
    return await this._jsCoverage.stop();
  }

  /**
   * @param {!Object} options
   */
  async startCSSCoverage(options) {
    return await this._cssCoverage.start(options);
  }

  /**
   * @return {!Promise<!Array<!CoverageEntry>>}
   */
  async stopCSSCoverage() {
    return await this._cssCoverage.stop();
  }
}

module.exports = {Coverage};
helper.tracePublicAPI(Coverage);

class JSCoverage {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._client = client;
    this._enabled = false;
    this._scriptURLs = new Map();
    this._scriptSources = new Map();
    this._eventListeners = [];
    this._resetOnNavigation = false;
  }

  /**
   * @param {!Object} options
   */
  async start(options = {}) {
    assert(!this._enabled, 'JSCoverage is already enabled');
    this._resetOnNavigation = options.resetOnNavigation === undefined ? true : !!options.resetOnNavigation;
    this._reportAnonymousScripts = !!options.reportAnonymousScripts;
    this._enabled = true;
    this._scriptURLs.clear();
    this._scriptSources.clear();
    this._eventListeners = [
      helper.addEventListener(this._client, 'Debugger.scriptParsed', this._onScriptParsed.bind(this)),
      helper.addEventListener(this._client, 'Runtime.executionContextsCleared', this._onExecutionContextsCleared.bind(this)),
    ];
    await Promise.all([
      this._client.send('Profiler.enable'),
      this._client.send('Profiler.startPreciseCoverage', {callCount: false, detailed: true}),
      this._client.send('Debugger.enable'),
      this._client.send('Debugger.setSkipAllPauses', {skip: true})
    ]);
  }

  _onExecutionContextsCleared() {
    if (!this._resetOnNavigation)
      return;
    this._scriptURLs.clear();
    this._scriptSources.clear();
  }

  /**
   * @param {!Protocol.Debugger.scriptParsedPayload} event
   */
  async _onScriptParsed(event) {
    // Ignore puppeteer-injected scripts
    if (event.url === EVALUATION_SCRIPT_URL)
      return;
    // Ignore other anonymous scripts unless the reportAnonymousScripts option is true.
    if (!event.url && !this._reportAnonymousScripts)
      return;
    try {
      const response = await this._client.send('Debugger.getScriptSource', {scriptId: event.scriptId});
      this._scriptURLs.set(event.scriptId, event.url);
      this._scriptSources.set(event.scriptId, response.scriptSource);
    } catch (e) {
      // This might happen if the page has already navigated away.
      debugError(e);
    }
  }

  /**
   * @return {!Promise<!Array<!CoverageEntry>>}
   */
  async stop() {
    assert(this._enabled, 'JSCoverage is not enabled');
    this._enabled = false;
    const [profileResponse] = await Promise.all([
      this._client.send('Profiler.takePreciseCoverage'),
      this._client.send('Profiler.stopPreciseCoverage'),
      this._client.send('Profiler.disable'),
      this._client.send('Debugger.disable'),
    ]);
    helper.removeEventListeners(this._eventListeners);

    const coverage = [];
    for (const entry of profileResponse.result) {
      let url = this._scriptURLs.get(entry.scriptId);
      if (!url && this._reportAnonymousScripts)
        url = 'debugger://VM' + entry.scriptId;
      const text = this._scriptSources.get(entry.scriptId);
      if (text === undefined || url === undefined)
        continue;
      const flattenRanges = [];
      for (const func of entry.functions)
        flattenRanges.push(...func.ranges);
      const ranges = convertToDisjointRanges(flattenRanges);
      coverage.push({url, ranges, text});
    }
    return coverage;
  }
}

class CSSCoverage {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._client = client;
    this._enabled = false;
    this._stylesheetURLs = new Map();
    this._stylesheetSources = new Map();
    this._eventListeners = [];
    this._resetOnNavigation = false;
  }

  /**
   * @param {!Object} options
   */
  async start(options = {}) {
    assert(!this._enabled, 'CSSCoverage is already enabled');
    this._resetOnNavigation = options.resetOnNavigation === undefined ? true : !!options.resetOnNavigation;
    this._enabled = true;
    this._stylesheetURLs.clear();
    this._stylesheetSources.clear();
    this._eventListeners = [
      helper.addEventListener(this._client, 'CSS.styleSheetAdded', this._onStyleSheet.bind(this)),
      helper.addEventListener(this._client, 'Runtime.executionContextsCleared', this._onExecutionContextsCleared.bind(this)),
    ];
    await Promise.all([
      this._client.send('DOM.enable'),
      this._client.send('CSS.enable'),
      this._client.send('CSS.startRuleUsageTracking'),
    ]);
  }

  _onExecutionContextsCleared() {
    if (!this._resetOnNavigation)
      return;
    this._stylesheetURLs.clear();
    this._stylesheetSources.clear();
  }

  /**
   * @param {!Protocol.CSS.styleSheetAddedPayload} event
   */
  async _onStyleSheet(event) {
    const header = event.header;
    // Ignore anonymous scripts
    if (!header.sourceURL)
      return;
    try {
      const response = await this._client.send('CSS.getStyleSheetText', {styleSheetId: header.styleSheetId});
      this._stylesheetURLs.set(header.styleSheetId, header.sourceURL);
      this._stylesheetSources.set(header.styleSheetId, response.text);
    } catch (e) {
      // This might happen if the page has already navigated away.
      debugError(e);
    }
  }

  /**
   * @return {!Promise<!Array<!CoverageEntry>>}
   */
  async stop() {
    assert(this._enabled, 'CSSCoverage is not enabled');
    this._enabled = false;
    const [ruleTrackingResponse] = await Promise.all([
      this._client.send('CSS.stopRuleUsageTracking'),
      this._client.send('CSS.disable'),
      this._client.send('DOM.disable'),
    ]);
    helper.removeEventListeners(this._eventListeners);

    // aggregate by styleSheetId
    const styleSheetIdToCoverage = new Map();
    for (const entry of ruleTrackingResponse.ruleUsage) {
      let ranges = styleSheetIdToCoverage.get(entry.styleSheetId);
      if (!ranges) {
        ranges = [];
        styleSheetIdToCoverage.set(entry.styleSheetId, ranges);
      }
      ranges.push({
        startOffset: entry.startOffset,
        endOffset: entry.endOffset,
        count: entry.used ? 1 : 0,
      });
    }

    const coverage = [];
    for (const styleSheetId of this._stylesheetURLs.keys()) {
      const url = this._stylesheetURLs.get(styleSheetId);
      const text = this._stylesheetSources.get(styleSheetId);
      const ranges = convertToDisjointRanges(styleSheetIdToCoverage.get(styleSheetId) || []);
      coverage.push({url, ranges, text});
    }

    return coverage;
  }
}

/**
 * @param {!Array<!{startOffset:number, endOffset:number, count:number}>} nestedRanges
 * @return {!Array<!{start:number, end:number}>}
 */
function convertToDisjointRanges(nestedRanges) {
  const points = [];
  for (const range of nestedRanges) {
    points.push({ offset: range.startOffset, type: 0, range });
    points.push({ offset: range.endOffset, type: 1, range });
  }
  // Sort points to form a valid parenthesis sequence.
  points.sort((a, b) => {
    // Sort with increasing offsets.
    if (a.offset !== b.offset)
      return a.offset - b.offset;
    // All "end" points should go before "start" points.
    if (a.type !== b.type)
      return b.type - a.type;
    const aLength = a.range.endOffset - a.range.startOffset;
    const bLength = b.range.endOffset - b.range.startOffset;
    // For two "start" points, the one with longer range goes first.
    if (a.type === 0)
      return bLength - aLength;
    // For two "end" points, the one with shorter range goes first.
    return aLength - bLength;
  });

  const hitCountStack = [];
  const results = [];
  let lastOffset = 0;
  // Run scanning line to intersect all ranges.
  for (const point of points) {
    if (hitCountStack.length && lastOffset < point.offset && hitCountStack[hitCountStack.length - 1] > 0) {
      const lastResult = results.length ? results[results.length - 1] : null;
      if (lastResult && lastResult.end === lastOffset)
        lastResult.end = point.offset;
      else
        results.push({start: lastOffset, end: point.offset});
    }
    lastOffset = point.offset;
    if (point.type === 0)
      hitCountStack.push(point.range.count);
    else
      hitCountStack.pop();
  }
  // Filter out empty ranges.
  return results.filter(range => range.end - range.start > 1);
}



/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Dialog.js":
/*!***************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Dialog.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");

class Dialog {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {string} type
   * @param {string} message
   * @param {(string|undefined)} defaultValue
   */
  constructor(client, type, message, defaultValue = '') {
    this._client = client;
    this._type = type;
    this._message = message;
    this._handled = false;
    this._defaultValue = defaultValue;
  }

  /**
   * @return {string}
   */
  type() {
    return this._type;
  }

  /**
   * @return {string}
   */
  message() {
    return this._message;
  }

  /**
   * @return {string}
   */
  defaultValue() {
    return this._defaultValue;
  }

  /**
   * @param {string=} promptText
   */
  async accept(promptText) {
    assert(!this._handled, 'Cannot accept dialog which is already handled!');
    this._handled = true;
    await this._client.send('Page.handleJavaScriptDialog', {
      accept: true,
      promptText: promptText
    });
  }

  async dismiss() {
    assert(!this._handled, 'Cannot dismiss dialog which is already handled!');
    this._handled = true;
    await this._client.send('Page.handleJavaScriptDialog', {
      accept: false
    });
  }
}

Dialog.Type = {
  Alert: 'alert',
  BeforeUnload: 'beforeunload',
  Confirm: 'confirm',
  Prompt: 'prompt'
};

module.exports = {Dialog};
helper.tracePublicAPI(Dialog);


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/ElementHandle.js":
/*!**********************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/ElementHandle.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
const {JSHandle} = __webpack_require__(/*! ./ExecutionContext */ "./node_modules/puppeteer-core/lib/ExecutionContext.js");
const {helper, assert, debugError} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");

class ElementHandle extends JSHandle {
  /**
   * @param {!Puppeteer.ExecutionContext} context
   * @param {!Puppeteer.CDPSession} client
   * @param {!Protocol.Runtime.RemoteObject} remoteObject
   * @param {!Puppeteer.Page} page
   * @param {!Puppeteer.FrameManager} frameManager
   */
  constructor(context, client, remoteObject, page, frameManager) {
    super(context, client, remoteObject);
    this._client = client;
    this._remoteObject = remoteObject;
    this._page = page;
    this._frameManager = frameManager;
    this._disposed = false;
  }

  /**
   * @override
   * @return {?ElementHandle}
   */
  asElement() {
    return this;
  }

  /**
   * @return {!Promise<?Puppeteer.Frame>}
   */
  async contentFrame() {
    const nodeInfo = await this._client.send('DOM.describeNode', {
      objectId: this._remoteObject.objectId
    });
    if (typeof nodeInfo.node.frameId !== 'string')
      return null;
    return this._frameManager.frame(nodeInfo.node.frameId);
  }

  async _scrollIntoViewIfNeeded() {
    const error = await this.executionContext().evaluate(async(element, pageJavascriptEnabled) => {
      if (!element.isConnected)
        return 'Node is detached from document';
      if (element.nodeType !== Node.ELEMENT_NODE)
        return 'Node is not of type HTMLElement';
      // force-scroll if page's javascript is disabled.
      if (!pageJavascriptEnabled) {
        element.scrollIntoView({block: 'center', inline: 'center', behavior: 'instant'});
        return false;
      }
      const visibleRatio = await new Promise(resolve => {
        const observer = new IntersectionObserver(entries => {
          resolve(entries[0].intersectionRatio);
          observer.disconnect();
        });
        observer.observe(element);
      });
      if (visibleRatio !== 1.0)
        element.scrollIntoView({block: 'center', inline: 'center', behavior: 'instant'});
      return false;
    }, this, this._page._javascriptEnabled);
    if (error)
      throw new Error(error);
  }

  /**
   * @return {!Promise<!{x: number, y: number}>}
   */
  async _clickablePoint() {
    const result = await this._client.send('DOM.getContentQuads', {
      objectId: this._remoteObject.objectId
    }).catch(debugError);
    if (!result || !result.quads.length)
      throw new Error('Node is either not visible or not an HTMLElement');
    // Filter out quads that have too small area to click into.
    const quads = result.quads.map(quad => this._fromProtocolQuad(quad)).filter(quad => computeQuadArea(quad) > 1);
    if (!quads.length)
      throw new Error('Node is either not visible or not an HTMLElement');
    // Return the middle point of the first quad.
    const quad = quads[0];
    let x = 0;
    let y = 0;
    for (const point of quad) {
      x += point.x;
      y += point.y;
    }
    return {
      x: x / 4,
      y: y / 4
    };
  }

  /**
   * @return {!Promise<void|Protocol.DOM.getBoxModelReturnValue>}
   */
  _getBoxModel() {
    return this._client.send('DOM.getBoxModel', {
      objectId: this._remoteObject.objectId
    }).catch(error => debugError(error));
  }

  /**
   * @param {!Array<number>} quad
   * @return {!Array<object>}
   */
  _fromProtocolQuad(quad) {
    return [
      {x: quad[0], y: quad[1]},
      {x: quad[2], y: quad[3]},
      {x: quad[4], y: quad[5]},
      {x: quad[6], y: quad[7]}
    ];
  }

  async hover() {
    await this._scrollIntoViewIfNeeded();
    const {x, y} = await this._clickablePoint();
    await this._page.mouse.move(x, y);
  }

  /**
   * @param {!Object=} options
   */
  async click(options = {}) {
    await this._scrollIntoViewIfNeeded();
    const {x, y} = await this._clickablePoint();
    await this._page.mouse.click(x, y, options);
  }

  /**
   * @param {!Array<string>} filePaths
   * @return {!Promise}
   */
  async uploadFile(...filePaths) {
    const files = filePaths.map(filePath => path.resolve(filePath));
    const objectId = this._remoteObject.objectId;
    return this._client.send('DOM.setFileInputFiles', { objectId, files });
  }

  async tap() {
    await this._scrollIntoViewIfNeeded();
    const {x, y} = await this._clickablePoint();
    await this._page.touchscreen.tap(x, y);
  }

  async focus() {
    await this.executionContext().evaluate(element => element.focus(), this);
  }

  /**
   * @param {string} text
   * @param {{delay: (number|undefined)}=} options
   */
  async type(text, options) {
    await this.focus();
    await this._page.keyboard.type(text, options);
  }

  /**
   * @param {string} key
   * @param {!Object=} options
   */
  async press(key, options) {
    await this.focus();
    await this._page.keyboard.press(key, options);
  }

  /**
   * @return {!Promise<?{x: number, y: number, width: number, height: number}>}
   */
  async boundingBox() {
    const result = await this._getBoxModel();

    if (!result)
      return null;

    const quad = result.model.border;
    const x = Math.min(quad[0], quad[2], quad[4], quad[6]);
    const y = Math.min(quad[1], quad[3], quad[5], quad[7]);
    const width = Math.max(quad[0], quad[2], quad[4], quad[6]) - x;
    const height = Math.max(quad[1], quad[3], quad[5], quad[7]) - y;

    return {x, y, width, height};
  }

  /**
   * @return {!Promise<?object>}
   */
  async boxModel() {
    const result = await this._getBoxModel();

    if (!result)
      return null;

    const {content, padding, border, margin, width, height} = result.model;
    return {
      content: this._fromProtocolQuad(content),
      padding: this._fromProtocolQuad(padding),
      border: this._fromProtocolQuad(border),
      margin: this._fromProtocolQuad(margin),
      width,
      height
    };
  }

  /**
   *
   * @param {!Object=} options
   * @returns {!Promise<Object>}
   */
  async screenshot(options = {}) {
    let needsViewportReset = false;

    let boundingBox = await this.boundingBox();
    assert(boundingBox, 'Node is either not visible or not an HTMLElement');

    const viewport = this._page.viewport();

    if (boundingBox.width > viewport.width || boundingBox.height > viewport.height) {
      const newViewport = {
        width: Math.max(viewport.width, Math.ceil(boundingBox.width)),
        height: Math.max(viewport.height, Math.ceil(boundingBox.height)),
      };
      await this._page.setViewport(Object.assign({}, viewport, newViewport));

      needsViewportReset = true;
    }

    await this._scrollIntoViewIfNeeded();

    boundingBox = await this.boundingBox();
    assert(boundingBox, 'Node is either not visible or not an HTMLElement');

    const { layoutViewport: { pageX, pageY } } = await this._client.send('Page.getLayoutMetrics');

    const clip = Object.assign({}, boundingBox);
    clip.x += pageX;
    clip.y += pageY;

    const imageData = await this._page.screenshot(Object.assign({}, {
      clip
    }, options));

    if (needsViewportReset)
      await this._page.setViewport(viewport);

    return imageData;
  }

  /**
   * @param {string} selector
   * @return {!Promise<?ElementHandle>}
   */
  async $(selector) {
    const handle = await this.executionContext().evaluateHandle(
        (element, selector) => element.querySelector(selector),
        this, selector
    );
    const element = handle.asElement();
    if (element)
      return element;
    await handle.dispose();
    return null;
  }

  /**
   * @param {string} selector
   * @return {!Promise<!Array<!ElementHandle>>}
   */
  async $$(selector) {
    const arrayHandle = await this.executionContext().evaluateHandle(
        (element, selector) => element.querySelectorAll(selector),
        this, selector
    );
    const properties = await arrayHandle.getProperties();
    await arrayHandle.dispose();
    const result = [];
    for (const property of properties.values()) {
      const elementHandle = property.asElement();
      if (elementHandle)
        result.push(elementHandle);
    }
    return result;
  }

  /**
   * @param {string} selector
   * @param {Function|String} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $eval(selector, pageFunction, ...args) {
    const elementHandle = await this.$(selector);
    if (!elementHandle)
      throw new Error(`Error: failed to find element matching selector "${selector}"`);
    const result = await this.executionContext().evaluate(pageFunction, elementHandle, ...args);
    await elementHandle.dispose();
    return result;
  }

  /**
   * @param {string} selector
   * @param {Function|String} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $$eval(selector, pageFunction, ...args) {
    const arrayHandle = await this.executionContext().evaluateHandle(
        (element, selector) => Array.from(element.querySelectorAll(selector)),
        this, selector
    );

    const result = await this.executionContext().evaluate(pageFunction, arrayHandle, ...args);
    await arrayHandle.dispose();
    return result;
  }

  /**
   * @param {string} expression
   * @return {!Promise<!Array<!ElementHandle>>}
   */
  async $x(expression) {
    const arrayHandle = await this.executionContext().evaluateHandle(
        (element, expression) => {
          const document = element.ownerDocument || element;
          const iterator = document.evaluate(expression, element, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
          const array = [];
          let item;
          while ((item = iterator.iterateNext()))
            array.push(item);
          return array;
        },
        this, expression
    );
    const properties = await arrayHandle.getProperties();
    await arrayHandle.dispose();
    const result = [];
    for (const property of properties.values()) {
      const elementHandle = property.asElement();
      if (elementHandle)
        result.push(elementHandle);
    }
    return result;
  }

  /**
   * @returns {!Promise<boolean>}
   */
  isIntersectingViewport() {
    return this.executionContext().evaluate(async element => {
      const visibleRatio = await new Promise(resolve => {
        const observer = new IntersectionObserver(entries => {
          resolve(entries[0].intersectionRatio);
          observer.disconnect();
        });
        observer.observe(element);
      });
      return visibleRatio > 0;
    }, this);
  }
}

function computeQuadArea(quad) {
  // Compute sum of all directed areas of adjacent triangles
  // https://en.wikipedia.org/wiki/Polygon#Simple_polygons
  let area = 0;
  for (let i = 0; i < quad.length; ++i) {
    const p1 = quad[i];
    const p2 = quad[(i + 1) % quad.length];
    area += (p1.x * p2.y - p2.x * p1.y) / 2;
  }
  return area;
}

module.exports = {ElementHandle};
helper.tracePublicAPI(ElementHandle);


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/EmulationManager.js":
/*!*************************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/EmulationManager.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class EmulationManager {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._client = client;
    this._emulatingMobile = false;
    this._hasTouch = false;
  }

  /**
   * @param {!Puppeteer.Viewport} viewport
   * @return {Promise<boolean>}
   */
  async emulateViewport(viewport) {
    const mobile = viewport.isMobile || false;
    const width = viewport.width;
    const height = viewport.height;
    const deviceScaleFactor = viewport.deviceScaleFactor || 1;
    /** @type {Protocol.Emulation.ScreenOrientation} */
    const screenOrientation = viewport.isLandscape ? { angle: 90, type: 'landscapePrimary' } : { angle: 0, type: 'portraitPrimary' };
    const hasTouch = viewport.hasTouch || false;

    await Promise.all([
      this._client.send('Emulation.setDeviceMetricsOverride', { mobile, width, height, deviceScaleFactor, screenOrientation }),
      this._client.send('Emulation.setTouchEmulationEnabled', {
        enabled: hasTouch
      })
    ]);

    const reloadNeeded = this._emulatingMobile !== mobile || this._hasTouch !== hasTouch;
    this._emulatingMobile = mobile;
    this._hasTouch = hasTouch;
    return reloadNeeded;
  }
}

module.exports = {EmulationManager};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Errors.js":
/*!***************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Errors.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class TimeoutError extends CustomError {}

module.exports = {
  TimeoutError,
};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/ExecutionContext.js":
/*!*************************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/ExecutionContext.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");

const EVALUATION_SCRIPT_URL = '__puppeteer_evaluation_script__';
const SOURCE_URL_REGEX = /^[\040\t]*\/\/[@#] sourceURL=\s*(\S*?)\s*$/m;

class ExecutionContext {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Protocol.Runtime.ExecutionContextDescription} contextPayload
   * @param {function(!Protocol.Runtime.RemoteObject):!JSHandle} objectHandleFactory
   * @param {?Puppeteer.Frame} frame
   */
  constructor(client, contextPayload, objectHandleFactory, frame) {
    this._client = client;
    this._frame = frame;
    this._contextId = contextPayload.id;
    this._isDefault = contextPayload.auxData ? !!contextPayload.auxData['isDefault'] : false;
    this._objectHandleFactory = objectHandleFactory;
  }

  /**
   * @return {?Puppeteer.Frame}
   */
  frame() {
    return this._frame;
  }

  /**
   * @param {Function|string} pageFunction
   * @param {...*} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async evaluate(pageFunction, ...args) {
    const handle = await this.evaluateHandle(pageFunction, ...args);
    const result = await handle.jsonValue().catch(error => {
      if (error.message.includes('Object reference chain is too long'))
        return;
      if (error.message.includes('Object couldn\'t be returned by value'))
        return;
      throw error;
    });
    await handle.dispose();
    return result;
  }

  /**
   * @param {Function|string} pageFunction
   * @param {...*} args
   * @return {!Promise<!JSHandle>}
   */
  async evaluateHandle(pageFunction, ...args) {
    const suffix = `//# sourceURL=${EVALUATION_SCRIPT_URL}`;

    if (helper.isString(pageFunction)) {
      const contextId = this._contextId;
      const expression = /** @type {string} */ (pageFunction);
      const expressionWithSourceUrl = SOURCE_URL_REGEX.test(expression) ? expression : expression + '\n' + suffix;
      const {exceptionDetails, result: remoteObject} = await this._client.send('Runtime.evaluate', {
        expression: expressionWithSourceUrl,
        contextId,
        returnByValue: false,
        awaitPromise: true,
        userGesture: true
      }).catch(rewriteError);
      if (exceptionDetails)
        throw new Error('Evaluation failed: ' + helper.getExceptionMessage(exceptionDetails));
      return this._objectHandleFactory(remoteObject);
    }

    if (typeof pageFunction !== 'function')
      throw new Error('The following is not a function: ' + pageFunction);

    const { exceptionDetails, result: remoteObject } = await this._client.send('Runtime.callFunctionOn', {
      functionDeclaration: pageFunction.toString() + '\n' + suffix + '\n',
      executionContextId: this._contextId,
      arguments: args.map(convertArgument.bind(this)),
      returnByValue: false,
      awaitPromise: true,
      userGesture: true
    }).catch(rewriteError);
    if (exceptionDetails)
      throw new Error('Evaluation failed: ' + helper.getExceptionMessage(exceptionDetails));
    return this._objectHandleFactory(remoteObject);

    /**
     * @param {*} arg
     * @return {*}
     * @this {ExecutionContext}
     */
    function convertArgument(arg) {
      if (Object.is(arg, -0))
        return { unserializableValue: '-0' };
      if (Object.is(arg, Infinity))
        return { unserializableValue: 'Infinity' };
      if (Object.is(arg, -Infinity))
        return { unserializableValue: '-Infinity' };
      if (Object.is(arg, NaN))
        return { unserializableValue: 'NaN' };
      const objectHandle = arg && (arg instanceof JSHandle) ? arg : null;
      if (objectHandle) {
        if (objectHandle._context !== this)
          throw new Error('JSHandles can be evaluated only in the context they were created!');
        if (objectHandle._disposed)
          throw new Error('JSHandle is disposed!');
        if (objectHandle._remoteObject.unserializableValue)
          return { unserializableValue: objectHandle._remoteObject.unserializableValue };
        if (!objectHandle._remoteObject.objectId)
          return { value: objectHandle._remoteObject.value };
        return { objectId: objectHandle._remoteObject.objectId };
      }
      return { value: arg };
    }

    /**
     * @param {!Error} error
     * @return {!Protocol.Runtime.evaluateReturnValue}
     */
    function rewriteError(error) {
      if (error.message.endsWith('Cannot find context with specified id'))
        throw new Error('Execution context was destroyed, most likely because of a navigation.');
      throw error;
    }
  }

  /**
   * @param {!JSHandle} prototypeHandle
   * @return {!Promise<!JSHandle>}
   */
  async queryObjects(prototypeHandle) {
    assert(!prototypeHandle._disposed, 'Prototype JSHandle is disposed!');
    assert(prototypeHandle._remoteObject.objectId, 'Prototype JSHandle must not be referencing primitive value');
    const response = await this._client.send('Runtime.queryObjects', {
      prototypeObjectId: prototypeHandle._remoteObject.objectId
    });
    return this._objectHandleFactory(response.objects);
  }
}

class JSHandle {
  /**
   * @param {!ExecutionContext} context
   * @param {!Puppeteer.CDPSession} client
   * @param {!Protocol.Runtime.RemoteObject} remoteObject
   */
  constructor(context, client, remoteObject) {
    this._context = context;
    this._client = client;
    this._remoteObject = remoteObject;
    this._disposed = false;
  }

  /**
   * @return {!ExecutionContext}
   */
  executionContext() {
    return this._context;
  }

  /**
   * @param {string} propertyName
   * @return {!Promise<?JSHandle>}
   */
  async getProperty(propertyName) {
    const objectHandle = await this._context.evaluateHandle((object, propertyName) => {
      const result = {__proto__: null};
      result[propertyName] = object[propertyName];
      return result;
    }, this, propertyName);
    const properties = await objectHandle.getProperties();
    const result = properties.get(propertyName) || null;
    await objectHandle.dispose();
    return result;
  }

  /**
   * @return {!Promise<Map<string, !JSHandle>>}
   */
  async getProperties() {
    const response = await this._client.send('Runtime.getProperties', {
      objectId: this._remoteObject.objectId,
      ownProperties: true
    });
    const result = new Map();
    for (const property of response.result) {
      if (!property.enumerable)
        continue;
      result.set(property.name, this._context._objectHandleFactory(property.value));
    }
    return result;
  }

  /**
   * @return {!Promise<?Object>}
   */
  async jsonValue() {
    if (this._remoteObject.objectId) {
      const response = await this._client.send('Runtime.callFunctionOn', {
        functionDeclaration: 'function() { return this; }',
        objectId: this._remoteObject.objectId,
        returnByValue: true,
        awaitPromise: true,
      });
      return helper.valueFromRemoteObject(response.result);
    }
    return helper.valueFromRemoteObject(this._remoteObject);
  }

  /**
   * @return {?Puppeteer.ElementHandle}
   */
  asElement() {
    return null;
  }

  async dispose() {
    if (this._disposed)
      return;
    this._disposed = true;
    await helper.releaseObject(this._client, this._remoteObject);
  }

  /**
   * @override
   * @return {string}
   */
  toString() {
    if (this._remoteObject.objectId) {
      const type =  this._remoteObject.subtype || this._remoteObject.type;
      return 'JSHandle@' + type;
    }
    return 'JSHandle:' + helper.valueFromRemoteObject(this._remoteObject);
  }
}

helper.tracePublicAPI(JSHandle);
module.exports = {ExecutionContext, JSHandle, EVALUATION_SCRIPT_URL};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/FrameManager.js":
/*!*********************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/FrameManager.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = __webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js");
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const {ExecutionContext, JSHandle} = __webpack_require__(/*! ./ExecutionContext */ "./node_modules/puppeteer-core/lib/ExecutionContext.js");
const {ElementHandle} = __webpack_require__(/*! ./ElementHandle */ "./node_modules/puppeteer-core/lib/ElementHandle.js");
const {TimeoutError} = __webpack_require__(/*! ./Errors */ "./node_modules/puppeteer-core/lib/Errors.js");

const readFileAsync = helper.promisify(fs.readFile);

class FrameManager extends EventEmitter {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Protocol.Page.FrameTree} frameTree
   * @param {!Puppeteer.Page} page
   */
  constructor(client, frameTree, page) {
    super();
    this._client = client;
    this._page = page;
    /** @type {!Map<string, !Frame>} */
    this._frames = new Map();
    /** @type {!Map<number, !ExecutionContext>} */
    this._contextIdToContext = new Map();

    this._client.on('Page.frameAttached', event => this._onFrameAttached(event.frameId, event.parentFrameId));
    this._client.on('Page.frameNavigated', event => this._onFrameNavigated(event.frame));
    this._client.on('Page.navigatedWithinDocument', event => this._onFrameNavigatedWithinDocument(event.frameId, event.url));
    this._client.on('Page.frameDetached', event => this._onFrameDetached(event.frameId));
    this._client.on('Page.frameStoppedLoading', event => this._onFrameStoppedLoading(event.frameId));
    this._client.on('Runtime.executionContextCreated', event => this._onExecutionContextCreated(event.context));
    this._client.on('Runtime.executionContextDestroyed', event => this._onExecutionContextDestroyed(event.executionContextId));
    this._client.on('Runtime.executionContextsCleared', event => this._onExecutionContextsCleared());
    this._client.on('Page.lifecycleEvent', event => this._onLifecycleEvent(event));

    this._handleFrameTree(frameTree);
  }

  /**
   * @param {!Protocol.Page.lifecycleEventPayload} event
   */
  _onLifecycleEvent(event) {
    const frame = this._frames.get(event.frameId);
    if (!frame)
      return;
    frame._onLifecycleEvent(event.loaderId, event.name);
    this.emit(FrameManager.Events.LifecycleEvent, frame);
  }

  /**
   * @param {string} frameId
   */
  _onFrameStoppedLoading(frameId) {
    const frame = this._frames.get(frameId);
    if (!frame)
      return;
    frame._onLoadingStopped();
    this.emit(FrameManager.Events.LifecycleEvent, frame);
  }

  /**
   * @param {!Protocol.Page.FrameTree} frameTree
   */
  _handleFrameTree(frameTree) {
    if (frameTree.frame.parentId)
      this._onFrameAttached(frameTree.frame.id, frameTree.frame.parentId);
    this._onFrameNavigated(frameTree.frame);
    if (!frameTree.childFrames)
      return;

    for (const child of frameTree.childFrames)
      this._handleFrameTree(child);
  }

  /**
   * @return {!Frame}
   */
  mainFrame() {
    return this._mainFrame;
  }

  /**
   * @return {!Array<!Frame>}
   */
  frames() {
    return Array.from(this._frames.values());
  }

  /**
   * @param {!string} frameId
   * @return {?Frame}
   */
  frame(frameId) {
    return this._frames.get(frameId) || null;
  }

  /**
   * @param {string} frameId
   * @param {?string} parentFrameId
   * @return {?Frame}
   */
  _onFrameAttached(frameId, parentFrameId) {
    if (this._frames.has(frameId))
      return;
    assert(parentFrameId);
    const parentFrame = this._frames.get(parentFrameId);
    const frame = new Frame(this._client, parentFrame, frameId);
    this._frames.set(frame._id, frame);
    this.emit(FrameManager.Events.FrameAttached, frame);
  }

  /**
   * @param {!Protocol.Page.Frame} framePayload
   */
  _onFrameNavigated(framePayload) {
    const isMainFrame = !framePayload.parentId;
    let frame = isMainFrame ? this._mainFrame : this._frames.get(framePayload.id);
    assert(isMainFrame || frame, 'We either navigate top level or have old version of the navigated frame');

    // Detach all child frames first.
    if (frame) {
      for (const child of frame.childFrames())
        this._removeFramesRecursively(child);
    }

    // Update or create main frame.
    if (isMainFrame) {
      if (frame) {
        // Update frame id to retain frame identity on cross-process navigation.
        this._frames.delete(frame._id);
        frame._id = framePayload.id;
      } else {
        // Initial main frame navigation.
        frame = new Frame(this._client, null, framePayload.id);
      }
      this._frames.set(framePayload.id, frame);
      this._mainFrame = frame;
    }

    // Update frame payload.
    frame._navigated(framePayload);

    this.emit(FrameManager.Events.FrameNavigated, frame);
  }

  /**
   * @param {string} frameId
   * @param {string} url
   */
  _onFrameNavigatedWithinDocument(frameId, url) {
    const frame = this._frames.get(frameId);
    if (!frame)
      return;
    frame._navigatedWithinDocument(url);
    this.emit(FrameManager.Events.FrameNavigatedWithinDocument, frame);
    this.emit(FrameManager.Events.FrameNavigated, frame);
  }

  /**
   * @param {string} frameId
   */
  _onFrameDetached(frameId) {
    const frame = this._frames.get(frameId);
    if (frame)
      this._removeFramesRecursively(frame);
  }

  _onExecutionContextCreated(contextPayload) {
    const frameId = contextPayload.auxData ? contextPayload.auxData.frameId : null;
    const frame = this._frames.get(frameId) || null;
    /** @type {!ExecutionContext} */
    const context = new ExecutionContext(this._client, contextPayload, obj => this.createJSHandle(context, obj), frame);
    this._contextIdToContext.set(contextPayload.id, context);
    if (frame)
      frame._addExecutionContext(context);
  }

  /**
   * @param {number} executionContextId
   */
  _onExecutionContextDestroyed(executionContextId) {
    const context = this._contextIdToContext.get(executionContextId);
    if (!context)
      return;
    this._contextIdToContext.delete(executionContextId);
    if (context.frame())
      context.frame()._removeExecutionContext(context);
  }

  _onExecutionContextsCleared() {
    for (const context of this._contextIdToContext.values()) {
      if (context.frame())
        context.frame()._removeExecutionContext(context);
    }
    this._contextIdToContext.clear();
  }

  /**
   * @param {number} contextId
   * @return {!ExecutionContext}
   */
  executionContextById(contextId) {
    const context = this._contextIdToContext.get(contextId);
    assert(context, 'INTERNAL ERROR: missing context with id = ' + contextId);
    return context;
  }

  /**
   * @param {!ExecutionContext} context
   * @param {!Protocol.Runtime.RemoteObject} remoteObject
   * @return {!JSHandle}
   */
  createJSHandle(context, remoteObject) {
    if (remoteObject.subtype === 'node')
      return new ElementHandle(context, this._client, remoteObject, this._page, this);
    return new JSHandle(context, this._client, remoteObject);
  }

  /**
   * @param {!Frame} frame
   */
  _removeFramesRecursively(frame) {
    for (const child of frame.childFrames())
      this._removeFramesRecursively(child);
    frame._detach();
    this._frames.delete(frame._id);
    this.emit(FrameManager.Events.FrameDetached, frame);
  }
}

/** @enum {string} */
FrameManager.Events = {
  FrameAttached: 'frameattached',
  FrameNavigated: 'framenavigated',
  FrameDetached: 'framedetached',
  LifecycleEvent: 'lifecycleevent',
  FrameNavigatedWithinDocument: 'framenavigatedwithindocument',
  ExecutionContextCreated: 'executioncontextcreated',
  ExecutionContextDestroyed: 'executioncontextdestroyed',
};

/**
 * @unrestricted
 */
class Frame {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {?Frame} parentFrame
   * @param {string} frameId
   */
  constructor(client, parentFrame, frameId) {
    this._client = client;
    this._parentFrame = parentFrame;
    this._url = '';
    this._id = frameId;

    /** @type {?Promise<!ElementHandle>} */
    this._documentPromise = null;
    /** @type {?Promise<!ExecutionContext>} */
    this._contextPromise = null;
    this._contextResolveCallback = null;
    this._setDefaultContext(null);

    /** @type {!Set<!WaitTask>} */
    this._waitTasks = new Set();
    this._loaderId = '';
    /** @type {!Set<string>} */
    this._lifecycleEvents = new Set();

    /** @type {!Set<!Frame>} */
    this._childFrames = new Set();
    if (this._parentFrame)
      this._parentFrame._childFrames.add(this);
  }

  /**
   * @param {!ExecutionContext} context
   */
  _addExecutionContext(context) {
    if (context._isDefault)
      this._setDefaultContext(context);
  }

  /**
   * @param {!ExecutionContext} context
   */
  _removeExecutionContext(context) {
    if (context._isDefault)
      this._setDefaultContext(null);
  }

  /**
   * @param {?ExecutionContext} context
   */
  _setDefaultContext(context) {
    if (context) {
      this._contextResolveCallback.call(null, context);
      this._contextResolveCallback = null;
      for (const waitTask of this._waitTasks)
        waitTask.rerun();
    } else {
      this._documentPromise = null;
      this._contextPromise = new Promise(fulfill => {
        this._contextResolveCallback = fulfill;
      });
    }
  }

  /**
   * @return {!Promise<!ExecutionContext>}
   */
  executionContext() {
    return this._contextPromise;
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<!Puppeteer.JSHandle>}
   */
  async evaluateHandle(pageFunction, ...args) {
    const context = await this._contextPromise;
    return context.evaluateHandle(pageFunction, ...args);
  }

  /**
   * @param {Function|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<*>}
   */
  async evaluate(pageFunction, ...args) {
    const context = await this._contextPromise;
    return context.evaluate(pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @return {!Promise<?ElementHandle>}
   */
  async $(selector) {
    const document = await this._document();
    const value = await document.$(selector);
    return value;
  }

  /**
   * @return {!Promise<!ElementHandle>}
   */
  async _document() {
    if (this._documentPromise)
      return this._documentPromise;
    this._documentPromise = this._contextPromise.then(async context => {
      const document = await context.evaluateHandle('document');
      return document.asElement();
    });
    return this._documentPromise;
  }

  /**
   * @param {string} expression
   * @return {!Promise<!Array<!ElementHandle>>}
   */
  async $x(expression) {
    const document = await this._document();
    const value = await document.$x(expression);
    return value;
  }

  /**
   * @param {string} selector
   * @param {Function|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $eval(selector, pageFunction, ...args) {
    const document = await this._document();
    return document.$eval(selector, pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @param {Function|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $$eval(selector, pageFunction, ...args) {
    const document = await this._document();
    const value = await document.$$eval(selector, pageFunction, ...args);
    return value;
  }

  /**
   * @param {string} selector
   * @return {!Promise<!Array<!ElementHandle>>}
   */
  async $$(selector) {
    const document = await this._document();
    const value = await document.$$(selector);
    return value;
  }

  /**
   * @return {!Promise<String>}
   */
  async content() {
    return await this.evaluate(() => {
      let retVal = '';
      if (document.doctype)
        retVal = new XMLSerializer().serializeToString(document.doctype);
      if (document.documentElement)
        retVal += document.documentElement.outerHTML;
      return retVal;
    });
  }

  /**
   * @param {string} html
   */
  async setContent(html) {
    await this.evaluate(html => {
      document.open();
      document.write(html);
      document.close();
    }, html);
  }

  /**
   * @return {string}
   */
  name() {
    return this._name || '';
  }

  /**
   * @return {string}
   */
  url() {
    return this._url;
  }

  /**
   * @return {?Frame}
   */
  parentFrame() {
    return this._parentFrame;
  }

  /**
   * @return {!Array.<!Frame>}
   */
  childFrames() {
    return Array.from(this._childFrames);
  }

  /**
   * @return {boolean}
   */
  isDetached() {
    return this._detached;
  }

  /**
   * @param {Object} options
   * @return {!Promise<!ElementHandle>}
   */
  async addScriptTag(options) {
    if (typeof options.url === 'string') {
      const url = options.url;
      try {
        const context = await this._contextPromise;
        return (await context.evaluateHandle(addScriptUrl, url, options.type)).asElement();
      } catch (error) {
        throw new Error(`Loading script from ${url} failed`);
      }
    }

    if (typeof options.path === 'string') {
      let contents = await readFileAsync(options.path, 'utf8');
      contents += '//# sourceURL=' + options.path.replace(/\n/g, '');
      const context = await this._contextPromise;
      return (await context.evaluateHandle(addScriptContent, contents, options.type)).asElement();
    }

    if (typeof options.content === 'string') {
      const context = await this._contextPromise;
      return (await context.evaluateHandle(addScriptContent, options.content, options.type)).asElement();
    }

    throw new Error('Provide an object with a `url`, `path` or `content` property');

    /**
     * @param {string} url
     * @param {string} type
     * @return {!Promise<!HTMLElement>}
     */
    async function addScriptUrl(url, type) {
      const script = document.createElement('script');
      script.src = url;
      if (type)
        script.type = type;
      const promise = new Promise((res, rej) => {
        script.onload = res;
        script.onerror = rej;
      });
      document.head.appendChild(script);
      await promise;
      return script;
    }

    /**
     * @param {string} content
     * @param {string} type
     * @return {!HTMLElement}
     */
    function addScriptContent(content, type = 'text/javascript') {
      const script = document.createElement('script');
      script.type = type;
      script.text = content;
      let error = null;
      script.onerror = e => error = e;
      document.head.appendChild(script);
      if (error)
        throw error;
      return script;
    }
  }

  /**
   * @param {Object} options
   * @return {!Promise<!ElementHandle>}
   */
  async addStyleTag(options) {
    if (typeof options.url === 'string') {
      const url = options.url;
      try {
        const context = await this._contextPromise;
        return (await context.evaluateHandle(addStyleUrl, url)).asElement();
      } catch (error) {
        throw new Error(`Loading style from ${url} failed`);
      }
    }

    if (typeof options.path === 'string') {
      let contents = await readFileAsync(options.path, 'utf8');
      contents += '/*# sourceURL=' + options.path.replace(/\n/g, '') + '*/';
      const context = await this._contextPromise;
      return (await context.evaluateHandle(addStyleContent, contents)).asElement();
    }

    if (typeof options.content === 'string') {
      const context = await this._contextPromise;
      return (await context.evaluateHandle(addStyleContent, options.content)).asElement();
    }

    throw new Error('Provide an object with a `url`, `path` or `content` property');

    /**
     * @param {string} url
     * @return {!Promise<!HTMLElement>}
     */
    async function addStyleUrl(url) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      const promise = new Promise((res, rej) => {
        link.onload = res;
        link.onerror = rej;
      });
      document.head.appendChild(link);
      await promise;
      return link;
    }

    /**
     * @param {string} content
     * @return {!Promise<!HTMLElement>}
     */
    async function addStyleContent(content) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(content));
      const promise = new Promise((res, rej) => {
        style.onload = res;
        style.onerror = rej;
      });
      document.head.appendChild(style);
      await promise;
      return style;
    }
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   */
  async click(selector, options = {}) {
    const handle = await this.$(selector);
    assert(handle, 'No node found for selector: ' + selector);
    await handle.click(options);
    await handle.dispose();
  }

  /**
   * @param {string} selector
   */
  async focus(selector) {
    const handle = await this.$(selector);
    assert(handle, 'No node found for selector: ' + selector);
    await handle.focus();
    await handle.dispose();
  }

  /**
   * @param {string} selector
   */
  async hover(selector) {
    const handle = await this.$(selector);
    assert(handle, 'No node found for selector: ' + selector);
    await handle.hover();
    await handle.dispose();
  }

  /**
  * @param {string} selector
  * @param {!Array<string>} values
  * @return {!Promise<!Array<string>>}
  */
  select(selector, ...values){
    for (const value of values)
      assert(helper.isString(value), 'Values must be strings. Found value "' + value + '" of type "' + (typeof value) + '"');
    return this.$eval(selector, (element, values) => {
      if (element.nodeName.toLowerCase() !== 'select')
        throw new Error('Element is not a <select> element.');

      const options = Array.from(element.options);
      element.value = undefined;
      for (const option of options) {
        option.selected = values.includes(option.value);
        if (option.selected && !element.multiple)
          break;
      }
      element.dispatchEvent(new Event('input', { 'bubbles': true }));
      element.dispatchEvent(new Event('change', { 'bubbles': true }));
      return options.filter(option => option.selected).map(option => option.value);
    }, values);
  }

  /**
   * @param {string} selector
   */
  async tap(selector) {
    const handle = await this.$(selector);
    assert(handle, 'No node found for selector: ' + selector);
    await handle.tap();
    await handle.dispose();
  }

  /**
   * @param {string} selector
   * @param {string} text
   * @param {{delay: (number|undefined)}=} options
   */
  async type(selector, text, options) {
    const handle = await this.$(selector);
    assert(handle, 'No node found for selector: ' + selector);
    await handle.type(text, options);
    await handle.dispose();
  }

  /**
   * @param {(string|number|Function)} selectorOrFunctionOrTimeout
   * @param {!Object=} options
   * @param {!Array<*>} args
   * @return {!Promise}
   */
  waitFor(selectorOrFunctionOrTimeout, options = {}, ...args) {
    const xPathPattern = '//';

    if (helper.isString(selectorOrFunctionOrTimeout)) {
      const string = /** @type {string} */ (selectorOrFunctionOrTimeout);
      if (string.startsWith(xPathPattern))
        return this.waitForXPath(string, options);
      return this.waitForSelector(string, options);
    }
    if (helper.isNumber(selectorOrFunctionOrTimeout))
      return new Promise(fulfill => setTimeout(fulfill, selectorOrFunctionOrTimeout));
    if (typeof selectorOrFunctionOrTimeout === 'function')
      return this.waitForFunction(selectorOrFunctionOrTimeout, options, ...args);
    return Promise.reject(new Error('Unsupported target type: ' + (typeof selectorOrFunctionOrTimeout)));
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForSelector(selector, options = {}) {
    return this._waitForSelectorOrXPath(selector, false, options);
  }

  /**
   * @param {string} xpath
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForXPath(xpath, options = {}) {
    return this._waitForSelectorOrXPath(xpath, true, options);
  }

  /**
   * @param {Function|string} pageFunction
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForFunction(pageFunction, options = {}, ...args) {
    const timeout = helper.isNumber(options.timeout) ? options.timeout : 30000;
    const polling = options.polling || 'raf';
    return new WaitTask(this, pageFunction, 'function', polling, timeout, ...args).promise;
  }

  /**
   * @return {!Promise<string>}
   */
  async title() {
    return this.evaluate(() => document.title);
  }

  /**
   * @param {string} selectorOrXPath
   * @param {boolean} isXPath
   * @param {!Object=} options
   * @return {!Promise}
   */
  _waitForSelectorOrXPath(selectorOrXPath, isXPath, options = {}) {
    const waitForVisible = !!options.visible;
    const waitForHidden = !!options.hidden;
    const polling = waitForVisible || waitForHidden ? 'raf' : 'mutation';
    const timeout = helper.isNumber(options.timeout) ? options.timeout : 30000;
    const title = `${isXPath ? 'XPath' : 'selector'} "${selectorOrXPath}"${waitForHidden ? ' to be hidden' : ''}`;
    return new WaitTask(this, predicate, title, polling, timeout, selectorOrXPath, isXPath, waitForVisible, waitForHidden).promise;

    /**
     * @param {string} selectorOrXPath
     * @param {boolean} isXPath
     * @param {boolean} waitForVisible
     * @param {boolean} waitForHidden
     * @return {?Node|boolean}
     */
    function predicate(selectorOrXPath, isXPath, waitForVisible, waitForHidden) {
      const node = isXPath
        ? document.evaluate(selectorOrXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        : document.querySelector(selectorOrXPath);
      if (!node)
        return waitForHidden;
      if (!waitForVisible && !waitForHidden)
        return node;
      const element = /** @type {Element} */ (node.nodeType === Node.TEXT_NODE ? node.parentElement : node);

      const style = window.getComputedStyle(element);
      const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox();
      const success = (waitForVisible === isVisible || waitForHidden === !isVisible);
      return success ? node : null;

      /**
       * @return {boolean}
       */
      function hasVisibleBoundingBox() {
        const rect = element.getBoundingClientRect();
        return !!(rect.top || rect.bottom || rect.width || rect.height);
      }
    }
  }

  /**
   * @param {!Protocol.Page.Frame} framePayload
   */
  _navigated(framePayload) {
    this._name = framePayload.name;
    // TODO(lushnikov): remove this once requestInterception has loaderId exposed.
    this._navigationURL = framePayload.url;
    this._url = framePayload.url;
  }

  /**
   * @param {string} url
   */
  _navigatedWithinDocument(url) {
    this._url = url;
  }

  /**
   * @param {string} loaderId
   * @param {string} name
   */
  _onLifecycleEvent(loaderId, name) {
    if (name === 'init') {
      this._loaderId = loaderId;
      this._lifecycleEvents.clear();
    }
    this._lifecycleEvents.add(name);
  }

  _onLoadingStopped() {
    this._lifecycleEvents.add('DOMContentLoaded');
    this._lifecycleEvents.add('load');
  }

  _detach() {
    for (const waitTask of this._waitTasks)
      waitTask.terminate(new Error('waitForFunction failed: frame got detached.'));
    this._detached = true;
    if (this._parentFrame)
      this._parentFrame._childFrames.delete(this);
    this._parentFrame = null;
  }
}
helper.tracePublicAPI(Frame);

class WaitTask {
  /**
   * @param {!Frame} frame
   * @param {Function|string} predicateBody
   * @param {string|number} polling
   * @param {number} timeout
   * @param {!Array<*>} args
   */
  constructor(frame, predicateBody, title, polling, timeout, ...args) {
    if (helper.isString(polling))
      assert(polling === 'raf' || polling === 'mutation', 'Unknown polling option: ' + polling);
    else if (helper.isNumber(polling))
      assert(polling > 0, 'Cannot poll with non-positive interval: ' + polling);
    else
      throw new Error('Unknown polling options: ' + polling);

    this._frame = frame;
    this._polling = polling;
    this._timeout = timeout;
    this._predicateBody = helper.isString(predicateBody) ? 'return ' + predicateBody : 'return (' + predicateBody + ')(...args)';
    this._args = args;
    this._runCount = 0;
    frame._waitTasks.add(this);
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    // Since page navigation requires us to re-install the pageScript, we should track
    // timeout on our end.
    if (timeout) {
      const timeoutError = new TimeoutError(`waiting for ${title} failed: timeout ${timeout}ms exceeded`);
      this._timeoutTimer = setTimeout(() => this.terminate(timeoutError), timeout);
    }
    this.rerun();
  }

  /**
   * @param {!Error} error
   */
  terminate(error) {
    this._terminated = true;
    this._reject(error);
    this._cleanup();
  }

  async rerun() {
    const runCount = ++this._runCount;
    /** @type {?JSHandle} */
    let success = null;
    let error = null;
    try {
      success = await (await this._frame.executionContext()).evaluateHandle(waitForPredicatePageFunction, this._predicateBody, this._polling, this._timeout, ...this._args);
    } catch (e) {
      error = e;
    }

    if (this._terminated || runCount !== this._runCount) {
      if (success)
        await success.dispose();
      return;
    }

    // Ignore timeouts in pageScript - we track timeouts ourselves.
    // If the frame's execution context has already changed, `frame.evaluate` will
    // throw an error - ignore this predicate run altogether.
    if (!error && await this._frame.evaluate(s => !s, success).catch(e => true)) {
      await success.dispose();
      return;
    }

    // When the page is navigated, the promise is rejected.
    // We will try again in the new execution context.
    if (error && error.message.includes('Execution context was destroyed'))
      return;

    // We could have tried to evaluate in a context which was already
    // destroyed.
    if (error && error.message.includes('Cannot find context with specified id'))
      return;

    if (error)
      this._reject(error);
    else
      this._resolve(success);

    this._cleanup();
  }

  _cleanup() {
    clearTimeout(this._timeoutTimer);
    this._frame._waitTasks.delete(this);
    this._runningTask = null;
  }
}

/**
 * @param {string} predicateBody
 * @param {string} polling
 * @param {number} timeout
 * @return {!Promise<*>}
 */
async function waitForPredicatePageFunction(predicateBody, polling, timeout, ...args) {
  const predicate = new Function('...args', predicateBody);
  let timedOut = false;
  if (timeout)
    setTimeout(() => timedOut = true, timeout);
  if (polling === 'raf')
    return await pollRaf();
  if (polling === 'mutation')
    return await pollMutation();
  if (typeof polling === 'number')
    return await pollInterval(polling);

  /**
   * @return {!Promise<*>}
   */
  function pollMutation() {
    const success = predicate.apply(null, args);
    if (success)
      return Promise.resolve(success);

    let fulfill;
    const result = new Promise(x => fulfill = x);
    const observer = new MutationObserver(mutations => {
      if (timedOut) {
        observer.disconnect();
        fulfill();
      }
      const success = predicate.apply(null, args);
      if (success) {
        observer.disconnect();
        fulfill(success);
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true
    });
    return result;
  }

  /**
   * @return {!Promise<*>}
   */
  function pollRaf() {
    let fulfill;
    const result = new Promise(x => fulfill = x);
    onRaf();
    return result;

    function onRaf() {
      if (timedOut) {
        fulfill();
        return;
      }
      const success = predicate.apply(null, args);
      if (success)
        fulfill(success);
      else
        requestAnimationFrame(onRaf);
    }
  }

  /**
   * @param {number} pollInterval
   * @return {!Promise<*>}
   */
  function pollInterval(pollInterval) {
    let fulfill;
    const result = new Promise(x => fulfill = x);
    onTimeout();
    return result;

    function onTimeout() {
      if (timedOut) {
        fulfill();
        return;
      }
      const success = predicate.apply(null, args);
      if (success)
        fulfill(success);
      else
        setTimeout(onTimeout, pollInterval);
    }
  }
}

module.exports = {FrameManager, Frame};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Input.js":
/*!**************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Input.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const keyDefinitions = __webpack_require__(/*! ./USKeyboardLayout */ "./node_modules/puppeteer-core/lib/USKeyboardLayout.js");

/**
 * @typedef {Object} KeyDescription
 * @property {number} keyCode
 * @property {string} key
 * @property {string} text
 * @property {string} code
 * @property {number} location
 */

class Keyboard {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._client = client;
    this._modifiers = 0;
    this._pressedKeys = new Set();
  }

  /**
   * @param {string} key
   * @param {{text: string}=} options
   */
  async down(key, options = { text: undefined }) {
    const description = this._keyDescriptionForString(key);

    const autoRepeat = this._pressedKeys.has(description.code);
    this._pressedKeys.add(description.code);
    this._modifiers |= this._modifierBit(description.key);

    const text = options.text === undefined ? description.text : options.text;
    await this._client.send('Input.dispatchKeyEvent', {
      type: text ? 'keyDown' : 'rawKeyDown',
      modifiers: this._modifiers,
      windowsVirtualKeyCode: description.keyCode,
      code: description.code,
      key: description.key,
      text: text,
      unmodifiedText: text,
      autoRepeat,
      location: description.location,
      isKeypad: description.location === 3
    });
  }

  /**
   * @param {string} key
   * @return {number}
   */
  _modifierBit(key) {
    if (key === 'Alt')
      return 1;
    if (key === 'Control')
      return 2;
    if (key === 'Meta')
      return 4;
    if (key === 'Shift')
      return 8;
    return 0;
  }

  /**
   * @param {string} keyString
   * @return {KeyDescription}
   */
  _keyDescriptionForString(keyString) {
    const shift = this._modifiers & 8;
    const description = {
      key: '',
      keyCode: 0,
      code: '',
      text: '',
      location: 0
    };

    const definition = keyDefinitions[keyString];
    assert(definition, `Unknown key: "${keyString}"`);

    if (definition.key)
      description.key = definition.key;
    if (shift && definition.shiftKey)
      description.key = definition.shiftKey;

    if (definition.keyCode)
      description.keyCode = definition.keyCode;
    if (shift && definition.shiftKeyCode)
      description.keyCode = definition.shiftKeyCode;

    if (definition.code)
      description.code = definition.code;

    if (definition.location)
      description.location = definition.location;

    if (description.key.length === 1)
      description.text = description.key;

    if (definition.text)
      description.text = definition.text;
    if (shift && definition.shiftText)
      description.text = definition.shiftText;

    // if any modifiers besides shift are pressed, no text should be sent
    if (this._modifiers & ~8)
      description.text = '';

    return description;
  }

  /**
   * @param {string} key
   */
  async up(key) {
    const description = this._keyDescriptionForString(key);

    this._modifiers &= ~this._modifierBit(description.key);
    this._pressedKeys.delete(description.code);
    await this._client.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      modifiers: this._modifiers,
      key: description.key,
      windowsVirtualKeyCode: description.keyCode,
      code: description.code,
      location: description.location
    });
  }

  /**
   * @param {string} char
   */
  async sendCharacter(char) {
    await this._client.send('Input.insertText', {text: char});
  }

  /**
   * @param {string} text
   * @param {{delay: (number|undefined)}=} options
   */
  async type(text, options) {
    let delay = 0;
    if (options && options.delay)
      delay = options.delay;
    for (const char of text) {
      if (keyDefinitions[char])
        await this.press(char, {delay});
      else
        await this.sendCharacter(char);
      if (delay)
        await new Promise(f => setTimeout(f, delay));
    }
  }

  /**
   * @param {string} key
   * @param {!Object=} options
   */
  async press(key, options) {
    await this.down(key, options);
    if (options && options.delay)
      await new Promise(f => setTimeout(f, options.delay));
    await this.up(key);
  }
}

class Mouse {
  /**
   * @param {Puppeteer.CDPSession} client
   * @param {!Keyboard} keyboard
   */
  constructor(client, keyboard) {
    this._client = client;
    this._keyboard = keyboard;
    this._x = 0;
    this._y = 0;
    /** @type {'none'|'left'|'right'|'middle'} */
    this._button = 'none';
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Object=} options
   * @return {!Promise}
   */
  async move(x, y, options = {}) {
    const fromX = this._x, fromY = this._y;
    this._x = x;
    this._y = y;
    const steps = options.steps || 1;
    for (let i = 1; i <= steps; i++) {
      await this._client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        button: this._button,
        x: fromX + (this._x - fromX) * (i / steps),
        y: fromY + (this._y - fromY) * (i / steps),
        modifiers: this._keyboard._modifiers
      });
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {!Object=} options
   */
  async click(x, y, options = {}) {
    this.move(x, y);
    this.down(options);
    if (typeof options.delay === 'number')
      await new Promise(f => setTimeout(f, options.delay));
    await this.up(options);
  }

  /**
   * @param {!Object=} options
   */
  async down(options = {}) {
    this._button = (options.button || 'left');
    await this._client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      button: this._button,
      x: this._x,
      y: this._y,
      modifiers: this._keyboard._modifiers,
      clickCount: (options.clickCount || 1)
    });
  }

  /**
   * @param {!Object=} options
   */
  async up(options = {}) {
    this._button = 'none';
    await this._client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      button: (options.button || 'left'),
      x: this._x,
      y: this._y,
      modifiers: this._keyboard._modifiers,
      clickCount: (options.clickCount || 1)
    });
  }
}

class Touchscreen {
  /**
   * @param {Puppeteer.CDPSession} client
   * @param {Keyboard} keyboard
   */
  constructor(client, keyboard) {
    this._client = client;
    this._keyboard = keyboard;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  async tap(x, y) {
    // Touches appear to be lost during the first frame after navigation.
    // This waits a frame before sending the tap.
    // @see https://crbug.com/613219
    await this._client.send('Runtime.evaluate', {
      expression: 'new Promise(x => requestAnimationFrame(() => requestAnimationFrame(x)))',
      awaitPromise: true
    });

    const touchPoints = [{x: Math.round(x), y: Math.round(y)}];
    await this._client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints,
      modifiers: this._keyboard._modifiers
    });
    await this._client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
      modifiers: this._keyboard._modifiers
    });
  }
}

module.exports = { Keyboard, Mouse, Touchscreen};
helper.tracePublicAPI(Keyboard);
helper.tracePublicAPI(Mouse);
helper.tracePublicAPI(Touchscreen);


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Multimap.js":
/*!*****************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Multimap.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @template T
 * @template V
 */
class Multimap {
  constructor() {
    this._map = new Map();
  }

  /**
   * @param {T} key
   * @param {V} value
   */
  set(key, value) {
    let set = this._map.get(key);
    if (!set) {
      set = new Set();
      this._map.set(key, set);
    }
    set.add(value);
  }

  /**
   * @param {T} key
   * @return {!Set<V>}
   */
  get(key) {
    let result = this._map.get(key);
    if (!result)
      result = new Set();
    return result;
  }

  /**
   * @param {T} key
   * @return {boolean}
   */
  has(key) {
    return this._map.has(key);
  }

  /**
   * @param {T} key
   * @param {V} value
   * @return {boolean}
   */
  hasValue(key, value) {
    const set = this._map.get(key);
    if (!set)
      return false;
    return set.has(value);
  }

  /**
   * @return {number}
   */
  get size() {
    return this._map.size;
  }

  /**
   * @param {T} key
   * @param {V} value
   * @return {boolean}
   */
  delete(key, value) {
    const values = this.get(key);
    const result = values.delete(value);
    if (!values.size)
      this._map.delete(key);
    return result;
  }

  /**
   * @param {T} key
   */
  deleteAll(key) {
    this._map.delete(key);
  }

  /**
   * @param {T} key
   * @return {V}
   */
  firstValue(key) {
    const set = this._map.get(key);
    if (!set)
      return null;
    return set.values().next().value;
  }

  /**
   * @return {T}
   */
  firstKey() {
    return this._map.keys().next().value;
  }

  /**
   * @return {!Array<V>}
   */
  valuesArray() {
    const result = [];
    for (const key of this._map.keys())
      result.push(...Array.from(this._map.get(key).values()));
    return result;
  }

  /**
   * @return {!Array<T>}
   */
  keysArray() {
    return Array.from(this._map.keys());
  }

  clear() {
    this._map.clear();
  }
}

module.exports = Multimap;


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/NavigatorWatcher.js":
/*!*************************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/NavigatorWatcher.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const {FrameManager} = __webpack_require__(/*! ./FrameManager */ "./node_modules/puppeteer-core/lib/FrameManager.js");
const {TimeoutError} = __webpack_require__(/*! ./Errors */ "./node_modules/puppeteer-core/lib/Errors.js");

class NavigatorWatcher {
  /**
   * @param {!FrameManager} frameManager
   * @param {!Puppeteer.Frame} frame
   * @param {number} timeout
   * @param {!Object=} options
   */
  constructor(frameManager, frame, timeout, options = {}) {
    assert(options.networkIdleTimeout === undefined, 'ERROR: networkIdleTimeout option is no longer supported.');
    assert(options.networkIdleInflight === undefined, 'ERROR: networkIdleInflight option is no longer supported.');
    assert(options.waitUntil !== 'networkidle', 'ERROR: "networkidle" option is no longer supported. Use "networkidle2" instead');
    let waitUntil = ['load'];
    if (Array.isArray(options.waitUntil))
      waitUntil = options.waitUntil.slice();
    else if (typeof options.waitUntil === 'string')
      waitUntil = [options.waitUntil];
    this._expectedLifecycle = waitUntil.map(value => {
      const protocolEvent = puppeteerToProtocolLifecycle[value];
      assert(protocolEvent, 'Unknown value for options.waitUntil: ' + value);
      return protocolEvent;
    });

    this._frameManager = frameManager;
    this._frame = frame;
    this._initialLoaderId = frame._loaderId;
    this._timeout = timeout;
    this._hasSameDocumentNavigation = false;
    this._eventListeners = [
      helper.addEventListener(this._frameManager, FrameManager.Events.LifecycleEvent, this._checkLifecycleComplete.bind(this)),
      helper.addEventListener(this._frameManager, FrameManager.Events.FrameNavigatedWithinDocument, this._navigatedWithinDocument.bind(this)),
      helper.addEventListener(this._frameManager, FrameManager.Events.FrameDetached, this._checkLifecycleComplete.bind(this))
    ];

    const lifecycleCompletePromise = new Promise(fulfill => {
      this._lifecycleCompleteCallback = fulfill;
    });
    this._navigationPromise = Promise.race([
      this._createTimeoutPromise(),
      lifecycleCompletePromise
    ]).then(error => {
      this._cleanup();
      return error;
    });
  }

  /**
   * @return {!Promise<?Error>}
   */
  _createTimeoutPromise() {
    if (!this._timeout)
      return new Promise(() => {});
    const errorMessage = 'Navigation Timeout Exceeded: ' + this._timeout + 'ms exceeded';
    return new Promise(fulfill => this._maximumTimer = setTimeout(fulfill, this._timeout))
        .then(() => new TimeoutError(errorMessage));
  }

  /**
   * @return {!Promise<?Error>}
   */
  async navigationPromise() {
    return this._navigationPromise;
  }

  /**
   * @param {!Puppeteer.Frame} frame
   */
  _navigatedWithinDocument(frame) {
    if (frame !== this._frame)
      return;
    this._hasSameDocumentNavigation = true;
    this._checkLifecycleComplete();
  }

  _checkLifecycleComplete() {
    // We expect navigation to commit.
    if (this._frame._loaderId === this._initialLoaderId && !this._hasSameDocumentNavigation)
      return;
    if (!checkLifecycle(this._frame, this._expectedLifecycle))
      return;
    this._lifecycleCompleteCallback();

    /**
     * @param {!Puppeteer.Frame} frame
     * @param {!Array<string>} expectedLifecycle
     * @return {boolean}
     */
    function checkLifecycle(frame, expectedLifecycle) {
      for (const event of expectedLifecycle) {
        if (!frame._lifecycleEvents.has(event))
          return false;
      }
      for (const child of frame.childFrames()) {
        if (!checkLifecycle(child, expectedLifecycle))
          return false;
      }
      return true;
    }
  }

  cancel() {
    this._cleanup();
  }

  _cleanup() {
    helper.removeEventListeners(this._eventListeners);
    this._lifecycleCompleteCallback(new Error('Navigation failed'));
    clearTimeout(this._maximumTimer);
  }
}

const puppeteerToProtocolLifecycle = {
  'load': 'load',
  'domcontentloaded': 'DOMContentLoaded',
  'networkidle0': 'networkIdle',
  'networkidle2': 'networkAlmostIdle',
};

module.exports = {NavigatorWatcher};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/NetworkManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/NetworkManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const {helper, assert, debugError} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const Multimap = __webpack_require__(/*! ./Multimap */ "./node_modules/puppeteer-core/lib/Multimap.js");

class NetworkManager extends EventEmitter {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Puppeteer.FrameManager} frameManager
   */
  constructor(client, frameManager) {
    super();
    this._client = client;
    this._frameManager = frameManager;
    /** @type {!Map<string, !Request>} */
    this._requestIdToRequest = new Map();
    /** @type {!Map<string, !Protocol.Network.requestWillBeSentPayload>} */
    this._requestIdToRequestWillBeSentEvent = new Map();
    /** @type {!Object<string, string>} */
    this._extraHTTPHeaders = {};

    this._offline = false;

    /** @type {?{username: string, password: string}} */
    this._credentials = null;
    /** @type {!Set<string>} */
    this._attemptedAuthentications = new Set();
    this._userRequestInterceptionEnabled = false;
    this._protocolRequestInterceptionEnabled = false;
    /** @type {!Multimap<string, string>} */
    this._requestHashToRequestIds = new Multimap();
    /** @type {!Multimap<string, string>} */
    this._requestHashToInterceptionIds = new Multimap();

    this._client.on('Network.requestWillBeSent', this._onRequestWillBeSent.bind(this));
    this._client.on('Network.requestIntercepted', this._onRequestIntercepted.bind(this));
    this._client.on('Network.requestServedFromCache', this._onRequestServedFromCache.bind(this));
    this._client.on('Network.responseReceived', this._onResponseReceived.bind(this));
    this._client.on('Network.loadingFinished', this._onLoadingFinished.bind(this));
    this._client.on('Network.loadingFailed', this._onLoadingFailed.bind(this));
  }

  /**
   * @param {?{username: string, password: string}} credentials
   */
  async authenticate(credentials) {
    this._credentials = credentials;
    await this._updateProtocolRequestInterception();
  }

  /**
   * @param {!Object<string, string>} extraHTTPHeaders
   */
  async setExtraHTTPHeaders(extraHTTPHeaders) {
    this._extraHTTPHeaders = {};
    for (const key of Object.keys(extraHTTPHeaders)) {
      const value = extraHTTPHeaders[key];
      assert(helper.isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
      this._extraHTTPHeaders[key.toLowerCase()] = value;
    }
    await this._client.send('Network.setExtraHTTPHeaders', { headers: this._extraHTTPHeaders });
  }

  /**
   * @return {!Object<string, string>}
   */
  extraHTTPHeaders() {
    return Object.assign({}, this._extraHTTPHeaders);
  }

  /**
   * @param {boolean} value
   */
  async setOfflineMode(value) {
    if (this._offline === value)
      return;
    this._offline = value;
    await this._client.send('Network.emulateNetworkConditions', {
      offline: this._offline,
      // values of 0 remove any active throttling. crbug.com/456324#c9
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    });
  }

  /**
   * @param {string} userAgent
   */
  async setUserAgent(userAgent) {
    await this._client.send('Network.setUserAgentOverride', { userAgent });
  }

  /**
   * @param {boolean} value
   */
  async setRequestInterception(value) {
    this._userRequestInterceptionEnabled = value;
    await this._updateProtocolRequestInterception();
  }

  async _updateProtocolRequestInterception() {
    const enabled = this._userRequestInterceptionEnabled || !!this._credentials;
    if (enabled === this._protocolRequestInterceptionEnabled)
      return;
    this._protocolRequestInterceptionEnabled = enabled;
    const patterns = enabled ? [{urlPattern: '*'}] : [];
    await Promise.all([
      this._client.send('Network.setCacheDisabled', {cacheDisabled: enabled}),
      this._client.send('Network.setRequestInterception', {patterns})
    ]);
  }

  /**
   * @param {!Protocol.Network.requestWillBeSentPayload} event
   */
  _onRequestWillBeSent(event) {
    if (this._protocolRequestInterceptionEnabled) {
      const requestHash = generateRequestHash(event.request);
      const interceptionId = this._requestHashToInterceptionIds.firstValue(requestHash);
      if (interceptionId) {
        this._onRequest(event, interceptionId);
        this._requestHashToInterceptionIds.delete(requestHash, interceptionId);
      } else {
        this._requestHashToRequestIds.set(requestHash, event.requestId);
        this._requestIdToRequestWillBeSentEvent.set(event.requestId, event);
      }
      return;
    }
    this._onRequest(event, null);
  }

  /**
   * @param {!Protocol.Network.requestInterceptedPayload} event
   */
  _onRequestIntercepted(event) {
    if (event.authChallenge) {
      /** @type {"Default"|"CancelAuth"|"ProvideCredentials"} */
      let response = 'Default';
      if (this._attemptedAuthentications.has(event.interceptionId)) {
        response = 'CancelAuth';
      } else if (this._credentials) {
        response = 'ProvideCredentials';
        this._attemptedAuthentications.add(event.interceptionId);
      }
      const {username, password} = this._credentials || {username: undefined, password: undefined};
      this._client.send('Network.continueInterceptedRequest', {
        interceptionId: event.interceptionId,
        authChallengeResponse: { response, username, password }
      }).catch(debugError);
      return;
    }
    if (!this._userRequestInterceptionEnabled && this._protocolRequestInterceptionEnabled) {
      this._client.send('Network.continueInterceptedRequest', {
        interceptionId: event.interceptionId
      }).catch(debugError);
    }

    const requestHash = generateRequestHash(event.request);
    const requestId = this._requestHashToRequestIds.firstValue(requestHash);
    if (requestId) {
      const requestWillBeSentEvent = this._requestIdToRequestWillBeSentEvent.get(requestId);
      this._onRequest(requestWillBeSentEvent, event.interceptionId);
      this._requestHashToRequestIds.delete(requestHash, requestId);
      this._requestIdToRequestWillBeSentEvent.delete(requestId);
    } else {
      this._requestHashToInterceptionIds.set(requestHash, event.interceptionId);
    }
  }

  /**
   * @param {!Protocol.Network.requestWillBeSentPayload} event
   * @param {?string} interceptionId
   */
  _onRequest(event, interceptionId) {
    let redirectChain = [];
    if (event.redirectResponse) {
      const request = this._requestIdToRequest.get(event.requestId);
      // If we connect late to the target, we could have missed the requestWillBeSent event.
      if (request) {
        this._handleRequestRedirect(request, event.redirectResponse.status, event.redirectResponse.headers, event.redirectResponse.fromDiskCache, event.redirectResponse.fromServiceWorker, event.redirectResponse.securityDetails);
        redirectChain = request._redirectChain;
      }
    }
    const isNavigationRequest = event.requestId === event.loaderId && event.type === 'Document';
    this._handleRequestStart(event.requestId, interceptionId, event.request.url, isNavigationRequest, event.type, event.request, event.frameId, redirectChain);
  }

  /**
   * @param {!Protocol.Network.requestServedFromCachePayload} event
   */
  _onRequestServedFromCache(event) {
    const request = this._requestIdToRequest.get(event.requestId);
    if (request)
      request._fromMemoryCache = true;
  }

  /**
   * @param {!Request} request
   * @param {number} redirectStatus
   * @param {!Object} redirectHeaders
   * @param {boolean} fromDiskCache
   * @param {boolean} fromServiceWorker
   * @param {?Object} securityDetails
   */
  _handleRequestRedirect(request, redirectStatus, redirectHeaders, fromDiskCache, fromServiceWorker, securityDetails) {
    const response = new Response(this._client, request, redirectStatus, redirectHeaders, fromDiskCache, fromServiceWorker, securityDetails);
    request._response = response;
    request._redirectChain.push(request);
    response._bodyLoadedPromiseFulfill.call(null, new Error('Response body is unavailable for redirect responses'));
    this._requestIdToRequest.delete(request._requestId);
    this._attemptedAuthentications.delete(request._interceptionId);
    this.emit(NetworkManager.Events.Response, response);
    this.emit(NetworkManager.Events.RequestFinished, request);
  }

  /**
   * @param {string} requestId
   * @param {?string} interceptionId
   * @param {string} url
   * @param {boolean} isNavigationRequest
   * @param {string} resourceType
   * @param {!Protocol.Network.Request} requestPayload
   * @param {?string} frameId
   * @param {!Array<!Request>} redirectChain
   */
  _handleRequestStart(requestId, interceptionId, url, isNavigationRequest, resourceType, requestPayload, frameId, redirectChain) {
    let frame = null;
    if (frameId)
      frame = this._frameManager.frame(frameId);
    const request = new Request(this._client, requestId, interceptionId, isNavigationRequest, this._userRequestInterceptionEnabled, url, resourceType, requestPayload, frame, redirectChain);
    this._requestIdToRequest.set(requestId, request);
    this.emit(NetworkManager.Events.Request, request);
  }

  /**
   * @param {!Protocol.Network.responseReceivedPayload} event
   */
  _onResponseReceived(event) {
    const request = this._requestIdToRequest.get(event.requestId);
    // FileUpload sends a response without a matching request.
    if (!request)
      return;
    const response = new Response(this._client, request, event.response.status, event.response.headers,
        event.response.fromDiskCache, event.response.fromServiceWorker, event.response.securityDetails);
    request._response = response;
    this.emit(NetworkManager.Events.Response, response);
  }

  /**
   * @param {!Protocol.Network.loadingFinishedPayload} event
   */
  _onLoadingFinished(event) {
    const request = this._requestIdToRequest.get(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request)
      return;
    request.response()._bodyLoadedPromiseFulfill.call(null);
    this._requestIdToRequest.delete(request._requestId);
    this._attemptedAuthentications.delete(request._interceptionId);
    this.emit(NetworkManager.Events.RequestFinished, request);
  }

  /**
   * @param {!Protocol.Network.loadingFailedPayload} event
   */
  _onLoadingFailed(event) {
    const request = this._requestIdToRequest.get(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request)
      return;
    request._failureText = event.errorText;
    const response = request.response();
    if (response)
      response._bodyLoadedPromiseFulfill.call(null);
    this._requestIdToRequest.delete(request._requestId);
    this._attemptedAuthentications.delete(request._interceptionId);
    this.emit(NetworkManager.Events.RequestFailed, request);
  }
}

class Request {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {?string} requestId
   * @param {string} interceptionId
   * @param {boolean} isNavigationRequest
   * @param {boolean} allowInterception
   * @param {string} url
   * @param {string} resourceType
   * @param {!Protocol.Network.Request} payload
   * @param {?Puppeteer.Frame} frame
   * @param {!Array<!Request>} redirectChain
   */
  constructor(client, requestId, interceptionId, isNavigationRequest, allowInterception, url, resourceType, payload, frame, redirectChain) {
    this._client = client;
    this._requestId = requestId;
    this._isNavigationRequest = isNavigationRequest;
    this._interceptionId = interceptionId;
    this._allowInterception = allowInterception;
    this._interceptionHandled = false;
    this._response = null;
    this._failureText = null;

    this._url = url;
    this._resourceType = resourceType.toLowerCase();
    this._method = payload.method;
    this._postData = payload.postData;
    this._headers = {};
    this._frame = frame;
    this._redirectChain = redirectChain;
    for (const key of Object.keys(payload.headers))
      this._headers[key.toLowerCase()] = payload.headers[key];

    this._fromMemoryCache = false;
  }

  /**
   * @return {string}
   */
  url() {
    return this._url;
  }

  /**
   * @return {string}
   */
  resourceType() {
    return this._resourceType;
  }

  /**
   * @return {string}
   */
  method() {
    return this._method;
  }

  /**
   * @return {string}
   */
  postData() {
    return this._postData;
  }

  /**
   * @return {!Object}
   */
  headers() {
    return this._headers;
  }

  /**
   * @return {?Response}
   */
  response() {
    return this._response;
  }

  /**
   * @return {?Puppeteer.Frame}
   */
  frame() {
    return this._frame;
  }

  /**
   * @return {boolean}
   */
  isNavigationRequest() {
    return this._isNavigationRequest;
  }

  /**
   * @return {!Array<!Request>}
   */
  redirectChain() {
    return this._redirectChain.slice();
  }

  /**
   * @return {?{errorText: string}}
   */
  failure() {
    if (!this._failureText)
      return null;
    return {
      errorText: this._failureText
    };
  }

  /**
   * @param {!Object=} overrides
   */
  async continue(overrides = {}) {
    assert(this._allowInterception, 'Request Interception is not enabled!');
    assert(!this._interceptionHandled, 'Request is already handled!');
    this._interceptionHandled = true;
    await this._client.send('Network.continueInterceptedRequest', {
      interceptionId: this._interceptionId,
      url: overrides.url,
      method: overrides.method,
      postData: overrides.postData,
      headers: overrides.headers,
    }).catch(error => {
      // In certain cases, protocol will return error if the request was already canceled
      // or the page was closed. We should tolerate these errors.
      debugError(error);
    });
  }

  /**
   * @param {!{status: number, headers: Object, contentType: string, body: (string|Buffer)}} response
   */
  async respond(response) {
    // Mocking responses for dataURL requests is not currently supported.
    if (this._url.startsWith('data:'))
      return;
    assert(this._allowInterception, 'Request Interception is not enabled!');
    assert(!this._interceptionHandled, 'Request is already handled!');
    this._interceptionHandled = true;

    const responseBody = response.body && helper.isString(response.body) ? Buffer.from(/** @type {string} */(response.body)) : /** @type {?Buffer} */(response.body || null);

    const responseHeaders = {};
    if (response.headers) {
      for (const header of Object.keys(response.headers))
        responseHeaders[header.toLowerCase()] = response.headers[header];
    }
    if (response.contentType)
      responseHeaders['content-type'] = response.contentType;
    if (responseBody && !('content-length' in responseHeaders)) {
      // @ts-ignore
      responseHeaders['content-length'] = Buffer.byteLength(responseBody);
    }

    const statusCode = response.status || 200;
    const statusText = statusTexts[statusCode] || '';
    const statusLine = `HTTP/1.1 ${statusCode} ${statusText}`;

    const CRLF = '\r\n';
    let text = statusLine + CRLF;
    for (const header of Object.keys(responseHeaders))
      text += header + ': ' + responseHeaders[header] + CRLF;
    text += CRLF;
    let responseBuffer = Buffer.from(text, 'utf8');
    if (responseBody)
      responseBuffer = Buffer.concat([responseBuffer, responseBody]);

    await this._client.send('Network.continueInterceptedRequest', {
      interceptionId: this._interceptionId,
      rawResponse: responseBuffer.toString('base64')
    }).catch(error => {
      // In certain cases, protocol will return error if the request was already canceled
      // or the page was closed. We should tolerate these errors.
      debugError(error);
    });
  }

  /**
   * @param {string=} errorCode
   */
  async abort(errorCode = 'failed') {
    const errorReason = errorReasons[errorCode];
    assert(errorReason, 'Unknown error code: ' + errorCode);
    assert(this._allowInterception, 'Request Interception is not enabled!');
    assert(!this._interceptionHandled, 'Request is already handled!');
    this._interceptionHandled = true;
    await this._client.send('Network.continueInterceptedRequest', {
      interceptionId: this._interceptionId,
      errorReason
    }).catch(error => {
      // In certain cases, protocol will return error if the request was already canceled
      // or the page was closed. We should tolerate these errors.
      debugError(error);
    });
  }
}

const errorReasons = {
  'aborted': 'Aborted',
  'accessdenied': 'AccessDenied',
  'addressunreachable': 'AddressUnreachable',
  'blockedbyclient': 'BlockedByClient',
  'blockedbyresponse': 'BlockedByResponse',
  'connectionaborted': 'ConnectionAborted',
  'connectionclosed': 'ConnectionClosed',
  'connectionfailed': 'ConnectionFailed',
  'connectionrefused': 'ConnectionRefused',
  'connectionreset': 'ConnectionReset',
  'internetdisconnected': 'InternetDisconnected',
  'namenotresolved': 'NameNotResolved',
  'timedout': 'TimedOut',
  'failed': 'Failed',
};

helper.tracePublicAPI(Request);

class Response {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Request} request
   * @param {number} status
   * @param {!Object} headers
   * @param {boolean} fromDiskCache
   * @param {boolean} fromServiceWorker
   * @param {?Object} securityDetails
   */
  constructor(client, request, status, headers, fromDiskCache, fromServiceWorker, securityDetails) {
    this._client = client;
    this._request = request;
    this._contentPromise = null;

    this._bodyLoadedPromise = new Promise(fulfill => {
      this._bodyLoadedPromiseFulfill = fulfill;
    });

    this._status = status;
    this._url = request.url();
    this._fromDiskCache = fromDiskCache;
    this._fromServiceWorker = fromServiceWorker;
    this._headers = {};
    for (const key of Object.keys(headers))
      this._headers[key.toLowerCase()] = headers[key];
    this._securityDetails = null;
    if (securityDetails) {
      this._securityDetails = new SecurityDetails(
          securityDetails['subjectName'],
          securityDetails['issuer'],
          securityDetails['validFrom'],
          securityDetails['validTo'],
          securityDetails['protocol']);
    }
  }

  /**
   * @return {string}
   */
  url() {
    return this._url;
  }

  /**
   * @return {boolean}
   */
  ok() {
    return this._status === 0 || (this._status >= 200 && this._status <= 299);
  }

  /**
   * @return {number}
   */
  status() {
    return this._status;
  }

  /**
   * @return {!Object}
   */
  headers() {
    return this._headers;
  }

  /**
   * @return {?SecurityDetails}
   */
  securityDetails() {
    return this._securityDetails;
  }

  /**
   * @return {!Promise<!Buffer>}
   */
  buffer() {
    if (!this._contentPromise) {
      this._contentPromise = this._bodyLoadedPromise.then(async error => {
        if (error)
          throw error;
        const response = await this._client.send('Network.getResponseBody', {
          requestId: this._request._requestId
        });
        return Buffer.from(response.body, response.base64Encoded ? 'base64' : 'utf8');
      });
    }
    return this._contentPromise;
  }

  /**
   * @return {!Promise<string>}
   */
  async text() {
    const content = await this.buffer();
    return content.toString('utf8');
  }

  /**
   * @return {!Promise<!Object>}
   */
  async json() {
    const content = await this.text();
    return JSON.parse(content);
  }

  /**
   * @return {!Request}
   */
  request() {
    return this._request;
  }

  /**
   * @return {boolean}
   */
  fromCache() {
    return this._fromDiskCache || this._request._fromMemoryCache;
  }

  /**
   * @return {boolean}
   */
  fromServiceWorker() {
    return this._fromServiceWorker;
  }
}
helper.tracePublicAPI(Response);

/**
 * @param {!Protocol.Network.Request} request
 * @return {string}
 */
function generateRequestHash(request) {
  let normalizedURL = request.url;
  try {
    // Decoding is necessary to normalize URLs. @see crbug.com/759388
    // The method will throw if the URL is malformed. In this case,
    // consider URL to be normalized as-is.
    normalizedURL = decodeURI(request.url);
  } catch (e) {
  }
  const hash = {
    url: normalizedURL,
    method: request.method,
    postData: request.postData,
    headers: {},
  };

  if (!normalizedURL.startsWith('data:')) {
    const headers = Object.keys(request.headers);
    headers.sort();
    for (let header of headers) {
      const headerValue = request.headers[header];
      header = header.toLowerCase();
      if (header === 'accept' || header === 'referer' || header === 'x-devtools-emulate-network-conditions-client-id' || header === 'cookie')
        continue;
      hash.headers[header] = headerValue;
    }
  }
  return JSON.stringify(hash);
}

class SecurityDetails {
  /**
   * @param {string} subjectName
   * @param {string} issuer
   * @param {number} validFrom
   * @param {number} validTo
   * @param {string} protocol
   */

  constructor(subjectName, issuer, validFrom, validTo, protocol) {
    this._subjectName = subjectName;
    this._issuer = issuer;
    this._validFrom = validFrom;
    this._validTo = validTo;
    this._protocol = protocol;
  }

  /**
   * @return {string}
   */
  subjectName() {
    return this._subjectName;
  }

  /**
   * @return {string}
   */
  issuer() {
    return this._issuer;
  }

  /**
   * @return {number}
   */
  validFrom() {
    return this._validFrom;
  }

  /**
   * @return {number}
   */
  validTo() {
    return this._validTo;
  }

  /**
   * @return {string}
   */
  protocol() {
    return this._protocol;
  }
}

NetworkManager.Events = {
  Request: 'request',
  Response: 'response',
  RequestFailed: 'requestfailed',
  RequestFinished: 'requestfinished',
};

const statusTexts = {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '209': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '306': 'Switch Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '510': 'Not Extended',
  '511': 'Network Authentication Required',
};

module.exports = {Request, Response, NetworkManager};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Page.js":
/*!*************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Page.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = __webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js");
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const mime = __webpack_require__(/*! mime */ "mime");
const {NetworkManager} = __webpack_require__(/*! ./NetworkManager */ "./node_modules/puppeteer-core/lib/NetworkManager.js");
const {NavigatorWatcher} = __webpack_require__(/*! ./NavigatorWatcher */ "./node_modules/puppeteer-core/lib/NavigatorWatcher.js");
const {Dialog} = __webpack_require__(/*! ./Dialog */ "./node_modules/puppeteer-core/lib/Dialog.js");
const {EmulationManager} = __webpack_require__(/*! ./EmulationManager */ "./node_modules/puppeteer-core/lib/EmulationManager.js");
const {FrameManager} = __webpack_require__(/*! ./FrameManager */ "./node_modules/puppeteer-core/lib/FrameManager.js");
const {Keyboard, Mouse, Touchscreen} = __webpack_require__(/*! ./Input */ "./node_modules/puppeteer-core/lib/Input.js");
const Tracing = __webpack_require__(/*! ./Tracing */ "./node_modules/puppeteer-core/lib/Tracing.js");
const {helper, debugError, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const {Coverage} = __webpack_require__(/*! ./Coverage */ "./node_modules/puppeteer-core/lib/Coverage.js");
const {Worker} = __webpack_require__(/*! ./Worker */ "./node_modules/puppeteer-core/lib/Worker.js");

const writeFileAsync = helper.promisify(fs.writeFile);

class Page extends EventEmitter {
  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Puppeteer.Target} target
   * @param {boolean} ignoreHTTPSErrors
   * @param {?Puppeteer.Viewport} defaultViewport
   * @param {!Puppeteer.TaskQueue} screenshotTaskQueue
   * @return {!Promise<!Page>}
   */
  static async create(client, target, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue) {

    await client.send('Page.enable');
    const {frameTree} = await client.send('Page.getFrameTree');
    const page = new Page(client, target, frameTree, ignoreHTTPSErrors, screenshotTaskQueue);

    await Promise.all([
      client.send('Target.setAutoAttach', {autoAttach: true, waitForDebuggerOnStart: false}),
      client.send('Page.setLifecycleEventsEnabled', { enabled: true }),
      client.send('Network.enable', {}),
      client.send('Runtime.enable', {}),
      client.send('Security.enable', {}),
      client.send('Performance.enable', {}),
      client.send('Log.enable', {}),
    ]);
    if (ignoreHTTPSErrors)
      await client.send('Security.setOverrideCertificateErrors', {override: true});
    // Initialize default page size.
    if (defaultViewport)
      await page.setViewport(defaultViewport);

    return page;
  }

  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Puppeteer.Target} target
   * @param {!Protocol.Page.FrameTree} frameTree
   * @param {boolean} ignoreHTTPSErrors
   * @param {!Puppeteer.TaskQueue} screenshotTaskQueue
   */
  constructor(client, target, frameTree, ignoreHTTPSErrors, screenshotTaskQueue) {
    super();
    this._closed = false;
    this._client = client;
    this._target = target;
    this._keyboard = new Keyboard(client);
    this._mouse = new Mouse(client, this._keyboard);
    this._touchscreen = new Touchscreen(client, this._keyboard);
    /** @type {!FrameManager} */
    this._frameManager = new FrameManager(client, frameTree, this);
    this._networkManager = new NetworkManager(client, this._frameManager);
    this._emulationManager = new EmulationManager(client);
    this._tracing = new Tracing(client);
    /** @type {!Map<string, Function>} */
    this._pageBindings = new Map();
    this._ignoreHTTPSErrors = ignoreHTTPSErrors;
    this._coverage = new Coverage(client);
    this._defaultNavigationTimeout = 30000;
    this._javascriptEnabled = true;
    /** @type {?Puppeteer.Viewport} */
    this._viewport = null;

    this._screenshotTaskQueue = screenshotTaskQueue;

    /** @type {!Map<string, Worker>} */
    this._workers = new Map();
    client.on('Target.attachedToTarget', event => {
      if (event.targetInfo.type !== 'worker') {
        // If we don't detach from service workers, they will never die.
        client.send('Target.detachFromTarget', {
          sessionId: event.sessionId
        }).catch(debugError);
        return;
      }
      const session = client._createSession(event.targetInfo.type, event.sessionId);
      const worker = new Worker(session, event.targetInfo.url, this._addConsoleMessage.bind(this), this._handleException.bind(this));
      this._workers.set(event.sessionId, worker);
      this.emit(Page.Events.WorkerCreated, worker);

    });
    client.on('Target.detachedFromTarget', event => {
      const worker = this._workers.get(event.sessionId);
      if (!worker)
        return;
      this.emit(Page.Events.WorkerDestroyed, worker);
      this._workers.delete(event.sessionId);
    });

    this._frameManager.on(FrameManager.Events.FrameAttached, event => this.emit(Page.Events.FrameAttached, event));
    this._frameManager.on(FrameManager.Events.FrameDetached, event => this.emit(Page.Events.FrameDetached, event));
    this._frameManager.on(FrameManager.Events.FrameNavigated, event => this.emit(Page.Events.FrameNavigated, event));

    this._networkManager.on(NetworkManager.Events.Request, event => this.emit(Page.Events.Request, event));
    this._networkManager.on(NetworkManager.Events.Response, event => this.emit(Page.Events.Response, event));
    this._networkManager.on(NetworkManager.Events.RequestFailed, event => this.emit(Page.Events.RequestFailed, event));
    this._networkManager.on(NetworkManager.Events.RequestFinished, event => this.emit(Page.Events.RequestFinished, event));

    client.on('Page.domContentEventFired', event => this.emit(Page.Events.DOMContentLoaded));
    client.on('Page.loadEventFired', event => this.emit(Page.Events.Load));
    client.on('Runtime.consoleAPICalled', event => this._onConsoleAPI(event));
    client.on('Runtime.bindingCalled', event => this._onBindingCalled(event));
    client.on('Page.javascriptDialogOpening', event => this._onDialog(event));
    client.on('Runtime.exceptionThrown', exception => this._handleException(exception.exceptionDetails));
    client.on('Security.certificateError', event => this._onCertificateError(event));
    client.on('Inspector.targetCrashed', event => this._onTargetCrashed());
    client.on('Performance.metrics', event => this._emitMetrics(event));
    client.on('Log.entryAdded', event => this._onLogEntryAdded(event));
    this._target._isClosedPromise.then(() => {
      this.emit(Page.Events.Close);
      this._closed = true;
    });
  }

  /**
   * @return {!Puppeteer.Target}
   */
  target() {
    return this._target;
  }

  /**
   * @return {!Puppeteer.Browser}
   */
  browser() {
    return this._target.browser();
  }

  _onTargetCrashed() {
    this.emit('error', new Error('Page crashed!'));
  }

  /**
   * @param {!Protocol.Log.entryAddedPayload} event
   */
  _onLogEntryAdded(event) {
    const {level, text, args, source} = event.entry;
    if (args)
      args.map(arg => helper.releaseObject(this._client, arg));
    if (source !== 'worker')
      this.emit(Page.Events.Console, new ConsoleMessage(level, text));
  }

  /**
   * @return {!Puppeteer.Frame}
   */
  mainFrame() {
    return this._frameManager.mainFrame();
  }

  /**
   * @return {!Keyboard}
   */
  get keyboard() {
    return this._keyboard;
  }

  /**
   * @return {!Touchscreen}
   */
  get touchscreen() {
    return this._touchscreen;
  }

  /**
   * @return {!Coverage}
   */
  get coverage() {
    return this._coverage;
  }

  /**
   * @return {!Tracing}
   */
  get tracing() {
    return this._tracing;
  }

  /**
   * @return {!Array<Puppeteer.Frame>}
   */
  frames() {
    return this._frameManager.frames();
  }

  /**
   * @return {!Array<!Worker>}
   */
  workers() {
    return Array.from(this._workers.values());
  }

  /**
   * @param {boolean} value
   */
  async setRequestInterception(value) {
    return this._networkManager.setRequestInterception(value);
  }

  /**
   * @param {boolean} enabled
   */
  setOfflineMode(enabled) {
    return this._networkManager.setOfflineMode(enabled);
  }

  /**
   * @param {number} timeout
   */
  setDefaultNavigationTimeout(timeout) {
    this._defaultNavigationTimeout = timeout;
  }

  /**
   * @param {!Protocol.Security.certificateErrorPayload} event
   */
  _onCertificateError(event) {
    if (!this._ignoreHTTPSErrors)
      return;
    this._client.send('Security.handleCertificateError', {
      eventId: event.eventId,
      action: 'continue'
    }).catch(debugError);
  }

  /**
   * @param {string} selector
   * @return {!Promise<?Puppeteer.ElementHandle>}
   */
  async $(selector) {
    return this.mainFrame().$(selector);
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<!Puppeteer.JSHandle>}
   */
  async evaluateHandle(pageFunction, ...args) {
    const context = await this.mainFrame().executionContext();
    return context.evaluateHandle(pageFunction, ...args);
  }

  /**
   * @param {!Puppeteer.JSHandle} prototypeHandle
   * @return {!Promise<!Puppeteer.JSHandle>}
   */
  async queryObjects(prototypeHandle) {
    const context = await this.mainFrame().executionContext();
    return context.queryObjects(prototypeHandle);
  }

  /**
   * @param {string} selector
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $eval(selector, pageFunction, ...args) {
    return this.mainFrame().$eval(selector, pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @param {Function|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $$eval(selector, pageFunction, ...args) {
    return this.mainFrame().$$eval(selector, pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @return {!Promise<!Array<!Puppeteer.ElementHandle>>}
   */
  async $$(selector) {
    return this.mainFrame().$$(selector);
  }

  /**
   * @param {string} expression
   * @return {!Promise<!Array<!Puppeteer.ElementHandle>>}
   */
  async $x(expression) {
    return this.mainFrame().$x(expression);
  }

  /**
   * @param {!Array<string>} urls
   * @return {!Promise<!Array<Network.Cookie>>}
   */
  async cookies(...urls) {
    return (await this._client.send('Network.getCookies', {
      urls: urls.length ? urls : [this.url()]
    })).cookies;
  }

  /**
   * @param {Array<Network.CookieParam>} cookies
   */
  async deleteCookie(...cookies) {
    const pageURL = this.url();
    for (const cookie of cookies) {
      const item = Object.assign({}, cookie);
      if (!cookie.url && pageURL.startsWith('http'))
        item.url = pageURL;
      await this._client.send('Network.deleteCookies', item);
    }
  }

  /**
   * @param {Array<Network.CookieParam>} cookies
   */
  async setCookie(...cookies) {
    const pageURL = this.url();
    const startsWithHTTP = pageURL.startsWith('http');
    const items = cookies.map(cookie => {
      const item = Object.assign({}, cookie);
      if (!item.url && startsWithHTTP)
        item.url = pageURL;
      assert(
          item.url !== 'about:blank',
          `Blank page can not have cookie "${item.name}"`
      );
      assert(
          !String.prototype.startsWith.call(item.url || '', 'data:'),
          `Data URL page can not have cookie "${item.name}"`
      );
      return item;
    });
    await this.deleteCookie(...items);
    if (items.length)
      await this._client.send('Network.setCookies', { cookies: items });
  }

  /**
   * @param {Object} options
   * @return {!Promise<!Puppeteer.ElementHandle>}
   */
  async addScriptTag(options) {
    return this.mainFrame().addScriptTag(options);
  }

  /**
   * @param {Object} options
   * @return {!Promise<!Puppeteer.ElementHandle>}
   */
  async addStyleTag(options) {
    return this.mainFrame().addStyleTag(options);
  }

  /**
   * @param {string} name
   * @param {function(?)} puppeteerFunction
   */
  async exposeFunction(name, puppeteerFunction) {
    if (this._pageBindings.has(name))
      throw new Error(`Failed to add page binding with name ${name}: window['${name}'] already exists!`);
    this._pageBindings.set(name, puppeteerFunction);

    const expression = helper.evaluationString(addPageBinding, name);
    await this._client.send('Runtime.addBinding', {name: name});
    await this._client.send('Page.addScriptToEvaluateOnNewDocument', {source: expression});
    await Promise.all(this.frames().map(frame => frame.evaluate(expression).catch(debugError)));

    function addPageBinding(bindingName) {
      const binding = window[bindingName];
      window[bindingName] = async(...args) => {
        const me = window[bindingName];
        let callbacks = me['callbacks'];
        if (!callbacks) {
          callbacks = new Map();
          me['callbacks'] = callbacks;
        }
        const seq = (me['lastSeq'] || 0) + 1;
        me['lastSeq'] = seq;
        const promise = new Promise(fulfill => callbacks.set(seq, fulfill));
        binding(JSON.stringify({name: bindingName, seq, args}));
        return promise;
      };
    }
  }

  /**
   * @param {?{username: string, password: string}} credentials
   */
  async authenticate(credentials) {
    return this._networkManager.authenticate(credentials);
  }

  /**
   * @param {!Object<string, string>} headers
   */
  async setExtraHTTPHeaders(headers) {
    return this._networkManager.setExtraHTTPHeaders(headers);
  }

  /**
   * @param {string} userAgent
   */
  async setUserAgent(userAgent) {
    return this._networkManager.setUserAgent(userAgent);
  }

  /**
   * @return {!Promise<!Object>}
   */
  async metrics() {
    const response = await this._client.send('Performance.getMetrics');
    return this._buildMetricsObject(response.metrics);
  }

  /**
   * @param {*} event
   */
  _emitMetrics(event) {
    this.emit(Page.Events.Metrics, {
      title: event.title,
      metrics: this._buildMetricsObject(event.metrics)
    });
  }

  /**
   * @param {?Array<!Protocol.Performance.Metric>} metrics
   * @return {!Object}
   */
  _buildMetricsObject(metrics) {
    const result = {};
    for (const metric of metrics || []) {
      if (supportedMetrics.has(metric.name))
        result[metric.name] = metric.value;
    }
    return result;
  }

  /**
   * @param {!Protocol.Runtime.ExceptionDetails} exceptionDetails
   */
  _handleException(exceptionDetails) {
    const message = helper.getExceptionMessage(exceptionDetails);
    const err = new Error(message);
    err.stack = ''; // Don't report clientside error with a node stack attached
    this.emit(Page.Events.PageError, err);
  }

  /**
   * @param {!Protocol.Runtime.consoleAPICalledPayload} event
   */
  async _onConsoleAPI(event) {
    const context = this._frameManager.executionContextById(event.executionContextId);
    const values = event.args.map(arg => this._frameManager.createJSHandle(context, arg));
    this._addConsoleMessage(event.type, values);
  }

  /**
   * @param {!Protocol.Runtime.bindingCalledPayload} event
   */
  async _onBindingCalled(event) {
    const {name, seq, args} = JSON.parse(event.payload);
    const result = await this._pageBindings.get(name)(...args);
    const expression = helper.evaluationString(deliverResult, name, seq, result);
    this._client.send('Runtime.evaluate', { expression, contextId: event.executionContextId }).catch(debugError);

    function deliverResult(name, seq, result) {
      window[name]['callbacks'].get(seq)(result);
      window[name]['callbacks'].delete(seq);
    }
  }

  /**
   * @param {string} type
   * @param {!Array<!Puppeteer.JSHandle>} args
   */
  _addConsoleMessage(type, args) {
    if (!this.listenerCount(Page.Events.Console)) {
      args.forEach(arg => arg.dispose());
      return;
    }
    const textTokens = [];
    for (const arg of args) {
      const remoteObject = arg._remoteObject;
      if (remoteObject.objectId)
        textTokens.push(arg.toString());
      else
        textTokens.push(helper.valueFromRemoteObject(remoteObject));
    }
    const message = new ConsoleMessage(type, textTokens.join(' '), args);
    this.emit(Page.Events.Console, message);
  }

  _onDialog(event) {
    let dialogType = null;
    if (event.type === 'alert')
      dialogType = Dialog.Type.Alert;
    else if (event.type === 'confirm')
      dialogType = Dialog.Type.Confirm;
    else if (event.type === 'prompt')
      dialogType = Dialog.Type.Prompt;
    else if (event.type === 'beforeunload')
      dialogType = Dialog.Type.BeforeUnload;
    assert(dialogType, 'Unknown javascript dialog type: ' + event.type);
    const dialog = new Dialog(this._client, dialogType, event.message, event.defaultPrompt);
    this.emit(Page.Events.Dialog, dialog);
  }

  /**
   * @return {!string}
   */
  url() {
    return this.mainFrame().url();
  }

  /**
   * @return {!Promise<String>}
   */
  async content() {
    return await this._frameManager.mainFrame().content();
  }

  /**
   * @param {string} html
   */
  async setContent(html) {
    await this._frameManager.mainFrame().setContent(html);
  }

  /**
   * @param {string} url
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goto(url, options = {}) {
    const referrer = this._networkManager.extraHTTPHeaders()['referer'];

    /** @type {Map<string, !Puppeteer.Request>} */
    const requests = new Map();
    const eventListeners = [
      helper.addEventListener(this._networkManager, NetworkManager.Events.Request, request => {
        if (!requests.get(request.url()))
          requests.set(request.url(), request);
      })
    ];

    const mainFrame = this._frameManager.mainFrame();
    const timeout = typeof options.timeout === 'number' ? options.timeout : this._defaultNavigationTimeout;
    const watcher = new NavigatorWatcher(this._frameManager, mainFrame, timeout, options);
    const navigationPromise = watcher.navigationPromise();
    let error = await Promise.race([
      navigate(this._client, url, referrer),
      navigationPromise,
    ]);
    if (!error)
      error = await navigationPromise;
    watcher.cancel();
    helper.removeEventListeners(eventListeners);
    if (error)
      throw error;
    const request = requests.get(mainFrame._navigationURL);
    return request ? request.response() : null;

    /**
     * @param {!Puppeteer.CDPSession} client
     * @param {string} url
     * @param {string} referrer
     * @return {!Promise<?Error>}
     */
    async function navigate(client, url, referrer) {
      try {
        const response = await client.send('Page.navigate', {url, referrer});
        return response.errorText ? new Error(`${response.errorText} at ${url}`) : null;
      } catch (error) {
        return error;
      }
    }
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async reload(options) {
    const [response] = await Promise.all([
      this.waitForNavigation(options),
      this._client.send('Page.reload')
    ]);
    return response;
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async waitForNavigation(options = {}) {
    const mainFrame = this._frameManager.mainFrame();
    const timeout = typeof options.timeout === 'number' ? options.timeout : this._defaultNavigationTimeout;
    const watcher = new NavigatorWatcher(this._frameManager, mainFrame, timeout, options);

    const responses = new Map();
    const listener = helper.addEventListener(this._networkManager, NetworkManager.Events.Response, response => responses.set(response.url(), response));
    const error = await watcher.navigationPromise();
    helper.removeEventListeners([listener]);
    if (error)
      throw error;
    return responses.get(this.mainFrame().url()) || null;
  }

  /**
   * @param {(string|Function)} urlOrPredicate
   * @param {!Object=} options
   * @return {!Promise<!Puppeteer.Request>}
   */
  async waitForRequest(urlOrPredicate, options = {}) {
    const timeout = typeof options.timeout === 'number' ? options.timeout : 30000;
    return helper.waitForEvent(this._networkManager, NetworkManager.Events.Request, request => {
      if (helper.isString(urlOrPredicate))
        return (urlOrPredicate === request.url());
      if (typeof urlOrPredicate === 'function')
        return !!(urlOrPredicate(request));
      return false;
    }, timeout);
  }

  /**
   * @param {(string|Function)} urlOrPredicate
   * @param {!Object=} options
   * @return {!Promise<!Puppeteer.Response>}
   */
  async waitForResponse(urlOrPredicate, options = {}) {
    const timeout = typeof options.timeout === 'number' ? options.timeout : 30000;
    return helper.waitForEvent(this._networkManager, NetworkManager.Events.Response, response => {
      if (helper.isString(urlOrPredicate))
        return (urlOrPredicate === response.url());
      if (typeof urlOrPredicate === 'function')
        return !!(urlOrPredicate(response));
      return false;
    }, timeout);
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goBack(options) {
    return this._go(-1, options);
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goForward(options) {
    return this._go(+1, options);
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async _go(delta, options) {
    const history = await this._client.send('Page.getNavigationHistory');
    const entry = history.entries[history.currentIndex + delta];
    if (!entry)
      return null;
    const [response] = await Promise.all([
      this.waitForNavigation(options),
      this._client.send('Page.navigateToHistoryEntry', {entryId: entry.id}),
    ]);
    return response;
  }

  async bringToFront() {
    await this._client.send('Page.bringToFront');
  }

  /**
   * @param {!Object} options
   */
  async emulate(options) {
    return Promise.all([
      this.setViewport(options.viewport),
      this.setUserAgent(options.userAgent)
    ]);
  }

  /**
   * @param {boolean} enabled
   */
  async setJavaScriptEnabled(enabled) {
    if (this._javascriptEnabled === enabled)
      return;
    this._javascriptEnabled = enabled;
    await this._client.send('Emulation.setScriptExecutionDisabled', { value: !enabled });
  }

  /**
   * @param {boolean} enabled
   */
  async setBypassCSP(enabled) {
    await this._client.send('Page.setBypassCSP', { enabled });
  }

  /**
   * @param {?string} mediaType
   */
  async emulateMedia(mediaType) {
    assert(mediaType === 'screen' || mediaType === 'print' || mediaType === null, 'Unsupported media type: ' + mediaType);
    await this._client.send('Emulation.setEmulatedMedia', {media: mediaType || ''});
  }

  /**
   * @param {!Puppeteer.Viewport} viewport
   */
  async setViewport(viewport) {
    const needsReload = await this._emulationManager.emulateViewport(viewport);
    this._viewport = viewport;
    if (needsReload)
      await this.reload();
  }

  /**
   * @return {?Puppeteer.Viewport}
   */
  viewport() {
    return this._viewport;
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<*>}
   */
  async evaluate(pageFunction, ...args) {
    return this._frameManager.mainFrame().evaluate(pageFunction, ...args);
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   */
  async evaluateOnNewDocument(pageFunction, ...args) {
    const source = helper.evaluationString(pageFunction, ...args);
    await this._client.send('Page.addScriptToEvaluateOnNewDocument', { source });
  }

  /**
   * @param {Boolean} enabled
   * @returns {!Promise}
   */
  async setCacheEnabled(enabled = true) {
    await this._client.send('Network.setCacheDisabled', {cacheDisabled: !enabled});
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<!Buffer|!String>}
   */
  async screenshot(options = {}) {
    let screenshotType = null;
    // options.type takes precedence over inferring the type from options.path
    // because it may be a 0-length file with no extension created beforehand (i.e. as a temp file).
    if (options.type) {
      assert(options.type === 'png' || options.type === 'jpeg', 'Unknown options.type value: ' + options.type);
      screenshotType = options.type;
    } else if (options.path) {
      const mimeType = mime.getType(options.path);
      if (mimeType === 'image/png')
        screenshotType = 'png';
      else if (mimeType === 'image/jpeg')
        screenshotType = 'jpeg';
      assert(screenshotType, 'Unsupported screenshot mime type: ' + mimeType);
    }

    if (!screenshotType)
      screenshotType = 'png';

    if (options.quality) {
      assert(screenshotType === 'jpeg', 'options.quality is unsupported for the ' + screenshotType + ' screenshots');
      assert(typeof options.quality === 'number', 'Expected options.quality to be a number but found ' + (typeof options.quality));
      assert(Number.isInteger(options.quality), 'Expected options.quality to be an integer');
      assert(options.quality >= 0 && options.quality <= 100, 'Expected options.quality to be between 0 and 100 (inclusive), got ' + options.quality);
    }
    assert(!options.clip || !options.fullPage, 'options.clip and options.fullPage are exclusive');
    if (options.clip) {
      assert(typeof options.clip.x === 'number', 'Expected options.clip.x to be a number but found ' + (typeof options.clip.x));
      assert(typeof options.clip.y === 'number', 'Expected options.clip.y to be a number but found ' + (typeof options.clip.y));
      assert(typeof options.clip.width === 'number', 'Expected options.clip.width to be a number but found ' + (typeof options.clip.width));
      assert(typeof options.clip.height === 'number', 'Expected options.clip.height to be a number but found ' + (typeof options.clip.height));
    }
    return this._screenshotTaskQueue.postTask(this._screenshotTask.bind(this, screenshotType, options));
  }

  /**
   * @param {"png"|"jpeg"} format
   * @param {!Object=} options
   * @return {!Promise<!Buffer|!String>}
   */
  async _screenshotTask(format, options) {
    await this._client.send('Target.activateTarget', {targetId: this._target._targetId});
    let clip = options.clip ? Object.assign({}, options['clip']) : undefined;
    if (clip)
      clip.scale = 1;

    if (options.fullPage) {
      const metrics = await this._client.send('Page.getLayoutMetrics');
      const width = Math.ceil(metrics.contentSize.width);
      const height = Math.ceil(metrics.contentSize.height);

      // Overwrite clip for full page at all times.
      clip = { x: 0, y: 0, width, height, scale: 1 };
      const mobile = this._viewport.isMobile || false;
      const deviceScaleFactor = this._viewport.deviceScaleFactor || 1;
      const landscape = this._viewport.isLandscape || false;
      /** @type {!Protocol.Emulation.ScreenOrientation} */
      const screenOrientation = landscape ? { angle: 90, type: 'landscapePrimary' } : { angle: 0, type: 'portraitPrimary' };
      await this._client.send('Emulation.setDeviceMetricsOverride', { mobile, width, height, deviceScaleFactor, screenOrientation });
    }

    if (options.omitBackground)
      await this._client.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    const result = await this._client.send('Page.captureScreenshot', { format, quality: options.quality, clip });
    if (options.omitBackground)
      await this._client.send('Emulation.setDefaultBackgroundColorOverride');

    if (options.fullPage)
      await this.setViewport(this._viewport);

    const buffer = options.encoding === 'base64' ? result.data : Buffer.from(result.data, 'base64');
    if (options.path)
      await writeFileAsync(options.path, buffer);
    return buffer;
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<!Buffer>}
   */
  async pdf(options = {}) {
    const scale = options.scale || 1;
    const displayHeaderFooter = !!options.displayHeaderFooter;
    const headerTemplate = options.headerTemplate || '';
    const footerTemplate = options.footerTemplate || '';
    const printBackground = !!options.printBackground;
    const landscape = !!options.landscape;
    const pageRanges = options.pageRanges || '';

    let paperWidth = 8.5;
    let paperHeight = 11;
    if (options.format) {
      const format = Page.PaperFormats[options.format.toLowerCase()];
      assert(format, 'Unknown paper format: ' + options.format);
      paperWidth = format.width;
      paperHeight = format.height;
    } else {
      paperWidth = convertPrintParameterToInches(options.width) || paperWidth;
      paperHeight = convertPrintParameterToInches(options.height) || paperHeight;
    }

    const marginOptions = options.margin || {};
    const marginTop = convertPrintParameterToInches(marginOptions.top) || 0;
    const marginLeft = convertPrintParameterToInches(marginOptions.left) || 0;
    const marginBottom = convertPrintParameterToInches(marginOptions.bottom) || 0;
    const marginRight = convertPrintParameterToInches(marginOptions.right) || 0;
    const preferCSSPageSize = options.preferCSSPageSize || false;

    const result = await this._client.send('Page.printToPDF', {
      landscape: landscape,
      displayHeaderFooter: displayHeaderFooter,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      printBackground: printBackground,
      scale: scale,
      paperWidth: paperWidth,
      paperHeight: paperHeight,
      marginTop: marginTop,
      marginBottom: marginBottom,
      marginLeft: marginLeft,
      marginRight: marginRight,
      pageRanges: pageRanges,
      preferCSSPageSize: preferCSSPageSize
    });
    const buffer = Buffer.from(result.data, 'base64');
    if (options.path)
      await writeFileAsync(options.path, buffer);
    return buffer;
  }

  /**
   * @return {!Promise<string>}
   */
  async title() {
    return this.mainFrame().title();
  }

  /**
   * @param {!{runBeforeUnload: (boolean|undefined)}=} options
   */
  async close(options = {runBeforeUnload: undefined}) {
    assert(!!this._client._connection, 'Protocol error: Connection closed. Most likely the page has been closed.');
    const runBeforeUnload = !!options.runBeforeUnload;
    if (runBeforeUnload) {
      await this._client.send('Page.close');
    } else {
      await this._client._connection.send('Target.closeTarget', { targetId: this._target._targetId });
      await this._target._isClosedPromise;
    }
  }

  /**
   * @return {boolean}
   */
  isClosed() {
    return this._closed;
  }

  /**
   * @return {!Mouse}
   */
  get mouse() {
    return this._mouse;
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   */
  click(selector, options = {}) {
    return this.mainFrame().click(selector, options);
  }

  /**
   * @param {string} selector
   */
  focus(selector) {
    return this.mainFrame().focus(selector);
  }

  /**
   * @param {string} selector
   */
  hover(selector) {
    return this.mainFrame().hover(selector);
  }

  /**
   * @param {string} selector
   * @param {!Array<string>} values
   * @return {!Promise<!Array<string>>}
   */
  select(selector, ...values) {
    return this.mainFrame().select(selector, ...values);
  }

  /**
   * @param {string} selector
   */
  tap(selector) {
    return this.mainFrame().tap(selector);
  }

  /**
   * @param {string} selector
   * @param {string} text
   * @param {{delay: (number|undefined)}=} options
   */
  type(selector, text, options) {
    return this.mainFrame().type(selector, text, options);
  }

  /**
   * @param {(string|number|Function)} selectorOrFunctionOrTimeout
   * @param {!Object=} options
   * @param {!Array<*>} args
   * @return {!Promise}
   */
  waitFor(selectorOrFunctionOrTimeout, options = {}, ...args) {
    return this.mainFrame().waitFor(selectorOrFunctionOrTimeout, options, ...args);
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForSelector(selector, options = {}) {
    return this.mainFrame().waitForSelector(selector, options);
  }

  /**
   * @param {string} xpath
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForXPath(xpath, options = {}) {
    return this.mainFrame().waitForXPath(xpath, options);
  }

  /**
   * @param {function()} pageFunction
   * @param {!Object=} options
   * @param {!Array<*>} args
   * @return {!Promise}
   */
  waitForFunction(pageFunction, options = {}, ...args) {
    return this.mainFrame().waitForFunction(pageFunction, options, ...args);
  }
}

/** @type {!Set<string>} */
const supportedMetrics = new Set([
  'Timestamp',
  'Documents',
  'Frames',
  'JSEventListeners',
  'Nodes',
  'LayoutCount',
  'RecalcStyleCount',
  'LayoutDuration',
  'RecalcStyleDuration',
  'ScriptDuration',
  'TaskDuration',
  'JSHeapUsedSize',
  'JSHeapTotalSize',
]);

/** @enum {string} */
Page.PaperFormats = {
  letter: {width: 8.5, height: 11},
  legal: {width: 8.5, height: 14},
  tabloid: {width: 11, height: 17},
  ledger: {width: 17, height: 11},
  a0: {width: 33.1, height: 46.8 },
  a1: {width: 23.4, height: 33.1 },
  a2: {width: 16.5, height: 23.4 },
  a3: {width: 11.7, height: 16.5 },
  a4: {width: 8.27, height: 11.7 },
  a5: {width: 5.83, height: 8.27 },
  a6: {width: 4.13, height: 5.83 },
};

const unitToPixels = {
  'px': 1,
  'in': 96,
  'cm': 37.8,
  'mm': 3.78
};

/**
 * @param {(string|number|undefined)} parameter
 * @return {(number|undefined)}
 */
function convertPrintParameterToInches(parameter) {
  if (typeof parameter === 'undefined')
    return undefined;
  let pixels;
  if (helper.isNumber(parameter)) {
    // Treat numbers as pixel values to be aligned with phantom's paperSize.
    pixels = /** @type {number} */ (parameter);
  } else if (helper.isString(parameter)) {
    const text = /** @type {string} */ (parameter);
    let unit = text.substring(text.length - 2).toLowerCase();
    let valueText = '';
    if (unitToPixels.hasOwnProperty(unit)) {
      valueText = text.substring(0, text.length - 2);
    } else {
      // In case of unknown unit try to parse the whole parameter as number of pixels.
      // This is consistent with phantom's paperSize behavior.
      unit = 'px';
      valueText = text;
    }
    const value = Number(valueText);
    assert(!isNaN(value), 'Failed to parse parameter value: ' + text);
    pixels = value * unitToPixels[unit];
  } else {
    throw new Error('page.pdf() Cannot handle parameter type: ' + (typeof parameter));
  }
  return pixels / 96;
}

Page.Events = {
  Close: 'close',
  Console: 'console',
  Dialog: 'dialog',
  DOMContentLoaded: 'domcontentloaded',
  Error: 'error',
  // Can't use just 'error' due to node.js special treatment of error events.
  // @see https://nodejs.org/api/events.html#events_error_events
  PageError: 'pageerror',
  Request: 'request',
  Response: 'response',
  RequestFailed: 'requestfailed',
  RequestFinished: 'requestfinished',
  FrameAttached: 'frameattached',
  FrameDetached: 'framedetached',
  FrameNavigated: 'framenavigated',
  Load: 'load',
  Metrics: 'metrics',
  WorkerCreated: 'workercreated',
  WorkerDestroyed: 'workerdestroyed',
};


/**
 * @typedef {Object} Network.Cookie
 * @property {string} name
 * @property {string} value
 * @property {string} domain
 * @property {string} path
 * @property {number} expires
 * @property {number} size
 * @property {boolean} httpOnly
 * @property {boolean} secure
 * @property {boolean} session
 * @property {("Strict"|"Lax")=} sameSite
 */


/**
 * @typedef {Object} Network.CookieParam
 * @property {string} name
 * @property {string} value
 * @property {string=} url
 * @property {string=} domain
 * @property {string=} path
 * @property {number=} expires
 * @property {boolean=} httpOnly
 * @property {boolean=} secure
 * @property {("Strict"|"Lax")=} sameSite
 */

class ConsoleMessage {
  /**
   * @param {string} type
   * @param {string} text
   * @param {!Array<!Puppeteer.JSHandle>} args
   */
  constructor(type, text, args = []) {
    this._type = type;
    this._text = text;
    this._args = args;
  }

  /**
   * @return {string}
   */
  type() {
    return this._type;
  }

  /**
   * @return {string}
   */
  text() {
    return this._text;
  }

  /**
   * @return {!Array<!Puppeteer.JSHandle>}
   */
  args() {
    return this._args;
  }
}


module.exports = {Page};
helper.tracePublicAPI(Page);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Pipe.js":
/*!*************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Pipe.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {helper} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");

class Pipe extends EventEmitter {
  /**
   * @param {!NodeJS.WritableStream} pipeWrite
   * @param {!NodeJS.ReadableStream} pipeRead
   */
  constructor(pipeWrite, pipeRead) {
    super();
    this._pipeWrite = pipeWrite;
    this._pendingMessage = '';
    this._eventListeners = [
      helper.addEventListener(pipeRead, 'data', buffer => this._dispatch(buffer))
    ];
  }

  /**
   * @param {string} message
   */
  send(message) {
    this._pipeWrite.write(message);
    this._pipeWrite.write('\0');
  }

  /**
   * @param {!Buffer} buffer
   */
  _dispatch(buffer) {
    let end = buffer.indexOf('\0');
    if (end === -1) {
      this._pendingMessage += buffer.toString();
      return;
    }
    const message = this._pendingMessage + buffer.toString(undefined, 0, end);
    this.emit('message', message);

    let start = end + 1;
    end = buffer.indexOf('\0', start);
    while (end !== -1) {
      this.emit('message', buffer.toString(undefined, start, end));
      start = end + 1;
      end = buffer.indexOf('\0', start);
    }
    this._pendingMessage = buffer.toString(undefined, start);
  }

  close() {
    this._pipeWrite = null;
    helper.removeEventListeners(this._eventListeners);
  }
}

module.exports = Pipe;


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Target.js":
/*!***************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Target.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {Page} = __webpack_require__(/*! ./Page */ "./node_modules/puppeteer-core/lib/Page.js");
const {helper} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");

class Target {
  /**
   * @param {!Protocol.Target.TargetInfo} targetInfo
   * @param {!Puppeteer.BrowserContext} browserContext
   * @param {!function():!Promise<!Puppeteer.CDPSession>} sessionFactory
   * @param {boolean} ignoreHTTPSErrors
   * @param {?Puppeteer.Viewport} defaultViewport
   * @param {!Puppeteer.TaskQueue} screenshotTaskQueue
   */
  constructor(targetInfo, browserContext, sessionFactory, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue) {
    this._targetInfo = targetInfo;
    this._browserContext = browserContext;
    this._targetId = targetInfo.targetId;
    this._sessionFactory = sessionFactory;
    this._ignoreHTTPSErrors = ignoreHTTPSErrors;
    this._defaultViewport = defaultViewport;
    this._screenshotTaskQueue = screenshotTaskQueue;
    /** @type {?Promise<!Puppeteer.Page>} */
    this._pagePromise = null;
    this._initializedPromise = new Promise(fulfill => this._initializedCallback = fulfill);
    this._isClosedPromise = new Promise(fulfill => this._closedCallback = fulfill);
    this._isInitialized = this._targetInfo.type !== 'page' || this._targetInfo.url !== '';
    if (this._isInitialized)
      this._initializedCallback(true);
  }

  /**
   * @return {!Promise<!Puppeteer.CDPSession>}
   */
  createCDPSession() {
    return this._sessionFactory();
  }

  /**
   * @return {!Promise<?Page>}
   */
  async page() {
    if ((this._targetInfo.type === 'page' || this._targetInfo.type === 'background_page') && !this._pagePromise) {
      this._pagePromise = this._sessionFactory()
          .then(client => Page.create(client, this, this._ignoreHTTPSErrors, this._defaultViewport, this._screenshotTaskQueue));
    }
    return this._pagePromise;
  }

  /**
   * @return {string}
   */
  url() {
    return this._targetInfo.url;
  }

  /**
   * @return {"page"|"background_page"|"service_worker"|"other"|"browser"}
   */
  type() {
    const type = this._targetInfo.type;
    if (type === 'page' || type === 'background_page' || type === 'service_worker' || type === 'browser')
      return type;
    return 'other';
  }

  /**
   * @return {!Puppeteer.Browser}
   */
  browser() {
    return this._browserContext.browser();
  }

  /**
   * @return {!Puppeteer.BrowserContext}
   */
  browserContext() {
    return this._browserContext;
  }

  /**
   * @return {Puppeteer.Target}
   */
  opener() {
    const { openerId } = this._targetInfo;
    if (!openerId)
      return null;
    return this.browser()._targets.get(openerId);
  }

  /**
   * @param {!Protocol.Target.TargetInfo} targetInfo
   */
  _targetInfoChanged(targetInfo) {
    this._targetInfo = targetInfo;

    if (!this._isInitialized && (this._targetInfo.type !== 'page' || this._targetInfo.url !== '')) {
      this._isInitialized = true;
      this._initializedCallback(true);
      return;
    }
  }
}

helper.tracePublicAPI(Target);

module.exports = {Target};


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/TaskQueue.js":
/*!******************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/TaskQueue.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class TaskQueue {
  constructor() {
    this._chain = Promise.resolve();
  }

  /**
   * @param {function()} task
   * @return {!Promise}
   */
  postTask(task) {
    const result = this._chain.then(task);
    this._chain = result.catch(() => {});
    return result;
  }
}

module.exports = {TaskQueue};

/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Tracing.js":
/*!****************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Tracing.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {helper, assert} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const fs = __webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js");

const openAsync = helper.promisify(fs.open);
const writeAsync = helper.promisify(fs.write);
const closeAsync = helper.promisify(fs.close);

class Tracing {
  /**
   * @param {!Puppeteer.CDPSession} client
   */
  constructor(client) {
    this._client = client;
    this._recording = false;
    this._path = '';
  }

  /**
   * @param {!Object} options
   */
  async start(options) {
    assert(!this._recording, 'Cannot start recording trace while already recording trace.');

    const defaultCategories = [
      '-*', 'devtools.timeline', 'v8.execute', 'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.frame', 'toplevel',
      'blink.console', 'blink.user_timing', 'latencyInfo', 'disabled-by-default-devtools.timeline.stack',
      'disabled-by-default-v8.cpu_profiler', 'disabled-by-default-v8.cpu_profiler.hires'
    ];
    const categoriesArray = options.categories || defaultCategories;

    if (options.screenshots)
      categoriesArray.push('disabled-by-default-devtools.screenshot');

    this._path = options.path;
    this._recording = true;
    await this._client.send('Tracing.start', {
      transferMode: 'ReturnAsStream',
      categories: categoriesArray.join(',')
    });
  }

  async stop() {
    let fulfill;
    const contentPromise = new Promise(x => fulfill = x);
    this._client.once('Tracing.tracingComplete', event => {
      this._readStream(event.stream, this._path).then(fulfill);
    });
    await this._client.send('Tracing.end');
    this._recording = false;
    return contentPromise;
  }

  /**
   * @param {string} handle
   * @param {string} path
   */
  async _readStream(handle, path) {
    let eof = false;
    let file;
    if (path)
      file = await openAsync(path, 'w');
    const bufs = [];
    while (!eof) {
      const response = await this._client.send('IO.read', {handle});
      eof = response.eof;
      bufs.push(Buffer.from(response.data));
      if (path)
        await writeAsync(file, response.data);
    }
    if (path)
      await closeAsync(file);
    await this._client.send('IO.close', {handle});
    let resultBuffer = null;
    try {
      resultBuffer = Buffer.concat(bufs);
    } finally {
      return resultBuffer;
    }
  }
}
helper.tracePublicAPI(Tracing);

module.exports = Tracing;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/puppeteer-core/lib/USKeyboardLayout.js":
/*!*************************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/USKeyboardLayout.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @typedef {Object} KeyDefinition
 * @property {number=} keyCode
 * @property {number=} shiftKeyCode
 * @property {string=} key
 * @property {string=} shiftKey
 * @property {string=} code
 * @property {string=} text
 * @property {string=} shiftText
 * @property {number=} location
 */

/**
 * @type {Object<string, KeyDefinition>}
 */
module.exports = {
  '0': {'keyCode': 48, 'key': '0', 'code': 'Digit0'},
  '1': {'keyCode': 49, 'key': '1', 'code': 'Digit1'},
  '2': {'keyCode': 50, 'key': '2', 'code': 'Digit2'},
  '3': {'keyCode': 51, 'key': '3', 'code': 'Digit3'},
  '4': {'keyCode': 52, 'key': '4', 'code': 'Digit4'},
  '5': {'keyCode': 53, 'key': '5', 'code': 'Digit5'},
  '6': {'keyCode': 54, 'key': '6', 'code': 'Digit6'},
  '7': {'keyCode': 55, 'key': '7', 'code': 'Digit7'},
  '8': {'keyCode': 56, 'key': '8', 'code': 'Digit8'},
  '9': {'keyCode': 57, 'key': '9', 'code': 'Digit9'},
  'Power': {'key': 'Power', 'code': 'Power'},
  'Eject': {'key': 'Eject', 'code': 'Eject'},
  'Abort': {'keyCode': 3, 'code': 'Abort', 'key': 'Cancel'},
  'Help': {'keyCode': 6, 'code': 'Help', 'key': 'Help'},
  'Backspace': {'keyCode': 8, 'code': 'Backspace', 'key': 'Backspace'},
  'Tab': {'keyCode': 9, 'code': 'Tab', 'key': 'Tab'},
  'Numpad5': {'keyCode': 12, 'shiftKeyCode': 101, 'key': 'Clear', 'code': 'Numpad5', 'shiftKey': '5', 'location': 3},
  'NumpadEnter': {'keyCode': 13, 'code': 'NumpadEnter', 'key': 'Enter', 'text': '\r', 'location': 3},
  'Enter': {'keyCode': 13, 'code': 'Enter', 'key': 'Enter', 'text': '\r'},
  '\r': {'keyCode': 13, 'code': 'Enter', 'key': 'Enter', 'text': '\r'},
  '\n': {'keyCode': 13, 'code': 'Enter', 'key': 'Enter', 'text': '\r'},
  'ShiftLeft': {'keyCode': 16, 'code': 'ShiftLeft', 'key': 'Shift', 'location': 1},
  'ShiftRight': {'keyCode': 16, 'code': 'ShiftRight', 'key': 'Shift', 'location': 2},
  'ControlLeft': {'keyCode': 17, 'code': 'ControlLeft', 'key': 'Control', 'location': 1},
  'ControlRight': {'keyCode': 17, 'code': 'ControlRight', 'key': 'Control', 'location': 2},
  'AltLeft': {'keyCode': 18, 'code': 'AltLeft', 'key': 'Alt', 'location': 1},
  'AltRight': {'keyCode': 18, 'code': 'AltRight', 'key': 'Alt', 'location': 2},
  'Pause': {'keyCode': 19, 'code': 'Pause', 'key': 'Pause'},
  'CapsLock': {'keyCode': 20, 'code': 'CapsLock', 'key': 'CapsLock'},
  'Escape': {'keyCode': 27, 'code': 'Escape', 'key': 'Escape'},
  'Convert': {'keyCode': 28, 'code': 'Convert', 'key': 'Convert'},
  'NonConvert': {'keyCode': 29, 'code': 'NonConvert', 'key': 'NonConvert'},
  'Space': {'keyCode': 32, 'code': 'Space', 'key': ' '},
  'Numpad9': {'keyCode': 33, 'shiftKeyCode': 105, 'key': 'PageUp', 'code': 'Numpad9', 'shiftKey': '9', 'location': 3},
  'PageUp': {'keyCode': 33, 'code': 'PageUp', 'key': 'PageUp'},
  'Numpad3': {'keyCode': 34, 'shiftKeyCode': 99, 'key': 'PageDown', 'code': 'Numpad3', 'shiftKey': '3', 'location': 3},
  'PageDown': {'keyCode': 34, 'code': 'PageDown', 'key': 'PageDown'},
  'End': {'keyCode': 35, 'code': 'End', 'key': 'End'},
  'Numpad1': {'keyCode': 35, 'shiftKeyCode': 97, 'key': 'End', 'code': 'Numpad1', 'shiftKey': '1', 'location': 3},
  'Home': {'keyCode': 36, 'code': 'Home', 'key': 'Home'},
  'Numpad7': {'keyCode': 36, 'shiftKeyCode': 103, 'key': 'Home', 'code': 'Numpad7', 'shiftKey': '7', 'location': 3},
  'ArrowLeft': {'keyCode': 37, 'code': 'ArrowLeft', 'key': 'ArrowLeft'},
  'Numpad4': {'keyCode': 37, 'shiftKeyCode': 100, 'key': 'ArrowLeft', 'code': 'Numpad4', 'shiftKey': '4', 'location': 3},
  'Numpad8': {'keyCode': 38, 'shiftKeyCode': 104, 'key': 'ArrowUp', 'code': 'Numpad8', 'shiftKey': '8', 'location': 3},
  'ArrowUp': {'keyCode': 38, 'code': 'ArrowUp', 'key': 'ArrowUp'},
  'ArrowRight': {'keyCode': 39, 'code': 'ArrowRight', 'key': 'ArrowRight'},
  'Numpad6': {'keyCode': 39, 'shiftKeyCode': 102, 'key': 'ArrowRight', 'code': 'Numpad6', 'shiftKey': '6', 'location': 3},
  'Numpad2': {'keyCode': 40, 'shiftKeyCode': 98, 'key': 'ArrowDown', 'code': 'Numpad2', 'shiftKey': '2', 'location': 3},
  'ArrowDown': {'keyCode': 40, 'code': 'ArrowDown', 'key': 'ArrowDown'},
  'Select': {'keyCode': 41, 'code': 'Select', 'key': 'Select'},
  'Open': {'keyCode': 43, 'code': 'Open', 'key': 'Execute'},
  'PrintScreen': {'keyCode': 44, 'code': 'PrintScreen', 'key': 'PrintScreen'},
  'Insert': {'keyCode': 45, 'code': 'Insert', 'key': 'Insert'},
  'Numpad0': {'keyCode': 45, 'shiftKeyCode': 96, 'key': 'Insert', 'code': 'Numpad0', 'shiftKey': '0', 'location': 3},
  'Delete': {'keyCode': 46, 'code': 'Delete', 'key': 'Delete'},
  'NumpadDecimal': {'keyCode': 46, 'shiftKeyCode': 110, 'code': 'NumpadDecimal', 'key': '\u0000', 'shiftKey': '.', 'location': 3},
  'Digit0': {'keyCode': 48, 'code': 'Digit0', 'shiftKey': ')', 'key': '0'},
  'Digit1': {'keyCode': 49, 'code': 'Digit1', 'shiftKey': '!', 'key': '1'},
  'Digit2': {'keyCode': 50, 'code': 'Digit2', 'shiftKey': '@', 'key': '2'},
  'Digit3': {'keyCode': 51, 'code': 'Digit3', 'shiftKey': '#', 'key': '3'},
  'Digit4': {'keyCode': 52, 'code': 'Digit4', 'shiftKey': '$', 'key': '4'},
  'Digit5': {'keyCode': 53, 'code': 'Digit5', 'shiftKey': '%', 'key': '5'},
  'Digit6': {'keyCode': 54, 'code': 'Digit6', 'shiftKey': '^', 'key': '6'},
  'Digit7': {'keyCode': 55, 'code': 'Digit7', 'shiftKey': '&', 'key': '7'},
  'Digit8': {'keyCode': 56, 'code': 'Digit8', 'shiftKey': '*', 'key': '8'},
  'Digit9': {'keyCode': 57, 'code': 'Digit9', 'shiftKey': '\(', 'key': '9'},
  'KeyA': {'keyCode': 65, 'code': 'KeyA', 'shiftKey': 'A', 'key': 'a'},
  'KeyB': {'keyCode': 66, 'code': 'KeyB', 'shiftKey': 'B', 'key': 'b'},
  'KeyC': {'keyCode': 67, 'code': 'KeyC', 'shiftKey': 'C', 'key': 'c'},
  'KeyD': {'keyCode': 68, 'code': 'KeyD', 'shiftKey': 'D', 'key': 'd'},
  'KeyE': {'keyCode': 69, 'code': 'KeyE', 'shiftKey': 'E', 'key': 'e'},
  'KeyF': {'keyCode': 70, 'code': 'KeyF', 'shiftKey': 'F', 'key': 'f'},
  'KeyG': {'keyCode': 71, 'code': 'KeyG', 'shiftKey': 'G', 'key': 'g'},
  'KeyH': {'keyCode': 72, 'code': 'KeyH', 'shiftKey': 'H', 'key': 'h'},
  'KeyI': {'keyCode': 73, 'code': 'KeyI', 'shiftKey': 'I', 'key': 'i'},
  'KeyJ': {'keyCode': 74, 'code': 'KeyJ', 'shiftKey': 'J', 'key': 'j'},
  'KeyK': {'keyCode': 75, 'code': 'KeyK', 'shiftKey': 'K', 'key': 'k'},
  'KeyL': {'keyCode': 76, 'code': 'KeyL', 'shiftKey': 'L', 'key': 'l'},
  'KeyM': {'keyCode': 77, 'code': 'KeyM', 'shiftKey': 'M', 'key': 'm'},
  'KeyN': {'keyCode': 78, 'code': 'KeyN', 'shiftKey': 'N', 'key': 'n'},
  'KeyO': {'keyCode': 79, 'code': 'KeyO', 'shiftKey': 'O', 'key': 'o'},
  'KeyP': {'keyCode': 80, 'code': 'KeyP', 'shiftKey': 'P', 'key': 'p'},
  'KeyQ': {'keyCode': 81, 'code': 'KeyQ', 'shiftKey': 'Q', 'key': 'q'},
  'KeyR': {'keyCode': 82, 'code': 'KeyR', 'shiftKey': 'R', 'key': 'r'},
  'KeyS': {'keyCode': 83, 'code': 'KeyS', 'shiftKey': 'S', 'key': 's'},
  'KeyT': {'keyCode': 84, 'code': 'KeyT', 'shiftKey': 'T', 'key': 't'},
  'KeyU': {'keyCode': 85, 'code': 'KeyU', 'shiftKey': 'U', 'key': 'u'},
  'KeyV': {'keyCode': 86, 'code': 'KeyV', 'shiftKey': 'V', 'key': 'v'},
  'KeyW': {'keyCode': 87, 'code': 'KeyW', 'shiftKey': 'W', 'key': 'w'},
  'KeyX': {'keyCode': 88, 'code': 'KeyX', 'shiftKey': 'X', 'key': 'x'},
  'KeyY': {'keyCode': 89, 'code': 'KeyY', 'shiftKey': 'Y', 'key': 'y'},
  'KeyZ': {'keyCode': 90, 'code': 'KeyZ', 'shiftKey': 'Z', 'key': 'z'},
  'MetaLeft': {'keyCode': 91, 'code': 'MetaLeft', 'key': 'Meta'},
  'MetaRight': {'keyCode': 92, 'code': 'MetaRight', 'key': 'Meta'},
  'ContextMenu': {'keyCode': 93, 'code': 'ContextMenu', 'key': 'ContextMenu'},
  'NumpadMultiply': {'keyCode': 106, 'code': 'NumpadMultiply', 'key': '*', 'location': 3},
  'NumpadAdd': {'keyCode': 107, 'code': 'NumpadAdd', 'key': '+', 'location': 3},
  'NumpadSubtract': {'keyCode': 109, 'code': 'NumpadSubtract', 'key': '-', 'location': 3},
  'NumpadDivide': {'keyCode': 111, 'code': 'NumpadDivide', 'key': '/', 'location': 3},
  'F1': {'keyCode': 112, 'code': 'F1', 'key': 'F1'},
  'F2': {'keyCode': 113, 'code': 'F2', 'key': 'F2'},
  'F3': {'keyCode': 114, 'code': 'F3', 'key': 'F3'},
  'F4': {'keyCode': 115, 'code': 'F4', 'key': 'F4'},
  'F5': {'keyCode': 116, 'code': 'F5', 'key': 'F5'},
  'F6': {'keyCode': 117, 'code': 'F6', 'key': 'F6'},
  'F7': {'keyCode': 118, 'code': 'F7', 'key': 'F7'},
  'F8': {'keyCode': 119, 'code': 'F8', 'key': 'F8'},
  'F9': {'keyCode': 120, 'code': 'F9', 'key': 'F9'},
  'F10': {'keyCode': 121, 'code': 'F10', 'key': 'F10'},
  'F11': {'keyCode': 122, 'code': 'F11', 'key': 'F11'},
  'F12': {'keyCode': 123, 'code': 'F12', 'key': 'F12'},
  'F13': {'keyCode': 124, 'code': 'F13', 'key': 'F13'},
  'F14': {'keyCode': 125, 'code': 'F14', 'key': 'F14'},
  'F15': {'keyCode': 126, 'code': 'F15', 'key': 'F15'},
  'F16': {'keyCode': 127, 'code': 'F16', 'key': 'F16'},
  'F17': {'keyCode': 128, 'code': 'F17', 'key': 'F17'},
  'F18': {'keyCode': 129, 'code': 'F18', 'key': 'F18'},
  'F19': {'keyCode': 130, 'code': 'F19', 'key': 'F19'},
  'F20': {'keyCode': 131, 'code': 'F20', 'key': 'F20'},
  'F21': {'keyCode': 132, 'code': 'F21', 'key': 'F21'},
  'F22': {'keyCode': 133, 'code': 'F22', 'key': 'F22'},
  'F23': {'keyCode': 134, 'code': 'F23', 'key': 'F23'},
  'F24': {'keyCode': 135, 'code': 'F24', 'key': 'F24'},
  'NumLock': {'keyCode': 144, 'code': 'NumLock', 'key': 'NumLock'},
  'ScrollLock': {'keyCode': 145, 'code': 'ScrollLock', 'key': 'ScrollLock'},
  'AudioVolumeMute': {'keyCode': 173, 'code': 'AudioVolumeMute', 'key': 'AudioVolumeMute'},
  'AudioVolumeDown': {'keyCode': 174, 'code': 'AudioVolumeDown', 'key': 'AudioVolumeDown'},
  'AudioVolumeUp': {'keyCode': 175, 'code': 'AudioVolumeUp', 'key': 'AudioVolumeUp'},
  'MediaTrackNext': {'keyCode': 176, 'code': 'MediaTrackNext', 'key': 'MediaTrackNext'},
  'MediaTrackPrevious': {'keyCode': 177, 'code': 'MediaTrackPrevious', 'key': 'MediaTrackPrevious'},
  'MediaStop': {'keyCode': 178, 'code': 'MediaStop', 'key': 'MediaStop'},
  'MediaPlayPause': {'keyCode': 179, 'code': 'MediaPlayPause', 'key': 'MediaPlayPause'},
  'Semicolon': {'keyCode': 186, 'code': 'Semicolon', 'shiftKey': ':', 'key': ';'},
  'Equal': {'keyCode': 187, 'code': 'Equal', 'shiftKey': '+', 'key': '='},
  'NumpadEqual': {'keyCode': 187, 'code': 'NumpadEqual', 'key': '=', 'location': 3},
  'Comma': {'keyCode': 188, 'code': 'Comma', 'shiftKey': '\<', 'key': ','},
  'Minus': {'keyCode': 189, 'code': 'Minus', 'shiftKey': '_', 'key': '-'},
  'Period': {'keyCode': 190, 'code': 'Period', 'shiftKey': '>', 'key': '.'},
  'Slash': {'keyCode': 191, 'code': 'Slash', 'shiftKey': '?', 'key': '/'},
  'Backquote': {'keyCode': 192, 'code': 'Backquote', 'shiftKey': '~', 'key': '`'},
  'BracketLeft': {'keyCode': 219, 'code': 'BracketLeft', 'shiftKey': '{', 'key': '['},
  'Backslash': {'keyCode': 220, 'code': 'Backslash', 'shiftKey': '|', 'key': '\\'},
  'BracketRight': {'keyCode': 221, 'code': 'BracketRight', 'shiftKey': '}', 'key': ']'},
  'Quote': {'keyCode': 222, 'code': 'Quote', 'shiftKey': '"', 'key': '\''},
  'AltGraph': {'keyCode': 225, 'code': 'AltGraph', 'key': 'AltGraph'},
  'Props': {'keyCode': 247, 'code': 'Props', 'key': 'CrSel'},
  'Cancel': {'keyCode': 3, 'key': 'Cancel', 'code': 'Abort'},
  'Clear': {'keyCode': 12, 'key': 'Clear', 'code': 'Numpad5', 'location': 3},
  'Shift': {'keyCode': 16, 'key': 'Shift', 'code': 'ShiftLeft'},
  'Control': {'keyCode': 17, 'key': 'Control', 'code': 'ControlLeft'},
  'Alt': {'keyCode': 18, 'key': 'Alt', 'code': 'AltLeft'},
  'Accept': {'keyCode': 30, 'key': 'Accept'},
  'ModeChange': {'keyCode': 31, 'key': 'ModeChange'},
  ' ': {'keyCode': 32, 'key': ' ', 'code': 'Space'},
  'Print': {'keyCode': 42, 'key': 'Print'},
  'Execute': {'keyCode': 43, 'key': 'Execute', 'code': 'Open'},
  '\u0000': {'keyCode': 46, 'key': '\u0000', 'code': 'NumpadDecimal', 'location': 3},
  'a': {'keyCode': 65, 'key': 'a', 'code': 'KeyA'},
  'b': {'keyCode': 66, 'key': 'b', 'code': 'KeyB'},
  'c': {'keyCode': 67, 'key': 'c', 'code': 'KeyC'},
  'd': {'keyCode': 68, 'key': 'd', 'code': 'KeyD'},
  'e': {'keyCode': 69, 'key': 'e', 'code': 'KeyE'},
  'f': {'keyCode': 70, 'key': 'f', 'code': 'KeyF'},
  'g': {'keyCode': 71, 'key': 'g', 'code': 'KeyG'},
  'h': {'keyCode': 72, 'key': 'h', 'code': 'KeyH'},
  'i': {'keyCode': 73, 'key': 'i', 'code': 'KeyI'},
  'j': {'keyCode': 74, 'key': 'j', 'code': 'KeyJ'},
  'k': {'keyCode': 75, 'key': 'k', 'code': 'KeyK'},
  'l': {'keyCode': 76, 'key': 'l', 'code': 'KeyL'},
  'm': {'keyCode': 77, 'key': 'm', 'code': 'KeyM'},
  'n': {'keyCode': 78, 'key': 'n', 'code': 'KeyN'},
  'o': {'keyCode': 79, 'key': 'o', 'code': 'KeyO'},
  'p': {'keyCode': 80, 'key': 'p', 'code': 'KeyP'},
  'q': {'keyCode': 81, 'key': 'q', 'code': 'KeyQ'},
  'r': {'keyCode': 82, 'key': 'r', 'code': 'KeyR'},
  's': {'keyCode': 83, 'key': 's', 'code': 'KeyS'},
  't': {'keyCode': 84, 'key': 't', 'code': 'KeyT'},
  'u': {'keyCode': 85, 'key': 'u', 'code': 'KeyU'},
  'v': {'keyCode': 86, 'key': 'v', 'code': 'KeyV'},
  'w': {'keyCode': 87, 'key': 'w', 'code': 'KeyW'},
  'x': {'keyCode': 88, 'key': 'x', 'code': 'KeyX'},
  'y': {'keyCode': 89, 'key': 'y', 'code': 'KeyY'},
  'z': {'keyCode': 90, 'key': 'z', 'code': 'KeyZ'},
  'Meta': {'keyCode': 91, 'key': 'Meta', 'code': 'MetaLeft'},
  '*': {'keyCode': 106, 'key': '*', 'code': 'NumpadMultiply', 'location': 3},
  '+': {'keyCode': 107, 'key': '+', 'code': 'NumpadAdd', 'location': 3},
  '-': {'keyCode': 109, 'key': '-', 'code': 'NumpadSubtract', 'location': 3},
  '/': {'keyCode': 111, 'key': '/', 'code': 'NumpadDivide', 'location': 3},
  ';': {'keyCode': 186, 'key': ';', 'code': 'Semicolon'},
  '=': {'keyCode': 187, 'key': '=', 'code': 'Equal'},
  ',': {'keyCode': 188, 'key': ',', 'code': 'Comma'},
  '.': {'keyCode': 190, 'key': '.', 'code': 'Period'},
  '`': {'keyCode': 192, 'key': '`', 'code': 'Backquote'},
  '[': {'keyCode': 219, 'key': '[', 'code': 'BracketLeft'},
  '\\': {'keyCode': 220, 'key': '\\', 'code': 'Backslash'},
  ']': {'keyCode': 221, 'key': ']', 'code': 'BracketRight'},
  '\'': {'keyCode': 222, 'key': '\'', 'code': 'Quote'},
  'Attn': {'keyCode': 246, 'key': 'Attn'},
  'CrSel': {'keyCode': 247, 'key': 'CrSel', 'code': 'Props'},
  'ExSel': {'keyCode': 248, 'key': 'ExSel'},
  'EraseEof': {'keyCode': 249, 'key': 'EraseEof'},
  'Play': {'keyCode': 250, 'key': 'Play'},
  'ZoomOut': {'keyCode': 251, 'key': 'ZoomOut'},
  ')': {'keyCode': 48, 'key': ')', 'code': 'Digit0'},
  '!': {'keyCode': 49, 'key': '!', 'code': 'Digit1'},
  '@': {'keyCode': 50, 'key': '@', 'code': 'Digit2'},
  '#': {'keyCode': 51, 'key': '#', 'code': 'Digit3'},
  '$': {'keyCode': 52, 'key': '$', 'code': 'Digit4'},
  '%': {'keyCode': 53, 'key': '%', 'code': 'Digit5'},
  '^': {'keyCode': 54, 'key': '^', 'code': 'Digit6'},
  '&': {'keyCode': 55, 'key': '&', 'code': 'Digit7'},
  '(': {'keyCode': 57, 'key': '\(', 'code': 'Digit9'},
  'A': {'keyCode': 65, 'key': 'A', 'code': 'KeyA'},
  'B': {'keyCode': 66, 'key': 'B', 'code': 'KeyB'},
  'C': {'keyCode': 67, 'key': 'C', 'code': 'KeyC'},
  'D': {'keyCode': 68, 'key': 'D', 'code': 'KeyD'},
  'E': {'keyCode': 69, 'key': 'E', 'code': 'KeyE'},
  'F': {'keyCode': 70, 'key': 'F', 'code': 'KeyF'},
  'G': {'keyCode': 71, 'key': 'G', 'code': 'KeyG'},
  'H': {'keyCode': 72, 'key': 'H', 'code': 'KeyH'},
  'I': {'keyCode': 73, 'key': 'I', 'code': 'KeyI'},
  'J': {'keyCode': 74, 'key': 'J', 'code': 'KeyJ'},
  'K': {'keyCode': 75, 'key': 'K', 'code': 'KeyK'},
  'L': {'keyCode': 76, 'key': 'L', 'code': 'KeyL'},
  'M': {'keyCode': 77, 'key': 'M', 'code': 'KeyM'},
  'N': {'keyCode': 78, 'key': 'N', 'code': 'KeyN'},
  'O': {'keyCode': 79, 'key': 'O', 'code': 'KeyO'},
  'P': {'keyCode': 80, 'key': 'P', 'code': 'KeyP'},
  'Q': {'keyCode': 81, 'key': 'Q', 'code': 'KeyQ'},
  'R': {'keyCode': 82, 'key': 'R', 'code': 'KeyR'},
  'S': {'keyCode': 83, 'key': 'S', 'code': 'KeyS'},
  'T': {'keyCode': 84, 'key': 'T', 'code': 'KeyT'},
  'U': {'keyCode': 85, 'key': 'U', 'code': 'KeyU'},
  'V': {'keyCode': 86, 'key': 'V', 'code': 'KeyV'},
  'W': {'keyCode': 87, 'key': 'W', 'code': 'KeyW'},
  'X': {'keyCode': 88, 'key': 'X', 'code': 'KeyX'},
  'Y': {'keyCode': 89, 'key': 'Y', 'code': 'KeyY'},
  'Z': {'keyCode': 90, 'key': 'Z', 'code': 'KeyZ'},
  ':': {'keyCode': 186, 'key': ':', 'code': 'Semicolon'},
  '<': {'keyCode': 188, 'key': '\<', 'code': 'Comma'},
  '_': {'keyCode': 189, 'key': '_', 'code': 'Minus'},
  '>': {'keyCode': 190, 'key': '>', 'code': 'Period'},
  '?': {'keyCode': 191, 'key': '?', 'code': 'Slash'},
  '~': {'keyCode': 192, 'key': '~', 'code': 'Backquote'},
  '{': {'keyCode': 219, 'key': '{', 'code': 'BracketLeft'},
  '|': {'keyCode': 220, 'key': '|', 'code': 'Backslash'},
  '}': {'keyCode': 221, 'key': '}', 'code': 'BracketRight'},
  '"': {'keyCode': 222, 'key': '"', 'code': 'Quote'}
};

/***/ }),

/***/ "./node_modules/puppeteer-core/lib/Worker.js":
/*!***************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/Worker.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const {helper, debugError} = __webpack_require__(/*! ./helper */ "./node_modules/puppeteer-core/lib/helper.js");
const {ExecutionContext, JSHandle} = __webpack_require__(/*! ./ExecutionContext */ "./node_modules/puppeteer-core/lib/ExecutionContext.js");

class Worker extends EventEmitter {
  /**
   * @param {Puppeteer.CDPSession} client
   * @param {string} url
   * @param {function(!string, !Array<!JSHandle>)} consoleAPICalled
   * @param {function(!Protocol.Runtime.ExceptionDetails)} exceptionThrown
   */
  constructor(client, url, consoleAPICalled, exceptionThrown) {
    super();
    this._client = client;
    this._url = url;
    this._executionContextPromise = new Promise(x => this._executionContextCallback = x);
    /** @type {function(!Protocol.Runtime.RemoteObject):!JSHandle} */
    let jsHandleFactory;
    this._client.once('Runtime.executionContextCreated', async event => {
      jsHandleFactory = remoteObject => new JSHandle(executionContext, client, remoteObject);
      const executionContext = new ExecutionContext(client, event.context, jsHandleFactory, null);
      this._executionContextCallback(executionContext);
    });
    // This might fail if the target is closed before we recieve all execution contexts.
    this._client.send('Runtime.enable', {}).catch(debugError);

    this._client.on('Runtime.consoleAPICalled', event => consoleAPICalled(event.type, event.args.map(jsHandleFactory)));
    this._client.on('Runtime.exceptionThrown', exception => exceptionThrown(exception.exceptionDetails));
  }

  /**
   * @return {string}
   */
  url() {
    return this._url;
  }

  /**
   * @return {!Promise<ExecutionContext>}
   */
  async executionContext() {
    return this._executionContextPromise;
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<*>}
   */
  async evaluate(pageFunction, ...args) {
    return (await this._executionContextPromise).evaluate(pageFunction, ...args);
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<!JSHandle>}
   */
  async evaluateHandle(pageFunction, ...args) {
    return (await this._executionContextPromise).evaluateHandle(pageFunction, ...args);
  }
}

module.exports = {Worker};
helper.tracePublicAPI(Worker);


/***/ }),

/***/ "./node_modules/puppeteer-core/lib/helper.js":
/*!***************************************************!*\
  !*** ./node_modules/puppeteer-core/lib/helper.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = __webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js");
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
const {TimeoutError} = __webpack_require__(/*! ./Errors */ "./node_modules/puppeteer-core/lib/Errors.js");

const debugError = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")(`puppeteer:error`);
/** @type {?Map<string, boolean>} */
let apiCoverage = null;
let projectRoot = null;
class Helper {
  /**
   * @param {Function|string} fun
   * @param {!Array<*>} args
   * @return {string}
   */
  static evaluationString(fun, ...args) {
    if (Helper.isString(fun)) {
      assert(args.length === 0, 'Cannot evaluate a string with arguments');
      return /** @type {string} */ (fun);
    }
    return `(${fun})(${args.map(serializeArgument).join(',')})`;

    /**
     * @param {*} arg
     * @return {string}
     */
    function serializeArgument(arg) {
      if (Object.is(arg, undefined))
        return 'undefined';
      return JSON.stringify(arg);
    }
  }

  /**
   * @return {string}
   */
  static projectRoot() {
    if (!projectRoot) {
      // Project root will be different for node6-transpiled code.
      projectRoot = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
    }
    return projectRoot;
  }

  /**
   * @param {!Protocol.Runtime.ExceptionDetails} exceptionDetails
   * @return {string}
   */
  static getExceptionMessage(exceptionDetails) {
    if (exceptionDetails.exception)
      return exceptionDetails.exception.description || exceptionDetails.exception.value;
    let message = exceptionDetails.text;
    if (exceptionDetails.stackTrace) {
      for (const callframe of exceptionDetails.stackTrace.callFrames) {
        const location = callframe.url + ':' + callframe.lineNumber + ':' + callframe.columnNumber;
        const functionName = callframe.functionName || '<anonymous>';
        message += `\n    at ${functionName} (${location})`;
      }
    }
    return message;
  }

  /**
   * @param {!Protocol.Runtime.RemoteObject} remoteObject
   * @return {*}
   */
  static valueFromRemoteObject(remoteObject) {
    assert(!remoteObject.objectId, 'Cannot extract value when objectId is given');
    if (remoteObject.unserializableValue) {
      switch (remoteObject.unserializableValue) {
        case '-0':
          return -0;
        case 'NaN':
          return NaN;
        case 'Infinity':
          return Infinity;
        case '-Infinity':
          return -Infinity;
        default:
          throw new Error('Unsupported unserializable value: ' + remoteObject.unserializableValue);
      }
    }
    return remoteObject.value;
  }

  /**
   * @param {!Puppeteer.CDPSession} client
   * @param {!Protocol.Runtime.RemoteObject} remoteObject
   */
  static async releaseObject(client, remoteObject) {
    if (!remoteObject.objectId)
      return;
    await client.send('Runtime.releaseObject', {objectId: remoteObject.objectId}).catch(error => {
      // Exceptions might happen in case of a page been navigated or closed.
      // Swallow these since they are harmless and we don't leak anything in this case.
      debugError(error);
    });
  }

  /**
   * @param {!Object} classType
   * @param {string=} publicName
   */
  static tracePublicAPI(classType, publicName) {
    let className = publicName || classType.prototype.constructor.name;
    className = className.substring(0, 1).toLowerCase() + className.substring(1);
    const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")(`puppeteer:${className}`);
    if (!debug.enabled && !apiCoverage)
      return;
    for (const methodName of Reflect.ownKeys(classType.prototype)) {
      const method = Reflect.get(classType.prototype, methodName);
      if (methodName === 'constructor' || typeof methodName !== 'string' || methodName.startsWith('_') || typeof method !== 'function')
        continue;
      if (apiCoverage)
        apiCoverage.set(`${className}.${methodName}`, false);
      Reflect.set(classType.prototype, methodName, function(...args) {
        const argsText = args.map(stringifyArgument).join(', ');
        const callsite = `${className}.${methodName}(${argsText})`;
        if (debug.enabled)
          debug(callsite);
        if (apiCoverage)
          apiCoverage.set(`${className}.${methodName}`, true);
        return method.call(this, ...args);
      });
    }

    if (classType.Events) {
      if (apiCoverage) {
        for (const event of Object.values(classType.Events))
          apiCoverage.set(`${className}.emit(${JSON.stringify(event)})`, false);
      }
      const method = Reflect.get(classType.prototype, 'emit');
      Reflect.set(classType.prototype, 'emit', function(event, ...args) {
        const argsText = [JSON.stringify(event)].concat(args.map(stringifyArgument)).join(', ');
        if (debug.enabled && this.listenerCount(event))
          debug(`${className}.emit(${argsText})`);
        if (apiCoverage && this.listenerCount(event))
          apiCoverage.set(`${className}.emit(${JSON.stringify(event)})`, true);
        return method.call(this, event, ...args);
      });
    }

    /**
     * @param {!Object} arg
     * @return {string}
     */
    function stringifyArgument(arg) {
      if (Helper.isString(arg) || Helper.isNumber(arg) || !arg)
        return JSON.stringify(arg);
      if (typeof arg === 'function') {
        let text = arg.toString().split('\n').map(line => line.trim()).join('');
        if (text.length > 20)
          text = text.substring(0, 20) + '…';
        return `"${text}"`;
      }
      const state = {};
      const keys = Object.keys(arg);
      for (const key of keys) {
        const value = arg[key];
        if (Helper.isString(value) || Helper.isNumber(value))
          state[key] = JSON.stringify(value);
      }
      const name = arg.constructor.name === 'Object' ? '' : arg.constructor.name;
      return name + JSON.stringify(state);
    }
  }

  /**
   * @param {!NodeJS.EventEmitter} emitter
   * @param {string} eventName
   * @param {function(?)} handler
   * @return {{emitter: !NodeJS.EventEmitter, eventName: string, handler: function(?)}}
   */
  static addEventListener(emitter, eventName, handler) {
    emitter.on(eventName, handler);
    return { emitter, eventName, handler };
  }

  /**
   * @param {!Array<{emitter: !NodeJS.EventEmitter, eventName: string, handler: function(?)}>} listeners
   */
  static removeEventListeners(listeners) {
    for (const listener of listeners)
      listener.emitter.removeListener(listener.eventName, listener.handler);
    listeners.splice(0, listeners.length);
  }

  /**
   * @return {?Map<string, boolean>}
   */
  static publicAPICoverage() {
    return apiCoverage;
  }

  static recordPublicAPICoverage() {
    apiCoverage = new Map();
  }

  /**
   * @param {!Object} obj
   * @return {boolean}
   */
  static isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
  }

  /**
   * @param {!Object} obj
   * @return {boolean}
   */
  static isNumber(obj) {
    return typeof obj === 'number' || obj instanceof Number;
  }

  static promisify(nodeFunction) {
    function promisified(...args) {
      return new Promise((resolve, reject) => {
        function callback(err, ...result) {
          if (err)
            return reject(err);
          if (result.length === 1)
            return resolve(result[0]);
          return resolve(result);
        }
        nodeFunction.call(null, ...args, callback);
      });
    }
    return promisified;
  }

  /**
   * @param {!NodeJS.EventEmitter} emitter
   * @param {string} eventName
   * @param {function} predicate
   * @return {!Promise}
   */
  static waitForEvent(emitter, eventName, predicate, timeout) {
    let eventTimeout, resolveCallback, rejectCallback;
    const promise = new Promise((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
    });
    const listener = Helper.addEventListener(emitter, eventName, event => {
      if (!predicate(event))
        return;
      cleanup();
      resolveCallback(event);
    });
    if (timeout) {
      eventTimeout = setTimeout(() => {
        cleanup();
        rejectCallback(new TimeoutError('Timeout exceeded while waiting for event'));
      }, timeout);
    }
    function cleanup() {
      Helper.removeEventListeners([listener]);
      clearTimeout(eventTimeout);
    }
    return promise;
  }
}

/**
 * @param {*} value
 * @param {string=} message
 */
function assert(value, message) {
  if (!value)
    throw new Error(message);
}

module.exports = {
  helper: Helper,
  assert,
  debugError
};

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "mime":
/*!***********************!*\
  !*** external "mime" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = mime;

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ws;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L0V4dGVuc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvTGF1bmNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L1B1cHBldGVlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvZGVidWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL0Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9Db25uZWN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvQ292ZXJhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9EaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9FbGVtZW50SGFuZGxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvRW11bGF0aW9uTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL0Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL0V4ZWN1dGlvbkNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9GcmFtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9JbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL011bHRpbWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvTmF2aWdhdG9yV2F0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL05ldHdvcmtNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL1BpcGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9UYXJnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9UYXNrUXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9UcmFjaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvVVNLZXlib2FyZExheW91dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL1dvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1pbWVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ3c1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZzQztBQUV4QixNQUFPLFNBQVUsU0FBUSxtREFBWTtJQUNqRCxZQUNVLFFBQW1DLEVBQ25DLFNBQXFCO1FBRTdCLEtBQUssRUFBRSxDQUFDO1FBSEEsYUFBUSxHQUFSLFFBQVEsQ0FBMkI7UUFDbkMsY0FBUyxHQUFULFNBQVMsQ0FBWTtJQUcvQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYTtRQUMvQixJ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QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLFVBQVU7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsbURBQW1EO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxpQkFBaUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEM7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsT0FBTztBQUM5RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVELE9BQU87QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixZQUFZO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzV2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxTQUFTO0FBQ3RCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBLGFBQWEsOEJBQThCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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TDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7Ozs7OztBQ3ZMdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sT0FBTztBQUNkO0FBQ0EsT0FBTyxVQUFVOztBQUVqQjtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxlQUFlO0FBQzVCLGFBQWEsUUFBUTtBQUNyQixhQUFhLG9CQUFvQjtBQUNqQyxhQUFhLHdCQUF3QjtBQUNyQyxhQUFhLHNCQUFzQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7O0FBRUEsZUFBZSxvQkFBb0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxXQUFXLGlCQUFpQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0EsaUVBQWlFLHlDQUF5QztBQUMxRztBQUNBOztBQUVBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxlQUFlO0FBQzVCLGFBQWEsUUFBUTtBQUNyQixhQUFhLG9CQUFvQjtBQUNqQyxhQUFhLHdCQUF3QjtBQUNyQyxhQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGVBQWU7QUFDdkU7QUFDQTs7QUFFQTtBQUNBLGFBQWEsc0NBQXNDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFdBQVcsaUJBQWlCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyxrQkFBa0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsMENBQTBDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBLFdBQVcsU0FBUyx1REFBdUQsNkRBQTZEO0FBQ3hJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsZ0JBQWdCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUMxU2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZUFBZTtBQUN0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDJCQUEyQjtBQUNoRTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYSx1QkFBdUI7QUFDcEMsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLCtCQUErQjtBQUM1QyxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYyxtRUFBbUUsRUFBRTtBQUNsRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsMEJBQTBCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLG9DQUFvQyxtQkFBbUI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDRDQUE0QztBQUMzRSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLFdBQVc7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQSxzRUFBc0UsZ0JBQWdCO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDJCQUEyQjtBQUN4QyxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFdBQVcsVUFBVSw2Q0FBNkMsOEJBQThCO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsd0JBQXdCO0FBQ3JDLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWMsbUVBQW1FLEVBQUU7QUFDbEc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDBCQUEwQjtBQUN6QztBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSx5REFBeUQsT0FBTyxxQ0FBcUMsaUJBQWlCO0FBQ3RIO0FBQ0Esb0NBQW9DLG1CQUFtQjtBQUN2RDtBQUNBLHlEQUF5RCxvQ0FBb0M7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLDRDQUE0QztBQUMzRSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZEQUE2RCwyQkFBMkI7QUFDeEY7O0FBRUE7QUFDQTtBQUNBLHNFQUFzRSxnQkFBZ0I7QUFDdEY7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixZQUFZLFFBQVEsNkJBQTZCO0FBQ2pELFlBQVk7QUFDWjtBQUNBO0FBQ0EsbUNBQW1DLE9BQU8sS0FBSyxxQkFBcUI7QUFDcEU7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUMxUmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLDJCQUEyQjs7QUFFbEMsT0FBTyxzQkFBc0I7O0FBRTdCO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxTQUFTLDJCQUEyQixFQUFFO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELGlDQUFpQztBQUMzRjtBQUNBLHNEQUFzRCxXQUFXO0FBQ2pFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx1Q0FBdUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLHlCQUF5QjtBQUNyRztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLHFDQUFxQztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxrQ0FBa0M7QUFDM0c7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrQkFBa0I7QUFDdkM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxTQUFTLG1EQUFtRCxFQUFFO0FBQ3pFLFlBQVksU0FBUyx5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsNENBQTRDO0FBQzdELGlCQUFpQiwwQ0FBMEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHFDQUFxQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyxlQUFlOztBQUV0QjtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLG1CQUFtQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCOzs7Ozs7Ozs7Ozs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLFNBQVM7QUFDaEIsT0FBTywyQkFBMkI7O0FBRWxDO0FBQ0E7QUFDQSxhQUFhLDRCQUE0QjtBQUN6QyxhQUFhLHNCQUFzQjtBQUNuQyxhQUFhLCtCQUErQjtBQUM1QyxhQUFhLGdCQUFnQjtBQUM3QixhQUFhLHdCQUF3QjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHVEQUF1RDtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQSxnQ0FBZ0MsdURBQXVEO0FBQ3ZGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsV0FBVyxxQkFBcUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLGVBQWU7QUFDNUIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEI7QUFDQTs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBOztBQUVBO0FBQ0EsYUFBYSxlQUFlO0FBQzVCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxrQkFBa0I7QUFDekU7O0FBRUE7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjLDBCQUEwQixFQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLFdBQVcsb0RBQW9EO0FBQzdFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVcsZ0RBQWdEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGVBQWU7QUFDZjtBQUNBLCtCQUErQjtBQUMvQjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7O0FBRW5EO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxXQUFXLGtCQUFrQixlQUFlLEVBQUU7O0FBRTlDLGlDQUFpQztBQUNqQztBQUNBOztBQUVBLGtFQUFrRTtBQUNsRTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsU0FBUztBQUNuRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLGdCQUFnQjtBQUM3QixhQUFhLFVBQVU7QUFDdkIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjs7Ozs7Ozs7Ozs7O0FDeFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxvQkFBb0I7QUFDakMsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BELHNEQUFzRCxzQ0FBc0MsSUFBSTtBQUNoRzs7QUFFQTtBQUNBLCtEQUErRCw4REFBOEQ7QUFDN0g7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUNyRGxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyxlQUFlOztBQUV0QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxhQUFhLDhDQUE4QztBQUMzRCxhQUFhLG1EQUFtRDtBQUNoRSxhQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSxLQUFLO0FBQ2xCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSxLQUFLO0FBQ2xCLGNBQWM7QUFDZDtBQUNBO0FBQ0Esb0NBQW9DLHNCQUFzQjs7QUFFMUQ7QUFDQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0EsYUFBYSx1Q0FBdUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVcseUNBQXlDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLEVBQUU7QUFDakIsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0IsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSwrQkFBK0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWEsRUFBRTtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCOzs7Ozs7Ozs7Ozs7QUMzUGxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sMkJBQTJCO0FBQ2xDLE9BQU8sY0FBYztBQUNyQixPQUFPLGFBQWE7O0FBRXBCOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxhQUFhLHlCQUF5QjtBQUN0QyxhQUFhLGdCQUFnQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQkFBcUI7QUFDcEM7QUFDQSxlQUFlLGdDQUFnQztBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGFBQWEscUNBQXFDO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEseUJBQXlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGtCQUFrQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0IsYUFBYSwrQkFBK0I7QUFDNUMsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7O0FBRUEsZUFBZSxnQkFBZ0I7QUFDL0I7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1Qjs7QUFFQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGtCQUFrQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0JBQWtCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0IsYUFBYSxVQUFVO0FBQ3ZCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSxVQUFVO0FBQ3ZCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLGdCQUFnQjtBQUM3QixhQUFhLFVBQVU7QUFDdkIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLCtDQUErQyxJQUFJO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLDhDQUE4QyxJQUFJO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxlQUFlO0FBQzNCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxrQkFBa0I7QUFDbEUsaURBQWlELGtCQUFrQjtBQUNuRTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYywwQkFBMEIsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEseUJBQXlCO0FBQ3RDLGFBQWEsU0FBUztBQUN0QixhQUFhLFVBQVU7QUFDdkIsY0FBYztBQUNkO0FBQ0EsbURBQW1EO0FBQ25EOztBQUVBO0FBQ0EsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLHdDQUF3QztBQUN4QztBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsK0JBQStCLElBQUksZ0JBQWdCLEdBQUcscUNBQXFDO0FBQ2hIOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsUUFBUTs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsY0FBYztBQUMzQixhQUFhLE9BQU87QUFDcEIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELE1BQU0sbUJBQW1CLFFBQVE7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7Ozs7Ozs7Ozs7OztBQzcvQmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLGVBQWU7QUFDdEI7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQjs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsYUFBYSxFQUFFO0FBQzdCO0FBQ0EsNkJBQTZCLGtCQUFrQjtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDLFVBQVU7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLGlEQUFpRCxXQUFXO0FBQzVEOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsMEJBQTBCLEVBQUU7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsTUFBTTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLCtCQUErQjtBQUM5QztBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QjtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCwwQkFBMEIsbUNBQW1DO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUU7QUFDZixhQUFhLEVBQUU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUU7QUFDZixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUU7QUFDZixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUU7QUFDZixhQUFhLEVBQUU7QUFDZixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUU7QUFDZixhQUFhLEVBQUU7QUFDZixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxFQUFFO0FBQ2YsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8sZUFBZTtBQUN0QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxhQUFhOztBQUVwQjtBQUNBO0FBQ0EsYUFBYSxjQUFjO0FBQzNCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEI7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDLGVBQWUsZUFBZTtBQUM5QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUN6SWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTywyQkFBMkI7QUFDbEM7O0FBRUE7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGFBQWEsd0JBQXdCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHVCQUF1QjtBQUN0QztBQUNBLGVBQWUseURBQXlEO0FBQ3hFO0FBQ0EsZUFBZSx3QkFBd0I7QUFDdkM7O0FBRUE7O0FBRUEsZUFBZSxFQUFFLG9DQUFvQztBQUNyRDtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxlQUFlLDBCQUEwQjtBQUN6QztBQUNBLGVBQWUsMEJBQTBCO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxFQUFFLG9DQUFvQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx3QkFBd0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxJQUFJLHVCQUF1QixhQUFhO0FBQzFHO0FBQ0E7QUFDQSw0REFBNEQsa0NBQWtDO0FBQzlGOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0EsNkRBQTZELFlBQVk7QUFDekU7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjtBQUNqRDtBQUNBLHFEQUFxRCx1QkFBdUI7QUFDNUUsMkRBQTJELFNBQVM7QUFDcEU7QUFDQTs7QUFFQTtBQUNBLGFBQWEsMkNBQTJDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDRDQUE0QztBQUN6RDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsNENBQTRDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFtQix5QkFBeUI7QUFDekQ7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDJDQUEyQztBQUN4RCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZ0RBQWdEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QixhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsMEJBQTBCO0FBQ3ZDLGFBQWEsUUFBUTtBQUNyQixhQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDBDQUEwQztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx5Q0FBeUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx1Q0FBdUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsMEJBQTBCO0FBQ3ZDLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyxFQUFFO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsRUFBRSw2RUFBNkU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrR0FBa0csT0FBTyxpQ0FBaUMsUUFBUTs7QUFFbEo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLFdBQVcsR0FBRyxXQUFXOztBQUU1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGFBQWEsU0FBUztBQUN0QixhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVywwQkFBMEI7QUFDckMsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjs7Ozs7Ozs7Ozs7OztBQy94QmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGVBQWU7QUFDdEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxPQUFPO0FBQ2QsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sNkJBQTZCO0FBQ3BDO0FBQ0EsT0FBTywyQkFBMkI7QUFDbEMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sT0FBTzs7QUFFZDs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxrQkFBa0I7QUFDL0IsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsb0JBQW9CO0FBQ2pDLGFBQWEscUJBQXFCO0FBQ2xDLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCOztBQUVBO0FBQ0EsMkNBQTJDLGdEQUFnRDtBQUMzRixxREFBcUQsZ0JBQWdCO0FBQ3JFLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEMsdUNBQXVDO0FBQ3ZDLDBDQUEwQztBQUMxQyxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLGtFQUFrRSxlQUFlO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSxrQkFBa0I7QUFDL0IsYUFBYSx5QkFBeUI7QUFDdEMsYUFBYSxRQUFRO0FBQ3JCLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsdUJBQXVCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9CQUFvQjtBQUNuQzs7QUFFQTs7QUFFQSxlQUFlLHFCQUFxQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGdDQUFnQztBQUM3QztBQUNBO0FBQ0EsV0FBVywwQkFBMEI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsMkNBQTJDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0JBQWtCO0FBQy9CLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsb0JBQW9CO0FBQ2pDLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsa0JBQWtCO0FBQy9CLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSxVQUFVO0FBQ3ZCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxlQUFlO0FBQzVCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsMkJBQTJCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDJCQUEyQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFVBQVU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFVBQVU7QUFDMUQ7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EscURBQXFELGlCQUFpQjtBQUN0RTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsS0FBSyxZQUFZLEtBQUs7QUFDcEY7O0FBRUE7QUFDQSxtREFBbUQsV0FBVztBQUM5RCxzRUFBc0UsbUJBQW1CO0FBQ3pGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw2QkFBNkI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLEVBQUUsb0NBQW9DO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx3QkFBd0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLHFDQUFxQztBQUNsRCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxtQ0FBbUM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBLGFBQWEsMENBQTBDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsdUNBQXVDO0FBQ3BEO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBO0FBQ0EsMkNBQTJDLGtEQUFrRDs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLDRCQUE0QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLDhCQUE4QjtBQUM5Qjs7QUFFQSxlQUFlLGdDQUFnQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxzQkFBc0I7QUFDckMsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGNBQWM7QUFDM0UsaURBQWlELG1CQUFtQixNQUFNLElBQUk7QUFDOUUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0JBQWtCO0FBQy9CLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLGtCQUFrQjtBQUMvQixhQUFhLFNBQVM7QUFDdEIsY0FBYztBQUNkO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFNBQVM7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxrQkFBa0I7QUFDdkY7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLGtEQUFrRCxVQUFVO0FBQzVEOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCx1QkFBdUI7QUFDbEY7O0FBRUE7QUFDQSxhQUFhLG9CQUFvQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0JBQWtCO0FBQy9CLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGtCQUFrQjtBQUMvQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0Esc0VBQXNFLFNBQVM7QUFDL0U7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQSx5REFBeUQsd0JBQXdCO0FBQ2pGOztBQUVBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGFBQWE7QUFDMUIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0Esc0RBQXNELGlDQUFpQztBQUN2Riw4Q0FBOEM7QUFDOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsc0NBQXNDO0FBQ3ZELDZDQUE2QyxzQ0FBc0MsSUFBSTtBQUN2RixxRUFBcUUsOERBQThEO0FBQ25JOztBQUVBO0FBQ0EsOEVBQThFLFNBQVMseUJBQXlCLEVBQUU7QUFDbEgsc0VBQXNFLHlDQUF5QztBQUMvRztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsRUFBRSxxQ0FBcUMsRUFBRTtBQUN0RDtBQUNBLHlCQUF5QiwyQkFBMkI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUVBQWlFLG1DQUFtQztBQUNwRztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxlQUFlO0FBQzVCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYywwQkFBMEIsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEseUJBQXlCO0FBQ3RDLGFBQWEsU0FBUztBQUN0QixhQUFhLFVBQVU7QUFDdkIsY0FBYztBQUNkO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGNBQWM7QUFDZDtBQUNBLHdDQUF3QztBQUN4QztBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QixjQUFjO0FBQ2Q7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTs7QUFFQTtBQUNBLGFBQWEsV0FBVztBQUN4QixhQUFhLFNBQVM7QUFDdEIsYUFBYSxVQUFVO0FBQ3ZCLGNBQWM7QUFDZDtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7O0FBRUEsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLE9BQU87QUFDbEI7QUFDQSxXQUFXLHVCQUF1QjtBQUNsQyxVQUFVLHVCQUF1QjtBQUNqQyxZQUFZLHNCQUFzQjtBQUNsQyxXQUFXLHNCQUFzQjtBQUNqQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQyxPQUFPLDJCQUEyQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLDBCQUEwQjtBQUNyQyxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsT0FBTztBQUMvQixHQUFHO0FBQ0gsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsa0JBQWtCO0FBQ2hDOzs7QUFHQTtBQUNBLGFBQWEsT0FBTztBQUNwQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFNBQVM7QUFDdkIsY0FBYyxTQUFTO0FBQ3ZCLGNBQWMsa0JBQWtCO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxrQkFBa0I7QUFDbEI7Ozs7Ozs7Ozs7Ozs7QUM3cUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sT0FBTztBQUNkOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQyxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3BFQSxPQUFPLEtBQUs7QUFDWixPQUFPLE9BQU87O0FBRWQ7QUFDQTtBQUNBLGFBQWEsNEJBQTRCO0FBQ3pDLGFBQWEsMEJBQTBCO0FBQ3ZDLGFBQWEsNENBQTRDO0FBQ3pELGFBQWEsUUFBUTtBQUNyQixhQUFhLG9CQUFvQjtBQUNqQyxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDBCQUEwQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxXQUFXLFdBQVc7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDRCQUE0QjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUN4R2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixXOzs7Ozs7Ozs7OztBQ2hCbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxlQUFlO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxPQUFPO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLE9BQU87QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEI7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFlBQVksZ0NBQWdDO0FBQzVDLFlBQVksZ0NBQWdDO0FBQzVDLFlBQVksK0NBQStDO0FBQzNELFdBQVcsNENBQTRDO0FBQ3ZELGdCQUFnQixzREFBc0Q7QUFDdEUsVUFBVSwwQ0FBMEM7QUFDcEQsY0FBYyxzR0FBc0c7QUFDcEgsa0JBQWtCLGtGQUFrRjtBQUNwRyxZQUFZLDZEQUE2RDtBQUN6RSxTQUFTLDZEQUE2RDtBQUN0RSxTQUFTLDZEQUE2RDtBQUN0RSxnQkFBZ0Isa0VBQWtFO0FBQ2xGLGlCQUFpQixtRUFBbUU7QUFDcEYsa0JBQWtCLHNFQUFzRTtBQUN4RixtQkFBbUIsdUVBQXVFO0FBQzFGLGNBQWMsOERBQThEO0FBQzVFLGVBQWUsK0RBQStEO0FBQzlFLFlBQVksK0NBQStDO0FBQzNELGVBQWUscURBQXFEO0FBQ3BFLGFBQWEsaURBQWlEO0FBQzlELGNBQWMsbURBQW1EO0FBQ2pFLGlCQUFpQix5REFBeUQ7QUFDMUUsWUFBWSwyQ0FBMkM7QUFDdkQsY0FBYyx1R0FBdUc7QUFDckgsYUFBYSxpREFBaUQ7QUFDOUQsY0FBYyx3R0FBd0c7QUFDdEgsZUFBZSxxREFBcUQ7QUFDcEUsVUFBVSwyQ0FBMkM7QUFDckQsY0FBYyxtR0FBbUc7QUFDakgsV0FBVyw2Q0FBNkM7QUFDeEQsY0FBYyxxR0FBcUc7QUFDbkgsZ0JBQWdCLHVEQUF1RDtBQUN2RSxjQUFjLDBHQUEwRztBQUN4SCxjQUFjLHdHQUF3RztBQUN0SCxjQUFjLG1EQUFtRDtBQUNqRSxpQkFBaUIseURBQXlEO0FBQzFFLGNBQWMsMkdBQTJHO0FBQ3pILGNBQWMseUdBQXlHO0FBQ3ZILGdCQUFnQix1REFBdUQ7QUFDdkUsYUFBYSxpREFBaUQ7QUFDOUQsV0FBVyxnREFBZ0Q7QUFDM0Qsa0JBQWtCLDJEQUEyRDtBQUM3RSxhQUFhLGlEQUFpRDtBQUM5RCxjQUFjLHNHQUFzRztBQUNwSCxhQUFhLGlEQUFpRDtBQUM5RCxvQkFBb0IsNkdBQTZHO0FBQ2pJLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsNkRBQTZEO0FBQzFFLGFBQWEsOERBQThEO0FBQzNFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLFdBQVcsMkRBQTJEO0FBQ3RFLGVBQWUsaURBQWlEO0FBQ2hFLGdCQUFnQixrREFBa0Q7QUFDbEUsa0JBQWtCLDJEQUEyRDtBQUM3RSxxQkFBcUIsb0VBQW9FO0FBQ3pGLGdCQUFnQiwrREFBK0Q7QUFDL0UscUJBQXFCLG9FQUFvRTtBQUN6RixtQkFBbUIsa0VBQWtFO0FBQ3JGLFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFNBQVMsMENBQTBDO0FBQ25ELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELFVBQVUsNENBQTRDO0FBQ3RELGNBQWMsb0RBQW9EO0FBQ2xFLGlCQUFpQiwwREFBMEQ7QUFDM0Usc0JBQXNCLG9FQUFvRTtBQUMxRixzQkFBc0Isb0VBQW9FO0FBQzFGLG9CQUFvQixnRUFBZ0U7QUFDcEYscUJBQXFCLGtFQUFrRTtBQUN2Rix5QkFBeUIsMEVBQTBFO0FBQ25HLGdCQUFnQix3REFBd0Q7QUFDeEUscUJBQXFCLGtFQUFrRTtBQUN2RixnQkFBZ0IsK0RBQStELEVBQUU7QUFDakYsWUFBWSw2REFBNkQ7QUFDekUsa0JBQWtCLGlFQUFpRTtBQUNuRixZQUFZLDhEQUE4RDtBQUMxRSxZQUFZLDZEQUE2RDtBQUN6RSxhQUFhLDhEQUE4RDtBQUMzRSxZQUFZLDZEQUE2RDtBQUN6RSxnQkFBZ0IsaUVBQWlFO0FBQ2pGLGtCQUFrQixxREFBcUQsY0FBYztBQUNyRixnQkFBZ0Isa0VBQWtFO0FBQ2xGLG1CQUFtQixzREFBc0QsY0FBYztBQUN2RixZQUFZLDhEQUE4RDtBQUMxRSxlQUFlLHNEQUFzRDtBQUNyRSxZQUFZLGdEQUFnRDtBQUM1RCxhQUFhLCtDQUErQztBQUM1RCxZQUFZLGdFQUFnRTtBQUM1RSxZQUFZLG1EQUFtRDtBQUMvRCxjQUFjLHVEQUF1RDtBQUNyRSxVQUFVLCtDQUErQztBQUN6RCxhQUFhLCtCQUErQjtBQUM1QyxpQkFBaUIsbUNBQW1DO0FBQ3BELFFBQVEsMkNBQTJDO0FBQ25ELFlBQVksOEJBQThCO0FBQzFDLGNBQWMsZ0RBQWdEO0FBQzlELGFBQWEsdUVBQXVFO0FBQ3BGLFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFdBQVcsaURBQWlEO0FBQzVELFFBQVEsb0VBQW9FO0FBQzVFLFFBQVEsK0RBQStEO0FBQ3ZFLFFBQVEsb0VBQW9FO0FBQzVFLFFBQVEsa0VBQWtFO0FBQzFFLElBQUksSUFBSSx5QkFBeUIsdUJBQXVCO0FBQ3hELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNkNBQTZDO0FBQ3JELFFBQVEsZ0RBQWdEO0FBQ3hELFFBQVEsa0RBQWtEO0FBQzFELFNBQVMsaURBQWlEO0FBQzFELFFBQVEsbURBQW1EO0FBQzNELFNBQVMsNkNBQTZDO0FBQ3RELFdBQVcsOEJBQThCO0FBQ3pDLFlBQVksZ0RBQWdEO0FBQzVELFlBQVksK0JBQStCO0FBQzNDLGVBQWUsa0NBQWtDO0FBQ2pELFdBQVcsOEJBQThCO0FBQ3pDLGNBQWMsaUNBQWlDO0FBQy9DLFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNkNBQTZDO0FBQ3JELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsMENBQTBDO0FBQ2xELFFBQVEsZ0RBQWdEO0FBQ3hELFFBQVEsNkNBQTZDO0FBQ3JELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsNkNBQTZDO0FBQ3JELFFBQVEsNENBQTRDO0FBQ3BELFFBQVEsZ0RBQWdEO0FBQ3hELElBQUksSUFBSSx5QkFBeUIseUJBQXlCO0FBQzFELFFBQVEsZ0RBQWdEO0FBQ3hELElBQUksSUFBSSx5QkFBeUIsMEJBQTBCO0FBQzNELFFBQVE7QUFDUixFOzs7Ozs7Ozs7OztBQ3hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sMkJBQTJCOztBQUVsQztBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEscUNBQXFDO0FBQ2xELGFBQWEsNkNBQTZDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbURBQW1EO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0JBQWtCO0FBQy9CLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGtCQUFrQjtBQUMvQixhQUFhLFVBQVU7QUFDdkIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCOzs7Ozs7Ozs7Ozs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sYUFBYTs7QUFFcEI7QUFDQSxXQUFXLHNCQUFzQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsVUFBVTtBQUN2QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsT0FBTztBQUMvQjtBQUNBLGVBQWUsSUFBSSxJQUFJLHNDQUFzQzs7QUFFN0Q7QUFDQSxlQUFlLEVBQUU7QUFDakIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLG1DQUFtQztBQUNoRCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGFBQWEsSUFBSSxTQUFTO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSwrQkFBK0I7QUFDNUMsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkMsYUFBYSwrQkFBK0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZ0NBQWdDO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBZ0QsVUFBVTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixVQUFVLEdBQUcsV0FBVztBQUNuRDtBQUNBO0FBQ0EsNEJBQTRCLFVBQVUsR0FBRyxXQUFXLEdBQUcsU0FBUztBQUNoRTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsVUFBVSxHQUFHLFdBQVc7QUFDckQ7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFVBQVUsUUFBUSxzQkFBc0I7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixVQUFVLFFBQVEsU0FBUztBQUM5QztBQUNBLDZCQUE2QixVQUFVLFFBQVEsc0JBQXNCO0FBQ3JFO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLEtBQUs7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsWUFBWTtBQUN6QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0EsYUFBYSxRQUFRLHVFQUF1RSxFQUFFO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDalNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7O0FDbkJBLHNCOzs7Ozs7Ozs7OztBQ0FBLG9CIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2xpZW50L1B1cHBldGVlci5qc1wiKTtcbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4dGVuc2lvbiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2VuZENhbGw6IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgcHJpdmF0ZSBjbG9zZUNhbGw6ICgpID0+IHZvaWRcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICBzdGF0aWMgYXN5bmMgY3JlYXRlKHRhYklkOiBzdHJpbmcpIHtcbiAgICBsZXQgZXh0ZW5zaW9uOiBFeHRlbnNpb247XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKHBvcnQgPT4ge1xuICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2cgPT4ge1xuICAgICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShcbiAgICAgICAgICAgICAgbmV3IEV4dGVuc2lvbihcbiAgICAgICAgICAgICAgICAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3NlbmQnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBwb3J0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ3Jlc3VsdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBleHRlbnNpb24uZW1pdCgnbWVzc2FnZScsIG1zZy5yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdvbkV2ZW50Jykge1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbi5lbWl0KCdtZXNzYWdlJywgbXNnLnJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2Rpc2Nvbm5lY3QnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cucmVhc29uKTtcbiAgICAgICAgICAgIHJldHVybiBleHRlbnNpb24uZW1pdCgnY2xvc2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICB0eXBlOiAnY3JlYXRlJyxcbiAgICAgICAgICB0YWJJZCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZW5kQ2FsbChtZXNzYWdlKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuY2xvc2VDYWxsKCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmNvbnN0IHsgQ29ubmVjdGlvbiB9ID0gcmVxdWlyZSgnLi4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9Db25uZWN0aW9uJyk7XG5jb25zdCB7IGRlZmF1bHQ6IEV4dGVuc2lvbiB9ID0gcmVxdWlyZSgnLi9FeHRlbnNpb24nKTtcbmNvbnN0IHsgQnJvd3NlciB9ID0gcmVxdWlyZSgnLi4vbm9kZV9tb2R1bGVzL3B1cHBldGVlci1jb3JlL2xpYi9Ccm93c2VyJyk7XG5jb25zdCB7IGRlYnVnRXJyb3IgfSA9IHJlcXVpcmUoJy4uL25vZGVfbW9kdWxlcy9wdXBwZXRlZXItY29yZS9saWIvaGVscGVyJyk7XG5cbmNsYXNzIExhdW5jaGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IShCcm93c2VyT3B0aW9ucyAmIHticm93c2VyV1NFbmRwb2ludDogc3RyaW5nfSk9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFCcm93c2VyPn1cbiAgICovXG4gIHN0YXRpYyBhc3luYyBjb25uZWN0KG9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICB0YWJJZCA9IG51bGwsXG4gICAgICBpZ25vcmVIVFRQU0Vycm9ycyA9IGZhbHNlLFxuICAgICAgZGVmYXVsdFZpZXdwb3J0ID0geyB3aWR0aDogODAwLCBoZWlnaHQ6IDYwMCB9LFxuICAgICAgc2xvd01vID0gMCxcbiAgICB9ID0gb3B0aW9ucztcbiAgICBsZXQgZXh0ZW5zaW9uID0gYXdhaXQgRXh0ZW5zaW9uLmNyZWF0ZSh0YWJJZCk7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKCcnLCBleHRlbnNpb24sIHNsb3dNbyk7XG4gICAgY29uc3QgeyBicm93c2VyQ29udGV4dElkcyB9ID0gYXdhaXQgY29ubmVjdGlvbi5zZW5kKFxuICAgICAgJ1RhcmdldC5nZXRCcm93c2VyQ29udGV4dHMnXG4gICAgKTtcbiAgICByZXR1cm4gQnJvd3Nlci5jcmVhdGUoXG4gICAgICBjb25uZWN0aW9uLFxuICAgICAgYnJvd3NlckNvbnRleHRJZHMsXG4gICAgICBpZ25vcmVIVFRQU0Vycm9ycyxcbiAgICAgIGRlZmF1bHRWaWV3cG9ydCxcbiAgICAgIG51bGwsXG4gICAgICAoKSA9PiBjb25uZWN0aW9uLnNlbmQoJ0Jyb3dzZXIuY2xvc2UnKS5jYXRjaChkZWJ1Z0Vycm9yKVxuICAgICk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXVuY2hlcjtcbiIsImNvbnN0IHsgaGVscGVyIH0gPSByZXF1aXJlKCcuLi9ub2RlX21vZHVsZXMvcHVwcGV0ZWVyLWNvcmUvbGliL2hlbHBlcicpO1xuY29uc3QgTGF1bmNoZXIgPSByZXF1aXJlKCcuL0xhdW5jaGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3Mge1xuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLkJyb3dzZXI+fVxuICAgKi9cbiAgc3RhdGljIGxhdW5jaChvcHRpb25zKSB7XG4gICAgcmV0dXJuIExhdW5jaGVyLmxhdW5jaChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3ticm93c2VyV1NFbmRwb2ludDogc3RyaW5nLCBpZ25vcmVIVFRQU0Vycm9yczogYm9vbGVhbn19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2U8IVB1cHBldGVlci5Ccm93c2VyPn1cbiAgICovXG4gIHN0YXRpYyBjb25uZWN0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gTGF1bmNoZXIuY29ubmVjdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZXhlY3V0YWJsZVBhdGgoKSB7XG4gICAgcmV0dXJuIExhdW5jaGVyLmV4ZWN1dGFibGVQYXRoKCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IUFycmF5PHN0cmluZz59XG4gICAqL1xuICBzdGF0aWMgZGVmYXVsdEFyZ3Mob3B0aW9ucykge1xuICAgIHJldHVybiBMYXVuY2hlci5kZWZhdWx0QXJncyhvcHRpb25zKTtcbiAgfVxufTtcblxuaGVscGVyLnRyYWNlUHVibGljQVBJKG1vZHVsZS5leHBvcnRzLCAnUHVwcGV0ZWVyJyk7XG4iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG5leHBvcnRzLmtNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBhcnJheVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbUFycmF5TGlrZSh0aGF0LCBhcnJheSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW4pXG5cbiAgICBpZiAodGhhdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGF0XG4gICAgfVxuXG4gICAgb2JqLmNvcHkodGhhdCwgMCwgMCwgbGVuKVxuICAgIHJldHVybiB0aGF0XG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIG9iai5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IGlzbmFuKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGgoKWAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmXG4gICAgICAgIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgKytpKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsIi8qKlxuICogVGhpcyBpcyB0aGUgd2ViIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZVxuICAgICAgICAgICAgICAgJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZS5zdG9yYWdlXG4gICAgICAgICAgICAgICAgICA/IGNocm9tZS5zdG9yYWdlLmxvY2FsXG4gICAgICAgICAgICAgICAgICA6IGxvY2Fsc3RvcmFnZSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcbiAgJyMwMDAwQ0MnLCAnIzAwMDBGRicsICcjMDAzM0NDJywgJyMwMDMzRkYnLCAnIzAwNjZDQycsICcjMDA2NkZGJywgJyMwMDk5Q0MnLFxuICAnIzAwOTlGRicsICcjMDBDQzAwJywgJyMwMENDMzMnLCAnIzAwQ0M2NicsICcjMDBDQzk5JywgJyMwMENDQ0MnLCAnIzAwQ0NGRicsXG4gICcjMzMwMENDJywgJyMzMzAwRkYnLCAnIzMzMzNDQycsICcjMzMzM0ZGJywgJyMzMzY2Q0MnLCAnIzMzNjZGRicsICcjMzM5OUNDJyxcbiAgJyMzMzk5RkYnLCAnIzMzQ0MwMCcsICcjMzNDQzMzJywgJyMzM0NDNjYnLCAnIzMzQ0M5OScsICcjMzNDQ0NDJywgJyMzM0NDRkYnLFxuICAnIzY2MDBDQycsICcjNjYwMEZGJywgJyM2NjMzQ0MnLCAnIzY2MzNGRicsICcjNjZDQzAwJywgJyM2NkNDMzMnLCAnIzk5MDBDQycsXG4gICcjOTkwMEZGJywgJyM5OTMzQ0MnLCAnIzk5MzNGRicsICcjOTlDQzAwJywgJyM5OUNDMzMnLCAnI0NDMDAwMCcsICcjQ0MwMDMzJyxcbiAgJyNDQzAwNjYnLCAnI0NDMDA5OScsICcjQ0MwMENDJywgJyNDQzAwRkYnLCAnI0NDMzMwMCcsICcjQ0MzMzMzJywgJyNDQzMzNjYnLFxuICAnI0NDMzM5OScsICcjQ0MzM0NDJywgJyNDQzMzRkYnLCAnI0NDNjYwMCcsICcjQ0M2NjMzJywgJyNDQzk5MDAnLCAnI0NDOTkzMycsXG4gICcjQ0NDQzAwJywgJyNDQ0NDMzMnLCAnI0ZGMDAwMCcsICcjRkYwMDMzJywgJyNGRjAwNjYnLCAnI0ZGMDA5OScsICcjRkYwMENDJyxcbiAgJyNGRjAwRkYnLCAnI0ZGMzMwMCcsICcjRkYzMzMzJywgJyNGRjMzNjYnLCAnI0ZGMzM5OScsICcjRkYzM0NDJywgJyNGRjMzRkYnLFxuICAnI0ZGNjYwMCcsICcjRkY2NjMzJywgJyNGRjk5MDAnLCAnI0ZGOTkzMycsICcjRkZDQzAwJywgJyNGRkNDMzMnXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJbnRlcm5ldCBFeHBsb3JlciBhbmQgRWRnZSBkbyBub3Qgc3VwcG9ydCBjb2xvcnMuXG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvKGVkZ2V8dHJpZGVudClcXC8oXFxkKykvKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG4gIHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuICAgIC8vIGlzIGZpcmVmb3ggPj0gdjMxP1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuICAgIC8vIGRvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnIubWVzc2FnZTtcbiAgfVxufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm47XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKVxuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cblxuICAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG4gIGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuICAgIHIgPSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfVxuXG4gIHJldHVybiByO1xufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGVidWcuZGVidWcgPSBjcmVhdGVEZWJ1Z1snZGVmYXVsdCddID0gY3JlYXRlRGVidWc7XG5leHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtcbmV4cG9ydHMuZGlzYWJsZSA9IGRpc2FibGU7XG5leHBvcnRzLmVuYWJsZSA9IGVuYWJsZTtcbmV4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7XG5leHBvcnRzLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuLyoqXG4gKiBBY3RpdmUgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydHMuaW5zdGFuY2VzID0gW107XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIHZhciBwcmV2VGltZTtcblxuICBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICAvLyBkaXNhYmxlZD9cbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBzZWxmID0gZGVidWc7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIHR1cm4gdGhlIGBhcmd1bWVudHNgIGludG8gYSBwcm9wZXIgQXJyYXlcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcbiAgICBleHBvcnRzLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuICAgIHZhciBsb2dGbiA9IGRlYnVnLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG5cbiAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICBkZWJ1Zy5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gIGRlYnVnLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gIGRlYnVnLmNvbG9yID0gc2VsZWN0Q29sb3IobmFtZXNwYWNlKTtcbiAgZGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG5cbiAgLy8gZW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBleHBvcnRzLmluaXQpIHtcbiAgICBleHBvcnRzLmluaXQoZGVidWcpO1xuICB9XG5cbiAgZXhwb3J0cy5pbnN0YW5jZXMucHVzaChkZWJ1Zyk7XG5cbiAgcmV0dXJuIGRlYnVnO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdmFyIGluZGV4ID0gZXhwb3J0cy5pbnN0YW5jZXMuaW5kZXhPZih0aGlzKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIGV4cG9ydHMuaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgZXhwb3J0cy5uYW1lcyA9IFtdO1xuICBleHBvcnRzLnNraXBzID0gW107XG5cbiAgdmFyIGk7XG4gIHZhciBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG4gIHZhciBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBleHBvcnRzLmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnN0YW5jZSA9IGV4cG9ydHMuaW5zdGFuY2VzW2ldO1xuICAgIGluc3RhbmNlLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQoaW5zdGFuY2UubmFtZXNwYWNlKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwYXJzZSh2YWwpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbCkgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIGlmIChtcyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtcyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JykgfHxcbiAgICBwbHVyYWwobXMsIGgsICdob3VyJykgfHxcbiAgICBwbHVyYWwobXMsIG0sICdtaW51dGUnKSB8fFxuICAgIHBsdXJhbChtcywgcywgJ3NlY29uZCcpIHx8XG4gICAgbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG4sIG5hbWUpIHtcbiAgaWYgKG1zIDwgbikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobXMgPCBuICogMS41KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIH1cbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJztcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3QgeyBoZWxwZXIsIGFzc2VydCB9ID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbmNvbnN0IHtUYXJnZXR9ID0gcmVxdWlyZSgnLi9UYXJnZXQnKTtcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3Qge1Rhc2tRdWV1ZX0gPSByZXF1aXJlKCcuL1Rhc2tRdWV1ZScpO1xuXG5jbGFzcyBCcm93c2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5Db25uZWN0aW9ufSBjb25uZWN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PHN0cmluZz59IGNvbnRleHRJZHNcbiAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVIVFRQU0Vycm9yc1xuICAgKiBAcGFyYW0gez9QdXBwZXRlZXIuVmlld3BvcnR9IGRlZmF1bHRWaWV3cG9ydFxuICAgKiBAcGFyYW0gez9QdXBwZXRlZXIuQ2hpbGRQcm9jZXNzfSBwcm9jZXNzXG4gICAqIEBwYXJhbSB7KGZ1bmN0aW9uKCk6UHJvbWlzZSk9fSBjbG9zZUNhbGxiYWNrXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uLCBjb250ZXh0SWRzLCBpZ25vcmVIVFRQU0Vycm9ycywgZGVmYXVsdFZpZXdwb3J0LCBwcm9jZXNzLCBjbG9zZUNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pZ25vcmVIVFRQU0Vycm9ycyA9IGlnbm9yZUhUVFBTRXJyb3JzO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3cG9ydCA9IGRlZmF1bHRWaWV3cG9ydDtcbiAgICB0aGlzLl9wcm9jZXNzID0gcHJvY2VzcztcbiAgICB0aGlzLl9zY3JlZW5zaG90VGFza1F1ZXVlID0gbmV3IFRhc2tRdWV1ZSgpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIHRoaXMuX2Nsb3NlQ2FsbGJhY2sgPSBjbG9zZUNhbGxiYWNrIHx8IG5ldyBGdW5jdGlvbigpO1xuXG4gICAgdGhpcy5fZGVmYXVsdENvbnRleHQgPSBuZXcgQnJvd3NlckNvbnRleHQodGhpcywgbnVsbCk7XG4gICAgLyoqIEB0eXBlIHtNYXA8c3RyaW5nLCBCcm93c2VyQ29udGV4dD59ICovXG4gICAgdGhpcy5fY29udGV4dHMgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBjb250ZXh0SWQgb2YgY29udGV4dElkcylcbiAgICAgIHRoaXMuX2NvbnRleHRzLnNldChjb250ZXh0SWQsIG5ldyBCcm93c2VyQ29udGV4dCh0aGlzLCBjb250ZXh0SWQpKTtcblxuICAgIC8qKiBAdHlwZSB7TWFwPHN0cmluZywgVGFyZ2V0Pn0gKi9cbiAgICB0aGlzLl90YXJnZXRzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uc2V0Q2xvc2VkQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KEJyb3dzZXIuRXZlbnRzLkRpc2Nvbm5lY3RlZCk7XG4gICAgfSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbignVGFyZ2V0LnRhcmdldENyZWF0ZWQnLCB0aGlzLl90YXJnZXRDcmVhdGVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub24oJ1RhcmdldC50YXJnZXREZXN0cm95ZWQnLCB0aGlzLl90YXJnZXREZXN0cm95ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbignVGFyZ2V0LnRhcmdldEluZm9DaGFuZ2VkJywgdGhpcy5fdGFyZ2V0SW5mb0NoYW5nZWQuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7P1B1cHBldGVlci5DaGlsZFByb2Nlc3N9XG4gICAqL1xuICBwcm9jZXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFCcm93c2VyQ29udGV4dD59XG4gICAqL1xuICBhc3luYyBjcmVhdGVJbmNvZ25pdG9Ccm93c2VyQ29udGV4dCgpIHtcbiAgICBjb25zdCB7YnJvd3NlckNvbnRleHRJZH0gPSBhd2FpdCB0aGlzLl9jb25uZWN0aW9uLnNlbmQoJ1RhcmdldC5jcmVhdGVCcm93c2VyQ29udGV4dCcpO1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQnJvd3NlckNvbnRleHQodGhpcywgYnJvd3NlckNvbnRleHRJZCk7XG4gICAgdGhpcy5fY29udGV4dHMuc2V0KGJyb3dzZXJDb250ZXh0SWQsIGNvbnRleHQpO1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFBcnJheTwhQnJvd3NlckNvbnRleHQ+fVxuICAgKi9cbiAgYnJvd3NlckNvbnRleHRzKCkge1xuICAgIHJldHVybiBbdGhpcy5fZGVmYXVsdENvbnRleHQsIC4uLkFycmF5LmZyb20odGhpcy5fY29udGV4dHMudmFsdWVzKCkpXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNvbnRleHRJZFxuICAgKi9cbiAgYXN5bmMgX2Rpc3Bvc2VDb250ZXh0KGNvbnRleHRJZCkge1xuICAgIGF3YWl0IHRoaXMuX2Nvbm5lY3Rpb24uc2VuZCgnVGFyZ2V0LmRpc3Bvc2VCcm93c2VyQ29udGV4dCcsIHticm93c2VyQ29udGV4dElkOiBjb250ZXh0SWQgfHwgdW5kZWZpbmVkfSk7XG4gICAgdGhpcy5fY29udGV4dHMuZGVsZXRlKGNvbnRleHRJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNvbm5lY3Rpb259IGNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHshQXJyYXk8c3RyaW5nPn0gY29udGV4dElkc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZUhUVFBTRXJyb3JzXG4gICAqIEBwYXJhbSB7P1B1cHBldGVlci5WaWV3cG9ydH0gZGVmYXVsdFZpZXdwb3J0XG4gICAqIEBwYXJhbSB7P1B1cHBldGVlci5DaGlsZFByb2Nlc3N9IHByb2Nlc3NcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpPX0gY2xvc2VDYWxsYmFja1xuICAgKi9cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZShjb25uZWN0aW9uLCBjb250ZXh0SWRzLCBpZ25vcmVIVFRQU0Vycm9ycywgZGVmYXVsdFZpZXdwb3J0LCBwcm9jZXNzLCBjbG9zZUNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnJvd3NlciA9IG5ldyBCcm93c2VyKGNvbm5lY3Rpb24sIGNvbnRleHRJZHMsIGlnbm9yZUhUVFBTRXJyb3JzLCBkZWZhdWx0Vmlld3BvcnQsIHByb2Nlc3MsIGNsb3NlQ2FsbGJhY2spO1xuICAgIGF3YWl0IGNvbm5lY3Rpb24uc2VuZCgnVGFyZ2V0LnNldERpc2NvdmVyVGFyZ2V0cycsIHtkaXNjb3ZlcjogdHJ1ZX0pO1xuICAgIHJldHVybiBicm93c2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlRhcmdldC50YXJnZXRDcmVhdGVkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIGFzeW5jIF90YXJnZXRDcmVhdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0SW5mbyA9IGV2ZW50LnRhcmdldEluZm87XG4gICAgY29uc3Qge2Jyb3dzZXJDb250ZXh0SWR9ID0gdGFyZ2V0SW5mbztcbiAgICBjb25zdCBjb250ZXh0ID0gKGJyb3dzZXJDb250ZXh0SWQgJiYgdGhpcy5fY29udGV4dHMuaGFzKGJyb3dzZXJDb250ZXh0SWQpKSA/IHRoaXMuX2NvbnRleHRzLmdldChicm93c2VyQ29udGV4dElkKSA6IHRoaXMuX2RlZmF1bHRDb250ZXh0O1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFRhcmdldCh0YXJnZXRJbmZvLCBjb250ZXh0LCAoKSA9PiB0aGlzLl9jb25uZWN0aW9uLmNyZWF0ZVNlc3Npb24odGFyZ2V0SW5mbyksIHRoaXMuX2lnbm9yZUhUVFBTRXJyb3JzLCB0aGlzLl9kZWZhdWx0Vmlld3BvcnQsIHRoaXMuX3NjcmVlbnNob3RUYXNrUXVldWUpO1xuICAgIGFzc2VydCghdGhpcy5fdGFyZ2V0cy5oYXMoZXZlbnQudGFyZ2V0SW5mby50YXJnZXRJZCksICdUYXJnZXQgc2hvdWxkIG5vdCBleGlzdCBiZWZvcmUgdGFyZ2V0Q3JlYXRlZCcpO1xuICAgIHRoaXMuX3RhcmdldHMuc2V0KGV2ZW50LnRhcmdldEluZm8udGFyZ2V0SWQsIHRhcmdldCk7XG5cbiAgICBpZiAoYXdhaXQgdGFyZ2V0Ll9pbml0aWFsaXplZFByb21pc2UpIHtcbiAgICAgIHRoaXMuZW1pdChCcm93c2VyLkV2ZW50cy5UYXJnZXRDcmVhdGVkLCB0YXJnZXQpO1xuICAgICAgY29udGV4dC5lbWl0KEJyb3dzZXJDb250ZXh0LkV2ZW50cy5UYXJnZXRDcmVhdGVkLCB0YXJnZXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3t0YXJnZXRJZDogc3RyaW5nfX0gZXZlbnRcbiAgICovXG4gIGFzeW5jIF90YXJnZXREZXN0cm95ZWQoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl90YXJnZXRzLmdldChldmVudC50YXJnZXRJZCk7XG4gICAgdGFyZ2V0Ll9pbml0aWFsaXplZENhbGxiYWNrKGZhbHNlKTtcbiAgICB0aGlzLl90YXJnZXRzLmRlbGV0ZShldmVudC50YXJnZXRJZCk7XG4gICAgdGFyZ2V0Ll9jbG9zZWRDYWxsYmFjaygpO1xuICAgIGlmIChhd2FpdCB0YXJnZXQuX2luaXRpYWxpemVkUHJvbWlzZSkge1xuICAgICAgdGhpcy5lbWl0KEJyb3dzZXIuRXZlbnRzLlRhcmdldERlc3Ryb3llZCwgdGFyZ2V0KTtcbiAgICAgIHRhcmdldC5icm93c2VyQ29udGV4dCgpLmVtaXQoQnJvd3NlckNvbnRleHQuRXZlbnRzLlRhcmdldERlc3Ryb3llZCwgdGFyZ2V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuVGFyZ2V0LnRhcmdldEluZm9DaGFuZ2VkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF90YXJnZXRJbmZvQ2hhbmdlZChldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX3RhcmdldHMuZ2V0KGV2ZW50LnRhcmdldEluZm8udGFyZ2V0SWQpO1xuICAgIGFzc2VydCh0YXJnZXQsICd0YXJnZXQgc2hvdWxkIGV4aXN0IGJlZm9yZSB0YXJnZXRJbmZvQ2hhbmdlZCcpO1xuICAgIGNvbnN0IHByZXZpb3VzVVJMID0gdGFyZ2V0LnVybCgpO1xuICAgIGNvbnN0IHdhc0luaXRpYWxpemVkID0gdGFyZ2V0Ll9pc0luaXRpYWxpemVkO1xuICAgIHRhcmdldC5fdGFyZ2V0SW5mb0NoYW5nZWQoZXZlbnQudGFyZ2V0SW5mbyk7XG4gICAgaWYgKHdhc0luaXRpYWxpemVkICYmIHByZXZpb3VzVVJMICE9PSB0YXJnZXQudXJsKCkpIHtcbiAgICAgIHRoaXMuZW1pdChCcm93c2VyLkV2ZW50cy5UYXJnZXRDaGFuZ2VkLCB0YXJnZXQpO1xuICAgICAgdGFyZ2V0LmJyb3dzZXJDb250ZXh0KCkuZW1pdChCcm93c2VyQ29udGV4dC5FdmVudHMuVGFyZ2V0Q2hhbmdlZCwgdGFyZ2V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgd3NFbmRwb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi51cmwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLlBhZ2U+fVxuICAgKi9cbiAgYXN5bmMgbmV3UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdENvbnRleHQubmV3UGFnZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZXh0SWRcbiAgICogQHJldHVybiB7IVByb21pc2U8IVB1cHBldGVlci5QYWdlPn1cbiAgICovXG4gIGFzeW5jIF9jcmVhdGVQYWdlSW5Db250ZXh0KGNvbnRleHRJZCkge1xuICAgIGNvbnN0IHt0YXJnZXRJZH0gPSBhd2FpdCB0aGlzLl9jb25uZWN0aW9uLnNlbmQoJ1RhcmdldC5jcmVhdGVUYXJnZXQnLCB7dXJsOiAnYWJvdXQ6YmxhbmsnLCBicm93c2VyQ29udGV4dElkOiBjb250ZXh0SWQgfHwgdW5kZWZpbmVkfSk7XG4gICAgY29uc3QgdGFyZ2V0ID0gYXdhaXQgdGhpcy5fdGFyZ2V0cy5nZXQodGFyZ2V0SWQpO1xuICAgIGFzc2VydChhd2FpdCB0YXJnZXQuX2luaXRpYWxpemVkUHJvbWlzZSwgJ0ZhaWxlZCB0byBjcmVhdGUgdGFyZ2V0IGZvciBwYWdlJyk7XG4gICAgY29uc3QgcGFnZSA9IGF3YWl0IHRhcmdldC5wYWdlKCk7XG4gICAgcmV0dXJuIHBhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IUFycmF5PCFUYXJnZXQ+fVxuICAgKi9cbiAgdGFyZ2V0cygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl90YXJnZXRzLnZhbHVlcygpKS5maWx0ZXIodGFyZ2V0ID0+IHRhcmdldC5faXNJbml0aWFsaXplZCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFQdXBwZXRlZXIuUGFnZT4+fVxuICAgKi9cbiAgYXN5bmMgcGFnZXMoKSB7XG4gICAgY29uc3QgY29udGV4dFBhZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5icm93c2VyQ29udGV4dHMoKS5tYXAoY29udGV4dCA9PiBjb250ZXh0LnBhZ2VzKCkpKTtcbiAgICAvLyBGbGF0dGVuIGFycmF5LlxuICAgIHJldHVybiBjb250ZXh0UGFnZXMucmVkdWNlKChhY2MsIHgpID0+IGFjYy5jb25jYXQoeCksIFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTxzdHJpbmc+fVxuICAgKi9cbiAgYXN5bmMgdmVyc2lvbigpIHtcbiAgICBjb25zdCB2ZXJzaW9uID0gYXdhaXQgdGhpcy5fZ2V0VmVyc2lvbigpO1xuICAgIHJldHVybiB2ZXJzaW9uLnByb2R1Y3Q7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHVzZXJBZ2VudCgpIHtcbiAgICBjb25zdCB2ZXJzaW9uID0gYXdhaXQgdGhpcy5fZ2V0VmVyc2lvbigpO1xuICAgIHJldHVybiB2ZXJzaW9uLnVzZXJBZ2VudDtcbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCkge1xuICAgIGF3YWl0IHRoaXMuX2Nsb3NlQ2FsbGJhY2suY2FsbChudWxsKTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IU9iamVjdD59XG4gICAqL1xuICBfZ2V0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5zZW5kKCdCcm93c2VyLmdldFZlcnNpb24nKTtcbiAgfVxufVxuXG4vKiogQGVudW0ge3N0cmluZ30gKi9cbkJyb3dzZXIuRXZlbnRzID0ge1xuICBUYXJnZXRDcmVhdGVkOiAndGFyZ2V0Y3JlYXRlZCcsXG4gIFRhcmdldERlc3Ryb3llZDogJ3RhcmdldGRlc3Ryb3llZCcsXG4gIFRhcmdldENoYW5nZWQ6ICd0YXJnZXRjaGFuZ2VkJyxcbiAgRGlzY29ubmVjdGVkOiAnZGlzY29ubmVjdGVkJ1xufTtcblxuY2xhc3MgQnJvd3NlckNvbnRleHQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHshQnJvd3Nlcn0gYnJvd3NlclxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNvbnRleHRJZFxuICAgKi9cbiAgY29uc3RydWN0b3IoYnJvd3NlciwgY29udGV4dElkKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9icm93c2VyID0gYnJvd3NlcjtcbiAgICB0aGlzLl9pZCA9IGNvbnRleHRJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXk8IVRhcmdldD59IHRhcmdldFxuICAgKi9cbiAgdGFyZ2V0cygpIHtcbiAgICByZXR1cm4gdGhpcy5fYnJvd3Nlci50YXJnZXRzKCkuZmlsdGVyKHRhcmdldCA9PiB0YXJnZXQuYnJvd3NlckNvbnRleHQoKSA9PT0gdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFQdXBwZXRlZXIuUGFnZT4+fVxuICAgKi9cbiAgYXN5bmMgcGFnZXMoKSB7XG4gICAgY29uc3QgcGFnZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgdGhpcy50YXJnZXRzKClcbiAgICAgICAgICAgIC5maWx0ZXIodGFyZ2V0ID0+IHRhcmdldC50eXBlKCkgPT09ICdwYWdlJylcbiAgICAgICAgICAgIC5tYXAodGFyZ2V0ID0+IHRhcmdldC5wYWdlKCkpXG4gICAgKTtcbiAgICByZXR1cm4gcGFnZXMuZmlsdGVyKHBhZ2UgPT4gISFwYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNJbmNvZ25pdG8oKSB7XG4gICAgcmV0dXJuICEhdGhpcy5faWQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IVB1cHBldGVlci5QYWdlPn1cbiAgICovXG4gIG5ld1BhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jyb3dzZXIuX2NyZWF0ZVBhZ2VJbkNvbnRleHQodGhpcy5faWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFCcm93c2VyfVxuICAgKi9cbiAgYnJvd3NlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYnJvd3NlcjtcbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCkge1xuICAgIGFzc2VydCh0aGlzLl9pZCwgJ05vbi1pbmNvZ25pdG8gcHJvZmlsZXMgY2Fubm90IGJlIGNsb3NlZCEnKTtcbiAgICBhd2FpdCB0aGlzLl9icm93c2VyLl9kaXNwb3NlQ29udGV4dCh0aGlzLl9pZCk7XG4gIH1cbn1cblxuLyoqIEBlbnVtIHtzdHJpbmd9ICovXG5Ccm93c2VyQ29udGV4dC5FdmVudHMgPSB7XG4gIFRhcmdldENyZWF0ZWQ6ICd0YXJnZXRjcmVhdGVkJyxcbiAgVGFyZ2V0RGVzdHJveWVkOiAndGFyZ2V0ZGVzdHJveWVkJyxcbiAgVGFyZ2V0Q2hhbmdlZDogJ3RhcmdldGNoYW5nZWQnLFxufTtcblxuaGVscGVyLnRyYWNlUHVibGljQVBJKEJyb3dzZXJDb250ZXh0KTtcbmhlbHBlci50cmFjZVB1YmxpY0FQSShCcm93c2VyKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7QnJvd3NlciwgQnJvd3NlckNvbnRleHR9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3Qge2hlbHBlciwgYXNzZXJ0fSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5jb25zdCBkZWJ1Z1Byb3RvY29sID0gcmVxdWlyZSgnZGVidWcnKSgncHVwcGV0ZWVyOnByb3RvY29sJyk7XG5jb25zdCBkZWJ1Z1Nlc3Npb24gPSByZXF1aXJlKCdkZWJ1ZycpKCdwdXBwZXRlZXI6c2Vzc2lvbicpO1xuXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IFdlYlNvY2tldCA9IHJlcXVpcmUoJ3dzJyk7XG5jb25zdCBQaXBlID0gcmVxdWlyZSgnLi9QaXBlJyk7XG5cbmNsYXNzIENvbm5lY3Rpb24gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge251bWJlcj19IGRlbGF5XG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFDb25uZWN0aW9uPn1cbiAgICovXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVGb3JXZWJTb2NrZXQodXJsLCBkZWxheSA9IDApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHVybCwgeyBwZXJNZXNzYWdlRGVmbGF0ZTogZmFsc2UgfSk7XG4gICAgICB3cy5vbignb3BlbicsICgpID0+IHJlc29sdmUobmV3IENvbm5lY3Rpb24odXJsLCB3cywgZGVsYXkpKSk7XG4gICAgICB3cy5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU5vZGVKUy5Xcml0YWJsZVN0cmVhbX0gcGlwZVdyaXRlXG4gICAqIEBwYXJhbSB7IU5vZGVKUy5SZWFkYWJsZVN0cmVhbX0gcGlwZVJlYWRcbiAgICogQHBhcmFtIHtudW1iZXI9fSBkZWxheVxuICAgKiBAcmV0dXJuIHshQ29ubmVjdGlvbn1cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVGb3JQaXBlKHBpcGVXcml0ZSwgcGlwZVJlYWQsIGRlbGF5ID0gMCkge1xuICAgIHJldHVybiBuZXcgQ29ubmVjdGlvbignJywgbmV3IFBpcGUocGlwZVdyaXRlLCBwaXBlUmVhZCksIGRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5Db25uZWN0aW9uVHJhbnNwb3J0fSB0cmFuc3BvcnRcbiAgICogQHBhcmFtIHtudW1iZXI9fSBkZWxheVxuICAgKi9cbiAgY29uc3RydWN0b3IodXJsLCB0cmFuc3BvcnQsIGRlbGF5ID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICAgIHRoaXMuX2xhc3RJZCA9IDA7XG4gICAgLyoqIEB0eXBlIHshTWFwPG51bWJlciwge3Jlc29sdmU6IGZ1bmN0aW9uLCByZWplY3Q6IGZ1bmN0aW9uLCBlcnJvcjogIUVycm9yLCBtZXRob2Q6IHN0cmluZ30+fSovXG4gICAgdGhpcy5fY2FsbGJhY2tzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2RlbGF5ID0gZGVsYXk7XG5cbiAgICB0aGlzLl90cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgdGhpcy5fdHJhbnNwb3J0Lm9uKCdtZXNzYWdlJywgdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX3RyYW5zcG9ydC5vbignY2xvc2UnLCB0aGlzLl9vbkNsb3NlLmJpbmQodGhpcykpO1xuICAgIC8qKiBAdHlwZSB7IU1hcDxzdHJpbmcsICFDRFBTZXNzaW9uPn0qL1xuICAgIHRoaXMuX3Nlc3Npb25zID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gcGFyYW1zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD9PYmplY3Q+fVxuICAgKi9cbiAgc2VuZChtZXRob2QsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgaWQgPSArK3RoaXMuX2xhc3RJZDtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoe2lkLCBtZXRob2QsIHBhcmFtc30pO1xuICAgIGRlYnVnUHJvdG9jb2woJ1NFTkQg4pa6ICcgKyBtZXNzYWdlKTtcbiAgICB0aGlzLl90cmFuc3BvcnQuc2VuZChtZXNzYWdlKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzLnNldChpZCwge3Jlc29sdmUsIHJlamVjdCwgZXJyb3I6IG5ldyBFcnJvcigpLCBtZXRob2R9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGNhbGxiYWNrXG4gICAqL1xuICBzZXRDbG9zZWRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgIHRoaXMuX2Nsb3NlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgYXN5bmMgX29uTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKHRoaXMuX2RlbGF5KVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoZiA9PiBzZXRUaW1lb3V0KGYsIHRoaXMuX2RlbGF5KSk7XG4gICAgZGVidWdQcm90b2NvbCgn4peAIFJFQ1YgJyArIG1lc3NhZ2UpO1xuICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgaWYgKG9iamVjdC5pZCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9jYWxsYmFja3MuZ2V0KG9iamVjdC5pZCk7XG4gICAgICAvLyBDYWxsYmFja3MgY291bGQgYmUgYWxsIHJlamVjdGVkIGlmIHNvbWVvbmUgaGFzIGNhbGxlZCBgLmRpc3Bvc2UoKWAuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmRlbGV0ZShvYmplY3QuaWQpO1xuICAgICAgICBpZiAob2JqZWN0LmVycm9yKVxuICAgICAgICAgIGNhbGxiYWNrLnJlamVjdChjcmVhdGVQcm90b2NvbEVycm9yKGNhbGxiYWNrLmVycm9yLCBjYWxsYmFjay5tZXRob2QsIG9iamVjdCkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FsbGJhY2sucmVzb2x2ZShvYmplY3QucmVzdWx0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9iamVjdC5tZXRob2QgPT09ICdUYXJnZXQucmVjZWl2ZWRNZXNzYWdlRnJvbVRhcmdldCcpIHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IHRoaXMuX3Nlc3Npb25zLmdldChvYmplY3QucGFyYW1zLnNlc3Npb25JZCk7XG4gICAgICAgIGlmIChzZXNzaW9uKVxuICAgICAgICAgIHNlc3Npb24uX29uTWVzc2FnZShvYmplY3QucGFyYW1zLm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3QubWV0aG9kID09PSAnVGFyZ2V0LmRldGFjaGVkRnJvbVRhcmdldCcpIHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IHRoaXMuX3Nlc3Npb25zLmdldChvYmplY3QucGFyYW1zLnNlc3Npb25JZCk7XG4gICAgICAgIGlmIChzZXNzaW9uKVxuICAgICAgICAgIHNlc3Npb24uX29uQ2xvc2VkKCk7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25zLmRlbGV0ZShvYmplY3QucGFyYW1zLnNlc3Npb25JZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQob2JqZWN0Lm1ldGhvZCwgb2JqZWN0LnBhcmFtcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uQ2xvc2UoKSB7XG4gICAgaWYgKHRoaXMuX2Nsb3NlQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX2Nsb3NlQ2FsbGJhY2soKTtcbiAgICAgIHRoaXMuX2Nsb3NlQ2FsbGJhY2sgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl90cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgLy8gSWYgdHJhbnNwb3J0IHRocm93cyBhbnkgZXJyb3IgYXQgdGhpcyBwb2ludCBvZiB0aW1lLCB3ZSBkb24ndCBjYXJlIGFuZCBzaG91bGQgc3dhbGxvdyBpdC5cbiAgICB0aGlzLl90cmFuc3BvcnQub24oJ2Vycm9yJywgKCkgPT4ge30pO1xuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5fY2FsbGJhY2tzLnZhbHVlcygpKVxuICAgICAgY2FsbGJhY2sucmVqZWN0KHJld3JpdGVFcnJvcihjYWxsYmFjay5lcnJvciwgYFByb3RvY29sIGVycm9yICgke2NhbGxiYWNrLm1ldGhvZH0pOiBUYXJnZXQgY2xvc2VkLmApKTtcbiAgICB0aGlzLl9jYWxsYmFja3MuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IHNlc3Npb24gb2YgdGhpcy5fc2Vzc2lvbnMudmFsdWVzKCkpXG4gICAgICBzZXNzaW9uLl9vbkNsb3NlZCgpO1xuICAgIHRoaXMuX3Nlc3Npb25zLmNsZWFyKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX29uQ2xvc2UoKTtcbiAgICB0aGlzLl90cmFuc3BvcnQuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1Byb3RvY29sLlRhcmdldC5UYXJnZXRJbmZvfSB0YXJnZXRJbmZvXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFDRFBTZXNzaW9uPn1cbiAgICovXG4gIGFzeW5jIGNyZWF0ZVNlc3Npb24odGFyZ2V0SW5mbykge1xuICAgIGNvbnN0IHtzZXNzaW9uSWR9ID0gYXdhaXQgdGhpcy5zZW5kKCdUYXJnZXQuYXR0YWNoVG9UYXJnZXQnLCB7dGFyZ2V0SWQ6IHRhcmdldEluZm8udGFyZ2V0SWR9KTtcbiAgICBjb25zdCBzZXNzaW9uID0gbmV3IENEUFNlc3Npb24odGhpcywgdGFyZ2V0SW5mby50eXBlLCBzZXNzaW9uSWQpO1xuICAgIHRoaXMuX3Nlc3Npb25zLnNldChzZXNzaW9uSWQsIHNlc3Npb24pO1xuICAgIHJldHVybiBzZXNzaW9uO1xuICB9XG59XG5cbmNsYXNzIENEUFNlc3Npb24gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHshQ29ubmVjdGlvbnwhQ0RQU2Vzc2lvbn0gY29ubmVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0VHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vzc2lvbklkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uLCB0YXJnZXRUeXBlLCBzZXNzaW9uSWQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2xhc3RJZCA9IDA7XG4gICAgLyoqIEB0eXBlIHshTWFwPG51bWJlciwge3Jlc29sdmU6IGZ1bmN0aW9uLCByZWplY3Q6IGZ1bmN0aW9uLCBlcnJvcjogIUVycm9yLCBtZXRob2Q6IHN0cmluZ30+fSovXG4gICAgdGhpcy5fY2FsbGJhY2tzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIHRoaXMuX3RhcmdldFR5cGUgPSB0YXJnZXRUeXBlO1xuICAgIHRoaXMuX3Nlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICAvKiogQHR5cGUgeyFNYXA8c3RyaW5nLCAhQ0RQU2Vzc2lvbj59Ki9cbiAgICB0aGlzLl9zZXNzaW9ucyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IHBhcmFtc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/T2JqZWN0Pn1cbiAgICovXG4gIHNlbmQobWV0aG9kLCBwYXJhbXMgPSB7fSkge1xuICAgIGlmICghdGhpcy5fY29ubmVjdGlvbilcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFByb3RvY29sIGVycm9yICgke21ldGhvZH0pOiBTZXNzaW9uIGNsb3NlZC4gTW9zdCBsaWtlbHkgdGhlICR7dGhpcy5fdGFyZ2V0VHlwZX0gaGFzIGJlZW4gY2xvc2VkLmApKTtcbiAgICBjb25zdCBpZCA9ICsrdGhpcy5fbGFzdElkO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh7aWQsIG1ldGhvZCwgcGFyYW1zfSk7XG4gICAgZGVidWdTZXNzaW9uKCdTRU5EIOKWuiAnICsgbWVzc2FnZSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5zZW5kKCdUYXJnZXQuc2VuZE1lc3NhZ2VUb1RhcmdldCcsIHtzZXNzaW9uSWQ6IHRoaXMuX3Nlc3Npb25JZCwgbWVzc2FnZX0pLmNhdGNoKGUgPT4ge1xuICAgICAgLy8gVGhlIHJlc3BvbnNlIGZyb20gdGFyZ2V0IG1pZ2h0IGhhdmUgYmVlbiBhbHJlYWR5IGRpc3BhdGNoZWQuXG4gICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrcy5oYXMoaWQpKVxuICAgICAgICByZXR1cm47XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrcy5nZXQoaWQpO1xuICAgICAgdGhpcy5fY2FsbGJhY2tzLmRlbGV0ZShpZCk7XG4gICAgICBjYWxsYmFjay5yZWplY3QocmV3cml0ZUVycm9yKGNhbGxiYWNrLmVycm9yLCBlICYmIGUubWVzc2FnZSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3Muc2V0KGlkLCB7cmVzb2x2ZSwgcmVqZWN0LCBlcnJvcjogbmV3IEVycm9yKCksIG1ldGhvZH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICBfb25NZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBkZWJ1Z1Nlc3Npb24oJ+KXgCBSRUNWICcgKyBtZXNzYWdlKTtcbiAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xuICAgIGlmIChvYmplY3QuaWQgJiYgdGhpcy5fY2FsbGJhY2tzLmhhcyhvYmplY3QuaWQpKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrcy5nZXQob2JqZWN0LmlkKTtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcy5kZWxldGUob2JqZWN0LmlkKTtcbiAgICAgIGlmIChvYmplY3QuZXJyb3IpXG4gICAgICAgIGNhbGxiYWNrLnJlamVjdChjcmVhdGVQcm90b2NvbEVycm9yKGNhbGxiYWNrLmVycm9yLCBjYWxsYmFjay5tZXRob2QsIG9iamVjdCkpO1xuICAgICAgZWxzZVxuICAgICAgICBjYWxsYmFjay5yZXNvbHZlKG9iamVjdC5yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2JqZWN0Lm1ldGhvZCA9PT0gJ1RhcmdldC5yZWNlaXZlZE1lc3NhZ2VGcm9tVGFyZ2V0Jykge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5fc2Vzc2lvbnMuZ2V0KG9iamVjdC5wYXJhbXMuc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKHNlc3Npb24pXG4gICAgICAgICAgc2Vzc2lvbi5fb25NZXNzYWdlKG9iamVjdC5wYXJhbXMubWVzc2FnZSk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdC5tZXRob2QgPT09ICdUYXJnZXQuZGV0YWNoZWRGcm9tVGFyZ2V0Jykge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5fc2Vzc2lvbnMuZ2V0KG9iamVjdC5wYXJhbXMuc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICBzZXNzaW9uLl9vbkNsb3NlZCgpO1xuICAgICAgICAgIHRoaXMuX3Nlc3Npb25zLmRlbGV0ZShvYmplY3QucGFyYW1zLnNlc3Npb25JZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFzc2VydCghb2JqZWN0LmlkKTtcbiAgICAgIHRoaXMuZW1pdChvYmplY3QubWV0aG9kLCBvYmplY3QucGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkZXRhY2goKSB7XG4gICAgYXdhaXQgdGhpcy5fY29ubmVjdGlvbi5zZW5kKCdUYXJnZXQuZGV0YWNoRnJvbVRhcmdldCcsICB7c2Vzc2lvbklkOiB0aGlzLl9zZXNzaW9uSWR9KTtcbiAgfVxuXG4gIF9vbkNsb3NlZCgpIHtcbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuX2NhbGxiYWNrcy52YWx1ZXMoKSlcbiAgICAgIGNhbGxiYWNrLnJlamVjdChyZXdyaXRlRXJyb3IoY2FsbGJhY2suZXJyb3IsIGBQcm90b2NvbCBlcnJvciAoJHtjYWxsYmFjay5tZXRob2R9KTogVGFyZ2V0IGNsb3NlZC5gKSk7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25JZFxuICAgKi9cbiAgX2NyZWF0ZVNlc3Npb24odGFyZ2V0VHlwZSwgc2Vzc2lvbklkKSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IG5ldyBDRFBTZXNzaW9uKHRoaXMsIHRhcmdldFR5cGUsIHNlc3Npb25JZCk7XG4gICAgdGhpcy5fc2Vzc2lvbnMuc2V0KHNlc3Npb25JZCwgc2Vzc2lvbik7XG4gICAgcmV0dXJuIHNlc3Npb247XG4gIH1cbn1cbmhlbHBlci50cmFjZVB1YmxpY0FQSShDRFBTZXNzaW9uKTtcblxuLyoqXG4gKiBAcGFyYW0geyFFcnJvcn0gZXJyb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7e2Vycm9yOiB7bWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnl9fX0gb2JqZWN0XG4gKiBAcmV0dXJuIHshRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb3RvY29sRXJyb3IoZXJyb3IsIG1ldGhvZCwgb2JqZWN0KSB7XG4gIGxldCBtZXNzYWdlID0gYFByb3RvY29sIGVycm9yICgke21ldGhvZH0pOiAke29iamVjdC5lcnJvci5tZXNzYWdlfWA7XG4gIGlmICgnZGF0YScgaW4gb2JqZWN0LmVycm9yKVxuICAgIG1lc3NhZ2UgKz0gYCAke29iamVjdC5lcnJvci5kYXRhfWA7XG4gIGlmIChvYmplY3QuZXJyb3IubWVzc2FnZSlcbiAgICByZXR1cm4gcmV3cml0ZUVycm9yKGVycm9yLCBtZXNzYWdlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFFcnJvcn0gZXJyb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKiBAcmV0dXJuIHshRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIHJld3JpdGVFcnJvcihlcnJvciwgbWVzc2FnZSkge1xuICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZTtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtDb25uZWN0aW9uLCBDRFBTZXNzaW9ufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3Qge2hlbHBlciwgZGVidWdFcnJvciwgYXNzZXJ0fSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5cbmNvbnN0IHtFVkFMVUFUSU9OX1NDUklQVF9VUkx9ID0gcmVxdWlyZSgnLi9FeGVjdXRpb25Db250ZXh0Jyk7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gQ292ZXJhZ2VFbnRyeVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHVybFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRleHRcbiAqIEBwcm9wZXJ0eSB7IUFycmF5PCF7c3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXJ9Pn0gcmFuZ2VzXG4gKi9cblxuY2xhc3MgQ292ZXJhZ2Uge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgdGhpcy5fanNDb3ZlcmFnZSA9IG5ldyBKU0NvdmVyYWdlKGNsaWVudCk7XG4gICAgdGhpcy5fY3NzQ292ZXJhZ2UgPSBuZXcgQ1NTQ292ZXJhZ2UoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHN0YXJ0SlNDb3ZlcmFnZShvcHRpb25zKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2pzQ292ZXJhZ2Uuc3RhcnQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFDb3ZlcmFnZUVudHJ5Pj59XG4gICAqL1xuICBhc3luYyBzdG9wSlNDb3ZlcmFnZSgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fanNDb3ZlcmFnZS5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBzdGFydENTU0NvdmVyYWdlKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fY3NzQ292ZXJhZ2Uuc3RhcnQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFDb3ZlcmFnZUVudHJ5Pj59XG4gICAqL1xuICBhc3luYyBzdG9wQ1NTQ292ZXJhZ2UoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2Nzc0NvdmVyYWdlLnN0b3AoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtDb3ZlcmFnZX07XG5oZWxwZXIudHJhY2VQdWJsaWNBUEkoQ292ZXJhZ2UpO1xuXG5jbGFzcyBKU0NvdmVyYWdlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5DRFBTZXNzaW9ufSBjbGllbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCkge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9lbmFibGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc2NyaXB0VVJMcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9zY3JpcHRTb3VyY2VzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5fcmVzZXRPbk5hdmlnYXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHN0YXJ0KG9wdGlvbnMgPSB7fSkge1xuICAgIGFzc2VydCghdGhpcy5fZW5hYmxlZCwgJ0pTQ292ZXJhZ2UgaXMgYWxyZWFkeSBlbmFibGVkJyk7XG4gICAgdGhpcy5fcmVzZXRPbk5hdmlnYXRpb24gPSBvcHRpb25zLnJlc2V0T25OYXZpZ2F0aW9uID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFvcHRpb25zLnJlc2V0T25OYXZpZ2F0aW9uO1xuICAgIHRoaXMuX3JlcG9ydEFub255bW91c1NjcmlwdHMgPSAhIW9wdGlvbnMucmVwb3J0QW5vbnltb3VzU2NyaXB0cztcbiAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zY3JpcHRVUkxzLmNsZWFyKCk7XG4gICAgdGhpcy5fc2NyaXB0U291cmNlcy5jbGVhcigpO1xuICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gW1xuICAgICAgaGVscGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fY2xpZW50LCAnRGVidWdnZXIuc2NyaXB0UGFyc2VkJywgdGhpcy5fb25TY3JpcHRQYXJzZWQuYmluZCh0aGlzKSksXG4gICAgICBoZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLl9jbGllbnQsICdSdW50aW1lLmV4ZWN1dGlvbkNvbnRleHRzQ2xlYXJlZCcsIHRoaXMuX29uRXhlY3V0aW9uQ29udGV4dHNDbGVhcmVkLmJpbmQodGhpcykpLFxuICAgIF07XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ1Byb2ZpbGVyLmVuYWJsZScpLFxuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ1Byb2ZpbGVyLnN0YXJ0UHJlY2lzZUNvdmVyYWdlJywge2NhbGxDb3VudDogZmFsc2UsIGRldGFpbGVkOiB0cnVlfSksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRGVidWdnZXIuZW5hYmxlJyksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRGVidWdnZXIuc2V0U2tpcEFsbFBhdXNlcycsIHtza2lwOiB0cnVlfSlcbiAgICBdKTtcbiAgfVxuXG4gIF9vbkV4ZWN1dGlvbkNvbnRleHRzQ2xlYXJlZCgpIHtcbiAgICBpZiAoIXRoaXMuX3Jlc2V0T25OYXZpZ2F0aW9uKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX3NjcmlwdFVSTHMuY2xlYXIoKTtcbiAgICB0aGlzLl9zY3JpcHRTb3VyY2VzLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuRGVidWdnZXIuc2NyaXB0UGFyc2VkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIGFzeW5jIF9vblNjcmlwdFBhcnNlZChldmVudCkge1xuICAgIC8vIElnbm9yZSBwdXBwZXRlZXItaW5qZWN0ZWQgc2NyaXB0c1xuICAgIGlmIChldmVudC51cmwgPT09IEVWQUxVQVRJT05fU0NSSVBUX1VSTClcbiAgICAgIHJldHVybjtcbiAgICAvLyBJZ25vcmUgb3RoZXIgYW5vbnltb3VzIHNjcmlwdHMgdW5sZXNzIHRoZSByZXBvcnRBbm9ueW1vdXNTY3JpcHRzIG9wdGlvbiBpcyB0cnVlLlxuICAgIGlmICghZXZlbnQudXJsICYmICF0aGlzLl9yZXBvcnRBbm9ueW1vdXNTY3JpcHRzKVxuICAgICAgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdEZWJ1Z2dlci5nZXRTY3JpcHRTb3VyY2UnLCB7c2NyaXB0SWQ6IGV2ZW50LnNjcmlwdElkfSk7XG4gICAgICB0aGlzLl9zY3JpcHRVUkxzLnNldChldmVudC5zY3JpcHRJZCwgZXZlbnQudXJsKTtcbiAgICAgIHRoaXMuX3NjcmlwdFNvdXJjZXMuc2V0KGV2ZW50LnNjcmlwdElkLCByZXNwb25zZS5zY3JpcHRTb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFRoaXMgbWlnaHQgaGFwcGVuIGlmIHRoZSBwYWdlIGhhcyBhbHJlYWR5IG5hdmlnYXRlZCBhd2F5LlxuICAgICAgZGVidWdFcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFDb3ZlcmFnZUVudHJ5Pj59XG4gICAqL1xuICBhc3luYyBzdG9wKCkge1xuICAgIGFzc2VydCh0aGlzLl9lbmFibGVkLCAnSlNDb3ZlcmFnZSBpcyBub3QgZW5hYmxlZCcpO1xuICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdCBbcHJvZmlsZVJlc3BvbnNlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuX2NsaWVudC5zZW5kKCdQcm9maWxlci50YWtlUHJlY2lzZUNvdmVyYWdlJyksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnUHJvZmlsZXIuc3RvcFByZWNpc2VDb3ZlcmFnZScpLFxuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ1Byb2ZpbGVyLmRpc2FibGUnKSxcbiAgICAgIHRoaXMuX2NsaWVudC5zZW5kKCdEZWJ1Z2dlci5kaXNhYmxlJyksXG4gICAgXSk7XG4gICAgaGVscGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMuX2V2ZW50TGlzdGVuZXJzKTtcblxuICAgIGNvbnN0IGNvdmVyYWdlID0gW107XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBwcm9maWxlUmVzcG9uc2UucmVzdWx0KSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5fc2NyaXB0VVJMcy5nZXQoZW50cnkuc2NyaXB0SWQpO1xuICAgICAgaWYgKCF1cmwgJiYgdGhpcy5fcmVwb3J0QW5vbnltb3VzU2NyaXB0cylcbiAgICAgICAgdXJsID0gJ2RlYnVnZ2VyOi8vVk0nICsgZW50cnkuc2NyaXB0SWQ7XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5fc2NyaXB0U291cmNlcy5nZXQoZW50cnkuc2NyaXB0SWQpO1xuICAgICAgaWYgKHRleHQgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgY29udGludWU7XG4gICAgICBjb25zdCBmbGF0dGVuUmFuZ2VzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgZW50cnkuZnVuY3Rpb25zKVxuICAgICAgICBmbGF0dGVuUmFuZ2VzLnB1c2goLi4uZnVuYy5yYW5nZXMpO1xuICAgICAgY29uc3QgcmFuZ2VzID0gY29udmVydFRvRGlzam9pbnRSYW5nZXMoZmxhdHRlblJhbmdlcyk7XG4gICAgICBjb3ZlcmFnZS5wdXNoKHt1cmwsIHJhbmdlcywgdGV4dH0pO1xuICAgIH1cbiAgICByZXR1cm4gY292ZXJhZ2U7XG4gIH1cbn1cblxuY2xhc3MgQ1NTQ292ZXJhZ2Uge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdHlsZXNoZWV0VVJMcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9zdHlsZXNoZWV0U291cmNlcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9ldmVudExpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX3Jlc2V0T25OYXZpZ2F0aW9uID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBzdGFydChvcHRpb25zID0ge30pIHtcbiAgICBhc3NlcnQoIXRoaXMuX2VuYWJsZWQsICdDU1NDb3ZlcmFnZSBpcyBhbHJlYWR5IGVuYWJsZWQnKTtcbiAgICB0aGlzLl9yZXNldE9uTmF2aWdhdGlvbiA9IG9wdGlvbnMucmVzZXRPbk5hdmlnYXRpb24gPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIW9wdGlvbnMucmVzZXRPbk5hdmlnYXRpb247XG4gICAgdGhpcy5fZW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5fc3R5bGVzaGVldFVSTHMuY2xlYXIoKTtcbiAgICB0aGlzLl9zdHlsZXNoZWV0U291cmNlcy5jbGVhcigpO1xuICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gW1xuICAgICAgaGVscGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fY2xpZW50LCAnQ1NTLnN0eWxlU2hlZXRBZGRlZCcsIHRoaXMuX29uU3R5bGVTaGVldC5iaW5kKHRoaXMpKSxcbiAgICAgIGhlbHBlci5hZGRFdmVudExpc3RlbmVyKHRoaXMuX2NsaWVudCwgJ1J1bnRpbWUuZXhlY3V0aW9uQ29udGV4dHNDbGVhcmVkJywgdGhpcy5fb25FeGVjdXRpb25Db250ZXh0c0NsZWFyZWQuYmluZCh0aGlzKSksXG4gICAgXTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRE9NLmVuYWJsZScpLFxuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ0NTUy5lbmFibGUnKSxcbiAgICAgIHRoaXMuX2NsaWVudC5zZW5kKCdDU1Muc3RhcnRSdWxlVXNhZ2VUcmFja2luZycpLFxuICAgIF0pO1xuICB9XG5cbiAgX29uRXhlY3V0aW9uQ29udGV4dHNDbGVhcmVkKCkge1xuICAgIGlmICghdGhpcy5fcmVzZXRPbk5hdmlnYXRpb24pXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5fc3R5bGVzaGVldFVSTHMuY2xlYXIoKTtcbiAgICB0aGlzLl9zdHlsZXNoZWV0U291cmNlcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLkNTUy5zdHlsZVNoZWV0QWRkZWRQYXlsb2FkfSBldmVudFxuICAgKi9cbiAgYXN5bmMgX29uU3R5bGVTaGVldChldmVudCkge1xuICAgIGNvbnN0IGhlYWRlciA9IGV2ZW50LmhlYWRlcjtcbiAgICAvLyBJZ25vcmUgYW5vbnltb3VzIHNjcmlwdHNcbiAgICBpZiAoIWhlYWRlci5zb3VyY2VVUkwpXG4gICAgICByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ0NTUy5nZXRTdHlsZVNoZWV0VGV4dCcsIHtzdHlsZVNoZWV0SWQ6IGhlYWRlci5zdHlsZVNoZWV0SWR9KTtcbiAgICAgIHRoaXMuX3N0eWxlc2hlZXRVUkxzLnNldChoZWFkZXIuc3R5bGVTaGVldElkLCBoZWFkZXIuc291cmNlVVJMKTtcbiAgICAgIHRoaXMuX3N0eWxlc2hlZXRTb3VyY2VzLnNldChoZWFkZXIuc3R5bGVTaGVldElkLCByZXNwb25zZS50ZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBpZiB0aGUgcGFnZSBoYXMgYWxyZWFkeSBuYXZpZ2F0ZWQgYXdheS5cbiAgICAgIGRlYnVnRXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFBcnJheTwhQ292ZXJhZ2VFbnRyeT4+fVxuICAgKi9cbiAgYXN5bmMgc3RvcCgpIHtcbiAgICBhc3NlcnQodGhpcy5fZW5hYmxlZCwgJ0NTU0NvdmVyYWdlIGlzIG5vdCBlbmFibGVkJyk7XG4gICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IFtydWxlVHJhY2tpbmdSZXNwb25zZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnQ1NTLnN0b3BSdWxlVXNhZ2VUcmFja2luZycpLFxuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ0NTUy5kaXNhYmxlJyksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRE9NLmRpc2FibGUnKSxcbiAgICBdKTtcbiAgICBoZWxwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnModGhpcy5fZXZlbnRMaXN0ZW5lcnMpO1xuXG4gICAgLy8gYWdncmVnYXRlIGJ5IHN0eWxlU2hlZXRJZFxuICAgIGNvbnN0IHN0eWxlU2hlZXRJZFRvQ292ZXJhZ2UgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBydWxlVHJhY2tpbmdSZXNwb25zZS5ydWxlVXNhZ2UpIHtcbiAgICAgIGxldCByYW5nZXMgPSBzdHlsZVNoZWV0SWRUb0NvdmVyYWdlLmdldChlbnRyeS5zdHlsZVNoZWV0SWQpO1xuICAgICAgaWYgKCFyYW5nZXMpIHtcbiAgICAgICAgcmFuZ2VzID0gW107XG4gICAgICAgIHN0eWxlU2hlZXRJZFRvQ292ZXJhZ2Uuc2V0KGVudHJ5LnN0eWxlU2hlZXRJZCwgcmFuZ2VzKTtcbiAgICAgIH1cbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgc3RhcnRPZmZzZXQ6IGVudHJ5LnN0YXJ0T2Zmc2V0LFxuICAgICAgICBlbmRPZmZzZXQ6IGVudHJ5LmVuZE9mZnNldCxcbiAgICAgICAgY291bnQ6IGVudHJ5LnVzZWQgPyAxIDogMCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNvdmVyYWdlID0gW107XG4gICAgZm9yIChjb25zdCBzdHlsZVNoZWV0SWQgb2YgdGhpcy5fc3R5bGVzaGVldFVSTHMua2V5cygpKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLl9zdHlsZXNoZWV0VVJMcy5nZXQoc3R5bGVTaGVldElkKTtcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLl9zdHlsZXNoZWV0U291cmNlcy5nZXQoc3R5bGVTaGVldElkKTtcbiAgICAgIGNvbnN0IHJhbmdlcyA9IGNvbnZlcnRUb0Rpc2pvaW50UmFuZ2VzKHN0eWxlU2hlZXRJZFRvQ292ZXJhZ2UuZ2V0KHN0eWxlU2hlZXRJZCkgfHwgW10pO1xuICAgICAgY292ZXJhZ2UucHVzaCh7dXJsLCByYW5nZXMsIHRleHR9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY292ZXJhZ2U7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0geyFBcnJheTwhe3N0YXJ0T2Zmc2V0Om51bWJlciwgZW5kT2Zmc2V0Om51bWJlciwgY291bnQ6bnVtYmVyfT59IG5lc3RlZFJhbmdlc1xuICogQHJldHVybiB7IUFycmF5PCF7c3RhcnQ6bnVtYmVyLCBlbmQ6bnVtYmVyfT59XG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRUb0Rpc2pvaW50UmFuZ2VzKG5lc3RlZFJhbmdlcykge1xuICBjb25zdCBwb2ludHMgPSBbXTtcbiAgZm9yIChjb25zdCByYW5nZSBvZiBuZXN0ZWRSYW5nZXMpIHtcbiAgICBwb2ludHMucHVzaCh7IG9mZnNldDogcmFuZ2Uuc3RhcnRPZmZzZXQsIHR5cGU6IDAsIHJhbmdlIH0pO1xuICAgIHBvaW50cy5wdXNoKHsgb2Zmc2V0OiByYW5nZS5lbmRPZmZzZXQsIHR5cGU6IDEsIHJhbmdlIH0pO1xuICB9XG4gIC8vIFNvcnQgcG9pbnRzIHRvIGZvcm0gYSB2YWxpZCBwYXJlbnRoZXNpcyBzZXF1ZW5jZS5cbiAgcG9pbnRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAvLyBTb3J0IHdpdGggaW5jcmVhc2luZyBvZmZzZXRzLlxuICAgIGlmIChhLm9mZnNldCAhPT0gYi5vZmZzZXQpXG4gICAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgICAvLyBBbGwgXCJlbmRcIiBwb2ludHMgc2hvdWxkIGdvIGJlZm9yZSBcInN0YXJ0XCIgcG9pbnRzLlxuICAgIGlmIChhLnR5cGUgIT09IGIudHlwZSlcbiAgICAgIHJldHVybiBiLnR5cGUgLSBhLnR5cGU7XG4gICAgY29uc3QgYUxlbmd0aCA9IGEucmFuZ2UuZW5kT2Zmc2V0IC0gYS5yYW5nZS5zdGFydE9mZnNldDtcbiAgICBjb25zdCBiTGVuZ3RoID0gYi5yYW5nZS5lbmRPZmZzZXQgLSBiLnJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgIC8vIEZvciB0d28gXCJzdGFydFwiIHBvaW50cywgdGhlIG9uZSB3aXRoIGxvbmdlciByYW5nZSBnb2VzIGZpcnN0LlxuICAgIGlmIChhLnR5cGUgPT09IDApXG4gICAgICByZXR1cm4gYkxlbmd0aCAtIGFMZW5ndGg7XG4gICAgLy8gRm9yIHR3byBcImVuZFwiIHBvaW50cywgdGhlIG9uZSB3aXRoIHNob3J0ZXIgcmFuZ2UgZ29lcyBmaXJzdC5cbiAgICByZXR1cm4gYUxlbmd0aCAtIGJMZW5ndGg7XG4gIH0pO1xuXG4gIGNvbnN0IGhpdENvdW50U3RhY2sgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICBsZXQgbGFzdE9mZnNldCA9IDA7XG4gIC8vIFJ1biBzY2FubmluZyBsaW5lIHRvIGludGVyc2VjdCBhbGwgcmFuZ2VzLlxuICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgIGlmIChoaXRDb3VudFN0YWNrLmxlbmd0aCAmJiBsYXN0T2Zmc2V0IDwgcG9pbnQub2Zmc2V0ICYmIGhpdENvdW50U3RhY2tbaGl0Q291bnRTdGFjay5sZW5ndGggLSAxXSA+IDApIHtcbiAgICAgIGNvbnN0IGxhc3RSZXN1bHQgPSByZXN1bHRzLmxlbmd0aCA/IHJlc3VsdHNbcmVzdWx0cy5sZW5ndGggLSAxXSA6IG51bGw7XG4gICAgICBpZiAobGFzdFJlc3VsdCAmJiBsYXN0UmVzdWx0LmVuZCA9PT0gbGFzdE9mZnNldClcbiAgICAgICAgbGFzdFJlc3VsdC5lbmQgPSBwb2ludC5vZmZzZXQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJlc3VsdHMucHVzaCh7c3RhcnQ6IGxhc3RPZmZzZXQsIGVuZDogcG9pbnQub2Zmc2V0fSk7XG4gICAgfVxuICAgIGxhc3RPZmZzZXQgPSBwb2ludC5vZmZzZXQ7XG4gICAgaWYgKHBvaW50LnR5cGUgPT09IDApXG4gICAgICBoaXRDb3VudFN0YWNrLnB1c2gocG9pbnQucmFuZ2UuY291bnQpO1xuICAgIGVsc2VcbiAgICAgIGhpdENvdW50U3RhY2sucG9wKCk7XG4gIH1cbiAgLy8gRmlsdGVyIG91dCBlbXB0eSByYW5nZXMuXG4gIHJldHVybiByZXN1bHRzLmZpbHRlcihyYW5nZSA9PiByYW5nZS5lbmQgLSByYW5nZS5zdGFydCA+IDEpO1xufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNvbnN0IHtoZWxwZXIsIGFzc2VydH0gPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuXG5jbGFzcyBEaWFsb2cge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8dW5kZWZpbmVkKX0gZGVmYXVsdFZhbHVlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIHR5cGUsIG1lc3NhZ2UsIGRlZmF1bHRWYWx1ZSA9ICcnKSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBtZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGRlZmF1bHRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcHJvbXB0VGV4dFxuICAgKi9cbiAgYXN5bmMgYWNjZXB0KHByb21wdFRleHQpIHtcbiAgICBhc3NlcnQoIXRoaXMuX2hhbmRsZWQsICdDYW5ub3QgYWNjZXB0IGRpYWxvZyB3aGljaCBpcyBhbHJlYWR5IGhhbmRsZWQhJyk7XG4gICAgdGhpcy5faGFuZGxlZCA9IHRydWU7XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1BhZ2UuaGFuZGxlSmF2YVNjcmlwdERpYWxvZycsIHtcbiAgICAgIGFjY2VwdDogdHJ1ZSxcbiAgICAgIHByb21wdFRleHQ6IHByb21wdFRleHRcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRpc21pc3MoKSB7XG4gICAgYXNzZXJ0KCF0aGlzLl9oYW5kbGVkLCAnQ2Fubm90IGRpc21pc3MgZGlhbG9nIHdoaWNoIGlzIGFscmVhZHkgaGFuZGxlZCEnKTtcbiAgICB0aGlzLl9oYW5kbGVkID0gdHJ1ZTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnUGFnZS5oYW5kbGVKYXZhU2NyaXB0RGlhbG9nJywge1xuICAgICAgYWNjZXB0OiBmYWxzZVxuICAgIH0pO1xuICB9XG59XG5cbkRpYWxvZy5UeXBlID0ge1xuICBBbGVydDogJ2FsZXJ0JyxcbiAgQmVmb3JlVW5sb2FkOiAnYmVmb3JldW5sb2FkJyxcbiAgQ29uZmlybTogJ2NvbmZpcm0nLFxuICBQcm9tcHQ6ICdwcm9tcHQnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtEaWFsb2d9O1xuaGVscGVyLnRyYWNlUHVibGljQVBJKERpYWxvZyk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qge0pTSGFuZGxlfSA9IHJlcXVpcmUoJy4vRXhlY3V0aW9uQ29udGV4dCcpO1xuY29uc3Qge2hlbHBlciwgYXNzZXJ0LCBkZWJ1Z0Vycm9yfSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5cbmNsYXNzIEVsZW1lbnRIYW5kbGUgZXh0ZW5kcyBKU0hhbmRsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuRXhlY3V0aW9uQ29udGV4dH0gY29udGV4dFxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlJ1bnRpbWUuUmVtb3RlT2JqZWN0fSByZW1vdGVPYmplY3RcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLlBhZ2V9IHBhZ2VcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkZyYW1lTWFuYWdlcn0gZnJhbWVNYW5hZ2VyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBjbGllbnQsIHJlbW90ZU9iamVjdCwgcGFnZSwgZnJhbWVNYW5hZ2VyKSB7XG4gICAgc3VwZXIoY29udGV4dCwgY2xpZW50LCByZW1vdGVPYmplY3QpO1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9yZW1vdGVPYmplY3QgPSByZW1vdGVPYmplY3Q7XG4gICAgdGhpcy5fcGFnZSA9IHBhZ2U7XG4gICAgdGhpcy5fZnJhbWVNYW5hZ2VyID0gZnJhbWVNYW5hZ2VyO1xuICAgIHRoaXMuX2Rpc3Bvc2VkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQG92ZXJyaWRlXG4gICAqIEByZXR1cm4gez9FbGVtZW50SGFuZGxlfVxuICAgKi9cbiAgYXNFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD9QdXBwZXRlZXIuRnJhbWU+fVxuICAgKi9cbiAgYXN5bmMgY29udGVudEZyYW1lKCkge1xuICAgIGNvbnN0IG5vZGVJbmZvID0gYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ0RPTS5kZXNjcmliZU5vZGUnLCB7XG4gICAgICBvYmplY3RJZDogdGhpcy5fcmVtb3RlT2JqZWN0Lm9iamVjdElkXG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBub2RlSW5mby5ub2RlLmZyYW1lSWQgIT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lTWFuYWdlci5mcmFtZShub2RlSW5mby5ub2RlLmZyYW1lSWQpO1xuICB9XG5cbiAgYXN5bmMgX3Njcm9sbEludG9WaWV3SWZOZWVkZWQoKSB7XG4gICAgY29uc3QgZXJyb3IgPSBhd2FpdCB0aGlzLmV4ZWN1dGlvbkNvbnRleHQoKS5ldmFsdWF0ZShhc3luYyhlbGVtZW50LCBwYWdlSmF2YXNjcmlwdEVuYWJsZWQpID0+IHtcbiAgICAgIGlmICghZWxlbWVudC5pc0Nvbm5lY3RlZClcbiAgICAgICAgcmV0dXJuICdOb2RlIGlzIGRldGFjaGVkIGZyb20gZG9jdW1lbnQnO1xuICAgICAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICByZXR1cm4gJ05vZGUgaXMgbm90IG9mIHR5cGUgSFRNTEVsZW1lbnQnO1xuICAgICAgLy8gZm9yY2Utc2Nyb2xsIGlmIHBhZ2UncyBqYXZhc2NyaXB0IGlzIGRpc2FibGVkLlxuICAgICAgaWYgKCFwYWdlSmF2YXNjcmlwdEVuYWJsZWQpIHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInLCBiZWhhdmlvcjogJ2luc3RhbnQnfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZpc2libGVSYXRpbyA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgICAgICByZXNvbHZlKGVudHJpZXNbMF0uaW50ZXJzZWN0aW9uUmF0aW8pO1xuICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh2aXNpYmxlUmF0aW8gIT09IDEuMClcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInLCBiZWhhdmlvcjogJ2luc3RhbnQnfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgdGhpcywgdGhpcy5fcGFnZS5famF2YXNjcmlwdEVuYWJsZWQpO1xuICAgIGlmIChlcnJvcilcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IXt4OiBudW1iZXIsIHk6IG51bWJlcn0+fVxuICAgKi9cbiAgYXN5bmMgX2NsaWNrYWJsZVBvaW50KCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdET00uZ2V0Q29udGVudFF1YWRzJywge1xuICAgICAgb2JqZWN0SWQ6IHRoaXMuX3JlbW90ZU9iamVjdC5vYmplY3RJZFxuICAgIH0pLmNhdGNoKGRlYnVnRXJyb3IpO1xuICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQucXVhZHMubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGlzIGVpdGhlciBub3QgdmlzaWJsZSBvciBub3QgYW4gSFRNTEVsZW1lbnQnKTtcbiAgICAvLyBGaWx0ZXIgb3V0IHF1YWRzIHRoYXQgaGF2ZSB0b28gc21hbGwgYXJlYSB0byBjbGljayBpbnRvLlxuICAgIGNvbnN0IHF1YWRzID0gcmVzdWx0LnF1YWRzLm1hcChxdWFkID0+IHRoaXMuX2Zyb21Qcm90b2NvbFF1YWQocXVhZCkpLmZpbHRlcihxdWFkID0+IGNvbXB1dGVRdWFkQXJlYShxdWFkKSA+IDEpO1xuICAgIGlmICghcXVhZHMubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlIGlzIGVpdGhlciBub3QgdmlzaWJsZSBvciBub3QgYW4gSFRNTEVsZW1lbnQnKTtcbiAgICAvLyBSZXR1cm4gdGhlIG1pZGRsZSBwb2ludCBvZiB0aGUgZmlyc3QgcXVhZC5cbiAgICBjb25zdCBxdWFkID0gcXVhZHNbMF07XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHF1YWQpIHtcbiAgICAgIHggKz0gcG9pbnQueDtcbiAgICAgIHkgKz0gcG9pbnQueTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHggLyA0LFxuICAgICAgeTogeSAvIDRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPHZvaWR8UHJvdG9jb2wuRE9NLmdldEJveE1vZGVsUmV0dXJuVmFsdWU+fVxuICAgKi9cbiAgX2dldEJveE1vZGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZCgnRE9NLmdldEJveE1vZGVsJywge1xuICAgICAgb2JqZWN0SWQ6IHRoaXMuX3JlbW90ZU9iamVjdC5vYmplY3RJZFxuICAgIH0pLmNhdGNoKGVycm9yID0+IGRlYnVnRXJyb3IoZXJyb3IpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFBcnJheTxudW1iZXI+fSBxdWFkXG4gICAqIEByZXR1cm4geyFBcnJheTxvYmplY3Q+fVxuICAgKi9cbiAgX2Zyb21Qcm90b2NvbFF1YWQocXVhZCkge1xuICAgIHJldHVybiBbXG4gICAgICB7eDogcXVhZFswXSwgeTogcXVhZFsxXX0sXG4gICAgICB7eDogcXVhZFsyXSwgeTogcXVhZFszXX0sXG4gICAgICB7eDogcXVhZFs0XSwgeTogcXVhZFs1XX0sXG4gICAgICB7eDogcXVhZFs2XSwgeTogcXVhZFs3XX1cbiAgICBdO1xuICB9XG5cbiAgYXN5bmMgaG92ZXIoKSB7XG4gICAgYXdhaXQgdGhpcy5fc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICAgIGNvbnN0IHt4LCB5fSA9IGF3YWl0IHRoaXMuX2NsaWNrYWJsZVBvaW50KCk7XG4gICAgYXdhaXQgdGhpcy5fcGFnZS5tb3VzZS5tb3ZlKHgsIHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIGNsaWNrKG9wdGlvbnMgPSB7fSkge1xuICAgIGF3YWl0IHRoaXMuX3Njcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICBjb25zdCB7eCwgeX0gPSBhd2FpdCB0aGlzLl9jbGlja2FibGVQb2ludCgpO1xuICAgIGF3YWl0IHRoaXMuX3BhZ2UubW91c2UuY2xpY2soeCwgeSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshQXJyYXk8c3RyaW5nPn0gZmlsZVBhdGhzXG4gICAqIEByZXR1cm4geyFQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgdXBsb2FkRmlsZSguLi5maWxlUGF0aHMpIHtcbiAgICBjb25zdCBmaWxlcyA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gcGF0aC5yZXNvbHZlKGZpbGVQYXRoKSk7XG4gICAgY29uc3Qgb2JqZWN0SWQgPSB0aGlzLl9yZW1vdGVPYmplY3Qub2JqZWN0SWQ7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zZW5kKCdET00uc2V0RmlsZUlucHV0RmlsZXMnLCB7IG9iamVjdElkLCBmaWxlcyB9KTtcbiAgfVxuXG4gIGFzeW5jIHRhcCgpIHtcbiAgICBhd2FpdCB0aGlzLl9zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgY29uc3Qge3gsIHl9ID0gYXdhaXQgdGhpcy5fY2xpY2thYmxlUG9pbnQoKTtcbiAgICBhd2FpdCB0aGlzLl9wYWdlLnRvdWNoc2NyZWVuLnRhcCh4LCB5KTtcbiAgfVxuXG4gIGFzeW5jIGZvY3VzKCkge1xuICAgIGF3YWl0IHRoaXMuZXhlY3V0aW9uQ29udGV4dCgpLmV2YWx1YXRlKGVsZW1lbnQgPT4gZWxlbWVudC5mb2N1cygpLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKiBAcGFyYW0ge3tkZWxheTogKG51bWJlcnx1bmRlZmluZWQpfT19IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHR5cGUodGV4dCwgb3B0aW9ucykge1xuICAgIGF3YWl0IHRoaXMuZm9jdXMoKTtcbiAgICBhd2FpdCB0aGlzLl9wYWdlLmtleWJvYXJkLnR5cGUodGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBwcmVzcyhrZXksIG9wdGlvbnMpIHtcbiAgICBhd2FpdCB0aGlzLmZvY3VzKCk7XG4gICAgYXdhaXQgdGhpcy5fcGFnZS5rZXlib2FyZC5wcmVzcyhrZXksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD97eDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfT59XG4gICAqL1xuICBhc3luYyBib3VuZGluZ0JveCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLl9nZXRCb3hNb2RlbCgpO1xuXG4gICAgaWYgKCFyZXN1bHQpXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHF1YWQgPSByZXN1bHQubW9kZWwuYm9yZGVyO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbihxdWFkWzBdLCBxdWFkWzJdLCBxdWFkWzRdLCBxdWFkWzZdKTtcbiAgICBjb25zdCB5ID0gTWF0aC5taW4ocXVhZFsxXSwgcXVhZFszXSwgcXVhZFs1XSwgcXVhZFs3XSk7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLm1heChxdWFkWzBdLCBxdWFkWzJdLCBxdWFkWzRdLCBxdWFkWzZdKSAtIHg7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgocXVhZFsxXSwgcXVhZFszXSwgcXVhZFs1XSwgcXVhZFs3XSkgLSB5O1xuXG4gICAgcmV0dXJuIHt4LCB5LCB3aWR0aCwgaGVpZ2h0fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/b2JqZWN0Pn1cbiAgICovXG4gIGFzeW5jIGJveE1vZGVsKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuX2dldEJveE1vZGVsKCk7XG5cbiAgICBpZiAoIXJlc3VsdClcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3Qge2NvbnRlbnQsIHBhZGRpbmcsIGJvcmRlciwgbWFyZ2luLCB3aWR0aCwgaGVpZ2h0fSA9IHJlc3VsdC5tb2RlbDtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogdGhpcy5fZnJvbVByb3RvY29sUXVhZChjb250ZW50KSxcbiAgICAgIHBhZGRpbmc6IHRoaXMuX2Zyb21Qcm90b2NvbFF1YWQocGFkZGluZyksXG4gICAgICBib3JkZXI6IHRoaXMuX2Zyb21Qcm90b2NvbFF1YWQoYm9yZGVyKSxcbiAgICAgIG1hcmdpbjogdGhpcy5fZnJvbVByb3RvY29sUXVhZChtYXJnaW4pLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybnMgeyFQcm9taXNlPE9iamVjdD59XG4gICAqL1xuICBhc3luYyBzY3JlZW5zaG90KG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBuZWVkc1ZpZXdwb3J0UmVzZXQgPSBmYWxzZTtcblxuICAgIGxldCBib3VuZGluZ0JveCA9IGF3YWl0IHRoaXMuYm91bmRpbmdCb3goKTtcbiAgICBhc3NlcnQoYm91bmRpbmdCb3gsICdOb2RlIGlzIGVpdGhlciBub3QgdmlzaWJsZSBvciBub3QgYW4gSFRNTEVsZW1lbnQnKTtcblxuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fcGFnZS52aWV3cG9ydCgpO1xuXG4gICAgaWYgKGJvdW5kaW5nQm94LndpZHRoID4gdmlld3BvcnQud2lkdGggfHwgYm91bmRpbmdCb3guaGVpZ2h0ID4gdmlld3BvcnQuaGVpZ2h0KSB7XG4gICAgICBjb25zdCBuZXdWaWV3cG9ydCA9IHtcbiAgICAgICAgd2lkdGg6IE1hdGgubWF4KHZpZXdwb3J0LndpZHRoLCBNYXRoLmNlaWwoYm91bmRpbmdCb3gud2lkdGgpKSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLm1heCh2aWV3cG9ydC5oZWlnaHQsIE1hdGguY2VpbChib3VuZGluZ0JveC5oZWlnaHQpKSxcbiAgICAgIH07XG4gICAgICBhd2FpdCB0aGlzLl9wYWdlLnNldFZpZXdwb3J0KE9iamVjdC5hc3NpZ24oe30sIHZpZXdwb3J0LCBuZXdWaWV3cG9ydCkpO1xuXG4gICAgICBuZWVkc1ZpZXdwb3J0UmVzZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuX3Njcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblxuICAgIGJvdW5kaW5nQm94ID0gYXdhaXQgdGhpcy5ib3VuZGluZ0JveCgpO1xuICAgIGFzc2VydChib3VuZGluZ0JveCwgJ05vZGUgaXMgZWl0aGVyIG5vdCB2aXNpYmxlIG9yIG5vdCBhbiBIVE1MRWxlbWVudCcpO1xuXG4gICAgY29uc3QgeyBsYXlvdXRWaWV3cG9ydDogeyBwYWdlWCwgcGFnZVkgfSB9ID0gYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1BhZ2UuZ2V0TGF5b3V0TWV0cmljcycpO1xuXG4gICAgY29uc3QgY2xpcCA9IE9iamVjdC5hc3NpZ24oe30sIGJvdW5kaW5nQm94KTtcbiAgICBjbGlwLnggKz0gcGFnZVg7XG4gICAgY2xpcC55ICs9IHBhZ2VZO1xuXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gYXdhaXQgdGhpcy5fcGFnZS5zY3JlZW5zaG90KE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIGNsaXBcbiAgICB9LCBvcHRpb25zKSk7XG5cbiAgICBpZiAobmVlZHNWaWV3cG9ydFJlc2V0KVxuICAgICAgYXdhaXQgdGhpcy5fcGFnZS5zZXRWaWV3cG9ydCh2aWV3cG9ydCk7XG5cbiAgICByZXR1cm4gaW1hZ2VEYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/RWxlbWVudEhhbmRsZT59XG4gICAqL1xuICBhc3luYyAkKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgaGFuZGxlID0gYXdhaXQgdGhpcy5leGVjdXRpb25Db250ZXh0KCkuZXZhbHVhdGVIYW5kbGUoXG4gICAgICAgIChlbGVtZW50LCBzZWxlY3RvcikgPT4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSxcbiAgICAgICAgdGhpcywgc2VsZWN0b3JcbiAgICApO1xuICAgIGNvbnN0IGVsZW1lbnQgPSBoYW5kbGUuYXNFbGVtZW50KCk7XG4gICAgaWYgKGVsZW1lbnQpXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhQXJyYXk8IUVsZW1lbnRIYW5kbGU+Pn1cbiAgICovXG4gIGFzeW5jICQkKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgYXJyYXlIYW5kbGUgPSBhd2FpdCB0aGlzLmV4ZWN1dGlvbkNvbnRleHQoKS5ldmFsdWF0ZUhhbmRsZShcbiAgICAgICAgKGVsZW1lbnQsIHNlbGVjdG9yKSA9PiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLFxuICAgICAgICB0aGlzLCBzZWxlY3RvclxuICAgICk7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IGF3YWl0IGFycmF5SGFuZGxlLmdldFByb3BlcnRpZXMoKTtcbiAgICBhd2FpdCBhcnJheUhhbmRsZS5kaXNwb3NlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzLnZhbHVlcygpKSB7XG4gICAgICBjb25zdCBlbGVtZW50SGFuZGxlID0gcHJvcGVydHkuYXNFbGVtZW50KCk7XG4gICAgICBpZiAoZWxlbWVudEhhbmRsZSlcbiAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudEhhbmRsZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2U8KCFPYmplY3R8dW5kZWZpbmVkKT59XG4gICAqL1xuICBhc3luYyAkZXZhbChzZWxlY3RvciwgcGFnZUZ1bmN0aW9uLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHRoaXMuJChzZWxlY3Rvcik7XG4gICAgaWYgKCFlbGVtZW50SGFuZGxlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvcjogZmFpbGVkIHRvIGZpbmQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3RvciBcIiR7c2VsZWN0b3J9XCJgKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmV4ZWN1dGlvbkNvbnRleHQoKS5ldmFsdWF0ZShwYWdlRnVuY3Rpb24sIGVsZW1lbnRIYW5kbGUsIC4uLmFyZ3MpO1xuICAgIGF3YWl0IGVsZW1lbnRIYW5kbGUuZGlzcG9zZSgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2U8KCFPYmplY3R8dW5kZWZpbmVkKT59XG4gICAqL1xuICBhc3luYyAkJGV2YWwoc2VsZWN0b3IsIHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIGNvbnN0IGFycmF5SGFuZGxlID0gYXdhaXQgdGhpcy5leGVjdXRpb25Db250ZXh0KCkuZXZhbHVhdGVIYW5kbGUoXG4gICAgICAgIChlbGVtZW50LCBzZWxlY3RvcikgPT4gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSxcbiAgICAgICAgdGhpcywgc2VsZWN0b3JcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5leGVjdXRpb25Db250ZXh0KCkuZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCBhcnJheUhhbmRsZSwgLi4uYXJncyk7XG4gICAgYXdhaXQgYXJyYXlIYW5kbGUuZGlzcG9zZSgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4cHJlc3Npb25cbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PCFFbGVtZW50SGFuZGxlPj59XG4gICAqL1xuICBhc3luYyAkeChleHByZXNzaW9uKSB7XG4gICAgY29uc3QgYXJyYXlIYW5kbGUgPSBhd2FpdCB0aGlzLmV4ZWN1dGlvbkNvbnRleHQoKS5ldmFsdWF0ZUhhbmRsZShcbiAgICAgICAgKGVsZW1lbnQsIGV4cHJlc3Npb24pID0+IHtcbiAgICAgICAgICBjb25zdCBkb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBlbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGl0ZXJhdG9yID0gZG9jdW1lbnQuZXZhbHVhdGUoZXhwcmVzc2lvbiwgZWxlbWVudCwgbnVsbCwgWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX0lURVJBVE9SX1RZUEUpO1xuICAgICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgd2hpbGUgKChpdGVtID0gaXRlcmF0b3IuaXRlcmF0ZU5leHQoKSkpXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgfSxcbiAgICAgICAgdGhpcywgZXhwcmVzc2lvblxuICAgICk7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IGF3YWl0IGFycmF5SGFuZGxlLmdldFByb3BlcnRpZXMoKTtcbiAgICBhd2FpdCBhcnJheUhhbmRsZS5kaXNwb3NlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzLnZhbHVlcygpKSB7XG4gICAgICBjb25zdCBlbGVtZW50SGFuZGxlID0gcHJvcGVydHkuYXNFbGVtZW50KCk7XG4gICAgICBpZiAoZWxlbWVudEhhbmRsZSlcbiAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudEhhbmRsZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgeyFQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgaXNJbnRlcnNlY3RpbmdWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRpb25Db250ZXh0KCkuZXZhbHVhdGUoYXN5bmMgZWxlbWVudCA9PiB7XG4gICAgICBjb25zdCB2aXNpYmxlUmF0aW8gPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZW50cmllcyA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShlbnRyaWVzWzBdLmludGVyc2VjdGlvblJhdGlvKTtcbiAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmlzaWJsZVJhdGlvID4gMDtcbiAgICB9LCB0aGlzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlUXVhZEFyZWEocXVhZCkge1xuICAvLyBDb21wdXRlIHN1bSBvZiBhbGwgZGlyZWN0ZWQgYXJlYXMgb2YgYWRqYWNlbnQgdHJpYW5nbGVzXG4gIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1BvbHlnb24jU2ltcGxlX3BvbHlnb25zXG4gIGxldCBhcmVhID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWFkLmxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcDEgPSBxdWFkW2ldO1xuICAgIGNvbnN0IHAyID0gcXVhZFsoaSArIDEpICUgcXVhZC5sZW5ndGhdO1xuICAgIGFyZWEgKz0gKHAxLnggKiBwMi55IC0gcDIueCAqIHAxLnkpIC8gMjtcbiAgfVxuICByZXR1cm4gYXJlYTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7RWxlbWVudEhhbmRsZX07XG5oZWxwZXIudHJhY2VQdWJsaWNBUEkoRWxlbWVudEhhbmRsZSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNsYXNzIEVtdWxhdGlvbk1hbmFnZXIge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2VtdWxhdGluZ01vYmlsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2hhc1RvdWNoID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLlZpZXdwb3J0fSB2aWV3cG9ydFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgYXN5bmMgZW11bGF0ZVZpZXdwb3J0KHZpZXdwb3J0KSB7XG4gICAgY29uc3QgbW9iaWxlID0gdmlld3BvcnQuaXNNb2JpbGUgfHwgZmFsc2U7XG4gICAgY29uc3Qgd2lkdGggPSB2aWV3cG9ydC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XG4gICAgY29uc3QgZGV2aWNlU2NhbGVGYWN0b3IgPSB2aWV3cG9ydC5kZXZpY2VTY2FsZUZhY3RvciB8fCAxO1xuICAgIC8qKiBAdHlwZSB7UHJvdG9jb2wuRW11bGF0aW9uLlNjcmVlbk9yaWVudGF0aW9ufSAqL1xuICAgIGNvbnN0IHNjcmVlbk9yaWVudGF0aW9uID0gdmlld3BvcnQuaXNMYW5kc2NhcGUgPyB7IGFuZ2xlOiA5MCwgdHlwZTogJ2xhbmRzY2FwZVByaW1hcnknIH0gOiB7IGFuZ2xlOiAwLCB0eXBlOiAncG9ydHJhaXRQcmltYXJ5JyB9O1xuICAgIGNvbnN0IGhhc1RvdWNoID0gdmlld3BvcnQuaGFzVG91Y2ggfHwgZmFsc2U7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldERldmljZU1ldHJpY3NPdmVycmlkZScsIHsgbW9iaWxlLCB3aWR0aCwgaGVpZ2h0LCBkZXZpY2VTY2FsZUZhY3Rvciwgc2NyZWVuT3JpZW50YXRpb24gfSksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldFRvdWNoRW11bGF0aW9uRW5hYmxlZCcsIHtcbiAgICAgICAgZW5hYmxlZDogaGFzVG91Y2hcbiAgICAgIH0pXG4gICAgXSk7XG5cbiAgICBjb25zdCByZWxvYWROZWVkZWQgPSB0aGlzLl9lbXVsYXRpbmdNb2JpbGUgIT09IG1vYmlsZSB8fCB0aGlzLl9oYXNUb3VjaCAhPT0gaGFzVG91Y2g7XG4gICAgdGhpcy5fZW11bGF0aW5nTW9iaWxlID0gbW9iaWxlO1xuICAgIHRoaXMuX2hhc1RvdWNoID0gaGFzVG91Y2g7XG4gICAgcmV0dXJuIHJlbG9hZE5lZWRlZDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtFbXVsYXRpb25NYW5hZ2VyfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cbn1cblxuY2xhc3MgVGltZW91dEVycm9yIGV4dGVuZHMgQ3VzdG9tRXJyb3Ige31cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFRpbWVvdXRFcnJvcixcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNvbnN0IHtoZWxwZXIsIGFzc2VydH0gPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuXG5jb25zdCBFVkFMVUFUSU9OX1NDUklQVF9VUkwgPSAnX19wdXBwZXRlZXJfZXZhbHVhdGlvbl9zY3JpcHRfXyc7XG5jb25zdCBTT1VSQ0VfVVJMX1JFR0VYID0gL15bXFwwNDBcXHRdKlxcL1xcL1tAI10gc291cmNlVVJMPVxccyooXFxTKj8pXFxzKiQvbTtcblxuY2xhc3MgRXhlY3V0aW9uQ29udGV4dCB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlJ1bnRpbWUuRXhlY3V0aW9uQ29udGV4dERlc2NyaXB0aW9ufSBjb250ZXh0UGF5bG9hZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCFQcm90b2NvbC5SdW50aW1lLlJlbW90ZU9iamVjdCk6IUpTSGFuZGxlfSBvYmplY3RIYW5kbGVGYWN0b3J5XG4gICAqIEBwYXJhbSB7P1B1cHBldGVlci5GcmFtZX0gZnJhbWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgY29udGV4dFBheWxvYWQsIG9iamVjdEhhbmRsZUZhY3RvcnksIGZyYW1lKSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2ZyYW1lID0gZnJhbWU7XG4gICAgdGhpcy5fY29udGV4dElkID0gY29udGV4dFBheWxvYWQuaWQ7XG4gICAgdGhpcy5faXNEZWZhdWx0ID0gY29udGV4dFBheWxvYWQuYXV4RGF0YSA/ICEhY29udGV4dFBheWxvYWQuYXV4RGF0YVsnaXNEZWZhdWx0J10gOiBmYWxzZTtcbiAgICB0aGlzLl9vYmplY3RIYW5kbGVGYWN0b3J5ID0gb2JqZWN0SGFuZGxlRmFjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHs/UHVwcGV0ZWVyLkZyYW1lfVxuICAgKi9cbiAgZnJhbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCghT2JqZWN0fHVuZGVmaW5lZCk+fVxuICAgKi9cbiAgYXN5bmMgZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgaGFuZGxlID0gYXdhaXQgdGhpcy5ldmFsdWF0ZUhhbmRsZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZS5qc29uVmFsdWUoKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICBpZiAoZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnT2JqZWN0IHJlZmVyZW5jZSBjaGFpbiBpcyB0b28gbG9uZycpKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnT2JqZWN0IGNvdWxkblxcJ3QgYmUgcmV0dXJuZWQgYnkgdmFsdWUnKSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSk7XG4gICAgYXdhaXQgaGFuZGxlLmRpc3Bvc2UoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFKU0hhbmRsZT59XG4gICAqL1xuICBhc3luYyBldmFsdWF0ZUhhbmRsZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBzdWZmaXggPSBgLy8jIHNvdXJjZVVSTD0ke0VWQUxVQVRJT05fU0NSSVBUX1VSTH1gO1xuXG4gICAgaWYgKGhlbHBlci5pc1N0cmluZyhwYWdlRnVuY3Rpb24pKSB7XG4gICAgICBjb25zdCBjb250ZXh0SWQgPSB0aGlzLl9jb250ZXh0SWQ7XG4gICAgICBjb25zdCBleHByZXNzaW9uID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChwYWdlRnVuY3Rpb24pO1xuICAgICAgY29uc3QgZXhwcmVzc2lvbldpdGhTb3VyY2VVcmwgPSBTT1VSQ0VfVVJMX1JFR0VYLnRlc3QoZXhwcmVzc2lvbikgPyBleHByZXNzaW9uIDogZXhwcmVzc2lvbiArICdcXG4nICsgc3VmZml4O1xuICAgICAgY29uc3Qge2V4Y2VwdGlvbkRldGFpbHMsIHJlc3VsdDogcmVtb3RlT2JqZWN0fSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdSdW50aW1lLmV2YWx1YXRlJywge1xuICAgICAgICBleHByZXNzaW9uOiBleHByZXNzaW9uV2l0aFNvdXJjZVVybCxcbiAgICAgICAgY29udGV4dElkLFxuICAgICAgICByZXR1cm5CeVZhbHVlOiBmYWxzZSxcbiAgICAgICAgYXdhaXRQcm9taXNlOiB0cnVlLFxuICAgICAgICB1c2VyR2VzdHVyZTogdHJ1ZVxuICAgICAgfSkuY2F0Y2gocmV3cml0ZUVycm9yKTtcbiAgICAgIGlmIChleGNlcHRpb25EZXRhaWxzKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2YWx1YXRpb24gZmFpbGVkOiAnICsgaGVscGVyLmdldEV4Y2VwdGlvbk1lc3NhZ2UoZXhjZXB0aW9uRGV0YWlscykpO1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdEhhbmRsZUZhY3RvcnkocmVtb3RlT2JqZWN0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhZ2VGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGZvbGxvd2luZyBpcyBub3QgYSBmdW5jdGlvbjogJyArIHBhZ2VGdW5jdGlvbik7XG5cbiAgICBjb25zdCB7IGV4Y2VwdGlvbkRldGFpbHMsIHJlc3VsdDogcmVtb3RlT2JqZWN0IH0gPSBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnUnVudGltZS5jYWxsRnVuY3Rpb25PbicsIHtcbiAgICAgIGZ1bmN0aW9uRGVjbGFyYXRpb246IHBhZ2VGdW5jdGlvbi50b1N0cmluZygpICsgJ1xcbicgKyBzdWZmaXggKyAnXFxuJyxcbiAgICAgIGV4ZWN1dGlvbkNvbnRleHRJZDogdGhpcy5fY29udGV4dElkLFxuICAgICAgYXJndW1lbnRzOiBhcmdzLm1hcChjb252ZXJ0QXJndW1lbnQuYmluZCh0aGlzKSksXG4gICAgICByZXR1cm5CeVZhbHVlOiBmYWxzZSxcbiAgICAgIGF3YWl0UHJvbWlzZTogdHJ1ZSxcbiAgICAgIHVzZXJHZXN0dXJlOiB0cnVlXG4gICAgfSkuY2F0Y2gocmV3cml0ZUVycm9yKTtcbiAgICBpZiAoZXhjZXB0aW9uRGV0YWlscylcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXZhbHVhdGlvbiBmYWlsZWQ6ICcgKyBoZWxwZXIuZ2V0RXhjZXB0aW9uTWVzc2FnZShleGNlcHRpb25EZXRhaWxzKSk7XG4gICAgcmV0dXJuIHRoaXMuX29iamVjdEhhbmRsZUZhY3RvcnkocmVtb3RlT2JqZWN0KTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Kn0gYXJnXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKiBAdGhpcyB7RXhlY3V0aW9uQ29udGV4dH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb252ZXJ0QXJndW1lbnQoYXJnKSB7XG4gICAgICBpZiAoT2JqZWN0LmlzKGFyZywgLTApKVxuICAgICAgICByZXR1cm4geyB1bnNlcmlhbGl6YWJsZVZhbHVlOiAnLTAnIH07XG4gICAgICBpZiAoT2JqZWN0LmlzKGFyZywgSW5maW5pdHkpKVxuICAgICAgICByZXR1cm4geyB1bnNlcmlhbGl6YWJsZVZhbHVlOiAnSW5maW5pdHknIH07XG4gICAgICBpZiAoT2JqZWN0LmlzKGFyZywgLUluZmluaXR5KSlcbiAgICAgICAgcmV0dXJuIHsgdW5zZXJpYWxpemFibGVWYWx1ZTogJy1JbmZpbml0eScgfTtcbiAgICAgIGlmIChPYmplY3QuaXMoYXJnLCBOYU4pKVxuICAgICAgICByZXR1cm4geyB1bnNlcmlhbGl6YWJsZVZhbHVlOiAnTmFOJyB9O1xuICAgICAgY29uc3Qgb2JqZWN0SGFuZGxlID0gYXJnICYmIChhcmcgaW5zdGFuY2VvZiBKU0hhbmRsZSkgPyBhcmcgOiBudWxsO1xuICAgICAgaWYgKG9iamVjdEhhbmRsZSkge1xuICAgICAgICBpZiAob2JqZWN0SGFuZGxlLl9jb250ZXh0ICE9PSB0aGlzKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNIYW5kbGVzIGNhbiBiZSBldmFsdWF0ZWQgb25seSBpbiB0aGUgY29udGV4dCB0aGV5IHdlcmUgY3JlYXRlZCEnKTtcbiAgICAgICAgaWYgKG9iamVjdEhhbmRsZS5fZGlzcG9zZWQpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU0hhbmRsZSBpcyBkaXNwb3NlZCEnKTtcbiAgICAgICAgaWYgKG9iamVjdEhhbmRsZS5fcmVtb3RlT2JqZWN0LnVuc2VyaWFsaXphYmxlVmFsdWUpXG4gICAgICAgICAgcmV0dXJuIHsgdW5zZXJpYWxpemFibGVWYWx1ZTogb2JqZWN0SGFuZGxlLl9yZW1vdGVPYmplY3QudW5zZXJpYWxpemFibGVWYWx1ZSB9O1xuICAgICAgICBpZiAoIW9iamVjdEhhbmRsZS5fcmVtb3RlT2JqZWN0Lm9iamVjdElkKVxuICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvYmplY3RIYW5kbGUuX3JlbW90ZU9iamVjdC52YWx1ZSB9O1xuICAgICAgICByZXR1cm4geyBvYmplY3RJZDogb2JqZWN0SGFuZGxlLl9yZW1vdGVPYmplY3Qub2JqZWN0SWQgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHZhbHVlOiBhcmcgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0geyFFcnJvcn0gZXJyb3JcbiAgICAgKiBAcmV0dXJuIHshUHJvdG9jb2wuUnVudGltZS5ldmFsdWF0ZVJldHVyblZhbHVlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJld3JpdGVFcnJvcihlcnJvcikge1xuICAgICAgaWYgKGVycm9yLm1lc3NhZ2UuZW5kc1dpdGgoJ0Nhbm5vdCBmaW5kIGNvbnRleHQgd2l0aCBzcGVjaWZpZWQgaWQnKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeGVjdXRpb24gY29udGV4dCB3YXMgZGVzdHJveWVkLCBtb3N0IGxpa2VseSBiZWNhdXNlIG9mIGEgbmF2aWdhdGlvbi4nKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFKU0hhbmRsZX0gcHJvdG90eXBlSGFuZGxlXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFKU0hhbmRsZT59XG4gICAqL1xuICBhc3luYyBxdWVyeU9iamVjdHMocHJvdG90eXBlSGFuZGxlKSB7XG4gICAgYXNzZXJ0KCFwcm90b3R5cGVIYW5kbGUuX2Rpc3Bvc2VkLCAnUHJvdG90eXBlIEpTSGFuZGxlIGlzIGRpc3Bvc2VkIScpO1xuICAgIGFzc2VydChwcm90b3R5cGVIYW5kbGUuX3JlbW90ZU9iamVjdC5vYmplY3RJZCwgJ1Byb3RvdHlwZSBKU0hhbmRsZSBtdXN0IG5vdCBiZSByZWZlcmVuY2luZyBwcmltaXRpdmUgdmFsdWUnKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdSdW50aW1lLnF1ZXJ5T2JqZWN0cycsIHtcbiAgICAgIHByb3RvdHlwZU9iamVjdElkOiBwcm90b3R5cGVIYW5kbGUuX3JlbW90ZU9iamVjdC5vYmplY3RJZFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLl9vYmplY3RIYW5kbGVGYWN0b3J5KHJlc3BvbnNlLm9iamVjdHMpO1xuICB9XG59XG5cbmNsYXNzIEpTSGFuZGxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IUV4ZWN1dGlvbkNvbnRleHR9IGNvbnRleHRcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5SdW50aW1lLlJlbW90ZU9iamVjdH0gcmVtb3RlT2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBjbGllbnQsIHJlbW90ZU9iamVjdCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9yZW1vdGVPYmplY3QgPSByZW1vdGVPYmplY3Q7XG4gICAgdGhpcy5fZGlzcG9zZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshRXhlY3V0aW9uQ29udGV4dH1cbiAgICovXG4gIGV4ZWN1dGlvbkNvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5TmFtZVxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/SlNIYW5kbGU+fVxuICAgKi9cbiAgYXN5bmMgZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG4gICAgY29uc3Qgb2JqZWN0SGFuZGxlID0gYXdhaXQgdGhpcy5fY29udGV4dC5ldmFsdWF0ZUhhbmRsZSgob2JqZWN0LCBwcm9wZXJ0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHtfX3Byb3RvX186IG51bGx9O1xuICAgICAgcmVzdWx0W3Byb3BlcnR5TmFtZV0gPSBvYmplY3RbcHJvcGVydHlOYW1lXTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgdGhpcywgcHJvcGVydHlOYW1lKTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gYXdhaXQgb2JqZWN0SGFuZGxlLmdldFByb3BlcnRpZXMoKTtcbiAgICBjb25zdCByZXN1bHQgPSBwcm9wZXJ0aWVzLmdldChwcm9wZXJ0eU5hbWUpIHx8IG51bGw7XG4gICAgYXdhaXQgb2JqZWN0SGFuZGxlLmRpc3Bvc2UoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPE1hcDxzdHJpbmcsICFKU0hhbmRsZT4+fVxuICAgKi9cbiAgYXN5bmMgZ2V0UHJvcGVydGllcygpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdSdW50aW1lLmdldFByb3BlcnRpZXMnLCB7XG4gICAgICBvYmplY3RJZDogdGhpcy5fcmVtb3RlT2JqZWN0Lm9iamVjdElkLFxuICAgICAgb3duUHJvcGVydGllczogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHJlc3BvbnNlLnJlc3VsdCkge1xuICAgICAgaWYgKCFwcm9wZXJ0eS5lbnVtZXJhYmxlKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHJlc3VsdC5zZXQocHJvcGVydHkubmFtZSwgdGhpcy5fY29udGV4dC5fb2JqZWN0SGFuZGxlRmFjdG9yeShwcm9wZXJ0eS52YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD9PYmplY3Q+fVxuICAgKi9cbiAgYXN5bmMganNvblZhbHVlKCkge1xuICAgIGlmICh0aGlzLl9yZW1vdGVPYmplY3Qub2JqZWN0SWQpIHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1J1bnRpbWUuY2FsbEZ1bmN0aW9uT24nLCB7XG4gICAgICAgIGZ1bmN0aW9uRGVjbGFyYXRpb246ICdmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0nLFxuICAgICAgICBvYmplY3RJZDogdGhpcy5fcmVtb3RlT2JqZWN0Lm9iamVjdElkLFxuICAgICAgICByZXR1cm5CeVZhbHVlOiB0cnVlLFxuICAgICAgICBhd2FpdFByb21pc2U6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBoZWxwZXIudmFsdWVGcm9tUmVtb3RlT2JqZWN0KHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBoZWxwZXIudmFsdWVGcm9tUmVtb3RlT2JqZWN0KHRoaXMuX3JlbW90ZU9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7P1B1cHBldGVlci5FbGVtZW50SGFuZGxlfVxuICAgKi9cbiAgYXNFbGVtZW50KCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fZGlzcG9zZWQpXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5fZGlzcG9zZWQgPSB0cnVlO1xuICAgIGF3YWl0IGhlbHBlci5yZWxlYXNlT2JqZWN0KHRoaXMuX2NsaWVudCwgdGhpcy5fcmVtb3RlT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAb3ZlcnJpZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgaWYgKHRoaXMuX3JlbW90ZU9iamVjdC5vYmplY3RJZCkge1xuICAgICAgY29uc3QgdHlwZSA9ICB0aGlzLl9yZW1vdGVPYmplY3Quc3VidHlwZSB8fCB0aGlzLl9yZW1vdGVPYmplY3QudHlwZTtcbiAgICAgIHJldHVybiAnSlNIYW5kbGVAJyArIHR5cGU7XG4gICAgfVxuICAgIHJldHVybiAnSlNIYW5kbGU6JyArIGhlbHBlci52YWx1ZUZyb21SZW1vdGVPYmplY3QodGhpcy5fcmVtb3RlT2JqZWN0KTtcbiAgfVxufVxuXG5oZWxwZXIudHJhY2VQdWJsaWNBUEkoSlNIYW5kbGUpO1xubW9kdWxlLmV4cG9ydHMgPSB7RXhlY3V0aW9uQ29udGV4dCwgSlNIYW5kbGUsIEVWQUxVQVRJT05fU0NSSVBUX1VSTH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3Qge2hlbHBlciwgYXNzZXJ0fSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5jb25zdCB7RXhlY3V0aW9uQ29udGV4dCwgSlNIYW5kbGV9ID0gcmVxdWlyZSgnLi9FeGVjdXRpb25Db250ZXh0Jyk7XG5jb25zdCB7RWxlbWVudEhhbmRsZX0gPSByZXF1aXJlKCcuL0VsZW1lbnRIYW5kbGUnKTtcbmNvbnN0IHtUaW1lb3V0RXJyb3J9ID0gcmVxdWlyZSgnLi9FcnJvcnMnKTtcblxuY29uc3QgcmVhZEZpbGVBc3luYyA9IGhlbHBlci5wcm9taXNpZnkoZnMucmVhZEZpbGUpO1xuXG5jbGFzcyBGcmFtZU1hbmFnZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5QYWdlLkZyYW1lVHJlZX0gZnJhbWVUcmVlXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5QYWdlfSBwYWdlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIGZyYW1lVHJlZSwgcGFnZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX3BhZ2UgPSBwYWdlO1xuICAgIC8qKiBAdHlwZSB7IU1hcDxzdHJpbmcsICFGcmFtZT59ICovXG4gICAgdGhpcy5fZnJhbWVzID0gbmV3IE1hcCgpO1xuICAgIC8qKiBAdHlwZSB7IU1hcDxudW1iZXIsICFFeGVjdXRpb25Db250ZXh0Pn0gKi9cbiAgICB0aGlzLl9jb250ZXh0SWRUb0NvbnRleHQgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9jbGllbnQub24oJ1BhZ2UuZnJhbWVBdHRhY2hlZCcsIGV2ZW50ID0+IHRoaXMuX29uRnJhbWVBdHRhY2hlZChldmVudC5mcmFtZUlkLCBldmVudC5wYXJlbnRGcmFtZUlkKSk7XG4gICAgdGhpcy5fY2xpZW50Lm9uKCdQYWdlLmZyYW1lTmF2aWdhdGVkJywgZXZlbnQgPT4gdGhpcy5fb25GcmFtZU5hdmlnYXRlZChldmVudC5mcmFtZSkpO1xuICAgIHRoaXMuX2NsaWVudC5vbignUGFnZS5uYXZpZ2F0ZWRXaXRoaW5Eb2N1bWVudCcsIGV2ZW50ID0+IHRoaXMuX29uRnJhbWVOYXZpZ2F0ZWRXaXRoaW5Eb2N1bWVudChldmVudC5mcmFtZUlkLCBldmVudC51cmwpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ1BhZ2UuZnJhbWVEZXRhY2hlZCcsIGV2ZW50ID0+IHRoaXMuX29uRnJhbWVEZXRhY2hlZChldmVudC5mcmFtZUlkKSk7XG4gICAgdGhpcy5fY2xpZW50Lm9uKCdQYWdlLmZyYW1lU3RvcHBlZExvYWRpbmcnLCBldmVudCA9PiB0aGlzLl9vbkZyYW1lU3RvcHBlZExvYWRpbmcoZXZlbnQuZnJhbWVJZCkpO1xuICAgIHRoaXMuX2NsaWVudC5vbignUnVudGltZS5leGVjdXRpb25Db250ZXh0Q3JlYXRlZCcsIGV2ZW50ID0+IHRoaXMuX29uRXhlY3V0aW9uQ29udGV4dENyZWF0ZWQoZXZlbnQuY29udGV4dCkpO1xuICAgIHRoaXMuX2NsaWVudC5vbignUnVudGltZS5leGVjdXRpb25Db250ZXh0RGVzdHJveWVkJywgZXZlbnQgPT4gdGhpcy5fb25FeGVjdXRpb25Db250ZXh0RGVzdHJveWVkKGV2ZW50LmV4ZWN1dGlvbkNvbnRleHRJZCkpO1xuICAgIHRoaXMuX2NsaWVudC5vbignUnVudGltZS5leGVjdXRpb25Db250ZXh0c0NsZWFyZWQnLCBldmVudCA9PiB0aGlzLl9vbkV4ZWN1dGlvbkNvbnRleHRzQ2xlYXJlZCgpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ1BhZ2UubGlmZWN5Y2xlRXZlbnQnLCBldmVudCA9PiB0aGlzLl9vbkxpZmVjeWNsZUV2ZW50KGV2ZW50KSk7XG5cbiAgICB0aGlzLl9oYW5kbGVGcmFtZVRyZWUoZnJhbWVUcmVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5QYWdlLmxpZmVjeWNsZUV2ZW50UGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF9vbkxpZmVjeWNsZUV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgZnJhbWUgPSB0aGlzLl9mcmFtZXMuZ2V0KGV2ZW50LmZyYW1lSWQpO1xuICAgIGlmICghZnJhbWUpXG4gICAgICByZXR1cm47XG4gICAgZnJhbWUuX29uTGlmZWN5Y2xlRXZlbnQoZXZlbnQubG9hZGVySWQsIGV2ZW50Lm5hbWUpO1xuICAgIHRoaXMuZW1pdChGcmFtZU1hbmFnZXIuRXZlbnRzLkxpZmVjeWNsZUV2ZW50LCBmcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZyYW1lSWRcbiAgICovXG4gIF9vbkZyYW1lU3RvcHBlZExvYWRpbmcoZnJhbWVJZCkge1xuICAgIGNvbnN0IGZyYW1lID0gdGhpcy5fZnJhbWVzLmdldChmcmFtZUlkKTtcbiAgICBpZiAoIWZyYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIGZyYW1lLl9vbkxvYWRpbmdTdG9wcGVkKCk7XG4gICAgdGhpcy5lbWl0KEZyYW1lTWFuYWdlci5FdmVudHMuTGlmZWN5Y2xlRXZlbnQsIGZyYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5QYWdlLkZyYW1lVHJlZX0gZnJhbWVUcmVlXG4gICAqL1xuICBfaGFuZGxlRnJhbWVUcmVlKGZyYW1lVHJlZSkge1xuICAgIGlmIChmcmFtZVRyZWUuZnJhbWUucGFyZW50SWQpXG4gICAgICB0aGlzLl9vbkZyYW1lQXR0YWNoZWQoZnJhbWVUcmVlLmZyYW1lLmlkLCBmcmFtZVRyZWUuZnJhbWUucGFyZW50SWQpO1xuICAgIHRoaXMuX29uRnJhbWVOYXZpZ2F0ZWQoZnJhbWVUcmVlLmZyYW1lKTtcbiAgICBpZiAoIWZyYW1lVHJlZS5jaGlsZEZyYW1lcylcbiAgICAgIHJldHVybjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnJhbWVUcmVlLmNoaWxkRnJhbWVzKVxuICAgICAgdGhpcy5faGFuZGxlRnJhbWVUcmVlKGNoaWxkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshRnJhbWV9XG4gICAqL1xuICBtYWluRnJhbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21haW5GcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXk8IUZyYW1lPn1cbiAgICovXG4gIGZyYW1lcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9mcmFtZXMudmFsdWVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IXN0cmluZ30gZnJhbWVJZFxuICAgKiBAcmV0dXJuIHs/RnJhbWV9XG4gICAqL1xuICBmcmFtZShmcmFtZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lcy5nZXQoZnJhbWVJZCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnJhbWVJZFxuICAgKiBAcGFyYW0gez9zdHJpbmd9IHBhcmVudEZyYW1lSWRcbiAgICogQHJldHVybiB7P0ZyYW1lfVxuICAgKi9cbiAgX29uRnJhbWVBdHRhY2hlZChmcmFtZUlkLCBwYXJlbnRGcmFtZUlkKSB7XG4gICAgaWYgKHRoaXMuX2ZyYW1lcy5oYXMoZnJhbWVJZCkpXG4gICAgICByZXR1cm47XG4gICAgYXNzZXJ0KHBhcmVudEZyYW1lSWQpO1xuICAgIGNvbnN0IHBhcmVudEZyYW1lID0gdGhpcy5fZnJhbWVzLmdldChwYXJlbnRGcmFtZUlkKTtcbiAgICBjb25zdCBmcmFtZSA9IG5ldyBGcmFtZSh0aGlzLl9jbGllbnQsIHBhcmVudEZyYW1lLCBmcmFtZUlkKTtcbiAgICB0aGlzLl9mcmFtZXMuc2V0KGZyYW1lLl9pZCwgZnJhbWUpO1xuICAgIHRoaXMuZW1pdChGcmFtZU1hbmFnZXIuRXZlbnRzLkZyYW1lQXR0YWNoZWQsIGZyYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5QYWdlLkZyYW1lfSBmcmFtZVBheWxvYWRcbiAgICovXG4gIF9vbkZyYW1lTmF2aWdhdGVkKGZyYW1lUGF5bG9hZCkge1xuICAgIGNvbnN0IGlzTWFpbkZyYW1lID0gIWZyYW1lUGF5bG9hZC5wYXJlbnRJZDtcbiAgICBsZXQgZnJhbWUgPSBpc01haW5GcmFtZSA/IHRoaXMuX21haW5GcmFtZSA6IHRoaXMuX2ZyYW1lcy5nZXQoZnJhbWVQYXlsb2FkLmlkKTtcbiAgICBhc3NlcnQoaXNNYWluRnJhbWUgfHwgZnJhbWUsICdXZSBlaXRoZXIgbmF2aWdhdGUgdG9wIGxldmVsIG9yIGhhdmUgb2xkIHZlcnNpb24gb2YgdGhlIG5hdmlnYXRlZCBmcmFtZScpO1xuXG4gICAgLy8gRGV0YWNoIGFsbCBjaGlsZCBmcmFtZXMgZmlyc3QuXG4gICAgaWYgKGZyYW1lKSB7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZyYW1lLmNoaWxkRnJhbWVzKCkpXG4gICAgICAgIHRoaXMuX3JlbW92ZUZyYW1lc1JlY3Vyc2l2ZWx5KGNoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgb3IgY3JlYXRlIG1haW4gZnJhbWUuXG4gICAgaWYgKGlzTWFpbkZyYW1lKSB7XG4gICAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgLy8gVXBkYXRlIGZyYW1lIGlkIHRvIHJldGFpbiBmcmFtZSBpZGVudGl0eSBvbiBjcm9zcy1wcm9jZXNzIG5hdmlnYXRpb24uXG4gICAgICAgIHRoaXMuX2ZyYW1lcy5kZWxldGUoZnJhbWUuX2lkKTtcbiAgICAgICAgZnJhbWUuX2lkID0gZnJhbWVQYXlsb2FkLmlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW5pdGlhbCBtYWluIGZyYW1lIG5hdmlnYXRpb24uXG4gICAgICAgIGZyYW1lID0gbmV3IEZyYW1lKHRoaXMuX2NsaWVudCwgbnVsbCwgZnJhbWVQYXlsb2FkLmlkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2ZyYW1lcy5zZXQoZnJhbWVQYXlsb2FkLmlkLCBmcmFtZSk7XG4gICAgICB0aGlzLl9tYWluRnJhbWUgPSBmcmFtZTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgZnJhbWUgcGF5bG9hZC5cbiAgICBmcmFtZS5fbmF2aWdhdGVkKGZyYW1lUGF5bG9hZCk7XG5cbiAgICB0aGlzLmVtaXQoRnJhbWVNYW5hZ2VyLkV2ZW50cy5GcmFtZU5hdmlnYXRlZCwgZnJhbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmcmFtZUlkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICovXG4gIF9vbkZyYW1lTmF2aWdhdGVkV2l0aGluRG9jdW1lbnQoZnJhbWVJZCwgdXJsKSB7XG4gICAgY29uc3QgZnJhbWUgPSB0aGlzLl9mcmFtZXMuZ2V0KGZyYW1lSWQpO1xuICAgIGlmICghZnJhbWUpXG4gICAgICByZXR1cm47XG4gICAgZnJhbWUuX25hdmlnYXRlZFdpdGhpbkRvY3VtZW50KHVybCk7XG4gICAgdGhpcy5lbWl0KEZyYW1lTWFuYWdlci5FdmVudHMuRnJhbWVOYXZpZ2F0ZWRXaXRoaW5Eb2N1bWVudCwgZnJhbWUpO1xuICAgIHRoaXMuZW1pdChGcmFtZU1hbmFnZXIuRXZlbnRzLkZyYW1lTmF2aWdhdGVkLCBmcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZyYW1lSWRcbiAgICovXG4gIF9vbkZyYW1lRGV0YWNoZWQoZnJhbWVJZCkge1xuICAgIGNvbnN0IGZyYW1lID0gdGhpcy5fZnJhbWVzLmdldChmcmFtZUlkKTtcbiAgICBpZiAoZnJhbWUpXG4gICAgICB0aGlzLl9yZW1vdmVGcmFtZXNSZWN1cnNpdmVseShmcmFtZSk7XG4gIH1cblxuICBfb25FeGVjdXRpb25Db250ZXh0Q3JlYXRlZChjb250ZXh0UGF5bG9hZCkge1xuICAgIGNvbnN0IGZyYW1lSWQgPSBjb250ZXh0UGF5bG9hZC5hdXhEYXRhID8gY29udGV4dFBheWxvYWQuYXV4RGF0YS5mcmFtZUlkIDogbnVsbDtcbiAgICBjb25zdCBmcmFtZSA9IHRoaXMuX2ZyYW1lcy5nZXQoZnJhbWVJZCkgfHwgbnVsbDtcbiAgICAvKiogQHR5cGUgeyFFeGVjdXRpb25Db250ZXh0fSAqL1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgRXhlY3V0aW9uQ29udGV4dCh0aGlzLl9jbGllbnQsIGNvbnRleHRQYXlsb2FkLCBvYmogPT4gdGhpcy5jcmVhdGVKU0hhbmRsZShjb250ZXh0LCBvYmopLCBmcmFtZSk7XG4gICAgdGhpcy5fY29udGV4dElkVG9Db250ZXh0LnNldChjb250ZXh0UGF5bG9hZC5pZCwgY29udGV4dCk7XG4gICAgaWYgKGZyYW1lKVxuICAgICAgZnJhbWUuX2FkZEV4ZWN1dGlvbkNvbnRleHQoY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IGV4ZWN1dGlvbkNvbnRleHRJZFxuICAgKi9cbiAgX29uRXhlY3V0aW9uQ29udGV4dERlc3Ryb3llZChleGVjdXRpb25Db250ZXh0SWQpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY29udGV4dElkVG9Db250ZXh0LmdldChleGVjdXRpb25Db250ZXh0SWQpO1xuICAgIGlmICghY29udGV4dClcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLl9jb250ZXh0SWRUb0NvbnRleHQuZGVsZXRlKGV4ZWN1dGlvbkNvbnRleHRJZCk7XG4gICAgaWYgKGNvbnRleHQuZnJhbWUoKSlcbiAgICAgIGNvbnRleHQuZnJhbWUoKS5fcmVtb3ZlRXhlY3V0aW9uQ29udGV4dChjb250ZXh0KTtcbiAgfVxuXG4gIF9vbkV4ZWN1dGlvbkNvbnRleHRzQ2xlYXJlZCgpIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRleHQgb2YgdGhpcy5fY29udGV4dElkVG9Db250ZXh0LnZhbHVlcygpKSB7XG4gICAgICBpZiAoY29udGV4dC5mcmFtZSgpKVxuICAgICAgICBjb250ZXh0LmZyYW1lKCkuX3JlbW92ZUV4ZWN1dGlvbkNvbnRleHQoY29udGV4dCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbnRleHRJZFRvQ29udGV4dC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb250ZXh0SWRcbiAgICogQHJldHVybiB7IUV4ZWN1dGlvbkNvbnRleHR9XG4gICAqL1xuICBleGVjdXRpb25Db250ZXh0QnlJZChjb250ZXh0SWQpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY29udGV4dElkVG9Db250ZXh0LmdldChjb250ZXh0SWQpO1xuICAgIGFzc2VydChjb250ZXh0LCAnSU5URVJOQUwgRVJST1I6IG1pc3NpbmcgY29udGV4dCB3aXRoIGlkID0gJyArIGNvbnRleHRJZCk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshRXhlY3V0aW9uQ29udGV4dH0gY29udGV4dFxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5SdW50aW1lLlJlbW90ZU9iamVjdH0gcmVtb3RlT2JqZWN0XG4gICAqIEByZXR1cm4geyFKU0hhbmRsZX1cbiAgICovXG4gIGNyZWF0ZUpTSGFuZGxlKGNvbnRleHQsIHJlbW90ZU9iamVjdCkge1xuICAgIGlmIChyZW1vdGVPYmplY3Quc3VidHlwZSA9PT0gJ25vZGUnKVxuICAgICAgcmV0dXJuIG5ldyBFbGVtZW50SGFuZGxlKGNvbnRleHQsIHRoaXMuX2NsaWVudCwgcmVtb3RlT2JqZWN0LCB0aGlzLl9wYWdlLCB0aGlzKTtcbiAgICByZXR1cm4gbmV3IEpTSGFuZGxlKGNvbnRleHQsIHRoaXMuX2NsaWVudCwgcmVtb3RlT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFGcmFtZX0gZnJhbWVcbiAgICovXG4gIF9yZW1vdmVGcmFtZXNSZWN1cnNpdmVseShmcmFtZSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnJhbWUuY2hpbGRGcmFtZXMoKSlcbiAgICAgIHRoaXMuX3JlbW92ZUZyYW1lc1JlY3Vyc2l2ZWx5KGNoaWxkKTtcbiAgICBmcmFtZS5fZGV0YWNoKCk7XG4gICAgdGhpcy5fZnJhbWVzLmRlbGV0ZShmcmFtZS5faWQpO1xuICAgIHRoaXMuZW1pdChGcmFtZU1hbmFnZXIuRXZlbnRzLkZyYW1lRGV0YWNoZWQsIGZyYW1lKTtcbiAgfVxufVxuXG4vKiogQGVudW0ge3N0cmluZ30gKi9cbkZyYW1lTWFuYWdlci5FdmVudHMgPSB7XG4gIEZyYW1lQXR0YWNoZWQ6ICdmcmFtZWF0dGFjaGVkJyxcbiAgRnJhbWVOYXZpZ2F0ZWQ6ICdmcmFtZW5hdmlnYXRlZCcsXG4gIEZyYW1lRGV0YWNoZWQ6ICdmcmFtZWRldGFjaGVkJyxcbiAgTGlmZWN5Y2xlRXZlbnQ6ICdsaWZlY3ljbGVldmVudCcsXG4gIEZyYW1lTmF2aWdhdGVkV2l0aGluRG9jdW1lbnQ6ICdmcmFtZW5hdmlnYXRlZHdpdGhpbmRvY3VtZW50JyxcbiAgRXhlY3V0aW9uQ29udGV4dENyZWF0ZWQ6ICdleGVjdXRpb25jb250ZXh0Y3JlYXRlZCcsXG4gIEV4ZWN1dGlvbkNvbnRleHREZXN0cm95ZWQ6ICdleGVjdXRpb25jb250ZXh0ZGVzdHJveWVkJyxcbn07XG5cbi8qKlxuICogQHVucmVzdHJpY3RlZFxuICovXG5jbGFzcyBGcmFtZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7P0ZyYW1lfSBwYXJlbnRGcmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnJhbWVJZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50LCBwYXJlbnRGcmFtZSwgZnJhbWVJZCkge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9wYXJlbnRGcmFtZSA9IHBhcmVudEZyYW1lO1xuICAgIHRoaXMuX3VybCA9ICcnO1xuICAgIHRoaXMuX2lkID0gZnJhbWVJZDtcblxuICAgIC8qKiBAdHlwZSB7P1Byb21pc2U8IUVsZW1lbnRIYW5kbGU+fSAqL1xuICAgIHRoaXMuX2RvY3VtZW50UHJvbWlzZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHs/UHJvbWlzZTwhRXhlY3V0aW9uQ29udGV4dD59ICovXG4gICAgdGhpcy5fY29udGV4dFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHRSZXNvbHZlQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuX3NldERlZmF1bHRDb250ZXh0KG51bGwpO1xuXG4gICAgLyoqIEB0eXBlIHshU2V0PCFXYWl0VGFzaz59ICovXG4gICAgdGhpcy5fd2FpdFRhc2tzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2xvYWRlcklkID0gJyc7XG4gICAgLyoqIEB0eXBlIHshU2V0PHN0cmluZz59ICovXG4gICAgdGhpcy5fbGlmZWN5Y2xlRXZlbnRzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqIEB0eXBlIHshU2V0PCFGcmFtZT59ICovXG4gICAgdGhpcy5fY2hpbGRGcmFtZXMgPSBuZXcgU2V0KCk7XG4gICAgaWYgKHRoaXMuX3BhcmVudEZyYW1lKVxuICAgICAgdGhpcy5fcGFyZW50RnJhbWUuX2NoaWxkRnJhbWVzLmFkZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFFeGVjdXRpb25Db250ZXh0fSBjb250ZXh0XG4gICAqL1xuICBfYWRkRXhlY3V0aW9uQ29udGV4dChjb250ZXh0KSB7XG4gICAgaWYgKGNvbnRleHQuX2lzRGVmYXVsdClcbiAgICAgIHRoaXMuX3NldERlZmF1bHRDb250ZXh0KGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IUV4ZWN1dGlvbkNvbnRleHR9IGNvbnRleHRcbiAgICovXG4gIF9yZW1vdmVFeGVjdXRpb25Db250ZXh0KGNvbnRleHQpIHtcbiAgICBpZiAoY29udGV4dC5faXNEZWZhdWx0KVxuICAgICAgdGhpcy5fc2V0RGVmYXVsdENvbnRleHQobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHs/RXhlY3V0aW9uQ29udGV4dH0gY29udGV4dFxuICAgKi9cbiAgX3NldERlZmF1bHRDb250ZXh0KGNvbnRleHQpIHtcbiAgICBpZiAoY29udGV4dCkge1xuICAgICAgdGhpcy5fY29udGV4dFJlc29sdmVDYWxsYmFjay5jYWxsKG51bGwsIGNvbnRleHQpO1xuICAgICAgdGhpcy5fY29udGV4dFJlc29sdmVDYWxsYmFjayA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHdhaXRUYXNrIG9mIHRoaXMuX3dhaXRUYXNrcylcbiAgICAgICAgd2FpdFRhc2sucmVydW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZG9jdW1lbnRQcm9taXNlID0gbnVsbDtcbiAgICAgIHRoaXMuX2NvbnRleHRQcm9taXNlID0gbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgIHRoaXMuX2NvbnRleHRSZXNvbHZlQ2FsbGJhY2sgPSBmdWxmaWxsO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFFeGVjdXRpb25Db250ZXh0Pn1cbiAgICovXG4gIGV4ZWN1dGlvbkNvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKXxzdHJpbmd9IHBhZ2VGdW5jdGlvblxuICAgKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLkpTSGFuZGxlPn1cbiAgICovXG4gIGFzeW5jIGV2YWx1YXRlSGFuZGxlKHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIGNvbnN0IGNvbnRleHQgPSBhd2FpdCB0aGlzLl9jb250ZXh0UHJvbWlzZTtcbiAgICByZXR1cm4gY29udGV4dC5ldmFsdWF0ZUhhbmRsZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2U8Kj59XG4gICAqL1xuICBhc3luYyBldmFsdWF0ZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgdGhpcy5fY29udGV4dFByb21pc2U7XG4gICAgcmV0dXJuIGNvbnRleHQuZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHJldHVybiB7IVByb21pc2U8P0VsZW1lbnRIYW5kbGU+fVxuICAgKi9cbiAgYXN5bmMgJChzZWxlY3Rvcikge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gYXdhaXQgdGhpcy5fZG9jdW1lbnQoKTtcbiAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IGRvY3VtZW50LiQoc2VsZWN0b3IpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhRWxlbWVudEhhbmRsZT59XG4gICAqL1xuICBhc3luYyBfZG9jdW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuX2RvY3VtZW50UHJvbWlzZSlcbiAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFByb21pc2U7XG4gICAgdGhpcy5fZG9jdW1lbnRQcm9taXNlID0gdGhpcy5fY29udGV4dFByb21pc2UudGhlbihhc3luYyBjb250ZXh0ID0+IHtcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gYXdhaXQgY29udGV4dC5ldmFsdWF0ZUhhbmRsZSgnZG9jdW1lbnQnKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hc0VsZW1lbnQoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHByZXNzaW9uXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFBcnJheTwhRWxlbWVudEhhbmRsZT4+fVxuICAgKi9cbiAgYXN5bmMgJHgoZXhwcmVzc2lvbikge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gYXdhaXQgdGhpcy5fZG9jdW1lbnQoKTtcbiAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IGRvY3VtZW50LiR4KGV4cHJlc3Npb24pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IHBhZ2VGdW5jdGlvblxuICAgKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwoIU9iamVjdHx1bmRlZmluZWQpPn1cbiAgICovXG4gIGFzeW5jICRldmFsKHNlbGVjdG9yLCBwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBkb2N1bWVudCA9IGF3YWl0IHRoaXMuX2RvY3VtZW50KCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LiRldmFsKHNlbGVjdG9yLCBwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCghT2JqZWN0fHVuZGVmaW5lZCk+fVxuICAgKi9cbiAgYXN5bmMgJCRldmFsKHNlbGVjdG9yLCBwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBkb2N1bWVudCA9IGF3YWl0IHRoaXMuX2RvY3VtZW50KCk7XG4gICAgY29uc3QgdmFsdWUgPSBhd2FpdCBkb2N1bWVudC4kJGV2YWwoc2VsZWN0b3IsIHBhZ2VGdW5jdGlvbiwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhQXJyYXk8IUVsZW1lbnRIYW5kbGU+Pn1cbiAgICovXG4gIGFzeW5jICQkKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgZG9jdW1lbnQgPSBhd2FpdCB0aGlzLl9kb2N1bWVudCgpO1xuICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgZG9jdW1lbnQuJCQoc2VsZWN0b3IpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTxTdHJpbmc+fVxuICAgKi9cbiAgYXN5bmMgY29udGVudCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ldmFsdWF0ZSgoKSA9PiB7XG4gICAgICBsZXQgcmV0VmFsID0gJyc7XG4gICAgICBpZiAoZG9jdW1lbnQuZG9jdHlwZSlcbiAgICAgICAgcmV0VmFsID0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhkb2N1bWVudC5kb2N0eXBlKTtcbiAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXG4gICAgICAgIHJldFZhbCArPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MO1xuICAgICAgcmV0dXJuIHJldFZhbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgKi9cbiAgYXN5bmMgc2V0Q29udGVudChodG1sKSB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZShodG1sID0+IHtcbiAgICAgIGRvY3VtZW50Lm9wZW4oKTtcbiAgICAgIGRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgZG9jdW1lbnQuY2xvc2UoKTtcbiAgICB9LCBodG1sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lIHx8ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gez9GcmFtZX1cbiAgICovXG4gIHBhcmVudEZyYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXkuPCFGcmFtZT59XG4gICAqL1xuICBjaGlsZEZyYW1lcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9jaGlsZEZyYW1lcyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRGV0YWNoZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RldGFjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFFbGVtZW50SGFuZGxlPn1cbiAgICovXG4gIGFzeW5jIGFkZFNjcmlwdFRhZyhvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHVybCA9IG9wdGlvbnMudXJsO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGF3YWl0IHRoaXMuX2NvbnRleHRQcm9taXNlO1xuICAgICAgICByZXR1cm4gKGF3YWl0IGNvbnRleHQuZXZhbHVhdGVIYW5kbGUoYWRkU2NyaXB0VXJsLCB1cmwsIG9wdGlvbnMudHlwZSkpLmFzRWxlbWVudCgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMb2FkaW5nIHNjcmlwdCBmcm9tICR7dXJsfSBmYWlsZWRgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IHJlYWRGaWxlQXN5bmMob3B0aW9ucy5wYXRoLCAndXRmOCcpO1xuICAgICAgY29udGVudHMgKz0gJy8vIyBzb3VyY2VVUkw9JyArIG9wdGlvbnMucGF0aC5yZXBsYWNlKC9cXG4vZywgJycpO1xuICAgICAgY29uc3QgY29udGV4dCA9IGF3YWl0IHRoaXMuX2NvbnRleHRQcm9taXNlO1xuICAgICAgcmV0dXJuIChhd2FpdCBjb250ZXh0LmV2YWx1YXRlSGFuZGxlKGFkZFNjcmlwdENvbnRlbnQsIGNvbnRlbnRzLCBvcHRpb25zLnR5cGUpKS5hc0VsZW1lbnQoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBhd2FpdCB0aGlzLl9jb250ZXh0UHJvbWlzZTtcbiAgICAgIHJldHVybiAoYXdhaXQgY29udGV4dC5ldmFsdWF0ZUhhbmRsZShhZGRTY3JpcHRDb250ZW50LCBvcHRpb25zLmNvbnRlbnQsIG9wdGlvbnMudHlwZSkpLmFzRWxlbWVudCgpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhbiBvYmplY3Qgd2l0aCBhIGB1cmxgLCBgcGF0aGAgb3IgYGNvbnRlbnRgIHByb3BlcnR5Jyk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhSFRNTEVsZW1lbnQ+fVxuICAgICAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIGFkZFNjcmlwdFVybCh1cmwsIHR5cGUpIHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICAgIGlmICh0eXBlKVxuICAgICAgICBzY3JpcHQudHlwZSA9IHR5cGU7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSByZXM7XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gcmVqO1xuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBhd2FpdCBwcm9taXNlO1xuICAgICAgcmV0dXJuIHNjcmlwdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAgICogQHJldHVybiB7IUhUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFNjcmlwdENvbnRlbnQoY29udGVudCwgdHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC50eXBlID0gdHlwZTtcbiAgICAgIHNjcmlwdC50ZXh0ID0gY29udGVudDtcbiAgICAgIGxldCBlcnJvciA9IG51bGw7XG4gICAgICBzY3JpcHQub25lcnJvciA9IGUgPT4gZXJyb3IgPSBlO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgaWYgKGVycm9yKVxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIHJldHVybiBzY3JpcHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFFbGVtZW50SGFuZGxlPn1cbiAgICovXG4gIGFzeW5jIGFkZFN0eWxlVGFnKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudXJsID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgdGhpcy5fY29udGV4dFByb21pc2U7XG4gICAgICAgIHJldHVybiAoYXdhaXQgY29udGV4dC5ldmFsdWF0ZUhhbmRsZShhZGRTdHlsZVVybCwgdXJsKSkuYXNFbGVtZW50KCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExvYWRpbmcgc3R5bGUgZnJvbSAke3VybH0gZmFpbGVkYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgY29udGVudHMgPSBhd2FpdCByZWFkRmlsZUFzeW5jKG9wdGlvbnMucGF0aCwgJ3V0ZjgnKTtcbiAgICAgIGNvbnRlbnRzICs9ICcvKiMgc291cmNlVVJMPScgKyBvcHRpb25zLnBhdGgucmVwbGFjZSgvXFxuL2csICcnKSArICcqLyc7XG4gICAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgdGhpcy5fY29udGV4dFByb21pc2U7XG4gICAgICByZXR1cm4gKGF3YWl0IGNvbnRleHQuZXZhbHVhdGVIYW5kbGUoYWRkU3R5bGVDb250ZW50LCBjb250ZW50cykpLmFzRWxlbWVudCgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgY29udGV4dCA9IGF3YWl0IHRoaXMuX2NvbnRleHRQcm9taXNlO1xuICAgICAgcmV0dXJuIChhd2FpdCBjb250ZXh0LmV2YWx1YXRlSGFuZGxlKGFkZFN0eWxlQ29udGVudCwgb3B0aW9ucy5jb250ZW50KSkuYXNFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGFuIG9iamVjdCB3aXRoIGEgYHVybGAsIGBwYXRoYCBvciBgY29udGVudGAgcHJvcGVydHknKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhSFRNTEVsZW1lbnQ+fVxuICAgICAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIGFkZFN0eWxlVXJsKHVybCkge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuICAgICAgbGluay5ocmVmID0gdXJsO1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgICBsaW5rLm9ubG9hZCA9IHJlcztcbiAgICAgICAgbGluay5vbmVycm9yID0gcmVqO1xuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgYXdhaXQgcHJvbWlzZTtcbiAgICAgIHJldHVybiBsaW5rO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAgICogQHJldHVybiB7IVByb21pc2U8IUhUTUxFbGVtZW50Pn1cbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiBhZGRTdHlsZUNvbnRlbnQoY29udGVudCkge1xuICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb250ZW50KSk7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgIHN0eWxlLm9ubG9hZCA9IHJlcztcbiAgICAgICAgc3R5bGUub25lcnJvciA9IHJlajtcbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICBhd2FpdCBwcm9taXNlO1xuICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKi9cbiAgYXN5bmMgY2xpY2soc2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhhbmRsZSA9IGF3YWl0IHRoaXMuJChzZWxlY3Rvcik7XG4gICAgYXNzZXJ0KGhhbmRsZSwgJ05vIG5vZGUgZm91bmQgZm9yIHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpO1xuICAgIGF3YWl0IGhhbmRsZS5jbGljayhvcHRpb25zKTtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKi9cbiAgYXN5bmMgZm9jdXMoc2VsZWN0b3IpIHtcbiAgICBjb25zdCBoYW5kbGUgPSBhd2FpdCB0aGlzLiQoc2VsZWN0b3IpO1xuICAgIGFzc2VydChoYW5kbGUsICdObyBub2RlIGZvdW5kIGZvciBzZWxlY3RvcjogJyArIHNlbGVjdG9yKTtcbiAgICBhd2FpdCBoYW5kbGUuZm9jdXMoKTtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKi9cbiAgYXN5bmMgaG92ZXIoc2VsZWN0b3IpIHtcbiAgICBjb25zdCBoYW5kbGUgPSBhd2FpdCB0aGlzLiQoc2VsZWN0b3IpO1xuICAgIGFzc2VydChoYW5kbGUsICdObyBub2RlIGZvdW5kIGZvciBzZWxlY3RvcjogJyArIHNlbGVjdG9yKTtcbiAgICBhd2FpdCBoYW5kbGUuaG92ZXIoKTtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICogQHBhcmFtIHshQXJyYXk8c3RyaW5nPn0gdmFsdWVzXG4gICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PHN0cmluZz4+fVxuICAqL1xuICBzZWxlY3Qoc2VsZWN0b3IsIC4uLnZhbHVlcyl7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpXG4gICAgICBhc3NlcnQoaGVscGVyLmlzU3RyaW5nKHZhbHVlKSwgJ1ZhbHVlcyBtdXN0IGJlIHN0cmluZ3MuIEZvdW5kIHZhbHVlIFwiJyArIHZhbHVlICsgJ1wiIG9mIHR5cGUgXCInICsgKHR5cGVvZiB2YWx1ZSkgKyAnXCInKTtcbiAgICByZXR1cm4gdGhpcy4kZXZhbChzZWxlY3RvciwgKGVsZW1lbnQsIHZhbHVlcykgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NlbGVjdCcpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBpcyBub3QgYSA8c2VsZWN0PiBlbGVtZW50LicpO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShlbGVtZW50Lm9wdGlvbnMpO1xuICAgICAgZWxlbWVudC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdmFsdWVzLmluY2x1ZGVzKG9wdGlvbi52YWx1ZSk7XG4gICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQgJiYgIWVsZW1lbnQubXVsdGlwbGUpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgJ2J1YmJsZXMnOiB0cnVlIH0pKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgJ2J1YmJsZXMnOiB0cnVlIH0pKTtcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gICAgfSwgdmFsdWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICovXG4gIGFzeW5jIHRhcChzZWxlY3Rvcikge1xuICAgIGNvbnN0IGhhbmRsZSA9IGF3YWl0IHRoaXMuJChzZWxlY3Rvcik7XG4gICAgYXNzZXJ0KGhhbmRsZSwgJ05vIG5vZGUgZm91bmQgZm9yIHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpO1xuICAgIGF3YWl0IGhhbmRsZS50YXAoKTtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKiBAcGFyYW0ge3tkZWxheTogKG51bWJlcnx1bmRlZmluZWQpfT19IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHR5cGUoc2VsZWN0b3IsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBoYW5kbGUgPSBhd2FpdCB0aGlzLiQoc2VsZWN0b3IpO1xuICAgIGFzc2VydChoYW5kbGUsICdObyBub2RlIGZvdW5kIGZvciBzZWxlY3RvcjogJyArIHNlbGVjdG9yKTtcbiAgICBhd2FpdCBoYW5kbGUudHlwZSh0ZXh0LCBvcHRpb25zKTtcbiAgICBhd2FpdCBoYW5kbGUuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8RnVuY3Rpb24pfSBzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXRcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZX1cbiAgICovXG4gIHdhaXRGb3Ioc2VsZWN0b3JPckZ1bmN0aW9uT3JUaW1lb3V0LCBvcHRpb25zID0ge30sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCB4UGF0aFBhdHRlcm4gPSAnLy8nO1xuXG4gICAgaWYgKGhlbHBlci5pc1N0cmluZyhzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQpKSB7XG4gICAgICBjb25zdCBzdHJpbmcgPSAvKiogQHR5cGUge3N0cmluZ30gKi8gKHNlbGVjdG9yT3JGdW5jdGlvbk9yVGltZW91dCk7XG4gICAgICBpZiAoc3RyaW5nLnN0YXJ0c1dpdGgoeFBhdGhQYXR0ZXJuKSlcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdEZvclhQYXRoKHN0cmluZywgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcy53YWl0Rm9yU2VsZWN0b3Ioc3RyaW5nLCBvcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKGhlbHBlci5pc051bWJlcihzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQpKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4gc2V0VGltZW91dChmdWxmaWxsLCBzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQpKTtcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yT3JGdW5jdGlvbk9yVGltZW91dCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiB0aGlzLndhaXRGb3JGdW5jdGlvbihzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQsIG9wdGlvbnMsIC4uLmFyZ3MpO1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHRhcmdldCB0eXBlOiAnICsgKHR5cGVvZiBzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQpKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICB3YWl0Rm9yU2VsZWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLl93YWl0Rm9yU2VsZWN0b3JPclhQYXRoKHNlbGVjdG9yLCBmYWxzZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHhwYXRoXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICB3YWl0Rm9yWFBhdGgoeHBhdGgsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLl93YWl0Rm9yU2VsZWN0b3JPclhQYXRoKHhwYXRoLCB0cnVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICB3YWl0Rm9yRnVuY3Rpb24ocGFnZUZ1bmN0aW9uLCBvcHRpb25zID0ge30sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCB0aW1lb3V0ID0gaGVscGVyLmlzTnVtYmVyKG9wdGlvbnMudGltZW91dCkgPyBvcHRpb25zLnRpbWVvdXQgOiAzMDAwMDtcbiAgICBjb25zdCBwb2xsaW5nID0gb3B0aW9ucy5wb2xsaW5nIHx8ICdyYWYnO1xuICAgIHJldHVybiBuZXcgV2FpdFRhc2sodGhpcywgcGFnZUZ1bmN0aW9uLCAnZnVuY3Rpb24nLCBwb2xsaW5nLCB0aW1lb3V0LCAuLi5hcmdzKS5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC50aXRsZSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yT3JYUGF0aFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzWFBhdGhcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZX1cbiAgICovXG4gIF93YWl0Rm9yU2VsZWN0b3JPclhQYXRoKHNlbGVjdG9yT3JYUGF0aCwgaXNYUGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgd2FpdEZvclZpc2libGUgPSAhIW9wdGlvbnMudmlzaWJsZTtcbiAgICBjb25zdCB3YWl0Rm9ySGlkZGVuID0gISFvcHRpb25zLmhpZGRlbjtcbiAgICBjb25zdCBwb2xsaW5nID0gd2FpdEZvclZpc2libGUgfHwgd2FpdEZvckhpZGRlbiA/ICdyYWYnIDogJ211dGF0aW9uJztcbiAgICBjb25zdCB0aW1lb3V0ID0gaGVscGVyLmlzTnVtYmVyKG9wdGlvbnMudGltZW91dCkgPyBvcHRpb25zLnRpbWVvdXQgOiAzMDAwMDtcbiAgICBjb25zdCB0aXRsZSA9IGAke2lzWFBhdGggPyAnWFBhdGgnIDogJ3NlbGVjdG9yJ30gXCIke3NlbGVjdG9yT3JYUGF0aH1cIiR7d2FpdEZvckhpZGRlbiA/ICcgdG8gYmUgaGlkZGVuJyA6ICcnfWA7XG4gICAgcmV0dXJuIG5ldyBXYWl0VGFzayh0aGlzLCBwcmVkaWNhdGUsIHRpdGxlLCBwb2xsaW5nLCB0aW1lb3V0LCBzZWxlY3Rvck9yWFBhdGgsIGlzWFBhdGgsIHdhaXRGb3JWaXNpYmxlLCB3YWl0Rm9ySGlkZGVuKS5wcm9taXNlO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yT3JYUGF0aFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNYUGF0aFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd2FpdEZvclZpc2libGVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdhaXRGb3JIaWRkZW5cbiAgICAgKiBAcmV0dXJuIHs/Tm9kZXxib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByZWRpY2F0ZShzZWxlY3Rvck9yWFBhdGgsIGlzWFBhdGgsIHdhaXRGb3JWaXNpYmxlLCB3YWl0Rm9ySGlkZGVuKSB7XG4gICAgICBjb25zdCBub2RlID0gaXNYUGF0aFxuICAgICAgICA/IGRvY3VtZW50LmV2YWx1YXRlKHNlbGVjdG9yT3JYUGF0aCwgZG9jdW1lbnQsIG51bGwsIFhQYXRoUmVzdWx0LkZJUlNUX09SREVSRURfTk9ERV9UWVBFLCBudWxsKS5zaW5nbGVOb2RlVmFsdWVcbiAgICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JYUGF0aCk7XG4gICAgICBpZiAoIW5vZGUpXG4gICAgICAgIHJldHVybiB3YWl0Rm9ySGlkZGVuO1xuICAgICAgaWYgKCF3YWl0Rm9yVmlzaWJsZSAmJiAhd2FpdEZvckhpZGRlbilcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICBjb25zdCBlbGVtZW50ID0gLyoqIEB0eXBlIHtFbGVtZW50fSAqLyAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgPyBub2RlLnBhcmVudEVsZW1lbnQgOiBub2RlKTtcblxuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHN0eWxlICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nICYmIGhhc1Zpc2libGVCb3VuZGluZ0JveCgpO1xuICAgICAgY29uc3Qgc3VjY2VzcyA9ICh3YWl0Rm9yVmlzaWJsZSA9PT0gaXNWaXNpYmxlIHx8IHdhaXRGb3JIaWRkZW4gPT09ICFpc1Zpc2libGUpO1xuICAgICAgcmV0dXJuIHN1Y2Nlc3MgPyBub2RlIDogbnVsbDtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBoYXNWaXNpYmxlQm91bmRpbmdCb3goKSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4gISEocmVjdC50b3AgfHwgcmVjdC5ib3R0b20gfHwgcmVjdC53aWR0aCB8fCByZWN0LmhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlBhZ2UuRnJhbWV9IGZyYW1lUGF5bG9hZFxuICAgKi9cbiAgX25hdmlnYXRlZChmcmFtZVBheWxvYWQpIHtcbiAgICB0aGlzLl9uYW1lID0gZnJhbWVQYXlsb2FkLm5hbWU7XG4gICAgLy8gVE9ETyhsdXNobmlrb3YpOiByZW1vdmUgdGhpcyBvbmNlIHJlcXVlc3RJbnRlcmNlcHRpb24gaGFzIGxvYWRlcklkIGV4cG9zZWQuXG4gICAgdGhpcy5fbmF2aWdhdGlvblVSTCA9IGZyYW1lUGF5bG9hZC51cmw7XG4gICAgdGhpcy5fdXJsID0gZnJhbWVQYXlsb2FkLnVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqL1xuICBfbmF2aWdhdGVkV2l0aGluRG9jdW1lbnQodXJsKSB7XG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2FkZXJJZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgX29uTGlmZWN5Y2xlRXZlbnQobG9hZGVySWQsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2luaXQnKSB7XG4gICAgICB0aGlzLl9sb2FkZXJJZCA9IGxvYWRlcklkO1xuICAgICAgdGhpcy5fbGlmZWN5Y2xlRXZlbnRzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuX2xpZmVjeWNsZUV2ZW50cy5hZGQobmFtZSk7XG4gIH1cblxuICBfb25Mb2FkaW5nU3RvcHBlZCgpIHtcbiAgICB0aGlzLl9saWZlY3ljbGVFdmVudHMuYWRkKCdET01Db250ZW50TG9hZGVkJyk7XG4gICAgdGhpcy5fbGlmZWN5Y2xlRXZlbnRzLmFkZCgnbG9hZCcpO1xuICB9XG5cbiAgX2RldGFjaCgpIHtcbiAgICBmb3IgKGNvbnN0IHdhaXRUYXNrIG9mIHRoaXMuX3dhaXRUYXNrcylcbiAgICAgIHdhaXRUYXNrLnRlcm1pbmF0ZShuZXcgRXJyb3IoJ3dhaXRGb3JGdW5jdGlvbiBmYWlsZWQ6IGZyYW1lIGdvdCBkZXRhY2hlZC4nKSk7XG4gICAgdGhpcy5fZGV0YWNoZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9wYXJlbnRGcmFtZSlcbiAgICAgIHRoaXMuX3BhcmVudEZyYW1lLl9jaGlsZEZyYW1lcy5kZWxldGUodGhpcyk7XG4gICAgdGhpcy5fcGFyZW50RnJhbWUgPSBudWxsO1xuICB9XG59XG5oZWxwZXIudHJhY2VQdWJsaWNBUEkoRnJhbWUpO1xuXG5jbGFzcyBXYWl0VGFzayB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFGcmFtZX0gZnJhbWVcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IHByZWRpY2F0ZUJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBwb2xsaW5nXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihmcmFtZSwgcHJlZGljYXRlQm9keSwgdGl0bGUsIHBvbGxpbmcsIHRpbWVvdXQsIC4uLmFyZ3MpIHtcbiAgICBpZiAoaGVscGVyLmlzU3RyaW5nKHBvbGxpbmcpKVxuICAgICAgYXNzZXJ0KHBvbGxpbmcgPT09ICdyYWYnIHx8IHBvbGxpbmcgPT09ICdtdXRhdGlvbicsICdVbmtub3duIHBvbGxpbmcgb3B0aW9uOiAnICsgcG9sbGluZyk7XG4gICAgZWxzZSBpZiAoaGVscGVyLmlzTnVtYmVyKHBvbGxpbmcpKVxuICAgICAgYXNzZXJ0KHBvbGxpbmcgPiAwLCAnQ2Fubm90IHBvbGwgd2l0aCBub24tcG9zaXRpdmUgaW50ZXJ2YWw6ICcgKyBwb2xsaW5nKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gcG9sbGluZyBvcHRpb25zOiAnICsgcG9sbGluZyk7XG5cbiAgICB0aGlzLl9mcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMuX3BvbGxpbmcgPSBwb2xsaW5nO1xuICAgIHRoaXMuX3RpbWVvdXQgPSB0aW1lb3V0O1xuICAgIHRoaXMuX3ByZWRpY2F0ZUJvZHkgPSBoZWxwZXIuaXNTdHJpbmcocHJlZGljYXRlQm9keSkgPyAncmV0dXJuICcgKyBwcmVkaWNhdGVCb2R5IDogJ3JldHVybiAoJyArIHByZWRpY2F0ZUJvZHkgKyAnKSguLi5hcmdzKSc7XG4gICAgdGhpcy5fYXJncyA9IGFyZ3M7XG4gICAgdGhpcy5fcnVuQ291bnQgPSAwO1xuICAgIGZyYW1lLl93YWl0VGFza3MuYWRkKHRoaXMpO1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIC8vIFNpbmNlIHBhZ2UgbmF2aWdhdGlvbiByZXF1aXJlcyB1cyB0byByZS1pbnN0YWxsIHRoZSBwYWdlU2NyaXB0LCB3ZSBzaG91bGQgdHJhY2tcbiAgICAvLyB0aW1lb3V0IG9uIG91ciBlbmQuXG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNvbnN0IHRpbWVvdXRFcnJvciA9IG5ldyBUaW1lb3V0RXJyb3IoYHdhaXRpbmcgZm9yICR7dGl0bGV9IGZhaWxlZDogdGltZW91dCAke3RpbWVvdXR9bXMgZXhjZWVkZWRgKTtcbiAgICAgIHRoaXMuX3RpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy50ZXJtaW5hdGUodGltZW91dEVycm9yKSwgdGltZW91dCk7XG4gICAgfVxuICAgIHRoaXMucmVydW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFFcnJvcn0gZXJyb3JcbiAgICovXG4gIHRlcm1pbmF0ZShlcnJvcikge1xuICAgIHRoaXMuX3Rlcm1pbmF0ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3JlamVjdChlcnJvcik7XG4gICAgdGhpcy5fY2xlYW51cCgpO1xuICB9XG5cbiAgYXN5bmMgcmVydW4oKSB7XG4gICAgY29uc3QgcnVuQ291bnQgPSArK3RoaXMuX3J1bkNvdW50O1xuICAgIC8qKiBAdHlwZSB7P0pTSGFuZGxlfSAqL1xuICAgIGxldCBzdWNjZXNzID0gbnVsbDtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBzdWNjZXNzID0gYXdhaXQgKGF3YWl0IHRoaXMuX2ZyYW1lLmV4ZWN1dGlvbkNvbnRleHQoKSkuZXZhbHVhdGVIYW5kbGUod2FpdEZvclByZWRpY2F0ZVBhZ2VGdW5jdGlvbiwgdGhpcy5fcHJlZGljYXRlQm9keSwgdGhpcy5fcG9sbGluZywgdGhpcy5fdGltZW91dCwgLi4udGhpcy5fYXJncyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IgPSBlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl90ZXJtaW5hdGVkIHx8IHJ1bkNvdW50ICE9PSB0aGlzLl9ydW5Db3VudCkge1xuICAgICAgaWYgKHN1Y2Nlc3MpXG4gICAgICAgIGF3YWl0IHN1Y2Nlc3MuZGlzcG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSB0aW1lb3V0cyBpbiBwYWdlU2NyaXB0IC0gd2UgdHJhY2sgdGltZW91dHMgb3Vyc2VsdmVzLlxuICAgIC8vIElmIHRoZSBmcmFtZSdzIGV4ZWN1dGlvbiBjb250ZXh0IGhhcyBhbHJlYWR5IGNoYW5nZWQsIGBmcmFtZS5ldmFsdWF0ZWAgd2lsbFxuICAgIC8vIHRocm93IGFuIGVycm9yIC0gaWdub3JlIHRoaXMgcHJlZGljYXRlIHJ1biBhbHRvZ2V0aGVyLlxuICAgIGlmICghZXJyb3IgJiYgYXdhaXQgdGhpcy5fZnJhbWUuZXZhbHVhdGUocyA9PiAhcywgc3VjY2VzcykuY2F0Y2goZSA9PiB0cnVlKSkge1xuICAgICAgYXdhaXQgc3VjY2Vzcy5kaXNwb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcGFnZSBpcyBuYXZpZ2F0ZWQsIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkLlxuICAgIC8vIFdlIHdpbGwgdHJ5IGFnYWluIGluIHRoZSBuZXcgZXhlY3V0aW9uIGNvbnRleHQuXG4gICAgaWYgKGVycm9yICYmIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ0V4ZWN1dGlvbiBjb250ZXh0IHdhcyBkZXN0cm95ZWQnKSlcbiAgICAgIHJldHVybjtcblxuICAgIC8vIFdlIGNvdWxkIGhhdmUgdHJpZWQgdG8gZXZhbHVhdGUgaW4gYSBjb250ZXh0IHdoaWNoIHdhcyBhbHJlYWR5XG4gICAgLy8gZGVzdHJveWVkLlxuICAgIGlmIChlcnJvciAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdDYW5ub3QgZmluZCBjb250ZXh0IHdpdGggc3BlY2lmaWVkIGlkJykpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoZXJyb3IpXG4gICAgICB0aGlzLl9yZWplY3QoZXJyb3IpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3Jlc29sdmUoc3VjY2Vzcyk7XG5cbiAgICB0aGlzLl9jbGVhbnVwKCk7XG4gIH1cblxuICBfY2xlYW51cCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dFRpbWVyKTtcbiAgICB0aGlzLl9mcmFtZS5fd2FpdFRhc2tzLmRlbGV0ZSh0aGlzKTtcbiAgICB0aGlzLl9ydW5uaW5nVGFzayA9IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJlZGljYXRlQm9keVxuICogQHBhcmFtIHtzdHJpbmd9IHBvbGxpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gKiBAcmV0dXJuIHshUHJvbWlzZTwqPn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gd2FpdEZvclByZWRpY2F0ZVBhZ2VGdW5jdGlvbihwcmVkaWNhdGVCb2R5LCBwb2xsaW5nLCB0aW1lb3V0LCAuLi5hcmdzKSB7XG4gIGNvbnN0IHByZWRpY2F0ZSA9IG5ldyBGdW5jdGlvbignLi4uYXJncycsIHByZWRpY2F0ZUJvZHkpO1xuICBsZXQgdGltZWRPdXQgPSBmYWxzZTtcbiAgaWYgKHRpbWVvdXQpXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aW1lZE91dCA9IHRydWUsIHRpbWVvdXQpO1xuICBpZiAocG9sbGluZyA9PT0gJ3JhZicpXG4gICAgcmV0dXJuIGF3YWl0IHBvbGxSYWYoKTtcbiAgaWYgKHBvbGxpbmcgPT09ICdtdXRhdGlvbicpXG4gICAgcmV0dXJuIGF3YWl0IHBvbGxNdXRhdGlvbigpO1xuICBpZiAodHlwZW9mIHBvbGxpbmcgPT09ICdudW1iZXInKVxuICAgIHJldHVybiBhd2FpdCBwb2xsSW50ZXJ2YWwocG9sbGluZyk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCo+fVxuICAgKi9cbiAgZnVuY3Rpb24gcG9sbE11dGF0aW9uKCkge1xuICAgIGNvbnN0IHN1Y2Nlc3MgPSBwcmVkaWNhdGUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWYgKHN1Y2Nlc3MpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN1Y2Nlc3MpO1xuXG4gICAgbGV0IGZ1bGZpbGw7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2UoeCA9PiBmdWxmaWxsID0geCk7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbnMgPT4ge1xuICAgICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3VjY2VzcyA9IHByZWRpY2F0ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgZnVsZmlsbChzdWNjZXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8Kj59XG4gICAqL1xuICBmdW5jdGlvbiBwb2xsUmFmKCkge1xuICAgIGxldCBmdWxmaWxsO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKHggPT4gZnVsZmlsbCA9IHgpO1xuICAgIG9uUmFmKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGZ1bmN0aW9uIG9uUmFmKCkge1xuICAgICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICAgIGZ1bGZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3VjY2VzcyA9IHByZWRpY2F0ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIGlmIChzdWNjZXNzKVxuICAgICAgICBmdWxmaWxsKHN1Y2Nlc3MpO1xuICAgICAgZWxzZVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUob25SYWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9sbEludGVydmFsXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCo+fVxuICAgKi9cbiAgZnVuY3Rpb24gcG9sbEludGVydmFsKHBvbGxJbnRlcnZhbCkge1xuICAgIGxldCBmdWxmaWxsO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcm9taXNlKHggPT4gZnVsZmlsbCA9IHgpO1xuICAgIG9uVGltZW91dCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAodGltZWRPdXQpIHtcbiAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzdWNjZXNzID0gcHJlZGljYXRlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgaWYgKHN1Y2Nlc3MpXG4gICAgICAgIGZ1bGZpbGwoc3VjY2Vzcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNldFRpbWVvdXQob25UaW1lb3V0LCBwb2xsSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtGcmFtZU1hbmFnZXIsIEZyYW1lfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgJ0xpY2Vuc2UnKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCB7aGVscGVyLCBhc3NlcnR9ID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbmNvbnN0IGtleURlZmluaXRpb25zID0gcmVxdWlyZSgnLi9VU0tleWJvYXJkTGF5b3V0Jyk7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gS2V5RGVzY3JpcHRpb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBrZXlDb2RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30ga2V5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb2NhdGlvblxuICovXG5cbmNsYXNzIEtleWJvYXJkIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5DRFBTZXNzaW9ufSBjbGllbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCkge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9tb2RpZmllcnMgPSAwO1xuICAgIHRoaXMuX3ByZXNzZWRLZXlzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHt7dGV4dDogc3RyaW5nfT19IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIGRvd24oa2V5LCBvcHRpb25zID0geyB0ZXh0OiB1bmRlZmluZWQgfSkge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5fa2V5RGVzY3JpcHRpb25Gb3JTdHJpbmcoa2V5KTtcblxuICAgIGNvbnN0IGF1dG9SZXBlYXQgPSB0aGlzLl9wcmVzc2VkS2V5cy5oYXMoZGVzY3JpcHRpb24uY29kZSk7XG4gICAgdGhpcy5fcHJlc3NlZEtleXMuYWRkKGRlc2NyaXB0aW9uLmNvZGUpO1xuICAgIHRoaXMuX21vZGlmaWVycyB8PSB0aGlzLl9tb2RpZmllckJpdChkZXNjcmlwdGlvbi5rZXkpO1xuXG4gICAgY29uc3QgdGV4dCA9IG9wdGlvbnMudGV4dCA9PT0gdW5kZWZpbmVkID8gZGVzY3JpcHRpb24udGV4dCA6IG9wdGlvbnMudGV4dDtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSW5wdXQuZGlzcGF0Y2hLZXlFdmVudCcsIHtcbiAgICAgIHR5cGU6IHRleHQgPyAna2V5RG93bicgOiAncmF3S2V5RG93bicsXG4gICAgICBtb2RpZmllcnM6IHRoaXMuX21vZGlmaWVycyxcbiAgICAgIHdpbmRvd3NWaXJ0dWFsS2V5Q29kZTogZGVzY3JpcHRpb24ua2V5Q29kZSxcbiAgICAgIGNvZGU6IGRlc2NyaXB0aW9uLmNvZGUsXG4gICAgICBrZXk6IGRlc2NyaXB0aW9uLmtleSxcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICB1bm1vZGlmaWVkVGV4dDogdGV4dCxcbiAgICAgIGF1dG9SZXBlYXQsXG4gICAgICBsb2NhdGlvbjogZGVzY3JpcHRpb24ubG9jYXRpb24sXG4gICAgICBpc0tleXBhZDogZGVzY3JpcHRpb24ubG9jYXRpb24gPT09IDNcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIF9tb2RpZmllckJpdChrZXkpIHtcbiAgICBpZiAoa2V5ID09PSAnQWx0JylcbiAgICAgIHJldHVybiAxO1xuICAgIGlmIChrZXkgPT09ICdDb250cm9sJylcbiAgICAgIHJldHVybiAyO1xuICAgIGlmIChrZXkgPT09ICdNZXRhJylcbiAgICAgIHJldHVybiA0O1xuICAgIGlmIChrZXkgPT09ICdTaGlmdCcpXG4gICAgICByZXR1cm4gODtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5U3RyaW5nXG4gICAqIEByZXR1cm4ge0tleURlc2NyaXB0aW9ufVxuICAgKi9cbiAgX2tleURlc2NyaXB0aW9uRm9yU3RyaW5nKGtleVN0cmluZykge1xuICAgIGNvbnN0IHNoaWZ0ID0gdGhpcy5fbW9kaWZpZXJzICYgODtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHtcbiAgICAgIGtleTogJycsXG4gICAgICBrZXlDb2RlOiAwLFxuICAgICAgY29kZTogJycsXG4gICAgICB0ZXh0OiAnJyxcbiAgICAgIGxvY2F0aW9uOiAwXG4gICAgfTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBrZXlEZWZpbml0aW9uc1trZXlTdHJpbmddO1xuICAgIGFzc2VydChkZWZpbml0aW9uLCBgVW5rbm93biBrZXk6IFwiJHtrZXlTdHJpbmd9XCJgKTtcblxuICAgIGlmIChkZWZpbml0aW9uLmtleSlcbiAgICAgIGRlc2NyaXB0aW9uLmtleSA9IGRlZmluaXRpb24ua2V5O1xuICAgIGlmIChzaGlmdCAmJiBkZWZpbml0aW9uLnNoaWZ0S2V5KVxuICAgICAgZGVzY3JpcHRpb24ua2V5ID0gZGVmaW5pdGlvbi5zaGlmdEtleTtcblxuICAgIGlmIChkZWZpbml0aW9uLmtleUNvZGUpXG4gICAgICBkZXNjcmlwdGlvbi5rZXlDb2RlID0gZGVmaW5pdGlvbi5rZXlDb2RlO1xuICAgIGlmIChzaGlmdCAmJiBkZWZpbml0aW9uLnNoaWZ0S2V5Q29kZSlcbiAgICAgIGRlc2NyaXB0aW9uLmtleUNvZGUgPSBkZWZpbml0aW9uLnNoaWZ0S2V5Q29kZTtcblxuICAgIGlmIChkZWZpbml0aW9uLmNvZGUpXG4gICAgICBkZXNjcmlwdGlvbi5jb2RlID0gZGVmaW5pdGlvbi5jb2RlO1xuXG4gICAgaWYgKGRlZmluaXRpb24ubG9jYXRpb24pXG4gICAgICBkZXNjcmlwdGlvbi5sb2NhdGlvbiA9IGRlZmluaXRpb24ubG9jYXRpb247XG5cbiAgICBpZiAoZGVzY3JpcHRpb24ua2V5Lmxlbmd0aCA9PT0gMSlcbiAgICAgIGRlc2NyaXB0aW9uLnRleHQgPSBkZXNjcmlwdGlvbi5rZXk7XG5cbiAgICBpZiAoZGVmaW5pdGlvbi50ZXh0KVxuICAgICAgZGVzY3JpcHRpb24udGV4dCA9IGRlZmluaXRpb24udGV4dDtcbiAgICBpZiAoc2hpZnQgJiYgZGVmaW5pdGlvbi5zaGlmdFRleHQpXG4gICAgICBkZXNjcmlwdGlvbi50ZXh0ID0gZGVmaW5pdGlvbi5zaGlmdFRleHQ7XG5cbiAgICAvLyBpZiBhbnkgbW9kaWZpZXJzIGJlc2lkZXMgc2hpZnQgYXJlIHByZXNzZWQsIG5vIHRleHQgc2hvdWxkIGJlIHNlbnRcbiAgICBpZiAodGhpcy5fbW9kaWZpZXJzICYgfjgpXG4gICAgICBkZXNjcmlwdGlvbi50ZXh0ID0gJyc7XG5cbiAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKi9cbiAgYXN5bmMgdXAoa2V5KSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLl9rZXlEZXNjcmlwdGlvbkZvclN0cmluZyhrZXkpO1xuXG4gICAgdGhpcy5fbW9kaWZpZXJzICY9IH50aGlzLl9tb2RpZmllckJpdChkZXNjcmlwdGlvbi5rZXkpO1xuICAgIHRoaXMuX3ByZXNzZWRLZXlzLmRlbGV0ZShkZXNjcmlwdGlvbi5jb2RlKTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSW5wdXQuZGlzcGF0Y2hLZXlFdmVudCcsIHtcbiAgICAgIHR5cGU6ICdrZXlVcCcsXG4gICAgICBtb2RpZmllcnM6IHRoaXMuX21vZGlmaWVycyxcbiAgICAgIGtleTogZGVzY3JpcHRpb24ua2V5LFxuICAgICAgd2luZG93c1ZpcnR1YWxLZXlDb2RlOiBkZXNjcmlwdGlvbi5rZXlDb2RlLFxuICAgICAgY29kZTogZGVzY3JpcHRpb24uY29kZSxcbiAgICAgIGxvY2F0aW9uOiBkZXNjcmlwdGlvbi5sb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyXG4gICAqL1xuICBhc3luYyBzZW5kQ2hhcmFjdGVyKGNoYXIpIHtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSW5wdXQuaW5zZXJ0VGV4dCcsIHt0ZXh0OiBjaGFyfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICogQHBhcmFtIHt7ZGVsYXk6IChudW1iZXJ8dW5kZWZpbmVkKX09fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyB0eXBlKHRleHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZGVsYXkgPSAwO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVsYXkpXG4gICAgICBkZWxheSA9IG9wdGlvbnMuZGVsYXk7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIHRleHQpIHtcbiAgICAgIGlmIChrZXlEZWZpbml0aW9uc1tjaGFyXSlcbiAgICAgICAgYXdhaXQgdGhpcy5wcmVzcyhjaGFyLCB7ZGVsYXl9KTtcbiAgICAgIGVsc2VcbiAgICAgICAgYXdhaXQgdGhpcy5zZW5kQ2hhcmFjdGVyKGNoYXIpO1xuICAgICAgaWYgKGRlbGF5KVxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShmID0+IHNldFRpbWVvdXQoZiwgZGVsYXkpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBwcmVzcyhrZXksIG9wdGlvbnMpIHtcbiAgICBhd2FpdCB0aGlzLmRvd24oa2V5LCBvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlbGF5KVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoZiA9PiBzZXRUaW1lb3V0KGYsIG9wdGlvbnMuZGVsYXkpKTtcbiAgICBhd2FpdCB0aGlzLnVwKGtleSk7XG4gIH1cbn1cblxuY2xhc3MgTW91c2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7IUtleWJvYXJkfSBrZXlib2FyZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50LCBrZXlib2FyZCkge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9rZXlib2FyZCA9IGtleWJvYXJkO1xuICAgIHRoaXMuX3ggPSAwO1xuICAgIHRoaXMuX3kgPSAwO1xuICAgIC8qKiBAdHlwZSB7J25vbmUnfCdsZWZ0J3wncmlnaHQnfCdtaWRkbGUnfSAqL1xuICAgIHRoaXMuX2J1dHRvbiA9ICdub25lJztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICBhc3luYyBtb3ZlKHgsIHksIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGZyb21YID0gdGhpcy5feCwgZnJvbVkgPSB0aGlzLl95O1xuICAgIHRoaXMuX3ggPSB4O1xuICAgIHRoaXMuX3kgPSB5O1xuICAgIGNvbnN0IHN0ZXBzID0gb3B0aW9ucy5zdGVwcyB8fCAxO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdJbnB1dC5kaXNwYXRjaE1vdXNlRXZlbnQnLCB7XG4gICAgICAgIHR5cGU6ICdtb3VzZU1vdmVkJyxcbiAgICAgICAgYnV0dG9uOiB0aGlzLl9idXR0b24sXG4gICAgICAgIHg6IGZyb21YICsgKHRoaXMuX3ggLSBmcm9tWCkgKiAoaSAvIHN0ZXBzKSxcbiAgICAgICAgeTogZnJvbVkgKyAodGhpcy5feSAtIGZyb21ZKSAqIChpIC8gc3RlcHMpLFxuICAgICAgICBtb2RpZmllcnM6IHRoaXMuX2tleWJvYXJkLl9tb2RpZmllcnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqL1xuICBhc3luYyBjbGljayh4LCB5LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm1vdmUoeCwgeSk7XG4gICAgdGhpcy5kb3duKG9wdGlvbnMpO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PT0gJ251bWJlcicpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShmID0+IHNldFRpbWVvdXQoZiwgb3B0aW9ucy5kZWxheSkpO1xuICAgIGF3YWl0IHRoaXMudXAob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKi9cbiAgYXN5bmMgZG93bihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9idXR0b24gPSAob3B0aW9ucy5idXR0b24gfHwgJ2xlZnQnKTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSW5wdXQuZGlzcGF0Y2hNb3VzZUV2ZW50Jywge1xuICAgICAgdHlwZTogJ21vdXNlUHJlc3NlZCcsXG4gICAgICBidXR0b246IHRoaXMuX2J1dHRvbixcbiAgICAgIHg6IHRoaXMuX3gsXG4gICAgICB5OiB0aGlzLl95LFxuICAgICAgbW9kaWZpZXJzOiB0aGlzLl9rZXlib2FyZC5fbW9kaWZpZXJzLFxuICAgICAgY2xpY2tDb3VudDogKG9wdGlvbnMuY2xpY2tDb3VudCB8fCAxKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHVwKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2J1dHRvbiA9ICdub25lJztcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSW5wdXQuZGlzcGF0Y2hNb3VzZUV2ZW50Jywge1xuICAgICAgdHlwZTogJ21vdXNlUmVsZWFzZWQnLFxuICAgICAgYnV0dG9uOiAob3B0aW9ucy5idXR0b24gfHwgJ2xlZnQnKSxcbiAgICAgIHg6IHRoaXMuX3gsXG4gICAgICB5OiB0aGlzLl95LFxuICAgICAgbW9kaWZpZXJzOiB0aGlzLl9rZXlib2FyZC5fbW9kaWZpZXJzLFxuICAgICAgY2xpY2tDb3VudDogKG9wdGlvbnMuY2xpY2tDb3VudCB8fCAxKVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFRvdWNoc2NyZWVuIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7UHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKiBAcGFyYW0ge0tleWJvYXJkfSBrZXlib2FyZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50LCBrZXlib2FyZCkge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9rZXlib2FyZCA9IGtleWJvYXJkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAqL1xuICBhc3luYyB0YXAoeCwgeSkge1xuICAgIC8vIFRvdWNoZXMgYXBwZWFyIHRvIGJlIGxvc3QgZHVyaW5nIHRoZSBmaXJzdCBmcmFtZSBhZnRlciBuYXZpZ2F0aW9uLlxuICAgIC8vIFRoaXMgd2FpdHMgYSBmcmFtZSBiZWZvcmUgc2VuZGluZyB0aGUgdGFwLlxuICAgIC8vIEBzZWUgaHR0cHM6Ly9jcmJ1Zy5jb20vNjEzMjE5XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1J1bnRpbWUuZXZhbHVhdGUnLCB7XG4gICAgICBleHByZXNzaW9uOiAnbmV3IFByb21pc2UoeCA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHgpKSknLFxuICAgICAgYXdhaXRQcm9taXNlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3VjaFBvaW50cyA9IFt7eDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KX1dO1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdJbnB1dC5kaXNwYXRjaFRvdWNoRXZlbnQnLCB7XG4gICAgICB0eXBlOiAndG91Y2hTdGFydCcsXG4gICAgICB0b3VjaFBvaW50cyxcbiAgICAgIG1vZGlmaWVyczogdGhpcy5fa2V5Ym9hcmQuX21vZGlmaWVyc1xuICAgIH0pO1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdJbnB1dC5kaXNwYXRjaFRvdWNoRXZlbnQnLCB7XG4gICAgICB0eXBlOiAndG91Y2hFbmQnLFxuICAgICAgdG91Y2hQb2ludHM6IFtdLFxuICAgICAgbW9kaWZpZXJzOiB0aGlzLl9rZXlib2FyZC5fbW9kaWZpZXJzXG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEtleWJvYXJkLCBNb3VzZSwgVG91Y2hzY3JlZW59O1xuaGVscGVyLnRyYWNlUHVibGljQVBJKEtleWJvYXJkKTtcbmhlbHBlci50cmFjZVB1YmxpY0FQSShNb3VzZSk7XG5oZWxwZXIudHJhY2VQdWJsaWNBUEkoVG91Y2hzY3JlZW4pO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHRlbXBsYXRlIFZcbiAqL1xuY2xhc3MgTXVsdGltYXAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9tYXAgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtUfSBrZXlcbiAgICogQHBhcmFtIHtWfSB2YWx1ZVxuICAgKi9cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICBsZXQgc2V0ID0gdGhpcy5fbWFwLmdldChrZXkpO1xuICAgIGlmICghc2V0KSB7XG4gICAgICBzZXQgPSBuZXcgU2V0KCk7XG4gICAgICB0aGlzLl9tYXAuc2V0KGtleSwgc2V0KTtcbiAgICB9XG4gICAgc2V0LmFkZCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtUfSBrZXlcbiAgICogQHJldHVybiB7IVNldDxWPn1cbiAgICovXG4gIGdldChrZXkpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5fbWFwLmdldChrZXkpO1xuICAgIGlmICghcmVzdWx0KVxuICAgICAgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtUfSBrZXlcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyhrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VH0ga2V5XG4gICAqIEBwYXJhbSB7Vn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc1ZhbHVlKGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCBzZXQgPSB0aGlzLl9tYXAuZ2V0KGtleSk7XG4gICAgaWYgKCFzZXQpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHNldC5oYXModmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXAuc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1R9IGtleVxuICAgKiBAcGFyYW0ge1Z9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBkZWxldGUoa2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0KGtleSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdmFsdWVzLmRlbGV0ZSh2YWx1ZSk7XG4gICAgaWYgKCF2YWx1ZXMuc2l6ZSlcbiAgICAgIHRoaXMuX21hcC5kZWxldGUoa2V5KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VH0ga2V5XG4gICAqL1xuICBkZWxldGVBbGwoa2V5KSB7XG4gICAgdGhpcy5fbWFwLmRlbGV0ZShrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VH0ga2V5XG4gICAqIEByZXR1cm4ge1Z9XG4gICAqL1xuICBmaXJzdFZhbHVlKGtleSkge1xuICAgIGNvbnN0IHNldCA9IHRoaXMuX21hcC5nZXQoa2V5KTtcbiAgICBpZiAoIXNldClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBzZXQudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1R9XG4gICAqL1xuICBmaXJzdEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IUFycmF5PFY+fVxuICAgKi9cbiAgdmFsdWVzQXJyYXkoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5fbWFwLmtleXMoKSlcbiAgICAgIHJlc3VsdC5wdXNoKC4uLkFycmF5LmZyb20odGhpcy5fbWFwLmdldChrZXkpLnZhbHVlcygpKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXk8VD59XG4gICAqL1xuICBrZXlzQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fbWFwLmtleXMoKSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9tYXAuY2xlYXIoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpbWFwO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCB7aGVscGVyLCBhc3NlcnR9ID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbmNvbnN0IHtGcmFtZU1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9GcmFtZU1hbmFnZXInKTtcbmNvbnN0IHtUaW1lb3V0RXJyb3J9ID0gcmVxdWlyZSgnLi9FcnJvcnMnKTtcblxuY2xhc3MgTmF2aWdhdG9yV2F0Y2hlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFGcmFtZU1hbmFnZXJ9IGZyYW1lTWFuYWdlclxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuRnJhbWV9IGZyYW1lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGZyYW1lTWFuYWdlciwgZnJhbWUsIHRpbWVvdXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGFzc2VydChvcHRpb25zLm5ldHdvcmtJZGxlVGltZW91dCA9PT0gdW5kZWZpbmVkLCAnRVJST1I6IG5ldHdvcmtJZGxlVGltZW91dCBvcHRpb24gaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4nKTtcbiAgICBhc3NlcnQob3B0aW9ucy5uZXR3b3JrSWRsZUluZmxpZ2h0ID09PSB1bmRlZmluZWQsICdFUlJPUjogbmV0d29ya0lkbGVJbmZsaWdodCBvcHRpb24gaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4nKTtcbiAgICBhc3NlcnQob3B0aW9ucy53YWl0VW50aWwgIT09ICduZXR3b3JraWRsZScsICdFUlJPUjogXCJuZXR3b3JraWRsZVwiIG9wdGlvbiBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBVc2UgXCJuZXR3b3JraWRsZTJcIiBpbnN0ZWFkJyk7XG4gICAgbGV0IHdhaXRVbnRpbCA9IFsnbG9hZCddO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMud2FpdFVudGlsKSlcbiAgICAgIHdhaXRVbnRpbCA9IG9wdGlvbnMud2FpdFVudGlsLnNsaWNlKCk7XG4gICAgZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMud2FpdFVudGlsID09PSAnc3RyaW5nJylcbiAgICAgIHdhaXRVbnRpbCA9IFtvcHRpb25zLndhaXRVbnRpbF07XG4gICAgdGhpcy5fZXhwZWN0ZWRMaWZlY3ljbGUgPSB3YWl0VW50aWwubWFwKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IHByb3RvY29sRXZlbnQgPSBwdXBwZXRlZXJUb1Byb3RvY29sTGlmZWN5Y2xlW3ZhbHVlXTtcbiAgICAgIGFzc2VydChwcm90b2NvbEV2ZW50LCAnVW5rbm93biB2YWx1ZSBmb3Igb3B0aW9ucy53YWl0VW50aWw6ICcgKyB2YWx1ZSk7XG4gICAgICByZXR1cm4gcHJvdG9jb2xFdmVudDtcbiAgICB9KTtcblxuICAgIHRoaXMuX2ZyYW1lTWFuYWdlciA9IGZyYW1lTWFuYWdlcjtcbiAgICB0aGlzLl9mcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMuX2luaXRpYWxMb2FkZXJJZCA9IGZyYW1lLl9sb2FkZXJJZDtcbiAgICB0aGlzLl90aW1lb3V0ID0gdGltZW91dDtcbiAgICB0aGlzLl9oYXNTYW1lRG9jdW1lbnROYXZpZ2F0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSBbXG4gICAgICBoZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLl9mcmFtZU1hbmFnZXIsIEZyYW1lTWFuYWdlci5FdmVudHMuTGlmZWN5Y2xlRXZlbnQsIHRoaXMuX2NoZWNrTGlmZWN5Y2xlQ29tcGxldGUuYmluZCh0aGlzKSksXG4gICAgICBoZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLl9mcmFtZU1hbmFnZXIsIEZyYW1lTWFuYWdlci5FdmVudHMuRnJhbWVOYXZpZ2F0ZWRXaXRoaW5Eb2N1bWVudCwgdGhpcy5fbmF2aWdhdGVkV2l0aGluRG9jdW1lbnQuYmluZCh0aGlzKSksXG4gICAgICBoZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLl9mcmFtZU1hbmFnZXIsIEZyYW1lTWFuYWdlci5FdmVudHMuRnJhbWVEZXRhY2hlZCwgdGhpcy5fY2hlY2tMaWZlY3ljbGVDb21wbGV0ZS5iaW5kKHRoaXMpKVxuICAgIF07XG5cbiAgICBjb25zdCBsaWZlY3ljbGVDb21wbGV0ZVByb21pc2UgPSBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHtcbiAgICAgIHRoaXMuX2xpZmVjeWNsZUNvbXBsZXRlQ2FsbGJhY2sgPSBmdWxmaWxsO1xuICAgIH0pO1xuICAgIHRoaXMuX25hdmlnYXRpb25Qcm9taXNlID0gUHJvbWlzZS5yYWNlKFtcbiAgICAgIHRoaXMuX2NyZWF0ZVRpbWVvdXRQcm9taXNlKCksXG4gICAgICBsaWZlY3ljbGVDb21wbGV0ZVByb21pc2VcbiAgICBdKS50aGVuKGVycm9yID0+IHtcbiAgICAgIHRoaXMuX2NsZWFudXAoKTtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/RXJyb3I+fVxuICAgKi9cbiAgX2NyZWF0ZVRpbWVvdXRQcm9taXNlKCkge1xuICAgIGlmICghdGhpcy5fdGltZW91dClcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7fSk7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ05hdmlnYXRpb24gVGltZW91dCBFeGNlZWRlZDogJyArIHRoaXMuX3RpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHRoaXMuX21heGltdW1UaW1lciA9IHNldFRpbWVvdXQoZnVsZmlsbCwgdGhpcy5fdGltZW91dCkpXG4gICAgICAgIC50aGVuKCgpID0+IG5ldyBUaW1lb3V0RXJyb3IoZXJyb3JNZXNzYWdlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8P0Vycm9yPn1cbiAgICovXG4gIGFzeW5jIG5hdmlnYXRpb25Qcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLl9uYXZpZ2F0aW9uUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuRnJhbWV9IGZyYW1lXG4gICAqL1xuICBfbmF2aWdhdGVkV2l0aGluRG9jdW1lbnQoZnJhbWUpIHtcbiAgICBpZiAoZnJhbWUgIT09IHRoaXMuX2ZyYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2hhc1NhbWVEb2N1bWVudE5hdmlnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMuX2NoZWNrTGlmZWN5Y2xlQ29tcGxldGUoKTtcbiAgfVxuXG4gIF9jaGVja0xpZmVjeWNsZUNvbXBsZXRlKCkge1xuICAgIC8vIFdlIGV4cGVjdCBuYXZpZ2F0aW9uIHRvIGNvbW1pdC5cbiAgICBpZiAodGhpcy5fZnJhbWUuX2xvYWRlcklkID09PSB0aGlzLl9pbml0aWFsTG9hZGVySWQgJiYgIXRoaXMuX2hhc1NhbWVEb2N1bWVudE5hdmlnYXRpb24pXG4gICAgICByZXR1cm47XG4gICAgaWYgKCFjaGVja0xpZmVjeWNsZSh0aGlzLl9mcmFtZSwgdGhpcy5fZXhwZWN0ZWRMaWZlY3ljbGUpKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2xpZmVjeWNsZUNvbXBsZXRlQ2FsbGJhY2soKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7IVB1cHBldGVlci5GcmFtZX0gZnJhbWVcbiAgICAgKiBAcGFyYW0geyFBcnJheTxzdHJpbmc+fSBleHBlY3RlZExpZmVjeWNsZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hlY2tMaWZlY3ljbGUoZnJhbWUsIGV4cGVjdGVkTGlmZWN5Y2xlKSB7XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV4cGVjdGVkTGlmZWN5Y2xlKSB7XG4gICAgICAgIGlmICghZnJhbWUuX2xpZmVjeWNsZUV2ZW50cy5oYXMoZXZlbnQpKVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnJhbWUuY2hpbGRGcmFtZXMoKSkge1xuICAgICAgICBpZiAoIWNoZWNrTGlmZWN5Y2xlKGNoaWxkLCBleHBlY3RlZExpZmVjeWNsZSkpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuX2NsZWFudXAoKTtcbiAgfVxuXG4gIF9jbGVhbnVwKCkge1xuICAgIGhlbHBlci5yZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLl9ldmVudExpc3RlbmVycyk7XG4gICAgdGhpcy5fbGlmZWN5Y2xlQ29tcGxldGVDYWxsYmFjayhuZXcgRXJyb3IoJ05hdmlnYXRpb24gZmFpbGVkJykpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9tYXhpbXVtVGltZXIpO1xuICB9XG59XG5cbmNvbnN0IHB1cHBldGVlclRvUHJvdG9jb2xMaWZlY3ljbGUgPSB7XG4gICdsb2FkJzogJ2xvYWQnLFxuICAnZG9tY29udGVudGxvYWRlZCc6ICdET01Db250ZW50TG9hZGVkJyxcbiAgJ25ldHdvcmtpZGxlMCc6ICduZXR3b3JrSWRsZScsXG4gICduZXR3b3JraWRsZTInOiAnbmV0d29ya0FsbW9zdElkbGUnLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7TmF2aWdhdG9yV2F0Y2hlcn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IHtoZWxwZXIsIGFzc2VydCwgZGVidWdFcnJvcn0gPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuY29uc3QgTXVsdGltYXAgPSByZXF1aXJlKCcuL011bHRpbWFwJyk7XG5cbmNsYXNzIE5ldHdvcmtNYW5hZ2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5DRFBTZXNzaW9ufSBjbGllbnRcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkZyYW1lTWFuYWdlcn0gZnJhbWVNYW5hZ2VyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIGZyYW1lTWFuYWdlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX2ZyYW1lTWFuYWdlciA9IGZyYW1lTWFuYWdlcjtcbiAgICAvKiogQHR5cGUgeyFNYXA8c3RyaW5nLCAhUmVxdWVzdD59ICovXG4gICAgdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0ID0gbmV3IE1hcCgpO1xuICAgIC8qKiBAdHlwZSB7IU1hcDxzdHJpbmcsICFQcm90b2NvbC5OZXR3b3JrLnJlcXVlc3RXaWxsQmVTZW50UGF5bG9hZD59ICovXG4gICAgdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0V2lsbEJlU2VudEV2ZW50ID0gbmV3IE1hcCgpO1xuICAgIC8qKiBAdHlwZSB7IU9iamVjdDxzdHJpbmcsIHN0cmluZz59ICovXG4gICAgdGhpcy5fZXh0cmFIVFRQSGVhZGVycyA9IHt9O1xuXG4gICAgdGhpcy5fb2ZmbGluZSA9IGZhbHNlO1xuXG4gICAgLyoqIEB0eXBlIHs/e3VzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmd9fSAqL1xuICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gbnVsbDtcbiAgICAvKiogQHR5cGUgeyFTZXQ8c3RyaW5nPn0gKi9cbiAgICB0aGlzLl9hdHRlbXB0ZWRBdXRoZW50aWNhdGlvbnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fdXNlclJlcXVlc3RJbnRlcmNlcHRpb25FbmFibGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcHJvdG9jb2xSZXF1ZXN0SW50ZXJjZXB0aW9uRW5hYmxlZCA9IGZhbHNlO1xuICAgIC8qKiBAdHlwZSB7IU11bHRpbWFwPHN0cmluZywgc3RyaW5nPn0gKi9cbiAgICB0aGlzLl9yZXF1ZXN0SGFzaFRvUmVxdWVzdElkcyA9IG5ldyBNdWx0aW1hcCgpO1xuICAgIC8qKiBAdHlwZSB7IU11bHRpbWFwPHN0cmluZywgc3RyaW5nPn0gKi9cbiAgICB0aGlzLl9yZXF1ZXN0SGFzaFRvSW50ZXJjZXB0aW9uSWRzID0gbmV3IE11bHRpbWFwKCk7XG5cbiAgICB0aGlzLl9jbGllbnQub24oJ05ldHdvcmsucmVxdWVzdFdpbGxCZVNlbnQnLCB0aGlzLl9vblJlcXVlc3RXaWxsQmVTZW50LmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2NsaWVudC5vbignTmV0d29yay5yZXF1ZXN0SW50ZXJjZXB0ZWQnLCB0aGlzLl9vblJlcXVlc3RJbnRlcmNlcHRlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ05ldHdvcmsucmVxdWVzdFNlcnZlZEZyb21DYWNoZScsIHRoaXMuX29uUmVxdWVzdFNlcnZlZEZyb21DYWNoZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ05ldHdvcmsucmVzcG9uc2VSZWNlaXZlZCcsIHRoaXMuX29uUmVzcG9uc2VSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ05ldHdvcmsubG9hZGluZ0ZpbmlzaGVkJywgdGhpcy5fb25Mb2FkaW5nRmluaXNoZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fY2xpZW50Lm9uKCdOZXR3b3JrLmxvYWRpbmdGYWlsZWQnLCB0aGlzLl9vbkxvYWRpbmdGYWlsZWQuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHs/e3VzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmd9fSBjcmVkZW50aWFsc1xuICAgKi9cbiAgYXN5bmMgYXV0aGVudGljYXRlKGNyZWRlbnRpYWxzKSB7XG4gICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcbiAgICBhd2FpdCB0aGlzLl91cGRhdGVQcm90b2NvbFJlcXVlc3RJbnRlcmNlcHRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3Q8c3RyaW5nLCBzdHJpbmc+fSBleHRyYUhUVFBIZWFkZXJzXG4gICAqL1xuICBhc3luYyBzZXRFeHRyYUhUVFBIZWFkZXJzKGV4dHJhSFRUUEhlYWRlcnMpIHtcbiAgICB0aGlzLl9leHRyYUhUVFBIZWFkZXJzID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZXh0cmFIVFRQSGVhZGVycykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZXh0cmFIVFRQSGVhZGVyc1trZXldO1xuICAgICAgYXNzZXJ0KGhlbHBlci5pc1N0cmluZyh2YWx1ZSksIGBFeHBlY3RlZCB2YWx1ZSBvZiBoZWFkZXIgXCIke2tleX1cIiB0byBiZSBTdHJpbmcsIGJ1dCBcIiR7dHlwZW9mIHZhbHVlfVwiIGlzIGZvdW5kLmApO1xuICAgICAgdGhpcy5fZXh0cmFIVFRQSGVhZGVyc1trZXkudG9Mb3dlckNhc2UoKV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuc2V0RXh0cmFIVFRQSGVhZGVycycsIHsgaGVhZGVyczogdGhpcy5fZXh0cmFIVFRQSGVhZGVycyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshT2JqZWN0PHN0cmluZywgc3RyaW5nPn1cbiAgICovXG4gIGV4dHJhSFRUUEhlYWRlcnMoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2V4dHJhSFRUUEhlYWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWVcbiAgICovXG4gIGFzeW5jIHNldE9mZmxpbmVNb2RlKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX29mZmxpbmUgPT09IHZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX29mZmxpbmUgPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5lbXVsYXRlTmV0d29ya0NvbmRpdGlvbnMnLCB7XG4gICAgICBvZmZsaW5lOiB0aGlzLl9vZmZsaW5lLFxuICAgICAgLy8gdmFsdWVzIG9mIDAgcmVtb3ZlIGFueSBhY3RpdmUgdGhyb3R0bGluZy4gY3JidWcuY29tLzQ1NjMyNCNjOVxuICAgICAgbGF0ZW5jeTogMCxcbiAgICAgIGRvd25sb2FkVGhyb3VnaHB1dDogLTEsXG4gICAgICB1cGxvYWRUaHJvdWdocHV0OiAtMVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyQWdlbnRcbiAgICovXG4gIGFzeW5jIHNldFVzZXJBZ2VudCh1c2VyQWdlbnQpIHtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5zZXRVc2VyQWdlbnRPdmVycmlkZScsIHsgdXNlckFnZW50IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWVcbiAgICovXG4gIGFzeW5jIHNldFJlcXVlc3RJbnRlcmNlcHRpb24odmFsdWUpIHtcbiAgICB0aGlzLl91c2VyUmVxdWVzdEludGVyY2VwdGlvbkVuYWJsZWQgPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLl91cGRhdGVQcm90b2NvbFJlcXVlc3RJbnRlcmNlcHRpb24oKTtcbiAgfVxuXG4gIGFzeW5jIF91cGRhdGVQcm90b2NvbFJlcXVlc3RJbnRlcmNlcHRpb24oKSB7XG4gICAgY29uc3QgZW5hYmxlZCA9IHRoaXMuX3VzZXJSZXF1ZXN0SW50ZXJjZXB0aW9uRW5hYmxlZCB8fCAhIXRoaXMuX2NyZWRlbnRpYWxzO1xuICAgIGlmIChlbmFibGVkID09PSB0aGlzLl9wcm90b2NvbFJlcXVlc3RJbnRlcmNlcHRpb25FbmFibGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX3Byb3RvY29sUmVxdWVzdEludGVyY2VwdGlvbkVuYWJsZWQgPSBlbmFibGVkO1xuICAgIGNvbnN0IHBhdHRlcm5zID0gZW5hYmxlZCA/IFt7dXJsUGF0dGVybjogJyonfV0gOiBbXTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5zZXRDYWNoZURpc2FibGVkJywge2NhY2hlRGlzYWJsZWQ6IGVuYWJsZWR9KSxcbiAgICAgIHRoaXMuX2NsaWVudC5zZW5kKCdOZXR3b3JrLnNldFJlcXVlc3RJbnRlcmNlcHRpb24nLCB7cGF0dGVybnN9KVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLk5ldHdvcmsucmVxdWVzdFdpbGxCZVNlbnRQYXlsb2FkfSBldmVudFxuICAgKi9cbiAgX29uUmVxdWVzdFdpbGxCZVNlbnQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5fcHJvdG9jb2xSZXF1ZXN0SW50ZXJjZXB0aW9uRW5hYmxlZCkge1xuICAgICAgY29uc3QgcmVxdWVzdEhhc2ggPSBnZW5lcmF0ZVJlcXVlc3RIYXNoKGV2ZW50LnJlcXVlc3QpO1xuICAgICAgY29uc3QgaW50ZXJjZXB0aW9uSWQgPSB0aGlzLl9yZXF1ZXN0SGFzaFRvSW50ZXJjZXB0aW9uSWRzLmZpcnN0VmFsdWUocmVxdWVzdEhhc2gpO1xuICAgICAgaWYgKGludGVyY2VwdGlvbklkKSB7XG4gICAgICAgIHRoaXMuX29uUmVxdWVzdChldmVudCwgaW50ZXJjZXB0aW9uSWQpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SGFzaFRvSW50ZXJjZXB0aW9uSWRzLmRlbGV0ZShyZXF1ZXN0SGFzaCwgaW50ZXJjZXB0aW9uSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVxdWVzdEhhc2hUb1JlcXVlc3RJZHMuc2V0KHJlcXVlc3RIYXNoLCBldmVudC5yZXF1ZXN0SWQpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3RXaWxsQmVTZW50RXZlbnQuc2V0KGV2ZW50LnJlcXVlc3RJZCwgZXZlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9vblJlcXVlc3QoZXZlbnQsIG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLk5ldHdvcmsucmVxdWVzdEludGVyY2VwdGVkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF9vblJlcXVlc3RJbnRlcmNlcHRlZChldmVudCkge1xuICAgIGlmIChldmVudC5hdXRoQ2hhbGxlbmdlKSB7XG4gICAgICAvKiogQHR5cGUge1wiRGVmYXVsdFwifFwiQ2FuY2VsQXV0aFwifFwiUHJvdmlkZUNyZWRlbnRpYWxzXCJ9ICovXG4gICAgICBsZXQgcmVzcG9uc2UgPSAnRGVmYXVsdCc7XG4gICAgICBpZiAodGhpcy5fYXR0ZW1wdGVkQXV0aGVudGljYXRpb25zLmhhcyhldmVudC5pbnRlcmNlcHRpb25JZCkpIHtcbiAgICAgICAgcmVzcG9uc2UgPSAnQ2FuY2VsQXV0aCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2NyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJlc3BvbnNlID0gJ1Byb3ZpZGVDcmVkZW50aWFscyc7XG4gICAgICAgIHRoaXMuX2F0dGVtcHRlZEF1dGhlbnRpY2F0aW9ucy5hZGQoZXZlbnQuaW50ZXJjZXB0aW9uSWQpO1xuICAgICAgfVxuICAgICAgY29uc3Qge3VzZXJuYW1lLCBwYXNzd29yZH0gPSB0aGlzLl9jcmVkZW50aWFscyB8fCB7dXNlcm5hbWU6IHVuZGVmaW5lZCwgcGFzc3dvcmQ6IHVuZGVmaW5lZH07XG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5jb250aW51ZUludGVyY2VwdGVkUmVxdWVzdCcsIHtcbiAgICAgICAgaW50ZXJjZXB0aW9uSWQ6IGV2ZW50LmludGVyY2VwdGlvbklkLFxuICAgICAgICBhdXRoQ2hhbGxlbmdlUmVzcG9uc2U6IHsgcmVzcG9uc2UsIHVzZXJuYW1lLCBwYXNzd29yZCB9XG4gICAgICB9KS5jYXRjaChkZWJ1Z0Vycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl91c2VyUmVxdWVzdEludGVyY2VwdGlvbkVuYWJsZWQgJiYgdGhpcy5fcHJvdG9jb2xSZXF1ZXN0SW50ZXJjZXB0aW9uRW5hYmxlZCkge1xuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuY29udGludWVJbnRlcmNlcHRlZFJlcXVlc3QnLCB7XG4gICAgICAgIGludGVyY2VwdGlvbklkOiBldmVudC5pbnRlcmNlcHRpb25JZFxuICAgICAgfSkuY2F0Y2goZGVidWdFcnJvcik7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdEhhc2ggPSBnZW5lcmF0ZVJlcXVlc3RIYXNoKGV2ZW50LnJlcXVlc3QpO1xuICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuX3JlcXVlc3RIYXNoVG9SZXF1ZXN0SWRzLmZpcnN0VmFsdWUocmVxdWVzdEhhc2gpO1xuICAgIGlmIChyZXF1ZXN0SWQpIHtcbiAgICAgIGNvbnN0IHJlcXVlc3RXaWxsQmVTZW50RXZlbnQgPSB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3RXaWxsQmVTZW50RXZlbnQuZ2V0KHJlcXVlc3RJZCk7XG4gICAgICB0aGlzLl9vblJlcXVlc3QocmVxdWVzdFdpbGxCZVNlbnRFdmVudCwgZXZlbnQuaW50ZXJjZXB0aW9uSWQpO1xuICAgICAgdGhpcy5fcmVxdWVzdEhhc2hUb1JlcXVlc3RJZHMuZGVsZXRlKHJlcXVlc3RIYXNoLCByZXF1ZXN0SWQpO1xuICAgICAgdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0V2lsbEJlU2VudEV2ZW50LmRlbGV0ZShyZXF1ZXN0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXF1ZXN0SGFzaFRvSW50ZXJjZXB0aW9uSWRzLnNldChyZXF1ZXN0SGFzaCwgZXZlbnQuaW50ZXJjZXB0aW9uSWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLnJlcXVlc3RXaWxsQmVTZW50UGF5bG9hZH0gZXZlbnRcbiAgICogQHBhcmFtIHs/c3RyaW5nfSBpbnRlcmNlcHRpb25JZFxuICAgKi9cbiAgX29uUmVxdWVzdChldmVudCwgaW50ZXJjZXB0aW9uSWQpIHtcbiAgICBsZXQgcmVkaXJlY3RDaGFpbiA9IFtdO1xuICAgIGlmIChldmVudC5yZWRpcmVjdFJlc3BvbnNlKSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0LmdldChldmVudC5yZXF1ZXN0SWQpO1xuICAgICAgLy8gSWYgd2UgY29ubmVjdCBsYXRlIHRvIHRoZSB0YXJnZXQsIHdlIGNvdWxkIGhhdmUgbWlzc2VkIHRoZSByZXF1ZXN0V2lsbEJlU2VudCBldmVudC5cbiAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZVJlcXVlc3RSZWRpcmVjdChyZXF1ZXN0LCBldmVudC5yZWRpcmVjdFJlc3BvbnNlLnN0YXR1cywgZXZlbnQucmVkaXJlY3RSZXNwb25zZS5oZWFkZXJzLCBldmVudC5yZWRpcmVjdFJlc3BvbnNlLmZyb21EaXNrQ2FjaGUsIGV2ZW50LnJlZGlyZWN0UmVzcG9uc2UuZnJvbVNlcnZpY2VXb3JrZXIsIGV2ZW50LnJlZGlyZWN0UmVzcG9uc2Uuc2VjdXJpdHlEZXRhaWxzKTtcbiAgICAgICAgcmVkaXJlY3RDaGFpbiA9IHJlcXVlc3QuX3JlZGlyZWN0Q2hhaW47XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGlzTmF2aWdhdGlvblJlcXVlc3QgPSBldmVudC5yZXF1ZXN0SWQgPT09IGV2ZW50LmxvYWRlcklkICYmIGV2ZW50LnR5cGUgPT09ICdEb2N1bWVudCc7XG4gICAgdGhpcy5faGFuZGxlUmVxdWVzdFN0YXJ0KGV2ZW50LnJlcXVlc3RJZCwgaW50ZXJjZXB0aW9uSWQsIGV2ZW50LnJlcXVlc3QudXJsLCBpc05hdmlnYXRpb25SZXF1ZXN0LCBldmVudC50eXBlLCBldmVudC5yZXF1ZXN0LCBldmVudC5mcmFtZUlkLCByZWRpcmVjdENoYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLnJlcXVlc3RTZXJ2ZWRGcm9tQ2FjaGVQYXlsb2FkfSBldmVudFxuICAgKi9cbiAgX29uUmVxdWVzdFNlcnZlZEZyb21DYWNoZShldmVudCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3QuZ2V0KGV2ZW50LnJlcXVlc3RJZCk7XG4gICAgaWYgKHJlcXVlc3QpXG4gICAgICByZXF1ZXN0Ll9mcm9tTWVtb3J5Q2FjaGUgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVJlcXVlc3R9IHJlcXVlc3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJlZGlyZWN0U3RhdHVzXG4gICAqIEBwYXJhbSB7IU9iamVjdH0gcmVkaXJlY3RIZWFkZXJzXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnJvbURpc2tDYWNoZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZyb21TZXJ2aWNlV29ya2VyXG4gICAqIEBwYXJhbSB7P09iamVjdH0gc2VjdXJpdHlEZXRhaWxzXG4gICAqL1xuICBfaGFuZGxlUmVxdWVzdFJlZGlyZWN0KHJlcXVlc3QsIHJlZGlyZWN0U3RhdHVzLCByZWRpcmVjdEhlYWRlcnMsIGZyb21EaXNrQ2FjaGUsIGZyb21TZXJ2aWNlV29ya2VyLCBzZWN1cml0eURldGFpbHMpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IG5ldyBSZXNwb25zZSh0aGlzLl9jbGllbnQsIHJlcXVlc3QsIHJlZGlyZWN0U3RhdHVzLCByZWRpcmVjdEhlYWRlcnMsIGZyb21EaXNrQ2FjaGUsIGZyb21TZXJ2aWNlV29ya2VyLCBzZWN1cml0eURldGFpbHMpO1xuICAgIHJlcXVlc3QuX3Jlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgcmVxdWVzdC5fcmVkaXJlY3RDaGFpbi5wdXNoKHJlcXVlc3QpO1xuICAgIHJlc3BvbnNlLl9ib2R5TG9hZGVkUHJvbWlzZUZ1bGZpbGwuY2FsbChudWxsLCBuZXcgRXJyb3IoJ1Jlc3BvbnNlIGJvZHkgaXMgdW5hdmFpbGFibGUgZm9yIHJlZGlyZWN0IHJlc3BvbnNlcycpKTtcbiAgICB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3QuZGVsZXRlKHJlcXVlc3QuX3JlcXVlc3RJZCk7XG4gICAgdGhpcy5fYXR0ZW1wdGVkQXV0aGVudGljYXRpb25zLmRlbGV0ZShyZXF1ZXN0Ll9pbnRlcmNlcHRpb25JZCk7XG4gICAgdGhpcy5lbWl0KE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXNwb25zZSwgcmVzcG9uc2UpO1xuICAgIHRoaXMuZW1pdChOZXR3b3JrTWFuYWdlci5FdmVudHMuUmVxdWVzdEZpbmlzaGVkLCByZXF1ZXN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdElkXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gaW50ZXJjZXB0aW9uSWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTmF2aWdhdGlvblJlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc291cmNlVHlwZVxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLlJlcXVlc3R9IHJlcXVlc3RQYXlsb2FkXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gZnJhbWVJZFxuICAgKiBAcGFyYW0geyFBcnJheTwhUmVxdWVzdD59IHJlZGlyZWN0Q2hhaW5cbiAgICovXG4gIF9oYW5kbGVSZXF1ZXN0U3RhcnQocmVxdWVzdElkLCBpbnRlcmNlcHRpb25JZCwgdXJsLCBpc05hdmlnYXRpb25SZXF1ZXN0LCByZXNvdXJjZVR5cGUsIHJlcXVlc3RQYXlsb2FkLCBmcmFtZUlkLCByZWRpcmVjdENoYWluKSB7XG4gICAgbGV0IGZyYW1lID0gbnVsbDtcbiAgICBpZiAoZnJhbWVJZClcbiAgICAgIGZyYW1lID0gdGhpcy5fZnJhbWVNYW5hZ2VyLmZyYW1lKGZyYW1lSWQpO1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh0aGlzLl9jbGllbnQsIHJlcXVlc3RJZCwgaW50ZXJjZXB0aW9uSWQsIGlzTmF2aWdhdGlvblJlcXVlc3QsIHRoaXMuX3VzZXJSZXF1ZXN0SW50ZXJjZXB0aW9uRW5hYmxlZCwgdXJsLCByZXNvdXJjZVR5cGUsIHJlcXVlc3RQYXlsb2FkLCBmcmFtZSwgcmVkaXJlY3RDaGFpbik7XG4gICAgdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0LnNldChyZXF1ZXN0SWQsIHJlcXVlc3QpO1xuICAgIHRoaXMuZW1pdChOZXR3b3JrTWFuYWdlci5FdmVudHMuUmVxdWVzdCwgcmVxdWVzdCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuTmV0d29yay5yZXNwb25zZVJlY2VpdmVkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF9vblJlc3BvbnNlUmVjZWl2ZWQoZXZlbnQpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0LmdldChldmVudC5yZXF1ZXN0SWQpO1xuICAgIC8vIEZpbGVVcGxvYWQgc2VuZHMgYSByZXNwb25zZSB3aXRob3V0IGEgbWF0Y2hpbmcgcmVxdWVzdC5cbiAgICBpZiAoIXJlcXVlc3QpXG4gICAgICByZXR1cm47XG4gICAgY29uc3QgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UodGhpcy5fY2xpZW50LCByZXF1ZXN0LCBldmVudC5yZXNwb25zZS5zdGF0dXMsIGV2ZW50LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgIGV2ZW50LnJlc3BvbnNlLmZyb21EaXNrQ2FjaGUsIGV2ZW50LnJlc3BvbnNlLmZyb21TZXJ2aWNlV29ya2VyLCBldmVudC5yZXNwb25zZS5zZWN1cml0eURldGFpbHMpO1xuICAgIHJlcXVlc3QuX3Jlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgdGhpcy5lbWl0KE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXNwb25zZSwgcmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLk5ldHdvcmsubG9hZGluZ0ZpbmlzaGVkUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF9vbkxvYWRpbmdGaW5pc2hlZChldmVudCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3QuZ2V0KGV2ZW50LnJlcXVlc3RJZCk7XG4gICAgLy8gRm9yIGNlcnRhaW4gcmVxdWVzdElkcyB3ZSBuZXZlciByZWNlaXZlIHJlcXVlc3RXaWxsQmVTZW50IGV2ZW50LlxuICAgIC8vIEBzZWUgaHR0cHM6Ly9jcmJ1Zy5jb20vNzUwNDY5XG4gICAgaWYgKCFyZXF1ZXN0KVxuICAgICAgcmV0dXJuO1xuICAgIHJlcXVlc3QucmVzcG9uc2UoKS5fYm9keUxvYWRlZFByb21pc2VGdWxmaWxsLmNhbGwobnVsbCk7XG4gICAgdGhpcy5fcmVxdWVzdElkVG9SZXF1ZXN0LmRlbGV0ZShyZXF1ZXN0Ll9yZXF1ZXN0SWQpO1xuICAgIHRoaXMuX2F0dGVtcHRlZEF1dGhlbnRpY2F0aW9ucy5kZWxldGUocmVxdWVzdC5faW50ZXJjZXB0aW9uSWQpO1xuICAgIHRoaXMuZW1pdChOZXR3b3JrTWFuYWdlci5FdmVudHMuUmVxdWVzdEZpbmlzaGVkLCByZXF1ZXN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLmxvYWRpbmdGYWlsZWRQYXlsb2FkfSBldmVudFxuICAgKi9cbiAgX29uTG9hZGluZ0ZhaWxlZChldmVudCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3QuZ2V0KGV2ZW50LnJlcXVlc3RJZCk7XG4gICAgLy8gRm9yIGNlcnRhaW4gcmVxdWVzdElkcyB3ZSBuZXZlciByZWNlaXZlIHJlcXVlc3RXaWxsQmVTZW50IGV2ZW50LlxuICAgIC8vIEBzZWUgaHR0cHM6Ly9jcmJ1Zy5jb20vNzUwNDY5XG4gICAgaWYgKCFyZXF1ZXN0KVxuICAgICAgcmV0dXJuO1xuICAgIHJlcXVlc3QuX2ZhaWx1cmVUZXh0ID0gZXZlbnQuZXJyb3JUZXh0O1xuICAgIGNvbnN0IHJlc3BvbnNlID0gcmVxdWVzdC5yZXNwb25zZSgpO1xuICAgIGlmIChyZXNwb25zZSlcbiAgICAgIHJlc3BvbnNlLl9ib2R5TG9hZGVkUHJvbWlzZUZ1bGZpbGwuY2FsbChudWxsKTtcbiAgICB0aGlzLl9yZXF1ZXN0SWRUb1JlcXVlc3QuZGVsZXRlKHJlcXVlc3QuX3JlcXVlc3RJZCk7XG4gICAgdGhpcy5fYXR0ZW1wdGVkQXV0aGVudGljYXRpb25zLmRlbGV0ZShyZXF1ZXN0Ll9pbnRlcmNlcHRpb25JZCk7XG4gICAgdGhpcy5lbWl0KE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXF1ZXN0RmFpbGVkLCByZXF1ZXN0KTtcbiAgfVxufVxuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5DRFBTZXNzaW9ufSBjbGllbnRcbiAgICogQHBhcmFtIHs/c3RyaW5nfSByZXF1ZXN0SWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyY2VwdGlvbklkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNOYXZpZ2F0aW9uUmVxdWVzdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93SW50ZXJjZXB0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc291cmNlVHlwZVxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLlJlcXVlc3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHs/UHVwcGV0ZWVyLkZyYW1lfSBmcmFtZVxuICAgKiBAcGFyYW0geyFBcnJheTwhUmVxdWVzdD59IHJlZGlyZWN0Q2hhaW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgcmVxdWVzdElkLCBpbnRlcmNlcHRpb25JZCwgaXNOYXZpZ2F0aW9uUmVxdWVzdCwgYWxsb3dJbnRlcmNlcHRpb24sIHVybCwgcmVzb3VyY2VUeXBlLCBwYXlsb2FkLCBmcmFtZSwgcmVkaXJlY3RDaGFpbikge1xuICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLl9yZXF1ZXN0SWQgPSByZXF1ZXN0SWQ7XG4gICAgdGhpcy5faXNOYXZpZ2F0aW9uUmVxdWVzdCA9IGlzTmF2aWdhdGlvblJlcXVlc3Q7XG4gICAgdGhpcy5faW50ZXJjZXB0aW9uSWQgPSBpbnRlcmNlcHRpb25JZDtcbiAgICB0aGlzLl9hbGxvd0ludGVyY2VwdGlvbiA9IGFsbG93SW50ZXJjZXB0aW9uO1xuICAgIHRoaXMuX2ludGVyY2VwdGlvbkhhbmRsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZXNwb25zZSA9IG51bGw7XG4gICAgdGhpcy5fZmFpbHVyZVRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICAgIHRoaXMuX3Jlc291cmNlVHlwZSA9IHJlc291cmNlVHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuX21ldGhvZCA9IHBheWxvYWQubWV0aG9kO1xuICAgIHRoaXMuX3Bvc3REYXRhID0gcGF5bG9hZC5wb3N0RGF0YTtcbiAgICB0aGlzLl9oZWFkZXJzID0ge307XG4gICAgdGhpcy5fZnJhbWUgPSBmcmFtZTtcbiAgICB0aGlzLl9yZWRpcmVjdENoYWluID0gcmVkaXJlY3RDaGFpbjtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwYXlsb2FkLmhlYWRlcnMpKVxuICAgICAgdGhpcy5faGVhZGVyc1trZXkudG9Mb3dlckNhc2UoKV0gPSBwYXlsb2FkLmhlYWRlcnNba2V5XTtcblxuICAgIHRoaXMuX2Zyb21NZW1vcnlDYWNoZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlc291cmNlVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VUeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIG1ldGhvZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWV0aG9kO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHBvc3REYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9wb3N0RGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fVxuICAgKi9cbiAgaGVhZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHs/UmVzcG9uc2V9XG4gICAqL1xuICByZXNwb25zZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7P1B1cHBldGVlci5GcmFtZX1cbiAgICovXG4gIGZyYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9mcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNOYXZpZ2F0aW9uUmVxdWVzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNOYXZpZ2F0aW9uUmVxdWVzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXk8IVJlcXVlc3Q+fVxuICAgKi9cbiAgcmVkaXJlY3RDaGFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3RDaGFpbi5zbGljZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gez97ZXJyb3JUZXh0OiBzdHJpbmd9fVxuICAgKi9cbiAgZmFpbHVyZSgpIHtcbiAgICBpZiAoIXRoaXMuX2ZhaWx1cmVUZXh0KVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yVGV4dDogdGhpcy5fZmFpbHVyZVRleHRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG92ZXJyaWRlc1xuICAgKi9cbiAgYXN5bmMgY29udGludWUob3ZlcnJpZGVzID0ge30pIHtcbiAgICBhc3NlcnQodGhpcy5fYWxsb3dJbnRlcmNlcHRpb24sICdSZXF1ZXN0IEludGVyY2VwdGlvbiBpcyBub3QgZW5hYmxlZCEnKTtcbiAgICBhc3NlcnQoIXRoaXMuX2ludGVyY2VwdGlvbkhhbmRsZWQsICdSZXF1ZXN0IGlzIGFscmVhZHkgaGFuZGxlZCEnKTtcbiAgICB0aGlzLl9pbnRlcmNlcHRpb25IYW5kbGVkID0gdHJ1ZTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5jb250aW51ZUludGVyY2VwdGVkUmVxdWVzdCcsIHtcbiAgICAgIGludGVyY2VwdGlvbklkOiB0aGlzLl9pbnRlcmNlcHRpb25JZCxcbiAgICAgIHVybDogb3ZlcnJpZGVzLnVybCxcbiAgICAgIG1ldGhvZDogb3ZlcnJpZGVzLm1ldGhvZCxcbiAgICAgIHBvc3REYXRhOiBvdmVycmlkZXMucG9zdERhdGEsXG4gICAgICBoZWFkZXJzOiBvdmVycmlkZXMuaGVhZGVycyxcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAvLyBJbiBjZXJ0YWluIGNhc2VzLCBwcm90b2NvbCB3aWxsIHJldHVybiBlcnJvciBpZiB0aGUgcmVxdWVzdCB3YXMgYWxyZWFkeSBjYW5jZWxlZFxuICAgICAgLy8gb3IgdGhlIHBhZ2Ugd2FzIGNsb3NlZC4gV2Ugc2hvdWxkIHRvbGVyYXRlIHRoZXNlIGVycm9ycy5cbiAgICAgIGRlYnVnRXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IXtzdGF0dXM6IG51bWJlciwgaGVhZGVyczogT2JqZWN0LCBjb250ZW50VHlwZTogc3RyaW5nLCBib2R5OiAoc3RyaW5nfEJ1ZmZlcil9fSByZXNwb25zZVxuICAgKi9cbiAgYXN5bmMgcmVzcG9uZChyZXNwb25zZSkge1xuICAgIC8vIE1vY2tpbmcgcmVzcG9uc2VzIGZvciBkYXRhVVJMIHJlcXVlc3RzIGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICAgIGlmICh0aGlzLl91cmwuc3RhcnRzV2l0aCgnZGF0YTonKSlcbiAgICAgIHJldHVybjtcbiAgICBhc3NlcnQodGhpcy5fYWxsb3dJbnRlcmNlcHRpb24sICdSZXF1ZXN0IEludGVyY2VwdGlvbiBpcyBub3QgZW5hYmxlZCEnKTtcbiAgICBhc3NlcnQoIXRoaXMuX2ludGVyY2VwdGlvbkhhbmRsZWQsICdSZXF1ZXN0IGlzIGFscmVhZHkgaGFuZGxlZCEnKTtcbiAgICB0aGlzLl9pbnRlcmNlcHRpb25IYW5kbGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHJlc3BvbnNlQm9keSA9IHJlc3BvbnNlLmJvZHkgJiYgaGVscGVyLmlzU3RyaW5nKHJlc3BvbnNlLmJvZHkpID8gQnVmZmVyLmZyb20oLyoqIEB0eXBlIHtzdHJpbmd9ICovKHJlc3BvbnNlLmJvZHkpKSA6IC8qKiBAdHlwZSB7P0J1ZmZlcn0gKi8ocmVzcG9uc2UuYm9keSB8fCBudWxsKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlSGVhZGVycyA9IHt9O1xuICAgIGlmIChyZXNwb25zZS5oZWFkZXJzKSB7XG4gICAgICBmb3IgKGNvbnN0IGhlYWRlciBvZiBPYmplY3Qua2V5cyhyZXNwb25zZS5oZWFkZXJzKSlcbiAgICAgICAgcmVzcG9uc2VIZWFkZXJzW2hlYWRlci50b0xvd2VyQ2FzZSgpXSA9IHJlc3BvbnNlLmhlYWRlcnNbaGVhZGVyXTtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlLmNvbnRlbnRUeXBlKVxuICAgICAgcmVzcG9uc2VIZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IHJlc3BvbnNlLmNvbnRlbnRUeXBlO1xuICAgIGlmIChyZXNwb25zZUJvZHkgJiYgISgnY29udGVudC1sZW5ndGgnIGluIHJlc3BvbnNlSGVhZGVycykpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJlc3BvbnNlSGVhZGVyc1snY29udGVudC1sZW5ndGgnXSA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHJlc3BvbnNlQm9keSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IHJlc3BvbnNlLnN0YXR1cyB8fCAyMDA7XG4gICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RleHRzW3N0YXR1c0NvZGVdIHx8ICcnO1xuICAgIGNvbnN0IHN0YXR1c0xpbmUgPSBgSFRUUC8xLjEgJHtzdGF0dXNDb2RlfSAke3N0YXR1c1RleHR9YDtcblxuICAgIGNvbnN0IENSTEYgPSAnXFxyXFxuJztcbiAgICBsZXQgdGV4dCA9IHN0YXR1c0xpbmUgKyBDUkxGO1xuICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIE9iamVjdC5rZXlzKHJlc3BvbnNlSGVhZGVycykpXG4gICAgICB0ZXh0ICs9IGhlYWRlciArICc6ICcgKyByZXNwb25zZUhlYWRlcnNbaGVhZGVyXSArIENSTEY7XG4gICAgdGV4dCArPSBDUkxGO1xuICAgIGxldCByZXNwb25zZUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHRleHQsICd1dGY4Jyk7XG4gICAgaWYgKHJlc3BvbnNlQm9keSlcbiAgICAgIHJlc3BvbnNlQnVmZmVyID0gQnVmZmVyLmNvbmNhdChbcmVzcG9uc2VCdWZmZXIsIHJlc3BvbnNlQm9keV0pO1xuXG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuY29udGludWVJbnRlcmNlcHRlZFJlcXVlc3QnLCB7XG4gICAgICBpbnRlcmNlcHRpb25JZDogdGhpcy5faW50ZXJjZXB0aW9uSWQsXG4gICAgICByYXdSZXNwb25zZTogcmVzcG9uc2VCdWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgLy8gSW4gY2VydGFpbiBjYXNlcywgcHJvdG9jb2wgd2lsbCByZXR1cm4gZXJyb3IgaWYgdGhlIHJlcXVlc3Qgd2FzIGFscmVhZHkgY2FuY2VsZWRcbiAgICAgIC8vIG9yIHRoZSBwYWdlIHdhcyBjbG9zZWQuIFdlIHNob3VsZCB0b2xlcmF0ZSB0aGVzZSBlcnJvcnMuXG4gICAgICBkZWJ1Z0Vycm9yKGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGVycm9yQ29kZVxuICAgKi9cbiAgYXN5bmMgYWJvcnQoZXJyb3JDb2RlID0gJ2ZhaWxlZCcpIHtcbiAgICBjb25zdCBlcnJvclJlYXNvbiA9IGVycm9yUmVhc29uc1tlcnJvckNvZGVdO1xuICAgIGFzc2VydChlcnJvclJlYXNvbiwgJ1Vua25vd24gZXJyb3IgY29kZTogJyArIGVycm9yQ29kZSk7XG4gICAgYXNzZXJ0KHRoaXMuX2FsbG93SW50ZXJjZXB0aW9uLCAnUmVxdWVzdCBJbnRlcmNlcHRpb24gaXMgbm90IGVuYWJsZWQhJyk7XG4gICAgYXNzZXJ0KCF0aGlzLl9pbnRlcmNlcHRpb25IYW5kbGVkLCAnUmVxdWVzdCBpcyBhbHJlYWR5IGhhbmRsZWQhJyk7XG4gICAgdGhpcy5faW50ZXJjZXB0aW9uSGFuZGxlZCA9IHRydWU7XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuY29udGludWVJbnRlcmNlcHRlZFJlcXVlc3QnLCB7XG4gICAgICBpbnRlcmNlcHRpb25JZDogdGhpcy5faW50ZXJjZXB0aW9uSWQsXG4gICAgICBlcnJvclJlYXNvblxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIC8vIEluIGNlcnRhaW4gY2FzZXMsIHByb3RvY29sIHdpbGwgcmV0dXJuIGVycm9yIGlmIHRoZSByZXF1ZXN0IHdhcyBhbHJlYWR5IGNhbmNlbGVkXG4gICAgICAvLyBvciB0aGUgcGFnZSB3YXMgY2xvc2VkLiBXZSBzaG91bGQgdG9sZXJhdGUgdGhlc2UgZXJyb3JzLlxuICAgICAgZGVidWdFcnJvcihlcnJvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgZXJyb3JSZWFzb25zID0ge1xuICAnYWJvcnRlZCc6ICdBYm9ydGVkJyxcbiAgJ2FjY2Vzc2RlbmllZCc6ICdBY2Nlc3NEZW5pZWQnLFxuICAnYWRkcmVzc3VucmVhY2hhYmxlJzogJ0FkZHJlc3NVbnJlYWNoYWJsZScsXG4gICdibG9ja2VkYnljbGllbnQnOiAnQmxvY2tlZEJ5Q2xpZW50JyxcbiAgJ2Jsb2NrZWRieXJlc3BvbnNlJzogJ0Jsb2NrZWRCeVJlc3BvbnNlJyxcbiAgJ2Nvbm5lY3Rpb25hYm9ydGVkJzogJ0Nvbm5lY3Rpb25BYm9ydGVkJyxcbiAgJ2Nvbm5lY3Rpb25jbG9zZWQnOiAnQ29ubmVjdGlvbkNsb3NlZCcsXG4gICdjb25uZWN0aW9uZmFpbGVkJzogJ0Nvbm5lY3Rpb25GYWlsZWQnLFxuICAnY29ubmVjdGlvbnJlZnVzZWQnOiAnQ29ubmVjdGlvblJlZnVzZWQnLFxuICAnY29ubmVjdGlvbnJlc2V0JzogJ0Nvbm5lY3Rpb25SZXNldCcsXG4gICdpbnRlcm5ldGRpc2Nvbm5lY3RlZCc6ICdJbnRlcm5ldERpc2Nvbm5lY3RlZCcsXG4gICduYW1lbm90cmVzb2x2ZWQnOiAnTmFtZU5vdFJlc29sdmVkJyxcbiAgJ3RpbWVkb3V0JzogJ1RpbWVkT3V0JyxcbiAgJ2ZhaWxlZCc6ICdGYWlsZWQnLFxufTtcblxuaGVscGVyLnRyYWNlUHVibGljQVBJKFJlcXVlc3QpO1xuXG5jbGFzcyBSZXNwb25zZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7IVJlcXVlc3R9IHJlcXVlc3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1c1xuICAgKiBAcGFyYW0geyFPYmplY3R9IGhlYWRlcnNcbiAgICogQHBhcmFtIHtib29sZWFufSBmcm9tRGlza0NhY2hlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnJvbVNlcnZpY2VXb3JrZXJcbiAgICogQHBhcmFtIHs/T2JqZWN0fSBzZWN1cml0eURldGFpbHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgcmVxdWVzdCwgc3RhdHVzLCBoZWFkZXJzLCBmcm9tRGlza0NhY2hlLCBmcm9tU2VydmljZVdvcmtlciwgc2VjdXJpdHlEZXRhaWxzKSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHRoaXMuX2NvbnRlbnRQcm9taXNlID0gbnVsbDtcblxuICAgIHRoaXMuX2JvZHlMb2FkZWRQcm9taXNlID0gbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICB0aGlzLl9ib2R5TG9hZGVkUHJvbWlzZUZ1bGZpbGwgPSBmdWxmaWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuX3VybCA9IHJlcXVlc3QudXJsKCk7XG4gICAgdGhpcy5fZnJvbURpc2tDYWNoZSA9IGZyb21EaXNrQ2FjaGU7XG4gICAgdGhpcy5fZnJvbVNlcnZpY2VXb3JrZXIgPSBmcm9tU2VydmljZVdvcmtlcjtcbiAgICB0aGlzLl9oZWFkZXJzID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoaGVhZGVycykpXG4gICAgICB0aGlzLl9oZWFkZXJzW2tleS50b0xvd2VyQ2FzZSgpXSA9IGhlYWRlcnNba2V5XTtcbiAgICB0aGlzLl9zZWN1cml0eURldGFpbHMgPSBudWxsO1xuICAgIGlmIChzZWN1cml0eURldGFpbHMpIHtcbiAgICAgIHRoaXMuX3NlY3VyaXR5RGV0YWlscyA9IG5ldyBTZWN1cml0eURldGFpbHMoXG4gICAgICAgICAgc2VjdXJpdHlEZXRhaWxzWydzdWJqZWN0TmFtZSddLFxuICAgICAgICAgIHNlY3VyaXR5RGV0YWlsc1snaXNzdWVyJ10sXG4gICAgICAgICAgc2VjdXJpdHlEZXRhaWxzWyd2YWxpZEZyb20nXSxcbiAgICAgICAgICBzZWN1cml0eURldGFpbHNbJ3ZhbGlkVG8nXSxcbiAgICAgICAgICBzZWN1cml0eURldGFpbHNbJ3Byb3RvY29sJ10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICB1cmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgb2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cyA9PT0gMCB8fCAodGhpcy5fc3RhdHVzID49IDIwMCAmJiB0aGlzLl9zdGF0dXMgPD0gMjk5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fVxuICAgKi9cbiAgaGVhZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHs/U2VjdXJpdHlEZXRhaWxzfVxuICAgKi9cbiAgc2VjdXJpdHlEZXRhaWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWN1cml0eURldGFpbHM7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IUJ1ZmZlcj59XG4gICAqL1xuICBidWZmZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250ZW50UHJvbWlzZSkge1xuICAgICAgdGhpcy5fY29udGVudFByb21pc2UgPSB0aGlzLl9ib2R5TG9hZGVkUHJvbWlzZS50aGVuKGFzeW5jIGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdOZXR3b3JrLmdldFJlc3BvbnNlQm9keScsIHtcbiAgICAgICAgICByZXF1ZXN0SWQ6IHRoaXMuX3JlcXVlc3QuX3JlcXVlc3RJZFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlLmJhc2U2NEVuY29kZWQgPyAnYmFzZTY0JyA6ICd1dGY4Jyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyB0ZXh0KCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmJ1ZmZlcigpO1xuICAgIHJldHVybiBjb250ZW50LnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IU9iamVjdD59XG4gICAqL1xuICBhc3luYyBqc29uKCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnRleHQoKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUmVxdWVzdH1cbiAgICovXG4gIHJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZyb21DYWNoZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJvbURpc2tDYWNoZSB8fCB0aGlzLl9yZXF1ZXN0Ll9mcm9tTWVtb3J5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZyb21TZXJ2aWNlV29ya2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9mcm9tU2VydmljZVdvcmtlcjtcbiAgfVxufVxuaGVscGVyLnRyYWNlUHVibGljQVBJKFJlc3BvbnNlKTtcblxuLyoqXG4gKiBAcGFyYW0geyFQcm90b2NvbC5OZXR3b3JrLlJlcXVlc3R9IHJlcXVlc3RcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVSZXF1ZXN0SGFzaChyZXF1ZXN0KSB7XG4gIGxldCBub3JtYWxpemVkVVJMID0gcmVxdWVzdC51cmw7XG4gIHRyeSB7XG4gICAgLy8gRGVjb2RpbmcgaXMgbmVjZXNzYXJ5IHRvIG5vcm1hbGl6ZSBVUkxzLiBAc2VlIGNyYnVnLmNvbS83NTkzODhcbiAgICAvLyBUaGUgbWV0aG9kIHdpbGwgdGhyb3cgaWYgdGhlIFVSTCBpcyBtYWxmb3JtZWQuIEluIHRoaXMgY2FzZSxcbiAgICAvLyBjb25zaWRlciBVUkwgdG8gYmUgbm9ybWFsaXplZCBhcy1pcy5cbiAgICBub3JtYWxpemVkVVJMID0gZGVjb2RlVVJJKHJlcXVlc3QudXJsKTtcbiAgfSBjYXRjaCAoZSkge1xuICB9XG4gIGNvbnN0IGhhc2ggPSB7XG4gICAgdXJsOiBub3JtYWxpemVkVVJMLFxuICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG4gICAgcG9zdERhdGE6IHJlcXVlc3QucG9zdERhdGEsXG4gICAgaGVhZGVyczoge30sXG4gIH07XG5cbiAgaWYgKCFub3JtYWxpemVkVVJMLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gT2JqZWN0LmtleXMocmVxdWVzdC5oZWFkZXJzKTtcbiAgICBoZWFkZXJzLnNvcnQoKTtcbiAgICBmb3IgKGxldCBoZWFkZXIgb2YgaGVhZGVycykge1xuICAgICAgY29uc3QgaGVhZGVyVmFsdWUgPSByZXF1ZXN0LmhlYWRlcnNbaGVhZGVyXTtcbiAgICAgIGhlYWRlciA9IGhlYWRlci50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKGhlYWRlciA9PT0gJ2FjY2VwdCcgfHwgaGVhZGVyID09PSAncmVmZXJlcicgfHwgaGVhZGVyID09PSAneC1kZXZ0b29scy1lbXVsYXRlLW5ldHdvcmstY29uZGl0aW9ucy1jbGllbnQtaWQnIHx8IGhlYWRlciA9PT0gJ2Nvb2tpZScpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgaGFzaC5oZWFkZXJzW2hlYWRlcl0gPSBoZWFkZXJWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhhc2gpO1xufVxuXG5jbGFzcyBTZWN1cml0eURldGFpbHMge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1YmplY3ROYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpc3N1ZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbGlkRnJvbVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsaWRUb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvdG9jb2xcbiAgICovXG5cbiAgY29uc3RydWN0b3Ioc3ViamVjdE5hbWUsIGlzc3VlciwgdmFsaWRGcm9tLCB2YWxpZFRvLCBwcm90b2NvbCkge1xuICAgIHRoaXMuX3N1YmplY3ROYW1lID0gc3ViamVjdE5hbWU7XG4gICAgdGhpcy5faXNzdWVyID0gaXNzdWVyO1xuICAgIHRoaXMuX3ZhbGlkRnJvbSA9IHZhbGlkRnJvbTtcbiAgICB0aGlzLl92YWxpZFRvID0gdmFsaWRUbztcbiAgICB0aGlzLl9wcm90b2NvbCA9IHByb3RvY29sO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN1YmplY3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zdWJqZWN0TmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBpc3N1ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzc3VlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICB2YWxpZEZyb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkRnJvbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICB2YWxpZFRvKCkge1xuICAgIHJldHVybiB0aGlzLl92YWxpZFRvO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHByb3RvY29sKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm90b2NvbDtcbiAgfVxufVxuXG5OZXR3b3JrTWFuYWdlci5FdmVudHMgPSB7XG4gIFJlcXVlc3Q6ICdyZXF1ZXN0JyxcbiAgUmVzcG9uc2U6ICdyZXNwb25zZScsXG4gIFJlcXVlc3RGYWlsZWQ6ICdyZXF1ZXN0ZmFpbGVkJyxcbiAgUmVxdWVzdEZpbmlzaGVkOiAncmVxdWVzdGZpbmlzaGVkJyxcbn07XG5cbmNvbnN0IHN0YXR1c1RleHRzID0ge1xuICAnMTAwJzogJ0NvbnRpbnVlJyxcbiAgJzEwMSc6ICdTd2l0Y2hpbmcgUHJvdG9jb2xzJyxcbiAgJzEwMic6ICdQcm9jZXNzaW5nJyxcbiAgJzIwMCc6ICdPSycsXG4gICcyMDEnOiAnQ3JlYXRlZCcsXG4gICcyMDInOiAnQWNjZXB0ZWQnLFxuICAnMjAzJzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyxcbiAgJzIwNCc6ICdObyBDb250ZW50JyxcbiAgJzIwNic6ICdQYXJ0aWFsIENvbnRlbnQnLFxuICAnMjA3JzogJ011bHRpLVN0YXR1cycsXG4gICcyMDgnOiAnQWxyZWFkeSBSZXBvcnRlZCcsXG4gICcyMDknOiAnSU0gVXNlZCcsXG4gICczMDAnOiAnTXVsdGlwbGUgQ2hvaWNlcycsXG4gICczMDEnOiAnTW92ZWQgUGVybWFuZW50bHknLFxuICAnMzAyJzogJ0ZvdW5kJyxcbiAgJzMwMyc6ICdTZWUgT3RoZXInLFxuICAnMzA0JzogJ05vdCBNb2RpZmllZCcsXG4gICczMDUnOiAnVXNlIFByb3h5JyxcbiAgJzMwNic6ICdTd2l0Y2ggUHJveHknLFxuICAnMzA3JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcsXG4gICczMDgnOiAnUGVybWFuZW50IFJlZGlyZWN0JyxcbiAgJzQwMCc6ICdCYWQgUmVxdWVzdCcsXG4gICc0MDEnOiAnVW5hdXRob3JpemVkJyxcbiAgJzQwMic6ICdQYXltZW50IFJlcXVpcmVkJyxcbiAgJzQwMyc6ICdGb3JiaWRkZW4nLFxuICAnNDA0JzogJ05vdCBGb3VuZCcsXG4gICc0MDUnOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyxcbiAgJzQwNic6ICdOb3QgQWNjZXB0YWJsZScsXG4gICc0MDcnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnLFxuICAnNDA4JzogJ1JlcXVlc3QgVGltZW91dCcsXG4gICc0MDknOiAnQ29uZmxpY3QnLFxuICAnNDEwJzogJ0dvbmUnLFxuICAnNDExJzogJ0xlbmd0aCBSZXF1aXJlZCcsXG4gICc0MTInOiAnUHJlY29uZGl0aW9uIEZhaWxlZCcsXG4gICc0MTMnOiAnUGF5bG9hZCBUb28gTGFyZ2UnLFxuICAnNDE0JzogJ1VSSSBUb28gTG9uZycsXG4gICc0MTUnOiAnVW5zdXBwb3J0ZWQgTWVkaWEgVHlwZScsXG4gICc0MTYnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyxcbiAgJzQxNyc6ICdFeHBlY3RhdGlvbiBGYWlsZWQnLFxuICAnNDE4JzogJ0lcXCdtIGEgdGVhcG90JyxcbiAgJzQyMSc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyxcbiAgJzQyMic6ICdVbnByb2Nlc3NhYmxlIEVudGl0eScsXG4gICc0MjMnOiAnTG9ja2VkJyxcbiAgJzQyNCc6ICdGYWlsZWQgRGVwZW5kZW5jeScsXG4gICc0MjYnOiAnVXBncmFkZSBSZXF1aXJlZCcsXG4gICc0MjgnOiAnUHJlY29uZGl0aW9uIFJlcXVpcmVkJyxcbiAgJzQyOSc6ICdUb28gTWFueSBSZXF1ZXN0cycsXG4gICc0MzEnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScsXG4gICc0NTEnOiAnVW5hdmFpbGFibGUgRm9yIExlZ2FsIFJlYXNvbnMnLFxuICAnNTAwJzogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXG4gICc1MDEnOiAnTm90IEltcGxlbWVudGVkJyxcbiAgJzUwMic6ICdCYWQgR2F0ZXdheScsXG4gICc1MDMnOiAnU2VydmljZSBVbmF2YWlsYWJsZScsXG4gICc1MDQnOiAnR2F0ZXdheSBUaW1lb3V0JyxcbiAgJzUwNSc6ICdIVFRQIFZlcnNpb24gTm90IFN1cHBvcnRlZCcsXG4gICc1MDYnOiAnVmFyaWFudCBBbHNvIE5lZ290aWF0ZXMnLFxuICAnNTA3JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyxcbiAgJzUwOCc6ICdMb29wIERldGVjdGVkJyxcbiAgJzUxMCc6ICdOb3QgRXh0ZW5kZWQnLFxuICAnNTExJzogJ05ldHdvcmsgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7UmVxdWVzdCwgUmVzcG9uc2UsIE5ldHdvcmtNYW5hZ2VyfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBtaW1lID0gcmVxdWlyZSgnbWltZScpO1xuY29uc3Qge05ldHdvcmtNYW5hZ2VyfSA9IHJlcXVpcmUoJy4vTmV0d29ya01hbmFnZXInKTtcbmNvbnN0IHtOYXZpZ2F0b3JXYXRjaGVyfSA9IHJlcXVpcmUoJy4vTmF2aWdhdG9yV2F0Y2hlcicpO1xuY29uc3Qge0RpYWxvZ30gPSByZXF1aXJlKCcuL0RpYWxvZycpO1xuY29uc3Qge0VtdWxhdGlvbk1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9FbXVsYXRpb25NYW5hZ2VyJyk7XG5jb25zdCB7RnJhbWVNYW5hZ2VyfSA9IHJlcXVpcmUoJy4vRnJhbWVNYW5hZ2VyJyk7XG5jb25zdCB7S2V5Ym9hcmQsIE1vdXNlLCBUb3VjaHNjcmVlbn0gPSByZXF1aXJlKCcuL0lucHV0Jyk7XG5jb25zdCBUcmFjaW5nID0gcmVxdWlyZSgnLi9UcmFjaW5nJyk7XG5jb25zdCB7aGVscGVyLCBkZWJ1Z0Vycm9yLCBhc3NlcnR9ID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbmNvbnN0IHtDb3ZlcmFnZX0gPSByZXF1aXJlKCcuL0NvdmVyYWdlJyk7XG5jb25zdCB7V29ya2VyfSA9IHJlcXVpcmUoJy4vV29ya2VyJyk7XG5cbmNvbnN0IHdyaXRlRmlsZUFzeW5jID0gaGVscGVyLnByb21pc2lmeShmcy53cml0ZUZpbGUpO1xuXG5jbGFzcyBQYWdlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5DRFBTZXNzaW9ufSBjbGllbnRcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLlRhcmdldH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlSFRUUFNFcnJvcnNcbiAgICogQHBhcmFtIHs/UHVwcGV0ZWVyLlZpZXdwb3J0fSBkZWZhdWx0Vmlld3BvcnRcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLlRhc2tRdWV1ZX0gc2NyZWVuc2hvdFRhc2tRdWV1ZVxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUGFnZT59XG4gICAqL1xuICBzdGF0aWMgYXN5bmMgY3JlYXRlKGNsaWVudCwgdGFyZ2V0LCBpZ25vcmVIVFRQU0Vycm9ycywgZGVmYXVsdFZpZXdwb3J0LCBzY3JlZW5zaG90VGFza1F1ZXVlKSB7XG5cbiAgICBhd2FpdCBjbGllbnQuc2VuZCgnUGFnZS5lbmFibGUnKTtcbiAgICBjb25zdCB7ZnJhbWVUcmVlfSA9IGF3YWl0IGNsaWVudC5zZW5kKCdQYWdlLmdldEZyYW1lVHJlZScpO1xuICAgIGNvbnN0IHBhZ2UgPSBuZXcgUGFnZShjbGllbnQsIHRhcmdldCwgZnJhbWVUcmVlLCBpZ25vcmVIVFRQU0Vycm9ycywgc2NyZWVuc2hvdFRhc2tRdWV1ZSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBjbGllbnQuc2VuZCgnVGFyZ2V0LnNldEF1dG9BdHRhY2gnLCB7YXV0b0F0dGFjaDogdHJ1ZSwgd2FpdEZvckRlYnVnZ2VyT25TdGFydDogZmFsc2V9KSxcbiAgICAgIGNsaWVudC5zZW5kKCdQYWdlLnNldExpZmVjeWNsZUV2ZW50c0VuYWJsZWQnLCB7IGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICBjbGllbnQuc2VuZCgnTmV0d29yay5lbmFibGUnLCB7fSksXG4gICAgICBjbGllbnQuc2VuZCgnUnVudGltZS5lbmFibGUnLCB7fSksXG4gICAgICBjbGllbnQuc2VuZCgnU2VjdXJpdHkuZW5hYmxlJywge30pLFxuICAgICAgY2xpZW50LnNlbmQoJ1BlcmZvcm1hbmNlLmVuYWJsZScsIHt9KSxcbiAgICAgIGNsaWVudC5zZW5kKCdMb2cuZW5hYmxlJywge30pLFxuICAgIF0pO1xuICAgIGlmIChpZ25vcmVIVFRQU0Vycm9ycylcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKCdTZWN1cml0eS5zZXRPdmVycmlkZUNlcnRpZmljYXRlRXJyb3JzJywge292ZXJyaWRlOiB0cnVlfSk7XG4gICAgLy8gSW5pdGlhbGl6ZSBkZWZhdWx0IHBhZ2Ugc2l6ZS5cbiAgICBpZiAoZGVmYXVsdFZpZXdwb3J0KVxuICAgICAgYXdhaXQgcGFnZS5zZXRWaWV3cG9ydChkZWZhdWx0Vmlld3BvcnQpO1xuXG4gICAgcmV0dXJuIHBhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuVGFyZ2V0fSB0YXJnZXRcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuUGFnZS5GcmFtZVRyZWV9IGZyYW1lVHJlZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZUhUVFBTRXJyb3JzXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5UYXNrUXVldWV9IHNjcmVlbnNob3RUYXNrUXVldWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgdGFyZ2V0LCBmcmFtZVRyZWUsIGlnbm9yZUhUVFBTRXJyb3JzLCBzY3JlZW5zaG90VGFza1F1ZXVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuX2tleWJvYXJkID0gbmV3IEtleWJvYXJkKGNsaWVudCk7XG4gICAgdGhpcy5fbW91c2UgPSBuZXcgTW91c2UoY2xpZW50LCB0aGlzLl9rZXlib2FyZCk7XG4gICAgdGhpcy5fdG91Y2hzY3JlZW4gPSBuZXcgVG91Y2hzY3JlZW4oY2xpZW50LCB0aGlzLl9rZXlib2FyZCk7XG4gICAgLyoqIEB0eXBlIHshRnJhbWVNYW5hZ2VyfSAqL1xuICAgIHRoaXMuX2ZyYW1lTWFuYWdlciA9IG5ldyBGcmFtZU1hbmFnZXIoY2xpZW50LCBmcmFtZVRyZWUsIHRoaXMpO1xuICAgIHRoaXMuX25ldHdvcmtNYW5hZ2VyID0gbmV3IE5ldHdvcmtNYW5hZ2VyKGNsaWVudCwgdGhpcy5fZnJhbWVNYW5hZ2VyKTtcbiAgICB0aGlzLl9lbXVsYXRpb25NYW5hZ2VyID0gbmV3IEVtdWxhdGlvbk1hbmFnZXIoY2xpZW50KTtcbiAgICB0aGlzLl90cmFjaW5nID0gbmV3IFRyYWNpbmcoY2xpZW50KTtcbiAgICAvKiogQHR5cGUgeyFNYXA8c3RyaW5nLCBGdW5jdGlvbj59ICovXG4gICAgdGhpcy5fcGFnZUJpbmRpbmdzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2lnbm9yZUhUVFBTRXJyb3JzID0gaWdub3JlSFRUUFNFcnJvcnM7XG4gICAgdGhpcy5fY292ZXJhZ2UgPSBuZXcgQ292ZXJhZ2UoY2xpZW50KTtcbiAgICB0aGlzLl9kZWZhdWx0TmF2aWdhdGlvblRpbWVvdXQgPSAzMDAwMDtcbiAgICB0aGlzLl9qYXZhc2NyaXB0RW5hYmxlZCA9IHRydWU7XG4gICAgLyoqIEB0eXBlIHs/UHVwcGV0ZWVyLlZpZXdwb3J0fSAqL1xuICAgIHRoaXMuX3ZpZXdwb3J0ID0gbnVsbDtcblxuICAgIHRoaXMuX3NjcmVlbnNob3RUYXNrUXVldWUgPSBzY3JlZW5zaG90VGFza1F1ZXVlO1xuXG4gICAgLyoqIEB0eXBlIHshTWFwPHN0cmluZywgV29ya2VyPn0gKi9cbiAgICB0aGlzLl93b3JrZXJzID0gbmV3IE1hcCgpO1xuICAgIGNsaWVudC5vbignVGFyZ2V0LmF0dGFjaGVkVG9UYXJnZXQnLCBldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0SW5mby50eXBlICE9PSAnd29ya2VyJykge1xuICAgICAgICAvLyBJZiB3ZSBkb24ndCBkZXRhY2ggZnJvbSBzZXJ2aWNlIHdvcmtlcnMsIHRoZXkgd2lsbCBuZXZlciBkaWUuXG4gICAgICAgIGNsaWVudC5zZW5kKCdUYXJnZXQuZGV0YWNoRnJvbVRhcmdldCcsIHtcbiAgICAgICAgICBzZXNzaW9uSWQ6IGV2ZW50LnNlc3Npb25JZFxuICAgICAgICB9KS5jYXRjaChkZWJ1Z0Vycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGNsaWVudC5fY3JlYXRlU2Vzc2lvbihldmVudC50YXJnZXRJbmZvLnR5cGUsIGV2ZW50LnNlc3Npb25JZCk7XG4gICAgICBjb25zdCB3b3JrZXIgPSBuZXcgV29ya2VyKHNlc3Npb24sIGV2ZW50LnRhcmdldEluZm8udXJsLCB0aGlzLl9hZGRDb25zb2xlTWVzc2FnZS5iaW5kKHRoaXMpLCB0aGlzLl9oYW5kbGVFeGNlcHRpb24uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl93b3JrZXJzLnNldChldmVudC5zZXNzaW9uSWQsIHdvcmtlcik7XG4gICAgICB0aGlzLmVtaXQoUGFnZS5FdmVudHMuV29ya2VyQ3JlYXRlZCwgd29ya2VyKTtcblxuICAgIH0pO1xuICAgIGNsaWVudC5vbignVGFyZ2V0LmRldGFjaGVkRnJvbVRhcmdldCcsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHdvcmtlciA9IHRoaXMuX3dvcmtlcnMuZ2V0KGV2ZW50LnNlc3Npb25JZCk7XG4gICAgICBpZiAoIXdvcmtlcilcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdGhpcy5lbWl0KFBhZ2UuRXZlbnRzLldvcmtlckRlc3Ryb3llZCwgd29ya2VyKTtcbiAgICAgIHRoaXMuX3dvcmtlcnMuZGVsZXRlKGV2ZW50LnNlc3Npb25JZCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9mcmFtZU1hbmFnZXIub24oRnJhbWVNYW5hZ2VyLkV2ZW50cy5GcmFtZUF0dGFjaGVkLCBldmVudCA9PiB0aGlzLmVtaXQoUGFnZS5FdmVudHMuRnJhbWVBdHRhY2hlZCwgZXZlbnQpKTtcbiAgICB0aGlzLl9mcmFtZU1hbmFnZXIub24oRnJhbWVNYW5hZ2VyLkV2ZW50cy5GcmFtZURldGFjaGVkLCBldmVudCA9PiB0aGlzLmVtaXQoUGFnZS5FdmVudHMuRnJhbWVEZXRhY2hlZCwgZXZlbnQpKTtcbiAgICB0aGlzLl9mcmFtZU1hbmFnZXIub24oRnJhbWVNYW5hZ2VyLkV2ZW50cy5GcmFtZU5hdmlnYXRlZCwgZXZlbnQgPT4gdGhpcy5lbWl0KFBhZ2UuRXZlbnRzLkZyYW1lTmF2aWdhdGVkLCBldmVudCkpO1xuXG4gICAgdGhpcy5fbmV0d29ya01hbmFnZXIub24oTmV0d29ya01hbmFnZXIuRXZlbnRzLlJlcXVlc3QsIGV2ZW50ID0+IHRoaXMuZW1pdChQYWdlLkV2ZW50cy5SZXF1ZXN0LCBldmVudCkpO1xuICAgIHRoaXMuX25ldHdvcmtNYW5hZ2VyLm9uKE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXNwb25zZSwgZXZlbnQgPT4gdGhpcy5lbWl0KFBhZ2UuRXZlbnRzLlJlc3BvbnNlLCBldmVudCkpO1xuICAgIHRoaXMuX25ldHdvcmtNYW5hZ2VyLm9uKE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXF1ZXN0RmFpbGVkLCBldmVudCA9PiB0aGlzLmVtaXQoUGFnZS5FdmVudHMuUmVxdWVzdEZhaWxlZCwgZXZlbnQpKTtcbiAgICB0aGlzLl9uZXR3b3JrTWFuYWdlci5vbihOZXR3b3JrTWFuYWdlci5FdmVudHMuUmVxdWVzdEZpbmlzaGVkLCBldmVudCA9PiB0aGlzLmVtaXQoUGFnZS5FdmVudHMuUmVxdWVzdEZpbmlzaGVkLCBldmVudCkpO1xuXG4gICAgY2xpZW50Lm9uKCdQYWdlLmRvbUNvbnRlbnRFdmVudEZpcmVkJywgZXZlbnQgPT4gdGhpcy5lbWl0KFBhZ2UuRXZlbnRzLkRPTUNvbnRlbnRMb2FkZWQpKTtcbiAgICBjbGllbnQub24oJ1BhZ2UubG9hZEV2ZW50RmlyZWQnLCBldmVudCA9PiB0aGlzLmVtaXQoUGFnZS5FdmVudHMuTG9hZCkpO1xuICAgIGNsaWVudC5vbignUnVudGltZS5jb25zb2xlQVBJQ2FsbGVkJywgZXZlbnQgPT4gdGhpcy5fb25Db25zb2xlQVBJKGV2ZW50KSk7XG4gICAgY2xpZW50Lm9uKCdSdW50aW1lLmJpbmRpbmdDYWxsZWQnLCBldmVudCA9PiB0aGlzLl9vbkJpbmRpbmdDYWxsZWQoZXZlbnQpKTtcbiAgICBjbGllbnQub24oJ1BhZ2UuamF2YXNjcmlwdERpYWxvZ09wZW5pbmcnLCBldmVudCA9PiB0aGlzLl9vbkRpYWxvZyhldmVudCkpO1xuICAgIGNsaWVudC5vbignUnVudGltZS5leGNlcHRpb25UaHJvd24nLCBleGNlcHRpb24gPT4gdGhpcy5faGFuZGxlRXhjZXB0aW9uKGV4Y2VwdGlvbi5leGNlcHRpb25EZXRhaWxzKSk7XG4gICAgY2xpZW50Lm9uKCdTZWN1cml0eS5jZXJ0aWZpY2F0ZUVycm9yJywgZXZlbnQgPT4gdGhpcy5fb25DZXJ0aWZpY2F0ZUVycm9yKGV2ZW50KSk7XG4gICAgY2xpZW50Lm9uKCdJbnNwZWN0b3IudGFyZ2V0Q3Jhc2hlZCcsIGV2ZW50ID0+IHRoaXMuX29uVGFyZ2V0Q3Jhc2hlZCgpKTtcbiAgICBjbGllbnQub24oJ1BlcmZvcm1hbmNlLm1ldHJpY3MnLCBldmVudCA9PiB0aGlzLl9lbWl0TWV0cmljcyhldmVudCkpO1xuICAgIGNsaWVudC5vbignTG9nLmVudHJ5QWRkZWQnLCBldmVudCA9PiB0aGlzLl9vbkxvZ0VudHJ5QWRkZWQoZXZlbnQpKTtcbiAgICB0aGlzLl90YXJnZXQuX2lzQ2xvc2VkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZW1pdChQYWdlLkV2ZW50cy5DbG9zZSk7XG4gICAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQdXBwZXRlZXIuVGFyZ2V0fVxuICAgKi9cbiAgdGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVB1cHBldGVlci5Ccm93c2VyfVxuICAgKi9cbiAgYnJvd3NlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0LmJyb3dzZXIoKTtcbiAgfVxuXG4gIF9vblRhcmdldENyYXNoZWQoKSB7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignUGFnZSBjcmFzaGVkIScpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5Mb2cuZW50cnlBZGRlZFBheWxvYWR9IGV2ZW50XG4gICAqL1xuICBfb25Mb2dFbnRyeUFkZGVkKGV2ZW50KSB7XG4gICAgY29uc3Qge2xldmVsLCB0ZXh0LCBhcmdzLCBzb3VyY2V9ID0gZXZlbnQuZW50cnk7XG4gICAgaWYgKGFyZ3MpXG4gICAgICBhcmdzLm1hcChhcmcgPT4gaGVscGVyLnJlbGVhc2VPYmplY3QodGhpcy5fY2xpZW50LCBhcmcpKTtcbiAgICBpZiAoc291cmNlICE9PSAnd29ya2VyJylcbiAgICAgIHRoaXMuZW1pdChQYWdlLkV2ZW50cy5Db25zb2xlLCBuZXcgQ29uc29sZU1lc3NhZ2UobGV2ZWwsIHRleHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHVwcGV0ZWVyLkZyYW1lfVxuICAgKi9cbiAgbWFpbkZyYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9mcmFtZU1hbmFnZXIubWFpbkZyYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IUtleWJvYXJkfVxuICAgKi9cbiAgZ2V0IGtleWJvYXJkKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlib2FyZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshVG91Y2hzY3JlZW59XG4gICAqL1xuICBnZXQgdG91Y2hzY3JlZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdWNoc2NyZWVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFDb3ZlcmFnZX1cbiAgICovXG4gIGdldCBjb3ZlcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY292ZXJhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVRyYWNpbmd9XG4gICAqL1xuICBnZXQgdHJhY2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2luZztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshQXJyYXk8UHVwcGV0ZWVyLkZyYW1lPn1cbiAgICovXG4gIGZyYW1lcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJhbWVNYW5hZ2VyLmZyYW1lcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFBcnJheTwhV29ya2VyPn1cbiAgICovXG4gIHdvcmtlcnMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fd29ya2Vycy52YWx1ZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZVxuICAgKi9cbiAgYXN5bmMgc2V0UmVxdWVzdEludGVyY2VwdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9uZXR3b3JrTWFuYWdlci5zZXRSZXF1ZXN0SW50ZXJjZXB0aW9uKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWRcbiAgICovXG4gIHNldE9mZmxpbmVNb2RlKGVuYWJsZWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV0d29ya01hbmFnZXIuc2V0T2ZmbGluZU1vZGUoZW5hYmxlZCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICovXG4gIHNldERlZmF1bHROYXZpZ2F0aW9uVGltZW91dCh0aW1lb3V0KSB7XG4gICAgdGhpcy5fZGVmYXVsdE5hdmlnYXRpb25UaW1lb3V0ID0gdGltZW91dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5TZWN1cml0eS5jZXJ0aWZpY2F0ZUVycm9yUGF5bG9hZH0gZXZlbnRcbiAgICovXG4gIF9vbkNlcnRpZmljYXRlRXJyb3IoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2lnbm9yZUhUVFBTRXJyb3JzKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2NsaWVudC5zZW5kKCdTZWN1cml0eS5oYW5kbGVDZXJ0aWZpY2F0ZUVycm9yJywge1xuICAgICAgZXZlbnRJZDogZXZlbnQuZXZlbnRJZCxcbiAgICAgIGFjdGlvbjogJ2NvbnRpbnVlJ1xuICAgIH0pLmNhdGNoKGRlYnVnRXJyb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/UHVwcGV0ZWVyLkVsZW1lbnRIYW5kbGU+fVxuICAgKi9cbiAgYXN5bmMgJChzZWxlY3Rvcikge1xuICAgIHJldHVybiB0aGlzLm1haW5GcmFtZSgpLiQoc2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKXxzdHJpbmd9IHBhZ2VGdW5jdGlvblxuICAgKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLkpTSGFuZGxlPn1cbiAgICovXG4gIGFzeW5jIGV2YWx1YXRlSGFuZGxlKHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIGNvbnN0IGNvbnRleHQgPSBhd2FpdCB0aGlzLm1haW5GcmFtZSgpLmV4ZWN1dGlvbkNvbnRleHQoKTtcbiAgICByZXR1cm4gY29udGV4dC5ldmFsdWF0ZUhhbmRsZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5KU0hhbmRsZX0gcHJvdG90eXBlSGFuZGxlXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFQdXBwZXRlZXIuSlNIYW5kbGU+fVxuICAgKi9cbiAgYXN5bmMgcXVlcnlPYmplY3RzKHByb3RvdHlwZUhhbmRsZSkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBhd2FpdCB0aGlzLm1haW5GcmFtZSgpLmV4ZWN1dGlvbkNvbnRleHQoKTtcbiAgICByZXR1cm4gY29udGV4dC5xdWVyeU9iamVjdHMocHJvdG90eXBlSGFuZGxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpfHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCghT2JqZWN0fHVuZGVmaW5lZCk+fVxuICAgKi9cbiAgYXN5bmMgJGV2YWwoc2VsZWN0b3IsIHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLm1haW5GcmFtZSgpLiRldmFsKHNlbGVjdG9yLCBwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCghT2JqZWN0fHVuZGVmaW5lZCk+fVxuICAgKi9cbiAgYXN5bmMgJCRldmFsKHNlbGVjdG9yLCBwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS4kJGV2YWwoc2VsZWN0b3IsIHBhZ2VGdW5jdGlvbiwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFBcnJheTwhUHVwcGV0ZWVyLkVsZW1lbnRIYW5kbGU+Pn1cbiAgICovXG4gIGFzeW5jICQkKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMubWFpbkZyYW1lKCkuJCQoc2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHByZXNzaW9uXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFBcnJheTwhUHVwcGV0ZWVyLkVsZW1lbnRIYW5kbGU+Pn1cbiAgICovXG4gIGFzeW5jICR4KGV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS4keChleHByZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFBcnJheTxzdHJpbmc+fSB1cmxzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFBcnJheTxOZXR3b3JrLkNvb2tpZT4+fVxuICAgKi9cbiAgYXN5bmMgY29va2llcyguLi51cmxzKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnTmV0d29yay5nZXRDb29raWVzJywge1xuICAgICAgdXJsczogdXJscy5sZW5ndGggPyB1cmxzIDogW3RoaXMudXJsKCldXG4gICAgfSkpLmNvb2tpZXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBcnJheTxOZXR3b3JrLkNvb2tpZVBhcmFtPn0gY29va2llc1xuICAgKi9cbiAgYXN5bmMgZGVsZXRlQ29va2llKC4uLmNvb2tpZXMpIHtcbiAgICBjb25zdCBwYWdlVVJMID0gdGhpcy51cmwoKTtcbiAgICBmb3IgKGNvbnN0IGNvb2tpZSBvZiBjb29raWVzKSB7XG4gICAgICBjb25zdCBpdGVtID0gT2JqZWN0LmFzc2lnbih7fSwgY29va2llKTtcbiAgICAgIGlmICghY29va2llLnVybCAmJiBwYWdlVVJMLnN0YXJ0c1dpdGgoJ2h0dHAnKSlcbiAgICAgICAgaXRlbS51cmwgPSBwYWdlVVJMO1xuICAgICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuZGVsZXRlQ29va2llcycsIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5PE5ldHdvcmsuQ29va2llUGFyYW0+fSBjb29raWVzXG4gICAqL1xuICBhc3luYyBzZXRDb29raWUoLi4uY29va2llcykge1xuICAgIGNvbnN0IHBhZ2VVUkwgPSB0aGlzLnVybCgpO1xuICAgIGNvbnN0IHN0YXJ0c1dpdGhIVFRQID0gcGFnZVVSTC5zdGFydHNXaXRoKCdodHRwJyk7XG4gICAgY29uc3QgaXRlbXMgPSBjb29raWVzLm1hcChjb29raWUgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IE9iamVjdC5hc3NpZ24oe30sIGNvb2tpZSk7XG4gICAgICBpZiAoIWl0ZW0udXJsICYmIHN0YXJ0c1dpdGhIVFRQKVxuICAgICAgICBpdGVtLnVybCA9IHBhZ2VVUkw7XG4gICAgICBhc3NlcnQoXG4gICAgICAgICAgaXRlbS51cmwgIT09ICdhYm91dDpibGFuaycsXG4gICAgICAgICAgYEJsYW5rIHBhZ2UgY2FuIG5vdCBoYXZlIGNvb2tpZSBcIiR7aXRlbS5uYW1lfVwiYFxuICAgICAgKTtcbiAgICAgIGFzc2VydChcbiAgICAgICAgICAhU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoLmNhbGwoaXRlbS51cmwgfHwgJycsICdkYXRhOicpLFxuICAgICAgICAgIGBEYXRhIFVSTCBwYWdlIGNhbiBub3QgaGF2ZSBjb29raWUgXCIke2l0ZW0ubmFtZX1cImBcbiAgICAgICk7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbiAgICBhd2FpdCB0aGlzLmRlbGV0ZUNvb2tpZSguLi5pdGVtcyk7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aClcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdOZXR3b3JrLnNldENvb2tpZXMnLCB7IGNvb2tpZXM6IGl0ZW1zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFQdXBwZXRlZXIuRWxlbWVudEhhbmRsZT59XG4gICAqL1xuICBhc3luYyBhZGRTY3JpcHRUYWcob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1haW5GcmFtZSgpLmFkZFNjcmlwdFRhZyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLkVsZW1lbnRIYW5kbGU+fVxuICAgKi9cbiAgYXN5bmMgYWRkU3R5bGVUYWcob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1haW5GcmFtZSgpLmFkZFN0eWxlVGFnKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oPyl9IHB1cHBldGVlckZ1bmN0aW9uXG4gICAqL1xuICBhc3luYyBleHBvc2VGdW5jdGlvbihuYW1lLCBwdXBwZXRlZXJGdW5jdGlvbikge1xuICAgIGlmICh0aGlzLl9wYWdlQmluZGluZ3MuaGFzKG5hbWUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gYWRkIHBhZ2UgYmluZGluZyB3aXRoIG5hbWUgJHtuYW1lfTogd2luZG93Wycke25hbWV9J10gYWxyZWFkeSBleGlzdHMhYCk7XG4gICAgdGhpcy5fcGFnZUJpbmRpbmdzLnNldChuYW1lLCBwdXBwZXRlZXJGdW5jdGlvbik7XG5cbiAgICBjb25zdCBleHByZXNzaW9uID0gaGVscGVyLmV2YWx1YXRpb25TdHJpbmcoYWRkUGFnZUJpbmRpbmcsIG5hbWUpO1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdSdW50aW1lLmFkZEJpbmRpbmcnLCB7bmFtZTogbmFtZX0pO1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdQYWdlLmFkZFNjcmlwdFRvRXZhbHVhdGVPbk5ld0RvY3VtZW50Jywge3NvdXJjZTogZXhwcmVzc2lvbn0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHRoaXMuZnJhbWVzKCkubWFwKGZyYW1lID0+IGZyYW1lLmV2YWx1YXRlKGV4cHJlc3Npb24pLmNhdGNoKGRlYnVnRXJyb3IpKSk7XG5cbiAgICBmdW5jdGlvbiBhZGRQYWdlQmluZGluZyhiaW5kaW5nTmFtZSkge1xuICAgICAgY29uc3QgYmluZGluZyA9IHdpbmRvd1tiaW5kaW5nTmFtZV07XG4gICAgICB3aW5kb3dbYmluZGluZ05hbWVdID0gYXN5bmMoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBtZSA9IHdpbmRvd1tiaW5kaW5nTmFtZV07XG4gICAgICAgIGxldCBjYWxsYmFja3MgPSBtZVsnY2FsbGJhY2tzJ107XG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgICAgY2FsbGJhY2tzID0gbmV3IE1hcCgpO1xuICAgICAgICAgIG1lWydjYWxsYmFja3MnXSA9IGNhbGxiYWNrcztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZXEgPSAobWVbJ2xhc3RTZXEnXSB8fCAwKSArIDE7XG4gICAgICAgIG1lWydsYXN0U2VxJ10gPSBzZXE7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdWxmaWxsID0+IGNhbGxiYWNrcy5zZXQoc2VxLCBmdWxmaWxsKSk7XG4gICAgICAgIGJpbmRpbmcoSlNPTi5zdHJpbmdpZnkoe25hbWU6IGJpbmRpbmdOYW1lLCBzZXEsIGFyZ3N9KSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHs/e3VzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmd9fSBjcmVkZW50aWFsc1xuICAgKi9cbiAgYXN5bmMgYXV0aGVudGljYXRlKGNyZWRlbnRpYWxzKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldHdvcmtNYW5hZ2VyLmF1dGhlbnRpY2F0ZShjcmVkZW50aWFscyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0PHN0cmluZywgc3RyaW5nPn0gaGVhZGVyc1xuICAgKi9cbiAgYXN5bmMgc2V0RXh0cmFIVFRQSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgcmV0dXJuIHRoaXMuX25ldHdvcmtNYW5hZ2VyLnNldEV4dHJhSFRUUEhlYWRlcnMoaGVhZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJBZ2VudFxuICAgKi9cbiAgYXN5bmMgc2V0VXNlckFnZW50KHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB0aGlzLl9uZXR3b3JrTWFuYWdlci5zZXRVc2VyQWdlbnQodXNlckFnZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhT2JqZWN0Pn1cbiAgICovXG4gIGFzeW5jIG1ldHJpY3MoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnUGVyZm9ybWFuY2UuZ2V0TWV0cmljcycpO1xuICAgIHJldHVybiB0aGlzLl9idWlsZE1ldHJpY3NPYmplY3QocmVzcG9uc2UubWV0cmljcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHsqfSBldmVudFxuICAgKi9cbiAgX2VtaXRNZXRyaWNzKGV2ZW50KSB7XG4gICAgdGhpcy5lbWl0KFBhZ2UuRXZlbnRzLk1ldHJpY3MsIHtcbiAgICAgIHRpdGxlOiBldmVudC50aXRsZSxcbiAgICAgIG1ldHJpY3M6IHRoaXMuX2J1aWxkTWV0cmljc09iamVjdChldmVudC5tZXRyaWNzKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7P0FycmF5PCFQcm90b2NvbC5QZXJmb3JtYW5jZS5NZXRyaWM+fSBtZXRyaWNzXG4gICAqIEByZXR1cm4geyFPYmplY3R9XG4gICAqL1xuICBfYnVpbGRNZXRyaWNzT2JqZWN0KG1ldHJpY3MpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG1ldHJpYyBvZiBtZXRyaWNzIHx8IFtdKSB7XG4gICAgICBpZiAoc3VwcG9ydGVkTWV0cmljcy5oYXMobWV0cmljLm5hbWUpKVxuICAgICAgICByZXN1bHRbbWV0cmljLm5hbWVdID0gbWV0cmljLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlJ1bnRpbWUuRXhjZXB0aW9uRGV0YWlsc30gZXhjZXB0aW9uRGV0YWlsc1xuICAgKi9cbiAgX2hhbmRsZUV4Y2VwdGlvbihleGNlcHRpb25EZXRhaWxzKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGhlbHBlci5nZXRFeGNlcHRpb25NZXNzYWdlKGV4Y2VwdGlvbkRldGFpbHMpO1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICBlcnIuc3RhY2sgPSAnJzsgLy8gRG9uJ3QgcmVwb3J0IGNsaWVudHNpZGUgZXJyb3Igd2l0aCBhIG5vZGUgc3RhY2sgYXR0YWNoZWRcbiAgICB0aGlzLmVtaXQoUGFnZS5FdmVudHMuUGFnZUVycm9yLCBlcnIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlJ1bnRpbWUuY29uc29sZUFQSUNhbGxlZFBheWxvYWR9IGV2ZW50XG4gICAqL1xuICBhc3luYyBfb25Db25zb2xlQVBJKGV2ZW50KSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2ZyYW1lTWFuYWdlci5leGVjdXRpb25Db250ZXh0QnlJZChldmVudC5leGVjdXRpb25Db250ZXh0SWQpO1xuICAgIGNvbnN0IHZhbHVlcyA9IGV2ZW50LmFyZ3MubWFwKGFyZyA9PiB0aGlzLl9mcmFtZU1hbmFnZXIuY3JlYXRlSlNIYW5kbGUoY29udGV4dCwgYXJnKSk7XG4gICAgdGhpcy5fYWRkQ29uc29sZU1lc3NhZ2UoZXZlbnQudHlwZSwgdmFsdWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5SdW50aW1lLmJpbmRpbmdDYWxsZWRQYXlsb2FkfSBldmVudFxuICAgKi9cbiAgYXN5bmMgX29uQmluZGluZ0NhbGxlZChldmVudCkge1xuICAgIGNvbnN0IHtuYW1lLCBzZXEsIGFyZ3N9ID0gSlNPTi5wYXJzZShldmVudC5wYXlsb2FkKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLl9wYWdlQmluZGluZ3MuZ2V0KG5hbWUpKC4uLmFyZ3MpO1xuICAgIGNvbnN0IGV4cHJlc3Npb24gPSBoZWxwZXIuZXZhbHVhdGlvblN0cmluZyhkZWxpdmVyUmVzdWx0LCBuYW1lLCBzZXEsIHJlc3VsdCk7XG4gICAgdGhpcy5fY2xpZW50LnNlbmQoJ1J1bnRpbWUuZXZhbHVhdGUnLCB7IGV4cHJlc3Npb24sIGNvbnRleHRJZDogZXZlbnQuZXhlY3V0aW9uQ29udGV4dElkIH0pLmNhdGNoKGRlYnVnRXJyb3IpO1xuXG4gICAgZnVuY3Rpb24gZGVsaXZlclJlc3VsdChuYW1lLCBzZXEsIHJlc3VsdCkge1xuICAgICAgd2luZG93W25hbWVdWydjYWxsYmFja3MnXS5nZXQoc2VxKShyZXN1bHQpO1xuICAgICAgd2luZG93W25hbWVdWydjYWxsYmFja3MnXS5kZWxldGUoc2VxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHBhcmFtIHshQXJyYXk8IVB1cHBldGVlci5KU0hhbmRsZT59IGFyZ3NcbiAgICovXG4gIF9hZGRDb25zb2xlTWVzc2FnZSh0eXBlLCBhcmdzKSB7XG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyQ291bnQoUGFnZS5FdmVudHMuQ29uc29sZSkpIHtcbiAgICAgIGFyZ3MuZm9yRWFjaChhcmcgPT4gYXJnLmRpc3Bvc2UoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRleHRUb2tlbnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBjb25zdCByZW1vdGVPYmplY3QgPSBhcmcuX3JlbW90ZU9iamVjdDtcbiAgICAgIGlmIChyZW1vdGVPYmplY3Qub2JqZWN0SWQpXG4gICAgICAgIHRleHRUb2tlbnMucHVzaChhcmcudG9TdHJpbmcoKSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRleHRUb2tlbnMucHVzaChoZWxwZXIudmFsdWVGcm9tUmVtb3RlT2JqZWN0KHJlbW90ZU9iamVjdCkpO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlID0gbmV3IENvbnNvbGVNZXNzYWdlKHR5cGUsIHRleHRUb2tlbnMuam9pbignICcpLCBhcmdzKTtcbiAgICB0aGlzLmVtaXQoUGFnZS5FdmVudHMuQ29uc29sZSwgbWVzc2FnZSk7XG4gIH1cblxuICBfb25EaWFsb2coZXZlbnQpIHtcbiAgICBsZXQgZGlhbG9nVHlwZSA9IG51bGw7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdhbGVydCcpXG4gICAgICBkaWFsb2dUeXBlID0gRGlhbG9nLlR5cGUuQWxlcnQ7XG4gICAgZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NvbmZpcm0nKVxuICAgICAgZGlhbG9nVHlwZSA9IERpYWxvZy5UeXBlLkNvbmZpcm07XG4gICAgZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3Byb21wdCcpXG4gICAgICBkaWFsb2dUeXBlID0gRGlhbG9nLlR5cGUuUHJvbXB0O1xuICAgIGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdiZWZvcmV1bmxvYWQnKVxuICAgICAgZGlhbG9nVHlwZSA9IERpYWxvZy5UeXBlLkJlZm9yZVVubG9hZDtcbiAgICBhc3NlcnQoZGlhbG9nVHlwZSwgJ1Vua25vd24gamF2YXNjcmlwdCBkaWFsb2cgdHlwZTogJyArIGV2ZW50LnR5cGUpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBEaWFsb2codGhpcy5fY2xpZW50LCBkaWFsb2dUeXBlLCBldmVudC5tZXNzYWdlLCBldmVudC5kZWZhdWx0UHJvbXB0KTtcbiAgICB0aGlzLmVtaXQoUGFnZS5FdmVudHMuRGlhbG9nLCBkaWFsb2cpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFzdHJpbmd9XG4gICAqL1xuICB1cmwoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFpbkZyYW1lKCkudXJsKCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8U3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2ZyYW1lTWFuYWdlci5tYWluRnJhbWUoKS5jb250ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICovXG4gIGFzeW5jIHNldENvbnRlbnQoaHRtbCkge1xuICAgIGF3YWl0IHRoaXMuX2ZyYW1lTWFuYWdlci5tYWluRnJhbWUoKS5zZXRDb250ZW50KGh0bWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/UHVwcGV0ZWVyLlJlc3BvbnNlPn1cbiAgICovXG4gIGFzeW5jIGdvdG8odXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCByZWZlcnJlciA9IHRoaXMuX25ldHdvcmtNYW5hZ2VyLmV4dHJhSFRUUEhlYWRlcnMoKVsncmVmZXJlciddO1xuXG4gICAgLyoqIEB0eXBlIHtNYXA8c3RyaW5nLCAhUHVwcGV0ZWVyLlJlcXVlc3Q+fSAqL1xuICAgIGNvbnN0IHJlcXVlc3RzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gW1xuICAgICAgaGVscGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fbmV0d29ya01hbmFnZXIsIE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXF1ZXN0LCByZXF1ZXN0ID0+IHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0cy5nZXQocmVxdWVzdC51cmwoKSkpXG4gICAgICAgICAgcmVxdWVzdHMuc2V0KHJlcXVlc3QudXJsKCksIHJlcXVlc3QpO1xuICAgICAgfSlcbiAgICBdO1xuXG4gICAgY29uc3QgbWFpbkZyYW1lID0gdGhpcy5fZnJhbWVNYW5hZ2VyLm1haW5GcmFtZSgpO1xuICAgIGNvbnN0IHRpbWVvdXQgPSB0eXBlb2Ygb3B0aW9ucy50aW1lb3V0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMudGltZW91dCA6IHRoaXMuX2RlZmF1bHROYXZpZ2F0aW9uVGltZW91dDtcbiAgICBjb25zdCB3YXRjaGVyID0gbmV3IE5hdmlnYXRvcldhdGNoZXIodGhpcy5fZnJhbWVNYW5hZ2VyLCBtYWluRnJhbWUsIHRpbWVvdXQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IG5hdmlnYXRpb25Qcm9taXNlID0gd2F0Y2hlci5uYXZpZ2F0aW9uUHJvbWlzZSgpO1xuICAgIGxldCBlcnJvciA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICBuYXZpZ2F0ZSh0aGlzLl9jbGllbnQsIHVybCwgcmVmZXJyZXIpLFxuICAgICAgbmF2aWdhdGlvblByb21pc2UsXG4gICAgXSk7XG4gICAgaWYgKCFlcnJvcilcbiAgICAgIGVycm9yID0gYXdhaXQgbmF2aWdhdGlvblByb21pc2U7XG4gICAgd2F0Y2hlci5jYW5jZWwoKTtcbiAgICBoZWxwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoZXZlbnRMaXN0ZW5lcnMpO1xuICAgIGlmIChlcnJvcilcbiAgICAgIHRocm93IGVycm9yO1xuICAgIGNvbnN0IHJlcXVlc3QgPSByZXF1ZXN0cy5nZXQobWFpbkZyYW1lLl9uYXZpZ2F0aW9uVVJMKTtcbiAgICByZXR1cm4gcmVxdWVzdCA/IHJlcXVlc3QucmVzcG9uc2UoKSA6IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWZlcnJlclxuICAgICAqIEByZXR1cm4geyFQcm9taXNlPD9FcnJvcj59XG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gbmF2aWdhdGUoY2xpZW50LCB1cmwsIHJlZmVycmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKCdQYWdlLm5hdmlnYXRlJywge3VybCwgcmVmZXJyZXJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmVycm9yVGV4dCA/IG5ldyBFcnJvcihgJHtyZXNwb25zZS5lcnJvclRleHR9IGF0ICR7dXJsfWApIDogbnVsbDtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/UHVwcGV0ZWVyLlJlc3BvbnNlPn1cbiAgICovXG4gIGFzeW5jIHJlbG9hZChvcHRpb25zKSB7XG4gICAgY29uc3QgW3Jlc3BvbnNlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMud2FpdEZvck5hdmlnYXRpb24ob3B0aW9ucyksXG4gICAgICB0aGlzLl9jbGllbnQuc2VuZCgnUGFnZS5yZWxvYWQnKVxuICAgIF0pO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD9QdXBwZXRlZXIuUmVzcG9uc2U+fVxuICAgKi9cbiAgYXN5bmMgd2FpdEZvck5hdmlnYXRpb24ob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgbWFpbkZyYW1lID0gdGhpcy5fZnJhbWVNYW5hZ2VyLm1haW5GcmFtZSgpO1xuICAgIGNvbnN0IHRpbWVvdXQgPSB0eXBlb2Ygb3B0aW9ucy50aW1lb3V0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMudGltZW91dCA6IHRoaXMuX2RlZmF1bHROYXZpZ2F0aW9uVGltZW91dDtcbiAgICBjb25zdCB3YXRjaGVyID0gbmV3IE5hdmlnYXRvcldhdGNoZXIodGhpcy5fZnJhbWVNYW5hZ2VyLCBtYWluRnJhbWUsIHRpbWVvdXQsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcmVzcG9uc2VzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gaGVscGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fbmV0d29ya01hbmFnZXIsIE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXNwb25zZSwgcmVzcG9uc2UgPT4gcmVzcG9uc2VzLnNldChyZXNwb25zZS51cmwoKSwgcmVzcG9uc2UpKTtcbiAgICBjb25zdCBlcnJvciA9IGF3YWl0IHdhdGNoZXIubmF2aWdhdGlvblByb21pc2UoKTtcbiAgICBoZWxwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoW2xpc3RlbmVyXSk7XG4gICAgaWYgKGVycm9yKVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgcmV0dXJuIHJlc3BvbnNlcy5nZXQodGhpcy5tYWluRnJhbWUoKS51cmwoKSkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8RnVuY3Rpb24pfSB1cmxPclByZWRpY2F0ZVxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFQdXBwZXRlZXIuUmVxdWVzdD59XG4gICAqL1xuICBhc3luYyB3YWl0Rm9yUmVxdWVzdCh1cmxPclByZWRpY2F0ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdGltZW91dCA9IHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgPT09ICdudW1iZXInID8gb3B0aW9ucy50aW1lb3V0IDogMzAwMDA7XG4gICAgcmV0dXJuIGhlbHBlci53YWl0Rm9yRXZlbnQodGhpcy5fbmV0d29ya01hbmFnZXIsIE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXF1ZXN0LCByZXF1ZXN0ID0+IHtcbiAgICAgIGlmIChoZWxwZXIuaXNTdHJpbmcodXJsT3JQcmVkaWNhdGUpKVxuICAgICAgICByZXR1cm4gKHVybE9yUHJlZGljYXRlID09PSByZXF1ZXN0LnVybCgpKTtcbiAgICAgIGlmICh0eXBlb2YgdXJsT3JQcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiAhISh1cmxPclByZWRpY2F0ZShyZXF1ZXN0KSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHsoc3RyaW5nfEZ1bmN0aW9uKX0gdXJsT3JQcmVkaWNhdGVcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTwhUHVwcGV0ZWVyLlJlc3BvbnNlPn1cbiAgICovXG4gIGFzeW5jIHdhaXRGb3JSZXNwb25zZSh1cmxPclByZWRpY2F0ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdGltZW91dCA9IHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgPT09ICdudW1iZXInID8gb3B0aW9ucy50aW1lb3V0IDogMzAwMDA7XG4gICAgcmV0dXJuIGhlbHBlci53YWl0Rm9yRXZlbnQodGhpcy5fbmV0d29ya01hbmFnZXIsIE5ldHdvcmtNYW5hZ2VyLkV2ZW50cy5SZXNwb25zZSwgcmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKGhlbHBlci5pc1N0cmluZyh1cmxPclByZWRpY2F0ZSkpXG4gICAgICAgIHJldHVybiAodXJsT3JQcmVkaWNhdGUgPT09IHJlc3BvbnNlLnVybCgpKTtcbiAgICAgIGlmICh0eXBlb2YgdXJsT3JQcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiAhISh1cmxPclByZWRpY2F0ZShyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2U8P1B1cHBldGVlci5SZXNwb25zZT59XG4gICAqL1xuICBhc3luYyBnb0JhY2sob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLl9nbygtMSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0PX0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZTw/UHVwcGV0ZWVyLlJlc3BvbnNlPn1cbiAgICovXG4gIGFzeW5jIGdvRm9yd2FyZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dvKCsxLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPD9QdXBwZXRlZXIuUmVzcG9uc2U+fVxuICAgKi9cbiAgYXN5bmMgX2dvKGRlbHRhLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdQYWdlLmdldE5hdmlnYXRpb25IaXN0b3J5Jyk7XG4gICAgY29uc3QgZW50cnkgPSBoaXN0b3J5LmVudHJpZXNbaGlzdG9yeS5jdXJyZW50SW5kZXggKyBkZWx0YV07XG4gICAgaWYgKCFlbnRyeSlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IFtyZXNwb25zZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLndhaXRGb3JOYXZpZ2F0aW9uKG9wdGlvbnMpLFxuICAgICAgdGhpcy5fY2xpZW50LnNlbmQoJ1BhZ2UubmF2aWdhdGVUb0hpc3RvcnlFbnRyeScsIHtlbnRyeUlkOiBlbnRyeS5pZH0pLFxuICAgIF0pO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGFzeW5jIGJyaW5nVG9Gcm9udCgpIHtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnUGFnZS5icmluZ1RvRnJvbnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIGVtdWxhdGUob3B0aW9ucykge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLnNldFZpZXdwb3J0KG9wdGlvbnMudmlld3BvcnQpLFxuICAgICAgdGhpcy5zZXRVc2VyQWdlbnQob3B0aW9ucy51c2VyQWdlbnQpXG4gICAgXSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkXG4gICAqL1xuICBhc3luYyBzZXRKYXZhU2NyaXB0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgaWYgKHRoaXMuX2phdmFzY3JpcHRFbmFibGVkID09PSBlbmFibGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2phdmFzY3JpcHRFbmFibGVkID0gZW5hYmxlZDtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldFNjcmlwdEV4ZWN1dGlvbkRpc2FibGVkJywgeyB2YWx1ZTogIWVuYWJsZWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkXG4gICAqL1xuICBhc3luYyBzZXRCeXBhc3NDU1AoZW5hYmxlZCkge1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdQYWdlLnNldEJ5cGFzc0NTUCcsIHsgZW5hYmxlZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IG1lZGlhVHlwZVxuICAgKi9cbiAgYXN5bmMgZW11bGF0ZU1lZGlhKG1lZGlhVHlwZSkge1xuICAgIGFzc2VydChtZWRpYVR5cGUgPT09ICdzY3JlZW4nIHx8IG1lZGlhVHlwZSA9PT0gJ3ByaW50JyB8fCBtZWRpYVR5cGUgPT09IG51bGwsICdVbnN1cHBvcnRlZCBtZWRpYSB0eXBlOiAnICsgbWVkaWFUeXBlKTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldEVtdWxhdGVkTWVkaWEnLCB7bWVkaWE6IG1lZGlhVHlwZSB8fCAnJ30pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5WaWV3cG9ydH0gdmlld3BvcnRcbiAgICovXG4gIGFzeW5jIHNldFZpZXdwb3J0KHZpZXdwb3J0KSB7XG4gICAgY29uc3QgbmVlZHNSZWxvYWQgPSBhd2FpdCB0aGlzLl9lbXVsYXRpb25NYW5hZ2VyLmVtdWxhdGVWaWV3cG9ydCh2aWV3cG9ydCk7XG4gICAgdGhpcy5fdmlld3BvcnQgPSB2aWV3cG9ydDtcbiAgICBpZiAobmVlZHNSZWxvYWQpXG4gICAgICBhd2FpdCB0aGlzLnJlbG9hZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gez9QdXBwZXRlZXIuVmlld3BvcnR9XG4gICAqL1xuICB2aWV3cG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlld3BvcnQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpfHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCo+fVxuICAgKi9cbiAgYXN5bmMgZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lTWFuYWdlci5tYWluRnJhbWUoKS5ldmFsdWF0ZShwYWdlRnVuY3Rpb24sIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKXxzdHJpbmd9IHBhZ2VGdW5jdGlvblxuICAgKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xuICAgKi9cbiAgYXN5bmMgZXZhbHVhdGVPbk5ld0RvY3VtZW50KHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIGNvbnN0IHNvdXJjZSA9IGhlbHBlci5ldmFsdWF0aW9uU3RyaW5nKHBhZ2VGdW5jdGlvbiwgLi4uYXJncyk7XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1BhZ2UuYWRkU2NyaXB0VG9FdmFsdWF0ZU9uTmV3RG9jdW1lbnQnLCB7IHNvdXJjZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWRcbiAgICogQHJldHVybnMgeyFQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgc2V0Q2FjaGVFbmFibGVkKGVuYWJsZWQgPSB0cnVlKSB7XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ05ldHdvcmsuc2V0Q2FjaGVEaXNhYmxlZCcsIHtjYWNoZURpc2FibGVkOiAhZW5hYmxlZH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2U8IUJ1ZmZlcnwhU3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHNjcmVlbnNob3Qob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHNjcmVlbnNob3RUeXBlID0gbnVsbDtcbiAgICAvLyBvcHRpb25zLnR5cGUgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGluZmVycmluZyB0aGUgdHlwZSBmcm9tIG9wdGlvbnMucGF0aFxuICAgIC8vIGJlY2F1c2UgaXQgbWF5IGJlIGEgMC1sZW5ndGggZmlsZSB3aXRoIG5vIGV4dGVuc2lvbiBjcmVhdGVkIGJlZm9yZWhhbmQgKGkuZS4gYXMgYSB0ZW1wIGZpbGUpLlxuICAgIGlmIChvcHRpb25zLnR5cGUpIHtcbiAgICAgIGFzc2VydChvcHRpb25zLnR5cGUgPT09ICdwbmcnIHx8IG9wdGlvbnMudHlwZSA9PT0gJ2pwZWcnLCAnVW5rbm93biBvcHRpb25zLnR5cGUgdmFsdWU6ICcgKyBvcHRpb25zLnR5cGUpO1xuICAgICAgc2NyZWVuc2hvdFR5cGUgPSBvcHRpb25zLnR5cGU7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnBhdGgpIHtcbiAgICAgIGNvbnN0IG1pbWVUeXBlID0gbWltZS5nZXRUeXBlKG9wdGlvbnMucGF0aCk7XG4gICAgICBpZiAobWltZVR5cGUgPT09ICdpbWFnZS9wbmcnKVxuICAgICAgICBzY3JlZW5zaG90VHlwZSA9ICdwbmcnO1xuICAgICAgZWxzZSBpZiAobWltZVR5cGUgPT09ICdpbWFnZS9qcGVnJylcbiAgICAgICAgc2NyZWVuc2hvdFR5cGUgPSAnanBlZyc7XG4gICAgICBhc3NlcnQoc2NyZWVuc2hvdFR5cGUsICdVbnN1cHBvcnRlZCBzY3JlZW5zaG90IG1pbWUgdHlwZTogJyArIG1pbWVUeXBlKTtcbiAgICB9XG5cbiAgICBpZiAoIXNjcmVlbnNob3RUeXBlKVxuICAgICAgc2NyZWVuc2hvdFR5cGUgPSAncG5nJztcblxuICAgIGlmIChvcHRpb25zLnF1YWxpdHkpIHtcbiAgICAgIGFzc2VydChzY3JlZW5zaG90VHlwZSA9PT0gJ2pwZWcnLCAnb3B0aW9ucy5xdWFsaXR5IGlzIHVuc3VwcG9ydGVkIGZvciB0aGUgJyArIHNjcmVlbnNob3RUeXBlICsgJyBzY3JlZW5zaG90cycpO1xuICAgICAgYXNzZXJ0KHR5cGVvZiBvcHRpb25zLnF1YWxpdHkgPT09ICdudW1iZXInLCAnRXhwZWN0ZWQgb3B0aW9ucy5xdWFsaXR5IHRvIGJlIGEgbnVtYmVyIGJ1dCBmb3VuZCAnICsgKHR5cGVvZiBvcHRpb25zLnF1YWxpdHkpKTtcbiAgICAgIGFzc2VydChOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMucXVhbGl0eSksICdFeHBlY3RlZCBvcHRpb25zLnF1YWxpdHkgdG8gYmUgYW4gaW50ZWdlcicpO1xuICAgICAgYXNzZXJ0KG9wdGlvbnMucXVhbGl0eSA+PSAwICYmIG9wdGlvbnMucXVhbGl0eSA8PSAxMDAsICdFeHBlY3RlZCBvcHRpb25zLnF1YWxpdHkgdG8gYmUgYmV0d2VlbiAwIGFuZCAxMDAgKGluY2x1c2l2ZSksIGdvdCAnICsgb3B0aW9ucy5xdWFsaXR5KTtcbiAgICB9XG4gICAgYXNzZXJ0KCFvcHRpb25zLmNsaXAgfHwgIW9wdGlvbnMuZnVsbFBhZ2UsICdvcHRpb25zLmNsaXAgYW5kIG9wdGlvbnMuZnVsbFBhZ2UgYXJlIGV4Y2x1c2l2ZScpO1xuICAgIGlmIChvcHRpb25zLmNsaXApIHtcbiAgICAgIGFzc2VydCh0eXBlb2Ygb3B0aW9ucy5jbGlwLnggPT09ICdudW1iZXInLCAnRXhwZWN0ZWQgb3B0aW9ucy5jbGlwLnggdG8gYmUgYSBudW1iZXIgYnV0IGZvdW5kICcgKyAodHlwZW9mIG9wdGlvbnMuY2xpcC54KSk7XG4gICAgICBhc3NlcnQodHlwZW9mIG9wdGlvbnMuY2xpcC55ID09PSAnbnVtYmVyJywgJ0V4cGVjdGVkIG9wdGlvbnMuY2xpcC55IHRvIGJlIGEgbnVtYmVyIGJ1dCBmb3VuZCAnICsgKHR5cGVvZiBvcHRpb25zLmNsaXAueSkpO1xuICAgICAgYXNzZXJ0KHR5cGVvZiBvcHRpb25zLmNsaXAud2lkdGggPT09ICdudW1iZXInLCAnRXhwZWN0ZWQgb3B0aW9ucy5jbGlwLndpZHRoIHRvIGJlIGEgbnVtYmVyIGJ1dCBmb3VuZCAnICsgKHR5cGVvZiBvcHRpb25zLmNsaXAud2lkdGgpKTtcbiAgICAgIGFzc2VydCh0eXBlb2Ygb3B0aW9ucy5jbGlwLmhlaWdodCA9PT0gJ251bWJlcicsICdFeHBlY3RlZCBvcHRpb25zLmNsaXAuaGVpZ2h0IHRvIGJlIGEgbnVtYmVyIGJ1dCBmb3VuZCAnICsgKHR5cGVvZiBvcHRpb25zLmNsaXAuaGVpZ2h0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zY3JlZW5zaG90VGFza1F1ZXVlLnBvc3RUYXNrKHRoaXMuX3NjcmVlbnNob3RUYXNrLmJpbmQodGhpcywgc2NyZWVuc2hvdFR5cGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1wicG5nXCJ8XCJqcGVnXCJ9IGZvcm1hdFxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCFCdWZmZXJ8IVN0cmluZz59XG4gICAqL1xuICBhc3luYyBfc2NyZWVuc2hvdFRhc2soZm9ybWF0LCBvcHRpb25zKSB7XG4gICAgYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1RhcmdldC5hY3RpdmF0ZVRhcmdldCcsIHt0YXJnZXRJZDogdGhpcy5fdGFyZ2V0Ll90YXJnZXRJZH0pO1xuICAgIGxldCBjbGlwID0gb3B0aW9ucy5jbGlwID8gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9uc1snY2xpcCddKSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoY2xpcClcbiAgICAgIGNsaXAuc2NhbGUgPSAxO1xuXG4gICAgaWYgKG9wdGlvbnMuZnVsbFBhZ2UpIHtcbiAgICAgIGNvbnN0IG1ldHJpY3MgPSBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnUGFnZS5nZXRMYXlvdXRNZXRyaWNzJyk7XG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGguY2VpbChtZXRyaWNzLmNvbnRlbnRTaXplLndpZHRoKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IE1hdGguY2VpbChtZXRyaWNzLmNvbnRlbnRTaXplLmhlaWdodCk7XG5cbiAgICAgIC8vIE92ZXJ3cml0ZSBjbGlwIGZvciBmdWxsIHBhZ2UgYXQgYWxsIHRpbWVzLlxuICAgICAgY2xpcCA9IHsgeDogMCwgeTogMCwgd2lkdGgsIGhlaWdodCwgc2NhbGU6IDEgfTtcbiAgICAgIGNvbnN0IG1vYmlsZSA9IHRoaXMuX3ZpZXdwb3J0LmlzTW9iaWxlIHx8IGZhbHNlO1xuICAgICAgY29uc3QgZGV2aWNlU2NhbGVGYWN0b3IgPSB0aGlzLl92aWV3cG9ydC5kZXZpY2VTY2FsZUZhY3RvciB8fCAxO1xuICAgICAgY29uc3QgbGFuZHNjYXBlID0gdGhpcy5fdmlld3BvcnQuaXNMYW5kc2NhcGUgfHwgZmFsc2U7XG4gICAgICAvKiogQHR5cGUgeyFQcm90b2NvbC5FbXVsYXRpb24uU2NyZWVuT3JpZW50YXRpb259ICovXG4gICAgICBjb25zdCBzY3JlZW5PcmllbnRhdGlvbiA9IGxhbmRzY2FwZSA/IHsgYW5nbGU6IDkwLCB0eXBlOiAnbGFuZHNjYXBlUHJpbWFyeScgfSA6IHsgYW5nbGU6IDAsIHR5cGU6ICdwb3J0cmFpdFByaW1hcnknIH07XG4gICAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldERldmljZU1ldHJpY3NPdmVycmlkZScsIHsgbW9iaWxlLCB3aWR0aCwgaGVpZ2h0LCBkZXZpY2VTY2FsZUZhY3Rvciwgc2NyZWVuT3JpZW50YXRpb24gfSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMub21pdEJhY2tncm91bmQpXG4gICAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnRW11bGF0aW9uLnNldERlZmF1bHRCYWNrZ3JvdW5kQ29sb3JPdmVycmlkZScsIHsgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMCwgYTogMCB9IH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdQYWdlLmNhcHR1cmVTY3JlZW5zaG90JywgeyBmb3JtYXQsIHF1YWxpdHk6IG9wdGlvbnMucXVhbGl0eSwgY2xpcCB9KTtcbiAgICBpZiAob3B0aW9ucy5vbWl0QmFja2dyb3VuZClcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdFbXVsYXRpb24uc2V0RGVmYXVsdEJhY2tncm91bmRDb2xvck92ZXJyaWRlJyk7XG5cbiAgICBpZiAob3B0aW9ucy5mdWxsUGFnZSlcbiAgICAgIGF3YWl0IHRoaXMuc2V0Vmlld3BvcnQodGhpcy5fdmlld3BvcnQpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gb3B0aW9ucy5lbmNvZGluZyA9PT0gJ2Jhc2U2NCcgPyByZXN1bHQuZGF0YSA6IEJ1ZmZlci5mcm9tKHJlc3VsdC5kYXRhLCAnYmFzZTY0Jyk7XG4gICAgaWYgKG9wdGlvbnMucGF0aClcbiAgICAgIGF3YWl0IHdyaXRlRmlsZUFzeW5jKG9wdGlvbnMucGF0aCwgYnVmZmVyKTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHJldHVybiB7IVByb21pc2U8IUJ1ZmZlcj59XG4gICAqL1xuICBhc3luYyBwZGYob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2NhbGUgPSBvcHRpb25zLnNjYWxlIHx8IDE7XG4gICAgY29uc3QgZGlzcGxheUhlYWRlckZvb3RlciA9ICEhb3B0aW9ucy5kaXNwbGF5SGVhZGVyRm9vdGVyO1xuICAgIGNvbnN0IGhlYWRlclRlbXBsYXRlID0gb3B0aW9ucy5oZWFkZXJUZW1wbGF0ZSB8fCAnJztcbiAgICBjb25zdCBmb290ZXJUZW1wbGF0ZSA9IG9wdGlvbnMuZm9vdGVyVGVtcGxhdGUgfHwgJyc7XG4gICAgY29uc3QgcHJpbnRCYWNrZ3JvdW5kID0gISFvcHRpb25zLnByaW50QmFja2dyb3VuZDtcbiAgICBjb25zdCBsYW5kc2NhcGUgPSAhIW9wdGlvbnMubGFuZHNjYXBlO1xuICAgIGNvbnN0IHBhZ2VSYW5nZXMgPSBvcHRpb25zLnBhZ2VSYW5nZXMgfHwgJyc7XG5cbiAgICBsZXQgcGFwZXJXaWR0aCA9IDguNTtcbiAgICBsZXQgcGFwZXJIZWlnaHQgPSAxMTtcbiAgICBpZiAob3B0aW9ucy5mb3JtYXQpIHtcbiAgICAgIGNvbnN0IGZvcm1hdCA9IFBhZ2UuUGFwZXJGb3JtYXRzW29wdGlvbnMuZm9ybWF0LnRvTG93ZXJDYXNlKCldO1xuICAgICAgYXNzZXJ0KGZvcm1hdCwgJ1Vua25vd24gcGFwZXIgZm9ybWF0OiAnICsgb3B0aW9ucy5mb3JtYXQpO1xuICAgICAgcGFwZXJXaWR0aCA9IGZvcm1hdC53aWR0aDtcbiAgICAgIHBhcGVySGVpZ2h0ID0gZm9ybWF0LmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFwZXJXaWR0aCA9IGNvbnZlcnRQcmludFBhcmFtZXRlclRvSW5jaGVzKG9wdGlvbnMud2lkdGgpIHx8IHBhcGVyV2lkdGg7XG4gICAgICBwYXBlckhlaWdodCA9IGNvbnZlcnRQcmludFBhcmFtZXRlclRvSW5jaGVzKG9wdGlvbnMuaGVpZ2h0KSB8fCBwYXBlckhlaWdodDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXJnaW5PcHRpb25zID0gb3B0aW9ucy5tYXJnaW4gfHwge307XG4gICAgY29uc3QgbWFyZ2luVG9wID0gY29udmVydFByaW50UGFyYW1ldGVyVG9JbmNoZXMobWFyZ2luT3B0aW9ucy50b3ApIHx8IDA7XG4gICAgY29uc3QgbWFyZ2luTGVmdCA9IGNvbnZlcnRQcmludFBhcmFtZXRlclRvSW5jaGVzKG1hcmdpbk9wdGlvbnMubGVmdCkgfHwgMDtcbiAgICBjb25zdCBtYXJnaW5Cb3R0b20gPSBjb252ZXJ0UHJpbnRQYXJhbWV0ZXJUb0luY2hlcyhtYXJnaW5PcHRpb25zLmJvdHRvbSkgfHwgMDtcbiAgICBjb25zdCBtYXJnaW5SaWdodCA9IGNvbnZlcnRQcmludFBhcmFtZXRlclRvSW5jaGVzKG1hcmdpbk9wdGlvbnMucmlnaHQpIHx8IDA7XG4gICAgY29uc3QgcHJlZmVyQ1NTUGFnZVNpemUgPSBvcHRpb25zLnByZWZlckNTU1BhZ2VTaXplIHx8IGZhbHNlO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5fY2xpZW50LnNlbmQoJ1BhZ2UucHJpbnRUb1BERicsIHtcbiAgICAgIGxhbmRzY2FwZTogbGFuZHNjYXBlLFxuICAgICAgZGlzcGxheUhlYWRlckZvb3RlcjogZGlzcGxheUhlYWRlckZvb3RlcixcbiAgICAgIGhlYWRlclRlbXBsYXRlOiBoZWFkZXJUZW1wbGF0ZSxcbiAgICAgIGZvb3RlclRlbXBsYXRlOiBmb290ZXJUZW1wbGF0ZSxcbiAgICAgIHByaW50QmFja2dyb3VuZDogcHJpbnRCYWNrZ3JvdW5kLFxuICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgcGFwZXJXaWR0aDogcGFwZXJXaWR0aCxcbiAgICAgIHBhcGVySGVpZ2h0OiBwYXBlckhlaWdodCxcbiAgICAgIG1hcmdpblRvcDogbWFyZ2luVG9wLFxuICAgICAgbWFyZ2luQm90dG9tOiBtYXJnaW5Cb3R0b20sXG4gICAgICBtYXJnaW5MZWZ0OiBtYXJnaW5MZWZ0LFxuICAgICAgbWFyZ2luUmlnaHQ6IG1hcmdpblJpZ2h0LFxuICAgICAgcGFnZVJhbmdlczogcGFnZVJhbmdlcyxcbiAgICAgIHByZWZlckNTU1BhZ2VTaXplOiBwcmVmZXJDU1NQYWdlU2l6ZVxuICAgIH0pO1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHJlc3VsdC5kYXRhLCAnYmFzZTY0Jyk7XG4gICAgaWYgKG9wdGlvbnMucGF0aClcbiAgICAgIGF3YWl0IHdyaXRlRmlsZUFzeW5jKG9wdGlvbnMucGF0aCwgYnVmZmVyKTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS50aXRsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IXtydW5CZWZvcmVVbmxvYWQ6IChib29sZWFufHVuZGVmaW5lZCl9PX0gb3B0aW9uc1xuICAgKi9cbiAgYXN5bmMgY2xvc2Uob3B0aW9ucyA9IHtydW5CZWZvcmVVbmxvYWQ6IHVuZGVmaW5lZH0pIHtcbiAgICBhc3NlcnQoISF0aGlzLl9jbGllbnQuX2Nvbm5lY3Rpb24sICdQcm90b2NvbCBlcnJvcjogQ29ubmVjdGlvbiBjbG9zZWQuIE1vc3QgbGlrZWx5IHRoZSBwYWdlIGhhcyBiZWVuIGNsb3NlZC4nKTtcbiAgICBjb25zdCBydW5CZWZvcmVVbmxvYWQgPSAhIW9wdGlvbnMucnVuQmVmb3JlVW5sb2FkO1xuICAgIGlmIChydW5CZWZvcmVVbmxvYWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdQYWdlLmNsb3NlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5fY29ubmVjdGlvbi5zZW5kKCdUYXJnZXQuY2xvc2VUYXJnZXQnLCB7IHRhcmdldElkOiB0aGlzLl90YXJnZXQuX3RhcmdldElkIH0pO1xuICAgICAgYXdhaXQgdGhpcy5fdGFyZ2V0Ll9pc0Nsb3NlZFByb21pc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvc2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFNb3VzZX1cbiAgICovXG4gIGdldCBtb3VzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW91c2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICovXG4gIGNsaWNrKHNlbGVjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS5jbGljayhzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqL1xuICBmb2N1cyhzZWxlY3Rvcikge1xuICAgIHJldHVybiB0aGlzLm1haW5GcmFtZSgpLmZvY3VzKHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICovXG4gIGhvdmVyKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMubWFpbkZyYW1lKCkuaG92ZXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0geyFBcnJheTxzdHJpbmc+fSB2YWx1ZXNcbiAgICogQHJldHVybiB7IVByb21pc2U8IUFycmF5PHN0cmluZz4+fVxuICAgKi9cbiAgc2VsZWN0KHNlbGVjdG9yLCAuLi52YWx1ZXMpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS5zZWxlY3Qoc2VsZWN0b3IsIC4uLnZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqL1xuICB0YXAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS50YXAoc2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKiBAcGFyYW0ge3tkZWxheTogKG51bWJlcnx1bmRlZmluZWQpfT19IG9wdGlvbnNcbiAgICovXG4gIHR5cGUoc2VsZWN0b3IsIHRleHQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS50eXBlKHNlbGVjdG9yLCB0ZXh0LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyfEZ1bmN0aW9uKX0gc2VsZWN0b3JPckZ1bmN0aW9uT3JUaW1lb3V0XG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICB3YWl0Rm9yKHNlbGVjdG9yT3JGdW5jdGlvbk9yVGltZW91dCwgb3B0aW9ucyA9IHt9LCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMubWFpbkZyYW1lKCkud2FpdEZvcihzZWxlY3Rvck9yRnVuY3Rpb25PclRpbWVvdXQsIG9wdGlvbnMsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlfVxuICAgKi9cbiAgd2FpdEZvclNlbGVjdG9yKHNlbGVjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS53YWl0Rm9yU2VsZWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB4cGF0aFxuICAgKiBAcGFyYW0geyFPYmplY3Q9fSBvcHRpb25zXG4gICAqIEByZXR1cm4geyFQcm9taXNlfVxuICAgKi9cbiAgd2FpdEZvclhQYXRoKHhwYXRoLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS53YWl0Rm9yWFBhdGgoeHBhdGgsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IU9iamVjdD19IG9wdGlvbnNcbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2V9XG4gICAqL1xuICB3YWl0Rm9yRnVuY3Rpb24ocGFnZUZ1bmN0aW9uLCBvcHRpb25zID0ge30sIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5tYWluRnJhbWUoKS53YWl0Rm9yRnVuY3Rpb24ocGFnZUZ1bmN0aW9uLCBvcHRpb25zLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vKiogQHR5cGUgeyFTZXQ8c3RyaW5nPn0gKi9cbmNvbnN0IHN1cHBvcnRlZE1ldHJpY3MgPSBuZXcgU2V0KFtcbiAgJ1RpbWVzdGFtcCcsXG4gICdEb2N1bWVudHMnLFxuICAnRnJhbWVzJyxcbiAgJ0pTRXZlbnRMaXN0ZW5lcnMnLFxuICAnTm9kZXMnLFxuICAnTGF5b3V0Q291bnQnLFxuICAnUmVjYWxjU3R5bGVDb3VudCcsXG4gICdMYXlvdXREdXJhdGlvbicsXG4gICdSZWNhbGNTdHlsZUR1cmF0aW9uJyxcbiAgJ1NjcmlwdER1cmF0aW9uJyxcbiAgJ1Rhc2tEdXJhdGlvbicsXG4gICdKU0hlYXBVc2VkU2l6ZScsXG4gICdKU0hlYXBUb3RhbFNpemUnLFxuXSk7XG5cbi8qKiBAZW51bSB7c3RyaW5nfSAqL1xuUGFnZS5QYXBlckZvcm1hdHMgPSB7XG4gIGxldHRlcjoge3dpZHRoOiA4LjUsIGhlaWdodDogMTF9LFxuICBsZWdhbDoge3dpZHRoOiA4LjUsIGhlaWdodDogMTR9LFxuICB0YWJsb2lkOiB7d2lkdGg6IDExLCBoZWlnaHQ6IDE3fSxcbiAgbGVkZ2VyOiB7d2lkdGg6IDE3LCBoZWlnaHQ6IDExfSxcbiAgYTA6IHt3aWR0aDogMzMuMSwgaGVpZ2h0OiA0Ni44IH0sXG4gIGExOiB7d2lkdGg6IDIzLjQsIGhlaWdodDogMzMuMSB9LFxuICBhMjoge3dpZHRoOiAxNi41LCBoZWlnaHQ6IDIzLjQgfSxcbiAgYTM6IHt3aWR0aDogMTEuNywgaGVpZ2h0OiAxNi41IH0sXG4gIGE0OiB7d2lkdGg6IDguMjcsIGhlaWdodDogMTEuNyB9LFxuICBhNToge3dpZHRoOiA1LjgzLCBoZWlnaHQ6IDguMjcgfSxcbiAgYTY6IHt3aWR0aDogNC4xMywgaGVpZ2h0OiA1LjgzIH0sXG59O1xuXG5jb25zdCB1bml0VG9QaXhlbHMgPSB7XG4gICdweCc6IDEsXG4gICdpbic6IDk2LFxuICAnY20nOiAzNy44LFxuICAnbW0nOiAzLjc4XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8dW5kZWZpbmVkKX0gcGFyYW1ldGVyXG4gKiBAcmV0dXJuIHsobnVtYmVyfHVuZGVmaW5lZCl9XG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRQcmludFBhcmFtZXRlclRvSW5jaGVzKHBhcmFtZXRlcikge1xuICBpZiAodHlwZW9mIHBhcmFtZXRlciA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgbGV0IHBpeGVscztcbiAgaWYgKGhlbHBlci5pc051bWJlcihwYXJhbWV0ZXIpKSB7XG4gICAgLy8gVHJlYXQgbnVtYmVycyBhcyBwaXhlbCB2YWx1ZXMgdG8gYmUgYWxpZ25lZCB3aXRoIHBoYW50b20ncyBwYXBlclNpemUuXG4gICAgcGl4ZWxzID0gLyoqIEB0eXBlIHtudW1iZXJ9ICovIChwYXJhbWV0ZXIpO1xuICB9IGVsc2UgaWYgKGhlbHBlci5pc1N0cmluZyhwYXJhbWV0ZXIpKSB7XG4gICAgY29uc3QgdGV4dCA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAocGFyYW1ldGVyKTtcbiAgICBsZXQgdW5pdCA9IHRleHQuc3Vic3RyaW5nKHRleHQubGVuZ3RoIC0gMikudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgdmFsdWVUZXh0ID0gJyc7XG4gICAgaWYgKHVuaXRUb1BpeGVscy5oYXNPd25Qcm9wZXJ0eSh1bml0KSkge1xuICAgICAgdmFsdWVUZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgdGV4dC5sZW5ndGggLSAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBvZiB1bmtub3duIHVuaXQgdHJ5IHRvIHBhcnNlIHRoZSB3aG9sZSBwYXJhbWV0ZXIgYXMgbnVtYmVyIG9mIHBpeGVscy5cbiAgICAgIC8vIFRoaXMgaXMgY29uc2lzdGVudCB3aXRoIHBoYW50b20ncyBwYXBlclNpemUgYmVoYXZpb3IuXG4gICAgICB1bml0ID0gJ3B4JztcbiAgICAgIHZhbHVlVGV4dCA9IHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKHZhbHVlVGV4dCk7XG4gICAgYXNzZXJ0KCFpc05hTih2YWx1ZSksICdGYWlsZWQgdG8gcGFyc2UgcGFyYW1ldGVyIHZhbHVlOiAnICsgdGV4dCk7XG4gICAgcGl4ZWxzID0gdmFsdWUgKiB1bml0VG9QaXhlbHNbdW5pdF07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwYWdlLnBkZigpIENhbm5vdCBoYW5kbGUgcGFyYW1ldGVyIHR5cGU6ICcgKyAodHlwZW9mIHBhcmFtZXRlcikpO1xuICB9XG4gIHJldHVybiBwaXhlbHMgLyA5Njtcbn1cblxuUGFnZS5FdmVudHMgPSB7XG4gIENsb3NlOiAnY2xvc2UnLFxuICBDb25zb2xlOiAnY29uc29sZScsXG4gIERpYWxvZzogJ2RpYWxvZycsXG4gIERPTUNvbnRlbnRMb2FkZWQ6ICdkb21jb250ZW50bG9hZGVkJyxcbiAgRXJyb3I6ICdlcnJvcicsXG4gIC8vIENhbid0IHVzZSBqdXN0ICdlcnJvcicgZHVlIHRvIG5vZGUuanMgc3BlY2lhbCB0cmVhdG1lbnQgb2YgZXJyb3IgZXZlbnRzLlxuICAvLyBAc2VlIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWwjZXZlbnRzX2Vycm9yX2V2ZW50c1xuICBQYWdlRXJyb3I6ICdwYWdlZXJyb3InLFxuICBSZXF1ZXN0OiAncmVxdWVzdCcsXG4gIFJlc3BvbnNlOiAncmVzcG9uc2UnLFxuICBSZXF1ZXN0RmFpbGVkOiAncmVxdWVzdGZhaWxlZCcsXG4gIFJlcXVlc3RGaW5pc2hlZDogJ3JlcXVlc3RmaW5pc2hlZCcsXG4gIEZyYW1lQXR0YWNoZWQ6ICdmcmFtZWF0dGFjaGVkJyxcbiAgRnJhbWVEZXRhY2hlZDogJ2ZyYW1lZGV0YWNoZWQnLFxuICBGcmFtZU5hdmlnYXRlZDogJ2ZyYW1lbmF2aWdhdGVkJyxcbiAgTG9hZDogJ2xvYWQnLFxuICBNZXRyaWNzOiAnbWV0cmljcycsXG4gIFdvcmtlckNyZWF0ZWQ6ICd3b3JrZXJjcmVhdGVkJyxcbiAgV29ya2VyRGVzdHJveWVkOiAnd29ya2VyZGVzdHJveWVkJyxcbn07XG5cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOZXR3b3JrLkNvb2tpZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRvbWFpblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhdGhcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBleHBpcmVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2l6ZVxuICogQHByb3BlcnR5IHtib29sZWFufSBodHRwT25seVxuICogQHByb3BlcnR5IHtib29sZWFufSBzZWN1cmVcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc2Vzc2lvblxuICogQHByb3BlcnR5IHsoXCJTdHJpY3RcInxcIkxheFwiKT19IHNhbWVTaXRlXG4gKi9cblxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE5ldHdvcmsuQ29va2llUGFyYW1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmFsdWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdXJsXG4gKiBAcHJvcGVydHkge3N0cmluZz19IGRvbWFpblxuICogQHByb3BlcnR5IHtzdHJpbmc9fSBwYXRoXG4gKiBAcHJvcGVydHkge251bWJlcj19IGV4cGlyZXNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbj19IGh0dHBPbmx5XG4gKiBAcHJvcGVydHkge2Jvb2xlYW49fSBzZWN1cmVcbiAqIEBwcm9wZXJ0eSB7KFwiU3RyaWN0XCJ8XCJMYXhcIik9fSBzYW1lU2l0ZVxuICovXG5cbmNsYXNzIENvbnNvbGVNZXNzYWdlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqIEBwYXJhbSB7IUFycmF5PCFQdXBwZXRlZXIuSlNIYW5kbGU+fSBhcmdzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0eXBlLCB0ZXh0LCBhcmdzID0gW10pIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLl90ZXh0ID0gdGV4dDtcbiAgICB0aGlzLl9hcmdzID0gYXJncztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IUFycmF5PCFQdXBwZXRlZXIuSlNIYW5kbGU+fVxuICAgKi9cbiAgYXJncygpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1BhZ2V9O1xuaGVscGVyLnRyYWNlUHVibGljQVBJKFBhZ2UpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3Qge2hlbHBlcn0gPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNsYXNzIFBpcGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHshTm9kZUpTLldyaXRhYmxlU3RyZWFtfSBwaXBlV3JpdGVcbiAgICogQHBhcmFtIHshTm9kZUpTLlJlYWRhYmxlU3RyZWFtfSBwaXBlUmVhZFxuICAgKi9cbiAgY29uc3RydWN0b3IocGlwZVdyaXRlLCBwaXBlUmVhZCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGlwZVdyaXRlID0gcGlwZVdyaXRlO1xuICAgIHRoaXMuX3BlbmRpbmdNZXNzYWdlID0gJyc7XG4gICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSBbXG4gICAgICBoZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcihwaXBlUmVhZCwgJ2RhdGEnLCBidWZmZXIgPT4gdGhpcy5fZGlzcGF0Y2goYnVmZmVyKSlcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICBzZW5kKG1lc3NhZ2UpIHtcbiAgICB0aGlzLl9waXBlV3JpdGUud3JpdGUobWVzc2FnZSk7XG4gICAgdGhpcy5fcGlwZVdyaXRlLndyaXRlKCdcXDAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFCdWZmZXJ9IGJ1ZmZlclxuICAgKi9cbiAgX2Rpc3BhdGNoKGJ1ZmZlcikge1xuICAgIGxldCBlbmQgPSBidWZmZXIuaW5kZXhPZignXFwwJyk7XG4gICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdNZXNzYWdlICs9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fcGVuZGluZ01lc3NhZ2UgKyBidWZmZXIudG9TdHJpbmcodW5kZWZpbmVkLCAwLCBlbmQpO1xuICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIG1lc3NhZ2UpO1xuXG4gICAgbGV0IHN0YXJ0ID0gZW5kICsgMTtcbiAgICBlbmQgPSBidWZmZXIuaW5kZXhPZignXFwwJywgc3RhcnQpO1xuICAgIHdoaWxlIChlbmQgIT09IC0xKSB7XG4gICAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBidWZmZXIudG9TdHJpbmcodW5kZWZpbmVkLCBzdGFydCwgZW5kKSk7XG4gICAgICBzdGFydCA9IGVuZCArIDE7XG4gICAgICBlbmQgPSBidWZmZXIuaW5kZXhPZignXFwwJywgc3RhcnQpO1xuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nTWVzc2FnZSA9IGJ1ZmZlci50b1N0cmluZyh1bmRlZmluZWQsIHN0YXJ0KTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX3BpcGVXcml0ZSA9IG51bGw7XG4gICAgaGVscGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMuX2V2ZW50TGlzdGVuZXJzKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpcGU7XG4iLCJjb25zdCB7UGFnZX0gPSByZXF1aXJlKCcuL1BhZ2UnKTtcbmNvbnN0IHtoZWxwZXJ9ID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcblxuY2xhc3MgVGFyZ2V0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlRhcmdldC5UYXJnZXRJbmZvfSB0YXJnZXRJbmZvXG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5Ccm93c2VyQ29udGV4dH0gYnJvd3NlckNvbnRleHRcbiAgICogQHBhcmFtIHshZnVuY3Rpb24oKTohUHJvbWlzZTwhUHVwcGV0ZWVyLkNEUFNlc3Npb24+fSBzZXNzaW9uRmFjdG9yeVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZUhUVFBTRXJyb3JzXG4gICAqIEBwYXJhbSB7P1B1cHBldGVlci5WaWV3cG9ydH0gZGVmYXVsdFZpZXdwb3J0XG4gICAqIEBwYXJhbSB7IVB1cHBldGVlci5UYXNrUXVldWV9IHNjcmVlbnNob3RUYXNrUXVldWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRhcmdldEluZm8sIGJyb3dzZXJDb250ZXh0LCBzZXNzaW9uRmFjdG9yeSwgaWdub3JlSFRUUFNFcnJvcnMsIGRlZmF1bHRWaWV3cG9ydCwgc2NyZWVuc2hvdFRhc2tRdWV1ZSkge1xuICAgIHRoaXMuX3RhcmdldEluZm8gPSB0YXJnZXRJbmZvO1xuICAgIHRoaXMuX2Jyb3dzZXJDb250ZXh0ID0gYnJvd3NlckNvbnRleHQ7XG4gICAgdGhpcy5fdGFyZ2V0SWQgPSB0YXJnZXRJbmZvLnRhcmdldElkO1xuICAgIHRoaXMuX3Nlc3Npb25GYWN0b3J5ID0gc2Vzc2lvbkZhY3Rvcnk7XG4gICAgdGhpcy5faWdub3JlSFRUUFNFcnJvcnMgPSBpZ25vcmVIVFRQU0Vycm9ycztcbiAgICB0aGlzLl9kZWZhdWx0Vmlld3BvcnQgPSBkZWZhdWx0Vmlld3BvcnQ7XG4gICAgdGhpcy5fc2NyZWVuc2hvdFRhc2tRdWV1ZSA9IHNjcmVlbnNob3RUYXNrUXVldWU7XG4gICAgLyoqIEB0eXBlIHs/UHJvbWlzZTwhUHVwcGV0ZWVyLlBhZ2U+fSAqL1xuICAgIHRoaXMuX3BhZ2VQcm9taXNlID0gbnVsbDtcbiAgICB0aGlzLl9pbml0aWFsaXplZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHRoaXMuX2luaXRpYWxpemVkQ2FsbGJhY2sgPSBmdWxmaWxsKTtcbiAgICB0aGlzLl9pc0Nsb3NlZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHRoaXMuX2Nsb3NlZENhbGxiYWNrID0gZnVsZmlsbCk7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRoaXMuX3RhcmdldEluZm8udHlwZSAhPT0gJ3BhZ2UnIHx8IHRoaXMuX3RhcmdldEluZm8udXJsICE9PSAnJztcbiAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZClcbiAgICAgIHRoaXMuX2luaXRpYWxpemVkQ2FsbGJhY2sodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8IVB1cHBldGVlci5DRFBTZXNzaW9uPn1cbiAgICovXG4gIGNyZWF0ZUNEUFNlc3Npb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nlc3Npb25GYWN0b3J5KCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7IVByb21pc2U8P1BhZ2U+fVxuICAgKi9cbiAgYXN5bmMgcGFnZSgpIHtcbiAgICBpZiAoKHRoaXMuX3RhcmdldEluZm8udHlwZSA9PT0gJ3BhZ2UnIHx8IHRoaXMuX3RhcmdldEluZm8udHlwZSA9PT0gJ2JhY2tncm91bmRfcGFnZScpICYmICF0aGlzLl9wYWdlUHJvbWlzZSkge1xuICAgICAgdGhpcy5fcGFnZVByb21pc2UgPSB0aGlzLl9zZXNzaW9uRmFjdG9yeSgpXG4gICAgICAgICAgLnRoZW4oY2xpZW50ID0+IFBhZ2UuY3JlYXRlKGNsaWVudCwgdGhpcywgdGhpcy5faWdub3JlSFRUUFNFcnJvcnMsIHRoaXMuX2RlZmF1bHRWaWV3cG9ydCwgdGhpcy5fc2NyZWVuc2hvdFRhc2tRdWV1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGFnZVByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdXJsKCkge1xuICAgIHJldHVybiB0aGlzLl90YXJnZXRJbmZvLnVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtcInBhZ2VcInxcImJhY2tncm91bmRfcGFnZVwifFwic2VydmljZV93b3JrZXJcInxcIm90aGVyXCJ8XCJicm93c2VyXCJ9XG4gICAqL1xuICB0eXBlKCkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLl90YXJnZXRJbmZvLnR5cGU7XG4gICAgaWYgKHR5cGUgPT09ICdwYWdlJyB8fCB0eXBlID09PSAnYmFja2dyb3VuZF9wYWdlJyB8fCB0eXBlID09PSAnc2VydmljZV93b3JrZXInIHx8IHR5cGUgPT09ICdicm93c2VyJylcbiAgICAgIHJldHVybiB0eXBlO1xuICAgIHJldHVybiAnb3RoZXInO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQdXBwZXRlZXIuQnJvd3Nlcn1cbiAgICovXG4gIGJyb3dzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jyb3dzZXJDb250ZXh0LmJyb3dzZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHshUHVwcGV0ZWVyLkJyb3dzZXJDb250ZXh0fVxuICAgKi9cbiAgYnJvd3NlckNvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jyb3dzZXJDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1B1cHBldGVlci5UYXJnZXR9XG4gICAqL1xuICBvcGVuZXIoKSB7XG4gICAgY29uc3QgeyBvcGVuZXJJZCB9ID0gdGhpcy5fdGFyZ2V0SW5mbztcbiAgICBpZiAoIW9wZW5lcklkKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuYnJvd3NlcigpLl90YXJnZXRzLmdldChvcGVuZXJJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuVGFyZ2V0LlRhcmdldEluZm99IHRhcmdldEluZm9cbiAgICovXG4gIF90YXJnZXRJbmZvQ2hhbmdlZCh0YXJnZXRJbmZvKSB7XG4gICAgdGhpcy5fdGFyZ2V0SW5mbyA9IHRhcmdldEluZm87XG5cbiAgICBpZiAoIXRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgKHRoaXMuX3RhcmdldEluZm8udHlwZSAhPT0gJ3BhZ2UnIHx8IHRoaXMuX3RhcmdldEluZm8udXJsICE9PSAnJykpIHtcbiAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZWRDYWxsYmFjayh0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxuaGVscGVyLnRyYWNlUHVibGljQVBJKFRhcmdldCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1RhcmdldH07XG4iLCJjbGFzcyBUYXNrUXVldWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gdGFza1xuICAgKiBAcmV0dXJuIHshUHJvbWlzZX1cbiAgICovXG4gIHBvc3RUYXNrKHRhc2spIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jaGFpbi50aGVuKHRhc2spO1xuICAgIHRoaXMuX2NoYWluID0gcmVzdWx0LmNhdGNoKCgpID0+IHt9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1Rhc2tRdWV1ZX07IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3Qge2hlbHBlciwgYXNzZXJ0fSA9IHJlcXVpcmUoJy4vaGVscGVyJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmNvbnN0IG9wZW5Bc3luYyA9IGhlbHBlci5wcm9taXNpZnkoZnMub3Blbik7XG5jb25zdCB3cml0ZUFzeW5jID0gaGVscGVyLnByb21pc2lmeShmcy53cml0ZSk7XG5jb25zdCBjbG9zZUFzeW5jID0gaGVscGVyLnByb21pc2lmeShmcy5jbG9zZSk7XG5cbmNsYXNzIFRyYWNpbmcge1xuICAvKipcbiAgICogQHBhcmFtIHshUHVwcGV0ZWVyLkNEUFNlc3Npb259IGNsaWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX3JlY29yZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3BhdGggPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHN0YXJ0KG9wdGlvbnMpIHtcbiAgICBhc3NlcnQoIXRoaXMuX3JlY29yZGluZywgJ0Nhbm5vdCBzdGFydCByZWNvcmRpbmcgdHJhY2Ugd2hpbGUgYWxyZWFkeSByZWNvcmRpbmcgdHJhY2UuJyk7XG5cbiAgICBjb25zdCBkZWZhdWx0Q2F0ZWdvcmllcyA9IFtcbiAgICAgICctKicsICdkZXZ0b29scy50aW1lbGluZScsICd2OC5leGVjdXRlJywgJ2Rpc2FibGVkLWJ5LWRlZmF1bHQtZGV2dG9vbHMudGltZWxpbmUnLFxuICAgICAgJ2Rpc2FibGVkLWJ5LWRlZmF1bHQtZGV2dG9vbHMudGltZWxpbmUuZnJhbWUnLCAndG9wbGV2ZWwnLFxuICAgICAgJ2JsaW5rLmNvbnNvbGUnLCAnYmxpbmsudXNlcl90aW1pbmcnLCAnbGF0ZW5jeUluZm8nLCAnZGlzYWJsZWQtYnktZGVmYXVsdC1kZXZ0b29scy50aW1lbGluZS5zdGFjaycsXG4gICAgICAnZGlzYWJsZWQtYnktZGVmYXVsdC12OC5jcHVfcHJvZmlsZXInLCAnZGlzYWJsZWQtYnktZGVmYXVsdC12OC5jcHVfcHJvZmlsZXIuaGlyZXMnXG4gICAgXTtcbiAgICBjb25zdCBjYXRlZ29yaWVzQXJyYXkgPSBvcHRpb25zLmNhdGVnb3JpZXMgfHwgZGVmYXVsdENhdGVnb3JpZXM7XG5cbiAgICBpZiAob3B0aW9ucy5zY3JlZW5zaG90cylcbiAgICAgIGNhdGVnb3JpZXNBcnJheS5wdXNoKCdkaXNhYmxlZC1ieS1kZWZhdWx0LWRldnRvb2xzLnNjcmVlbnNob3QnKTtcblxuICAgIHRoaXMuX3BhdGggPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5fcmVjb3JkaW5nID0gdHJ1ZTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnVHJhY2luZy5zdGFydCcsIHtcbiAgICAgIHRyYW5zZmVyTW9kZTogJ1JldHVybkFzU3RyZWFtJyxcbiAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNBcnJheS5qb2luKCcsJylcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHN0b3AoKSB7XG4gICAgbGV0IGZ1bGZpbGw7XG4gICAgY29uc3QgY29udGVudFByb21pc2UgPSBuZXcgUHJvbWlzZSh4ID0+IGZ1bGZpbGwgPSB4KTtcbiAgICB0aGlzLl9jbGllbnQub25jZSgnVHJhY2luZy50cmFjaW5nQ29tcGxldGUnLCBldmVudCA9PiB7XG4gICAgICB0aGlzLl9yZWFkU3RyZWFtKGV2ZW50LnN0cmVhbSwgdGhpcy5fcGF0aCkudGhlbihmdWxmaWxsKTtcbiAgICB9KTtcbiAgICBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnVHJhY2luZy5lbmQnKTtcbiAgICB0aGlzLl9yZWNvcmRpbmcgPSBmYWxzZTtcbiAgICByZXR1cm4gY29udGVudFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhhbmRsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKi9cbiAgYXN5bmMgX3JlYWRTdHJlYW0oaGFuZGxlLCBwYXRoKSB7XG4gICAgbGV0IGVvZiA9IGZhbHNlO1xuICAgIGxldCBmaWxlO1xuICAgIGlmIChwYXRoKVxuICAgICAgZmlsZSA9IGF3YWl0IG9wZW5Bc3luYyhwYXRoLCAndycpO1xuICAgIGNvbnN0IGJ1ZnMgPSBbXTtcbiAgICB3aGlsZSAoIWVvZikge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9jbGllbnQuc2VuZCgnSU8ucmVhZCcsIHtoYW5kbGV9KTtcbiAgICAgIGVvZiA9IHJlc3BvbnNlLmVvZjtcbiAgICAgIGJ1ZnMucHVzaChCdWZmZXIuZnJvbShyZXNwb25zZS5kYXRhKSk7XG4gICAgICBpZiAocGF0aClcbiAgICAgICAgYXdhaXQgd3JpdGVBc3luYyhmaWxlLCByZXNwb25zZS5kYXRhKTtcbiAgICB9XG4gICAgaWYgKHBhdGgpXG4gICAgICBhd2FpdCBjbG9zZUFzeW5jKGZpbGUpO1xuICAgIGF3YWl0IHRoaXMuX2NsaWVudC5zZW5kKCdJTy5jbG9zZScsIHtoYW5kbGV9KTtcbiAgICBsZXQgcmVzdWx0QnVmZmVyID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0QnVmZmVyID0gQnVmZmVyLmNvbmNhdChidWZzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmV0dXJuIHJlc3VsdEJ1ZmZlcjtcbiAgICB9XG4gIH1cbn1cbmhlbHBlci50cmFjZVB1YmxpY0FQSShUcmFjaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjaW5nO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gS2V5RGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtudW1iZXI9fSBrZXlDb2RlXG4gKiBAcHJvcGVydHkge251bWJlcj19IHNoaWZ0S2V5Q29kZVxuICogQHByb3BlcnR5IHtzdHJpbmc9fSBrZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gc2hpZnRLZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gY29kZVxuICogQHByb3BlcnR5IHtzdHJpbmc9fSB0ZXh0XG4gKiBAcHJvcGVydHkge3N0cmluZz19IHNoaWZ0VGV4dFxuICogQHByb3BlcnR5IHtudW1iZXI9fSBsb2NhdGlvblxuICovXG5cbi8qKlxuICogQHR5cGUge09iamVjdDxzdHJpbmcsIEtleURlZmluaXRpb24+fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJzAnOiB7J2tleUNvZGUnOiA0OCwgJ2tleSc6ICcwJywgJ2NvZGUnOiAnRGlnaXQwJ30sXG4gICcxJzogeydrZXlDb2RlJzogNDksICdrZXknOiAnMScsICdjb2RlJzogJ0RpZ2l0MSd9LFxuICAnMic6IHsna2V5Q29kZSc6IDUwLCAna2V5JzogJzInLCAnY29kZSc6ICdEaWdpdDInfSxcbiAgJzMnOiB7J2tleUNvZGUnOiA1MSwgJ2tleSc6ICczJywgJ2NvZGUnOiAnRGlnaXQzJ30sXG4gICc0JzogeydrZXlDb2RlJzogNTIsICdrZXknOiAnNCcsICdjb2RlJzogJ0RpZ2l0NCd9LFxuICAnNSc6IHsna2V5Q29kZSc6IDUzLCAna2V5JzogJzUnLCAnY29kZSc6ICdEaWdpdDUnfSxcbiAgJzYnOiB7J2tleUNvZGUnOiA1NCwgJ2tleSc6ICc2JywgJ2NvZGUnOiAnRGlnaXQ2J30sXG4gICc3JzogeydrZXlDb2RlJzogNTUsICdrZXknOiAnNycsICdjb2RlJzogJ0RpZ2l0Nyd9LFxuICAnOCc6IHsna2V5Q29kZSc6IDU2LCAna2V5JzogJzgnLCAnY29kZSc6ICdEaWdpdDgnfSxcbiAgJzknOiB7J2tleUNvZGUnOiA1NywgJ2tleSc6ICc5JywgJ2NvZGUnOiAnRGlnaXQ5J30sXG4gICdQb3dlcic6IHsna2V5JzogJ1Bvd2VyJywgJ2NvZGUnOiAnUG93ZXInfSxcbiAgJ0VqZWN0JzogeydrZXknOiAnRWplY3QnLCAnY29kZSc6ICdFamVjdCd9LFxuICAnQWJvcnQnOiB7J2tleUNvZGUnOiAzLCAnY29kZSc6ICdBYm9ydCcsICdrZXknOiAnQ2FuY2VsJ30sXG4gICdIZWxwJzogeydrZXlDb2RlJzogNiwgJ2NvZGUnOiAnSGVscCcsICdrZXknOiAnSGVscCd9LFxuICAnQmFja3NwYWNlJzogeydrZXlDb2RlJzogOCwgJ2NvZGUnOiAnQmFja3NwYWNlJywgJ2tleSc6ICdCYWNrc3BhY2UnfSxcbiAgJ1RhYic6IHsna2V5Q29kZSc6IDksICdjb2RlJzogJ1RhYicsICdrZXknOiAnVGFiJ30sXG4gICdOdW1wYWQ1JzogeydrZXlDb2RlJzogMTIsICdzaGlmdEtleUNvZGUnOiAxMDEsICdrZXknOiAnQ2xlYXInLCAnY29kZSc6ICdOdW1wYWQ1JywgJ3NoaWZ0S2V5JzogJzUnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ051bXBhZEVudGVyJzogeydrZXlDb2RlJzogMTMsICdjb2RlJzogJ051bXBhZEVudGVyJywgJ2tleSc6ICdFbnRlcicsICd0ZXh0JzogJ1xccicsICdsb2NhdGlvbic6IDN9LFxuICAnRW50ZXInOiB7J2tleUNvZGUnOiAxMywgJ2NvZGUnOiAnRW50ZXInLCAna2V5JzogJ0VudGVyJywgJ3RleHQnOiAnXFxyJ30sXG4gICdcXHInOiB7J2tleUNvZGUnOiAxMywgJ2NvZGUnOiAnRW50ZXInLCAna2V5JzogJ0VudGVyJywgJ3RleHQnOiAnXFxyJ30sXG4gICdcXG4nOiB7J2tleUNvZGUnOiAxMywgJ2NvZGUnOiAnRW50ZXInLCAna2V5JzogJ0VudGVyJywgJ3RleHQnOiAnXFxyJ30sXG4gICdTaGlmdExlZnQnOiB7J2tleUNvZGUnOiAxNiwgJ2NvZGUnOiAnU2hpZnRMZWZ0JywgJ2tleSc6ICdTaGlmdCcsICdsb2NhdGlvbic6IDF9LFxuICAnU2hpZnRSaWdodCc6IHsna2V5Q29kZSc6IDE2LCAnY29kZSc6ICdTaGlmdFJpZ2h0JywgJ2tleSc6ICdTaGlmdCcsICdsb2NhdGlvbic6IDJ9LFxuICAnQ29udHJvbExlZnQnOiB7J2tleUNvZGUnOiAxNywgJ2NvZGUnOiAnQ29udHJvbExlZnQnLCAna2V5JzogJ0NvbnRyb2wnLCAnbG9jYXRpb24nOiAxfSxcbiAgJ0NvbnRyb2xSaWdodCc6IHsna2V5Q29kZSc6IDE3LCAnY29kZSc6ICdDb250cm9sUmlnaHQnLCAna2V5JzogJ0NvbnRyb2wnLCAnbG9jYXRpb24nOiAyfSxcbiAgJ0FsdExlZnQnOiB7J2tleUNvZGUnOiAxOCwgJ2NvZGUnOiAnQWx0TGVmdCcsICdrZXknOiAnQWx0JywgJ2xvY2F0aW9uJzogMX0sXG4gICdBbHRSaWdodCc6IHsna2V5Q29kZSc6IDE4LCAnY29kZSc6ICdBbHRSaWdodCcsICdrZXknOiAnQWx0JywgJ2xvY2F0aW9uJzogMn0sXG4gICdQYXVzZSc6IHsna2V5Q29kZSc6IDE5LCAnY29kZSc6ICdQYXVzZScsICdrZXknOiAnUGF1c2UnfSxcbiAgJ0NhcHNMb2NrJzogeydrZXlDb2RlJzogMjAsICdjb2RlJzogJ0NhcHNMb2NrJywgJ2tleSc6ICdDYXBzTG9jayd9LFxuICAnRXNjYXBlJzogeydrZXlDb2RlJzogMjcsICdjb2RlJzogJ0VzY2FwZScsICdrZXknOiAnRXNjYXBlJ30sXG4gICdDb252ZXJ0JzogeydrZXlDb2RlJzogMjgsICdjb2RlJzogJ0NvbnZlcnQnLCAna2V5JzogJ0NvbnZlcnQnfSxcbiAgJ05vbkNvbnZlcnQnOiB7J2tleUNvZGUnOiAyOSwgJ2NvZGUnOiAnTm9uQ29udmVydCcsICdrZXknOiAnTm9uQ29udmVydCd9LFxuICAnU3BhY2UnOiB7J2tleUNvZGUnOiAzMiwgJ2NvZGUnOiAnU3BhY2UnLCAna2V5JzogJyAnfSxcbiAgJ051bXBhZDknOiB7J2tleUNvZGUnOiAzMywgJ3NoaWZ0S2V5Q29kZSc6IDEwNSwgJ2tleSc6ICdQYWdlVXAnLCAnY29kZSc6ICdOdW1wYWQ5JywgJ3NoaWZ0S2V5JzogJzknLCAnbG9jYXRpb24nOiAzfSxcbiAgJ1BhZ2VVcCc6IHsna2V5Q29kZSc6IDMzLCAnY29kZSc6ICdQYWdlVXAnLCAna2V5JzogJ1BhZ2VVcCd9LFxuICAnTnVtcGFkMyc6IHsna2V5Q29kZSc6IDM0LCAnc2hpZnRLZXlDb2RlJzogOTksICdrZXknOiAnUGFnZURvd24nLCAnY29kZSc6ICdOdW1wYWQzJywgJ3NoaWZ0S2V5JzogJzMnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ1BhZ2VEb3duJzogeydrZXlDb2RlJzogMzQsICdjb2RlJzogJ1BhZ2VEb3duJywgJ2tleSc6ICdQYWdlRG93bid9LFxuICAnRW5kJzogeydrZXlDb2RlJzogMzUsICdjb2RlJzogJ0VuZCcsICdrZXknOiAnRW5kJ30sXG4gICdOdW1wYWQxJzogeydrZXlDb2RlJzogMzUsICdzaGlmdEtleUNvZGUnOiA5NywgJ2tleSc6ICdFbmQnLCAnY29kZSc6ICdOdW1wYWQxJywgJ3NoaWZ0S2V5JzogJzEnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ0hvbWUnOiB7J2tleUNvZGUnOiAzNiwgJ2NvZGUnOiAnSG9tZScsICdrZXknOiAnSG9tZSd9LFxuICAnTnVtcGFkNyc6IHsna2V5Q29kZSc6IDM2LCAnc2hpZnRLZXlDb2RlJzogMTAzLCAna2V5JzogJ0hvbWUnLCAnY29kZSc6ICdOdW1wYWQ3JywgJ3NoaWZ0S2V5JzogJzcnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ0Fycm93TGVmdCc6IHsna2V5Q29kZSc6IDM3LCAnY29kZSc6ICdBcnJvd0xlZnQnLCAna2V5JzogJ0Fycm93TGVmdCd9LFxuICAnTnVtcGFkNCc6IHsna2V5Q29kZSc6IDM3LCAnc2hpZnRLZXlDb2RlJzogMTAwLCAna2V5JzogJ0Fycm93TGVmdCcsICdjb2RlJzogJ051bXBhZDQnLCAnc2hpZnRLZXknOiAnNCcsICdsb2NhdGlvbic6IDN9LFxuICAnTnVtcGFkOCc6IHsna2V5Q29kZSc6IDM4LCAnc2hpZnRLZXlDb2RlJzogMTA0LCAna2V5JzogJ0Fycm93VXAnLCAnY29kZSc6ICdOdW1wYWQ4JywgJ3NoaWZ0S2V5JzogJzgnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ0Fycm93VXAnOiB7J2tleUNvZGUnOiAzOCwgJ2NvZGUnOiAnQXJyb3dVcCcsICdrZXknOiAnQXJyb3dVcCd9LFxuICAnQXJyb3dSaWdodCc6IHsna2V5Q29kZSc6IDM5LCAnY29kZSc6ICdBcnJvd1JpZ2h0JywgJ2tleSc6ICdBcnJvd1JpZ2h0J30sXG4gICdOdW1wYWQ2JzogeydrZXlDb2RlJzogMzksICdzaGlmdEtleUNvZGUnOiAxMDIsICdrZXknOiAnQXJyb3dSaWdodCcsICdjb2RlJzogJ051bXBhZDYnLCAnc2hpZnRLZXknOiAnNicsICdsb2NhdGlvbic6IDN9LFxuICAnTnVtcGFkMic6IHsna2V5Q29kZSc6IDQwLCAnc2hpZnRLZXlDb2RlJzogOTgsICdrZXknOiAnQXJyb3dEb3duJywgJ2NvZGUnOiAnTnVtcGFkMicsICdzaGlmdEtleSc6ICcyJywgJ2xvY2F0aW9uJzogM30sXG4gICdBcnJvd0Rvd24nOiB7J2tleUNvZGUnOiA0MCwgJ2NvZGUnOiAnQXJyb3dEb3duJywgJ2tleSc6ICdBcnJvd0Rvd24nfSxcbiAgJ1NlbGVjdCc6IHsna2V5Q29kZSc6IDQxLCAnY29kZSc6ICdTZWxlY3QnLCAna2V5JzogJ1NlbGVjdCd9LFxuICAnT3Blbic6IHsna2V5Q29kZSc6IDQzLCAnY29kZSc6ICdPcGVuJywgJ2tleSc6ICdFeGVjdXRlJ30sXG4gICdQcmludFNjcmVlbic6IHsna2V5Q29kZSc6IDQ0LCAnY29kZSc6ICdQcmludFNjcmVlbicsICdrZXknOiAnUHJpbnRTY3JlZW4nfSxcbiAgJ0luc2VydCc6IHsna2V5Q29kZSc6IDQ1LCAnY29kZSc6ICdJbnNlcnQnLCAna2V5JzogJ0luc2VydCd9LFxuICAnTnVtcGFkMCc6IHsna2V5Q29kZSc6IDQ1LCAnc2hpZnRLZXlDb2RlJzogOTYsICdrZXknOiAnSW5zZXJ0JywgJ2NvZGUnOiAnTnVtcGFkMCcsICdzaGlmdEtleSc6ICcwJywgJ2xvY2F0aW9uJzogM30sXG4gICdEZWxldGUnOiB7J2tleUNvZGUnOiA0NiwgJ2NvZGUnOiAnRGVsZXRlJywgJ2tleSc6ICdEZWxldGUnfSxcbiAgJ051bXBhZERlY2ltYWwnOiB7J2tleUNvZGUnOiA0NiwgJ3NoaWZ0S2V5Q29kZSc6IDExMCwgJ2NvZGUnOiAnTnVtcGFkRGVjaW1hbCcsICdrZXknOiAnXFx1MDAwMCcsICdzaGlmdEtleSc6ICcuJywgJ2xvY2F0aW9uJzogM30sXG4gICdEaWdpdDAnOiB7J2tleUNvZGUnOiA0OCwgJ2NvZGUnOiAnRGlnaXQwJywgJ3NoaWZ0S2V5JzogJyknLCAna2V5JzogJzAnfSxcbiAgJ0RpZ2l0MSc6IHsna2V5Q29kZSc6IDQ5LCAnY29kZSc6ICdEaWdpdDEnLCAnc2hpZnRLZXknOiAnIScsICdrZXknOiAnMSd9LFxuICAnRGlnaXQyJzogeydrZXlDb2RlJzogNTAsICdjb2RlJzogJ0RpZ2l0MicsICdzaGlmdEtleSc6ICdAJywgJ2tleSc6ICcyJ30sXG4gICdEaWdpdDMnOiB7J2tleUNvZGUnOiA1MSwgJ2NvZGUnOiAnRGlnaXQzJywgJ3NoaWZ0S2V5JzogJyMnLCAna2V5JzogJzMnfSxcbiAgJ0RpZ2l0NCc6IHsna2V5Q29kZSc6IDUyLCAnY29kZSc6ICdEaWdpdDQnLCAnc2hpZnRLZXknOiAnJCcsICdrZXknOiAnNCd9LFxuICAnRGlnaXQ1JzogeydrZXlDb2RlJzogNTMsICdjb2RlJzogJ0RpZ2l0NScsICdzaGlmdEtleSc6ICclJywgJ2tleSc6ICc1J30sXG4gICdEaWdpdDYnOiB7J2tleUNvZGUnOiA1NCwgJ2NvZGUnOiAnRGlnaXQ2JywgJ3NoaWZ0S2V5JzogJ14nLCAna2V5JzogJzYnfSxcbiAgJ0RpZ2l0Nyc6IHsna2V5Q29kZSc6IDU1LCAnY29kZSc6ICdEaWdpdDcnLCAnc2hpZnRLZXknOiAnJicsICdrZXknOiAnNyd9LFxuICAnRGlnaXQ4JzogeydrZXlDb2RlJzogNTYsICdjb2RlJzogJ0RpZ2l0OCcsICdzaGlmdEtleSc6ICcqJywgJ2tleSc6ICc4J30sXG4gICdEaWdpdDknOiB7J2tleUNvZGUnOiA1NywgJ2NvZGUnOiAnRGlnaXQ5JywgJ3NoaWZ0S2V5JzogJ1xcKCcsICdrZXknOiAnOSd9LFxuICAnS2V5QSc6IHsna2V5Q29kZSc6IDY1LCAnY29kZSc6ICdLZXlBJywgJ3NoaWZ0S2V5JzogJ0EnLCAna2V5JzogJ2EnfSxcbiAgJ0tleUInOiB7J2tleUNvZGUnOiA2NiwgJ2NvZGUnOiAnS2V5QicsICdzaGlmdEtleSc6ICdCJywgJ2tleSc6ICdiJ30sXG4gICdLZXlDJzogeydrZXlDb2RlJzogNjcsICdjb2RlJzogJ0tleUMnLCAnc2hpZnRLZXknOiAnQycsICdrZXknOiAnYyd9LFxuICAnS2V5RCc6IHsna2V5Q29kZSc6IDY4LCAnY29kZSc6ICdLZXlEJywgJ3NoaWZ0S2V5JzogJ0QnLCAna2V5JzogJ2QnfSxcbiAgJ0tleUUnOiB7J2tleUNvZGUnOiA2OSwgJ2NvZGUnOiAnS2V5RScsICdzaGlmdEtleSc6ICdFJywgJ2tleSc6ICdlJ30sXG4gICdLZXlGJzogeydrZXlDb2RlJzogNzAsICdjb2RlJzogJ0tleUYnLCAnc2hpZnRLZXknOiAnRicsICdrZXknOiAnZid9LFxuICAnS2V5Ryc6IHsna2V5Q29kZSc6IDcxLCAnY29kZSc6ICdLZXlHJywgJ3NoaWZ0S2V5JzogJ0cnLCAna2V5JzogJ2cnfSxcbiAgJ0tleUgnOiB7J2tleUNvZGUnOiA3MiwgJ2NvZGUnOiAnS2V5SCcsICdzaGlmdEtleSc6ICdIJywgJ2tleSc6ICdoJ30sXG4gICdLZXlJJzogeydrZXlDb2RlJzogNzMsICdjb2RlJzogJ0tleUknLCAnc2hpZnRLZXknOiAnSScsICdrZXknOiAnaSd9LFxuICAnS2V5Sic6IHsna2V5Q29kZSc6IDc0LCAnY29kZSc6ICdLZXlKJywgJ3NoaWZ0S2V5JzogJ0onLCAna2V5JzogJ2onfSxcbiAgJ0tleUsnOiB7J2tleUNvZGUnOiA3NSwgJ2NvZGUnOiAnS2V5SycsICdzaGlmdEtleSc6ICdLJywgJ2tleSc6ICdrJ30sXG4gICdLZXlMJzogeydrZXlDb2RlJzogNzYsICdjb2RlJzogJ0tleUwnLCAnc2hpZnRLZXknOiAnTCcsICdrZXknOiAnbCd9LFxuICAnS2V5TSc6IHsna2V5Q29kZSc6IDc3LCAnY29kZSc6ICdLZXlNJywgJ3NoaWZ0S2V5JzogJ00nLCAna2V5JzogJ20nfSxcbiAgJ0tleU4nOiB7J2tleUNvZGUnOiA3OCwgJ2NvZGUnOiAnS2V5TicsICdzaGlmdEtleSc6ICdOJywgJ2tleSc6ICduJ30sXG4gICdLZXlPJzogeydrZXlDb2RlJzogNzksICdjb2RlJzogJ0tleU8nLCAnc2hpZnRLZXknOiAnTycsICdrZXknOiAnbyd9LFxuICAnS2V5UCc6IHsna2V5Q29kZSc6IDgwLCAnY29kZSc6ICdLZXlQJywgJ3NoaWZ0S2V5JzogJ1AnLCAna2V5JzogJ3AnfSxcbiAgJ0tleVEnOiB7J2tleUNvZGUnOiA4MSwgJ2NvZGUnOiAnS2V5UScsICdzaGlmdEtleSc6ICdRJywgJ2tleSc6ICdxJ30sXG4gICdLZXlSJzogeydrZXlDb2RlJzogODIsICdjb2RlJzogJ0tleVInLCAnc2hpZnRLZXknOiAnUicsICdrZXknOiAncid9LFxuICAnS2V5Uyc6IHsna2V5Q29kZSc6IDgzLCAnY29kZSc6ICdLZXlTJywgJ3NoaWZ0S2V5JzogJ1MnLCAna2V5JzogJ3MnfSxcbiAgJ0tleVQnOiB7J2tleUNvZGUnOiA4NCwgJ2NvZGUnOiAnS2V5VCcsICdzaGlmdEtleSc6ICdUJywgJ2tleSc6ICd0J30sXG4gICdLZXlVJzogeydrZXlDb2RlJzogODUsICdjb2RlJzogJ0tleVUnLCAnc2hpZnRLZXknOiAnVScsICdrZXknOiAndSd9LFxuICAnS2V5Vic6IHsna2V5Q29kZSc6IDg2LCAnY29kZSc6ICdLZXlWJywgJ3NoaWZ0S2V5JzogJ1YnLCAna2V5JzogJ3YnfSxcbiAgJ0tleVcnOiB7J2tleUNvZGUnOiA4NywgJ2NvZGUnOiAnS2V5VycsICdzaGlmdEtleSc6ICdXJywgJ2tleSc6ICd3J30sXG4gICdLZXlYJzogeydrZXlDb2RlJzogODgsICdjb2RlJzogJ0tleVgnLCAnc2hpZnRLZXknOiAnWCcsICdrZXknOiAneCd9LFxuICAnS2V5WSc6IHsna2V5Q29kZSc6IDg5LCAnY29kZSc6ICdLZXlZJywgJ3NoaWZ0S2V5JzogJ1knLCAna2V5JzogJ3knfSxcbiAgJ0tleVonOiB7J2tleUNvZGUnOiA5MCwgJ2NvZGUnOiAnS2V5WicsICdzaGlmdEtleSc6ICdaJywgJ2tleSc6ICd6J30sXG4gICdNZXRhTGVmdCc6IHsna2V5Q29kZSc6IDkxLCAnY29kZSc6ICdNZXRhTGVmdCcsICdrZXknOiAnTWV0YSd9LFxuICAnTWV0YVJpZ2h0JzogeydrZXlDb2RlJzogOTIsICdjb2RlJzogJ01ldGFSaWdodCcsICdrZXknOiAnTWV0YSd9LFxuICAnQ29udGV4dE1lbnUnOiB7J2tleUNvZGUnOiA5MywgJ2NvZGUnOiAnQ29udGV4dE1lbnUnLCAna2V5JzogJ0NvbnRleHRNZW51J30sXG4gICdOdW1wYWRNdWx0aXBseSc6IHsna2V5Q29kZSc6IDEwNiwgJ2NvZGUnOiAnTnVtcGFkTXVsdGlwbHknLCAna2V5JzogJyonLCAnbG9jYXRpb24nOiAzfSxcbiAgJ051bXBhZEFkZCc6IHsna2V5Q29kZSc6IDEwNywgJ2NvZGUnOiAnTnVtcGFkQWRkJywgJ2tleSc6ICcrJywgJ2xvY2F0aW9uJzogM30sXG4gICdOdW1wYWRTdWJ0cmFjdCc6IHsna2V5Q29kZSc6IDEwOSwgJ2NvZGUnOiAnTnVtcGFkU3VidHJhY3QnLCAna2V5JzogJy0nLCAnbG9jYXRpb24nOiAzfSxcbiAgJ051bXBhZERpdmlkZSc6IHsna2V5Q29kZSc6IDExMSwgJ2NvZGUnOiAnTnVtcGFkRGl2aWRlJywgJ2tleSc6ICcvJywgJ2xvY2F0aW9uJzogM30sXG4gICdGMSc6IHsna2V5Q29kZSc6IDExMiwgJ2NvZGUnOiAnRjEnLCAna2V5JzogJ0YxJ30sXG4gICdGMic6IHsna2V5Q29kZSc6IDExMywgJ2NvZGUnOiAnRjInLCAna2V5JzogJ0YyJ30sXG4gICdGMyc6IHsna2V5Q29kZSc6IDExNCwgJ2NvZGUnOiAnRjMnLCAna2V5JzogJ0YzJ30sXG4gICdGNCc6IHsna2V5Q29kZSc6IDExNSwgJ2NvZGUnOiAnRjQnLCAna2V5JzogJ0Y0J30sXG4gICdGNSc6IHsna2V5Q29kZSc6IDExNiwgJ2NvZGUnOiAnRjUnLCAna2V5JzogJ0Y1J30sXG4gICdGNic6IHsna2V5Q29kZSc6IDExNywgJ2NvZGUnOiAnRjYnLCAna2V5JzogJ0Y2J30sXG4gICdGNyc6IHsna2V5Q29kZSc6IDExOCwgJ2NvZGUnOiAnRjcnLCAna2V5JzogJ0Y3J30sXG4gICdGOCc6IHsna2V5Q29kZSc6IDExOSwgJ2NvZGUnOiAnRjgnLCAna2V5JzogJ0Y4J30sXG4gICdGOSc6IHsna2V5Q29kZSc6IDEyMCwgJ2NvZGUnOiAnRjknLCAna2V5JzogJ0Y5J30sXG4gICdGMTAnOiB7J2tleUNvZGUnOiAxMjEsICdjb2RlJzogJ0YxMCcsICdrZXknOiAnRjEwJ30sXG4gICdGMTEnOiB7J2tleUNvZGUnOiAxMjIsICdjb2RlJzogJ0YxMScsICdrZXknOiAnRjExJ30sXG4gICdGMTInOiB7J2tleUNvZGUnOiAxMjMsICdjb2RlJzogJ0YxMicsICdrZXknOiAnRjEyJ30sXG4gICdGMTMnOiB7J2tleUNvZGUnOiAxMjQsICdjb2RlJzogJ0YxMycsICdrZXknOiAnRjEzJ30sXG4gICdGMTQnOiB7J2tleUNvZGUnOiAxMjUsICdjb2RlJzogJ0YxNCcsICdrZXknOiAnRjE0J30sXG4gICdGMTUnOiB7J2tleUNvZGUnOiAxMjYsICdjb2RlJzogJ0YxNScsICdrZXknOiAnRjE1J30sXG4gICdGMTYnOiB7J2tleUNvZGUnOiAxMjcsICdjb2RlJzogJ0YxNicsICdrZXknOiAnRjE2J30sXG4gICdGMTcnOiB7J2tleUNvZGUnOiAxMjgsICdjb2RlJzogJ0YxNycsICdrZXknOiAnRjE3J30sXG4gICdGMTgnOiB7J2tleUNvZGUnOiAxMjksICdjb2RlJzogJ0YxOCcsICdrZXknOiAnRjE4J30sXG4gICdGMTknOiB7J2tleUNvZGUnOiAxMzAsICdjb2RlJzogJ0YxOScsICdrZXknOiAnRjE5J30sXG4gICdGMjAnOiB7J2tleUNvZGUnOiAxMzEsICdjb2RlJzogJ0YyMCcsICdrZXknOiAnRjIwJ30sXG4gICdGMjEnOiB7J2tleUNvZGUnOiAxMzIsICdjb2RlJzogJ0YyMScsICdrZXknOiAnRjIxJ30sXG4gICdGMjInOiB7J2tleUNvZGUnOiAxMzMsICdjb2RlJzogJ0YyMicsICdrZXknOiAnRjIyJ30sXG4gICdGMjMnOiB7J2tleUNvZGUnOiAxMzQsICdjb2RlJzogJ0YyMycsICdrZXknOiAnRjIzJ30sXG4gICdGMjQnOiB7J2tleUNvZGUnOiAxMzUsICdjb2RlJzogJ0YyNCcsICdrZXknOiAnRjI0J30sXG4gICdOdW1Mb2NrJzogeydrZXlDb2RlJzogMTQ0LCAnY29kZSc6ICdOdW1Mb2NrJywgJ2tleSc6ICdOdW1Mb2NrJ30sXG4gICdTY3JvbGxMb2NrJzogeydrZXlDb2RlJzogMTQ1LCAnY29kZSc6ICdTY3JvbGxMb2NrJywgJ2tleSc6ICdTY3JvbGxMb2NrJ30sXG4gICdBdWRpb1ZvbHVtZU11dGUnOiB7J2tleUNvZGUnOiAxNzMsICdjb2RlJzogJ0F1ZGlvVm9sdW1lTXV0ZScsICdrZXknOiAnQXVkaW9Wb2x1bWVNdXRlJ30sXG4gICdBdWRpb1ZvbHVtZURvd24nOiB7J2tleUNvZGUnOiAxNzQsICdjb2RlJzogJ0F1ZGlvVm9sdW1lRG93bicsICdrZXknOiAnQXVkaW9Wb2x1bWVEb3duJ30sXG4gICdBdWRpb1ZvbHVtZVVwJzogeydrZXlDb2RlJzogMTc1LCAnY29kZSc6ICdBdWRpb1ZvbHVtZVVwJywgJ2tleSc6ICdBdWRpb1ZvbHVtZVVwJ30sXG4gICdNZWRpYVRyYWNrTmV4dCc6IHsna2V5Q29kZSc6IDE3NiwgJ2NvZGUnOiAnTWVkaWFUcmFja05leHQnLCAna2V5JzogJ01lZGlhVHJhY2tOZXh0J30sXG4gICdNZWRpYVRyYWNrUHJldmlvdXMnOiB7J2tleUNvZGUnOiAxNzcsICdjb2RlJzogJ01lZGlhVHJhY2tQcmV2aW91cycsICdrZXknOiAnTWVkaWFUcmFja1ByZXZpb3VzJ30sXG4gICdNZWRpYVN0b3AnOiB7J2tleUNvZGUnOiAxNzgsICdjb2RlJzogJ01lZGlhU3RvcCcsICdrZXknOiAnTWVkaWFTdG9wJ30sXG4gICdNZWRpYVBsYXlQYXVzZSc6IHsna2V5Q29kZSc6IDE3OSwgJ2NvZGUnOiAnTWVkaWFQbGF5UGF1c2UnLCAna2V5JzogJ01lZGlhUGxheVBhdXNlJ30sXG4gICdTZW1pY29sb24nOiB7J2tleUNvZGUnOiAxODYsICdjb2RlJzogJ1NlbWljb2xvbicsICdzaGlmdEtleSc6ICc6JywgJ2tleSc6ICc7J30sXG4gICdFcXVhbCc6IHsna2V5Q29kZSc6IDE4NywgJ2NvZGUnOiAnRXF1YWwnLCAnc2hpZnRLZXknOiAnKycsICdrZXknOiAnPSd9LFxuICAnTnVtcGFkRXF1YWwnOiB7J2tleUNvZGUnOiAxODcsICdjb2RlJzogJ051bXBhZEVxdWFsJywgJ2tleSc6ICc9JywgJ2xvY2F0aW9uJzogM30sXG4gICdDb21tYSc6IHsna2V5Q29kZSc6IDE4OCwgJ2NvZGUnOiAnQ29tbWEnLCAnc2hpZnRLZXknOiAnXFw8JywgJ2tleSc6ICcsJ30sXG4gICdNaW51cyc6IHsna2V5Q29kZSc6IDE4OSwgJ2NvZGUnOiAnTWludXMnLCAnc2hpZnRLZXknOiAnXycsICdrZXknOiAnLSd9LFxuICAnUGVyaW9kJzogeydrZXlDb2RlJzogMTkwLCAnY29kZSc6ICdQZXJpb2QnLCAnc2hpZnRLZXknOiAnPicsICdrZXknOiAnLid9LFxuICAnU2xhc2gnOiB7J2tleUNvZGUnOiAxOTEsICdjb2RlJzogJ1NsYXNoJywgJ3NoaWZ0S2V5JzogJz8nLCAna2V5JzogJy8nfSxcbiAgJ0JhY2txdW90ZSc6IHsna2V5Q29kZSc6IDE5MiwgJ2NvZGUnOiAnQmFja3F1b3RlJywgJ3NoaWZ0S2V5JzogJ34nLCAna2V5JzogJ2AnfSxcbiAgJ0JyYWNrZXRMZWZ0JzogeydrZXlDb2RlJzogMjE5LCAnY29kZSc6ICdCcmFja2V0TGVmdCcsICdzaGlmdEtleSc6ICd7JywgJ2tleSc6ICdbJ30sXG4gICdCYWNrc2xhc2gnOiB7J2tleUNvZGUnOiAyMjAsICdjb2RlJzogJ0JhY2tzbGFzaCcsICdzaGlmdEtleSc6ICd8JywgJ2tleSc6ICdcXFxcJ30sXG4gICdCcmFja2V0UmlnaHQnOiB7J2tleUNvZGUnOiAyMjEsICdjb2RlJzogJ0JyYWNrZXRSaWdodCcsICdzaGlmdEtleSc6ICd9JywgJ2tleSc6ICddJ30sXG4gICdRdW90ZSc6IHsna2V5Q29kZSc6IDIyMiwgJ2NvZGUnOiAnUXVvdGUnLCAnc2hpZnRLZXknOiAnXCInLCAna2V5JzogJ1xcJyd9LFxuICAnQWx0R3JhcGgnOiB7J2tleUNvZGUnOiAyMjUsICdjb2RlJzogJ0FsdEdyYXBoJywgJ2tleSc6ICdBbHRHcmFwaCd9LFxuICAnUHJvcHMnOiB7J2tleUNvZGUnOiAyNDcsICdjb2RlJzogJ1Byb3BzJywgJ2tleSc6ICdDclNlbCd9LFxuICAnQ2FuY2VsJzogeydrZXlDb2RlJzogMywgJ2tleSc6ICdDYW5jZWwnLCAnY29kZSc6ICdBYm9ydCd9LFxuICAnQ2xlYXInOiB7J2tleUNvZGUnOiAxMiwgJ2tleSc6ICdDbGVhcicsICdjb2RlJzogJ051bXBhZDUnLCAnbG9jYXRpb24nOiAzfSxcbiAgJ1NoaWZ0JzogeydrZXlDb2RlJzogMTYsICdrZXknOiAnU2hpZnQnLCAnY29kZSc6ICdTaGlmdExlZnQnfSxcbiAgJ0NvbnRyb2wnOiB7J2tleUNvZGUnOiAxNywgJ2tleSc6ICdDb250cm9sJywgJ2NvZGUnOiAnQ29udHJvbExlZnQnfSxcbiAgJ0FsdCc6IHsna2V5Q29kZSc6IDE4LCAna2V5JzogJ0FsdCcsICdjb2RlJzogJ0FsdExlZnQnfSxcbiAgJ0FjY2VwdCc6IHsna2V5Q29kZSc6IDMwLCAna2V5JzogJ0FjY2VwdCd9LFxuICAnTW9kZUNoYW5nZSc6IHsna2V5Q29kZSc6IDMxLCAna2V5JzogJ01vZGVDaGFuZ2UnfSxcbiAgJyAnOiB7J2tleUNvZGUnOiAzMiwgJ2tleSc6ICcgJywgJ2NvZGUnOiAnU3BhY2UnfSxcbiAgJ1ByaW50JzogeydrZXlDb2RlJzogNDIsICdrZXknOiAnUHJpbnQnfSxcbiAgJ0V4ZWN1dGUnOiB7J2tleUNvZGUnOiA0MywgJ2tleSc6ICdFeGVjdXRlJywgJ2NvZGUnOiAnT3Blbid9LFxuICAnXFx1MDAwMCc6IHsna2V5Q29kZSc6IDQ2LCAna2V5JzogJ1xcdTAwMDAnLCAnY29kZSc6ICdOdW1wYWREZWNpbWFsJywgJ2xvY2F0aW9uJzogM30sXG4gICdhJzogeydrZXlDb2RlJzogNjUsICdrZXknOiAnYScsICdjb2RlJzogJ0tleUEnfSxcbiAgJ2InOiB7J2tleUNvZGUnOiA2NiwgJ2tleSc6ICdiJywgJ2NvZGUnOiAnS2V5Qid9LFxuICAnYyc6IHsna2V5Q29kZSc6IDY3LCAna2V5JzogJ2MnLCAnY29kZSc6ICdLZXlDJ30sXG4gICdkJzogeydrZXlDb2RlJzogNjgsICdrZXknOiAnZCcsICdjb2RlJzogJ0tleUQnfSxcbiAgJ2UnOiB7J2tleUNvZGUnOiA2OSwgJ2tleSc6ICdlJywgJ2NvZGUnOiAnS2V5RSd9LFxuICAnZic6IHsna2V5Q29kZSc6IDcwLCAna2V5JzogJ2YnLCAnY29kZSc6ICdLZXlGJ30sXG4gICdnJzogeydrZXlDb2RlJzogNzEsICdrZXknOiAnZycsICdjb2RlJzogJ0tleUcnfSxcbiAgJ2gnOiB7J2tleUNvZGUnOiA3MiwgJ2tleSc6ICdoJywgJ2NvZGUnOiAnS2V5SCd9LFxuICAnaSc6IHsna2V5Q29kZSc6IDczLCAna2V5JzogJ2knLCAnY29kZSc6ICdLZXlJJ30sXG4gICdqJzogeydrZXlDb2RlJzogNzQsICdrZXknOiAnaicsICdjb2RlJzogJ0tleUonfSxcbiAgJ2snOiB7J2tleUNvZGUnOiA3NSwgJ2tleSc6ICdrJywgJ2NvZGUnOiAnS2V5Syd9LFxuICAnbCc6IHsna2V5Q29kZSc6IDc2LCAna2V5JzogJ2wnLCAnY29kZSc6ICdLZXlMJ30sXG4gICdtJzogeydrZXlDb2RlJzogNzcsICdrZXknOiAnbScsICdjb2RlJzogJ0tleU0nfSxcbiAgJ24nOiB7J2tleUNvZGUnOiA3OCwgJ2tleSc6ICduJywgJ2NvZGUnOiAnS2V5Tid9LFxuICAnbyc6IHsna2V5Q29kZSc6IDc5LCAna2V5JzogJ28nLCAnY29kZSc6ICdLZXlPJ30sXG4gICdwJzogeydrZXlDb2RlJzogODAsICdrZXknOiAncCcsICdjb2RlJzogJ0tleVAnfSxcbiAgJ3EnOiB7J2tleUNvZGUnOiA4MSwgJ2tleSc6ICdxJywgJ2NvZGUnOiAnS2V5USd9LFxuICAncic6IHsna2V5Q29kZSc6IDgyLCAna2V5JzogJ3InLCAnY29kZSc6ICdLZXlSJ30sXG4gICdzJzogeydrZXlDb2RlJzogODMsICdrZXknOiAncycsICdjb2RlJzogJ0tleVMnfSxcbiAgJ3QnOiB7J2tleUNvZGUnOiA4NCwgJ2tleSc6ICd0JywgJ2NvZGUnOiAnS2V5VCd9LFxuICAndSc6IHsna2V5Q29kZSc6IDg1LCAna2V5JzogJ3UnLCAnY29kZSc6ICdLZXlVJ30sXG4gICd2JzogeydrZXlDb2RlJzogODYsICdrZXknOiAndicsICdjb2RlJzogJ0tleVYnfSxcbiAgJ3cnOiB7J2tleUNvZGUnOiA4NywgJ2tleSc6ICd3JywgJ2NvZGUnOiAnS2V5Vyd9LFxuICAneCc6IHsna2V5Q29kZSc6IDg4LCAna2V5JzogJ3gnLCAnY29kZSc6ICdLZXlYJ30sXG4gICd5JzogeydrZXlDb2RlJzogODksICdrZXknOiAneScsICdjb2RlJzogJ0tleVknfSxcbiAgJ3onOiB7J2tleUNvZGUnOiA5MCwgJ2tleSc6ICd6JywgJ2NvZGUnOiAnS2V5Wid9LFxuICAnTWV0YSc6IHsna2V5Q29kZSc6IDkxLCAna2V5JzogJ01ldGEnLCAnY29kZSc6ICdNZXRhTGVmdCd9LFxuICAnKic6IHsna2V5Q29kZSc6IDEwNiwgJ2tleSc6ICcqJywgJ2NvZGUnOiAnTnVtcGFkTXVsdGlwbHknLCAnbG9jYXRpb24nOiAzfSxcbiAgJysnOiB7J2tleUNvZGUnOiAxMDcsICdrZXknOiAnKycsICdjb2RlJzogJ051bXBhZEFkZCcsICdsb2NhdGlvbic6IDN9LFxuICAnLSc6IHsna2V5Q29kZSc6IDEwOSwgJ2tleSc6ICctJywgJ2NvZGUnOiAnTnVtcGFkU3VidHJhY3QnLCAnbG9jYXRpb24nOiAzfSxcbiAgJy8nOiB7J2tleUNvZGUnOiAxMTEsICdrZXknOiAnLycsICdjb2RlJzogJ051bXBhZERpdmlkZScsICdsb2NhdGlvbic6IDN9LFxuICAnOyc6IHsna2V5Q29kZSc6IDE4NiwgJ2tleSc6ICc7JywgJ2NvZGUnOiAnU2VtaWNvbG9uJ30sXG4gICc9JzogeydrZXlDb2RlJzogMTg3LCAna2V5JzogJz0nLCAnY29kZSc6ICdFcXVhbCd9LFxuICAnLCc6IHsna2V5Q29kZSc6IDE4OCwgJ2tleSc6ICcsJywgJ2NvZGUnOiAnQ29tbWEnfSxcbiAgJy4nOiB7J2tleUNvZGUnOiAxOTAsICdrZXknOiAnLicsICdjb2RlJzogJ1BlcmlvZCd9LFxuICAnYCc6IHsna2V5Q29kZSc6IDE5MiwgJ2tleSc6ICdgJywgJ2NvZGUnOiAnQmFja3F1b3RlJ30sXG4gICdbJzogeydrZXlDb2RlJzogMjE5LCAna2V5JzogJ1snLCAnY29kZSc6ICdCcmFja2V0TGVmdCd9LFxuICAnXFxcXCc6IHsna2V5Q29kZSc6IDIyMCwgJ2tleSc6ICdcXFxcJywgJ2NvZGUnOiAnQmFja3NsYXNoJ30sXG4gICddJzogeydrZXlDb2RlJzogMjIxLCAna2V5JzogJ10nLCAnY29kZSc6ICdCcmFja2V0UmlnaHQnfSxcbiAgJ1xcJyc6IHsna2V5Q29kZSc6IDIyMiwgJ2tleSc6ICdcXCcnLCAnY29kZSc6ICdRdW90ZSd9LFxuICAnQXR0bic6IHsna2V5Q29kZSc6IDI0NiwgJ2tleSc6ICdBdHRuJ30sXG4gICdDclNlbCc6IHsna2V5Q29kZSc6IDI0NywgJ2tleSc6ICdDclNlbCcsICdjb2RlJzogJ1Byb3BzJ30sXG4gICdFeFNlbCc6IHsna2V5Q29kZSc6IDI0OCwgJ2tleSc6ICdFeFNlbCd9LFxuICAnRXJhc2VFb2YnOiB7J2tleUNvZGUnOiAyNDksICdrZXknOiAnRXJhc2VFb2YnfSxcbiAgJ1BsYXknOiB7J2tleUNvZGUnOiAyNTAsICdrZXknOiAnUGxheSd9LFxuICAnWm9vbU91dCc6IHsna2V5Q29kZSc6IDI1MSwgJ2tleSc6ICdab29tT3V0J30sXG4gICcpJzogeydrZXlDb2RlJzogNDgsICdrZXknOiAnKScsICdjb2RlJzogJ0RpZ2l0MCd9LFxuICAnISc6IHsna2V5Q29kZSc6IDQ5LCAna2V5JzogJyEnLCAnY29kZSc6ICdEaWdpdDEnfSxcbiAgJ0AnOiB7J2tleUNvZGUnOiA1MCwgJ2tleSc6ICdAJywgJ2NvZGUnOiAnRGlnaXQyJ30sXG4gICcjJzogeydrZXlDb2RlJzogNTEsICdrZXknOiAnIycsICdjb2RlJzogJ0RpZ2l0Myd9LFxuICAnJCc6IHsna2V5Q29kZSc6IDUyLCAna2V5JzogJyQnLCAnY29kZSc6ICdEaWdpdDQnfSxcbiAgJyUnOiB7J2tleUNvZGUnOiA1MywgJ2tleSc6ICclJywgJ2NvZGUnOiAnRGlnaXQ1J30sXG4gICdeJzogeydrZXlDb2RlJzogNTQsICdrZXknOiAnXicsICdjb2RlJzogJ0RpZ2l0Nid9LFxuICAnJic6IHsna2V5Q29kZSc6IDU1LCAna2V5JzogJyYnLCAnY29kZSc6ICdEaWdpdDcnfSxcbiAgJygnOiB7J2tleUNvZGUnOiA1NywgJ2tleSc6ICdcXCgnLCAnY29kZSc6ICdEaWdpdDknfSxcbiAgJ0EnOiB7J2tleUNvZGUnOiA2NSwgJ2tleSc6ICdBJywgJ2NvZGUnOiAnS2V5QSd9LFxuICAnQic6IHsna2V5Q29kZSc6IDY2LCAna2V5JzogJ0InLCAnY29kZSc6ICdLZXlCJ30sXG4gICdDJzogeydrZXlDb2RlJzogNjcsICdrZXknOiAnQycsICdjb2RlJzogJ0tleUMnfSxcbiAgJ0QnOiB7J2tleUNvZGUnOiA2OCwgJ2tleSc6ICdEJywgJ2NvZGUnOiAnS2V5RCd9LFxuICAnRSc6IHsna2V5Q29kZSc6IDY5LCAna2V5JzogJ0UnLCAnY29kZSc6ICdLZXlFJ30sXG4gICdGJzogeydrZXlDb2RlJzogNzAsICdrZXknOiAnRicsICdjb2RlJzogJ0tleUYnfSxcbiAgJ0cnOiB7J2tleUNvZGUnOiA3MSwgJ2tleSc6ICdHJywgJ2NvZGUnOiAnS2V5Ryd9LFxuICAnSCc6IHsna2V5Q29kZSc6IDcyLCAna2V5JzogJ0gnLCAnY29kZSc6ICdLZXlIJ30sXG4gICdJJzogeydrZXlDb2RlJzogNzMsICdrZXknOiAnSScsICdjb2RlJzogJ0tleUknfSxcbiAgJ0onOiB7J2tleUNvZGUnOiA3NCwgJ2tleSc6ICdKJywgJ2NvZGUnOiAnS2V5Sid9LFxuICAnSyc6IHsna2V5Q29kZSc6IDc1LCAna2V5JzogJ0snLCAnY29kZSc6ICdLZXlLJ30sXG4gICdMJzogeydrZXlDb2RlJzogNzYsICdrZXknOiAnTCcsICdjb2RlJzogJ0tleUwnfSxcbiAgJ00nOiB7J2tleUNvZGUnOiA3NywgJ2tleSc6ICdNJywgJ2NvZGUnOiAnS2V5TSd9LFxuICAnTic6IHsna2V5Q29kZSc6IDc4LCAna2V5JzogJ04nLCAnY29kZSc6ICdLZXlOJ30sXG4gICdPJzogeydrZXlDb2RlJzogNzksICdrZXknOiAnTycsICdjb2RlJzogJ0tleU8nfSxcbiAgJ1AnOiB7J2tleUNvZGUnOiA4MCwgJ2tleSc6ICdQJywgJ2NvZGUnOiAnS2V5UCd9LFxuICAnUSc6IHsna2V5Q29kZSc6IDgxLCAna2V5JzogJ1EnLCAnY29kZSc6ICdLZXlRJ30sXG4gICdSJzogeydrZXlDb2RlJzogODIsICdrZXknOiAnUicsICdjb2RlJzogJ0tleVInfSxcbiAgJ1MnOiB7J2tleUNvZGUnOiA4MywgJ2tleSc6ICdTJywgJ2NvZGUnOiAnS2V5Uyd9LFxuICAnVCc6IHsna2V5Q29kZSc6IDg0LCAna2V5JzogJ1QnLCAnY29kZSc6ICdLZXlUJ30sXG4gICdVJzogeydrZXlDb2RlJzogODUsICdrZXknOiAnVScsICdjb2RlJzogJ0tleVUnfSxcbiAgJ1YnOiB7J2tleUNvZGUnOiA4NiwgJ2tleSc6ICdWJywgJ2NvZGUnOiAnS2V5Vid9LFxuICAnVyc6IHsna2V5Q29kZSc6IDg3LCAna2V5JzogJ1cnLCAnY29kZSc6ICdLZXlXJ30sXG4gICdYJzogeydrZXlDb2RlJzogODgsICdrZXknOiAnWCcsICdjb2RlJzogJ0tleVgnfSxcbiAgJ1knOiB7J2tleUNvZGUnOiA4OSwgJ2tleSc6ICdZJywgJ2NvZGUnOiAnS2V5WSd9LFxuICAnWic6IHsna2V5Q29kZSc6IDkwLCAna2V5JzogJ1onLCAnY29kZSc6ICdLZXlaJ30sXG4gICc6JzogeydrZXlDb2RlJzogMTg2LCAna2V5JzogJzonLCAnY29kZSc6ICdTZW1pY29sb24nfSxcbiAgJzwnOiB7J2tleUNvZGUnOiAxODgsICdrZXknOiAnXFw8JywgJ2NvZGUnOiAnQ29tbWEnfSxcbiAgJ18nOiB7J2tleUNvZGUnOiAxODksICdrZXknOiAnXycsICdjb2RlJzogJ01pbnVzJ30sXG4gICc+JzogeydrZXlDb2RlJzogMTkwLCAna2V5JzogJz4nLCAnY29kZSc6ICdQZXJpb2QnfSxcbiAgJz8nOiB7J2tleUNvZGUnOiAxOTEsICdrZXknOiAnPycsICdjb2RlJzogJ1NsYXNoJ30sXG4gICd+JzogeydrZXlDb2RlJzogMTkyLCAna2V5JzogJ34nLCAnY29kZSc6ICdCYWNrcXVvdGUnfSxcbiAgJ3snOiB7J2tleUNvZGUnOiAyMTksICdrZXknOiAneycsICdjb2RlJzogJ0JyYWNrZXRMZWZ0J30sXG4gICd8JzogeydrZXlDb2RlJzogMjIwLCAna2V5JzogJ3wnLCAnY29kZSc6ICdCYWNrc2xhc2gnfSxcbiAgJ30nOiB7J2tleUNvZGUnOiAyMjEsICdrZXknOiAnfScsICdjb2RlJzogJ0JyYWNrZXRSaWdodCd9LFxuICAnXCInOiB7J2tleUNvZGUnOiAyMjIsICdrZXknOiAnXCInLCAnY29kZSc6ICdRdW90ZSd9XG59OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3Qge2hlbHBlciwgZGVidWdFcnJvcn0gPSByZXF1aXJlKCcuL2hlbHBlcicpO1xuY29uc3Qge0V4ZWN1dGlvbkNvbnRleHQsIEpTSGFuZGxlfSA9IHJlcXVpcmUoJy4vRXhlY3V0aW9uQ29udGV4dCcpO1xuXG5jbGFzcyBXb3JrZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtmdW5jdGlvbighc3RyaW5nLCAhQXJyYXk8IUpTSGFuZGxlPil9IGNvbnNvbGVBUElDYWxsZWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbighUHJvdG9jb2wuUnVudGltZS5FeGNlcHRpb25EZXRhaWxzKX0gZXhjZXB0aW9uVGhyb3duXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIHVybCwgY29uc29sZUFQSUNhbGxlZCwgZXhjZXB0aW9uVGhyb3duKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICAgIHRoaXMuX2V4ZWN1dGlvbkNvbnRleHRQcm9taXNlID0gbmV3IFByb21pc2UoeCA9PiB0aGlzLl9leGVjdXRpb25Db250ZXh0Q2FsbGJhY2sgPSB4KTtcbiAgICAvKiogQHR5cGUge2Z1bmN0aW9uKCFQcm90b2NvbC5SdW50aW1lLlJlbW90ZU9iamVjdCk6IUpTSGFuZGxlfSAqL1xuICAgIGxldCBqc0hhbmRsZUZhY3Rvcnk7XG4gICAgdGhpcy5fY2xpZW50Lm9uY2UoJ1J1bnRpbWUuZXhlY3V0aW9uQ29udGV4dENyZWF0ZWQnLCBhc3luYyBldmVudCA9PiB7XG4gICAgICBqc0hhbmRsZUZhY3RvcnkgPSByZW1vdGVPYmplY3QgPT4gbmV3IEpTSGFuZGxlKGV4ZWN1dGlvbkNvbnRleHQsIGNsaWVudCwgcmVtb3RlT2JqZWN0KTtcbiAgICAgIGNvbnN0IGV4ZWN1dGlvbkNvbnRleHQgPSBuZXcgRXhlY3V0aW9uQ29udGV4dChjbGllbnQsIGV2ZW50LmNvbnRleHQsIGpzSGFuZGxlRmFjdG9yeSwgbnVsbCk7XG4gICAgICB0aGlzLl9leGVjdXRpb25Db250ZXh0Q2FsbGJhY2soZXhlY3V0aW9uQ29udGV4dCk7XG4gICAgfSk7XG4gICAgLy8gVGhpcyBtaWdodCBmYWlsIGlmIHRoZSB0YXJnZXQgaXMgY2xvc2VkIGJlZm9yZSB3ZSByZWNpZXZlIGFsbCBleGVjdXRpb24gY29udGV4dHMuXG4gICAgdGhpcy5fY2xpZW50LnNlbmQoJ1J1bnRpbWUuZW5hYmxlJywge30pLmNhdGNoKGRlYnVnRXJyb3IpO1xuXG4gICAgdGhpcy5fY2xpZW50Lm9uKCdSdW50aW1lLmNvbnNvbGVBUElDYWxsZWQnLCBldmVudCA9PiBjb25zb2xlQVBJQ2FsbGVkKGV2ZW50LnR5cGUsIGV2ZW50LmFyZ3MubWFwKGpzSGFuZGxlRmFjdG9yeSkpKTtcbiAgICB0aGlzLl9jbGllbnQub24oJ1J1bnRpbWUuZXhjZXB0aW9uVGhyb3duJywgZXhjZXB0aW9uID0+IGV4Y2VwdGlvblRocm93bihleGNlcHRpb24uZXhjZXB0aW9uRGV0YWlscykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPEV4ZWN1dGlvbkNvbnRleHQ+fVxuICAgKi9cbiAgYXN5bmMgZXhlY3V0aW9uQ29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXhlY3V0aW9uQ29udGV4dFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpfHN0cmluZ30gcGFnZUZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4geyFQcm9taXNlPCo+fVxuICAgKi9cbiAgYXN5bmMgZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9leGVjdXRpb25Db250ZXh0UHJvbWlzZSkuZXZhbHVhdGUocGFnZUZ1bmN0aW9uLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCl8c3RyaW5nfSBwYWdlRnVuY3Rpb25cbiAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyZ3NcbiAgICogQHJldHVybiB7IVByb21pc2U8IUpTSGFuZGxlPn1cbiAgICovXG4gIGFzeW5jIGV2YWx1YXRlSGFuZGxlKHBhZ2VGdW5jdGlvbiwgLi4uYXJncykge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZXhlY3V0aW9uQ29udGV4dFByb21pc2UpLmV2YWx1YXRlSGFuZGxlKHBhZ2VGdW5jdGlvbiwgLi4uYXJncyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7V29ya2VyfTtcbmhlbHBlci50cmFjZVB1YmxpY0FQSShXb3JrZXIpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHtUaW1lb3V0RXJyb3J9ID0gcmVxdWlyZSgnLi9FcnJvcnMnKTtcblxuY29uc3QgZGVidWdFcnJvciA9IHJlcXVpcmUoJ2RlYnVnJykoYHB1cHBldGVlcjplcnJvcmApO1xuLyoqIEB0eXBlIHs/TWFwPHN0cmluZywgYm9vbGVhbj59ICovXG5sZXQgYXBpQ292ZXJhZ2UgPSBudWxsO1xubGV0IHByb2plY3RSb290ID0gbnVsbDtcbmNsYXNzIEhlbHBlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuXG4gICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcmdzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBldmFsdWF0aW9uU3RyaW5nKGZ1biwgLi4uYXJncykge1xuICAgIGlmIChIZWxwZXIuaXNTdHJpbmcoZnVuKSkge1xuICAgICAgYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSAwLCAnQ2Fubm90IGV2YWx1YXRlIGEgc3RyaW5nIHdpdGggYXJndW1lbnRzJyk7XG4gICAgICByZXR1cm4gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChmdW4pO1xuICAgIH1cbiAgICByZXR1cm4gYCgke2Z1bn0pKCR7YXJncy5tYXAoc2VyaWFsaXplQXJndW1lbnQpLmpvaW4oJywnKX0pYDtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Kn0gYXJnXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUFyZ3VtZW50KGFyZykge1xuICAgICAgaWYgKE9iamVjdC5pcyhhcmcsIHVuZGVmaW5lZCkpXG4gICAgICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgcHJvamVjdFJvb3QoKSB7XG4gICAgaWYgKCFwcm9qZWN0Um9vdCkge1xuICAgICAgLy8gUHJvamVjdCByb290IHdpbGwgYmUgZGlmZmVyZW50IGZvciBub2RlNi10cmFuc3BpbGVkIGNvZGUuXG4gICAgICBwcm9qZWN0Um9vdCA9IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3BhY2thZ2UuanNvbicpKSA/IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpIDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJyk7XG4gICAgfVxuICAgIHJldHVybiBwcm9qZWN0Um9vdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQcm90b2NvbC5SdW50aW1lLkV4Y2VwdGlvbkRldGFpbHN9IGV4Y2VwdGlvbkRldGFpbHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldEV4Y2VwdGlvbk1lc3NhZ2UoZXhjZXB0aW9uRGV0YWlscykge1xuICAgIGlmIChleGNlcHRpb25EZXRhaWxzLmV4Y2VwdGlvbilcbiAgICAgIHJldHVybiBleGNlcHRpb25EZXRhaWxzLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbiB8fCBleGNlcHRpb25EZXRhaWxzLmV4Y2VwdGlvbi52YWx1ZTtcbiAgICBsZXQgbWVzc2FnZSA9IGV4Y2VwdGlvbkRldGFpbHMudGV4dDtcbiAgICBpZiAoZXhjZXB0aW9uRGV0YWlscy5zdGFja1RyYWNlKSB7XG4gICAgICBmb3IgKGNvbnN0IGNhbGxmcmFtZSBvZiBleGNlcHRpb25EZXRhaWxzLnN0YWNrVHJhY2UuY2FsbEZyYW1lcykge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGNhbGxmcmFtZS51cmwgKyAnOicgKyBjYWxsZnJhbWUubGluZU51bWJlciArICc6JyArIGNhbGxmcmFtZS5jb2x1bW5OdW1iZXI7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGNhbGxmcmFtZS5mdW5jdGlvbk5hbWUgfHwgJzxhbm9ueW1vdXM+JztcbiAgICAgICAgbWVzc2FnZSArPSBgXFxuICAgIGF0ICR7ZnVuY3Rpb25OYW1lfSAoJHtsb2NhdGlvbn0pYDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshUHJvdG9jb2wuUnVudGltZS5SZW1vdGVPYmplY3R9IHJlbW90ZU9iamVjdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgc3RhdGljIHZhbHVlRnJvbVJlbW90ZU9iamVjdChyZW1vdGVPYmplY3QpIHtcbiAgICBhc3NlcnQoIXJlbW90ZU9iamVjdC5vYmplY3RJZCwgJ0Nhbm5vdCBleHRyYWN0IHZhbHVlIHdoZW4gb2JqZWN0SWQgaXMgZ2l2ZW4nKTtcbiAgICBpZiAocmVtb3RlT2JqZWN0LnVuc2VyaWFsaXphYmxlVmFsdWUpIHtcbiAgICAgIHN3aXRjaCAocmVtb3RlT2JqZWN0LnVuc2VyaWFsaXphYmxlVmFsdWUpIHtcbiAgICAgICAgY2FzZSAnLTAnOlxuICAgICAgICAgIHJldHVybiAtMDtcbiAgICAgICAgY2FzZSAnTmFOJzpcbiAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICBjYXNlICdJbmZpbml0eSc6XG4gICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICBjYXNlICctSW5maW5pdHknOlxuICAgICAgICAgIHJldHVybiAtSW5maW5pdHk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB1bnNlcmlhbGl6YWJsZSB2YWx1ZTogJyArIHJlbW90ZU9iamVjdC51bnNlcmlhbGl6YWJsZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlbW90ZU9iamVjdC52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFQdXBwZXRlZXIuQ0RQU2Vzc2lvbn0gY2xpZW50XG4gICAqIEBwYXJhbSB7IVByb3RvY29sLlJ1bnRpbWUuUmVtb3RlT2JqZWN0fSByZW1vdGVPYmplY3RcbiAgICovXG4gIHN0YXRpYyBhc3luYyByZWxlYXNlT2JqZWN0KGNsaWVudCwgcmVtb3RlT2JqZWN0KSB7XG4gICAgaWYgKCFyZW1vdGVPYmplY3Qub2JqZWN0SWQpXG4gICAgICByZXR1cm47XG4gICAgYXdhaXQgY2xpZW50LnNlbmQoJ1J1bnRpbWUucmVsZWFzZU9iamVjdCcsIHtvYmplY3RJZDogcmVtb3RlT2JqZWN0Lm9iamVjdElkfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgLy8gRXhjZXB0aW9ucyBtaWdodCBoYXBwZW4gaW4gY2FzZSBvZiBhIHBhZ2UgYmVlbiBuYXZpZ2F0ZWQgb3IgY2xvc2VkLlxuICAgICAgLy8gU3dhbGxvdyB0aGVzZSBzaW5jZSB0aGV5IGFyZSBoYXJtbGVzcyBhbmQgd2UgZG9uJ3QgbGVhayBhbnl0aGluZyBpbiB0aGlzIGNhc2UuXG4gICAgICBkZWJ1Z0Vycm9yKGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFPYmplY3R9IGNsYXNzVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHB1YmxpY05hbWVcbiAgICovXG4gIHN0YXRpYyB0cmFjZVB1YmxpY0FQSShjbGFzc1R5cGUsIHB1YmxpY05hbWUpIHtcbiAgICBsZXQgY2xhc3NOYW1lID0gcHVibGljTmFtZSB8fCBjbGFzc1R5cGUucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnN1YnN0cmluZygwLCAxKS50b0xvd2VyQ2FzZSgpICsgY2xhc3NOYW1lLnN1YnN0cmluZygxKTtcbiAgICBjb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoYHB1cHBldGVlcjoke2NsYXNzTmFtZX1gKTtcbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQgJiYgIWFwaUNvdmVyYWdlKVxuICAgICAgcmV0dXJuO1xuICAgIGZvciAoY29uc3QgbWV0aG9kTmFtZSBvZiBSZWZsZWN0Lm93bktleXMoY2xhc3NUeXBlLnByb3RvdHlwZSkpIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IFJlZmxlY3QuZ2V0KGNsYXNzVHlwZS5wcm90b3R5cGUsIG1ldGhvZE5hbWUpO1xuICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdjb25zdHJ1Y3RvcicgfHwgdHlwZW9mIG1ldGhvZE5hbWUgIT09ICdzdHJpbmcnIHx8IG1ldGhvZE5hbWUuc3RhcnRzV2l0aCgnXycpIHx8IHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgaWYgKGFwaUNvdmVyYWdlKVxuICAgICAgICBhcGlDb3ZlcmFnZS5zZXQoYCR7Y2xhc3NOYW1lfS4ke21ldGhvZE5hbWV9YCwgZmFsc2UpO1xuICAgICAgUmVmbGVjdC5zZXQoY2xhc3NUeXBlLnByb3RvdHlwZSwgbWV0aG9kTmFtZSwgZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICBjb25zdCBhcmdzVGV4dCA9IGFyZ3MubWFwKHN0cmluZ2lmeUFyZ3VtZW50KS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGAke2NsYXNzTmFtZX0uJHttZXRob2ROYW1lfSgke2FyZ3NUZXh0fSlgO1xuICAgICAgICBpZiAoZGVidWcuZW5hYmxlZClcbiAgICAgICAgICBkZWJ1ZyhjYWxsc2l0ZSk7XG4gICAgICAgIGlmIChhcGlDb3ZlcmFnZSlcbiAgICAgICAgICBhcGlDb3ZlcmFnZS5zZXQoYCR7Y2xhc3NOYW1lfS4ke21ldGhvZE5hbWV9YCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjbGFzc1R5cGUuRXZlbnRzKSB7XG4gICAgICBpZiAoYXBpQ292ZXJhZ2UpIHtcbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBPYmplY3QudmFsdWVzKGNsYXNzVHlwZS5FdmVudHMpKVxuICAgICAgICAgIGFwaUNvdmVyYWdlLnNldChgJHtjbGFzc05hbWV9LmVtaXQoJHtKU09OLnN0cmluZ2lmeShldmVudCl9KWAsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1ldGhvZCA9IFJlZmxlY3QuZ2V0KGNsYXNzVHlwZS5wcm90b3R5cGUsICdlbWl0Jyk7XG4gICAgICBSZWZsZWN0LnNldChjbGFzc1R5cGUucHJvdG90eXBlLCAnZW1pdCcsIGZ1bmN0aW9uKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IGFyZ3NUZXh0ID0gW0pTT04uc3RyaW5naWZ5KGV2ZW50KV0uY29uY2F0KGFyZ3MubWFwKHN0cmluZ2lmeUFyZ3VtZW50KSkuam9pbignLCAnKTtcbiAgICAgICAgaWYgKGRlYnVnLmVuYWJsZWQgJiYgdGhpcy5saXN0ZW5lckNvdW50KGV2ZW50KSlcbiAgICAgICAgICBkZWJ1ZyhgJHtjbGFzc05hbWV9LmVtaXQoJHthcmdzVGV4dH0pYCk7XG4gICAgICAgIGlmIChhcGlDb3ZlcmFnZSAmJiB0aGlzLmxpc3RlbmVyQ291bnQoZXZlbnQpKVxuICAgICAgICAgIGFwaUNvdmVyYWdlLnNldChgJHtjbGFzc05hbWV9LmVtaXQoJHtKU09OLnN0cmluZ2lmeShldmVudCl9KWAsIHRydWUpO1xuICAgICAgICByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHshT2JqZWN0fSBhcmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyaW5naWZ5QXJndW1lbnQoYXJnKSB7XG4gICAgICBpZiAoSGVscGVyLmlzU3RyaW5nKGFyZykgfHwgSGVscGVyLmlzTnVtYmVyKGFyZykgfHwgIWFyZylcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XG4gICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgdGV4dCA9IGFyZy50b1N0cmluZygpLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiBsaW5lLnRyaW0oKSkuam9pbignJyk7XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA+IDIwKVxuICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCAyMCkgKyAn4oCmJztcbiAgICAgICAgcmV0dXJuIGBcIiR7dGV4dH1cImA7XG4gICAgICB9XG4gICAgICBjb25zdCBzdGF0ZSA9IHt9O1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFyZyk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXJnW2tleV07XG4gICAgICAgIGlmIChIZWxwZXIuaXNTdHJpbmcodmFsdWUpIHx8IEhlbHBlci5pc051bWJlcih2YWx1ZSkpXG4gICAgICAgICAgc3RhdGVba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5hbWUgPSBhcmcuY29uc3RydWN0b3IubmFtZSA9PT0gJ09iamVjdCcgPyAnJyA6IGFyZy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgcmV0dXJuIG5hbWUgKyBKU09OLnN0cmluZ2lmeShzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU5vZGVKUy5FdmVudEVtaXR0ZXJ9IGVtaXR0ZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKD8pfSBoYW5kbGVyXG4gICAqIEByZXR1cm4ge3tlbWl0dGVyOiAhTm9kZUpTLkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IGZ1bmN0aW9uKD8pfX1cbiAgICovXG4gIHN0YXRpYyBhZGRFdmVudExpc3RlbmVyKGVtaXR0ZXIsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgIGVtaXR0ZXIub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICByZXR1cm4geyBlbWl0dGVyLCBldmVudE5hbWUsIGhhbmRsZXIgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFBcnJheTx7ZW1pdHRlcjogIU5vZGVKUy5FdmVudEVtaXR0ZXIsIGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBmdW5jdGlvbig/KX0+fSBsaXN0ZW5lcnNcbiAgICovXG4gIHN0YXRpYyByZW1vdmVFdmVudExpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycylcbiAgICAgIGxpc3RlbmVyLmVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIuZXZlbnROYW1lLCBsaXN0ZW5lci5oYW5kbGVyKTtcbiAgICBsaXN0ZW5lcnMuc3BsaWNlKDAsIGxpc3RlbmVycy5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gez9NYXA8c3RyaW5nLCBib29sZWFuPn1cbiAgICovXG4gIHN0YXRpYyBwdWJsaWNBUElDb3ZlcmFnZSgpIHtcbiAgICByZXR1cm4gYXBpQ292ZXJhZ2U7XG4gIH1cblxuICBzdGF0aWMgcmVjb3JkUHVibGljQVBJQ292ZXJhZ2UoKSB7XG4gICAgYXBpQ292ZXJhZ2UgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshT2JqZWN0fSBvYmpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgb2JqIGluc3RhbmNlb2YgU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU9iamVjdH0gb2JqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNOdW1iZXIob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IG9iaiBpbnN0YW5jZW9mIE51bWJlcjtcbiAgfVxuXG4gIHN0YXRpYyBwcm9taXNpZnkobm9kZUZ1bmN0aW9uKSB7XG4gICAgZnVuY3Rpb24gcHJvbWlzaWZpZWQoLi4uYXJncykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2soZXJyLCAuLi5yZXN1bHQpIHtcbiAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAxKVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzdWx0WzBdKTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGVGdW5jdGlvbi5jYWxsKG51bGwsIC4uLmFyZ3MsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzaWZpZWQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshTm9kZUpTLkV2ZW50RW1pdHRlcn0gZW1pdHRlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICAgKiBAcmV0dXJuIHshUHJvbWlzZX1cbiAgICovXG4gIHN0YXRpYyB3YWl0Rm9yRXZlbnQoZW1pdHRlciwgZXZlbnROYW1lLCBwcmVkaWNhdGUsIHRpbWVvdXQpIHtcbiAgICBsZXQgZXZlbnRUaW1lb3V0LCByZXNvbHZlQ2FsbGJhY2ssIHJlamVjdENhbGxiYWNrO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlQ2FsbGJhY2sgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0Q2FsbGJhY2sgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBIZWxwZXIuYWRkRXZlbnRMaXN0ZW5lcihlbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghcHJlZGljYXRlKGV2ZW50KSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2xlYW51cCgpO1xuICAgICAgcmVzb2x2ZUNhbGxiYWNrKGV2ZW50KTtcbiAgICB9KTtcbiAgICBpZiAodGltZW91dCkge1xuICAgICAgZXZlbnRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgcmVqZWN0Q2FsbGJhY2sobmV3IFRpbWVvdXRFcnJvcignVGltZW91dCBleGNlZWRlZCB3aGlsZSB3YWl0aW5nIGZvciBldmVudCcpKTtcbiAgICAgIH0sIHRpbWVvdXQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgSGVscGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKFtsaXN0ZW5lcl0pO1xuICAgICAgY2xlYXJUaW1lb3V0KGV2ZW50VGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGFzc2VydCh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhlbHBlcjogSGVscGVyLFxuICBhc3NlcnQsXG4gIGRlYnVnRXJyb3Jcbn07XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSwgZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBtaW1lOyIsIm1vZHVsZS5leHBvcnRzID0gd3M7Il0sInNvdXJjZVJvb3QiOiIifQ==