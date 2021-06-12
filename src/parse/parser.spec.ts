import { Parser } from './parser';
import { AnySwagger, Swagger2, SwaggerDefinition, SwaggerDefinitions } from '../types/swagger';
import { Model } from '../types/types';
import { stubModel } from './__stub/stub-model';
import { stubDefinitions } from './__stub/stub-definitions';
import { stubSwagger, stubSwagger2, stubSwagger3 } from './__stub/stub-swagger';
import { ParserInterface } from './parser-interface';
import { ParserEnum } from './parser-enum';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe('parseModels', () => {
    it('should return 2x2 array', () => {

      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [stubModel(), stubModel()];
      });
      const swagger: AnySwagger = stubSwagger();

      const result = parser.parseModels([swagger, swagger]);
      expect(parseOne).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(4);
    });

    it('should return empty array when empty array on input ', () => {
      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [stubModel(), stubModel()];
      });
      const result = parser.parseModels([]);
      expect(parseOne).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });

    it('should return empty array when undefined on input ', () => {
      const parseOne = spyOn(parser, 'parseOne').and.callFake((swagger: Swagger2): Model[] => {
        return [stubModel(), stubModel()];
      });
      const result = parser.parseModels(undefined);
      expect(parseOne).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('parseOne', () => {
    it('should calls extractDefinitions', () => {
      const definitions: SwaggerDefinitions = stubDefinitions();
      const swagger: AnySwagger = stubSwagger();
      const extractDefinitions = spyOn(parser, 'extractDefinitions').and.returnValue(definitions);
      const makeModels = spyOn(parser, 'makeModel').and.returnValue(stubModel());
      const result = parser.parseOne(swagger);

      expect(extractDefinitions).toHaveBeenCalledTimes(1);
      expect(extractDefinitions).toHaveBeenCalledWith(swagger);
    });

    it('should calls makeModel', () => {
      const swagger: AnySwagger = stubSwagger();
      const definitions: SwaggerDefinitions = stubDefinitions();
      const extractDefinitions = spyOn(parser, 'extractDefinitions').and.returnValue(definitions);
      const makeModels = spyOn(parser, 'makeModel').and.returnValue(stubModel());
      const result = parser.parseOne(swagger);

      expect(makeModels).toHaveBeenCalledTimes(2);
      const definitionEntries = Object.entries(definitions);
      expect(makeModels).toHaveBeenCalledWith(definitionEntries[0], 0, definitionEntries);
      expect(makeModels).toHaveBeenCalledWith(definitionEntries[1], 1, definitionEntries);
    });

    it('should filter empty models out', () => {
      const swagger: AnySwagger = stubSwagger();
      const definitions: SwaggerDefinitions = stubDefinitions();
      const extractDefinitions = spyOn(parser, 'extractDefinitions').and.returnValue(definitions);
      const makeModels = spyOn(parser, 'makeModel').and.returnValue(null);
      const result = parser.parseOne(swagger);

      expect(makeModels).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(0);
    });
  });

  describe('makeModel', () => {
    it('should call make enum', () => {
      const resultModel = stubModel();
      const parserInterface: ParserInterface = (parser as any).parserInterface;
      const makeModelInterface = spyOn(parserInterface, 'makeModel').and.returnValue(resultModel);
      const parserEnum: ParserEnum = (parser as any).parserEnum;
      const makeModelEnum = spyOn(parserEnum, 'makeModel').and.returnValue(resultModel);

      const enumDefinition: SwaggerDefinition = {
        enum: ['one'],
        type: 'string',
      };

      const result = parser.makeModel(['myModel', enumDefinition]);
      expect(result).toBe(resultModel);
      expect(makeModelInterface).not.toHaveBeenCalled();
      expect(makeModelEnum).toHaveBeenCalled();
    });

    it('should call make interface', () => {
      const resultModel = stubModel();
      const parserInterface: ParserInterface = (parser as any).parserInterface;
      const makeModelInterface = spyOn(parserInterface, 'makeModel').and.returnValue(resultModel);
      const parserEnum: ParserEnum = (parser as any).parserEnum;
      const makeModelEnum = spyOn(parserEnum, 'makeModel').and.returnValue(resultModel);

      const enumDefinition: SwaggerDefinition = {
        properties: {
          id: {
            type: 'integer',
            format: 'int64'
          },
        },
        type: 'object',
      };

      const result = parser.makeModel(['myModel', enumDefinition]);
      expect(result).toBe(resultModel);
      expect(makeModelEnum).not.toHaveBeenCalled();
      expect(makeModelInterface).toHaveBeenCalled();
    });

    it('should return null if not interface nor enum', () => {
      const resultModel = stubModel();
      const parserInterface: ParserInterface = (parser as any).parserInterface;
      const makeModelInterface = spyOn(parserInterface, 'makeModel').and.returnValue(resultModel);
      const parserEnum: ParserEnum = (parser as any).parserEnum;
      const makeModelEnum = spyOn(parserEnum, 'makeModel').and.returnValue(resultModel);

      const enumDefinition: SwaggerDefinition = {
        type: 'object',
      };

      const result = parser.makeModel(['myModel', enumDefinition]);
      expect(result).toBe(null);
      expect(makeModelEnum).not.toHaveBeenCalled();
      expect(makeModelInterface).not.toHaveBeenCalled();
    });
  });

  describe('extractDefinition', () => {
    it('should extract from swagger2', () => {
      const swagger = stubSwagger2();
      const result = parser.extractDefinitions(swagger);
      expect(result).toBe(swagger.definitions);
    });

    it('should extract from swagger3', () => {
      const swagger = stubSwagger3();
      const result = parser.extractDefinitions(swagger);
      expect(result).toBe(swagger.components?.schemas);
    });

    it('should throw if unrecognized swagger', () => {
      const swagger = {} as unknown as AnySwagger;
      expect(() => parser.extractDefinitions(swagger)).toThrow();
    });
  });
});
