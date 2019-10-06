import { writeFileSync } from 'fs';
import { Mustache } from 'mustache.class.';
import { resolve } from 'path';
import { Swagger, SwaggerDefinition, SwaggerPropertyDefinition, SwaggerType } from 'swagger';

interface InterfaceProperty {
  name: string;
  description: string;
  type: string;
}

interface InterfaceImport {
  importedName: string;
}

export class InterfaceGenerator {

  constructor(
    private mustache: Mustache,
  ) {}

  public makeInterfaces(swaggerObject: Swagger, dir: string): void {
    Object.entries(swaggerObject.definitions).forEach(([name, definition]) => {
      const fileString = this.makeOneInterfaceFileString(name, definition);
      this.saveInterfaceFile(dir, name, fileString);
    });
  }

  private saveInterfaceFile(dir: string, name: string, fileString: string): void {
    const fileName = resolve(dir, `${name}.ts`);
    writeFileSync(fileName, fileString);
  }

  private makeOneInterfaceFileString(name: string, definition: SwaggerDefinition): string {
    const properties = this.makeProperties(definition);
    const imports = this.makeImports(name, definition);

    return this.mustache.renderInterface({
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
