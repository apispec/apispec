const path = require('path');
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config')('dev')

webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true');
webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
const compiler = webpack(webpackConfig);

exports.addRoutes = function (app, config) {

    app.use(devMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        logLevel: 'debug'
    }));

    app.use(hotMiddleware(compiler));

    app.get('/index.html', function (req, res) {
        res.sendFile(path.resolve(path.join(webpackConfig.output.path, 'index.html')));
    });

    //app.use(middleware(compiler));

};
