import {Command, flags} from '@oclif/command'
import Ajv from 'ajv-draft-04'
import {readFileSync} from 'fs'
import path from 'path'
import {load} from 'js-yaml'
import { strict } from 'assert'

class ApigwModelValidator extends Command {
  static description = 'Validate your json object against an OpenAPI definition'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-s, --schema=VALUE)
    schema: flags.string({char: 's', description: 'path to openapi definition'}),
    // flag with a value (-m, --model=VALUE)
    model: flags.string({char: 'm', description: 'model to validate your payload against'}),
    // flag with a value (-p, --payload=VALUE)
    payload: flags.string({char: 'p', description: 'payload to validate against the model'}),
  }

  static args = [{name: 'file'}]

  openapi: any | undefined

  schemas: any | undefined

  payload: any | undefined

  validator: any | undefined

  ajv = new Ajv({
    strict: false
  });

  async run() {
    const {flags} = this.parse(ApigwModelValidator)
    if (flags.schema) console.log(`--schema is: ${flags.schema}`)
    if (flags.model) console.log(`--model is: ${flags.model}`)
    if (flags.payload) console.log(`--payload is set`)

     this.createValidator(flags.schema, flags.model)

     if (this.validator(flags.payload)) this.log(this.validator.errors)
  }

  async createValidator(schema: any, model: any) {
    // Loads an OpenAPI Definition from the filepath
    const openapi = load(readFileSync(path.resolve(__dirname, schema), 'utf8'))
    this.openapi = openapi
    this.schemas = this.openapi.components.schemas
    this.validator = this.ajv.compile(this.openapi)
  }
  async readPayload(payload: any) {
    this.payload = load(readFileSync(path.resolve(__dirname, payload), 'utf8'))
  }
}

export = ApigwModelValidator