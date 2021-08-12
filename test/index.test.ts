import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('apigw-model-validator', () => {
  test
  .stdout()
  .do(() => cmd.run(['-s', 'schema/example.yaml', '--model', 'Pet', 'payload.json']))
  .it('runs -s schema/example.yaml -m Pet payload.json', ctx => {
    expect(ctx.stdout).to.contain('Payload passed validation')
  })
})
