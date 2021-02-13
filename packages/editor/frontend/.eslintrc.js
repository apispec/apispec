const { join } = require('path');
const neutrino = require('neutrino');

module.exports = neutrino(require(join(__dirname, '.neutrinorc.js'))).eslintrc();
