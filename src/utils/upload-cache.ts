import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getCacheKeyPrefix, getCacheExists } from "./cache";
import { hashFiles } from "./hash";
import {
  CACHE_PATH,
  ACTIONSFLOW_LATEST_CACHE_KEY,
  ACTIONSFLOW_CACHE_RESULT_KEY,
} from "../constant";
export default async function uploadCache(): Promise<number | undefined> {
  if (getCacheExists()) {
    // is already exist
    const paths = [`${CACHE_PATH}`];
    const hash = await hashFiles([`${CACHE_PATH}/**`]);
    const key = getCacheKeyPrefix() + hash;
    const lastCacheKey = process.env[ACTIONSFLOW_CACHE_RESULT_KEY];
    if (lastCacheKey !== key) {
      try {
        core.debug(`Upload actionsflow cache [${key}] from ${paths}`);
        const cacheId = await cache.saveCache(paths, key);
        if (cacheId) {
          core.exportVariable(ACTIONSFLOW_LATEST_CACHE_KEY, key);
        } else {
          core.info(`Cannot save actionsflow cache [${key}] at github`);
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
      core.exportVariable(ACTIONSFLOW_LATEST_CACHE_KEY, key);
      core.info(
        `Actionsflow cache [${key}] is already exists, do not need to upload`
      );
      return undefined;
    }
  } else {
    core.info(
      `Cannot found actionsflow cache path ${CACHE_PATH}, skip to upload cache`
    );
    return undefined;
  }
}
