import { run } from "../local-build";
import path from "path";
import fs from "fs";
import del from "del";
test("local build", async () => {
  const _tempGITHUB_ACTIONS = process.env.GITHUB_ACTIONS;
  process.env.GITHUB_ACTIONS = "false";
  await run("build --cwd ./src/__tests__/fixtures", {
    cwd: path.resolve(__dirname, "./fixtures"),
  });
  process.env.GITHUB_ACTIONS = _tempGITHUB_ACTIONS;
  expect(
    fs.existsSync(path.resolve(__dirname, "./fixtures/node_modules"))
  ).toBe(true);
  expect(
    fs.existsSync(path.resolve(__dirname, "./fixtures/dist/workflows"))
  ).toBe(true);
  // clean
  await del([
    path.resolve(__dirname, "./fixtures/node_modules"),
    path.resolve(__dirname, "./fixtures/dist"),
  ]);
});
