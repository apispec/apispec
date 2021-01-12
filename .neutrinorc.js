const airbnbBase = require('@neutrinojs/airbnb-base');

module.exports = {
    options: {
        root: __dirname,
    },
    use: [
        airbnbBase({
            eslint: {
                baseConfig: {
                    rules: {
                        'no-plusplus': [
                            'error',
                            { allowForLoopAfterthoughts: true },
                        ],
                    },
                    extends: [
                        require.resolve('eslint-config-prettier'),
                        require.resolve('eslint-config-prettier/babel'),
                        require.resolve('eslint-config-prettier/react'),
                    ],
                },
            },
        }),
    ],
};
