const path = require('path');

const dir = process.cwd();
const development = process.argv.length > 2 && process.argv[2] === '--dev'; // process.env.NODE_ENV !== 'production';

module.exports = {
    server: {
        listenPort: 5050,
        distFolder: path.resolve(
            __dirname,
            development ? '../../app/src' : '../../dist'
        ),
        staticUrl: '/',
    },
    testDir: development ? path.resolve(dir, 'dev') : dir,
    devEnv: development,
};
