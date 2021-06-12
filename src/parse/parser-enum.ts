import { SwaggerDefinition } from '../types/swagger';
import { Model } from '../types/types';

export class ParserEnum {
  makeModel(name: string, definition: SwaggerDefinition): Model {
    return {
      description: definition.description,
      name,
      properties: definition.enum?.map(x => ({
        name: x.toUpperCase(),
        value: x
      })) ?? [],
    };
  }
}
