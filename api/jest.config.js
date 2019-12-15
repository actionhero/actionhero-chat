module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testPathIgnorePatterns: ["<rootDir>/__tests__/utils"]
};
