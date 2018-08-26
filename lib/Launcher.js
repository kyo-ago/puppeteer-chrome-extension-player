/**
 * Copyright 2017 Google Inc. All rights reserved.
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
const { Connection } = require('../node_modules/puppeteer-core/lib/Connection');
const Extension = require('./Extension');
const { Browser } = require('../node_modules/puppeteer-core/lib/Browser');
const { debugError } = require('../node_modules/puppeteer-core/lib/helper');

class Launcher {
  /**
   * @param {!(BrowserOptions & {browserWSEndpoint: string})=} options
   * @return {!Promise<!Browser>}
   */
  static async connect(options) {
    const {
      tabId = null,
      ignoreHTTPSErrors = false,
      defaultViewport = { width: 800, height: 600 },
      slowMo = 0,
    } = options;
    let extension = await Extension.create(tabId);
    const connection = new Connection('', extension, slowMo);
    const { browserContextIds } = await connection.send(
      'Target.getBrowserContexts'
    );
    return Browser.create(
      connection,
      browserContextIds,
      ignoreHTTPSErrors,
      defaultViewport,
      null,
      () => connection.send('Browser.close').catch(debugError)
    );
  }
}

module.exports = Launcher;
