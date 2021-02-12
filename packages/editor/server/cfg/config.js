import path from 'path';
import dirname from 'es-dirname';

const rootDir = process.cwd();
const isDev =
    process.argv.length > 1 && process.argv[1].substr(-6) === 'dev.js';
// eslint-disable-next-line no-nested-ternary
const projectDir = isDev
    ? process.argv.length > 2
        ? path.resolve(rootDir, process.argv[2])
        : path.resolve(rootDir, 'dev')
    : rootDir;

if (isDev) {
    process.env.NODE_ENV = 'development';
    console.log('DEV MODE');
}

export default {
    server: {
        listenPort: 5050,
        // TODO?
        distFolder: path.resolve(dirname(), '../../dist'),
        staticUrl: '/',
    },
    projectDir,
    isDev,
};
