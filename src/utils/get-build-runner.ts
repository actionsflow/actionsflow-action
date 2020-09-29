import getYargsArgs from "./get-yargs-args";
import { getTriggerNameFromWebhokkPath } from "./path";
import {
  getContext,
  getWorkflows,
  getRawTriggers,
  getEventByContext,
  IWebhookRequest,
} from "actionsflow-core";
import { resolveTrigger } from "actionsflow";
export default async function getBuildRunner({
  using,
  args,
}: {
  using: string;
  args: string;
}): Promise<string> {
  if (using === "local") {
    return "local";
  } else if (using === "action") {
    return "action";
  } else {
    const params = getYargsArgs(args);
    const context = getContext();
    const triggerEvent = getEventByContext(context);
    // if webhook event type, if webhook, only check webhook trigger
    if (triggerEvent.type === "webhook") {
      const request = triggerEvent.request as IWebhookRequest;
      const webhookPath = request.path;
      const triggerName = getTriggerNameFromWebhokkPath(webhookPath);
      if (triggerName) {
        if (resolveTrigger(triggerName)) {
          return "action";
        } else {
          return "local";
        }
      } else {
        // skip , can not found a valid trigger name, exiting
        return "skip";
      }
      // get trigger name
    }
    // get all valid workflows
    const workflows = await getWorkflows({
      context,
      cwd: (params.cwd as string) || process.cwd(),
      include: (params.include as string[]) || undefined,
      exclude: (params.exclude as string[]) || undefined,
    });
    const isUsingLocalBuild = !workflows.every((workflow) => {
      const triggers = getRawTriggers(workflow.data);
      return triggers.every((trigger) => {
        if (
          trigger.options &&
          trigger.options.config &&
          trigger.options.config.active === false
        ) {
          return true;
        }
        if (resolveTrigger(trigger.name)) {
          return true;
        } else {
          return false;
        }
      });
    });
    if (isUsingLocalBuild) {
      return "local";
    } else {
      return "action";
    }
  }
}
