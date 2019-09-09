const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = {
    onAction: function (action, emit) {
        switch (action.type) {
            case 'editor/save':
                console.log('saving test', action.data);

                fs.readFile(action.data.file, 'utf8', (err, data) => {
                    if (err)
                        throw err;

                    console.log('before', data);

                    var funcRegex = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}/;
                    var suiteStart = data.indexOf(action.data.suite);
                    var testStart = data.indexOf(action.data.test, suiteStart);

                    var after = data.substring(0, testStart);
                    after += data.substring(testStart).replace(funcRegex, 'function(){\n' + action.data.code + '\n}\n');
                    after = beautify(after, {
                        indent_size: 4
                    });
                    console.log('after', after);

                    var savedCode = beautify(action.data.code, {
                        indent_size: 4
                    });

                    fs.writeFile(action.data.file, after, (err) => {
                        if (err) {
                            emit('action', {
                                type: 'editor/error',
                                data: Object.assign({}, action.data, {
                                    error: err
                                })
                            });
                        } else {
                            emit('action', {
                                type: 'editor/saved',
                                data: Object.assign({}, action.data, {
                                    code: savedCode
                                })
                            });
                        }
                    });


                });

                break;
        }
    }
}
