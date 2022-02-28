import { App } from "aws-cdk-lib";
import { AdvancedTemplate, WafV2WebACL, WebACLScope } from "../src"
import { TestCloudFrontStack } from "./stacks/cloudfront.stack";


describe("WafV2", () => {
  let template: AdvancedTemplate;
  let acl: WafV2WebACL;

  beforeEach(() => {
    const app = new App();
    const stack = new TestCloudFrontStack(app, 'TestCloudFrontStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    acl = template
      .wafV2WebACL()
      .inScope(WebACLScope.CLOUDFRONT);
  });

  test('WebACL is created', () => {
    acl.exists();
  });

  test('WebACL has managed rules', () => {
    acl.hasNamedRule('AWSManagedRulesCommonRuleSet');
  });

  test('WebACL has rate limit rules', () => {
    acl.hasRateBasedRule('IP', 100);
  });
});