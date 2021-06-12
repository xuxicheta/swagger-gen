import { Swagger2, Swagger3 } from '../types/swagger';

/** @internal */
export function isSwagger2(swagger: any): swagger is Swagger2 {
  return parseInt(swagger.swagger, 10) === 2;
}

/** @internal */
export function isSwagger3(swagger: any): swagger is Swagger3 {
  return parseInt(swagger.openapi, 10) === 3;
}
