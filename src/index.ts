import { resolve } from 'path';
import { SwaggerGen } from './swagger-gen';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



const modelsDirPath = resolve(__dirname, '../..', 'models');
const templateDirPath = resolve(__dirname, '../..', 'mustache');

const swaggerGen = new SwaggerGen(modelsDirPath, templateDirPath);
swaggerGen.run();
