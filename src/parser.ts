import { Swagger, SwaggerDefinition, SwaggerDefinitions, SwaggerFormat, SwaggerPropertyDefinition, SwaggerType } from './types/swagger';
import { InterfaceImport, InterfaceProperty, isSwaggerV3, TypeObject } from './types/types';

export class Parser {
  parseAll(swaggers: Swagger[]): TypeObject[] {
    return swaggers.reduce((acc, el) => acc.concat(this.parseOne(el)), []);
  }

  parseOne(swagger: Swagger): TypeObject[] {
    const definitions = this.extractDefinitions(swagger);

    return Object.entries(definitions)
      .map(([name, definition]) => {
        if (definition.enum) {
          return this.makeOneEnumFileString(name, definition);
        } else {
          return this.makeOneInterfaceFileString(name, definition);
        }
      });
  }

  extractDefinitions(swagger: Swagger): SwaggerDefinitions {
    if (swagger?.definitions) {
      return swagger.definitions;
    }
    if (isSwaggerV3(swagger)) {
      return swagger.components.schemas;
    }
    throw new Error('Unknown swagger');
  }

  private makeOneInterfaceFileString(name: string, definition: SwaggerDefinition): TypeObject {

    return {
      description: definition.description,
      name,
      properties: this.makeProperties(definition),
      imports: this.makeImports(name, definition),
    };
  }

  private makeOneEnumFileString(name: string, definition: SwaggerDefinition): TypeObject {
    return {
      description: definition.description,
      name,
      properties: definition.enum.map(x => ({
        name: x.toUpperCase(),
        value: x
      }))
    };
  }

  private makeProperties(definition: SwaggerDefinition): InterfaceProperty[] {
    return Object.entries(definition.properties).map(([name, property]) => {
      return {
        name,
        description: property.description,
        type: this.extractPropertyType(property),
        nullable: property.nullable || false,
      };
    });
  }

  private makeImports(name: string, definition: SwaggerDefinition): InterfaceImport[] {
    return Object.values(definition.properties)
      .map(property => this.extractImport(name, property))
      .filter(imp => imp?.importedName);
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
