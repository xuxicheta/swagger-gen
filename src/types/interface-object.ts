export interface InterfaceObject {
  name: string;
  description?: string;
  properties?: {
    name: string;
    description?: string;
    type: string;
    nullable?: boolean;
  }[];
}
