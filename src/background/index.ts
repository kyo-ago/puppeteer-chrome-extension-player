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

class Background {
  private sessionId = 0;
  private targetInfo: TargetInfo[] = [];
  constructor(
    private debuggee: { tabId: number },
    private onTarget: (method: string, targetInfo: TargetInfo) => void
  ) {}

  static create(
    tabId: number,
    onTarget: (method: string, targetInfo: TargetInfo) => void,
    onEvent: (method: string, params: Object | null) => void,
    onDetach: (reason: string) => void
  ): Promise<Background> {
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
          if (
            chrome.runtime.lastError.message.match(
              /Another debugger is already attached/
            )
          ) {
            return resolve(new Background(debuggee, onTarget));
          }
          return reject(chrome.runtime.lastError);
        }
        resolve(new Background(debuggee, onTarget));
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

  close() {
    chrome.debugger.detach(this.debuggee, () => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
    });
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
}

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  let background: Background;
  port.onMessage.addListener(async msg => {
    if (msg.type === 'create') {
      background = await Background.create(
        msg.tabId,
        (method: string, targetInfo: TargetInfo) => {
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
        },
        (method: string, params: Object | null) => {
          port.postMessage({
            type: 'onEvent',
            result: JSON.stringify({
              method,
              params,
            }),
          });
        },
        (reason: string) => {
          port.postMessage({
            type: 'disconnect',
            reason,
          });
        }
      );
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

chrome.browserAction.onClicked.addListener((tab) => {
  window.open("browserAction.html", null, "width=420,height=250");
});
