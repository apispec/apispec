import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import logger from 'morgan';
import config from './cfg/config.js';
import webpackDev from './routes/webpack-dev.js';
import socket from './routes/socket.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(logger('combined'));

console.log('DEV');

process.chdir(config.testDir);

webpackDev.addRoutes(app, config);

socket.addRoutes(app, io, config);

server.listen(config.server.listenPort);

console.log('@apispec/editor is running in ', config.testDir);
console.log(
    `@apispec/editor is listening on port: ${config.server.listenPort}`
);
