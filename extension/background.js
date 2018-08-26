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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

window.ws = WebSocket;
const Puppeteer = __webpack_require__(/*! ./lib/Puppeteer */ "./lib/Puppeteer.js");

(async () => {
  let tabId = await new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true }, tabs => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(tabs[0].id);
    });
  });
  let browser = await Puppeteer.connect({ tabId });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();


/***/ }),

/***/ "./lib/Extension.js":
/*!**************************!*\
  !*** ./lib/Extension.js ***!
  \**************************/
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

class Extension extends EventEmitter {
  static create(tabId) {
    return new Promise((resolve, reject) => {
      let debuggee = { tabId };
      chrome.debugger.attach(debuggee, '1.3', () => {
        if (chrome.runtime.lastError) {
          if (
            chrome.runtime.lastError.message.match(
              /Another debugger is already attached/
            )
          ) {
            return resolve(new Extension(debuggee));
          }
          return reject(chrome.runtime.lastError);
        }
        resolve(new Extension(debuggee));
      });
    });
  }

  /**
   * @param debuggee
   */
  constructor(debuggee) {
    super();
    this._debuggee = debuggee;
    this._sessionId = 0;

    this._targetInfo = [];

    chrome.debugger.onEvent.addListener((source, method, params) => {
      console.log('onEvent', source, method, params);
      if (this._debuggee.tabId !== source.tabId) {
        return;
      }
      this.emit('message', JSON.stringify({ method, params }));
    });
    chrome.debugger.onDetach.addListener((source, reason) => {
      console.log('onDetach', source, reason);
      if (this._debuggee.tabId !== source.tabId) {
        return;
      }
      this.emit('close');
    });
  }

  /**
   * @param {string} message
   */
  async send(message) {
    let { id, method, params } = JSON.parse(message);
    console.log('>>>', message);
    if (method === 'Target.setDiscoverTargets') {
      console.log('skip');
        await this._setTimeout();
      await this._checkTargets();
      let result = { id, result: {} };
        console.log('<<<', result);
      this.emit('message', JSON.stringify(result));
      return;
    }
    if (method === 'Target.attachToTarget') {
      console.log('skip');
        await this._setTimeout();
      await this._checkTargets();
        let result = {
            id,
            result: {
                sessionId: `ExtensionSessionId${++this._sessionId}`,
            },
        };
        console.log('<<<', result);
      this.emit(
        'message',
        JSON.stringify(result)
      );
      return;
    }
    if (method === 'Target.sendMessageToTarget') {
      console.log('skip');
      await this._setTimeout();
        let message = JSON.parse(params.message);
        console.log('>>>', message);
        let result = await this._sendCommand(
            message.id,
            message.method,
            message.params
        );
        await this._setTimeout();
        console.log('<<<', JSON.stringify(result));
        message.result = result;
        params.message = JSON.stringify(message);
        this.emit(
            'message',
            JSON.stringify({
                method: 'Target.receivedMessageFromTarget',
                params,
            })
        );
      return;
    }
    this._send(id, method, params);
  }

  close() {
    chrome.debugger.detach(this._debuggee, () => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
    });
  }

  _setTimeout(time = 0) {
      return new Promise((resolve) => setTimeout(resolve, time));
  }

  async _send(id, method, params) {
    let result = await this._sendCommand(id, method, params);
    if (method === 'Target.createTarget') {
      await this._checkTargets();
    }
    console.log('<<<', JSON.stringify({ id, result }));
    this.emit('message', JSON.stringify({ id, result }));
  }

  _sendCommand(id, method, params) {
    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(this._debuggee, method, params, result => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result);
      });
    });
  }

  _checkTargets() {
    return new Promise(resolve => {
      let emit = method => targetInfo => {
        this.emit(
          'message',
          JSON.stringify({
            method,
            params: {
              targetInfo: {
                ...targetInfo,
                targetId: targetInfo.id,
              },
            },
          })
        );
      };
      let types = {
        created: emit('Target.targetCreated'),
        deleted: emit('Target.targetDestroyed'),
        changed: emit('Target.targetInfoChanged'),
      };
      chrome.debugger.getTargets(targetInfoList => {
        let reducedInfo = this._targetInfo.reduce((base, cur) => {
          let filtered = targetInfoList.filter(diff => cur.id !== diff.id);
          if (filtered.length === targetInfoList.length) {
            types.deleted(cur);
          } else {
            base.push(cur);
            types.changed(cur);
          }
          targetInfoList = filtered;
          return base;
        }, []);
        targetInfoList.forEach(info => types.created(info));
        this._targetInfo = reducedInfo.concat(targetInfoList);
        resolve();
      });
    });
  }
}

