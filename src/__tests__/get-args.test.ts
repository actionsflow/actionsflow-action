import getArgs from "../utils/get-yargs-args";

test("get args", () => {
  expect(getArgs("--verbose --cwd ./test --json-secrets {}")).toEqual({
    _unknown: ["--verbose"],
    cwd: "./test",
    jsonSecrets: "{}",
  });
});
