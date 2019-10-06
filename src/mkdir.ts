import { mkdirSync } from "fs";

export function mkDirModels(dir: string): string {
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