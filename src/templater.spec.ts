import { TemplateInterfaceData, Templater } from './templater.class';

const emptyData: TemplateInterfaceData = {
  interfaceName: 'TestInterface',
  properties: [],
  imports: [],
};

describe('class should be created', () => {

  it('created', () => {
    const templater = new Templater();
    expect(templater).toBeInstanceOf(Templater);
  });

});

describe('templating interface', () => {
  it('render interface without properties and exports', () => {
    const templater = new Templater();
    const result = templater.renderInterface(emptyData);
    expect(result).toEqual('export interface TestInterface {\n}');
  });
});
