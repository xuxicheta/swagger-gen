import { Swagger, SwaggerDefinition, SwaggerDefinitions } from './types/swagger';
import { isSwaggerV3, TypeObject } from './types/types';
import { ParserInterface } from './parser-interface';
import { ParserEnum } from './parser-enum';

export class Parser {
  parserInterface = new ParserInterface();
  parserEnum = new ParserEnum();

  parseAll(swaggers: Swagger[]): TypeObject[] {
    return swaggers.reduce((acc, el) => acc.concat(this.parseOne(el)), []);
  }

  parseOne(swagger: Swagger): TypeObject[] {
    const definitions = this.extractDefinitions(swagger);

    return Object.entries(definitions)
      .map(([name, definition]) => this.makeTypeObject(name, definition));
  }

  makeTypeObject(name: string, definition: SwaggerDefinition): TypeObject {
    if (definition.enum) {
      return this.parserEnum.makeTypeObject(name, definition);
    }
    return this.parserInterface.makeTypeObject(name, definition);
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

}
