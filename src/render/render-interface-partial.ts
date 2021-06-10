import { Config } from '../config/config';
import * as mustache from 'mustache';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { InterfaceObject } from '../types/interface-object';

export class RenderInterfacePartial {
  private template = this.parseTemplate(this.config.templatesDir);

  constructor(
    private config: Config,
  ) {
  }

  render(interfaceObject: InterfaceObject): string {
    return mustache.render(this.template, interfaceObject);
  }

  private parseTemplate(mustacheDir: string): string {
    return readFileSync(
      resolve(mustacheDir, 'interface-partial.mustache')
    )
      .toString();
  }
}
