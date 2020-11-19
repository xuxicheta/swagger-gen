import { get } from 'http';

export class HttpTransport {
  public requestObject<T>(url: string): Promise<T> {
    console.log(`getting json from ${url} ...`);
    return new Promise<T>((resolve: (value: T) => void, reject: (error: Error) => void) => {
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
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            console.error(e.message);
          }
        });
      })
        .on('error', (e) => {
          reject(new Error(`Got error: ${e.message}`));
        });
    });
  }
}
