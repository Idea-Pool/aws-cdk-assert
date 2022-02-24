import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export enum WebACLScope {
  REGIONAL = 'REGIONAL',
  CLOUDFRONT = 'CLOUDFRONT',
}

export class WafV2WebACL extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.WAFV2_WEB_ACL, template, props);
  }

  public inScope(scope: WebACLScope): WafV2WebACL {
    return this.setProperty('Scope', scope) as WafV2WebACL;
  }

  public get rules(): any[] {
    return this.definition.Properties.Rules;
  }

  public hasNamedRule(name: string, vendor = 'AWS'): WafV2WebACL {
    const rule = this.rules.find((r: any): boolean => {
      return r.Statement?.ManagedRuleGroupStatement?.Name === name
        && r.Statement?.ManagedRuleGroupStatement?.VendorName === vendor;
    });
    this.assert(rule, `There is no such named rule: ${vendor}/${name}!`);
    return this;
  }

  public hasRateBasedRule(keyType: string, limit: number): WafV2WebACL {
    const rule = this.rules.find((r: any): boolean => {
      return r.Statement?.RateBasedStatement?.AggregateKeyType === keyType
        && r.Statement?.RateBasedStatement?.Limit === limit;
    });
    this.assert(rule, `There is no such rate based rule: ${keyType}/${limit}!`);
    return this;
  }
}