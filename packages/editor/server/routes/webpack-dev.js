import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../frontend/webpack.config.js';
import util from 'util';
console.log('WEBPACK', util.inspect(webpackConfig, false, null));

webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true');
webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
const compiler = webpack({ mode: 'development', ...webpackConfig });

export default {
    addRoutes: (app) => {
        app.use(
            devMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                // logLevel: 'debug',
            })
        );

        app.use(hotMiddleware(compiler));

        app.get('/index.html', (req, res) => {
            res.sendFile(
                path.resolve(path.join(webpackConfig.output.path, 'index.html'))
            );
        });
    },
};
