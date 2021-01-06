import { run } from "../local-build";
import path from "path";
import fs from "fs";
import del from "del";
import { getEscapedArgs } from "../utils/get-escape-args";
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

test("local build webhook", async () => {
  const githubObj = {
    event: {
      action: "webhook",
      branch: "main",
      client_payload: {
        body: '{"value1":" test1","value2":" test2","value3":" test3"}',
        headers: {
          "accept-encoding": "gzip",
          "cf-connecting-ip": "54.152.172.220",
          "cf-ipcountry": "US",
          "cf-ray": "60d6a3b1ad7b283b",
          "cf-request-id": "077a04a3090000283bcf8a8000000001",
          "cf-visitor": '{"scheme":"https"}',
          connection: "Keep-Alive",
          "content-length": "55",
          "content-type": "application/json",
          host: "webhook.actionsflow.workers.dev",
          "x-forwarded-proto": "https",
          "x-newrelic-id": "VwAOU1RRGwAFUFZUAwQE",
          "x-newrelic-transaction":
            "PxRVAlFXC1UIBgVSUlRRVFUFFB8EBw8RVU4aAFsPAAFVXVsFAQRWBFYHA0NKQQkGUQZSBAcIFTs=",
          "x-real-ip": "54.152.172.220",
        },
        method: "POST",
        path: "/scuinfo_hot/webhook",
      },
    },
  };
  const _tempGITHUB_ACTIONS = process.env.GITHUB_ACTIONS;
  process.env.GITHUB_ACTIONS = "false";
  await run(
    `build --cwd ./src/__tests__/fixtures -i webhook.yml --json-github ${getEscapedArgs(
      JSON.stringify(githubObj)
    )}`,
    {
      cwd: path.resolve(__dirname, "./fixtures"),
    }
  );
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
