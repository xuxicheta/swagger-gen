import { mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

export function makeModelsDirectory(dir: string): void {
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
