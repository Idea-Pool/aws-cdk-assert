import { CfnLogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * A test construct representing a LogGroup.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnLogGroup.html}
 */
export class LogGroup extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnLogGroup.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching retention period in days.
   * @param days The retention period in days.
   * @returns 
   */
  public withRetention(days: RetentionDays) {
    this.withProperty('RetentionInDays', days);
    return this;
  }

  /**
   * Sets a matching log group name.
   * @param name Either the whole or a partial log group name.
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('LogGroupName', name);
    return this;
  }
}