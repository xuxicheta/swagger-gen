import { get, RequestCallback, Response } from 'request';
import { HttpTransport } from './http-transport.class';

interface ResolvedResponse {
  body: string;
}
type MockedGet = (uri: string, callback?: RequestCallback) => ResolvedResponse;

jest.mock('request');

// tslint:disable-next-line: no-any
const mockedGet: jest.MockedFunction<MockedGet> = get as any;

describe('class should be created', () => {
  it('created', () => {
    const httpTransport = new HttpTransport();
    expect(httpTransport).toBeInstanceOf(HttpTransport);
  });
});

describe('class should work', () => {

  it('request success', () => {
    const bodyObject = { data: 'data body' };
    const body = JSON.stringify(bodyObject);
    mockedGet.mockImplementationOnce((uri: string, callback) => {
      callback(null, { body } as Response, body);
      return null;
    });
    const httpTransport = new HttpTransport();
    const result = httpTransport.requestObject<ResolvedResponse>('http://xxx');
    return expect(result).resolves.toEqual(bodyObject);
  });

  it('request failure', async () => {
    const bodyObject = { data: 'data body' };
    const body = JSON.stringify(bodyObject);
    const error = new Error('404');
    mockedGet.mockImplementationOnce((uri: string, callback) => {
      callback(error, { body } as Response, body);
      return null;
    });
    const httpTransport = new HttpTransport();
    const result = httpTransport.requestObject<ResolvedResponse>('http://xxx');
    return expect(result).rejects.toEqual(error);
  });
});
