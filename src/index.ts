#!/usr/bin/env node
import { createConfig } from './utility/create-config';
import { SwaggerGen } from './swagger-gen';
import { join } from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const rootDir = join(__dirname, '..', '..');

const config = createConfig(rootDir);

const swaggerGen = new SwaggerGen(config);

export default swaggerGen.run();
