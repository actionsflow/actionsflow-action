import * as core from "@actions/core";
export default function getSecrets(): Record<string, string> {
  const jsonSecrets = core.getInput("json-secrets") || "";
  const githubToken = core.getInput("github-token") || "";
  const secretJson = jsonSecrets || process.env.JSON_SECRETS || "{}";
  const secrets = JSON.parse(secretJson) as Record<string, string>;
  if (!secrets.GITHUB_TOKEN) {
    secrets.GITHUB_TOKEN =
      githubToken || (process.env.GITHUB_TOKEN as string) || "";
  }
  return secrets;
}
