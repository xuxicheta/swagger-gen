import { get, RequestCallback } from 'request';
import { HttpTransport } from '../src/http-transport.class';

jest.mock('request');
type Resolved = { body: string };
type Get = (uri: string, callback?: RequestCallback) => Resolved;

const mockedGet: jest.MockInstance<Get, any> = get as any;

describe('class should be created', () => {
  it('created', () => {
    const httpTransport = new HttpTransport();
    expect(httpTransport).toBeInstanceOf(HttpTransport);
  });
});

describe('class should work', () => {
  it('request', async () => {
    const resp = { body: 'body' };
    // @ts-ignore
    mockedGet.mockResolvedValue(resp as any);
    const swaggerUrl = 'http://xxx';
    const httpTransport = new HttpTransport();
    const result = await httpTransport.requestObject<Resolved>(swaggerUrl);
    expect(result).toEqual(resp);
  });
});
