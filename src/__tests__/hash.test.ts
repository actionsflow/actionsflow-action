import { hashFiles } from "../utils/hash";

test("hash file", async () => {
  const hash = await hashFiles(["./src/__tests__/fixtures/hash1/**"]);
  expect(hash).toBe("a94a8fe5ccb19ba61c4c0873d391e987982fbbd3");
});

test("hash file2", async () => {
  const hash = await hashFiles(["./src/__tests__/fixtures/hash2/**"]);
  expect(hash).toBe("3ebfa301dc59196f18593c45e519287a23297589");
});
