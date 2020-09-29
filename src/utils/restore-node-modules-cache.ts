import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getNodeModulesCacheKeyPrefix, getNpmCachePath } from "./cache";
import { isExactKeyMatch as isExactKeyMatchFn } from "./match";
import {
  NODE_MODULES_HASH_FILE_PATH,
  ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY,
  ACTIONSFLOW_NODE_MODULES_CACHE_KEY,
} from "../constant";
import { hashFiles } from "./hash";

export default async function restoreNodeModulesCache(): Promise<{
  cacheKey: string | undefined;
  isExactKeyMatch: boolean;
}> {
  const npmCachePath = getNpmCachePath();
  const paths = [npmCachePath];
  const hash = await hashFiles([NODE_MODULES_HASH_FILE_PATH]);
  const key = getNodeModulesCacheKeyPrefix() + hash;
  core.info(`Try to restore npm cache [${key}] to ${paths}`);
  core.exportVariable(ACTIONSFLOW_NODE_MODULES_CACHE_KEY, key);
  const restoreKeys = [getNodeModulesCacheKeyPrefix()];
  const cacheKey = await cache.restoreCache(paths, key, restoreKeys);
  core.exportVariable(ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY, cacheKey);
  const isExactKeyMatch = isExactKeyMatchFn(key, cacheKey);

  // read
  if (!cacheKey) {
    core.info(`Cannot found npm cache [${key}], skip to restore npm cache`);
  }
  return {
    cacheKey,
    isExactKeyMatch,
  };
}
