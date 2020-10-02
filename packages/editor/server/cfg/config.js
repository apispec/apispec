const path = require('path');

const dir = process.cwd();
const isDev = process.argv.length > 2 && process.argv[2] === '--dev'; // process.env.NODE_ENV !== 'production';

module.exports = {
    server: {
        listenPort: 5050,
        distFolder: path.resolve(
            __dirname,
            isDev ? '../../app/src' : '../../dist'
        ),
        staticUrl: '/',
    },
    testDir: isDev ? path.resolve(dir, 'dev') : dir,
    devEnv: isDev,
};
