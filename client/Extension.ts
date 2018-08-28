import { EventEmitter } from 'events';

export default class Extension extends EventEmitter {
  constructor(
    private sendCall: (message: string) => void,
    private closeCall: () => void
  ) {
    super();
  }
  static async create(tabId: string) {
    let extension: Extension;
    return new Promise(resolve => {
      chrome.runtime.onConnect.addListener(port => {
        port.onMessage.addListener(msg => {
          if (msg.type === 'created') {
            return resolve(
              new Extension(
                (message: string) => {
                  port.postMessage({
                    type: 'send',
                    message,
                  });
                },
                () => {
                  port.disconnect();
                }
              )
            );
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

  async send(message: string) {
    this.sendCall(message);
  }

  close() {
    this.closeCall();
  }
}
