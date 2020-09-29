import {
  ACTIONSFLOW_LATEST_CACHE_KEY,
  ARTIFACTS_NAME_PREFIX_FOR_CACHE_KEY,
  ACTIONSFLOW_LAST_CACHE_KEY,
} from "../constant";
import { write } from "./file";
import * as artifact from "@actions/artifact";
import * as core from "@actions/core";
import { getCacheKeyFilePath } from "./cache";

export default async function uploadCacheKeyFile(): Promise<
  artifact.UploadResponse | undefined
> {
  if (
    process.env[ACTIONSFLOW_LATEST_CACHE_KEY] ||
    process.env[ACTIONSFLOW_LAST_CACHE_KEY]
  ) {
    const actionsflowLatestCacheKey =
      process.env[ACTIONSFLOW_LATEST_CACHE_KEY] ||
      (process.env[ACTIONSFLOW_LAST_CACHE_KEY] as string);
    const artifactClient = artifact.create();
    const artifactName =
      ARTIFACTS_NAME_PREFIX_FOR_CACHE_KEY + actionsflowLatestCacheKey;
    const cacheKeyFilePath = getCacheKeyFilePath();
    // save file
    await write(cacheKeyFilePath, actionsflowLatestCacheKey);
    const files = [cacheKeyFilePath];
    const rootDirectory = process.cwd(); // Also possible to use __dirname
    const options = {
      continueOnError: true,
    };

    const uploadResponse = await artifactClient.uploadArtifact(
      artifactName,
      files,
      rootDirectory,
      options
    );

    core.debug(
      `upload actionsflow cache key file success, response: ${JSON.stringify(
        uploadResponse,
        null,
        2
      )}`
    );

    return uploadResponse;
  } else {
    core.info(
      `Can not found env ACTIONSFLOW_LATEST_CACHE_KEY or ACTIONSFLOW_LAST_CACHE_KEY, skip to upload actionsflow cache key file`
    );
    return undefined;
  }
}
