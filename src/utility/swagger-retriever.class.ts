
import { Swagger } from '../types/swagger';
import { readFileSync } from 'fs';
import { Config } from './config.class';
import { get as getHttp } from 'http';
import { get as getHttps } from 'https';


export class SwaggerRetriever {
  async getSwagger({ file, url }: Config): Promise<Swagger> {
    const json = await (async () => {
      if (file) {
        return readFileSync(file).toString();
      }
      if (url) {
        return this.requestJSON(url);
      }
    })();
  
    return JSON.parse(json);
  }

  requestJSON(urlString: string): Promise<string> {

    const url = new URL(urlString);
    const get = url.protocol === 'https:' ? getHttps : getHttp;
  
    console.log(`getting json from ${url} ...`);
    return new Promise<string>((resolve: (value: string) => void, reject: (error: Error) => void) => {
      get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
  
        const error = (() => {
          if (statusCode !== 200) {
            return new Error(`Request Failed. Status Code: ${statusCode}`);
          }
          if (!/^application\/json/.test(contentType)) {
            return new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
          }
        })();
  
        if (error) {
          reject(error);
        }
  
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          resolve(rawData);
        });
      })
        .on('error', (e) => {
          reject(new Error(`Got error: ${e.message}`));
        });
    });
  }
}
