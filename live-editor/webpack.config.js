const path = require('path');
const util = require('util');
const webpackMerge = require('webpack-merge');

const JS_REGEX = /\.js$|\.jsx$/;

module.exports = function (env) {
    console.log(env)
    const config = require('../html-report/mochawesome-report-generator/webpack.config');

    let newConfig = webpackMerge.smart(config, {
        context: path.resolve(__dirname),
        entry: {
            app: [
                './app/index.js',
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: env === 'dev' ? 'http://localhost:5050/' : '',
        },
        module: {
            rules: [
                {
                    test: JS_REGEX,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader', options: {
                                babelrcRoots: [
                                    // Keep the root as a root
                                    ".",

                                    // Also consider monorepo packages "root" and load their .babelrc files.
                                    "../html-report/mochawesome-report-generator"
                                ]
                            }
                        },
                    ],
                }
            ],
        },
        resolve: {
            alias: {
                react: path.resolve('../node_modules/react'),
            },
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            hot: true,
        }
    })

    console.log(util.inspect(newConfig, false, null))
    return newConfig

}
