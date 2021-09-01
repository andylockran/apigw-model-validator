apigw-model-validator
=====================

A simple tool for validation request payloads against AWS Api Definitions

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/apigw-model-validator.svg)](https://npmjs.org/package/apigw-model-validator)
[![Downloads/week](https://img.shields.io/npm/dw/apigw-model-validator.svg)](https://npmjs.org/package/apigw-model-validator)
[![License](https://img.shields.io/npm/l/apigw-model-validator.svg)](https://github.com/andylockran/apigw-model-validator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g apigw-model-validator
$ apigw-model-validator COMMAND
running command...
$ apigw-model-validator (-v|--version|version)
apigw-model-validator/1.0.0 darwin-x64 node-v12.18.3
$ apigw-model-validator --help [COMMAND]
USAGE
  $ apigw-model-validator COMMAND
...
```

```
const AMV = require('apigw-model-validator')
const validator = new AMV()

validator.isPayloadValid({
  model: 'UserDetails',
  payload: {
    username: 'Joe Bloggs'
  },
  schema: './user.yml'
})
  .then(() => {
    console.log('Payload is valid)
  })
  .catch(err => {
    console.error('Payload is invalid, err)
  })

validator.isPayloadValid({
  path: '/app/use-details',
  payload: {
    username: 'Joe Bloggs'
  },
  requestMethod: 'POST',
  schema: './user.yml'
})
  .then(() => {
    console.log('Payload is valid)
  })
  .catch(err => {
    console.error('Payload is invalid, err)
  })
```
<!-- usagestop -->
