const config = require('./jest.config');
config.testMatch = [
  "**/?(*.)+(spec).[tj]s?(x)"
];
config.collectCoverage = false;
module.exports = config;
