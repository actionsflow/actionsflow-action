import { ACTIONSFLOW_BUILD_RUNNTER } from "../constant";
import * as core from "@actions/core";
export default async function exportBuildRunner(
  runner: string
): Promise<{
  [ACTIONSFLOW_BUILD_RUNNTER]: string | undefined;
}> {
  core.debug(`export env ${ACTIONSFLOW_BUILD_RUNNTER}: ${runner}`);
  core.exportVariable(ACTIONSFLOW_BUILD_RUNNTER, runner);

  return {
    [ACTIONSFLOW_BUILD_RUNNTER]: runner,
  };
}
