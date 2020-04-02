
import { FsOperator } from './utility/fs-operator.class';
import { HttpTransport } from './utility/http-transport.class';
import { InterfaceGenerator } from './workers/interface-generator.class';
import { Templater } from './workers/templater.class';
import { Config } from './types/config.interface';
import { Swagger } from './types/swagger';

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

  public async run(): Promise<void> {
    try {
      const swaggerObject: Swagger = await this.getSwaggerObject(this.config);
      const modelsDir: string = this.fsOperator.mkDirModels(this.config.modelsDir);
      this.interfaceGenerator.makeInterfaces(swaggerObject, modelsDir);

    } catch (err) {
      console.error(err);
    }
  }

  private getSwaggerObject(config: Config): Promise<Swagger> {
    if (config.file) {
      return this.fsOperator.readFile(config.file)
        .then(JSON.parse);
    }

    if (config.url) {
      return this.httpTransport.requestObject<Swagger>(config.url);
    }
  }

}
