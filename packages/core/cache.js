const {
    ensureDirSync,
    readFileSync,
    readFile,
    writeFileSync,
} = require('fs-extra');
const { resolve } = require('path');

const createCache = (rootDir) => (subDirs = '') => {
    const cacheDir = resolve(rootDir, 'cache', subDirs);

    return {
        save: (name, content) => {
            ensureDirSync(cacheDir);

            const path = resolve(cacheDir, name);
            writeFileSync(path, content);
        },
        load: (name) => {
            const path = resolve(cacheDir, name);
            return readFile(path, 'utf8');
        },
        loadSync: (name) => {
            const path = resolve(cacheDir, name);
            return readFileSync(path, 'utf-8');
        },
    };
};

module.exports = (opts) => {
    const { rootDir } = opts;

    return {
        create: createCache(rootDir),
        ...createCache(rootDir)(),
    };
};
