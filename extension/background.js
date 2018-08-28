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
/******/ 	return __webpack_require__(__webpack_require__.s = "./background/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./background/index.ts":
/*!*****************************!*\
  !*** ./background/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

class Background {
    constructor(debuggee, onTarget) {
        this.debuggee = debuggee;
        this.onTarget = onTarget;
        this.sessionId = 0;
        this.targetInfo = [];
    }
    static create(tabId, onTarget, onEvent, onDetach) {
        return new Promise((resolve, reject) => {
            chrome.debugger.onEvent.addListener((source, method, params) => {
                console.log('onEvent', source, method, params);
                if (tabId !== source.tabId) {
                    return;
                }
                onEvent(method, params);
            });
            chrome.debugger.onDetach.addListener((source, reason) => {
                console.log('onDetach', source, reason);
                if (tabId !== source.tabId) {
                    return;
                }
                onDetach(reason);
            });
            let debuggee = { tabId };
            chrome.debugger.attach(debuggee, '1.3', () => {
                if (chrome.runtime.lastError) {
                    if (chrome.runtime.lastError.message.match(/Another debugger is already attached/)) {
                        return resolve(new Background(debuggee, onTarget));
                    }
                    return reject(chrome.runtime.lastError);
                }
                resolve(new Background(debuggee, onTarget));
            });
        });
    }
    send(message) {
        let { id, method, params } = JSON.parse(message);
        console.log('>>>', message);
        if (method === 'Target.setDiscoverTargets') {
            console.log('skip');
            return this.setDiscoverTargets(id, method, params);
        }
        if (method === 'Target.attachToTarget') {
            console.log('skip');
            return this.attachToTarget(id, method, params);
        }
        if (method === 'Target.sendMessageToTarget') {
            console.log('skip');
            return this.sendMessageToTarget(id, method, params);
        }
        return this.sendMethod(id, method, params);
    }
    close() {
        chrome.debugger.detach(this.debuggee, () => {
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
        });
    }
    async setDiscoverTargets(id, method, params) {
        await this.promisedTimeout();
        await this.checkTargets();
        let result = { id, result: {} };
        console.log('<<<', result);
        return JSON.stringify(result);
    }
    async attachToTarget(id, method, params) {
        await this.promisedTimeout();
        await this.checkTargets();
        let result = {
            id,
            result: {
                sessionId: `ExtensionSessionId${++this.sessionId}`,
            },
        };
        console.log('<<<', result);
        return JSON.stringify(result);
    }
    async sendMessageToTarget(id, method, params) {
        await this.promisedTimeout();
        let message = JSON.parse(params.message);
        console.log('>>>', message);
        let result = await this.sendCommand(message.id, message.method, message.params);
        await this.promisedTimeout();
        console.log('<<<', JSON.stringify(result));
        message.result = result;
        params.message = JSON.stringify(message);
        return JSON.stringify({
            method: 'Target.receivedMessageFromTarget',
            params,
        });
    }
    async sendMethod(id, method, params) {
        let result = await this.sendCommand(id, method, params);
        if (method === 'Target.createTarget') {
            await this.checkTargets();
        }
        let sendResult = JSON.stringify({ id, result });
        console.log('<<<', sendResult);
        return sendResult;
    }
    sendCommand(id, method, params) {
        return new Promise((resolve, reject) => {
            chrome.debugger.sendCommand(this.debuggee, method, params, result => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve(result);
            });
        });
    }
    checkTargets() {
        return new Promise(resolve => {
            let emit = (method) => (targetInfo) => {
                this.onTarget(method, targetInfo);
            };
            let types = {
                created: emit('Target.targetCreated'),
                deleted: emit('Target.targetDestroyed'),
                changed: emit('Target.targetInfoChanged'),
            };
            chrome.debugger.getTargets(targetInfoList => {
                let reducedInfo = this.targetInfo.reduce((base, cur) => {
                    let filtered = targetInfoList.filter(diff => cur.id !== diff.id);
                    if (filtered.length === targetInfoList.length) {
                        types.deleted(cur);
                    }
                    else {
                        base.push(cur);
                        types.changed(cur);
                    }
                    targetInfoList = filtered;
                    return base;
                }, []);
                targetInfoList.forEach(info => types.created(info));
                this.targetInfo = reducedInfo.concat(targetInfoList);
                resolve();
            });
        });
    }
    promisedTimeout(time = 0) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
chrome.runtime.onConnect.addListener((port) => {
    let background;
    port.onMessage.addListener(async (msg) => {
        if (msg.type === 'create') {
            background = await Background.create(msg.tabId, (method, targetInfo) => {
                port.postMessage({
                    type: 'result',
                    result: JSON.stringify({
                        method,
                        params: {
                            targetInfo: Object.assign({}, targetInfo, { targetId: targetInfo.id }),
                        },
                    }),
                });
            }, (method, params) => {
                port.postMessage({
                    type: 'onEvent',
                    result: JSON.stringify({
                        method,
                        params,
                    }),
                });
            }, (reason) => {
                port.postMessage({
                    type: 'disconnect',
                    reason,
                });
            });
            port.postMessage({ type: 'created' });
            return;
        }
        if (msg.type === 'send') {
            let result = await background.send(msg.message);
            port.postMessage({
                type: 'result',
                result,
            });
            return;
        }
    });
    port.onDisconnect.addListener(() => {
        background.close();
    });
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYmFja2dyb3VuZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN2REEsTUFBTSxVQUFVO0lBR2QsWUFDVSxRQUEyQixFQUMzQixRQUEwRDtRQUQxRCxhQUFRLEdBQVIsUUFBUSxDQUFtQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFrRDtRQUo1RCxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsZUFBVSxHQUFpQixFQUFFLENBQUM7SUFJbkMsQ0FBQztJQUVKLE1BQU0sQ0FBQyxNQUFNLENBQ1gsS0FBYSxFQUNiLFFBQTBELEVBQzFELE9BQXdELEVBQ3hELFFBQWtDO1FBRWxDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxDQUFD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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYmFja2dyb3VuZC9pbmRleC50c1wiKTtcbiIsImludGVyZmFjZSBUYXJnZXRJbmZvIHtcbiAgLyoqIFRhcmdldCB0eXBlLiAqL1xuICB0eXBlOiBzdHJpbmc7XG4gIC8qKiBUYXJnZXQgaWQuICovXG4gIGlkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcHRpb25hbC5cbiAgICogU2luY2UgQ2hyb21lIDMwLlxuICAgKiBUaGUgdGFiIGlkLCBkZWZpbmVkIGlmIHR5cGUgPT0gJ3BhZ2UnLlxuICAgKi9cbiAgdGFiSWQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBPcHRpb25hbC5cbiAgICogU2luY2UgQ2hyb21lIDMwLlxuICAgKiBUaGUgZXh0ZW5zaW9uIGlkLCBkZWZpbmVkIGlmIHR5cGUgPSAnYmFja2dyb3VuZF9wYWdlJy5cbiAgICovXG4gIGV4dGVuc2lvbklkPzogc3RyaW5nO1xuICAvKiogVHJ1ZSBpZiBkZWJ1Z2dlciBpcyBhbHJlYWR5IGF0dGFjaGVkLiAqL1xuICBhdHRhY2hlZDogYm9vbGVhbjtcbiAgLyoqIFRhcmdldCBwYWdlIHRpdGxlLiAqL1xuICB0aXRsZTogc3RyaW5nO1xuICAvKiogVGFyZ2V0IFVSTC4gKi9cbiAgdXJsOiBzdHJpbmc7XG4gIC8qKiBPcHRpb25hbC4gVGFyZ2V0IGZhdmljb24gVVJMLiAgKi9cbiAgZmF2aWNvblVybD86IHN0cmluZztcbn1cblxuY2xhc3MgQmFja2dyb3VuZCB7XG4gIHByaXZhdGUgc2Vzc2lvbklkID0gMDtcbiAgcHJpdmF0ZSB0YXJnZXRJbmZvOiBUYXJnZXRJbmZvW10gPSBbXTtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkZWJ1Z2dlZTogeyB0YWJJZDogbnVtYmVyIH0sXG4gICAgcHJpdmF0ZSBvblRhcmdldDogKG1ldGhvZDogc3RyaW5nLCB0YXJnZXRJbmZvOiBUYXJnZXRJbmZvKSA9PiB2b2lkXG4gICkge31cblxuICBzdGF0aWMgY3JlYXRlKFxuICAgIHRhYklkOiBudW1iZXIsXG4gICAgb25UYXJnZXQ6IChtZXRob2Q6IHN0cmluZywgdGFyZ2V0SW5mbzogVGFyZ2V0SW5mbykgPT4gdm9pZCxcbiAgICBvbkV2ZW50OiAobWV0aG9kOiBzdHJpbmcsIHBhcmFtczogT2JqZWN0IHwgbnVsbCkgPT4gdm9pZCxcbiAgICBvbkRldGFjaDogKHJlYXNvbjogc3RyaW5nKSA9PiB2b2lkXG4gICk6IFByb21pc2U8QmFja2dyb3VuZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjaHJvbWUuZGVidWdnZXIub25FdmVudC5hZGRMaXN0ZW5lcigoc291cmNlLCBtZXRob2QsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnb25FdmVudCcsIHNvdXJjZSwgbWV0aG9kLCBwYXJhbXMpO1xuICAgICAgICBpZiAodGFiSWQgIT09IHNvdXJjZS50YWJJZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbkV2ZW50KG1ldGhvZCwgcGFyYW1zKTtcbiAgICAgIH0pO1xuICAgICAgY2hyb21lLmRlYnVnZ2VyLm9uRGV0YWNoLmFkZExpc3RlbmVyKChzb3VyY2UsIHJlYXNvbikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnb25EZXRhY2gnLCBzb3VyY2UsIHJlYXNvbik7XG4gICAgICAgIGlmICh0YWJJZCAhPT0gc291cmNlLnRhYklkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9uRGV0YWNoKHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGRlYnVnZ2VlID0geyB0YWJJZCB9O1xuICAgICAgY2hyb21lLmRlYnVnZ2VyLmF0dGFjaChkZWJ1Z2dlZSwgJzEuMycsICgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlLm1hdGNoKFxuICAgICAgICAgICAgICAvQW5vdGhlciBkZWJ1Z2dlciBpcyBhbHJlYWR5IGF0dGFjaGVkL1xuICAgICAgICAgICAgKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobmV3IEJhY2tncm91bmQoZGVidWdnZWUsIG9uVGFyZ2V0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKG5ldyBCYWNrZ3JvdW5kKGRlYnVnZ2VlLCBvblRhcmdldCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgbGV0IHsgaWQsIG1ldGhvZCwgcGFyYW1zIH0gPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xuICAgIGNvbnNvbGUubG9nKCc+Pj4nLCBtZXNzYWdlKTtcbiAgICBpZiAobWV0aG9kID09PSAnVGFyZ2V0LnNldERpc2NvdmVyVGFyZ2V0cycpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdza2lwJyk7XG4gICAgICByZXR1cm4gdGhpcy5zZXREaXNjb3ZlclRhcmdldHMoaWQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgICB9XG4gICAgaWYgKG1ldGhvZCA9PT0gJ1RhcmdldC5hdHRhY2hUb1RhcmdldCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdza2lwJyk7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hUb1RhcmdldChpZCwgbWV0aG9kLCBwYXJhbXMpO1xuICAgIH1cbiAgICBpZiAobWV0aG9kID09PSAnVGFyZ2V0LnNlbmRNZXNzYWdlVG9UYXJnZXQnKSB7XG4gICAgICBjb25zb2xlLmxvZygnc2tpcCcpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VuZE1lc3NhZ2VUb1RhcmdldChpZCwgbWV0aG9kLCBwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kTWV0aG9kKGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBjaHJvbWUuZGVidWdnZXIuZGV0YWNoKHRoaXMuZGVidWdnZWUsICgpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgdGhyb3cgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXREaXNjb3ZlclRhcmdldHMoaWQ6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgdGhpcy5wcm9taXNlZFRpbWVvdXQoKTtcbiAgICBhd2FpdCB0aGlzLmNoZWNrVGFyZ2V0cygpO1xuICAgIGxldCByZXN1bHQgPSB7IGlkLCByZXN1bHQ6IHt9IH07XG4gICAgY29uc29sZS5sb2coJzw8PCcsIHJlc3VsdCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGF0dGFjaFRvVGFyZ2V0KGlkOiBzdHJpbmcsIG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIGF3YWl0IHRoaXMucHJvbWlzZWRUaW1lb3V0KCk7XG4gICAgYXdhaXQgdGhpcy5jaGVja1RhcmdldHMoKTtcbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgaWQsXG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc2Vzc2lvbklkOiBgRXh0ZW5zaW9uU2Vzc2lvbklkJHsrK3RoaXMuc2Vzc2lvbklkfWAsXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc29sZS5sb2coJzw8PCcsIHJlc3VsdCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNlbmRNZXNzYWdlVG9UYXJnZXQoaWQ6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgdGhpcy5wcm9taXNlZFRpbWVvdXQoKTtcbiAgICBsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UocGFyYW1zLm1lc3NhZ2UpO1xuICAgIGNvbnNvbGUubG9nKCc+Pj4nLCBtZXNzYWdlKTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5zZW5kQ29tbWFuZChcbiAgICAgIG1lc3NhZ2UuaWQsXG4gICAgICBtZXNzYWdlLm1ldGhvZCxcbiAgICAgIG1lc3NhZ2UucGFyYW1zXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLnByb21pc2VkVGltZW91dCgpO1xuICAgIGNvbnNvbGUubG9nKCc8PDwnLCBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICBtZXNzYWdlLnJlc3VsdCA9IHJlc3VsdDtcbiAgICBwYXJhbXMubWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBtZXRob2Q6ICdUYXJnZXQucmVjZWl2ZWRNZXNzYWdlRnJvbVRhcmdldCcsXG4gICAgICBwYXJhbXMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNlbmRNZXRob2QoaWQ6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuc2VuZENvbW1hbmQoaWQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgICBpZiAobWV0aG9kID09PSAnVGFyZ2V0LmNyZWF0ZVRhcmdldCcpIHtcbiAgICAgIGF3YWl0IHRoaXMuY2hlY2tUYXJnZXRzKCk7XG4gICAgfVxuICAgIGxldCBzZW5kUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoeyBpZCwgcmVzdWx0IH0pO1xuICAgIGNvbnNvbGUubG9nKCc8PDwnLCBzZW5kUmVzdWx0KTtcbiAgICByZXR1cm4gc2VuZFJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc2VuZENvbW1hbmQoaWQ6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNocm9tZS5kZWJ1Z2dlci5zZW5kQ29tbWFuZCh0aGlzLmRlYnVnZ2VlLCBtZXRob2QsIHBhcmFtcywgcmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tUYXJnZXRzKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBlbWl0ID0gKG1ldGhvZDogc3RyaW5nKSA9PiAodGFyZ2V0SW5mbzogVGFyZ2V0SW5mbykgPT4ge1xuICAgICAgICB0aGlzLm9uVGFyZ2V0KG1ldGhvZCwgdGFyZ2V0SW5mbyk7XG4gICAgICB9O1xuICAgICAgbGV0IHR5cGVzID0ge1xuICAgICAgICBjcmVhdGVkOiBlbWl0KCdUYXJnZXQudGFyZ2V0Q3JlYXRlZCcpLFxuICAgICAgICBkZWxldGVkOiBlbWl0KCdUYXJnZXQudGFyZ2V0RGVzdHJveWVkJyksXG4gICAgICAgIGNoYW5nZWQ6IGVtaXQoJ1RhcmdldC50YXJnZXRJbmZvQ2hhbmdlZCcpLFxuICAgICAgfTtcbiAgICAgIGNocm9tZS5kZWJ1Z2dlci5nZXRUYXJnZXRzKHRhcmdldEluZm9MaXN0ID0+IHtcbiAgICAgICAgbGV0IHJlZHVjZWRJbmZvID0gdGhpcy50YXJnZXRJbmZvLnJlZHVjZSgoYmFzZSwgY3VyKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbHRlcmVkID0gdGFyZ2V0SW5mb0xpc3QuZmlsdGVyKGRpZmYgPT4gY3VyLmlkICE9PSBkaWZmLmlkKTtcbiAgICAgICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSB0YXJnZXRJbmZvTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHR5cGVzLmRlbGV0ZWQoY3VyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFzZS5wdXNoKGN1cik7XG4gICAgICAgICAgICB0eXBlcy5jaGFuZ2VkKGN1cik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhcmdldEluZm9MaXN0ID0gZmlsdGVyZWQ7XG4gICAgICAgICAgcmV0dXJuIGJhc2U7XG4gICAgICAgIH0sIFtdKTtcbiAgICAgICAgdGFyZ2V0SW5mb0xpc3QuZm9yRWFjaChpbmZvID0+IHR5cGVzLmNyZWF0ZWQoaW5mbykpO1xuICAgICAgICB0aGlzLnRhcmdldEluZm8gPSByZWR1Y2VkSW5mby5jb25jYXQodGFyZ2V0SW5mb0xpc3QpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvbWlzZWRUaW1lb3V0KHRpbWUgPSAwKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKSk7XG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKChwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0KSA9PiB7XG4gIGxldCBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xuICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihhc3luYyBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgIGJhY2tncm91bmQgPSBhd2FpdCBCYWNrZ3JvdW5kLmNyZWF0ZShcbiAgICAgICAgbXNnLnRhYklkLFxuICAgICAgICAobWV0aG9kOiBzdHJpbmcsIHRhcmdldEluZm86IFRhcmdldEluZm8pID0+IHtcbiAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdyZXN1bHQnLFxuICAgICAgICAgICAgcmVzdWx0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5mbzoge1xuICAgICAgICAgICAgICAgICAgLi4udGFyZ2V0SW5mbyxcbiAgICAgICAgICAgICAgICAgIHRhcmdldElkOiB0YXJnZXRJbmZvLmlkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM6IE9iamVjdCB8IG51bGwpID0+IHtcbiAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdvbkV2ZW50JyxcbiAgICAgICAgICAgIHJlc3VsdDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAocmVhc29uOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdkaXNjb25uZWN0JyxcbiAgICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHBvcnQucG9zdE1lc3NhZ2UoeyB0eXBlOiAnY3JlYXRlZCcgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VuZCcpIHtcbiAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBiYWNrZ3JvdW5kLnNlbmQobXNnLm1lc3NhZ2UpO1xuICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdyZXN1bHQnLFxuICAgICAgICByZXN1bHQsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuICBwb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgYmFja2dyb3VuZC5jbG9zZSgpO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==