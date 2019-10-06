import { Swagger } from "./swagger";
import { get } from 'request';

export function requestSwaggerObject(swaggerUrl): Promise<Swagger> {
  console.log(`getting json from ${swaggerUrl} ...`);
  return new Promise((resolve, reject) => {
    get(swaggerUrl, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(response.body));
      }
    })
  });
}