module.exports = Extension;


/***/ }),

/***/ "./lib/Launcher.js":
/*!*************************!*\
  !*** ./lib/Launcher.js ***!
  \*************************/
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
const Extension = __webpack_require__(/*! ./Extension */ "./lib/Extension.js");
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

/***/ "./lib/Puppeteer.js":
/*!**************************!*\
  !*** ./lib/Puppeteer.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { helper } = __webpack_require__(/*! ../node_modules/puppeteer-core/lib/helper */ "./node_modules/puppeteer-core/lib/helper.js");
const Launcher = __webpack_require__(/*! ./Launcher */ "./lib/Launcher.js");

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

/***/ "./node_modules/mime/Mime.js":
/*!***********************************!*\
  !*** ./node_modules/mime/Mime.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }
}

/**
 * Define mimetype -> xtension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type];
    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1)
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

module.exports = Mime;


/***/ }),

/***/ "./node_modules/mime/index.js":
/*!************************************!*\
  !*** ./node_modules/mime/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Mime = __webpack_require__(/*! ./Mime */ "./node_modules/mime/Mime.js");
module.exports = new Mime(__webpack_require__(/*! ./types/standard */ "./node_modules/mime/types/standard.json"), __webpack_require__(/*! ./types/other */ "./node_modules/mime/types/other.json"));


/***/ }),

/***/ "./node_modules/mime/types/other.json":
/*!********************************************!*\
  !*** ./node_modules/mime/types/other.json ***!
  \********************************************/
