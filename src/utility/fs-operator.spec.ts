import { existsSync, mkdirSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { FsOperator } from './fs-operator.class';

const DIR_NAME_1 = resolve(__dirname, 'models-test-1');
const DIR_NAME_2 = resolve(__dirname, 'models-test-2');

describe('class should be created', () => {
  it('created', () => {
    const fsOperator = new FsOperator();
    expect(fsOperator).toBeInstanceOf(FsOperator);
  });
});

describe('folder creation1', () => {
  it('simple1', () => {
    const fsOperator = new FsOperator();
    fsOperator.mkDirModels(DIR_NAME_1);
    const isCreated = existsSync(DIR_NAME_1);
    expect(isCreated).toBeTruthy();
    rmdirSync(DIR_NAME_1);
  });

  it('returned name', () => {
    const fsOperator = new FsOperator();
    const result = fsOperator.mkDirModels(DIR_NAME_1);
    expect(result).toEqual(DIR_NAME_1);
    rmdirSync(DIR_NAME_1);
  });

  it('already created', () => {
    const fsOperator = new FsOperator();
    mkdirSync(DIR_NAME_2);
    fsOperator.mkDirModels(DIR_NAME_2);
    const isCreated = existsSync(DIR_NAME_2);
    expect(isCreated).toBeTruthy();
    rmdirSync(DIR_NAME_2);
  });
});
