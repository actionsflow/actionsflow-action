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

    const npmCacheResultKey =
      process.env[ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY];
    const npmCacheKey = process.env[ACTIONSFLOW_NODE_MODULES_CACHE_KEY];

    if (!isExactKeyMatch(npmCacheKey as string, npmCacheResultKey)) {
      const hash = await hashFiles([NODE_MODULES_HASH_FILE_PATH]);
      const npmLatestCacheKey = getNodeModulesCacheKeyPrefix() + hash;
      const finalCacheKey = npmCacheKey || npmLatestCacheKey;
      try {
        core.info(`Try to upload npm cache [${finalCacheKey}] from ${paths}`);
        const cacheId = await cache.saveCache(paths, finalCacheKey);
        if (!cacheId) {
          core.info(`Cannot save npm cache [${finalCacheKey}] at github`);
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
      core.info(
        `Npm cache [${npmCacheKey}] is already exists, do not need to upload`
      );
      return undefined;
    }
  } else {
    core.info(
      `Can not found npm cache path ${npmCachePath}, skip to upload cache`
    );
    return undefined;
  }
}
