import { Match } from "aws-cdk-lib/assertions";
import { CfnFunction } from "aws-cdk-lib/aws-lambda";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { RemovableResource } from "./resource";

/**
 * A test construct represents a Lambda Function
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.CfnFunction.html}
 */
export class LambdaFunction extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnFunction.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Adds a matching role of the Lambda Function
   * @param iamRole The IAM Role test construct
   * @returns 
   */
  public withRole(iamRole: IAMRole) {
    this.withProperty('Role', AdvancedMatcher.arn(iamRole));
    return this;
  }

  /**
   * Adds a matching runtime of the Lambda Function
   * @param runtime Either exact or partial string of the runtime
   * @returns 
   */
  public withRuntime(runtime: string) {
    this.withProperty('Runtime', Match.stringLikeRegexp(runtime));
    return this;
  }

  /**
   * Adds a matching handler of the Lambda Function
   * @param handler Either exact or partial string of the handler
   * @returns 
   */
  public withHandler(handler: string) {
    this.withProperty('Handler', Match.stringLikeRegexp(handler));
    return this;
  }

  /**
   * Adds a matching timeout of the Lambda Function
   * @param timeout The exact timeout number
   * @returns 
   */
  public withTimeout(timeout: number) {
    this.withProperty('Timeout', timeout);
    return this;
  }
}