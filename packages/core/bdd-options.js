const Mocha = require('mocha');
const Test = require('mocha/lib/test');
const Common = require('mocha/lib/interfaces/common');

module.exports = Mocha.interfaces['bdd-options'] = function (suite) {
    var suites = [suite];

    suite.on('pre-require', function (context, file, mocha) {
        var common = Common(suites, context, mocha);

        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        /**
         * Describe a "suite" with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         */

        context.describe = context.context = function (options, fn) {

            let newSuite;

            if (typeof options === "object") {
                newSuite = common.suite.create({
                    title: options.title,
                    file: file,
                    fn: fn
                });
                newSuite.options = options;
            } else {
                newSuite = common.suite.create({
                    title: options,
                    file: file,
                    fn: fn
                });
                newSuite.options = {};
            }

            return newSuite;
        };

        /**
         * Pending describe.
         */

        context.xdescribe = context.xcontext = context.describe.skip = function (
            title,
            fn
        ) {
            return common.suite.skip({
                title: title,
                file: file,
                fn: fn
            });
        };

        /**
         * Exclusive suite.
         */

        context.describe.only = function (title, fn) {
            return common.suite.only({
                title: title,
                file: file,
                fn: fn
            });
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */

        context.it = context.specify = function (title, fn) {
            var suite = suites[0];
            if (suite.isPending()) {
                fn = null;
            }
            var test = new Test(title, fn);
            test.file = file;
            suite.addTest(test);
            return test;
        };

        /**
         * Exclusive test-case.
         */

        context.it.only = function (title, fn) {
            return common.test.only(mocha, context.it(title, fn));
        };

        /**
         * Pending test case.
         */

        context.xit = context.xspecify = context.it.skip = function (title) {
            return context.it(title);
        };

        /**
         * Number of attempts to retry.
         */
        context.it.retries = function (n) {
            context.retries(n);
        };

    });
};
