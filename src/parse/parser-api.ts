import { Swagger, SwaggerFormat, SwaggerHttpEndpoint, SwaggerType } from '../types/swagger';
import { Config } from '../config/config';

function camelToDash(str: string): string {
  return str.replace(/([A-Z])/g, $1 => '-' + $1.toLowerCase());
}

function dashToCamel(str: string): string {
  return str
    .replace(/(\-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))
    .replace(/^[a-z]/, s => s.toUpperCase());
}

interface Schema {
  $ref?: string;
  type?: SwaggerType;
  format?: SwaggerFormat;
  items?: Schema;
}

export interface Parameter {

  name: string;
  in: 'path' | 'query' | 'body';
  required: boolean;
  description?: string;
  type?: string;
  schema?: Schema;
  maxLength?: number;
  minLength?: number;
}

export interface ParsedParameter {
  name: string;
  description: string;
  required: boolean;
  type: string;
}

export interface ParsedEndpoint {
  query: ParsedParameter[];
  body: ParsedParameter[];
  params: ParsedParameter[];
  response: any;
}

export interface ParsedApi {
  apiUrl: string;
  name: string;
  entityName: string;
  get: ParsedEndpoint;
  post: ParsedEndpoint;
  put: ParsedEndpoint;
  delete: ParsedEndpoint;
}

export class ParserApi {
  constructor(
    private config: Config,
  ) {
  }

  parse(swaggers: Swagger[]): ParsedApi[] {
    return swaggers.reduce((acc, el) => acc.concat(this.parseOne(el)), []);
  }

  /** @internal */
  parseOne(swagger: Swagger): ParsedApi[] {
    return Object.entries(swagger.paths).map(([path, api]) => {
      const apiUrl = path;
      const name = path.replace(this.config.ignorePrefix, '');
      const entityName = dashToCamel(name.split('/').pop());
      return {
        apiUrl,
        name,
        entityName,
        get: this.parseEndpoint(api.get),
        post: this.parseEndpoint(api.post),
        put: this.parseEndpoint(api.put),
        delete: this.parseEndpoint(api.delete),
      };
    });
  }

  parseEndpoint(endpoint: SwaggerHttpEndpoint): ParsedEndpoint | undefined {
    if (!endpoint) {
      return undefined;
    }

    try {
      const query = endpoint.parameters?.filter(p => p.in === 'query').map(this.parseParameter, this);
      const body = endpoint.parameters?.filter(p => p.in === 'body').map(this.parseParameter, this);
      const params = endpoint.parameters?.filter(p => p.in === 'path').map(this.parseParameter, this);
      const result = endpoint.responses['200'];
      const response = result['content']
        ? this.extractPropertySchema(result['content']['text/json'].schema)
        : 'void';

      return { query, body, response, params };
    } catch (e) {
      console.error(e);
    }
  }

  parseParameter(parameter: Parameter): ParsedParameter {
    try {
      return {
        name: parameter.name,
        description: parameter.description,
        required: parameter.required,
        type: this.extractPropertySchema(parameter.schema)
      };
    } catch (e) {
      console.error('Error while parsing parameter ', parameter);
      throw e;
    }
  }

  parseType(type: SwaggerType, format: SwaggerFormat, $ref: string): string {
    switch (type) {
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';

      case 'string':
        if (format === 'date-time') {
          return 'Date';
        }
        return 'string';

      default:
        return this.cleanRef($ref) || type;
    }
  }

  extractPropertySchema(schema: Schema): string {
    try {
      switch (schema.type) {
        case 'array':
          return schema.items?.$ref
            ? `${this.cleanRef(schema.items?.$ref)}[]`
            : `${this.parseType(schema.items.type, schema.items.format, schema.items.$ref)}[]`;
        case 'string':
        case 'integer':
        case 'number':
        case 'boolean':
          return this.parseType(schema.type, schema.format, schema.$ref);
        default:
          return schema.$ref ? this.cleanRef(schema.$ref) : 'any';
      }
    } catch (e) {
      console.error('Error while extractPropertyType schema ', schema);
      throw e;
    }

  }

  cleanRef($ref: string): string {
    if (!$ref) {
      throw new Error('No ref$ to clean');
    }
    return $ref
      .replace('#/definitions/', '')
      .replace('#/components/schemas/', '');
  }
}
