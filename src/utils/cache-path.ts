import { CACHE_PATH } from "actionsflow";
import { ACTIONSFLOW_BUILD_RUNNTER } from "../constant";
import resolveCwd from "resolve-cwd";
import semver from "semver";
import * as core from "@actions/core";

export default function getCachePath(): string {
  let cachePath = CACHE_PATH;
  if (process.env[ACTIONSFLOW_BUILD_RUNNTER] === "action") {
    return cachePath;
  } else {
    const packageJsonLockPath = resolveCwd.silent("./package-lock.json");
    if (packageJsonLockPath) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const packageInfo = require(packageJsonLockPath);
      if (packageInfo) {
        let actionsflowVersion = "";
        if (packageInfo.dependencies && packageInfo.dependencies.actionsflow) {
          actionsflowVersion = packageInfo.dependencies.actionsflow.version;
          core.debug(`actionsflow version: ${actionsflowVersion}`);
          const isGt13 = semver.gt(actionsflowVersion, "1.3.1");
          if (!isGt13) {
            cachePath = ".cache";
          }
        }
      }
    }
    return cachePath;
  }
}
