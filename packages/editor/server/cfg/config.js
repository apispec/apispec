import path from 'path';
import dirname from 'es-dirname';

const dir = process.cwd();
const isDev = process.argv.length > 2 && process.argv[2] === '--dev'; // process.env.NODE_ENV !== 'production';
if (isDev) process.env.NODE_ENV = 'development';

export default {
    server: {
        listenPort: 5050,
        distFolder: path.resolve(
            dirname(),
            isDev ? '../../app/src' : '../../dist'
        ),
        staticUrl: '/',
    },
    testDir: isDev ? path.resolve(dir, '../../../ogcapi-common-core') : dir, // TODO: args
    devEnv: isDev,
};
