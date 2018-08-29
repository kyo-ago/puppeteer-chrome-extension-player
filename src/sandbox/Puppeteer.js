const { helper } = require('../../node_modules/puppeteer-core/lib/helper');
const Launcher = require('./Launcher');

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
