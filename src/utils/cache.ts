import {
  ACTIONSFLOW_CACHE_KEY_PREFIX,
  ACTIONSFLOW_CACHE_KEY_FILE_NAME,
  ACTIONSFLOW_NODE_MODULES_CACHE_KEY_PREFIX,
} from "../constant";
import fs from "fs";
import path from "path";
import getCachePath from "./cache-path";
export const getCacheKeyPrefix = (): string => {
  return `${ACTIONSFLOW_CACHE_KEY_PREFIX}-${process.platform}-`;
};
export const getNodeModulesCacheKeyPrefix = (): string => {
  return `${ACTIONSFLOW_NODE_MODULES_CACHE_KEY_PREFIX}-${process.platform}-`;
};

export const getCacheExists = (): boolean => {
  return fs.existsSync(getCachePath());
};

export const getCacheKeyFilePath = (): string => {
  return path.resolve(process.cwd(), ACTIONSFLOW_CACHE_KEY_FILE_NAME);
};

export const getNpmCachePath = (): string => {
  // for mac / linux
  const cachePath = path.resolve(process.env.HOME as string, ".npm");
  return cachePath;
};
export const getNodeModulesCacheExists = (): boolean => {
  return fs.existsSync(getNpmCachePath());
};
