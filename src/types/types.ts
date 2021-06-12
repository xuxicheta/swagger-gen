export interface InterfaceProperty {
  name: string;
  description: string|undefined;
  type: string;
  nullable?: boolean|undefined;
}

export interface EnumProperty {
  name: string;
  value: string;
}

export interface InterfaceImport {
  importedName: string;
}

export interface Model {
  description?: string;
  name: string;
  properties: (InterfaceProperty | EnumProperty)[];
  imports?: InterfaceImport[];
}
