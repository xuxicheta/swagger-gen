import { TemplateInterfaceData } from '../../../src/workers/templater.class';

export const templaterDummy3: TemplateInterfaceData = {
  interfaceName: 'TestInterface3',
  properties: [
    { name: 'prop1', description: 'test1 prop', type: 'TestInterface1' },
    { name: 'prop2', description: '', type: 'TestInterface2' },
  ],
  imports: [
    { importedName: 'TestInterface1' },
    { importedName: 'TestInterface2' },
  ],
};
