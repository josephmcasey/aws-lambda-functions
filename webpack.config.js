/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
const path = require('path');
const fs = require('fs');
const nodeBuiltins = require('builtin-modules');

const lambdaDir = 'src/lambdas';
const lambdaNames = fs.readdirSync(path.join(__dirname, lambdaDir));

const DIST_DIR = path.join(__dirname, 'dist');

const entry = lambdaNames
  .reduce((entryMap, lambdaName) => {
    entryMap[lambdaName] = [
      'source-map-support/register',
      path.join(DIST_DIR, lambdaDir, `${lambdaName}/index.js`)
    ];
    return entryMap;
  }, {});

const externals = ['aws-sdk']
  .concat(nodeBuiltins)
  .reduce((externalsMap, moduleName) => {
    externalsMap[moduleName] = moduleName;
    return externalsMap;
  }, {});


const babelOptions = {
  presets: [
    [
      'env',
      {
        // Latest Node.js runtime for AWS Lambda functions
        targets: {
          node: '8.10'
        },
        modules: false
      }
    ]
  ]
}

const babelRule = {
  test: /\.js$/,
  exclude: [],
  use: {
    loader: 'babel-loader',
    options: babelOptions
  }
}

const typeScriptRule = {
  test: /\.ts$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: babelOptions
    },
    {
      loader: 'ts-loader'
    }
  ]
}


module.exports = {
  entry,
  externals,

  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name]/index.js'
  },

  target: 'node',

  module: {
    rules: [
      babelRule,
      typeScriptRule
    ]
  },

  resolve: {
    alias: {
      '~': DIST_DIR
    },
    extensions: ['.ts', '.js']
  },

  devtool: 'source-map'
};
