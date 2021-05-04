import { Config } from './config';
import { ParsedApi } from './parser-api';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as mustache from 'mustache';

export class RenderApi {
  private readonly template = this.parseTemplate(this.config.mustacheDir);

  constructor(
    private config: Config,
  ) {
  }

  renderApi(apis: ParsedApi[]): string[] {
    return apis.map(api => this.render(api));
  }

  render(api: ParsedApi): string {
    return mustache.render(this.template, api);
  }

  private parseTemplate(mustacheDir: string): string {
    return readFileSync(
      resolve(mustacheDir, 'api-service.mustache')
    )
      .toString();
  }
}
