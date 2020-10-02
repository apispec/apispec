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
        ...rc,
        name: pkg.name,
        version: pkg.version,
    };
    console.log('OPTS', opts);

    // TODO: validate

    const { plugins, protocol } = opts;

    const resolvedPlugins = plugins.map((plugin) => require(plugin));

    console.log('PLUGINS', resolvedPlugins);

    const protocolPlugin = resolvedPlugins.find(
        (plugin) => plugin.type === 'protocol' && plugin.name === protocol
    );

    if (protocolPlugin === undefined) {
        throw new Error(
            `Invalid protocol ${protocol}, no matching plugin found.`
        );
    }

    const allParameters = {
        ...parameters,
        ...(protocol.parameters || {}),
    };

    Object.keys(allParameters).forEach((param) => {
        if (allParameters[param].required && !opts[param]) {
            throw new Error(`Required parameter ${param} is not set.`);
        }
    });

    return { opts, server: protocolPlugin.init(opts) };
};

module.exports = { init, addContext, cfg: { todo: '' } };
