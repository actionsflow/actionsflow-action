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
  npmCacheKey: string;
  npmCacheKeyResult: string | undefined;
  isExactKeyMatch: boolean;
}> {
  const npmCachePath = getNpmCachePath();
  const paths = [npmCachePath];
  const hash = await hashFiles([NODE_MODULES_HASH_FILE_PATH]);
  const npmCacheKey = getNodeModulesCacheKeyPrefix() + hash;
  core.info(`Try to restore npm cache [${npmCacheKey}] to ${paths}`);
  core.exportVariable(ACTIONSFLOW_NODE_MODULES_CACHE_KEY, npmCacheKey);
  const restoreKeys = [getNodeModulesCacheKeyPrefix()];
  const npmCacheKeyResult = await cache.restoreCache(
    paths,
    npmCacheKey,
    restoreKeys
  );
  core.exportVariable(
    ACTIONSFLOW_NODE_MODULES_CACHE_RESULT_KEY,
    npmCacheKeyResult
  );
  const isExactKeyMatch = isExactKeyMatchFn(npmCacheKey, npmCacheKeyResult);

  // read
  if (!npmCacheKeyResult) {
    core.info(
      `Cannot found npm cache [${npmCacheKey}], skip to restore npm cache`
    );
  }
  return {
    npmCacheKey: npmCacheKey,
    npmCacheKeyResult: npmCacheKeyResult,
    isExactKeyMatch,
  };
}
