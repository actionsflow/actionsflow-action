# Actionsflow Action

[Actionsflow](https://github.com/actionsflow/actionsflow) action for Github. With `actionsflow/actionsflow-action@v1`, you can speed up your Actionsflow workflow build. We will automatically select the best build strategy, using local build or action build, if you use a third-party trigger, then the default will use local build, that is, install npm dependencies, and use local actionsflow to build, if You only use the official triggers, then we will only use the action to build, no need to download anything.

All build strategies will use caching, so even if you use third-party triggers, we will cache node_modules to speed up the build.

Of course, you can specify the build method, such as using only local build, or only using action build.

You can also specify the commands and parameters of the build through `args`

## Inputs

```yaml
inputs:
  using:
    descript: "actionsflow build runner using, the default value is `auto`, you can also use `local`, `action`"
    required: false
    default: "auto"
  args:
    description: "actionsflow CLI command, the default value is `build`, you can specify it like `build --verbose`"
    required: false
    default: "build"
  json-secrets:
    description: secrets context in json format
    required: false
    default: ""
  json-github:
    description: github context in json format
    required: false
    default: ""
```

## Options

### `using`

Actionsflow build runner using, the default value is `auto`, you can also use `local`, `action`

### `args`

Actionsflow CLI command, the default value is `build`, you can specify it like `build --verbose`

Learn more about `args`, please see [here](https://actionsflow.github.io/docs/reference/cli/)

### `json-secrets`

Secrets context in json format, you should always use `${{ toJSON(secrets) }}`

### `json-github`

github context in json format, you should always use `${{ toJSON(github) }}`

## Outputs

```yaml
outputs:
  success:
    description: "If the build status is a success. The value can be 'true', or 'false', if the build failed, the action outcome will be set failed"
```

## Example usage

```yaml
uses: actionsflow/actionsflow-action@v1
with:
  args: build
  json-secrets: ${{ toJSON(secrets) }}
  json-github: ${{ toJSON(github) }}
```
