import { SwaggerDefinition, SwaggerFormat, SwaggerPropertyDefinition, SwaggerType } from './types/swagger';
import { InterfaceImport, InterfaceProperty, TypeObject } from './types/types';

export class ParserInterface {
  makeTypeObject(name: string, definition: SwaggerDefinition): TypeObject {

    return {
      description: definition.description,
      name,
      properties: this.makeProperties(definition),
      imports: this.makeImports(name, definition),
    };
  }

  makeProperties(definition: SwaggerDefinition): InterfaceProperty[] {
    return Object.entries(definition.properties).map(([name, property]) => {
      return {
        name,
        description: property.description,
        type: this.extractPropertyType(property),
        nullable: property.nullable || false,
      };
    });
  }

  makeImports(name: string, definition: SwaggerDefinition): InterfaceImport[] {
    return Object.values(definition.properties)
      .map(property => this.extractImport(name, property))
      .filter(imp => imp?.importedName);
  }

  extractImport(name: string, property: SwaggerPropertyDefinition): InterfaceImport {
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

  cleanRef($ref: string): string {
    if (!$ref) {
      throw new Error('No ref$ to clean');
    }
    return $ref
      .replace('#/definitions/', '')
      .replace('#/components/schemas/', '');
  }

  extractPropertyType(property: SwaggerPropertyDefinition): string {
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

  parseType(type: SwaggerType, format?: SwaggerFormat): string {
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
}
