const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: 'background.js',
  },
  node: {
    fs: 'empty',
  },
  devtool: 'source-map',
  externals: {
    ws: 'ws',
    './BrowserFetcher': 'BrowserFetcher',
  },
};
