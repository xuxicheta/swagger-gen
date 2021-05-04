#!/usr/bin/env node

import { join } from 'path';
import { Retriever } from './retriever';
import { Parser } from './parser';
import { Renderer } from './renderer';
import { Saver } from './saver';
import { Pipe } from './pipe';
import { Config } from './config';
import { ParserApi } from './parser-api';
import { RenderApi } from './render-api';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const rootDir = join(__dirname, '..', '..');

const config = new Config(rootDir);

const pipe = new Pipe(
  config,
  new Retriever(config),
  new Parser(),
  new ParserApi(config),
  new Renderer(config),
  new RenderApi(config),
  new Saver(config),
);

export default pipe.run();
