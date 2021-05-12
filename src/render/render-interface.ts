import { Config } from '../config/config';
import { Model } from '../types/types';
import * as mustache from 'mustache';
import { readTemplate } from './read-template';

export class RenderInterface {
  private readonly template = readTemplate(this.config, 'interface-model.mustache');
  private readonly interfacePartial = readTemplate(this.config, 'interface-partial.mustache');
  private readonly importsPartial = readTemplate(this.config, 'imports-partial.mustache');

  constructor(
    private config: Config,
  ) {
  }

  render(typeObject: Model): string {
    return mustache.render(
      this.template,
      typeObject,
      {
        interface: this.interfacePartial,
        imports: this.importsPartial,
      }
    );
  }
}
