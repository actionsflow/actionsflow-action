import * as exec from "@actions/exec";
import restoreNodeModulesCache from "./utils/restore-node-modules-cache";
import uploadNodeModulesCache from "./utils/upload-node-modules-cache";
import * as core from "@actions/core";
import formatSpendTime from "./utils/format-spend-time";
import stringArgv from "string-argv";

export const install = async (options?: { cwd: string }): Promise<void> => {
  const installOptions = {
    silent: true,
    ...options,
    listeners: {},
  };
  let myError = "";
  installOptions.listeners = {
    stderr: (data: Buffer) => {
      myError += data.toString();
      core.info(myError);
    },
  };
  await exec.exec("npm", ["install"], installOptions);
};

export const run = async (
  args: string,
  options?: {
    cwd: string;
  }
): Promise<void> => {
  // load cache
  if (process.env.GITHUB_ACTIONS === "true") {
    const timestamp = Date.now();
    await restoreNodeModulesCache();
    core.info(
      `Restore npm cache complete  (${formatSpendTime(Date.now() - timestamp)})`
    );
  }
  let timestamp = Date.now();
  await install(options);
  core.info(
    `Install node moduels complete  (${formatSpendTime(
      Date.now() - timestamp
    )})`
  );
  timestamp = Date.now();
  await exec.exec(`npx`, ["actionsflow", ...stringArgv(args)], {
    failOnStdErr: true,
  });
  core.info(
    `Run actionsflow complete  (${formatSpendTime(Date.now() - timestamp)})`
  );

  if (process.env.GITHUB_ACTIONS === "true") {
    timestamp = Date.now();
    await uploadNodeModulesCache();
    core.info(
      `Upload node modules cache complete (${formatSpendTime(
        Date.now() - timestamp
      )})`
    );
  }
};
