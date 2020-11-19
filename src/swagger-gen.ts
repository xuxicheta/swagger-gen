
import { FsOperator } from './utility/fs-operator.class';
import { HttpTransport } from './utility/http-transport.class';
import { TypesGenerator } from './workers/interface-generator.class';
import { Templater } from './workers/templater.class';
import { Config } from './types/config.interface';
import { Swagger } from './types/swagger';

export class SwaggerGen {
  private readonly mustache = new Templater(this.config.mustacheDir);
  private readonly fsOperator = new FsOperator();
  private typesGenerator = new TypesGenerator(this.mustache, this.fsOperator);
  private httpTransport = new HttpTransport();

  constructor(
    private config: Config,
  ) {
  }

  public async run(): Promise<void> {
    try {
      const swaggerObject: Swagger = await this.getSwaggerObject(this.config);
      const modelsDir: string = this.fsOperator.mkDirModels(this.config.modelsDir);
      this.typesGenerator.makeTypes(swaggerObject, modelsDir);

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
