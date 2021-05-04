import { Retriever } from './retriever';
import { Parser } from './parser';
import { Renderer } from './renderer';
import { Saver } from './saver';
import { Swagger } from './types/swagger';
import { Model } from './types/types';
import { ParserApi } from './parser-api';
import { RenderApi } from './render-api';
import { Config } from './config';

export class Pipe {
  constructor(
    private config: Config,
    private retriever: Retriever,
    private parser: Parser,
    private parserApi: ParserApi,
    private renderer: Renderer,
    private renderApi: RenderApi,
    private saver: Saver,
  ) {
  }

  public async run(): Promise<void> {
    try {
      const swaggers: Swagger[] = await this.retriever.getSwaggers();

      this.runTypes(swaggers);
      this.runApis(swaggers, this.config.generateApi);
    } catch (err) {
      console.error(err);
    }
  }

  runTypes(swaggers: Swagger[]): void {
    const models: Model[] = this.parser.parseModels(swaggers);
    const modelStrings: string[] = this.renderer.renderModels(models);
    this.saver.saveModels(models, modelStrings);
  }

  runApis(swaggers: Swagger[], generateApi: boolean): void {
    if (!generateApi) {
      return;
    }
    const apis = this.parserApi.parse(swaggers);
    const apiStrings: string[] = this.renderApi.renderApi(apis);
    this.saver.saveApis(apis, apiStrings);
  }
}
