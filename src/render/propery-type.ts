import { EnumProperty, InterfaceProperty } from '../types/types';

export function isInterfaceProperty(property: any): property is InterfaceProperty {
  return !!(property?.name && property?.type);
}

export function isEnumProperty(property: any): property is EnumProperty {
  return !!(property?.name && property?.value);
}
