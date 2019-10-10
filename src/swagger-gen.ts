
import { config } from 'dotenv';
import { argv } from 'yargs';
import { FsOperator } from './fs-operator.class';
import { consoleHelp } from './help';
import { HttpTransport } from './http-transport.class';
import { InterfaceGenerator } from './interface-generator.class';
import { Swagger } from './swagger';
import { Templater } from './templater.class';

config();

const DIRS_DEFAULT = 'models';

export class SwaggerGen {
  private swaggerObject: Swagger;
  private dir: string;
  private url: string;

  private mustache: Templater;
  private interfaceGenerator: InterfaceGenerator;
  private httpTransport: HttpTransport;
  private fsOperator: FsOperator;

  constructor() {
    this.httpTransport = new HttpTransport();
    this.fsOperator = new FsOperator();
    this.mustache = new Templater();
    this.interfaceGenerator = new InterfaceGenerator(this.mustache);
  }

  public run(): void {
    this.dir = argv.dir as string || DIRS_DEFAULT;
    this.url = argv.url as string || process.env[argv.env as string];
    this.lookAtArgument();
  }

  private async lookAtArgument(): Promise<void> {
    if (argv.help) {
      consoleHelp();
      return;
    }

    if (!this.url) {
      throw new Error('url not found in environment');
    }

    this.swaggerObject = await this.httpTransport.requestObject(this.url);
    const existedDir = this.fsOperator.mkDirModels(this.dir);
    this.interfaceGenerator.makeInterfaces(this.swaggerObject, existedDir);
  }

}
