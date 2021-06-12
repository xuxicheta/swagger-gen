import { Model } from '../../types/types';

export const stubModel = (): Model => ({
  imports: [{
    importedName: 'importedName',
  }],
  properties: [
    {
      description: 'description',
      name: 'name',
      type: 'string',
      value: 'value',
    }
  ],
  description: 'qwerty',
  name: 'prop1',
});
