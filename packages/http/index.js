import http from './http.js';

export default {
    type: 'protocol',
    name: 'http',
    parameters: {
        endpoint: {
            required: true,
        },
    },
    init: (opts) => http(opts.endpoint),
};
