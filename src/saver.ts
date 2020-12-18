import { join, resolve } from 'path';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { Config } from './config';
import { TypeObject } from './types/types';

export class Saver {

  constructor(private config: Config) {
    this.makeModelsDirectory(config.modelsDir);
  }

  saveAll(typeObjects: TypeObject[], fileStrings: string[]): void {
    typeObjects.forEach((typeObject, index) => {
      this.saveFile(this.config.modelsDir, typeObject.name, fileStrings[index]);
    });
  }

  saveFile(dir: string, name: string, fileString: string): void {
    const fileName = resolve(dir, `${name}.ts`);
    writeFileSync(fileName, fileString);
  }

  makeModelsDirectory(dir: string): void {
    try {
      mkdirSync(dir);
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
