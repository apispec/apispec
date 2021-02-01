const migrate = require("json-schema-migrate")
const schema = require("../editor/dev/cache/schemas/raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v3.0/schema.json")
migrate.draft7(schema)
// or migrate.draft2019(schema)

console.log(JSON.stringify(schema))
