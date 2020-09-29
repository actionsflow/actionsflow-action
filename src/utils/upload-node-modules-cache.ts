import * as cache from "@actions/cache";
import * as core from "@actions/core";
import {
  getNodeModulesCacheExists,
  getNpmCachePath,
  getNodeModulesCacheKeyPrefix,
} from "./cache";
import { isExactKeyMatch } from "./match";
import { hashFiles } from "./hash";
import {
  ACTIONSFLOW_NODE_MODULES_CACHE_KEY,
  ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY,
  NODE_MODULES_HASH_FILE_PATH,
} from "../constant";
export default async function uploadNodeModulesCache(): Promise<
  number | undefined
> {
  const npmCachePath = getNpmCachePath();
  if (getNodeModulesCacheExists()) {
    // is already exist
    const paths = [`${npmCachePath}`];

    const cacheResultKey =
      process.env[ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY];
    const cacheKey = process.env[ACTIONSFLOW_NODE_MODULES_CACHE_KEY];
    const hash = await hashFiles([NODE_MODULES_HASH_FILE_PATH]);
    const key = getNodeModulesCacheKeyPrefix() + hash;

    if (!isExactKeyMatch(cacheKey as string, cacheResultKey)) {
      try {
        core.info(`Try to upload npm cache [${key}] from ${paths}`);
        const cacheId = await cache.saveCache(paths, key);
        if (!cacheId) {
          core.info(`Cannot save npm cache [${key}] at github`);
        }
        return cacheId;
      } catch (error) {
        if (error.name === cache.ValidationError.name) {
          throw error;
        } else if (error.name === cache.ReserveCacheError.name) {
          core.info(error.message);
        } else {
          core.warning(error.message);
        }
        return undefined;
      }
    } else {
      core.info(`Npm cache [${key}] is already exists, do not need to upload`);
      return undefined;
    }
  } else {
    core.info(
      `Can not found npm cache path ${npmCachePath}, skip to upload cache`
    );
    return undefined;
  }
}
