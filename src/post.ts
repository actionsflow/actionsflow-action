import * as core from "@actions/core";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main() {
  const success = core.getState("success");
  if (success === "false") {
    // error occured, need throw error
    core.setFailed(
      `Actionsflow run failed, please check error details at [Run Actionsflow] Step`
    );
  }
  // do nothing for now
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  core.error(err);
  core.setFailed(`Actionsflow error: ${err}`);
}
