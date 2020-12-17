import { join, resolve } from 'path';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';

export class Output {
  saveInterfaceFile(dir: string, name: string, fileString: string): void {
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