/*! exports provided: application/prs.cww, application/vnd.3gpp.pic-bw-large, application/vnd.3gpp.pic-bw-small, application/vnd.3gpp.pic-bw-var, application/vnd.3gpp2.tcap, application/vnd.3m.post-it-notes, application/vnd.accpac.simply.aso, application/vnd.accpac.simply.imp, application/vnd.acucobol, application/vnd.acucorp, application/vnd.adobe.air-application-installer-package+zip, application/vnd.adobe.formscentral.fcdt, application/vnd.adobe.fxp, application/vnd.adobe.xdp+xml, application/vnd.adobe.xfdf, application/vnd.ahead.space, application/vnd.airzip.filesecure.azf, application/vnd.airzip.filesecure.azs, application/vnd.amazon.ebook, application/vnd.americandynamics.acc, application/vnd.amiga.ami, application/vnd.android.package-archive, application/vnd.anser-web-certificate-issue-initiation, application/vnd.anser-web-funds-transfer-initiation, application/vnd.antix.game-component, application/vnd.apple.installer+xml, application/vnd.apple.mpegurl, application/vnd.apple.pkpass, application/vnd.aristanetworks.swi, application/vnd.astraea-software.iota, application/vnd.audiograph, application/vnd.blueice.multipass, application/vnd.bmi, application/vnd.businessobjects, application/vnd.chemdraw+xml, application/vnd.chipnuts.karaoke-mmd, application/vnd.cinderella, application/vnd.claymore, application/vnd.cloanto.rp9, application/vnd.clonk.c4group, application/vnd.cluetrust.cartomobile-config, application/vnd.cluetrust.cartomobile-config-pkg, application/vnd.commonspace, application/vnd.contact.cmsg, application/vnd.cosmocaller, application/vnd.crick.clicker, application/vnd.crick.clicker.keyboard, application/vnd.crick.clicker.palette, application/vnd.crick.clicker.template, application/vnd.crick.clicker.wordbank, application/vnd.criticaltools.wbs+xml, application/vnd.ctc-posml, application/vnd.cups-ppd, application/vnd.curl.car, application/vnd.curl.pcurl, application/vnd.dart, application/vnd.data-vision.rdz, application/vnd.dece.data, application/vnd.dece.ttml+xml, application/vnd.dece.unspecified, application/vnd.dece.zip, application/vnd.denovo.fcselayout-link, application/vnd.dna, application/vnd.dolby.mlp, application/vnd.dpgraph, application/vnd.dreamfactory, application/vnd.ds-keypoint, application/vnd.dvb.ait, application/vnd.dvb.service, application/vnd.dynageo, application/vnd.ecowin.chart, application/vnd.enliven, application/vnd.epson.esf, application/vnd.epson.msf, application/vnd.epson.quickanime, application/vnd.epson.salt, application/vnd.epson.ssf, application/vnd.eszigno3+xml, application/vnd.ezpix-album, application/vnd.ezpix-package, application/vnd.fdf, application/vnd.fdsn.mseed, application/vnd.fdsn.seed, application/vnd.flographit, application/vnd.fluxtime.clip, application/vnd.framemaker, application/vnd.frogans.fnc, application/vnd.frogans.ltf, application/vnd.fsc.weblaunch, application/vnd.fujitsu.oasys, application/vnd.fujitsu.oasys2, application/vnd.fujitsu.oasys3, application/vnd.fujitsu.oasysgp, application/vnd.fujitsu.oasysprs, application/vnd.fujixerox.ddd, application/vnd.fujixerox.docuworks, application/vnd.fujixerox.docuworks.binder, application/vnd.fuzzysheet, application/vnd.genomatix.tuxedo, application/vnd.geogebra.file, application/vnd.geogebra.tool, application/vnd.geometry-explorer, application/vnd.geonext, application/vnd.geoplan, application/vnd.geospace, application/vnd.gmx, application/vnd.google-apps.document, application/vnd.google-apps.presentation, application/vnd.google-apps.spreadsheet, application/vnd.google-earth.kml+xml, application/vnd.google-earth.kmz, application/vnd.grafeq, application/vnd.groove-account, application/vnd.groove-help, application/vnd.groove-identity-message, application/vnd.groove-injector, application/vnd.groove-tool-message, application/vnd.groove-tool-template, application/vnd.groove-vcard, application/vnd.hal+xml, application/vnd.handheld-entertainment+xml, application/vnd.hbci, application/vnd.hhe.lesson-player, application/vnd.hp-hpgl, application/vnd.hp-hpid, application/vnd.hp-hps, application/vnd.hp-jlyt, application/vnd.hp-pcl, application/vnd.hp-pclxl, application/vnd.hydrostatix.sof-data, application/vnd.ibm.minipay, application/vnd.ibm.modcap, application/vnd.ibm.rights-management, application/vnd.ibm.secure-container, application/vnd.iccprofile, application/vnd.igloader, application/vnd.immervision-ivp, application/vnd.immervision-ivu, application/vnd.insors.igm, application/vnd.intercon.formnet, application/vnd.intergeo, application/vnd.intu.qbo, application/vnd.intu.qfx, application/vnd.ipunplugged.rcprofile, application/vnd.irepository.package+xml, application/vnd.is-xpr, application/vnd.isac.fcs, application/vnd.jam, application/vnd.jcp.javame.midlet-rms, application/vnd.jisp, application/vnd.joost.joda-archive, application/vnd.kahootz, application/vnd.kde.karbon, application/vnd.kde.kchart, application/vnd.kde.kformula, application/vnd.kde.kivio, application/vnd.kde.kontour, application/vnd.kde.kpresenter, application/vnd.kde.kspread, application/vnd.kde.kword, application/vnd.kenameaapp, application/vnd.kidspiration, application/vnd.kinar, application/vnd.koan, application/vnd.kodak-descriptor, application/vnd.las.las+xml, application/vnd.llamagraphics.life-balance.desktop, application/vnd.llamagraphics.life-balance.exchange+xml, application/vnd.lotus-1-2-3, application/vnd.lotus-approach, application/vnd.lotus-freelance, application/vnd.lotus-notes, application/vnd.lotus-organizer, application/vnd.lotus-screencam, application/vnd.lotus-wordpro, application/vnd.macports.portpkg, application/vnd.mcd, application/vnd.medcalcdata, application/vnd.mediastation.cdkey, application/vnd.mfer, application/vnd.mfmp, application/vnd.micrografx.flo, application/vnd.micrografx.igx, application/vnd.mif, application/vnd.mobius.daf, application/vnd.mobius.dis, application/vnd.mobius.mbk, application/vnd.mobius.mqy, application/vnd.mobius.msl, application/vnd.mobius.plc, application/vnd.mobius.txf, application/vnd.mophun.application, application/vnd.mophun.certificate, application/vnd.mozilla.xul+xml, application/vnd.ms-artgalry, application/vnd.ms-cab-compressed, application/vnd.ms-excel, application/vnd.ms-excel.addin.macroenabled.12, application/vnd.ms-excel.sheet.binary.macroenabled.12, application/vnd.ms-excel.sheet.macroenabled.12, application/vnd.ms-excel.template.macroenabled.12, application/vnd.ms-fontobject, application/vnd.ms-htmlhelp, application/vnd.ms-ims, application/vnd.ms-lrm, application/vnd.ms-officetheme, application/vnd.ms-outlook, application/vnd.ms-pki.seccat, application/vnd.ms-pki.stl, application/vnd.ms-powerpoint, application/vnd.ms-powerpoint.addin.macroenabled.12, application/vnd.ms-powerpoint.presentation.macroenabled.12, application/vnd.ms-powerpoint.slide.macroenabled.12, application/vnd.ms-powerpoint.slideshow.macroenabled.12, application/vnd.ms-powerpoint.template.macroenabled.12, application/vnd.ms-project, application/vnd.ms-word.document.macroenabled.12, application/vnd.ms-word.template.macroenabled.12, application/vnd.ms-works, application/vnd.ms-wpl, application/vnd.ms-xpsdocument, application/vnd.mseq, application/vnd.musician, application/vnd.muvee.style, application/vnd.mynfc, application/vnd.neurolanguage.nlu, application/vnd.nitf, application/vnd.noblenet-directory, application/vnd.noblenet-sealer, application/vnd.noblenet-web, application/vnd.nokia.n-gage.data, application/vnd.nokia.n-gage.symbian.install, application/vnd.nokia.radio-preset, application/vnd.nokia.radio-presets, application/vnd.novadigm.edm, application/vnd.novadigm.edx, application/vnd.novadigm.ext, application/vnd.oasis.opendocument.chart, application/vnd.oasis.opendocument.chart-template, application/vnd.oasis.opendocument.database, application/vnd.oasis.opendocument.formula, application/vnd.oasis.opendocument.formula-template, application/vnd.oasis.opendocument.graphics, application/vnd.oasis.opendocument.graphics-template, application/vnd.oasis.opendocument.image, application/vnd.oasis.opendocument.image-template, application/vnd.oasis.opendocument.presentation, application/vnd.oasis.opendocument.presentation-template, application/vnd.oasis.opendocument.spreadsheet, application/vnd.oasis.opendocument.spreadsheet-template, application/vnd.oasis.opendocument.text, application/vnd.oasis.opendocument.text-master, application/vnd.oasis.opendocument.text-template, application/vnd.oasis.opendocument.text-web, application/vnd.olpc-sugar, application/vnd.oma.dd2+xml, application/vnd.openofficeorg.extension, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.presentationml.slide, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.template, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.spreadsheetml.template, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.template, application/vnd.osgeo.mapguide.package, application/vnd.osgi.dp, application/vnd.osgi.subsystem, application/vnd.palm, application/vnd.pawaafile, application/vnd.pg.format, application/vnd.pg.osasli, application/vnd.picsel, application/vnd.pmi.widget, application/vnd.pocketlearn, application/vnd.powerbuilder6, application/vnd.previewsystems.box, application/vnd.proteus.magazine, application/vnd.publishare-delta-tree, application/vnd.pvi.ptid1, application/vnd.quark.quarkxpress, application/vnd.realvnc.bed, application/vnd.recordare.musicxml, application/vnd.recordare.musicxml+xml, application/vnd.rig.cryptonote, application/vnd.rim.cod, application/vnd.rn-realmedia, application/vnd.rn-realmedia-vbr, application/vnd.route66.link66+xml, application/vnd.sailingtracker.track, application/vnd.seemail, application/vnd.sema, application/vnd.semd, application/vnd.semf, application/vnd.shana.informed.formdata, application/vnd.shana.informed.formtemplate, application/vnd.shana.informed.interchange, application/vnd.shana.informed.package, application/vnd.simtech-mindmapper, application/vnd.smaf, application/vnd.smart.teacher, application/vnd.solent.sdkm+xml, application/vnd.spotfire.dxp, application/vnd.spotfire.sfs, application/vnd.stardivision.calc, application/vnd.stardivision.draw, application/vnd.stardivision.impress, application/vnd.stardivision.math, application/vnd.stardivision.writer, application/vnd.stardivision.writer-global, application/vnd.stepmania.package, application/vnd.stepmania.stepchart, application/vnd.sun.wadl+xml, application/vnd.sun.xml.calc, application/vnd.sun.xml.calc.template, application/vnd.sun.xml.draw, application/vnd.sun.xml.draw.template, application/vnd.sun.xml.impress, application/vnd.sun.xml.impress.template, application/vnd.sun.xml.math, application/vnd.sun.xml.writer, application/vnd.sun.xml.writer.global, application/vnd.sun.xml.writer.template, application/vnd.sus-calendar, application/vnd.svd, application/vnd.symbian.install, application/vnd.syncml+xml, application/vnd.syncml.dm+wbxml, application/vnd.syncml.dm+xml, application/vnd.tao.intent-module-archive, application/vnd.tcpdump.pcap, application/vnd.tmobile-livetv, application/vnd.trid.tpt, application/vnd.triscape.mxs, application/vnd.trueapp, application/vnd.ufdl, application/vnd.uiq.theme, application/vnd.umajin, application/vnd.unity, application/vnd.uoml+xml, application/vnd.vcx, application/vnd.visio, application/vnd.visionary, application/vnd.vsf, application/vnd.wap.wbxml, application/vnd.wap.wmlc, application/vnd.wap.wmlscriptc, application/vnd.webturbo, application/vnd.wolfram.player, application/vnd.wordperfect, application/vnd.wqd, application/vnd.wt.stf, application/vnd.xara, application/vnd.xfdl, application/vnd.yamaha.hv-dic, application/vnd.yamaha.hv-script, application/vnd.yamaha.hv-voice, application/vnd.yamaha.openscoreformat, application/vnd.yamaha.openscoreformat.osfpvg+xml, application/vnd.yamaha.smaf-audio, application/vnd.yamaha.smaf-phrase, application/vnd.yellowriver-custom-menu, application/vnd.zul, application/vnd.zzazz.deck+xml, application/x-7z-compressed, application/x-abiword, application/x-ace-compressed, application/x-apple-diskimage, application/x-arj, application/x-authorware-bin, application/x-authorware-map, application/x-authorware-seg, application/x-bcpio, application/x-bdoc, application/x-bittorrent, application/x-blorb, application/x-bzip, application/x-bzip2, application/x-cbr, application/x-cdlink, application/x-cfs-compressed, application/x-chat, application/x-chess-pgn, application/x-chrome-extension, application/x-cocoa, application/x-conference, application/x-cpio, application/x-csh, application/x-debian-package, application/x-dgc-compressed, application/x-director, application/x-doom, application/x-dtbncx+xml, application/x-dtbook+xml, application/x-dtbresource+xml, application/x-dvi, application/x-envoy, application/x-eva, application/x-font-bdf, application/x-font-ghostscript, application/x-font-linux-psf, application/x-font-pcf, application/x-font-snf, application/x-font-type1, application/x-freearc, application/x-futuresplash, application/x-gca-compressed, application/x-glulx, application/x-gnumeric, application/x-gramps-xml, application/x-gtar, application/x-hdf, application/x-httpd-php, application/x-install-instructions, application/x-iso9660-image, application/x-java-archive-diff, application/x-java-jnlp-file, application/x-latex, application/x-lua-bytecode, application/x-lzh-compressed, application/x-makeself, application/x-mie, application/x-mobipocket-ebook, application/x-ms-application, application/x-ms-shortcut, application/x-ms-wmd, application/x-ms-wmz, application/x-ms-xbap, application/x-msaccess, application/x-msbinder, application/x-mscardfile, application/x-msclip, application/x-msdos-program, application/x-msdownload, application/x-msmediaview, application/x-msmetafile, application/x-msmoney, application/x-mspublisher, application/x-msschedule, application/x-msterminal, application/x-mswrite, application/x-netcdf, application/x-ns-proxy-autoconfig, application/x-nzb, application/x-perl, application/x-pilot, application/x-pkcs12, application/x-pkcs7-certificates, application/x-pkcs7-certreqresp, application/x-rar-compressed, application/x-redhat-package-manager, application/x-research-info-systems, application/x-sea, application/x-sh, application/x-shar, application/x-shockwave-flash, application/x-silverlight-app, application/x-sql, application/x-stuffit, application/x-stuffitx, application/x-subrip, application/x-sv4cpio, application/x-sv4crc, application/x-t3vm-image, application/x-tads, application/x-tar, application/x-tcl, application/x-tex, application/x-tex-tfm, application/x-texinfo, application/x-tgif, application/x-ustar, application/x-virtualbox-hdd, application/x-virtualbox-ova, application/x-virtualbox-ovf, application/x-virtualbox-vbox, application/x-virtualbox-vbox-extpack, application/x-virtualbox-vdi, application/x-virtualbox-vhd, application/x-virtualbox-vmdk, application/x-wais-source, application/x-web-app-manifest+json, application/x-x509-ca-cert, application/x-xfig, application/x-xliff+xml, application/x-xpinstall, application/x-xz, application/x-zmachine, audio/vnd.dece.audio, audio/vnd.digital-winds, audio/vnd.dra, audio/vnd.dts, audio/vnd.dts.hd, audio/vnd.lucent.voice, audio/vnd.ms-playready.media.pya, audio/vnd.nuera.ecelp4800, audio/vnd.nuera.ecelp7470, audio/vnd.nuera.ecelp9600, audio/vnd.rip, audio/x-aac, audio/x-aiff, audio/x-caf, audio/x-flac, audio/x-m4a, audio/x-matroska, audio/x-mpegurl, audio/x-ms-wax, audio/x-ms-wma, audio/x-pn-realaudio, audio/x-pn-realaudio-plugin, audio/x-realaudio, audio/x-wav, chemical/x-cdx, chemical/x-cif, chemical/x-cmdf, chemical/x-cml, chemical/x-csml, chemical/x-xyz, image/prs.btif, image/vnd.adobe.photoshop, image/vnd.dece.graphic, image/vnd.djvu, image/vnd.dvb.subtitle, image/vnd.dwg, image/vnd.dxf, image/vnd.fastbidsheet, image/vnd.fpx, image/vnd.fst, image/vnd.fujixerox.edmics-mmr, image/vnd.fujixerox.edmics-rlc, image/vnd.ms-modi, image/vnd.ms-photo, image/vnd.net-fpx, image/vnd.wap.wbmp, image/vnd.xiff, image/x-3ds, image/x-cmu-raster, image/x-cmx, image/x-freehand, image/x-icon, image/x-jng, image/x-mrsid-image, image/x-ms-bmp, image/x-pcx, image/x-pict, image/x-portable-anymap, image/x-portable-bitmap, image/x-portable-graymap, image/x-portable-pixmap, image/x-rgb, image/x-tga, image/x-xbitmap, image/x-xpixmap, image/x-xwindowdump, message/vnd.wfa.wsc, model/vnd.collada+xml, model/vnd.dwf, model/vnd.gdl, model/vnd.gtw, model/vnd.mts, model/vnd.vtu, text/prs.lines.tag, text/vnd.curl, text/vnd.curl.dcurl, text/vnd.curl.mcurl, text/vnd.curl.scurl, text/vnd.dvb.subtitle, text/vnd.fly, text/vnd.fmi.flexstor, text/vnd.graphviz, text/vnd.in3d.3dml, text/vnd.in3d.spot, text/vnd.sun.j2me.app-descriptor, text/vnd.wap.wml, text/vnd.wap.wmlscript, text/x-asm, text/x-c, text/x-component, text/x-fortran, text/x-handlebars-template, text/x-java-source, text/x-lua, text/x-markdown, text/x-nfo, text/x-opml, text/x-org, text/x-pascal, text/x-processing, text/x-sass, text/x-scss, text/x-setext, text/x-sfv, text/x-suse-ymp, text/x-uuencode, text/x-vcalendar, text/x-vcard, video/vnd.dece.hd, video/vnd.dece.mobile, video/vnd.dece.pd, video/vnd.dece.sd, video/vnd.dece.video, video/vnd.dvb.file, video/vnd.fvt, video/vnd.mpegurl, video/vnd.ms-playready.media.pyv, video/vnd.uvvu.mp4, video/vnd.vivo, video/x-f4v, video/x-fli, video/x-flv, video/x-m4v, video/x-matroska, video/x-mng, video/x-ms-asf, video/x-ms-vob, video/x-ms-wm, video/x-ms-wmv, video/x-ms-wmx, video/x-ms-wvx, video/x-msvideo, video/x-sgi-movie, video/x-smv, x-conference/x-cooltalk, default */
/***/ (function(module) {

module.exports = {"application/prs.cww":["cww"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["*dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["*bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["*deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["*iso"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["*exe"],"application/x-msdownload":["*exe","*dll","com","bat","*msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["wmf","*wmz","emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["*prc","*pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["*m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["*ra"],"audio/x-wav":["*wav"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"image/prs.btif":["btif"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["*sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["*bmp"],"image/x-pcx":["pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/vnd.wfa.wsc":["wsc"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.vtu":["vtu"],"text/prs.lines.tag":["dsc"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["*org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]};

/***/ }),

/***/ "./node_modules/mime/types/standard.json":
/*!***********************************************!*\
  !*** ./node_modules/mime/types/standard.json ***!
  \***********************************************/
/*! exports provided: application/andrew-inset, application/applixware, application/atom+xml, application/atomcat+xml, application/atomsvc+xml, application/bdoc, application/ccxml+xml, application/cdmi-capability, application/cdmi-container, application/cdmi-domain, application/cdmi-object, application/cdmi-queue, application/cu-seeme, application/dash+xml, application/davmount+xml, application/docbook+xml, application/dssc+der, application/dssc+xml, application/ecmascript, application/emma+xml, application/epub+zip, application/exi, application/font-tdpfr, application/font-woff, application/geo+json, application/gml+xml, application/gpx+xml, application/gxf, application/gzip, application/hjson, application/hyperstudio, application/inkml+xml, application/ipfix, application/java-archive, application/java-serialized-object, application/java-vm, application/javascript, application/json, application/json5, application/jsonml+json, application/ld+json, application/lost+xml, application/mac-binhex40, application/mac-compactpro, application/mads+xml, application/manifest+json, application/marc, application/marcxml+xml, application/mathematica, application/mathml+xml, application/mbox, application/mediaservercontrol+xml, application/metalink+xml, application/metalink4+xml, application/mets+xml, application/mods+xml, application/mp21, application/mp4, application/msword, application/mxf, application/octet-stream, application/oda, application/oebps-package+xml, application/ogg, application/omdoc+xml, application/onenote, application/oxps, application/patch-ops-error+xml, application/pdf, application/pgp-encrypted, application/pgp-signature, application/pics-rules, application/pkcs10, application/pkcs7-mime, application/pkcs7-signature, application/pkcs8, application/pkix-attr-cert, application/pkix-cert, application/pkix-crl, application/pkix-pkipath, application/pkixcmp, application/pls+xml, application/postscript, application/pskc+xml, application/raml+yaml, application/rdf+xml, application/reginfo+xml, application/relax-ng-compact-syntax, application/resource-lists+xml, application/resource-lists-diff+xml, application/rls-services+xml, application/rpki-ghostbusters, application/rpki-manifest, application/rpki-roa, application/rsd+xml, application/rss+xml, application/rtf, application/sbml+xml, application/scvp-cv-request, application/scvp-cv-response, application/scvp-vp-request, application/scvp-vp-response, application/sdp, application/set-payment-initiation, application/set-registration-initiation, application/shf+xml, application/smil+xml, application/sparql-query, application/sparql-results+xml, application/srgs, application/srgs+xml, application/sru+xml, application/ssdl+xml, application/ssml+xml, application/tei+xml, application/thraud+xml, application/timestamped-data, application/voicexml+xml, application/wasm, application/widget, application/winhlp, application/wsdl+xml, application/wspolicy+xml, application/xaml+xml, application/xcap-diff+xml, application/xenc+xml, application/xhtml+xml, application/xml, application/xml-dtd, application/xop+xml, application/xproc+xml, application/xslt+xml, application/xspf+xml, application/xv+xml, application/yang, application/yin+xml, application/zip, audio/3gpp, audio/adpcm, audio/basic, audio/midi, audio/mp3, audio/mp4, audio/mpeg, audio/ogg, audio/s3m, audio/silk, audio/wav, audio/wave, audio/webm, audio/xm, font/collection, font/otf, font/ttf, font/woff, font/woff2, image/apng, image/bmp, image/cgm, image/g3fax, image/gif, image/ief, image/jp2, image/jpeg, image/jpm, image/jpx, image/ktx, image/png, image/sgi, image/svg+xml, image/tiff, image/webp, message/disposition-notification, message/global, message/global-delivery-status, message/global-disposition-notification, message/global-headers, message/rfc822, model/gltf+json, model/gltf-binary, model/iges, model/mesh, model/vrml, model/x3d+binary, model/x3d+vrml, model/x3d+xml, text/cache-manifest, text/calendar, text/coffeescript, text/css, text/csv, text/html, text/jade, text/jsx, text/less, text/markdown, text/mathml, text/n3, text/plain, text/richtext, text/rtf, text/sgml, text/shex, text/slim, text/stylus, text/tab-separated-values, text/troff, text/turtle, text/uri-list, text/vcard, text/vtt, text/xml, text/yaml, video/3gpp, video/3gpp2, video/h261, video/h263, video/h264, video/jpeg, video/jpm, video/mj2, video/mp2t, video/mp4, video/mpeg, video/ogg, video/quicktime, video/webm, default */
/***/ (function(module) {

module.exports = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/font-woff":["woff"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["*woff"],"font/woff2":["woff2"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/g3fax":["g3"],"image/gif":["gif"],"image/ief":["ief"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/tiff":["tiff","tif"],"image/webp":["webp"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["x3db","x3dbz"],"model/x3d+vrml":["x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

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
const mime = __webpack_require__(/*! mime */ "./node_modules/mime/index.js");
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

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ws;

/***/ })

/******/ });
//# sourceMappingURL=background.js.map