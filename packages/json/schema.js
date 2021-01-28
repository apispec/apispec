const Ajv = require('ajv').default;
const superagent = require('superagent');
const util = require('util');

const remoteSchemaLoader = (baseUri, cache) => {
    const schemaCache = cache ? cache.create('schemas') : null;

    const load = (path) =>
        superagent.get(baseUri + path).then((res) => {
            if (res.statusCode >= 400)
                throw new Error('Loading error: ' + res.statusCode);

            return res.text;
        });

    return (path) => {
        const schema = schemaCache
            ? schemaCache.load(path).catch((err) => {
                  console.log('NOT CACHED', err);
                  return load(path).then((schema) => {
                      schemaCache.save(path, schema);

                      return schema;
                  });
              })
            : load(path);

        return schema
            .then((schema) => {
                return schema
                    .replace(/\$href/g, '$ref')
                    .replace(/title/g, 'titl'); //TODO
            })
            .then((schema) => {
                return JSON.parse(schema);
            });
    };
};

const localSchemaLoader = (basePath, resources) => {
    const schemas = resources.create(basePath);

    return (path) => {
        const schema = schemas.load(path);

        return schema
            .then((schema) => {
                return schema
                    .replace(/\$href/g, '$ref')
                    .replace(/title/g, 'titl'); //TODO
            })
            .then((schema) => {
                return JSON.parse(schema);
            });
    };
};

const validateAgainstSchema = (json, schemaPath, loadSchema) => {
    const ajv = new Ajv({ strict: 'log', loadSchema: loadSchema });

    return loadSchema(schemaPath)
        .then((schema) => {
            return ajv.compileAsync(schema);
        })
        .then((validate) => {
            const result = validate(json);

            return {
                success: result,
                message: ajv.errorsText(validate.errors),
                errors: validate.errors,
            };
        });
};

const createAssertion = (validationResult, context, verbose = false) => {
    let placeholder;
    let detail;

    if (verbose) {
        placeholder = '#{this}';
        detail =
            ' -> errors:\n' +
            util.inspect(validationResult.errors, false, null);
    } else {
        placeholder = '#{this}';
        detail = ' -> ' + validationResult.message;
    }

    context.assert(
        validationResult.success,
        `expected ${placeholder} to match json-schema${detail}`,
        `expected ${placeholder} to not match json-schema`
    );
};

const isUrl = (path) => path.substr(0, 4) === 'http';

module.exports = (opts, chai) => ({
    // needs to be actual function for this to work
    compliesToSchema: function (path, basePath, useCache = true) {
        const schemaLoader = isUrl(basePath)
            ? remoteSchemaLoader(basePath, useCache ? opts.cache : null)
            : localSchemaLoader(basePath, opts.resources);
        const context = this;
        const json = chai.flag(context, 'object');

        return {
            end: (done) =>
                validateAgainstSchema(json, path, schemaLoader)
                    .then((result) => {
                        createAssertion(result, context, opts.verbose);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    }),
        };
    },
});
