import { getEscapedArgs } from "../utils/get-escape-args";

test("get escaped args", () => {
  const escaped = getEscapedArgs("test");
  expect(escaped).toBe("test");
});
test("get escaped args2", () => {
  const escaped = getEscapedArgs(
    '{"value1":" test1","value2":" test2","value3":" test3"}'
  );
  expect(escaped).toBe(
    '\'{"value1":" test1","value2":" test2","value3":" test3"}\''
  );
});
test("get escaped args3", () => {
  const escaped = getEscapedArgs(
    '{"value1":" test1","value2":" test2","value3":" test3"}'
  );
  expect(escaped).toBe(escaped);
});
