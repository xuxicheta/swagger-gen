
// @ts-check
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import * as mustache from 'mustache';
import { resolve } from 'path';
import { argv } from 'yargs';
import { consoleHelp } from './help';
import { mkDirModels } from './mkdir';
import { requestSwaggerObject } from './request-json';
import { Swagger, SwaggerPropertyDefinition, SwaggerType } from './swagger';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
config();
const customTags = ['<<<', '>>>'];
(mustache.tags as any) = customTags;

const DIRS_DEFAULT = 'models';
const MODEL_TEMPLATE = 'mustache/model.mustache'


export class SwaggerGen {
  private swaggerObject: Swagger;
  private dir: string;
  private url: string;

  public run() {
    this.dir = argv.dir as string || DIRS_DEFAULT;
    this.url = argv.url as string || process.env[argv.env as string];
    this.lookAtArgument();
  }

  private async lookAtArgument() {
    if (argv.help) {
      consoleHelp();
      return;
    }

    if (!this.url) {
      throw new Error('url not found in environment');
    }

    this.swaggerObject = await requestSwaggerObject(this.url);
    const existedDir = mkDirModels(this.dir);
    this.makeInterfaces(this.swaggerObject, existedDir);
  }

  private makeInterfaces(swaggerObject: Swagger, dir: string) {
    const interfaceTemplate = readFileSync(MODEL_TEMPLATE).toString();
    mustache.parse(interfaceTemplate);

    Object.entries(swaggerObject.definitions).forEach(([name, definition]) => {
      const properties = Object.entries(definition.properties).map(([name, property]) => {
        return {
          name,
          description: property.description,
          type: this.extractPropertyType(property),
        }
      });
      const imports = Object.values(definition.properties)
        .map(property => this.extractImport(name, property))
        .filter(Boolean);

      const data = {
        description: definition.description,
        interfaceName: name,
        properties,
        imports,
      }
      const result = mustache.render(interfaceTemplate, data);
      const fileName = resolve(dir, `${name}.ts`);
      writeFileSync(fileName, result);
    })
  }

  private extractPropertyType(property: SwaggerPropertyDefinition): string {
    switch (property.type) {
      case 'array':
        // property.items
        if (property.items.$ref) {
          const $ref = property.items.$ref;
          const type = $ref.replace('#/definitions/', '') + '[]'
          return type;
        } else {
          return `${this.parseType(property.items.type)}[]`
        }
      default: return this.parseType(property.type);
    }
  }

  private parseType(type: SwaggerType | string): string {
    switch (type) {
      case 'integer': return 'number';
      default:
        if (!type) {
          debugger;
        }
        return type;
    }
  }

  private extractImport(name: string, property: SwaggerPropertyDefinition) {
    if (property.type === 'array' && property.items.$ref) {
      const importedName = property.items.$ref.replace('#/definitions/', '');

      if (name !== importedName) {
        return { importedName };
      }
    }
    return undefined;
  }
}
