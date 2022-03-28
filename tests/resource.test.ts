import { App } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { CfnParameter } from "aws-cdk-lib/aws-ssm";
import { AdvancedTemplate } from "../src"
import { TestSSMStack } from "./stacks/ssm.stack";


describe("Resource", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestSSMStack(app, 'TestSSMStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('Resource count can be checked', () => {
    template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .countIs(5);
  });

  test('Resource can have tags', () => {
    const stringParameter = template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withProperty('Name', 'string');

    stringParameter.hasTag('Type');
    stringParameter.hasTag('Type', 'String');
  });

  test('Resource can have dependency', () => {
    const stringParameter = template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withProperty('Name', 'string');

    const secretParameter = template
      .removableResource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withProperty('Name', 'secret');

    secretParameter
      .dependsOn(stringParameter)
      .exists();
  });

  test('Resource can have metadata', () => {
    const r = template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withMetadata('STRING', 'string')
      .withMetadata('MATCHER', Match.stringLikeRegexp('string'))
      .withMetadata('OBJECT');

    r.exists();

    expect(r.metadata).toHaveProperty('OBJECT');
  });

  test('Resource can be checked with root property', () => {
    const r = template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withRootProperty('Metadata', Match.objectLike({
        OBJECT: Match.anyValue(),
      }))
      .withRootProperty('Type', CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withRootProperty('Properties');

    r.exists();

    expect(r.toJSON()).toHaveProperty('Metadata');
  });

  test('Resource can be checked with property', () => {
    const r = template
      .resource(CfnParameter.CFN_RESOURCE_TYPE_NAME)
      .withProperty('DataType')
      .withProperty('Value', 'IMAGE')
      .withProperty('Name', Match.stringLikeRegexp('image'));

    r.exists();
  });
});