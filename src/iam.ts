import { Match } from "aws-cdk-lib/assertions";
import { CfnPolicy, CfnRole, Effect } from "aws-cdk-lib/aws-iam";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * A test construct represents an IAM Role.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.Role.html}
 */
export class IAMRole extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnRole.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets matching property of AssumeRolePolicyDocument.
   * @param principal The principal object
   * @example
   * iamRole.assumableBy({ Service: "lambda.amazonaws.com" })
   * @returns 
   */
  public assumableBy(principal: any) {
    this.setProperty('AssumeRolePolicyDocument', Match.objectLike({
      Statement: Match.arrayWith([
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: principal,
        },
      ]),
    }));
    return this;
  }

  /**
   * Sets matching property of AssumeRolePolicyDocument to AWS Lambda Service.
   * @see {@link assumableBy}
   * @returns 
   */
  public assumableByLambda() {
    return this.assumableBy({ Service: 'lambda.amazonaws.com' });
  }

  /**
   * Sets matching property of AssumeRolePolicyDocument to AWS CodeBuild Service.
   * @see {@link assumableBy}
   * @returns 
   */
  public assumableByCodeBuild() {
    return this.assumableBy({ Service: 'codebuild.amazonaws.com' });
  }

  /**
   * Sets matching property of ManagedPolicyArns with managed policy name.
   * @param policy The managed policy name/ARN part.
   * @returns 
   */
  public withManagedRolicy(policy: string) {
    this.setProperty('ManagedPolicyArns', Match.arrayWith([
      AdvancedMatcher.fnJoin(Match.arrayWith([
        Match.stringLikeRegexp(policy),
      ])),
    ]));
    return this;
  }
}

/**
 * A test construct representing an IAM Policy.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.Policy.html}
 */
export class IAMPolicy extends RemovableResource {
  /** @member The list of policy statements */
  private statements: any[];
  /** @member The list of roles policy assigned to */
  private roles: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnPolicy.CFN_RESOURCE_TYPE_NAME, template, props);
    this.statements = [];
    this.roles = [];
  }

  /**
   * Adds a matching policy statement
   * @param action Either a single or an array of actions
   * @param resource Either a matcher or a string representing the resource
   * @param effect The matching effect of the policy statement
   * @returns 
   */
  public withStatement(action: string | string[], resource?: any, effect?: Effect) {
    const statement: any = {
      Action: typeof action === 'string'
        ? action
        : Match.arrayWith(action as string[]),
      Effect: effect || Effect.ALLOW,
    };
    if (resource !== null) {
      statement.Resource = resource || '*';
    }
    this.statements.push(Match.objectLike(statement));
    this.setProperty('PolicyDocument', Match.objectLike({
      Statement: Match.arrayWith(this.statements),
    }));
    return this;
  }

  /**
   * Adds a matching role assignment
   * @param role The IAM role test constructé
   * @returns 
   */
  public usedByRole(role: IAMRole) {
    this.roles.push({ Ref: role.id });
    this.setProperty('Roles', Match.arrayWith(this.roles));
    return this;
  }
}