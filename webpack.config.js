//@ts-check
'use strict';

const path = require('path');
const copyPlugin = require("copy-webpack-plugin");

/**@type {import('webpack').Configuration}*/
// @ts-ignore
const config = {

  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

  entry: './src/taipy.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: { // https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'taipy.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js', '.tsx'],
  },
  plugins: [
      new copyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "node_modules/@vscode/codicons/dist"),
            to: "@vscode/codicons/dist"
          }
        ]
      })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
    ]
  }
};
module.exports = config;
