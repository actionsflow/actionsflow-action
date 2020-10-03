import { createCli } from "actionsflow";
import * as core from "@actions/core";
import restoreCache from "./utils/restore-cache";
import uploadCache from "./utils/upload-cache";
import uploadCacheKeyFile from "./utils/upload-cache-key-file";
import exportLastUpdateAtEnv from "./utils/export-last-update-at-env";
import exportLastCacheKeyEnv from "./utils/export-last-cache-key-env";
import getBuildRunner from "./utils/get-build-runner";
import { run as runLocal } from "./local-build";
import formatSpendTime from "./utils/format-spend-time";
import stringArgv from "string-argv";
import { ensureDirectoryExistence, write } from "./utils/file";
process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main() {
  const allStartTimeStamp = Date.now();
  core.debug(`cwd: ${process.cwd()}`);
  let args = core.getInput("args");
  const isDebug = core.isDebug();
  const using = core.getInput("using") || "auto";
  const jsonSecrets = core.getInput("json-secrets") || "";
  const jsonGithub = core.getInput("json-github") || "";

  if (!args) {
    args = "build";
  }
  if (args && isDebug) {
    args += " --verbose";
  }
  const argvs = stringArgv(args);
  core.debug(`use args: ${args}`);
  let isBuild = false;
  let isClean = false;
  if (argvs[0] && argvs[0].toLowerCase() === "build") {
    isBuild = true;
  } else if (argvs[0] && argvs[0].toLowerCase() === "clean") {
    isClean = true;
  }
  if (isBuild) {
    await exportLastUpdateAtEnv();
    await exportLastCacheKeyEnv();
    const timestamp = Date.now();
    await restoreCache();
    core.info(
      `Restore actionsflow cache complete (${formatSpendTime(
        Date.now() - timestamp
      )})`
    );
  } else if (isClean) {
    await exportLastUpdateAtEnv();
    await exportLastCacheKeyEnv();
  }

  try {
    if (isBuild) {
      const buildRunner = await getBuildRunner({
        using: using,
        args: args,
      });
      if (jsonSecrets) {
        const secretsObj = JSON.parse(jsonSecrets);
        args += ` --json-secrets ${JSON.stringify(secretsObj)}`;
      }
      if (jsonGithub) {
        const githubObj = JSON.parse(jsonGithub);
        args += ` --json-github ${JSON.stringify(githubObj)}`;
      }
      if (buildRunner === "action") {
        core.info("Use action actionsflow-action to build");
        const timestamp = Date.now();
        await createCli(args);
        core.info(
          `Run actionsflow complete (${formatSpendTime(
            Date.now() - timestamp
          )})`
        );
      } else if (buildRunner === "local") {
        core.info("Use local node modules actionsflow to build");
        // use local to build
        await runLocal(args);
      } else {
        core.info("Invalid trigger event, skip to build");
      }
    } else {
      core.info("Use action actionsflow-action");
      const timestamp = Date.now();
      // use action for other command
      await createCli(args);
      core.info(
        `Run actionsflow complete  (${formatSpendTime(Date.now() - timestamp)})`
      );
    }

    core.debug("Finish command: start to post task");
    if (isBuild) {
      let timestamp = Date.now();

      await uploadCache();
      core.info(
        `Upload actionsflow cache complete (${formatSpendTime(
          Date.now() - timestamp
        )})`
      );
      timestamp = Date.now();
      await uploadCacheKeyFile();
      core.info(
        `Upload actionsflow cache key complete (${formatSpendTime(
          Date.now() - timestamp
        )})`
      );
    } else if (isClean) {
      let timestamp = Date.now();
      // create empty .cache folder
      ensureDirectoryExistence(".cache");
      const emptyFilePath = ".cache/cachekeep.txt";
      await write(emptyFilePath, `${timestamp}`);
      await uploadCache();
      core.info(
        `Upload actionsflow empty cache complete (${formatSpendTime(
          Date.now() - timestamp
        )})`
      );
      timestamp = Date.now();
      await uploadCacheKeyFile();
      core.info(
        `Upload actionsflow cache key complete (${formatSpendTime(
          Date.now() - timestamp
        )})`
      );
    }

    core.setOutput("success", true);
  } catch (error) {
    core.debug("Finish command but error: start to post task");
    if (isBuild) {
      await uploadCacheKeyFile();
    }
    core.setOutput("success", false);
    throw error;
  }
  core.info(
    `Actionsflow done in ${formatSpendTime(Date.now() - allStartTimeStamp)}`
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  core.error(err);
  core.setFailed(`Actionsflow error: ${err}`);
}
