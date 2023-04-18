/*
 * Copyright 2023 Avaiga Private Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

//@ts-check
'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

/**@type {import('webpack').Configuration}*/
// @ts-ignore
const config = (env, argv) => ({

  entry: {"taipy-studio-gui-markdown-preview": "./src/index.tsx"}, // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: { // https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, '../dist/markdownPreview'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  devtool: argv.mode === "development" && 'inline-source-map',
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
    ]
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, "public"),
                to: path.resolve(__dirname, '../dist/markdownPreview'),
            },
        ],
    }),
],
});
module.exports = config;
