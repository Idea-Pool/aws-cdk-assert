import { App } from "aws-cdk-lib";
import { AdvancedTemplate, IAMRole, LambdaFunction } from "../src"
import { TestIAMStack } from "./stacks/iam.stack";


describe("Lambda", () => {
  let template: AdvancedTemplate;
  let serviceRole: IAMRole;
  let fn: LambdaFunction;

  beforeAll(() => {
    const app = new App();
    const stack = new TestIAMStack(app, 'TestLambdaStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    serviceRole = template
      .iamRole()
      .assumableByLambda()
      .withManagedRolicy('service-role/AWSLambdaBasicExecutionRole');

    fn = template
      .lambdaFunction();
  });

  test('Lambda Function is created', () => {
    fn
      .withRole(serviceRole)
      .withRuntime('node')
      .withHandler('handler')
      .withTimeout(42)
      .exists();
  });
});