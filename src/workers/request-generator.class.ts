import { Templater } from './templater.class';
import { FsOperator } from '../utility/fs-operator.class';
import { Swagger } from '../types/swagger';

export class InterfaceGenerator {

  constructor(
    private templater: Templater,
    private fsOperator: FsOperator,
  ) { }

  public makeRequests(swaggerObject: Swagger, dir: string): void {
    console.log('writing requests in ', dir);
  }
}