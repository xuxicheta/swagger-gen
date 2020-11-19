import { Config } from '../types/config.interface';
import { Swagger } from '../types/swagger';
import { readFileSync } from 'fs';
import { requestJSON } from './request-json';

export async function getSwagger({ file, url }: Config): Promise<Swagger> {
  const json = await (async () => {
    if (file) {
      return readFileSync(file).toString();
    }
    if (url) {
      return requestJSON(url);
    }
  })();

  return JSON.parse(json);
}
