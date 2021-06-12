import { Parser } from './parser';
import { AnySwagger, Swagger2, SwaggerDefinitions } from '../types/swagger';
import { InterfaceImport, Model } from '../types/types';

const sampleModel1 = (): Model => ({
  imports: [{
    importedName: 'importedName',
  }],
  properties: [
    {
      description: 'description',
      name: 'name',
      type: 'string',
      value: 'value',
    }
  ],
  description: 'qwerty',
  name: 'prop1',
});

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe('parseModels', () => {
    it('should return 2x2 array', () => {

      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [sampleModel1(), sampleModel1()];
      });
      const swagger: Swagger2 = {
        paths: {},
        basePath: '123',
        definitions: {},
        host: '123',
        info: {
          version: '1',
          description: '',
          title: '',
        },
        schemes: [],
        swagger: '123',
      };

      const result = parser.parseModels([swagger, swagger]);
      expect(parseOne).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(4);
    });

    it('should return empty array when empty array on input ', () => {
      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [sampleModel1(), sampleModel1()];
      });
      const result = parser.parseModels([]);
      expect(parseOne).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });

    it('should return empty array when undefined on input ', () => {
      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [sampleModel1(), sampleModel1()];
      });
      const result = parser.parseModels(undefined);
      expect(parseOne).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('parseOne', () => {
    it('should calls rights', () => {
      const definitions: SwaggerDefinitions = {
        one: {
          properties: {},
          description: '',
          required: [],
        }
      };
      const swagger: Swagger2 = {
        paths: {},
        basePath: '123',
        definitions: {},
        host: '123',
        info: {
          version: '1',
          description: '',
          title: '',
        },
        schemes: [],
        swagger: '123',
      };
      const extractDefinitions = spyOn(parser, 'extractDefinitions').and.callFake((swagger: AnySwagger): SwaggerDefinitions => {
        return definitions;
      });
      const makeModels = spyOn(parser, 'makeModel').and.returnValue({
        description: '',
        properties: {},
        imports: [] as InterfaceImport[],
      } as Model);
      const result = parser.parseOne(swagger);

      expect(extractDefinitions).toHaveBeenCalledTimes(1);
      expect(extractDefinitions).toHaveBeenCalledWith([swagger]);
    });
  });
});
