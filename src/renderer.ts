import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import { resolve } from 'path';
import { Config } from './config';
import { isEnumProperty, isInterfaceProperty, TypeObject } from './types/types';

export class Renderer {
  private interfaceTemplate: string;
  private enumTemplate: string;

  constructor(
    private config: Config,
  ) {
    this.parseTemplates(this.config.mustacheDir);
  }

  renderAll(typeObjects: TypeObject[]): string[] {
    return typeObjects.map(typeObject => this.renderTypeObject(typeObject));
  }

  renderTypeObject(typeObject: TypeObject): string {
    if (isInterfaceProperty(typeObject.properties[0])) {
      return this.renderInterface(typeObject);
    }
    if (isEnumProperty(typeObject.properties[0])) {
      return this.renderEnum(typeObject);
    }
  }

  renderInterface(typeObject: TypeObject): string {
    return mustache.render(this.interfaceTemplate, typeObject);
  }

  renderEnum(typeObject: TypeObject): string {
    return mustache.render(this.enumTemplate, typeObject);
  }

  private parseTemplates(mustacheDir: string): void {
    this.interfaceTemplate = readFileSync(
      resolve(mustacheDir, 'interface-model.mustache')
    )
      .toString();

    this.enumTemplate = readFileSync(
      resolve(mustacheDir, 'enum-model.mustache')
    )
      .toString();
  }
}
