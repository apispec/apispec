const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');

chai.use(chaiMatchPattern);

chai.use(function (_chai, utils) {
    const Assertion = _chai.Assertion;

    const origAssert = Assertion.prototype.assert;
    Assertion.prototype.assert = function () {
        try {
            origAssert.apply(this, arguments);
        } catch (e) {
            const error = cleanupError(e);
            throw error;
        }
    };

    function assertMatchPattern(pattern) {
        const obj = this._obj;
        const check = matchPattern(obj, pattern);
        this.assert(
            !check,
            check,
            'expected #{this} to not match the given pattern',
            pattern,
            obj,
            true
        );
    }

    Assertion.addMethod('matches', assertMatchPattern);
});

module.exports = {
    type: 'content',
    name: 'json',
    parameters: {},
    init: (opts) => (content) => chai.expect(content),
};

// TODO: replace functions in expected recursively
// TODO: if expected contains key '...', add differing keys from actual to expected
// TODO: reorder keys in expected if needed
// TODO: stringify objects to prevent reordering in mocha
const cleanupError = (error) => {
    delete error.stack;
    error.message = error.message.replace(
        /'function (is[A-Za-z]+)\(value\) \{\.\.\.\}'/,
        '$1'
    );

    return error;
};
