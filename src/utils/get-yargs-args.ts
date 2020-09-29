// import yargs from "yargs";
// import { buildCommandBuilder } from "actionsflow";
import stringArgv from "string-argv";
import commandLineArgs from "command-line-args";
export default function getArgs(args: string): Record<string, unknown> {
  const optionDefinitions = [
    { name: "include", alias: "i", type: String, multiple: true },
    { name: "exclude", type: String, multiple: true },
    { name: "cwd", type: String },
    { name: "json-secrets", type: String },
  ];
  const argv = stringArgv(args);
  const options = commandLineArgs(optionDefinitions, {
    argv,
    partial: true,
    camelCase: true,
  });
  return options;
}
