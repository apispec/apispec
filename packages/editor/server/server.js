const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const logger = require('morgan');
const config = require('./cfg/config.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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

console.log('@apispec/editor is running in ', config.testDir);
console.log(
    `@apispec/editor is listening on port: ${config.server.listenPort}`
);
