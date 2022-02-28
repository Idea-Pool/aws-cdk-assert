import { Match } from "aws-cdk-lib/assertions";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

export enum WebACLScope {
  REGIONAL = 'REGIONAL',
  CLOUDFRONT = 'CLOUDFRONT',
}

/**
 * A test construct for the WAF v2 WebACL resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_wafv2.CfnWebACL.html}
 */
export class WafV2WebACL extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnWebACL.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching scope
   * @param scope The exact scope to match
   * @returns 
   */
  public inScope(scope: WebACLScope) {
    this.withProperty('Scope', Match.stringLikeRegexp(scope));
    return this;
  }

  /**
   * The set rules from the resource definition.
   */
  public get rules(): any[] {
    return this.definition.Properties.Rules;
  }

  /**
   * Checks if there is a rule with a matching name and vendor
   * in the rules of the resource deinition.
   * @param name The name of the rule (exact match, case sensitive)
   * @param vendor THe name of the rule vendor (exact match, case sensitive)
   * @returns 
   */
  public hasNamedRule(name: string, vendor = 'AWS') {
    const rule = this.rules.find((r: any): boolean => {
      return r.Statement?.ManagedRuleGroupStatement?.Name === name
        && r.Statement?.ManagedRuleGroupStatement?.VendorName === vendor;
    });
    this.assert(rule, `There is no such named rule: ${vendor}/${name}!`);
    return this;
  }

  /**
   * Checks if there is a rate-based rule with a matching limit
   * in the rules of the resource definition.
   * @param keyType The type of the aggregate key
   * @param limit The limit of the rule
   * @returns 
   */
  public hasRateBasedRule(keyType: string, limit: number) {
    const rule = this.rules.find((r: any): boolean => {
      return r.Statement?.RateBasedStatement?.AggregateKeyType === keyType
        && r.Statement?.RateBasedStatement?.Limit === limit;
    });
    this.assert(rule, `There is no such rate based rule: ${keyType}/${limit}!`);
    return this;
  }
}