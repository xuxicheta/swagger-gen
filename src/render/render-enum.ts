import { Config } from '../config/config';
import { Model } from '../types/types';
import * as mustache from 'mustache';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class RenderEnum {
  private template = this.parseTemplate(this.config.templatesDir);

  constructor(
    private config: Config,
  ) {
  }

  render(typeObject: Model): string {
    return mustache.render(this.template, typeObject);
  }

  private parseTemplate(mustacheDir: string): string {
    return readFileSync(
      resolve(mustacheDir, 'enum-model.mustache')
    )
      .toString();
  }
}
