import { argv } from 'yargs';
import { consoleHelp } from 'help';
import { Config } from 'types/config.interface';
import { resolve } from 'path';
import { MODEL_DIRS, MUSTACHE_DIRS } from 'dirs';

export function createConfig(): Config {
  if (argv.help) {
    consoleHelp();
    process.exit();
  }

  checkUrlAndFile(argv);

  const config: Config = {} as Config;

  config.url = argv.url as string;
  config.file = argv.file as string;
  config.mustacheDir = argv.mustacheDir as string || resolve(__dirname, MUSTACHE_DIRS);
  config.modelsDir = argv.modelsDir as string || resolve(process.cwd(), MODEL_DIRS);

  return config;
}

function checkUrlAndFile(_argv: typeof argv): void {
  if (_argv.file || _argv.url) {
    throw new Error('No file or url');
  }

  if (_argv.file && _argv.url) {
    throw new Error('Choose one, file or url');
  }
}
