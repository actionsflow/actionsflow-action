import hashFilesFn from "hash-files";

export const hashFiles = (files: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    hashFilesFn({ files }, (error: Error, hash: string) => {
      // hash will be a string if no error occurred
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });
};
