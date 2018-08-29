import { EventEmitter } from 'events';

export default class Extension extends EventEmitter {
  constructor(
    private sendCall: (message: string) => void,
    private closeCall: () => void
  ) {
    super();
  }
  static async create() {
    let extension: Extension;
    return new Promise(resolve => {
      window.addEventListener('message', event => {
        let throwMessage = (message: any) => {
          (<any>event.source).postMessage(message, event.origin);
        };
        let data = event.data;
        if (data.type === 'connected') {
          return resolve(
            new Extension(
              (message: string) => {
                throwMessage({
                  type: 'send',
                  message,
                });
              },
              () => {
                console.log('disconnected');
              }
            )
          );
        }
        if (data.type === 'result') {
          return extension.emit('message', data.result);
        }
        if (data.type === 'onEvent') {
          return extension.emit('message', data.result);
        }
        if (data.type === 'disconnect') {
          console.log(data.reason);
          return extension.emit('close');
        }
      });
      window.parent.postMessage(
        {
          type: 'connect',
        },
        '*'
      );
    });
  }

  async send(message: string) {
    this.sendCall(message);
  }

  close() {
    this.closeCall();
  }
}
