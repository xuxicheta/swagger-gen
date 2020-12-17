import { InterfaceGenerator } from './workers/interface-generator.class';
import { Config } from './utility/config.class';
import { SwaggerRetriever } from './utility/swagger-retriever.class';
import { Output } from './utility/output.class';

export class SwaggerGen {
  constructor(
    private config: Config,
    private output: Output,
    private retriever: SwaggerRetriever,
    private interfaceGenerator: InterfaceGenerator,
  ) {
  }

  public async run(): Promise<void> {
    try {
      this.output.makeModelsDirectory(this.config.modelsDir);

      const count = this.interfaceGenerator.makeTypes(
        await this.retriever.getSwagger(this.config),
        this.config.modelsDir,
      );

      console.log(`${count} models successfully created`);

    } catch (err) {
      console.error(err);
    }
  }
}
