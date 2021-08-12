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
})
