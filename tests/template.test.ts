import { App } from "aws-cdk-lib";
import { AdvancedMatcher, AdvancedTemplate } from "../src"
import { TestCustomStack } from "./stacks/custom.stack";


describe("Template", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestCustomStack(app, 'TestCustomStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('should parse JSON template', () => {
    const t2 = AdvancedTemplate.fromJSON(template.toJSON(), template.region);
    template.templateMatches(t2);
  });

  test('should parse JSON string template', () => {
    const t2 = AdvancedTemplate.fromString(JSON.stringify(template.toJSON()), template.region);
    template.templateMatches(t2);
  });

  test('should wrap resourceCountIs', () => {
    template.resourceCountIs('Custom::AWS', 1);
  });

  test('should wrap hasResourceProperties', () => {
    template.hasResourceProperties('Custom::AWS', {
      InstallLatestAwsSdk: true,
    });
  });

  test('should wrap hasResource', () => {
    template.hasResource('Custom::AWS', {
      Properties: {
        InstallLatestAwsSdk: true,
      }
    });
  });

  test('should wrap hasParameter', () => {
    template.hasParameter('BootstrapVersion', {
      Type: "AWS::SSM::Parameter::Value<String>",
    });
  });

  test('should wrap findParameters', () => {
    expect(template.findParameters('BootstrapVersion')).not.toEqual({});
  });

  test('should wrap hasOutput', () => {
    template.hasOutput('CustomARN', {
      Value: 'TestCustomStackCustom',
    });
  });

  test('should wrap findOutputs', () => {
    expect(template.findOutputs('CustomARN')).not.toEqual({});
  });

  test('should wrap hasCondition', () => {
    template.hasCondition('TestCustomStackCondition', AdvancedMatcher.fnEquals(true, true));
  });

  test('should wrap findConditions', () => {
    expect(template.findConditions('TestCustomStackCondition')).not.toEqual({});
  });

  test('should wrap hasMapping', () => {
    template.hasMapping('TestCustomStackMapping', {
      "eu-central-1": {
        "regionName": "Europe (Frankfurt)"
      }
    });
  });

  test('should wrap findMappings', () => {
    expect(template.findMappings('TestCustomStackMapping')).not.toEqual({});
  });
});