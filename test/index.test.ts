import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('apigw-model-validator', () => {
  test
  .stdout()
  .do(() => cmd.run(['-s', 'schema/example.yaml', '--model', 'Pet', 'examples/good-payload.json']))
  .it('runs -s schema/example.yaml -m Pet examples/good-payload.json', ctx => {
    expect(ctx.stdout).to.contain('Payload passed validation')
  })
  test
  .stdout()
  .do(() => cmd.run(['-s', 'schema/example.yaml', '--model', 'Pet', 'examples/bad-payload.json']))
  .it('runs -s schema/example.yaml -m Pet examples/bad-payload.json', ctx => {
    expect(ctx.stdout).to.contain('integer')
  })
  test
  .stderr()
  .do(() => cmd.run(['-s', 'schema/example.yaml', '--model', 'Pet', 'examples/does-not-exist-payload.json']))
  .exit(1)
  .it('exits with status 1 if payload is not provided')
  test
  .stdout()
  .do(() => cmd.run(['-s', 'schema/example.yaml', '--model', 'Pet', '--path', '/test', 'examples/bad-payload.json']))
  .exit(1)
  .it('exits with status 1 if both path and model are set')
  test
  .stdout()
  .do(() => cmd.run(['-s', 'schema/not-exist.yaml', '--model', 'Pet', 'examples/bad-payload.json']))
  .exit(1)
  .it('exits with status 1 if the schema does not exist')
})
