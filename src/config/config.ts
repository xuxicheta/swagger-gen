import { resolve } from 'path';
import { argv } from 'yargs';

export class Config {
  urls?: string[];
  files?: string[];
  modelsDir: string;
  templatesDir: string;
  apiDir: string;
  dryRun: boolean;
  sortFields = false;
  generateApi = false;
  ignorePrefix = '';

  constructor(
    private rootDir: string
  ) {
    this.argumentsPipeline(rootDir);
  }

  consoleHelp(): void {
    const options = ['url', 'file', 'templates-dir', 'models-dir', 'dry-run', 'generate-api', 'ignore-prefix', 'help'];
    console.info(` available options: ${options.map(o => '--' + o).join('\n')}`);
    process.exit();
  }

  private argumentsPipeline(rootDir: string): void {
    const {
      help,
      ignorePrefix,
      generateApi,
      dryRun,
      file,
      url,
      sort,
      templatesDir,
      modelsDir,
      apiDir,
    } = argv;

    if (help) {
      return this.consoleHelp();
    }

    this.checkUrlAndFile(file, url);

    this.sortFields = Boolean(sort);
    this.ignorePrefix = ignorePrefix as string;
    this.generateApi = Boolean(generateApi);
    this.dryRun = Boolean(dryRun);

    this.urls = [].concat(url as string | string[]).filter(Boolean);
    this.files = [].concat(file as string | string[]).filter(Boolean);

    this.templatesDir = templatesDir as string || resolve(rootDir, 'templates');
    this.modelsDir = modelsDir as string || resolve(process.cwd(), 'models');
    this.apiDir = apiDir as string || resolve(process.cwd(), 'api');
  }

  private checkUrlAndFile(file: unknown, url: unknown): void {
    if (!file && !url) {
      throw new Error('No file or url');
    }

    if (file && url) {
      throw new Error('Choose one, file or url');
    }
  }
}
