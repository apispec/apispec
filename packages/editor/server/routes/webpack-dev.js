import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../../editor-frontend/webpack.config.js'; // ('dev');

webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true');
webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
const compiler = webpack({ mode: 'production', ...webpackConfig });

export default {
    addRoutes: (app) => {
        app.use(
            devMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                logLevel: 'debug',
            })
        );

        app.use(hotMiddleware(compiler));

        app.get('/index.html', (req, res) => {
            res.sendFile(
                path.resolve(path.join(webpackConfig.output.path, 'index.html'))
            );
        });

        // app.use(middleware(compiler));
    },
};
