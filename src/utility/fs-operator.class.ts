import { mkdirSync, readFile, writeFileSync } from 'fs';
import { resolve } from 'path';

export class FsOperator {
  public mkDirModels(dir: string): string {
    try {
      mkdirSync(dir);
      return dir;
    } catch (error) {
      if (error.code === 'EEXIST') {
        return dir;
      }
      throw error;
    }
  }

  public readFile(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(file, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    })
      .then((r: Buffer) => r.toString());
  }

  public saveInterfaceFile(dir: string, name: string, fileString: string): void {
    const fileName = resolve(dir, `${name}.ts`);
    writeFileSync(fileName, fileString);
  }
}
