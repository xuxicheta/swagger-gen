import { Retriever } from './retriever';
import { Parser } from './parser';
import { Renderer } from './renderer';
import { Saver } from './saver';
import { Swagger } from './types/swagger';
import { TypeObject } from './types/types';

export class Pipe {
  constructor(
  private retriever: Retriever,
  private parser: Parser,
  private renderer: Renderer,
  private saver: Saver,
  ) {
  }

  public async run(): Promise<void> {
    try {
      const swaggers: Swagger[] = await this.retriever.getSwaggers();
      const typeObjects: TypeObject[] = this.parser.parseAll(swaggers);
      const fileStrings: string[] = this.renderer.renderAll(typeObjects);
      this.saver.saveAll(typeObjects, fileStrings);
    } catch (err) {
      console.error(err);
    }
  }
}
