import { resolve } from 'path';
import { SwaggerGen } from './swagger-gen';
import { createConfig } from 'utility/args';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config = createConfig();

const swaggerGen = new SwaggerGen(config);
swaggerGen.run();
