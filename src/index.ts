#!/usr/bin/env node

import { SwaggerGen } from './swagger-gen';
import { join } from 'path';
import { Config } from './utility/config.class';
import { Templater } from './workers/templater.class';
import { InterfaceGenerator } from './workers/interface-generator.class';
import { SwaggerRetriever } from './utility/swagger-retriever.class';
import { Output } from './utility/output.class';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const rootDir = join(__dirname, '..', '..');

const config = new Config(rootDir);

const mustache = new Templater(config);
const output = new Output();
const interfaceGenerator = new InterfaceGenerator(mustache, output);
const retriever = new SwaggerRetriever();

const swaggerGen = new SwaggerGen(
  config,
  output,
  retriever,
  interfaceGenerator,
);

export default swaggerGen.run();
