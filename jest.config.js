module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [`__tests__/fixtures`, ".util.ts"],
  verbose: true,
  testTimeout: 100000,
  setupFiles: ["dotenv/config"],
  rootDir: "./src",
};
