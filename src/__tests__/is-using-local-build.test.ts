import getBuildRunner from "../utils/get-build-runner";

test("is using local build with third party", async () => {
  const result = await getBuildRunner({
    using: "auto",
    args: "build --verbose --cwd ./src/__tests__/fixtures",
  });
  expect(result).toBe("local");
});

test("is using local build with internal trigger", async () => {
  const result = await getBuildRunner({
    using: "auto",
    args: "build --verbose --cwd ./src/__tests__/fixtures -i rss.yml",
  });

  expect(result).toBe("action");
});

test("is using local build with webhook trigger", async () => {
  // set github webhook event
  const githubEvent = {
    event_name: "repository_dispatch",
    event: {
      action: "webhook",
      client_payload: {
        path: "/test/slack",
      },
    },
  };
  process.env.JSON_GITHUB = JSON.stringify(githubEvent);
  const result = await getBuildRunner({
    using: "auto",
    args: "build --verbose --cwd ./src/__tests__/fixtures",
  });
  process.env.JSON_GITHUB = "";
  expect(result).toBe("action");
});
