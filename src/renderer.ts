import { Config } from './config';
import { isEnumProperty, isInterfaceProperty, Model } from './types/types';
import { RenderInterface } from './render-interface';
import { RenderEnum } from './render-enum';

export class Renderer {
  private renderInterface = new RenderInterface(this.config);
  private renderEnum = new RenderEnum(this.config);

  constructor(
    private config: Config,
  ) {
  }

  renderModels(typeObjects: Model[]): string[] {
    return typeObjects.map(typeObject => this.renderTypeObject(typeObject));
  }

  renderTypeObject(typeObject: Model): string {
    typeObject = this.sortProperties(typeObject);

    if (isInterfaceProperty(typeObject.properties[0])) {
      return this.renderInterface.render(typeObject);
    }
    if (isEnumProperty(typeObject.properties[0])) {
      return this.renderEnum.render(typeObject);
    }
  }

  private sortProperties(typeObject: Model): Model {
    if (this.config.sortFields) {
      typeObject = {
        ...typeObject,
        properties: [...typeObject.properties].sort((a, b) => a.name.localeCompare(b.name)),
      };
    }
    return typeObject;
  }
}
