import { mkdirSync } from 'fs';

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
}
