import { getTriggerNameFromWebhokkPath } from "../utils/path";
test("getTriggerNameFromWebhokkPath", () => {
  const triggerName = getTriggerNameFromWebhokkPath("/test/test_1/test");
  expect(triggerName).toBe("test_1");
});

test("getTriggerNameFromWebhokkPath 2", () => {
  const triggerName = getTriggerNameFromWebhokkPath("/test/test_1");
  expect(triggerName).toBe("test_1");
});

test("getTriggerNameFromWebhokkPath 3", () => {
  const triggerName = getTriggerNameFromWebhokkPath("/test/test_1/");
  expect(triggerName).toBe("test_1");
});

test("getTriggerNameFromWebhokkPath 4", () => {
  const triggerName = getTriggerNameFromWebhokkPath(
    "/test/test_1/xxx/xxx/xxx/xxx/"
  );
  expect(triggerName).toBe("test_1");
});

test("getTriggerNameFromWebhokkPath 5", () => {
  const triggerName = getTriggerNameFromWebhokkPath("/test/");
  expect(triggerName).toBe("");
});
