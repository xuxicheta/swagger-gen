import { join } from 'path';
import { SwaggerGen } from './swagger-gen';
import { createConfig } from './utility/create-config';

const rootDir = join(__dirname, '..', '..');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config = createConfig(rootDir);

const swaggerGen = new SwaggerGen(config);
swaggerGen.run();
