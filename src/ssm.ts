import { Match } from "aws-cdk-lib/assertions";
import { ParameterDataType, ParameterType } from "aws-cdk-lib/aws-ssm";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class SSMParameter extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.SSM_PARAMETER, template, props);
  }

  public of(type: ParameterType): SSMParameter {
    if (type === ParameterType.AWS_EC2_IMAGE_ID) {
      this.setProperty('DataType', ParameterDataType.AWS_EC2_IMAGE);
      this.setProperty('Type', ParameterType.STRING);
    } else {
      this.setProperty('Type', type);
    }
    return this;
  }

  public withName(name: string): SSMParameter {
    return this.setProperty('Name', name) as SSMParameter;
  }

  public withValue(value: any): SSMParameter {
    return this.setProperty('Value', value) as SSMParameter;
  }

  public withListValue(value: any | any[]): SSMParameter {
    return this.setProperty(
      'Value',
      Array.isArray(value)
        ? value.join(',')
        : Match.stringLikeRegexp(value)
    ) as SSMParameter;
  }
}