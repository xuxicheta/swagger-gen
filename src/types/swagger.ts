type Consumers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml' | 'application/x-www-form-urlencoded';
type Producers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml';

export interface SwaggerSchema {
  $ref?: string;
  type?: SwaggerType;
  format?: SwaggerFormat;
  items?: SwaggerSchema;
  properties?: SwaggerDefinitionProperties;
}

export type SwaggerDefinitions  = Record<string, SwaggerDefinition>;

export interface SwaggerDefinitionProperties {
  [propertyName: string]: SwaggerPropertyDefinition;
}

export interface SwaggerPath {
  get?: SwaggerHttpEndpoint;
  post?: SwaggerHttpEndpoint;
  put?: SwaggerHttpEndpoint;
  delete?: SwaggerHttpEndpoint;
}

export interface Swagger2 {
  swagger: string;
  info: {
    version: string;
    title: string;
    description: string;
  };
  host: string;
  basePath: string;
  schemes: string[];
  paths: Record<string, SwaggerPath>;
  definitions: SwaggerDefinitions;
}

export interface Swagger3 {
  openapi: string;
  info: {
    version: string;
    title: string;
    description: string;
  };
  servers: {
    url: string;
    description: string;
  }[];
  paths: {
    [endpointPath: string]: {
      get: SwaggerHttpEndpoint;
      post: SwaggerHttpEndpoint;
      put: SwaggerHttpEndpoint;
      delete: SwaggerHttpEndpoint;
    }
  };
  components: {
    schemas?: SwaggerDefinitions;
    responses?: SwaggerDefinitions;
    parameters?: SwaggerDefinitions;
    requestBodies?: SwaggerDefinitions;
    headers?: SwaggerDefinitions;
    links?: SwaggerDefinitions;
  };
}

export type AnySwagger = Swagger2 | Swagger3;

export interface SwaggerHttpEndpointParameter {
  name: string;
  in: 'path' | 'query' | 'body';
  required: boolean;
  description?: string;
  type?: string;
  schema?: SwaggerSchema;
  maxLength?: number;
  minLength?: number;
}

export interface SwaggerHttpEndpoint {
  tags: string[];
  summary?: string;
  operationId: string;
  consumes: Consumers[];
  produces: Producers[];
  parameters: SwaggerHttpEndpointParameter[];
  responses: {
    [httpStatusCode: string]: {
      description: string;
      schema: SwaggerSchema;
      content: Record<Producers, {
        schema: SwaggerSchema
      }>;
    }
  };
  deprecated: boolean;
}

export interface SwaggerDefinition extends SwaggerSchema {
  properties: SwaggerDefinitionProperties;
  description?: string;
  required?: (keyof SwaggerDefinitionProperties)[];
  allOf?: SwaggerDefinition[];
  enum?: string[];
}

export interface SwaggerPropertyDefinition extends SwaggerSchema {
  description?: string;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  format?: SwaggerFormat;
  pattern?: string;
  items?: SwaggerDefinition;
  readonly?: boolean;
  enum?: string[];
  type: SwaggerType;
  nullable?: boolean;
}

export type SwaggerType = 'integer' | 'number' | 'string' | 'boolean' | 'array';
export type SwaggerFormat = 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
