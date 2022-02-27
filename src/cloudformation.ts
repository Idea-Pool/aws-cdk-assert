import { CfnCustomResource } from "aws-cdk-lib/aws-cloudformation";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource, Resource } from "./resource";

/**
 * A test construct for a CloudFormation Custom Resourece
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudformation.CfnCustomResource.html}
 */
export class CloudFormationCustomResource extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnCustomResource.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching service token to another test construct resource
   * @param resource The test construct resource
   * @returns 
   */
  public withServiceToken(resource: Resource) {
    this.setProperty('ServiceToken', AdvancedMatcher.arn(resource));
    return this;
  }
}