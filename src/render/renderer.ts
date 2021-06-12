import { Config } from '../config/config';
import { Model } from '../types/types';
import { RenderInterface } from './render-interface';
import { RenderEnum } from './render-enum';
import { isEnumProperty, isInterfaceProperty } from './propery-type';

export class Renderer {
  private renderInterface = new RenderInterface(this.config);
  private renderEnum = new RenderEnum(this.config);

  constructor(
    private config: Config,
  ) {
  }

  renderModels(models: Model[]): string[] {
    return models.map(typeObject => this.renderModel(typeObject));
  }

  renderModel(model: Model): string {
    model = this.sortProperties(model);

    if (isInterfaceProperty(model.properties[0])) {
      return this.renderInterface.render(model);
    }
    if (isEnumProperty(model.properties[0])) {
      return this.renderEnum.render(model);
    }

    throw new Error('unknown property ' + model.name);
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
