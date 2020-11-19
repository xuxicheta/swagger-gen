import { FsOperator } from './utility/fs-operator.class';
import { TypesGenerator } from './workers/interface-generator.class';
import { Templater } from './workers/templater.class';
import { Config } from './types/config.interface';
import { getSwagger } from './utility/get-swagger';
import { makeModelsDirectory } from './utility/make-models-directory';

export class SwaggerGen {
  private readonly mustache = new Templater(this.config.mustacheDir);
  private readonly fsOperator = new FsOperator();
  private readonly typesGenerator = new TypesGenerator(this.mustache, this.fsOperator);

  constructor(
    private config: Config,
  ) {
  }

  public async run(): Promise<void> {
    try {
      const swaggerObject = await getSwagger(this.config);
      const modelsDir = makeModelsDirectory(this.config.modelsDir);
      this.typesGenerator.makeTypes(swaggerObject, modelsDir);

    } catch (err) {
      console.error(err);
    }
  }
}
