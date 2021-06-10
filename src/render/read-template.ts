import { Config } from '../config/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function readTemplate(config: Config, templateName: string): string {
  return readFileSync(
    resolve(config.templatesDir, templateName)
  )
    .toString();
}
