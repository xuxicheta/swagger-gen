import { SwaggerDefinitions } from './swagger';

export interface SwaggerV3Object {
  components: {
    schemas: SwaggerDefinitions;
  };
}

export interface InterfaceProperty {
  name: string;
  description: string;
  type: string;
}

export interface EnumProperty {
  name: string;
  value: string;
}

export type Property = InterfaceProperty | EnumProperty;

export interface InterfaceImport {
  importedName: string;
}

export interface Model {
  description?: string;
  name: string;
  properties: (InterfaceProperty | EnumProperty)[];
  imports?: InterfaceImport[];
}

export function isInterfaceProperty(property): property is InterfaceProperty {
  return !!(property?.name && property?.type);
}

export function isEnumProperty(property): property is EnumProperty {
  return !!(property?.name && property?.value);
}

export function isSwaggerV3<T>(swagger): swagger is SwaggerV3Object {
  return !!swagger?.components?.schemas;
}
