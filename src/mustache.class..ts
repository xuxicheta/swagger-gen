import { readFileSync } from 'fs';
import * as mustache from 'mustache';

const MODEL_TEMPLATE = 'mustache/model.mustache';

const customTags = ['<<<', '>>>'];

(mustache.tags as string[]) = customTags;

export class Mustache {
  public interfaceTemplate: string;

  constructor() {
    this.paseTemplates();
  }

  public renderInterface(data): string {
    return mustache.render(this.interfaceTemplate, data);
  }

  private paseTemplates(): void {
    this.interfaceTemplate = readFileSync(MODEL_TEMPLATE).toString();
    mustache.parse(this.interfaceTemplate);
  }
}
