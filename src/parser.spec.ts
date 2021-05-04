import { Parser } from './parser';
import { Model } from './types/types';
import { Swagger, SwaggerDefinitions } from './types/swagger';

const typeSampleA: Model = {
  properties: [],
  description: 'a',
  imports: [],
  name: 'a'
};

const typeSampleB: Model = {
  properties: [],
  description: 'b',
  imports: [],
  name: 'b'
};

const sampleSwagger2: Swagger = {
  definitions: 2 as any,
  basePath: true as any,
  host: true as any,
  info: true as any,
  paths: true as any,
  schemes: true as any,
  swagger: true as any,
};

const sampleSwagger3: Swagger = {
  components: {
    schemas: 3 as any,
  },
} as any;

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  it('should be created', () => {
    expect(parser).toBeDefined();
  });

  it('should parseAll', () => {
    jest.spyOn(parser, 'parseOne').mockReturnValue([typeSampleA, typeSampleB]);
    const swaggers = [1, 3] as unknown as Swagger[];
    const result = parser.parseModels(swaggers);
    expect(result).toEqual([typeSampleA, typeSampleB, typeSampleA, typeSampleB]);
  });

  it('should parseOne', () => {
    const extractDefinitions = jest.spyOn(parser, 'extractDefinitions').mockReturnValue({
      a: 'aa',
      b: 'bb'
    } as unknown as SwaggerDefinitions);
    const makeTypeObject = jest.spyOn(parser, 'makeTypeObject').mockReturnValue('makeTypeObject' as any);
    const swagger = 1 as unknown as Swagger;
    const result = parser.parseOne(swagger);

    expect(extractDefinitions).toHaveBeenCalledWith(swagger);
    expect(makeTypeObject).toHaveBeenNthCalledWith(1, ...['a', 'aa']);
    expect(makeTypeObject).toHaveBeenNthCalledWith(2, ...['b', 'bb']);
    expect(result).toEqual(['makeTypeObject', 'makeTypeObject']);
  });

  it('should makeTypeObject with interface definition', () => {
    const definition = { a: 1 } as any;
    const makeTypeObject = jest.spyOn(parser.parserInterface, 'makeTypeObject').mockReturnValue('x' as any);
    const makeTypeObject2 = jest.spyOn(parser.parserEnum, 'makeTypeObject').mockReturnValue('xx' as any);
    const result = parser.makeTypeObject('oo', definition);
    expect(makeTypeObject).toHaveBeenCalledWith('oo', definition);
    expect(makeTypeObject2).not.toHaveBeenCalled();
    expect(result).toBe('x');
  });

  it('should makeTypeObject with enum definition', () => {
    const definition = { a: 1, enum: true } as any;
    const makeTypeObject = jest.spyOn(parser.parserInterface, 'makeTypeObject').mockReturnValue('x' as any);
    const makeTypeObject2 = jest.spyOn(parser.parserEnum, 'makeTypeObject').mockReturnValue('xx' as any);
    const result = parser.makeTypeObject('ooo', definition);
    expect(makeTypeObject2).toHaveBeenCalledWith('ooo', definition);
    expect(makeTypeObject).not.toHaveBeenCalled();
    expect(result).toBe('xx');
  });

  it('should extract definition with version 2', () => {
    const result = parser.extractDefinitions(sampleSwagger2);
    expect(result).toBe(2);
  });

  it('should extract definition with version 3', () => {
    const result = parser.extractDefinitions(sampleSwagger3);
    expect(result).toBe(3);
  });
});
