import * as github from "@actions/github";
import { ACTIONSFLOW_CURRENT_RUN_CREATED_AT } from "../constant";
import * as core from "@actions/core";
import getSecrets from "./secrets";
export default async function exportCurrentRunCreatedAtEnv(): Promise<{
  [ACTIONSFLOW_CURRENT_RUN_CREATED_AT]: number | undefined;
}> {
  const context = github.context;
  const secrets = getSecrets();
  const token = secrets.GITHUB_TOKEN;

  const octokit = github.getOctokit(token);
  const result = await octokit.actions.getWorkflowRun({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: context.runId,
  });
  let createAtTime: number | undefined;
  if (result && result.data && result.data.created_at) {
    const createAt = result.data.created_at;
    createAtTime = new Date(createAt).getTime();
    core.debug(
      `export env ${ACTIONSFLOW_CURRENT_RUN_CREATED_AT}: ${createAtTime}`
    );
    core.exportVariable(ACTIONSFLOW_CURRENT_RUN_CREATED_AT, createAtTime);
  }
  return {
    [ACTIONSFLOW_CURRENT_RUN_CREATED_AT]: createAtTime,
  };
}
