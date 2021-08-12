apigw-model-validator
=====================

A simple tool for validation request payloads against AWS Api Definitions

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/apigw-model-validator.svg)](https://npmjs.org/package/apigw-model-validator)
[![Downloads/week](https://img.shields.io/npm/dw/apigw-model-validator.svg)](https://npmjs.org/package/apigw-model-validator)
[![License](https://img.shields.io/npm/l/apigw-model-validator.svg)](https://github.com/andylockran/apigw-model-validator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
apigw-model-validator is a tool for validating your payload against your AWS OpenAPI models.

It takes three arguments:

-s schema.yml (relative to your current path)
-m ModelName (the name of the model in your yml file you want to validate against)
payload.json (the path to your test payload).

Once run, you'll be able to see exactly why your payload failed to validate against AWS's basic OpenAPI validation; with clear logging explaining which property is missing.

```sh-session
$ npm install -g apigw-model-validator
$ apigw-model-validator -s path/to/openapi.yml -m ModelName path/to/payload.json
running command...
Payload passed validation

$ apigw-model-validator (-v|--version|version)
apigw-model-validator/0.0.1 darwin-x64 node-v12.18.3
$ apigw-model-validator --help [COMMAND]
USAGE
  $ apigw-model-validator -s path/to/openapi.yml -m ModelName path/to/payload.json
...
```
<!-- usagestop -->
