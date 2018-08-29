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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background/index.ts":
/*!*********************************!*\
  !*** ./src/background/index.ts ***!
  \*********************************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkRBLE1BQU0sVUFBVTtJQUdkLFlBQ1UsUUFBMkIsRUFDM0IsUUFBMEQ7UUFEMUQsYUFBUSxHQUFSLFFBQVEsQ0FBbUI7UUFDM0IsYUFBUSxHQUFSLFFBQVEsQ0FBa0Q7UUFKNUQsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLGVBQVUsR0FBaUIsRUFBRSxDQUFDO0lBSW5DLENBQUM7SUFFSixNQUFNLENBQUMsTUFBTSxDQUNYLEtBQWEsRUFDYixRQUEwRCxFQUMxRCxPQUF3RCxFQUN4RCxRQUFrQztRQUVsQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLElBQUksS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQzFCLE9BQU87aUJBQ1I7Z0JBQ0QsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUMxQixPQUFPO2lCQUNSO2dCQUNELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQzNDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7b0JBQzVCLElBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDcEMsc0NBQXNDLENBQ3ZDLEVBQ0Q7d0JBQ0EsT0FBTyxPQUFPLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7cUJBQ3BEO29CQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFlO1FBQ2xCLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEtBQUssMkJBQTJCLEVBQUU7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsSUFBSSxNQUFNLEtBQUssdUJBQXVCLEVBQUU7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUksTUFBTSxLQUFLLDRCQUE0QixFQUFFO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDekMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNoQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFVLEVBQUUsTUFBYyxFQUFFLE1BQVc7UUFDdEUsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFVLEVBQUUsTUFBYyxFQUFFLE1BQVc7UUFDbEUsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUc7WUFDWCxFQUFFO1lBQ0YsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQ25EO1NBQ0YsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU8sS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQVUsRUFBRSxNQUFjLEVBQUUsTUFBVztRQUN2RSxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQ2pDLE9BQU8sQ0FBQyxFQUFFLEVBQ1YsT0FBTyxDQUFDLE1BQU0sRUFDZCxPQUFPLENBQUMsTUFBTSxDQUNmLENBQUM7UUFDRixNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDeEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNwQixNQUFNLEVBQUUsa0NBQWtDO1lBQzFDLE1BQU07U0FDUCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFVLEVBQUUsTUFBYyxFQUFFLE1BQVc7UUFDOUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsSUFBSSxNQUFNLEtBQUsscUJBQXFCLEVBQUU7WUFDcEMsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDM0I7UUFDRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0IsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVPLFdBQVcsQ0FBQyxFQUFVLEVBQUUsTUFBYyxFQUFFLE1BQVc7UUFDekQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7b0JBQzVCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFlBQVk7UUFDbEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixJQUFJLElBQUksR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUU7Z0JBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQztZQUNGLElBQUksS0FBSyxHQUFHO2dCQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUM7YUFDMUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUMxQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFDckQsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNqRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRTt3QkFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDZixLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNwQjtvQkFDRCxjQUFjLEdBQUcsUUFBUSxDQUFDO29CQUMxQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ1AsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNyRCxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBeUIsRUFBRSxFQUFFO0lBQ2pFLElBQUksVUFBc0IsQ0FBQztJQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7UUFDckMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUN6QixVQUFVLEdBQUcsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUNsQyxHQUFHLENBQUMsS0FBSyxFQUNULENBQUMsTUFBYyxFQUFFLFVBQXNCLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDZixJQUFJLEVBQUUsUUFBUTtvQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDckIsTUFBTTt3QkFDTixNQUFNLEVBQUU7NEJBQ04sVUFBVSxvQkFDTCxVQUFVLElBQ2IsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEdBQ3hCO3lCQUNGO3FCQUNGLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUNELENBQUMsTUFBYyxFQUFFLE1BQXFCLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDZixJQUFJLEVBQUUsU0FBUztvQkFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDckIsTUFBTTt3QkFDTixNQUFNO3FCQUNQLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUNELENBQUMsTUFBYyxFQUFFLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ2YsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLE1BQU07aUJBQ1AsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUNGLENBQUM7WUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdEMsT0FBTztTQUNSO1FBRUQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN2QixJQUFJLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ2YsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTTthQUNQLENBQUMsQ0FBQztZQUNILE9BQU87U0FDUjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFO1FBQ2pDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzXCIpO1xuIiwiaW50ZXJmYWNlIFRhcmdldEluZm8ge1xuICAvKiogVGFyZ2V0IHR5cGUuICovXG4gIHR5cGU6IHN0cmluZztcbiAgLyoqIFRhcmdldCBpZC4gKi9cbiAgaWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIE9wdGlvbmFsLlxuICAgKiBTaW5jZSBDaHJvbWUgMzAuXG4gICAqIFRoZSB0YWIgaWQsIGRlZmluZWQgaWYgdHlwZSA9PSAncGFnZScuXG4gICAqL1xuICB0YWJJZD86IG51bWJlcjtcbiAgLyoqXG4gICAqIE9wdGlvbmFsLlxuICAgKiBTaW5jZSBDaHJvbWUgMzAuXG4gICAqIFRoZSBleHRlbnNpb24gaWQsIGRlZmluZWQgaWYgdHlwZSA9ICdiYWNrZ3JvdW5kX3BhZ2UnLlxuICAgKi9cbiAgZXh0ZW5zaW9uSWQ/OiBzdHJpbmc7XG4gIC8qKiBUcnVlIGlmIGRlYnVnZ2VyIGlzIGFscmVhZHkgYXR0YWNoZWQuICovXG4gIGF0dGFjaGVkOiBib29sZWFuO1xuICAvKiogVGFyZ2V0IHBhZ2UgdGl0bGUuICovXG4gIHRpdGxlOiBzdHJpbmc7XG4gIC8qKiBUYXJnZXQgVVJMLiAqL1xuICB1cmw6IHN0cmluZztcbiAgLyoqIE9wdGlvbmFsLiBUYXJnZXQgZmF2aWNvbiBVUkwuICAqL1xuICBmYXZpY29uVXJsPzogc3RyaW5nO1xufVxuXG5jbGFzcyBCYWNrZ3JvdW5kIHtcbiAgcHJpdmF0ZSBzZXNzaW9uSWQgPSAwO1xuICBwcml2YXRlIHRhcmdldEluZm86IFRhcmdldEluZm9bXSA9IFtdO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGRlYnVnZ2VlOiB7IHRhYklkOiBudW1iZXIgfSxcbiAgICBwcml2YXRlIG9uVGFyZ2V0OiAobWV0aG9kOiBzdHJpbmcsIHRhcmdldEluZm86IFRhcmdldEluZm8pID0+IHZvaWRcbiAgKSB7fVxuXG4gIHN0YXRpYyBjcmVhdGUoXG4gICAgdGFiSWQ6IG51bWJlcixcbiAgICBvblRhcmdldDogKG1ldGhvZDogc3RyaW5nLCB0YXJnZXRJbmZvOiBUYXJnZXRJbmZvKSA9PiB2b2lkLFxuICAgIG9uRXZlbnQ6IChtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBPYmplY3QgfCBudWxsKSA9PiB2b2lkLFxuICAgIG9uRGV0YWNoOiAocmVhc29uOiBzdHJpbmcpID0+IHZvaWRcbiAgKTogUHJvbWlzZTxCYWNrZ3JvdW5kPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNocm9tZS5kZWJ1Z2dlci5vbkV2ZW50LmFkZExpc3RlbmVyKChzb3VyY2UsIG1ldGhvZCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbkV2ZW50Jywgc291cmNlLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgICAgIGlmICh0YWJJZCAhPT0gc291cmNlLnRhYklkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9uRXZlbnQobWV0aG9kLCBwYXJhbXMpO1xuICAgICAgfSk7XG4gICAgICBjaHJvbWUuZGVidWdnZXIub25EZXRhY2guYWRkTGlzdGVuZXIoKHNvdXJjZSwgcmVhc29uKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbkRldGFjaCcsIHNvdXJjZSwgcmVhc29uKTtcbiAgICAgICAgaWYgKHRhYklkICE9PSBzb3VyY2UudGFiSWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb25EZXRhY2gocmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZGVidWdnZWUgPSB7IHRhYklkIH07XG4gICAgICBjaHJvbWUuZGVidWdnZXIuYXR0YWNoKGRlYnVnZ2VlLCAnMS4zJywgKCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UubWF0Y2goXG4gICAgICAgICAgICAgIC9Bbm90aGVyIGRlYnVnZ2VyIGlzIGFscmVhZHkgYXR0YWNoZWQvXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXcgQmFja2dyb3VuZChkZWJ1Z2dlZSwgb25UYXJnZXQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUobmV3IEJhY2tncm91bmQoZGVidWdnZWUsIG9uVGFyZ2V0KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmQobWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBsZXQgeyBpZCwgbWV0aG9kLCBwYXJhbXMgfSA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgY29uc29sZS5sb2coJz4+PicsIG1lc3NhZ2UpO1xuICAgIGlmIChtZXRob2QgPT09ICdUYXJnZXQuc2V0RGlzY292ZXJUYXJnZXRzJykge1xuICAgICAgY29uc29sZS5sb2coJ3NraXAnKTtcbiAgICAgIHJldHVybiB0aGlzLnNldERpc2NvdmVyVGFyZ2V0cyhpZCwgbWV0aG9kLCBwYXJhbXMpO1xuICAgIH1cbiAgICBpZiAobWV0aG9kID09PSAnVGFyZ2V0LmF0dGFjaFRvVGFyZ2V0Jykge1xuICAgICAgY29uc29sZS5sb2coJ3NraXAnKTtcbiAgICAgIHJldHVybiB0aGlzLmF0dGFjaFRvVGFyZ2V0KGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgfVxuICAgIGlmIChtZXRob2QgPT09ICdUYXJnZXQuc2VuZE1lc3NhZ2VUb1RhcmdldCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdza2lwJyk7XG4gICAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZVRvVGFyZ2V0KGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmRNZXRob2QoaWQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGNocm9tZS5kZWJ1Z2dlci5kZXRhY2godGhpcy5kZWJ1Z2dlZSwgKCkgPT4ge1xuICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICB0aHJvdyBjaHJvbWUucnVudGltZS5sYXN0RXJyb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldERpc2NvdmVyVGFyZ2V0cyhpZDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLnByb21pc2VkVGltZW91dCgpO1xuICAgIGF3YWl0IHRoaXMuY2hlY2tUYXJnZXRzKCk7XG4gICAgbGV0IHJlc3VsdCA9IHsgaWQsIHJlc3VsdDoge30gfTtcbiAgICBjb25zb2xlLmxvZygnPDw8JywgcmVzdWx0KTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYXR0YWNoVG9UYXJnZXQoaWQ6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgYXdhaXQgdGhpcy5wcm9taXNlZFRpbWVvdXQoKTtcbiAgICBhd2FpdCB0aGlzLmNoZWNrVGFyZ2V0cygpO1xuICAgIGxldCByZXN1bHQgPSB7XG4gICAgICBpZCxcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzZXNzaW9uSWQ6IGBFeHRlbnNpb25TZXNzaW9uSWQkeysrdGhpcy5zZXNzaW9uSWR9YCxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zb2xlLmxvZygnPDw8JywgcmVzdWx0KTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb1RhcmdldChpZDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLnByb21pc2VkVGltZW91dCgpO1xuICAgIGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShwYXJhbXMubWVzc2FnZSk7XG4gICAgY29uc29sZS5sb2coJz4+PicsIG1lc3NhZ2UpO1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCB0aGlzLnNlbmRDb21tYW5kKFxuICAgICAgbWVzc2FnZS5pZCxcbiAgICAgIG1lc3NhZ2UubWV0aG9kLFxuICAgICAgbWVzc2FnZS5wYXJhbXNcbiAgICApO1xuICAgIGF3YWl0IHRoaXMucHJvbWlzZWRUaW1lb3V0KCk7XG4gICAgY29uc29sZS5sb2coJzw8PCcsIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgIG1lc3NhZ2UucmVzdWx0ID0gcmVzdWx0O1xuICAgIHBhcmFtcy5tZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIG1ldGhvZDogJ1RhcmdldC5yZWNlaXZlZE1lc3NhZ2VGcm9tVGFyZ2V0JyxcbiAgICAgIHBhcmFtcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZE1ldGhvZChpZDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5zZW5kQ29tbWFuZChpZCwgbWV0aG9kLCBwYXJhbXMpO1xuICAgIGlmIChtZXRob2QgPT09ICdUYXJnZXQuY3JlYXRlVGFyZ2V0Jykge1xuICAgICAgYXdhaXQgdGhpcy5jaGVja1RhcmdldHMoKTtcbiAgICB9XG4gICAgbGV0IHNlbmRSZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh7IGlkLCByZXN1bHQgfSk7XG4gICAgY29uc29sZS5sb2coJzw8PCcsIHNlbmRSZXN1bHQpO1xuICAgIHJldHVybiBzZW5kUmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kQ29tbWFuZChpZDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY2hyb21lLmRlYnVnZ2VyLnNlbmRDb21tYW5kKHRoaXMuZGVidWdnZWUsIG1ldGhvZCwgcGFyYW1zLCByZXN1bHQgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja1RhcmdldHMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IGVtaXQgPSAobWV0aG9kOiBzdHJpbmcpID0+ICh0YXJnZXRJbmZvOiBUYXJnZXRJbmZvKSA9PiB7XG4gICAgICAgIHRoaXMub25UYXJnZXQobWV0aG9kLCB0YXJnZXRJbmZvKTtcbiAgICAgIH07XG4gICAgICBsZXQgdHlwZXMgPSB7XG4gICAgICAgIGNyZWF0ZWQ6IGVtaXQoJ1RhcmdldC50YXJnZXRDcmVhdGVkJyksXG4gICAgICAgIGRlbGV0ZWQ6IGVtaXQoJ1RhcmdldC50YXJnZXREZXN0cm95ZWQnKSxcbiAgICAgICAgY2hhbmdlZDogZW1pdCgnVGFyZ2V0LnRhcmdldEluZm9DaGFuZ2VkJyksXG4gICAgICB9O1xuICAgICAgY2hyb21lLmRlYnVnZ2VyLmdldFRhcmdldHModGFyZ2V0SW5mb0xpc3QgPT4ge1xuICAgICAgICBsZXQgcmVkdWNlZEluZm8gPSB0aGlzLnRhcmdldEluZm8ucmVkdWNlKChiYXNlLCBjdXIpID0+IHtcbiAgICAgICAgICBsZXQgZmlsdGVyZWQgPSB0YXJnZXRJbmZvTGlzdC5maWx0ZXIoZGlmZiA9PiBjdXIuaWQgIT09IGRpZmYuaWQpO1xuICAgICAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPT09IHRhcmdldEluZm9MaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdHlwZXMuZGVsZXRlZChjdXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYXNlLnB1c2goY3VyKTtcbiAgICAgICAgICAgIHR5cGVzLmNoYW5nZWQoY3VyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFyZ2V0SW5mb0xpc3QgPSBmaWx0ZXJlZDtcbiAgICAgICAgICByZXR1cm4gYmFzZTtcbiAgICAgICAgfSwgW10pO1xuICAgICAgICB0YXJnZXRJbmZvTGlzdC5mb3JFYWNoKGluZm8gPT4gdHlwZXMuY3JlYXRlZChpbmZvKSk7XG4gICAgICAgIHRoaXMudGFyZ2V0SW5mbyA9IHJlZHVjZWRJbmZvLmNvbmNhdCh0YXJnZXRJbmZvTGlzdCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9taXNlZFRpbWVvdXQodGltZSA9IDApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUpKTtcbiAgfVxufVxuXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoKHBvcnQ6IGNocm9tZS5ydW50aW1lLlBvcnQpID0+IHtcbiAgbGV0IGJhY2tncm91bmQ6IEJhY2tncm91bmQ7XG4gIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGFzeW5jIG1zZyA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlJykge1xuICAgICAgYmFja2dyb3VuZCA9IGF3YWl0IEJhY2tncm91bmQuY3JlYXRlKFxuICAgICAgICBtc2cudGFiSWQsXG4gICAgICAgIChtZXRob2Q6IHN0cmluZywgdGFyZ2V0SW5mbzogVGFyZ2V0SW5mbykgPT4ge1xuICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ3Jlc3VsdCcsXG4gICAgICAgICAgICByZXN1bHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAuLi50YXJnZXRJbmZvLFxuICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQ6IHRhcmdldEluZm8uaWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAobWV0aG9kOiBzdHJpbmcsIHBhcmFtczogT2JqZWN0IHwgbnVsbCkgPT4ge1xuICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ29uRXZlbnQnLFxuICAgICAgICAgICAgcmVzdWx0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIChyZWFzb246IHN0cmluZykgPT4ge1xuICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICAgICAgcmVhc29uLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHR5cGU6ICdjcmVhdGVkJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZW5kJykge1xuICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGJhY2tncm91bmQuc2VuZChtc2cubWVzc2FnZSk7XG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ3Jlc3VsdCcsXG4gICAgICAgIHJlc3VsdCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG4gIHBvcnQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICBiYWNrZ3JvdW5kLmNsb3NlKCk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9