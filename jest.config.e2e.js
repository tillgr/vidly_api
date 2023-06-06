const config = require('./jest.config');
config.testMatch = [
  "**/?(*.)+(test).[tj]s?(x)"
];
config.collectCoverage = false;
module.exports = config;
