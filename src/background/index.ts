interface TargetInfo {
  /** Target type. */
  type: string;
  /** Target id. */
  id: string;
  /**
   * Optional.
   * Since Chrome 30.
   * The tab id, defined if type == 'page'.
   */
  tabId?: number;
  /**
   * Optional.
   * Since Chrome 30.
   * The extension id, defined if type = 'background_page'.
   */
  extensionId?: string;
  /** True if debugger is already attached. */
  attached: boolean;
  /** Target page title. */
  title: string;
  /** Target URL. */
  url: string;
  /** Optional. Target favicon URL.  */
  faviconUrl?: string;
}

interface Debuggee {
  /** Optional. The id of the tab which you intend to debug.  */
  tabId?: number;
  /**
   * Optional.
   * Since Chrome 27.
   * The id of the extension which you intend to debug. Attaching to an extension background page is only possible when 'silent-debugger-extension-api' flag is enabled on the target browser.
   */
  extensionId?: string;
  /**
   * Optional.
   * Since Chrome 28.
   * The opaque id of the debug target.
   */
  targetId?: string;
}

class Background {
  private sessionId = 0;
  private targetInfo: TargetInfo[] = [];
  private onTarget: (method: string, targetInfo: TargetInfo) => void;
  private onDetachListener: Function | null = null;

  constructor(private debuggee: Debuggee) {}

  static async create(tabId: number): Promise<Background> {
    let debuggee = await Background.attach({ tabId });
    return new Background(debuggee);
  }

  static attach(debuggee: Debuggee) {
    return new Promise((resolve, reject) => {
      chrome.debugger.attach(debuggee, '1.3', () => {
        if (chrome.runtime.lastError) {
          if (
            chrome.runtime.lastError.message.match(
              /Another debugger is already attached/
            )
          ) {
            return resolve(debuggee);
          }
          return reject(chrome.runtime.lastError);
        }
        resolve(debuggee);
      });
    });
  }

  static detach(debuggee: Debuggee) {
    return new Promise((resolve, reject) => {
      chrome.debugger.detach(debuggee, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  send(message: string): Promise<string> {
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

  bindTarget(callback: (method: string, targetInfo: TargetInfo) => void) {
    this.onTarget = callback;
  }

  bindEvent(callback: (method: string, params: Object | null) => void) {
    chrome.debugger.onEvent.addListener((source, method, params) => {
      console.log('onEvent', source, method, params);
      if (!this.equalsDebuggee(source)) {
        return;
      }
      callback(method, params);
    });
  }

  bindDetach(onDetach: (reason: string) => void) {
    this.onDetachListener = ((source: any, reason: string) => {
      console.log('onDetach', source, reason);
      if (!this.equalsDebuggee(source)) {
        return;
      }
      onDetach(reason);
    }).bind(this);
    this.detachAddListener();
  }

  close() {
    return Background.detach(this.debuggee);
  }

  private async setDiscoverTargets(id: string, method: string, params: any) {
    await this.promisedTimeout();
    await this.checkTargets();
    let result = { id, result: {} };
    console.log('<<<', result);
    return JSON.stringify(result);
  }

  private async attachToTarget(id: string, method: string, params: any) {
    await this.promisedTimeout();
    await this.checkTargets();
    this.detachRemoveListener();

    await Background.detach(this.debuggee);
    let debuggee = await Background.attach({ targetId: params.targetId });
    this.debuggee = debuggee;

    let result = {
      id,
      result: {
        sessionId: `ExtensionSessionId${++this.sessionId}`,
      },
    };
    console.log('<<<', result);
    return JSON.stringify(result);
  }

  private async sendMessageToTarget(id: string, method: string, params: any) {
    await this.promisedTimeout();
    let message = JSON.parse(params.message);
    console.log('>>>', message);
    let result = await this.sendCommand(
      message.id,
      message.method,
      message.params
    );
    await this.promisedTimeout();
    console.log('<<<', JSON.stringify(result));
    message.result = result;
    params.message = JSON.stringify(message);
    return JSON.stringify({
      method: 'Target.receivedMessageFromTarget',
      params,
    });
  }

  private async sendMethod(id: string, method: string, params: any) {
    let result = await this.sendCommand(id, method, params);
    if (method === 'Target.createTarget') {
      await this.checkTargets();
    }
    let sendResult = JSON.stringify({ id, result });
    console.log('<<<', sendResult);
    return sendResult;
  }

  private sendCommand(id: string, method: string, params: any) {
    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(this.debuggee, method, params, result => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result);
      });
    });
  }

  private checkTargets() {
    return new Promise(resolve => {
      let emit = (method: string) => (targetInfo: TargetInfo) => {
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
          } else {
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

  private promisedTimeout(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private equalsDebuggee(debuggee: Debuggee): boolean {
    if (this.debuggee.tabId && debuggee.tabId) {
      return this.debuggee.tabId === debuggee.tabId;
    }
    if (this.debuggee.extensionId && debuggee.extensionId) {
      return this.debuggee.extensionId === debuggee.extensionId;
    }
    if (this.debuggee.targetId && debuggee.targetId) {
      return this.debuggee.targetId === debuggee.targetId;
    }
    return false;
  }

  private detachAddListener() {
    if (!this.onDetachListener) {
      return;
    }
    chrome.debugger.onDetach.addListener(<any>this.onDetachListener);
  }

  private detachRemoveListener() {
    if (!this.onDetachListener) {
      return;
    }
    chrome.debugger.onDetach.removeListener(<any>this.onDetachListener);
  }
}

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  let background: Background;
  port.onMessage.addListener(async msg => {
    if (msg.type === 'create') {
      background = await Background.create(msg.tabId).catch(error => {
        alert(error.message);
        return Promise.reject(error);
      });
      background.bindTarget((method: string, targetInfo: TargetInfo) => {
        port.postMessage({
          type: 'result',
          result: JSON.stringify({
            method,
            params: {
              targetInfo: {
                ...targetInfo,
                targetId: targetInfo.id,
              },
            },
          }),
        });
      });
      background.bindEvent((method: string, params: Object | null) => {
        port.postMessage({
          type: 'onEvent',
          result: JSON.stringify({
            method,
            params,
          }),
        });
      });
      background.bindDetach((reason: string) => {
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

chrome.browserAction.onClicked.addListener(tab => {
  window.open('browserAction.html', null, 'width=420,height=250');
});
