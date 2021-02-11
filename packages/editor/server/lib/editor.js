import fs from 'fs';
import jsBeautify from 'js-beautify';
import { init } from '@apispec/core';
import config from '../cfg/config.js';

const { js: beautify } = jsBeautify;
const { opts } = await init(config.testDir);

export default {
    onAction(action, emit) {
        switch (action.type) {
            case 'editor/init':
                emit('action', {
                    type: 'editor/project',
                    data: opts,
                });
                break;
            case 'editor/save':
                console.log('saving test', action.data);

                fs.readFile(action.data.file, 'utf8', (err, data) => {
                    if (err) throw err;

                    console.log('before', data);

                    const funcRegex = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}/;
                    const suiteStart = data.indexOf(action.data.suite);
                    const testStart = data.indexOf(
                        action.data.test,
                        suiteStart
                    );

                    let after = data.substring(0, testStart);
                    after += data
                        .substring(testStart)
                        .replace(
                            funcRegex,
                            `function(){\n${action.data.code}\n}\n`
                        );
                    after = beautify(after, {
                        indent_size: 4,
                    });
                    console.log('after', after);

                    const savedCode = beautify(action.data.code, {
                        indent_size: 4,
                    });

                    fs.writeFile(action.data.file, after, (err2) => {
                        if (err2) {
                            emit('action', {
                                type: 'editor/error',
                                data: { ...action.data, error: err2 },
                            });
                        } else {
                            emit('action', {
                                type: 'editor/saved',
                                data: { ...action.data, code: savedCode },
                            });
                        }
                    });
                });

                break;
            default:
        }
    },
};
