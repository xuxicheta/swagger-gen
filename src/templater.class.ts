import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import { InterfaceImport, InterfaceProperty } from './interface-generator.class';

const MODEL_TEMPLATE = 'mustache/model.mustache';

const customTags = ['<<<', '>>>'];

(mustache.tags as string[]) = customTags;

export interface TemplateInterfaceData {
  description?: string;
  interfaceName: string;
  properties: InterfaceProperty[];
  imports: InterfaceImport[];
}

export class Templater {
  private interfaceTemplate: string;

  constructor() {
    this.paseTemplates();
  }

  public renderInterface(data: TemplateInterfaceData): string {
    return mustache.render(this.interfaceTemplate, data);
  }

  private paseTemplates(): void {
    this.interfaceTemplate = readFileSync(MODEL_TEMPLATE).toString();
    mustache.parse(this.interfaceTemplate);
  }
}
