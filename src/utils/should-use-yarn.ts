import fs from "fs";

export const shouldUseYarn = (): boolean => {
  const useYarn = fs.existsSync(`yarn.lock`);
  return useYarn;
};
