import { writeFileSync } from 'fs';
import { resolve } from 'path';

export class FsOperator {

  public saveInterfaceFile(dir: string, name: string, fileString: string): void {
    const fileName = resolve(dir, `${name}.ts`);
    writeFileSync(fileName, fileString);
  }
}
