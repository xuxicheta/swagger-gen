
import { config } from 'dotenv';
import { Config } from 'types/config.interface';
import { FsOperator } from './utility/fs-operator.class';
import { HttpTransport } from './utility/http-transport.class';
import { InterfaceGenerator } from './workers/interface-generator.class';
import { Templater } from './workers/templater.class';

config();

const DIRS_DEFAULT = './models';

export class SwaggerGen {
  private mustache: Templater;
  private interfaceGenerator: InterfaceGenerator;
  private httpTransport: HttpTransport;
  private fsOperator: FsOperator;

  constructor(
    private config: Config,
  ) {
    this.httpTransport = new HttpTransport();
    this.fsOperator = new FsOperator();
    this.mustache = new Templater(this.config.mustacheDir);
    this.interfaceGenerator = new InterfaceGenerator(this.mustache, this.fsOperator);
  }

  private async run(): Promise<void> {
    try {
      const swaggerJSON = await this.getSwaggerObject(this.config);
      const swaggerObject = JSON.parse(swaggerJSON);
      const modelsDir = this.fsOperator.mkDirModels(this.config.modelsDir);
      this.interfaceGenerator.makeInterfaces(swaggerObject, modelsDir);

    } catch (err) {
      console.error('error');
    }
  }

  private getSwaggerObject(config: Config): Promise<string> {
    if (config.file) {
      return this.fsOperator.readFile(config.file);
    }

    if (config.url) {
      return this.httpTransport.requestObject<string>(config.url);
    }
  }

}
