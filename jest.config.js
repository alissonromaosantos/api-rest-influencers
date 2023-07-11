/** @type {import('jest').Config} */
const config = {
  verbose: true,
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node"
};

module.exports = config;
