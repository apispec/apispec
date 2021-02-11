import runner from '../lib/runner.js';
import editor from '../lib/editor.js';

export default {
    addRoutes: (app, io, config) => {
        io.on('connection', (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            runner.onConnect(socket.emit.bind(socket));

            socket.on('action', (action) => {
                if (action.type === 'mocha/hello') {
                    console.log('Got hello data!', action.data);
                    socket.emit('action', {
                        type: 'message',
                        data: 'good day!',
                    });
                }

                runner.onAction(action, socket.emit.bind(socket));
                editor.onAction(action, socket.emit.bind(socket));
            });
        });
    },
};
