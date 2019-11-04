import { readFileSync } from 'fs';
import { resolve } from 'path';
import { templaterDummy1 } from '../../test/templater/templater.dummy.1';
import { templaterDummy2 } from '../../test/templater/templater.dummy.2';
import { templaterDummy3 } from '../../test/templater/templater.dummy.3';
import { Templater } from './templater.class';

const mustacheDirPath = resolve(__dirname, '..', 'mustache');

const sample1: string = readFileSync('./test/templater/templater.sample.1.ts').toString();
const sample2: string = readFileSync('./test/templater/templater.sample.2.ts').toString();
const sample3: string = readFileSync('./test/templater/templater.sample.3.ts').toString();

describe('class should be created', () => {
  it('created', () => {
    const templater = new Templater(mustacheDirPath);
    expect(templater).toBeInstanceOf(Templater);
  });
});

describe('templating interface', () => {
  it('render interface without properties and exports', () => {
    const templater = new Templater(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy1);
    expect(result).toEqual(sample1);
  });

  it('render interface without exports', () => {
    const templater = new Templater(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy2);
    expect(result).toEqual(sample2);
  });

  it('render interface', () => {
    const templater = new Templater(mustacheDirPath);
    const result = templater.renderInterface(templaterDummy3);
    expect(result).toEqual(sample3);
  });
});
