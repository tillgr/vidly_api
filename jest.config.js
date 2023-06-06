// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  collectCoverage: false,
  clearMocks: true,
  resetMocks: true,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts', 'dotenv/config'],
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost:3031',
  },
  testPathIgnorePatterns: ['node_modules/'],
  testMatch: ['**/*.(mock|test|spec).(ts|js)'],
  modulePaths: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['src/utils/test/*'],
  coverageReporters: ['text'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
