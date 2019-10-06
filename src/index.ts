import { SwaggerGen } from './swagger-gen';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const swaggerGen = new SwaggerGen();
swaggerGen.run();
