const http = require('./http');

module.exports = {
    type: 'protocol',
    name: 'http',
    parameters: {
        endpoint: {
            required: true,
        },
    },
    init: (opts) => http(opts.endpoint),
};
