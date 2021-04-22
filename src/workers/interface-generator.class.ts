import { Output } from 'src/utility/output.class';
import { Swagger, SwaggerDefinition, SwaggerDefinitions, SwaggerFormat, SwaggerPropertyDefinition, SwaggerType } from '../types/swagger';
import { Templater } from './templater.class';

export interface InterfaceProperty {
  name: string;
  description: string;
  type: string;
}

export interface EnumProperty {
  name: string;
  value: string;
}

export interface InterfaceImport {
  importedName: string;
}

export interface SwaggerV3Object {
  components: {
    schemas: SwaggerDefinitions;
  };
}

export class InterfaceGenerator {

  constructor(
    private templater: Templater,
    private output: Output,
  ) {
  }

  public makeTypes(swaggerObjects: Swagger[], dir: string): number {
    console.log('writing models in ', dir);

    return swaggerObjects.reduce((acc, el) => {
      return acc + this.makeTypesForOneSwagger(el, dir);
    }, 0);
  }

  makeTypesForOneSwagger(swaggerObject: Swagger, dir: string): number {

    const definitions: SwaggerDefinitions = swaggerObject.definitions // OpenAPI v2
      || (swaggerObject as unknown as SwaggerV3Object).components.schemas; // OpenAPI v3

    const typeNames: string[] = Object.keys(definitions);
    const fileStrings: string[] = Object.entries(definitions)
      .map(([name, definition]) => {
        if (definition.enum) {
          return this.makeOneEnumFileString(name, definition);
        } else {
          return this.makeOneInterfaceFileString(name, definition);
        }
      });

    fileStrings
      .forEach((fileString: string, i: number) => this.output.saveInterfaceFile(dir, typeNames[i], fileString));

    return fileStrings.length;
  }

  private makeOneInterfaceFileString(name: string, definition: SwaggerDefinition): string {

    return this.templater.renderInterface({
      description: definition.description,
      name,
      properties: this.makeProperties(definition),
      imports: this.makeImports(name, definition),
    });
  }

  private makeOneEnumFileString(name: string, definition: SwaggerDefinition): string {
    return this.templater.renderEnum({
      description: definition.description,
      name,
      properties: definition.enum.map(x => ({
        name: x.toUpperCase(),
        value: x
      }))
    });
  }

  private makeProperties(definition: SwaggerDefinition): InterfaceProperty[] {
    return Object.entries(definition.properties)
      .sort((a, b) =>
        a[0].localeCompare(b[0]))
      .map(([name, property]) => {
        return {
          name,
          description: property.description,
          type: this.extractPropertyType(property),
          nullable: property.nullable || false,
        };
      });
  }

  private makeImports(name: string, definition: SwaggerDefinition): InterfaceImport[] {
    const importsMap = Object.values(definition.properties)
      .map(property => this.extractImport(name, property))
      .filter(importedName => importedName?.importedName)
      .sort((a, b) => a.importedName.localeCompare(b.importedName))
      .reduce((acc, el) => {
        return {
          ...acc,
          [el.importedName]: el,
        };
      }, {} as Record<string, InterfaceImport>);

    return Object.values(importsMap);
  }

  private extractPropertyType(property: SwaggerPropertyDefinition): string {
    switch (property.type) {
      case 'array':
        return property.items.$ref
          ? `${this.cleanRef(property.items.$ref)}[]`
          : `${this.parseType(property.items.type as SwaggerType)}[]`;
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
        return this.parseType(property.type, property.format);
      default:
        return property.$ref ? this.cleanRef(property.$ref) : 'any';
    }
  }

  private cleanRef($ref: string): string {
    if (!$ref) {
      throw new Error('No ref$ to clean');
    }
    return $ref
      .replace('#/definitions/', '')
      .replace('#/components/schemas/', '');
  }

  private parseType(type: SwaggerType, format?: SwaggerFormat): string {
    switch (type) {
      case 'integer':
        return 'number';

      case 'string':
        if (format === 'date-time') {
          return 'Date';
        }
        return 'string';

      default:
        return type;
    }
  }

  private extractImport(name: string, property: SwaggerPropertyDefinition): InterfaceImport {
    if (['string', 'integer', 'number', 'boolean'].includes(property.type)) {
      return;
    }

    let importedName: string;

    if (property.type === 'array' && property.items.$ref) {
      importedName = this.cleanRef(property.items.$ref);
    }

    if (property.$ref) {
      importedName = this.cleanRef(property.$ref);
    }

    if (name === importedName) {
      return;
    }

    return {
      importedName,
    };
  }
}
