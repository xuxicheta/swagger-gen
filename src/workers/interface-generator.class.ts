import { Swagger, SwaggerDefinition, SwaggerPropertyDefinition, SwaggerType } from '../types/swagger';
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

export class InterfaceGenerator {

  constructor(
    private templater: Templater,
    private fsOperator: FsOperator,
  ) {}

  public makeInterfaces(swaggerObject: Swagger, dir: string): void {
    console.log('writing models in ', dir);
    const interfaces: string[] = [];
    Object.entries(swaggerObject.definitions).forEach(([name, definition]) => {
      const fileString = this.makeOneInterfaceFileString(name, definition);
      this.fsOperator.saveInterfaceFile(dir, name, fileString);
      interfaces.push(name);
    });
    const indexContent = interfaces
      .map(name => `export { ${name} } from './${name}';\n`)
      .sort()
      .join('');
    this.fsOperator.saveIndexFile(dir, indexContent);
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
          : `${this.parseType(property.items.type)}[]`;

      default:
        return this.parseType(property.type);
    }
  }

  private parseType(type: SwaggerType | string): string {
    switch (type) {
      case 'integer':
        return 'number';
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
