import * as github from "@actions/github";
import {
  ACTIONSFLOW_WORKFLOW_FILE_NAME,
  ACTIONSFLOW_LAST_UPDATE_AT,
} from "../constant";
import * as core from "@actions/core";
import getSecrets from "./secrets";
export default async function exportLastUpdateAtEnv(): Promise<{
  [ACTIONSFLOW_LAST_UPDATE_AT]: number | undefined;
}> {
  const context = github.context;
  const secrets = getSecrets();
  const token = secrets.GITHUB_TOKEN;

  const octokit = github.getOctokit(token);
  const result = await octokit.actions.listWorkflowRuns({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: (ACTIONSFLOW_WORKFLOW_FILE_NAME as unknown) as number,
    per_page: 2,
  });
  let createAtTime: number | undefined;
  if (result && result.data && result.data.workflow_runs) {
    const workflow_runs = result.data.workflow_runs;
    if (workflow_runs[1] && workflow_runs[1].created_at) {
      const createAt = workflow_runs[1].created_at;
      createAtTime = new Date(createAt).getTime();
      core.debug(`export env ${ACTIONSFLOW_LAST_UPDATE_AT}: ${createAtTime}`);
      core.exportVariable(ACTIONSFLOW_LAST_UPDATE_AT, createAtTime);
    }
  }
  return {
    [ACTIONSFLOW_LAST_UPDATE_AT]: createAtTime,
  };
}
