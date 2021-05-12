import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Config } from '../config/config';
import { Model } from '../types/types';
import * as mustache from 'mustache';

export class RenderInterface {
  private template = this.parseTemplate(this.config.mustacheDir);

  constructor(
    private config: Config,
  ) {
  }

  render(typeObject: Model): string {
    return mustache.render(this.template, typeObject);
  }

  private parseTemplate(mustacheDir: string): string {
    return readFileSync(
      resolve(mustacheDir, 'interface-model.mustache')
    )
      .toString();
  }
}
