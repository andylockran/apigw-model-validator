import {Command, flags} from '@oclif/command'
import Ajv from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import {readFileSync} from 'fs'
import path from 'path'
import {load} from 'js-yaml'

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
  }

  static args = [{name: 'payload'}]

  openapi: any | undefined

  schemas: any | undefined

  payload: any | undefined

  validator: any | undefined

  ajv = new Ajv({
    strict: false,
  });

  async run() {
    const {args, flags} = this.parse(ApigwModelValidator)
    if (flags.schema) this.log(`--schema is: ${flags.schema}`)
    if (flags.model) this.log(`--model is: ${flags.model}`)

    await this.loadOpenAPIDefs(flags.schema)
    await this.createValidator(flags.model)
    await this.readPayload(args.payload)
    // console.log(this.ajv.schemas)
    // this.log(this.validator)
    const answer = this.validator(this.payload)
    if (answer) {
      this.log('Payload passed validation')
    } else {
      this.log(this.validator.errors)
    }
  }

  async loadOpenAPIDefs(schema: any) {
    this.openapi = load(readFileSync(path.resolve(process.cwd(), schema), 'utf8'))
  }

  async createValidator(model: any) {
    // Loads an OpenAPI Definition from the filepath
    addFormats(this.ajv)
    const schemaList = this.openapi.components.schemas
    for (const property in schemaList) {
      // this.log(`${property}: ${schemaList[property]}`)
      const schema_model = schemaList[property]
      schema_model.id = `https://example.com/schema.json#/components/schemas/${property}`
      this.ajv.addSchema(schemaList[property])
    }

    this.validator = this.ajv.compile(schemaList[model])
  }

  async readPayload(payload: any) {
    this.payload = load(readFileSync(path.resolve(process.cwd(), payload), 'utf8'))
  }
}

export = ApigwModelValidator
