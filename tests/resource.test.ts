import { App } from "aws-cdk-lib";
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
      .countIs(4);
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
});