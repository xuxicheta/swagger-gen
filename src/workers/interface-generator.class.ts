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

    const interfaceNames: string[] = Object.keys(definitions);
    const interfaceFileStrings: string[] = Object.entries(definitions)
      .map(([name, definition]) => this.makeOneInterfaceFileString(name, definition));

    interfaceFileStrings
      .forEach((fileString: string, i: number) => this.fsOperator.saveInterfaceFile(dir, interfaceNames[i], fileString));

    const barrelFileContent = interfaceNames
      .map(name => `export { ${name} } from './${name}';\n`)
      .sort()
      .join('');
    this.fsOperator.saveIndexFile(dir, barrelFileContent);
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
          ? `${this.cleanRef(property.items.$ref)}[]`
          : `${this.parseType(property.items.type as SwaggerType)}[]`;
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean': return this.parseType(property.type, property.format);
      default:
        return this.cleanRef(property.$ref);
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
        } else {
          return 'string';
        }

      default:
        return type;
    }
  }

  private extractImport(name: string, property: SwaggerPropertyDefinition): { importedName: string } {
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
