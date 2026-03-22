/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [],
  coverageDirectory: 'coverage',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
};
