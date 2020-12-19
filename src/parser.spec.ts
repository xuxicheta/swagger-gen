import yargs from 'yargs';
import { Config } from './config';
import { Parser } from './parser';
import { TypeObject } from './types/types';
import { Swagger } from './types/swagger';

const typeSampleA: TypeObject = {
  properties: [],
  description: 'a',
  imports: [],
  name: 'a'
};

const typeSampleB: TypeObject = {
  properties: [],
  description: 'b',
  imports: [],
  name: 'b'
};

const typeSampleC: TypeObject = {
  properties: [],
  description: 'c',
  imports: [],
  name: 'c'
};

describe('Parser', () => {
  it('should be created', () => {
    const parser = new Parser();
    expect(parser).toBeDefined();
  });

  it('should be created', () => {
    const parser = new Parser();
    expect(parser).toBeDefined();
  });

  it('should parseAll', () => {
    const parser = new Parser();
    jest.spyOn(parser, 'parseOne').mockReturnValue([typeSampleA, typeSampleB]);
    const swaggers = [1, 3] as unknown as Swagger[];
    const result = parser.parseAll(swaggers);
    expect(result).toEqual([typeSampleA, typeSampleB, typeSampleA, typeSampleB]);
  });
});
