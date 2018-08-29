let tabId: number, port: chrome.runtime.Port;
window.addEventListener('message', async event => {
  let toSandbox = (message: any) => {
    (<any>event.source).postMessage(message, event.origin);
  };

  if (event.data.type === 'connect') {
    tabId = await new Promise<number>((resolve, reject) => {
      chrome.tabs.query({ active: true }, tabs => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(tabs[0].id);
      });
    });
    port = chrome.runtime.connect();
    port.onMessage.addListener(msg => {
      if (msg.type === 'created') {
        return toSandbox({
          type: 'connected',
        });
      }
      if (msg.type === 'result') {
        return toSandbox({
          type: 'result',
          result: msg.result,
        });
      }
      if (msg.type === 'onEvent') {
        return toSandbox({
          type: 'onEvent',
          result: msg.result,
        });
      }
      if (msg.type === 'disconnect') {
        return toSandbox({
          type: 'disconnect',
          reason: msg.reason,
        });
      }
    });
    port.postMessage({ type: 'create', tabId });
    return;
  }
  if (event.data.type === 'send') {
    console.assert(port, 'Invalid call sequence.');
    port.postMessage({ type: 'send', message: event.data.message });
  }
});
