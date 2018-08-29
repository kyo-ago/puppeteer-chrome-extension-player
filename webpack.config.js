const path = require('path');

module.exports = {
  entry: {
    background: './src/background/index.ts',
    browserAction: './src/browserAction/index.ts',
    sandbox: './src/sandbox/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: {
    fs: 'empty',
  },
  devtool: 'inline-source-map',
  externals: {
    ws: 'ws',
    mime: 'mime',
    './BrowserFetcher': 'BrowserFetcher',
  },
};
