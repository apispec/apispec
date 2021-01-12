const { resolve } = require('path');
const addContext = require('mochawesome/addContext');

const parameters = {
    protocol: {
        required: true,
    },
};

const init = () => {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const rcPath = resolve(process.cwd(), '.apispecrc.js');
    console.log('RC', rcPath);

    const pkg = require(pkgPath);
    const rc = require(rcPath);
    const opts = {
        title: pkg.name,
        description: pkg.description,
        ...rc,
        name: pkg.name,
        version: pkg.version,
    };
    console.log('OPTS', opts);

    validateParameters(parameters, opts, 'core')

    const { plugins, protocol, contentTypes } = opts;

    const resolvedPlugins = plugins.map((plugin) => require(plugin));

    console.log('PLUGINS', resolvedPlugins);

    const protocolPlugin = resolvedPlugins.find(
        (plugin) => plugin.type === 'protocol' && plugin.name === protocol
    );

    validatePlugin(protocolPlugin, `protocol '${protocol}'`, opts)

    const contentPlugins = {};

    contentTypes.forEach((contentType) => {
        const contentPlugin = resolvedPlugins.find(
            (plugin) => plugin.type === 'content' && plugin.name === contentType
        );

        validatePlugin(contentPlugin, `content type '${contentType}'`, opts)

        contentPlugins[contentType] = contentPlugin.init(opts);
    });

    //TODO: server -> [protocol]
    return { opts, server: protocolPlugin.init(opts), ...contentPlugins };
};

const validatePlugin = (plugin, name, opts) => {
    if (plugin === undefined) {
        throw new Error(
            `Invalid ${name}, no matching plugin found.`
        );
    }

    validateParameters(plugin.parameters, opts, name)
}

const validateParameters = (schema, values, requiredBy) => {
    Object.keys(schema).forEach((param) => {
        if (schema[param].required && !values[param]) {
            throw new Error(`Required parameter '${param}' is not set (required by ${requiredBy}).`);
        }
    });
}

module.exports = { init, addContext, cfg: { todo: '' } };
