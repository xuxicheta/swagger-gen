import { Swagger } from './types/swagger';
import { readFile } from 'fs';
import { get as getHttp } from 'http';
import { get as getHttps } from 'https';
import { Config } from './config/config';

export class Retriever {

  constructor(
    private config: Config,
  ) {
  }

  async getSwaggers(): Promise<Swagger[]> {
    const fromFiles = this.allFromFiles(this.config.files);
    const fromUrls = this.allFromUrls(this.config.urls);

    return [...await fromFiles, ...await fromUrls];
  }

  allFromFiles(files: string[]): Promise<Swagger[]> {
    return Promise.all(files.map(file => this.fromFile(file)));
  }

  allFromUrls(urls: string[]): Promise<Swagger[]> {
    return Promise.all(urls.map(url => this.fromUrl(url)));
  }

  fromFile(filePath: string): Promise<Swagger> {
    console.log(`getting json from ${filePath} ...`);
    return new Promise<string>((resolve, reject) => {
      readFile(filePath, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.toString());
      });
    })
      .then(text => JSON.parse(text))
      .catch(() => console.warn('Error when retrieving file from ', filePath));
  }

  fromUrl(urlString: string): Promise<Swagger> {
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
        .on('error', err => reject(err));
    })
      .then(text => JSON.parse(text))
      .catch(() => console.warn('Error when retrieving url from ', urlString));
  }
}
