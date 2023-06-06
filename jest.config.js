// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  preset: 'ts-jest',
  rootDir: './src',
  setupFiles: ['<rootDir>/setup-tests.ts', 'dotenv/config'],
  // testEnvironment: "jest-environment-jsdom",
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost:3031'
  },
  collectCoverageFrom: ['!**/(*.)+(mock|test|spec).ts'],
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ]
};
