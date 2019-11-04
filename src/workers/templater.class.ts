import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import { resolve } from 'path';
import { InterfaceImport, InterfaceProperty } from './interface-generator.class';

export interface TemplateInterfaceData {
  description?: string;
  interfaceName: string;
  properties: InterfaceProperty[];
  imports: InterfaceImport[];
}

export class Templater {
  private interfaceTemplate: string;

  constructor(
    private templateDirPath: string,
  ) {
    this.paseTemplates();
  }

  public renderInterface(data: TemplateInterfaceData): string {
    return mustache.render(this.interfaceTemplate, data);
  }

  private paseTemplates(): void {
    this.interfaceTemplate = readFileSync(resolve(this.templateDirPath, 'model.mustache')).toString();
    mustache.parse(this.interfaceTemplate);
  }
}
