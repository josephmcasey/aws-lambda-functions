/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
const path = require('path');
const lambdaNames = require('fs').readdirSync(path.join(__dirname, 'src/lambdas'));

const entry = lambdaNames
    .reduce((entryMap, lambdaName) => {
        entryMap[lambdaName] = [ path.join(__dirname, `src/lambdas/${lambdaName}/index.ts`) ]
        return entryMap
    }, {})

const externals = require('builtin-modules').reduce((externalsMap, moduleName) => {
        externalsMap[moduleName] = moduleName;
        return externalsMap;
    }, {
        'aws-sdk': 'aws-sdk'
    });

const babelOptions = {
    presets: [
        [
            '@babel/preset-env',
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
        rules: [typeScriptRule]
    },

    resolve: {
        alias: {
            "~": path.resolve(__dirname)
        },
        extensions: ['.ts', '.js']
    },

    devtool: 'source-map'
};
