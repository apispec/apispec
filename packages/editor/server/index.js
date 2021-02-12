import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import logger from 'morgan';
import config from './cfg/config.js';
import staticRoutes from './routes/static.js';
import socketRoutes from './routes/socket.js';

export default (routes = staticRoutes) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    app.use(logger('combined'));

    routes.addRoutes(app, config);

    socketRoutes.addRoutes(app, io, config);

    server.listen(config.server.listenPort);

    console.log('@apispec/editor is running in ', config.projectDir);
    console.log(
        `@apispec/editor is listening on port: ${config.server.listenPort}`
    );
};
