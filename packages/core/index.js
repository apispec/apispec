const { resolve } = require('path');
const addContext = require('mochawesome/addContext');
const initCache = require('./cache');
const initResources = require('./resources');

const parameters = {
    protocol: {
        required: true,
    },
};

const init = () => {
    const rootDir = process.cwd();
    const pkgPath = resolve(rootDir, 'package.json');
    const rcPath = resolve(rootDir, '.apispecrc.js');
    console.log('RC', rcPath);

    const pkg = require(pkgPath);
    const rc = require(rcPath);
    const opts = {
        title: pkg.name,
        description: pkg.description,
        ...rc,
        name: pkg.name,
        version: pkg.version,
        cache: initCache({ ...rc, rootDir }),
        resources: initResources({ ...rc, rootDir }),
        rootDir,
    };
    console.log('OPTS', opts);

    validateParameters(parameters, opts, 'core');

    const { plugins, protocol, contentTypes } = opts;

    const resolvedPlugins = plugins.map((plugin) => require(plugin));

    console.log('PLUGINS', resolvedPlugins);

    const protocolPlugin = resolvedPlugins.find(
        (plugin) => plugin.type === 'protocol' && plugin.name === protocol
    );

    validatePlugin(protocolPlugin, `protocol '${protocol}'`, opts);

    const contentPlugins = {};

    contentTypes.forEach((contentType) => {
        const contentPlugin = resolvedPlugins.find(
            (plugin) => plugin.type === 'content' && plugin.name === contentType
        );

        validatePlugin(contentPlugin, `content type '${contentType}'`, opts);

        contentPlugins[contentType] = contentPlugin.init(opts);
    });

    const shared = {};

    //TODO: server -> [protocol]
    return {
        opts,
        server: protocolPlugin.init(opts),
        ...contentPlugins,
        save: (key, value, context = 'GLOBAL') => {
            if (!shared[context]) shared[context] = {};
            shared[context][key] = value;
        },
        load: (key, context = 'GLOBAL') => {
            if (!shared[context]) shared[context] = {};
            return shared[context][key];
        },
    };
};

const validatePlugin = (plugin, name, opts) => {
    if (plugin === undefined) {
        throw new Error(`Invalid ${name}, no matching plugin found.`);
    }

    validateParameters(plugin.parameters, opts, name);
};

const validateParameters = (schema, values, requiredBy) => {
    Object.keys(schema).forEach((param) => {
        if (schema[param].required && !values[param]) {
            throw new Error(
                `Required parameter '${param}' is not set (required by ${requiredBy}).`
            );
        }
    });
};

module.exports = { init, addContext, cfg: { todo: '' } };
