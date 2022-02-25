import { App } from "aws-cdk-lib";
import { ParameterType } from "aws-cdk-lib/aws-ssm";
import { AdvancedTemplate } from "../src"
import { TestSSMStack } from "./stacks/ssm.stack";


describe("SSM", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestSSMStack(app, 'TestSSMStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('String Parameter is created', () => {
    template.ssmParameter()
      .withName('string')
      .of(ParameterType.STRING)
      .withValue('VALUE')
      .exists();
  });

  test('Secret String Parameter is created', () => {
    template.ssmParameter()
      .withName('secret-string')
      .of(ParameterType.SECURE_STRING)
      .withValue('VALUE')
      .exists();
  });

  test('String List Parameter is created', () => {
    template.ssmParameter()
      .withName('string-list')
      .of(ParameterType.STRING_LIST)
      .withListValue(['VALUE1', 'VALUE2'])
      .exists();

    template.ssmParameter()
      .withName('string-list')
      .of(ParameterType.STRING_LIST)
      .withListValue('VALUE2')
      .exists();
  });

  test('EC2 Image ID Parameter is created', () => {
    template.ssmParameter()
      .withName('image-id')
      .of(ParameterType.AWS_EC2_IMAGE_ID)
      .withValue('IMAGE')
      .exists();
  });
});