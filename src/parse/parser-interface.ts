import { SwaggerDefinition, SwaggerDefinitionProperties, SwaggerFormat, SwaggerPropertyDefinition, SwaggerType } from '../types/swagger';
import { InterfaceImport, InterfaceProperty, Model } from '../types/types';

export class ParserInterface {
  makeModel(name: string, definition: SwaggerDefinition): Model {
    return {
      description: definition.description,
      name,
      properties: this.makeProperties(definition?.properties ?? {}),
      imports: this.makeImports(name, definition?.properties ?? {}),
    };
  }

  /** @internal */
  makeProperties(properties: SwaggerDefinitionProperties): InterfaceProperty[] {
    return Object.entries(properties).map(([name, property]): InterfaceProperty => {
      return {
        name,
        description: property.description,
        type: this.extractPropertyType(property),
        nullable: property.nullable || false,
      };
    });
  }

  /** @internal */
  makeImports(name: string, properties: SwaggerDefinitionProperties): InterfaceImport[] {
    return Array.from(Object.values(properties)
      .map(property => this.extractImport(name, property))
      .filter<InterfaceImport>((imp): imp is InterfaceImport => Boolean(imp?.importedName))
      .reduce((acc, el) => acc.set(el.importedName, el), new Map<string, InterfaceImport>())
      .values());
  }

  extractImport(name: string, property: SwaggerPropertyDefinition): InterfaceImport | undefined {
    if (['string', 'integer', 'number', 'boolean'].includes(property.type)) {
      return;
    }

    const importedName: string | undefined = (() => {
      if (property.type === 'array' && property?.items?.$ref) {
        return this.cleanRef(property.items.$ref);
      }

      if (property.$ref) {
        return this.cleanRef(property.$ref);
      }
    })();

    if (name === importedName || importedName === undefined) {
      return;
    } else {
      return {
        importedName,
      };
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

  extractPropertyType(property: SwaggerPropertyDefinition): string {
    switch (property.type) {
      case 'array':
        return property?.items?.$ref
          ? `${this.cleanRef(property.items.$ref)}[]`
          : `${this.parseType(property.items?.type as SwaggerType)}[]`;
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
