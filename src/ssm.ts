import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class SSMParameter extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.SSM_PARAMETER, template, props);
  }

  public of(type: string): SSMParameter {
    return this.setProperty('Type', type) as SSMParameter;
  }

  public withValue(value: any): SSMParameter {
    return this.setProperty('Value', value) as SSMParameter;
  }
}