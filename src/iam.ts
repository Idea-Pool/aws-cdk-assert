import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class IAMRole extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.IAM_ROLE, template, props);
  }

  public assumableBy(principal: any): IAMRole {
    return this.setProperty('AssumeRolePolicyDocument', Match.objectLike({
      Statement: Match.arrayWith([
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: principal,
        },
      ]),
    })) as IAMRole;
  }

  public assumableByLambda(): IAMRole {
    return this.assumableBy({ Service: 'lambda.amazonaws.com' });
  }

  public assumableByCodeBuild(): IAMRole {
    return this.assumableBy({ Service: 'codebuild.amazonaws.com' });
  }

  public withManagedRolicy(policy: string): IAMRole {
    return this.setProperty('ManagedPolicyArns', Match.arrayWith([
      AdvancedMatcher.fnJoin(Match.arrayWith([
        Match.stringLikeRegexp(policy),
      ])),
    ])) as IAMRole;
  }
}

export enum IAMPolicyStatementEffect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

export class IAMPolicy extends Resource {
  private statements: any[];
  private roles: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.IAM_POLICY, template, props);
    this.statements = [];
    this.roles = [];
  }

  public withStatement(action: string | string[], resource?: any, effect?: IAMPolicyStatementEffect): IAMPolicy {
    const statement: any = {
      Action: typeof action === 'string'
        ? action
        : Match.arrayWith(action as string[]),
      Effect: effect || IAMPolicyStatementEffect.ALLOW,
    };
    if (resource !== null) {
      statement.Resource = resource || '*';
    }
    this.statements.push(Match.objectLike(statement));
    return this.setProperty('PolicyDocument', Match.objectLike({
      Statement: Match.arrayWith(this.statements),
    })) as IAMPolicy;
  }

  public usedByRole(role: IAMRole): IAMPolicy {
    this.roles.push({ Ref: role.id });
    return this.setProperty('Roles', Match.arrayWith(this.roles)) as IAMPolicy;
  }
}