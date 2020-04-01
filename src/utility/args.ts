import { resolve } from 'path';
import { argv } from 'yargs';
import { MODEL_DIR, MUSTACHE_DIR } from '../defaults';
import { consoleHelp } from '../help';
import { Config } from '../types/config.interface';

export function createConfig(rootDir: string): Config {
  if (argv.help) {
    consoleHelp();
    process.exit();
  }

  checkUrlAndFile(argv);

  const config: Config = {} as Config;

  config.url = argv.url as string;
  config.file = argv.file as string;
  config.mustacheDir = argv.mustacheDir as string || resolve(rootDir, MUSTACHE_DIR);
  config.modelsDir = argv.modelsDir as string || resolve(process.cwd(), MODEL_DIR);

  return config;
}

function checkUrlAndFile(_argv: typeof argv): void {
  if (!(_argv.file || _argv.url)) {
    throw new Error('No file or url');
  }

  if (_argv.file && _argv.url) {
    throw new Error('Choose one, file or url');
  }
}
