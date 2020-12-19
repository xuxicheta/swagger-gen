import { Config } from './config';
import yargs from 'yargs';
import * as path from 'path';

//
// jest.mock('yargs');

describe('Config', () => {
  const rootDir = process.cwd();

  it('should be created with a url', () => {
    yargs(['--file=preved']);
    const config = new Config(rootDir);
    expect(config).toBeDefined();
  });

  it('should be created with a file', () => {
    yargs(['--url=preved']);
    const config = new Config(rootDir);
    expect(config).toBeDefined();
  });

  it('should call consoleHelp when arg --help provided', () => {
    yargs(['--help']);
    const consoleHelpSpy = jest.spyOn(Config.prototype, 'consoleHelp').mockImplementation(() => undefined);
    // const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((c?: number) => void 0 as unknown as never));
    const config = new Config(rootDir);
    expect(consoleHelpSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalled();
  });

  it('should throw error when neither url nor file provided ', () => {
    yargs(['']);
    expect(() => new Config(rootDir)).toThrow();
  });

  it('should set urls', () => {
    yargs(['--url=preved', '--url=sosed']);
    const config = new Config(rootDir);
    expect(config.urls).toEqual(['preved', 'sosed']);
  });

  it('should set files', () => {
    yargs(['--file=preved', '--file=sosed']);
    const config = new Config(rootDir);
    expect(config.files).toEqual(['preved', 'sosed']);
  });

  it('should set modelsDir', () => {
    yargs(['--models-dir=sobe', '--url=x']);
    const config = new Config('/');
    expect(config.modelsDir).toEqual('sobe');
  });

  it('should set default modelsDir', () => {
    yargs(['--url=x']);
    const config = new Config('/');
    expect(config.modelsDir).toEqual(path.resolve(process.cwd(), 'models'));
  });

  it('should set mustacheDir', () => {
    yargs(['--mustache-dir=okom', '--url=x']);
    const config = new Config('/');
    expect(config.mustacheDir).toEqual('okom');
  });

  it('should set default mustacheDir', () => {
    yargs(['--url=x']);
    const config = new Config('/');
    expect(config.mustacheDir).toEqual(path.resolve('/', 'mustache'));
  });
});
