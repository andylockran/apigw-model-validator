import {Command, flags} from '@oclif/command'
import Ajv from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import {readFileSync} from 'fs'
import path from 'path'
import {load} from 'js-yaml'
import fs from 'fs'

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
    // flag with a value (-p, --path=VALUE)
    path: flags.string({char: 'p', description: 'The API path to validate against (if you do not know the model)'}),
    // flag with a value (-r, --requestMethod=VALUE)
    requestMethod: flags.string({char: 'r', description: 'The request method GET/POST to tests'}),
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
    if (flags.path) this.log(`--path is: ${flags.path}`)

    if (flags.path && flags.model) {
      this.error('Please only provide either path or model', {exit: 1})
    }

    await this.loadOpenAPISchema(flags.schema)

    await this.createValidator()
    await this.readPayload(args.payload)

    if (flags.model) {
      this.validateModel(flags.model)
    }
    if (flags.path) {
      this.validatePath(flags.path, flags.requestMethod)
    }
  }

  async loadOpenAPISchema(schema: any) {
    const openapifile: string = path.resolve(process.cwd(), schema)
    if (fs.existsSync(openapifile)) {
      this.openapi = load(readFileSync(openapifile, 'utf8'))
    } else {
      this.error('The OpenAPI file does not exist.', {exit: 1})
    }
  }

  async createValidator() {
    // Loads an OpenAPI Definition from the filepath
    addFormats(this.ajv)
    const schemaList = this.openapi.components.schemas
    for (const property in schemaList) {
      if (Object.prototype.hasOwnProperty.call(schemaList, property)) {
        const schema_model = schemaList[property]
        schema_model.id = `https://example.com/schema.json#/components/schemas/${property}`
        this.ajv.addSchema(schemaList[property])
      }
    }
  }

  async readPayload(payload: any) {
    const payloadfile = path.resolve(process.cwd(), payload)
    if (fs.existsSync(payloadfile)) {
      this.payload = load(readFileSync(payloadfile, 'utf8'))
    } else {
      this.error('Your payload file does not exist.', {exit: 1})
    }
  }

  async validateModel(model: any) {
    const schemaList = this.openapi.components.schemas
    this.validator = this.ajv.compile(schemaList[model])

    const answer = this.validator(this.payload)

    if (answer) {
      this.log('Payload passed validation')
    } else {
      this.log(this.validator.errors)
    }
  }

  async validatePath(path: any, requestMethod: any) {
    const urlPath = this.openapi.paths[path]
    const method = requestMethod.toLowerCase()
    const schemaDef = urlPath[method].requestBody.content['application/json'].schema.$ref.split('/')
    const model = schemaDef[schemaDef.length - 1]
    this.validateModel(model)
    return true
  }
}

export = ApigwModelValidator
