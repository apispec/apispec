const { description } = require('../../package');

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'apispec',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        repo: 'https://github.com/apispec/apispec',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        nav: [
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'DSL',
                link: '/config/',
            },
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '',
                    collapsable: false,
                    children: ['', 'getting-started'],
                },
                {
                    title: 'Basics', // required
                    collapsable: false, // optional, defaults to true
                    sidebarDepth: 1, // optional, defaults to 1
                    children: ['editor/', 'editor/editor', 'editor/execution'],
                },

                {
                    title: 'Advanced', // required
                    collapsable: false, // optional, defaults to true
                    sidebarDepth: 1, // optional, defaults to 1
                    children: ['advanced/', 'advanced/custom-plugins'],
                },
            ],
        },
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
