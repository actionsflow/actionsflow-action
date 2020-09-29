export const getTriggerNameFromWebhokkPath = (path: string): string => {
  const regex1 = /^\/(?:([^/]+?))\/(?:([^/]+?))\/.*/i;

  const regex2 = /^\/(?:([^/]+?))\/(?:([^/]+?))\/?$/i;
  const regexResult1 = path.match(regex1);
  const regexResult2 = path.match(regex2);
  if (regexResult1) {
    return regexResult1[2];
  }
  if (regexResult2) {
    return regexResult2[2];
  }
  return "";
};
