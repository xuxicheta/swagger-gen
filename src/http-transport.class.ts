import { get, Response } from 'request';
import { Swagger } from './swagger';

export class HttpTransport {
  public requestSwaggerObject(swaggerUrl): Promise<Swagger> {
    console.log(`getting json from ${swaggerUrl} ...`);
    return new Promise<Swagger>((resolve: (value: Swagger) => void, reject: (error: Error) => void) => {
      get(swaggerUrl, (err: Error, response: Response, body: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }
}
