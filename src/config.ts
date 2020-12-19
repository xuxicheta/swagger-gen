import { resolve } from 'path';
import { argv } from 'yargs';

export class Config {
  urls?: string[];
  files?: string[];
  modelsDir: string;
  mustacheDir: string;
  dryRun: boolean;
  private readonly MODEL_DIR = 'models';
  private readonly MUSTACHE_DIR = 'mustache';

  constructor(rootDir: string) {
    if (argv.help) {
      this.consoleHelp();
      process.exit();
      return;
    }

    this.checkUrlAndFile(argv);

    this.urls = [].concat(argv.url as string | string[]).filter(Boolean);
    this.files = [].concat(argv.file as string | string[]).filter(Boolean);
    this.mustacheDir = argv.mustacheDir as string || resolve(rootDir, this.MUSTACHE_DIR);
    this.modelsDir = argv.modelsDir as string || resolve(process.cwd(), this.MODEL_DIR);
    this.dryRun = argv.dryRun as boolean;
  }

  checkUrlAndFile(_argv: typeof argv): void {
    if (!(_argv.file || _argv.url)) {
      throw new Error('No file or url');
    }

    if (_argv.file && _argv.url) {
      throw new Error('Choose one, file or url');
    }
  }

  consoleHelp(): void {
    const options = ['url', 'file', 'mustache-dir', 'models-dir', 'dry-run', 'help'];
    console.info(` available options: ${options.map(o => '--' + o).join('\n')}`);
  }
}
