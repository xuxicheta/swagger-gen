import { TemplateInterfaceData } from '../../../src/workers/templater.class';

export const templaterDummy2: TemplateInterfaceData = {
  name: 'TestInterface2',
  properties: [
    { name: 'prop1', description: 'desc prop1', type: 'number' },
    { name: 'prop2', description: undefined, type: 'string' },
    { name: 'prop3', description: 'lala', type: 'boolean' },
  ],
  imports: [],
};
