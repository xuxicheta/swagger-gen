import { resolve } from 'path';
import { argv } from 'yargs';

export class Config {
  urls?: string[];
  files?: string[];
  modelsDir: string;
  mustacheDir: string;
  apiDir: string;
  dryRun: boolean;
  sortFields = false;
  generateApi = false;
  ignorePrefix = '';
  private readonly MODEL_DIR = 'models';
  private readonly TEMPLATES_DIR = 'templates';
  private readonly API_DIR = 'api';

  constructor(rootDir: string) {
    this.argumentsPipeline(rootDir);
  }

  argumentsPipeline(rootDir: string): void {
    if (argv.help) {
      return this.consoleHelp();
    }

    this.sortFields = !!argv.sort;
    this.ignorePrefix = argv.ignorePrefix as string;
    this.generateApi = !!argv.generateApi;
    this.dryRun = !!argv.dryRun;

    this.fillUrlAndFile(argv);
    this.fillDirs(rootDir);
  }

  fillUrlAndFile(_argv: typeof argv): void {
    if (!(_argv.file || _argv.url)) {
      throw new Error('No file or url');
    }

    if (_argv.file && _argv.url) {
      throw new Error('Choose one, file or url');
    }

    this.urls = [].concat(argv.url as string | string[]).filter(Boolean);
    this.files = [].concat(argv.file as string | string[]).filter(Boolean);
  }

  fillDirs(rootDir: string): void {
    this.mustacheDir = argv.templatesDir as string || resolve(rootDir, this.TEMPLATES_DIR);
    this.modelsDir = argv.modelsDir as string || resolve(process.cwd(), this.MODEL_DIR);
    this.apiDir = argv.apiDir as string || resolve(process.cwd(), this.API_DIR);
  }

  consoleHelp(): void {
    const options = ['url', 'file', 'templates-dir', 'models-dir', 'dry-run', 'generate-api', 'ignore-prefix', 'help'];
    console.info(` available options: ${options.map(o => '--' + o).join('\n')}`);
    process.exit();
  }
}
