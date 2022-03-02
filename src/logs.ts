import { CfnLogGroup } from "aws-cdk-lib/aws-logs";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

export class LogGroup extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnLogGroup.CFN_RESOURCE_TYPE_NAME, template, props);
  }
}