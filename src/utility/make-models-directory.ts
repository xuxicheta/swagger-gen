import { mkdirSync } from 'fs';

export function makeModelsDirectory(dir: string): string {
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
