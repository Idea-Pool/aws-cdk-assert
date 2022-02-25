import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class LambdaFunction extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.LAMBDA_FUNCTION, template, props);
  }

  public withRole(iamRole: IAMRole): LambdaFunction {
    return this.setProperty('Role', AdvancedMatcher.arn(iamRole)) as LambdaFunction;
  }

  public withRuntime(runtime: string): LambdaFunction {
    return this.setProperty('Runtime', Match.stringLikeRegexp(runtime)) as LambdaFunction;
  }

  public withHandler(handler: string): LambdaFunction {
    return this.setProperty('Handler', Match.stringLikeRegexp(handler)) as LambdaFunction;
  }

  public withTimeout(timeout: number): LambdaFunction {
    return this.setProperty('Timeout', timeout) as LambdaFunction;
  }
}