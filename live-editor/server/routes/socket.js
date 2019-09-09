var runner = require('../lib/runner');
var editor = require('../lib/editor');


exports.addRoutes = function(app, io, config) {

    io.on('connection', function(socket) {
    	
        console.log("Socket connected: " + socket.id);

        runner.onConnect(socket.emit.bind(socket));

        socket.on('action', (action) => {
            if (action.type === 'mocha/hello') {
                console.log('Got hello data!', action.data);
                socket.emit('action', { type: 'message', data: 'good day!' });
            }
            
            runner.onAction(action, socket.emit.bind(socket));
            editor.onAction(action, socket.emit.bind(socket));
        });
    });

};