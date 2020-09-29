import fs from "fs";
export const write = (path: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
};
export const read = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
