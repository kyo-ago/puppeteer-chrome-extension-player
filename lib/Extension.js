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
const EventEmitter = require('events');

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
      return this._setDiscoverTargets(id, method, params);
    }
    if (method === 'Target.attachToTarget') {
      console.log('skip');
      return this._attachToTarget(id, method, params);
    }
    if (method === 'Target.sendMessageToTarget') {
      console.log('skip');
      return this._sendMessageToTarget(id, method, params);
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

  async _setDiscoverTargets(id, method, params) {
      await this._setTimeout();
      await this._checkTargets();
      let result = { id, result: {} };
      console.log('<<<', result);
      this.emit('message', JSON.stringify(result));
  }

  async _attachToTarget(id, method, params) {
      await this._setTimeout();
      await this._checkTargets();
      let result = {
          id,
          result: {
              sessionId: `ExtensionSessionId${++this._sessionId}`,
          },
      };
      console.log('<<<', result);
      this.emit('message', JSON.stringify(result));
  }

  async _sendMessageToTarget(id, method, params) {
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
  }

  _setTimeout(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
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
