#!/usr/bin/env node

import { join } from 'path';
import { Retriever } from './retriever';
import { Parser } from './parse/parser';
import { Renderer } from './render/renderer';
import { Saver } from './save/saver';
import { Pipe } from './pipe';
import { Config } from './config/config';
import { ParserApi } from './parse/parser-api';
import { RenderApi } from './render/render-api';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const rootDir = join(__dirname, '..', '..');

const config = new Config(rootDir);

const pipe = new Pipe(
  config,
  new Parser(),
  new ParserApi(config),
  new Renderer(config),
  new RenderApi(config),
  new Saver(config),
);

export default pipe.run();
