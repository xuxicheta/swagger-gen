import { join, resolve } from 'path';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { Config } from './config';
import { Model } from './types/types';
import { ParsedApi } from './parser-api';

export class Saver {

  constructor(private config: Config) {
    this.makeDirectory(config.modelsDir);

    if (this.config.generateApi) {
      this.makeDirectory(config.apiDir);
    }
  }

  saveModels(models: Model[], fileStrings: string[]): void {
    models.forEach((model, index) => {
      this.saveOne(this.config.modelsDir, model.name, fileStrings[index]);
    });
  }

  saveApis(apis: ParsedApi[], fileStrings: string[]): void {
    apis.forEach((model, index) => {
      let path = model.name.replace(this.config.ignorePrefix, '').split('/');
      while (path[path.length - 1].search(/{([^)]+)}/) !== -1) {
        path[path.length - 2] =
          `${path[path.length - 2]}By${path[path.length - 1].replace('{', '').replace('}', '')}`;
        path = path.slice(0, path.length - 1);
      }
      const name = path[path.length - 1];
      const dir = join(this.config.apiDir, ...path.slice(0, path.length - 1));
      this.makeDirectory(dir);
      this.saveOne(dir, path[path.length - 1] + '.service', fileStrings[index]);
    });
  }

  saveOne(dir: string, name: string, fileString: string): void {
    const fileName = resolve(dir, `${name}.ts`);
    writeFileSync(fileName, fileString);
  }

  makeDirectory(dir: string): void {
    if (!dir) {
      return;
    }
    try {
      return mkdirSync(dir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    readdirSync(dir).forEach(file => {
      unlinkSync(join(dir, file));
    });
  }

}
