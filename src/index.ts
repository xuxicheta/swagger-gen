import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { SwaggerGen } from './swagger-gen';
import { createConfig } from './utility/args';

const rootDir = join(__dirname, '..', '..');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenvConfig();

const config = createConfig(rootDir);

const swaggerGen = new SwaggerGen(config);
swaggerGen.run();
