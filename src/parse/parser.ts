import { Swagger, SwaggerDefinition, SwaggerDefinitions } from '../types/swagger';
import { isSwaggerV3, Model } from '../types/types';
import { ParserInterface } from './parser-interface';
import { ParserEnum } from './parser-enum';

export class Parser {
  parserInterface = new ParserInterface();
  parserEnum = new ParserEnum();

  parseModels(swaggers: Swagger[]): Model[] {
    return swaggers.reduce((acc, el) => acc.concat(this.parseOne(el)), []);
  }

  /** @internal */
  parseOne(swagger: Swagger): Model[] {
    const definitions = this.extractDefinitions(swagger);

    return Object.entries(definitions)
      .map(([name, definition]) => this.makeTypeObject(name, definition))
      .filter(Boolean);
  }

  /** @internal */
  makeTypeObject(name: string, definition: SwaggerDefinition): Model|null {
    if (definition.enum) {
      return this.parserEnum.makeTypeObject(name, definition);
    }
    return this.parserInterface.makeTypeObject(name, definition);
  }

  /** @internal */
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
