import { resolve } from 'path';
import { argv } from 'yargs';

export class Config {
  urls: string[] = [];
  files: string[] = [];
  modelsDir = resolve(process.cwd(), 'models');
  templatesDir = resolve(this.rootDir, 'templates');
  apiDir = resolve(process.cwd(), 'api');
  dryRun = false;
  sortFields = false;
  generateApi = false;
  generateTypes = true;
  ignorePrefix = '';

  constructor(
    private rootDir: string
  ) {
    this.argumentsPipeline();
  }

  consoleHelp(): void {
    const options = ['url', 'file', 'templates-dir', 'models-dir', 'dry-run', 'generate-api', 'ignore-prefix', 'help'];
    console.info(` available options: ${options.map(o => '--' + o).join('\n')}`);
    process.exit();
  }

  private argumentsPipeline(): void {
    if (argv.help) {
      return this.consoleHelp();
    }

    this.checkUrlAndFileAvailability(argv.file, argv.url);

    this.sortFields = Boolean(argv.sort);
    this.ignorePrefix = argv.ignorePrefix as string;
    this.generateApi = Boolean(argv.generateApi);
    this.generateTypes = Boolean(argv.generateTypes);
    this.dryRun = Boolean(argv.dryRun);

    this.urls = this.urls.concat(argv.url as string | string[]).filter(Boolean);
    this.files = this.files.concat(argv.file as string | string[]).filter(Boolean);

    this.templatesDir = argv.templatesDir ? argv.templatesDir as string : this.templatesDir;
    this.modelsDir = argv.modelsDir ? argv.modelsDir as string : this.modelsDir;
    this.apiDir = argv.apiDir ? argv.apiDir as string : this.apiDir;
  }

  private checkUrlAndFileAvailability(file: unknown, url: unknown): void {
    if (!file && !url) {
      throw new Error('No file or url');
    }

    if (file && url) {
      throw new Error('Choose one, file or url');
    }
  }
}
