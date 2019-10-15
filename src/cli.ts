#!/usr/bin/env node
import {join} from 'path';
import { SwaggerGen } from './swagger-gen';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log(__dirname);

const swaggerGen = new SwaggerGen(
  join(__dirname, 'models'),
  join(__dirname, 'mustache'),
);
swaggerGen.run();
