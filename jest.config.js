const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/*.test.+(ts|tsx|js)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/.*", "<rootDir>/lib/.*"],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/examples/",
    ".*\\.json$",
    "jest.config.js"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "../"
  })
};
