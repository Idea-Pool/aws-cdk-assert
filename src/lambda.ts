import { Match } from "aws-cdk-lib/assertions";
import { CfnFunction, CfnPermission, Runtime } from "aws-cdk-lib/aws-lambda";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { RemovableResource, Resource } from "./resource";

/**
 * A test construct represents a Lambda Function
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.CfnFunction.html}
 */
export class LambdaFunction extends RemovableResource {
  private environmentVariables: { [key: string]: any };

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnFunction.CFN_RESOURCE_TYPE_NAME, template, props);
    this.environmentVariables = {};
  }

  /**
   * Adds a matching role of the Lambda Function
   * @param iamRole The IAM Role test construct
   * @returns 
   */
  public withRole(iamRole: IAMRole) {
    this.withProperty('Role', iamRole.arn);
    return this;
  }

  /**
   * Adds a matching runtime of the Lambda Function
   * @param runtime Either exact or partial string of the runtime
   * @returns 
   */
  public withRuntime(runtime: string | Runtime) {
    if (runtime instanceof Runtime) {
      this.withProperty('Runtime', runtime.toString());
    } else {
      this.withProperty('Runtime', runtime);
    }
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

  /**
   * Sets a matching environment variable for the lambda function
   * @param name The whole of a partial name of the environment variable
   * @param value The value of the environment variable (resource, string, or a matcher)
   * @returns 
   */
  public withEnvironmentVariable(name: string, value?: any) {
    if (value) {
      if (value instanceof Resource) {
        this.environmentVariables[name] = value.arn;
      } else if (typeof value === "string") {
        this.environmentVariables[name] = Match.stringLikeRegexp(value);
      } else {
        this.environmentVariables[name] = value;
      }
    } else {
      this.environmentVariables[name] = Match.anyValue();
    }
    this.withProperty('Environment', Match.objectLike({
      Variables: Match.objectLike(this.environmentVariables),
    }));
    return this;
  }
}

/**
 * A test construct representing a Lambda Permission resource.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.CfnPermission.html}
 */
export class LambdaPermission extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnPermission.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching action for the resource.
   * @param action The whole or a partial action to match.
   * @returns 
   */
  public withAction(action: string) {
    this.withProperty('Action', action);
    return this;
  }

  /**
   * Sets a matching principal for the resource.
   * @param principal The whole or a partial principal to match.
   * @returns 
   */
  public withPrincipal(principal: string) {
    this.withProperty('Principal', principal);
    return this;
  }

  /**
   * Sets matching source ARN for the permission resource
   * @param arn The exact arn or matcher for it.
   * @returns 
   */
  public withSourceArn(arn: any) {
    this.withProperty('SourceArn', arn);
    return this;
  }

  /**
   * Sets matching source account for the permission resource
   * @param account The exact account or matcher for it.
   * @returns 
   */
  public withSourceAccount(account: any) {
    this.withProperty('SourceAccount', account);
    return this;
  }


  /**
   * Sets a matching Lambda Function for the resource
   * @param lambdaFunction The lambda function resource.
   * @returns 
   */
  public withFunctionName(lambdaFunction: LambdaFunction) {
    this.withProperty('FunctionName', lambdaFunction.reference);
    return this;
  }
}