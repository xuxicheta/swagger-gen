import { resolve } from 'path';
import { argv } from 'yargs';
import { consoleHelp } from '../console-help';

export class Config {
  private readonly MODEL_DIR = 'models';
  private readonly API_DIR = 'api';
  private readonly MUSTACHE_DIR = 'mustache';
  url?: string;
  file?: string;
  modelsDir: string;
  mustacheDir: string;

  constructor(rootDir: string) {
    if (argv.help) {
      consoleHelp();
      process.exit();
    }

    this.checkUrlAndFile(argv);

    this.url = argv.url as string;
    this.file = argv.file as string;
    this.mustacheDir = argv.mustacheDir as string || resolve(rootDir, this.MUSTACHE_DIR);
    this.modelsDir = argv.modelsDir as string || resolve(process.cwd(), this.MODEL_DIR);
  }

  checkUrlAndFile(_argv: typeof argv): void {
    if (!(_argv.file || _argv.url)) {
      throw new Error('No file or url');
    }

    if (_argv.file && _argv.url) {
      throw new Error('Choose one, file or url');
    }
  }
}
