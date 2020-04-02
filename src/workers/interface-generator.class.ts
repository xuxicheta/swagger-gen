import { Swagger, SwaggerDefinition, SwaggerPropertyDefinition, SwaggerType, SwaggerFormat, SwaggerDefinitions } from '../types/swagger';
import { Templater } from './templater.class';
import { FsOperator } from '../utility/fs-operator.class';

export interface InterfaceProperty {
  name: string;
  description: string;
  type: string;
}

export interface InterfaceImport {
  importedName: string;
}

interface SwaggerV3Object {
  components: {
    schemas: SwaggerDefinitions;
  };
}

export class InterfaceGenerator {

  constructor(
    private templater: Templater,
    private fsOperator: FsOperator,
  ) {}

  public makeInterfaces(swaggerObject: Swagger, dir: string): void {
    console.log('writing models in ', dir);

    const definitions: SwaggerDefinitions = swaggerObject.definitions // OpenAPI v2
      || (swaggerObject as unknown as SwaggerV3Object).components.schemas; // OpenAPI v3
    const interfaces = this.runDefinitions(definitions, dir);

    const indexContent = interfaces
      .map(name => `export { ${name} } from './${name}';\n`)
      .sort()
      .join('');
    this.fsOperator.saveIndexFile(dir, indexContent);
  }

  private runDefinitions(definitions: SwaggerDefinitions, dir: string): string[] {
    return Object.entries(definitions).map(([name, definition]) => {
      const fileString = this.makeOneInterfaceFileString(name, definition);
      this.fsOperator.saveInterfaceFile(dir, name, fileString);
      return name;
    });
  }

  private makeOneInterfaceFileString(name: string, definition: SwaggerDefinition): string {
    const properties = this.makeProperties(definition);
    const imports = this.makeImports(name, definition);

    return this.templater.renderInterface({
      description: definition.description,
      interfaceName: name,
      properties,
      imports,
    });
  }

  private makeProperties(definition: SwaggerDefinition): InterfaceProperty[] {
    return Object.entries(definition.properties).map(([name, property]) => {
      return {
        name,
        description: property.description,
        type: this.extractPropertyType(property),
      };
    });
  }

  private makeImports(name: string, definition: SwaggerDefinition): InterfaceImport[] {
    return Object.values(definition.properties)
      .map(property => this.extractImport(name, property))
      .filter(Boolean);
  }

  private extractPropertyType(property: SwaggerPropertyDefinition): string {
    switch (property.type) {
      case 'array':
        return property.items.$ref
          ? property.items.$ref.replace('#/definitions/', '') + '[]'
          : `${this.parseType(property.items.type as SwaggerType)}[]`;

      default:
        return this.parseType(property.type, property.format);
    }
  }

  private parseType(type: SwaggerType, format?: SwaggerFormat): string {
    switch (type) {
      case 'integer':
        return 'number';

      case 'string':
        if (format === 'date-time') {
          return 'Date';
        } else {
          return 'string';
        }

      default:
        return type;
    }
  }

  private extractImport(name: string, property: SwaggerPropertyDefinition): { importedName: string } {
    if (property.type === 'array' && property.items.$ref) {
      const importedName = property.items.$ref.replace('#/definitions/', '');

      if (name !== importedName) {
        return {
          importedName,
        };
      }
    }
    return undefined;
  }
}
