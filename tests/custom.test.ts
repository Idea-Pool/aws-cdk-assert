import { App } from "aws-cdk-lib";
import { AdvancedTemplate } from "../src"
import { TestCustomStack } from "./stacks/custom.stack";


describe("Custom", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestCustomStack(app, 'TestCustomStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('Custom Resource is created', () => {
    const lambda = template.lambdaFunction();

    template.customResource()
      .withCreateHandler('getParameter', 'SSM', { Name: 'CustomParameter' })
      .withUpdateHandler('getParameter', 'SSM')
      .withServiceToken(lambda)
      .exists();
  });
});