var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var logger = require('morgan');
var config = require('./cfg/config.js');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(logger('combined'));

require('./routes/socket').addRoutes(app, io, config);

if (config.devEnv) {
    // TODO: this should not be reachable in production env, needs separate start file
    console.log('DEV');
    require('./routes/webpack-dev').addRoutes(app, config);
} else {
    require('./routes/static').addRoutes(app, config);
}

server.listen(config.server.listenPort);

console.log('running in ', process.cwd());
console.log('apispec live-editor listening on port: ' + config.server.listenPort);
