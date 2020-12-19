import { SwaggerDefinition } from './types/swagger';
import { TypeObject } from './types/types';

export class ParserEnum {
  makeTypeObject(name: string, definition: SwaggerDefinition): TypeObject {
    return {
      description: definition.description,
      name,
      properties: definition.enum.map(x => ({
        name: x.toUpperCase(),
        value: x
      }))
    };
  }
}
