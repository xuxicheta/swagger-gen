import { readFileSync } from 'fs';
import { resolve } from 'path';
import { templaterDummy1 } from './templater/templater.dummy.1';
import { templaterDummy2 } from './templater/templater.dummy.2';
import { templaterDummy3 } from './templater/templater.dummy.3';
import { Renderer } from '../../src/workers/templater.class';
import { templaterDummy4 } from './templater/templater.dummy.4';

const mustacheDirPath = resolve(__dirname, '..', '..', 'mustache');
console.log(__dirname);

const sample1: string = readFileSync('./test/workers/templater/templater.sample.1.ts').toString();
const sample2: string = readFileSync('./test/workers/templater/templater.sample.2.ts').toString();
const sample3: string = readFileSync('./test/workers/templater/templater.sample.3.ts').toString();
const sample4: string = readFileSync('./test/workers/templater/templater.sample.4.ts').toString();

describe('class should be created', () => {
  it('created', () => {
    const templater = new Renderer(mustacheDirPath);
    expect(templater).toBeInstanceOf(Renderer);
  });
});

describe('templating interface', () => {
  it('render interface without properties and exports', () => {
    const templater = new Renderer(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy1);
    expect(result).toEqual(sample1);
  });

  it('render interface without exports', () => {
    const templater = new Renderer(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy2);
    expect(result).toEqual(sample2);
  });

  it('render interface', () => {
    const templater = new Renderer(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy3);
    expect(result).toEqual(sample3);
  });
});

describe('templating enum', () => {
  it('render enum', () => {
    const templater = new Renderer(mustacheDirPath);
    const result = templater.renderEnum(templaterDummy4);
    expect(result).toEqual(sample4);
  });
});
