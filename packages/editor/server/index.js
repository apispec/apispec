import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import logger from 'morgan';
import config from './cfg/config.js';
import staticRoutes from './routes/static.js';
import socketRoutes from './routes/socket.js';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(logger('combined'));

staticRoutes.addRoutes(app, config);

socketRoutes.addRoutes(app, io, config);

server.listen(config.server.listenPort);

console.log('@apispec/editor is running in ', config.testDir);
console.log(
    `@apispec/editor is listening on port: ${config.server.listenPort}`
);
