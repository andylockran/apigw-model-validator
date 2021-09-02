import {Command, flags} from '@oclif/command'
import Ajv from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import {readFileSync} from 'fs'
import path from 'path'
import {load} from 'js-yaml'
import fs from 'fs'

interface IsPayloadValidBaseOptions {
  payload: any | any[] | string;
  schema: string;
}

interface IsPayloadValidByModelOptions extends IsPayloadValidBaseOptions {
  model: string;
}

interface IsPayloadValidByPathOptions extends IsPayloadValidBaseOptions {
  path: string;
  requestMethod: string;
}

type IsPayloadValidOptions = IsPayloadValidByModelOptions | IsPayloadValidByPathOptions;

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

  async isPayloadValid(options: IsPayloadValidOptions) {
    if ((options as IsPayloadValidByModelOptions).model) {
      return this.isPayloadValidByModel(options as IsPayloadValidByModelOptions)
    }

    if ((options as IsPayloadValidByPathOptions).path) {
      return this.isPayloadValidByPath(options as IsPayloadValidByPathOptions)
    }

    throw new Error('Either model or path must be provided')
  }

  private async isPayloadValidByModel(options: IsPayloadValidByModelOptions) {
    const {
      model,
      payload,
      schema,
    } = options

    if (!model) {
      throw new Error('A model must be provided')
    }

    if (!payload) {
      throw new Error('A payload must be provided')
    }

    if (!schema) {
      throw new Error('A schema must be provided')
    }

    await this.loadOpenAPISchema(schema)

    await this.createValidator()
    await this.readPayload(payload)
    const answer = await this.validateModel(model)

    if (answer) {
      this.reset()

      return []
    }

    const errors = this.validator.errors

    this.reset()

    throw errors
  }

  private async isPayloadValidByPath(options: IsPayloadValidByPathOptions) {
    const {
      path,
      payload,
      requestMethod,
      schema,
    } = options

    if (!path) {
      throw new Error('A path must be provided')
    }

    if (!payload) {
      throw new Error('A payload must be provided')
    }

    if (!schema) {
      throw new Error('A schema must be provided')
    }

    if (path && !requestMethod) {
      throw new Error('A requestMethodmust be provided')
    }

    await this.loadOpenAPISchema(schema)

    await this.createValidator()
    await this.readPayload(payload)
    const answer = await this.validatePath(path, requestMethod)

    if (answer) {
      this.reset()

      return []
    }

    const errors = this.validator.errors

    this.reset()

    throw errors
  }

  private reset() {
    this.ajv = new Ajv({
      strict: false,
    })
    this.payload = undefined
    this.validator = undefined
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
    if (typeof payload === 'object') {
      this.payload = payload
      return
    }

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

    return answer
  }

  async validatePath(path: any, requestMethod: any) {
    const urlPath = this.openapi.paths[path]
    const method = requestMethod.toLowerCase()
    const schemaDef = urlPath[method].requestBody.content['application/json'].schema.$ref.split('/')
    const model = schemaDef[schemaDef.length - 1]
    return this.validateModel(model)
  }
}

export = ApigwModelValidator
