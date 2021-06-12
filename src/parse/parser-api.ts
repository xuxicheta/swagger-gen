import { AnySwagger, SwaggerFormat, SwaggerHttpEndpoint, SwaggerHttpEndpointParameter, SwaggerPath, SwaggerSchema, SwaggerType } from '../types/swagger';
import { Config } from '../config/config';
import { dashToCamel } from '../tools/dash-to-camel';

export interface ParsedParameter {
  name: string;
  description: string | undefined;
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

  parse(swaggers: AnySwagger[]): ParsedApi[] {
    return swaggers.reduce<ParsedApi[]>(
      (acc, el) => acc.concat(this.parseOne(el.paths)),
      [],
    );
  }

  /** @internal */
  parseOne(paths: Record<string, SwaggerPath>|undefined): ParsedApi[] {
    if (!paths) {
      return [];
    }
    return Object.entries(paths).map(([pathName, api]) => {
      const apiUrl = pathName;
      const name = pathName.replace(this.config.ignorePrefix, '');
      const entityName = dashToCamel(name.split('/').pop());
      return {
        apiUrl,
        name,
        entityName,
        get: this.parseEndpoint(api.get),
        post: this.parseEndpoint(api.post),
        put: this.parseEndpoint(api.put),
        delete: this.parseEndpoint(api.delete),
      } as ParsedApi;
    });
  }

  parseEndpoint(endpoint: SwaggerHttpEndpoint | undefined): ParsedEndpoint | undefined {
    if (!endpoint) {
      return undefined;
    }

    try {
      const query = endpoint.parameters?.filter(p => p.in === 'query').map(this.parseParameter, this);
      const body = endpoint.parameters?.filter(p => p.in === 'body').map(this.parseParameter, this);
      const params = endpoint.parameters?.filter(p => p.in === 'path').map(this.parseParameter, this);
      const result = endpoint.responses['200'];

      const response = result.content
        ? this.extractPropertySchema(result.content['text/json'].schema)
        : 'void';

      return { query, body, response, params };
    } catch (e) {
      console.error(e);
    }
  }

  parseParameter(parameter: SwaggerHttpEndpointParameter): ParsedParameter {
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

  parseType(
    type: SwaggerType | undefined,
    format: SwaggerFormat | undefined,
    $ref: string | undefined,
  ): string {
    switch (type) {
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'string':
        return (() => {
          if (format === 'date-time') {
            return 'Date';
          }
          return 'string';
        })();

      default:
        return this.cleanRef($ref) || type || '';
    }
  }

  extractPropertySchema(schema?: SwaggerSchema): string {
    try {
      switch (schema?.type) {
        case 'array':
          return schema.items?.$ref
            ? `${this.cleanRef(schema.items?.$ref)}[]`
            : `${this.parseType(schema.items?.type, schema.items?.format, schema.items?.$ref)}[]`;
        case 'string':
        case 'integer':
        case 'number':
        case 'boolean':
          return this.parseType(schema.type, schema.format, schema.$ref);
        default:
          return schema?.$ref ? this.cleanRef(schema.$ref) : 'any';
      }
    } catch (e) {
      console.error('Error while extractPropertyType schema ', schema);
      throw e;
    }
  }

  cleanRef($ref: string | undefined): string {
    if (!$ref) {
      throw new Error('No ref$ to clean');
    }
    return $ref
      .replace('#/definitions/', '')
      .replace('#/components/schemas/', '');
  }
}
