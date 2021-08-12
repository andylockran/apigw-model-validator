import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('apigw-model-validator', () => {
  test
  .stdout()
  .do(() => cmd.run(['--schema', '../schema/ser.yml']))
  .it('runs hello --schema ../schema/ser.yml', ctx => {
    expect(ctx.stdout).to.contain('validate')
  })
})
