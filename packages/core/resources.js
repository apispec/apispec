const { readFileSync, readFile } = require('fs-extra');
const { resolve } = require('path');

const createResourceLoader = (rootDir) => (subDirs = '') => {
    const resourceDir = resolve(rootDir, subDirs);

    return {
        load: (name) => {
            const path = resolve(resourceDir, name);
            return readFile(path, 'utf8');
        },
        loadSync: (name) => {
            const path = resolve(resourceDir, name);
            return readFileSync(path, 'utf-8');
        },
    };
};

module.exports = (opts) => {
    const { rootDir } = opts;

    return {
        create: createResourceLoader(rootDir),
        ...createResourceLoader(rootDir)(),
    };
};
