import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getCacheKeyPrefix } from "./cache";
import {
  ACTIONSFLOW_LAST_CACHE_KEY,
  ACTIONSFLOW_CACHE_RESULT_KEY,
} from "../constant";
import getCachePath from "./cache-path";
export default async function restoreCache(): Promise<string | undefined> {
  if (process.env[ACTIONSFLOW_LAST_CACHE_KEY]) {
    const paths = [getCachePath()];
    const key = process.env[ACTIONSFLOW_LAST_CACHE_KEY] as string;
    core.info(`Try to restore actionsflow cache [${key}] to ${paths}`);
    const restoreKeys = [getCacheKeyPrefix()];
    const cacheKey = await cache.restoreCache(paths, key, restoreKeys);
    core.exportVariable(ACTIONSFLOW_CACHE_RESULT_KEY, cacheKey);
    // read
    if (!cacheKey) {
      core.info(`Cannot found cache [${key}], skip to restore`);
    }
    return cacheKey;
  } else {
    core.info(
      "Cannot get env ACTIONSFLOW_LAST_CACHE_KEY, skip to restore cache"
    );
    return undefined;
  }
}
