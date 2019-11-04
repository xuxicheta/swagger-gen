import { get, Response } from 'request';

export class HttpTransport {
  public requestObject<T>(url: string): Promise<T> {
    console.log(`getting json from ${url} ...`);
    return new Promise<T>((resolve: (value: T) => void, reject: (error: Error) => void) => {
      get(url, (err: Error, response: Response, body: string) => {
        return err
          ? reject(err)
          : resolve(JSON.parse(body));
       });
    });
  }
}
