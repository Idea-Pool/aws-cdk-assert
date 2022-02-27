import { Match } from "aws-cdk-lib/assertions";
import { CfnParameter, ParameterDataType, ParameterType } from "aws-cdk-lib/aws-ssm";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * A test constuct for an SSM Parameter (the resulting CfnParameter).
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ssm.CfnParameter.html}
 */
export class SSMParameter extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnParameter.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching type for the parameter
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ssm.ParameterType.html}
   * @param type The parameter type
   * @returns 
   */
  public of(type: ParameterType) {
    if (type === ParameterType.AWS_EC2_IMAGE_ID) {
      this.setProperty('DataType', ParameterDataType.AWS_EC2_IMAGE);
      this.setProperty('Type', ParameterType.STRING);
    } else {
      this.setProperty('Type', type);
    }
    return this;
  }

  /**
   * Sets a matching name of the parameter
   * @param name Either the whole or a partial name
   * @returns 
   */
  public withName(name: string) {
    this.setProperty('Name', Match.stringLikeRegexp(name));
    return this;
  }

  /**
   * Sets a matching value of the parameter
   * @param value Either a matcher of any value to match with
   * @returns 
   */
  public withValue(value: any) {
    this.setProperty(
      'Value',
      typeof value === "string"
        ? Match.stringLikeRegexp(value)
        : value
    );
    return this;
  }

  /**
   * Sets a matching list value of the parameter
   * @param value Either a list of values or the exact one (comma-separated)
   * @returns 
   */
  public withListValue(value: any | any[]) {
    this.setProperty(
      'Value',
      Array.isArray(value)
        ? value.join(',')
        : Match.stringLikeRegexp(value)
    );
    return this;
  }
}