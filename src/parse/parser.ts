import { AnySwagger, SwaggerDefinition, SwaggerDefinitions } from '../types/swagger';
import { Model } from '../types/types';
import { ParserInterface } from './parser-interface';
import { ParserEnum } from './parser-enum';
import { isSwagger2, isSwagger3 } from './swagger-versions';

export class Parser {
  private parserInterface = new ParserInterface();
  private parserEnum = new ParserEnum();

  parseModels(swaggers: AnySwagger[] = []): Model[] {
    return swaggers.reduce<Model[]>((acc, el) => acc.concat(this.parseOne(el)), []);
  }

  /** @internal */
  parseOne(swagger: AnySwagger): Model[] {
    const definitions = this.extractDefinitions(swagger);

    if (!definitions) {
      return [];
    }

    return Object.entries(definitions)
      .map(this.makeModel, this)
      .filter((model: Model | null): model is Model => Boolean(model));
  }

  /** @internal */
  makeModel([name, definition]: [string, SwaggerDefinition]): Model | null {
    if (definition.enum) {
      return this.parserEnum.makeModel(name, definition);
    }

    if (definition.properties) {
      return this.parserInterface.makeModel(name, definition);
    }
    return null;
  }

  /** @internal */
  extractDefinitions(swagger: AnySwagger): SwaggerDefinitions|undefined {
    if (isSwagger2(swagger) && swagger?.definitions) {
      return swagger.definitions;
    }
    if (isSwagger3(swagger)) {
      return swagger.components?.schemas ?? {};
    }
    throw new Error('Unknown swagger version or incorrect object');
  }
}
