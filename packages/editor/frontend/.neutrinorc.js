const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const mocha = require('@neutrinojs/mocha');
const fs = require('fs');
const path = require('path');
const htmlEntities = require('html-entities');

const allowedModuleRegex = new RegExp(`^.*?\\/(@apispec|apispec)\\/.*?$`);

module.exports = {
    options: {
        root: __dirname,
        output: 'dist',
        mains: {
            app: {
                entry: 'app',
            },
        },
    },
    use: [
        airbnb({
            eslint: {
                baseConfig: {
                    rules: {
                        'react/jsx-props-no-spreading': 'off',
                        'arrow-body-style': 'off',
                        'no-underscore-dangle': 'off',
                        'import/prefer-default-export': 'off',
                        'import/no-extraneous-dependencies': [
                            'error',
                            { devDependencies: true },
                        ],
                        'react/jsx-filename-extension': 'warn',
                        'no-plusplus': [
                            'error',
                            { allowForLoopAfterthoughts: true },
                        ],
                    },
                    extends: [
                        require.resolve('eslint-config-prettier'),
                        require.resolve('eslint-config-prettier/babel'),
                        require.resolve('eslint-config-prettier/react'),
                    ],
                },
            },
        }),

        react({
            html: process.env.NODE_ENV !== 'production'
                    ? {
                          filename: 'index.html',
                          template: require.resolve('./dev/index.ejs'),
                          config: htmlEntities.encode(
                              fs.readFileSync(
                                  path.join(__dirname, 'dev/config.json'),
                                  'utf8'
                              )
                          ),
                      } : false,
            style: {
                extract: {
                    plugin: {
                        filename: '[name].inline.css',
                    },
                },
            },
            babel: {
                plugins: [
                    [
                        require.resolve('@babel/plugin-proposal-decorators'),
                        { legacy: true },
                    ],
                ],
            },
        }),

        mocha(),

        (neutrino) => {
            neutrino.config.optimization.splitChunks(false).runtimeChunk(false);

            neutrino.config.performance
                .maxEntrypointSize(512000)
                .maxAssetSize(512000);

            neutrino.config.output.filename('[name].js');

            neutrino.config.module
                .rule('compile')
                .include.add(path.join(__dirname, '../../report/src'));
        },
    ],
};
