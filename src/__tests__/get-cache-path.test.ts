import getCachePath from "../utils/cache-path";
import { CACHE_PATH } from "actionsflow";
import exportBuildRunner from "../utils/export-build-runner";
import path from "path";
test("get cache path", () => {
  const cachePath = getCachePath();
  expect(cachePath).toBe(CACHE_PATH);
});

test("get cache below v1.3 path", async () => {
  await exportBuildRunner("local");
  const cwd = process.cwd();
  try {
    process.chdir(path.resolve(__dirname, "fixtures/below13"));
  } catch (err) {
    console.log("chdir: " + err);
  }
  const cachePath = getCachePath();
  try {
    process.chdir(cwd);
  } catch (err) {
    console.log("chdir: " + err);
  }
  expect(cachePath).toBe(".cache");
});
test("get cache gt v1.3 path", async () => {
  await exportBuildRunner("local");
  const cwd = process.cwd();
  try {
    process.chdir(path.resolve(__dirname, "fixtures/above13"));
  } catch (err) {
    console.log("chdir: " + err);
  }
  const cachePath = getCachePath();
  try {
    process.chdir(cwd);
  } catch (err) {
    console.log("chdir: " + err);
  }
  expect(cachePath).toBe(".actionsflow");
});
