import * as github from "@actions/github";
import {
  ARTIFACTS_NAME_PREFIX_FOR_CACHE_KEY,
  ACTIONSFLOW_LAST_CACHE_KEY,
} from "../constant";
import * as core from "@actions/core";
import getSecrets from "./secrets";
export default async function exportLastCacheKeyEnv(): Promise<{
  ACTIONSFLOW_LAST_CACHE_KEY: string;
}> {
  const context = github.context;
  const secrets = getSecrets();
  const token = secrets.GITHUB_TOKEN;

  const octokit = github.getOctokit(token);
  let cacheKey = "";
  const result = await octokit.actions.listArtifactsForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  if (result && result.data && result.data.artifacts) {
    const artifacts = result.data.artifacts;
    for (let i = 0; i < artifacts.length; i++) {
      const name = artifacts[i].name;
      if (name.startsWith(ARTIFACTS_NAME_PREFIX_FOR_CACHE_KEY)) {
        cacheKey = name.slice(ARTIFACTS_NAME_PREFIX_FOR_CACHE_KEY.length);
        break;
      }
    }
  }

  if (cacheKey) {
    core.debug(`export env ${ACTIONSFLOW_LAST_CACHE_KEY}: ${cacheKey}`);
    core.exportVariable(ACTIONSFLOW_LAST_CACHE_KEY, cacheKey);
  }
  return {
    [ACTIONSFLOW_LAST_CACHE_KEY]: cacheKey,
  };
}
