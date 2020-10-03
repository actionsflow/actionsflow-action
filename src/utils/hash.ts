import hashFilesFn from "hash-files";
import * as core from "@actions/core";
export const hashFiles = (files: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    core.debug(`hash files: ${files}`);
    hashFilesFn({ files }, (error: Error, hash: string) => {
      // hash will be a string if no error occurred
      if (error) {
        reject(error);
      } else {
        core.debug(`hash result: ${hash}`);
        resolve(hash);
      }
    });
  });
};
