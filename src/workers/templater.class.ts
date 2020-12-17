import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import { resolve } from 'path';
import { Config } from 'src/utility/config.class';
import { EnumProperty, InterfaceImport, InterfaceProperty } from './interface-generator.class';

export interface TemplateTypeData {
  description?: string;
  name: string;
}

export interface TemplateInterfaceData extends TemplateTypeData {
  properties: InterfaceProperty[];
  imports: InterfaceImport[];
}

export interface TemplateEnumData extends TemplateTypeData {
  properties: EnumProperty[];
}

export class Templater {
  private interfaceTemplate: string;
  private enumTemplate: string;

  constructor(
    private config: Config,
  ) {
    this.paseTemplates();
  }

  public renderInterface(data: TemplateInterfaceData): string {
    return mustache.render(this.interfaceTemplate, data);
  }

  public renderEnum(data: TemplateEnumData): string {
    return mustache.render(this.enumTemplate, data);
  }

  private paseTemplates(): void {
    this.interfaceTemplate = readFileSync(resolve(this.config.mustacheDir, 'interface-model.mustache')).toString();
    this.enumTemplate = readFileSync(resolve(this.config.mustacheDir, 'enum-model.mustache')).toString();
  }
}
