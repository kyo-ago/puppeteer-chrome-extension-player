window.ws = WebSocket;
const Puppeteer = require('./lib/Puppeteer');

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
