import { AnySwagger, Swagger2, Swagger3 } from '../../types/swagger';

export const stubSwagger2 = (): Swagger2 => ({
  paths: {},
  basePath: '123',
  definitions: {},
  host: '123',
  info: {
    version: '1',
    description: '',
    title: '',
  },
  schemes: [],
  swagger: '2.0.0',
});

export const stubSwagger3 = (): Swagger3 => ({
  paths: {},
  info: {
    version: '1',
    description: '',
    title: '',
  },
  openapi: '3.0.1',
  components: {
    schemas: {},
  }
});

export const stubSwagger = (): AnySwagger => {
  return Math.random() > 0.5
    ? stubSwagger2()
    : stubSwagger3();
};
