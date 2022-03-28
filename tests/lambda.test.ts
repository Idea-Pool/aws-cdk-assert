import { App } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AdvancedTemplate, IAMRole } from "../src"
import { TestLambdaStack } from "./stacks/lambda.stack";


describe("Lambda", () => {
  let template: AdvancedTemplate;
  let serviceRole: IAMRole;

  beforeAll(() => {
    const app = new App();
    const stack = new TestLambdaStack(app, 'TestLambdaStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    serviceRole = template
      .iamRole()
      .assumableByLambda()
      .withManagedRolicy('service-role/AWSLambdaBasicExecutionRole');
  });

  test('Lambda Function is created', () => {
    template
      .lambdaFunction()
      .withRole(serviceRole)
      .withRuntime('node')
      .withHandler('handler')
      .withTimeout(42)
      .exists();

    template
      .lambdaFunction()
      .withRuntime(Runtime.NODEJS_14_X)
      .exists();
  });

  test('Lambda can be matched with enrivonment variables with ARN value', () => {
    template
      .lambdaFunction()
      .withEnvironmentVariable('ARN', template.dynamoDBTable())
      .exists();
  });

  test('Lambda can be matched with enrivonment variables with string value', () => {
    template
      .lambdaFunction()
      .withEnvironmentVariable('STRING', 'STRING')
      .withEnvironmentVariable('MATCHER', Match.stringLikeRegexp('string'))
      .exists();
  });

  test('Lambda can be matched with enrivonment variables with any value', () => {
    template
      .lambdaFunction()
      .withEnvironmentVariable('OBJECT')
      .exists();
  });

  test('Lamba permission is created', () => {
    template
      .lambdaPermission()
      .withFunctionName(template.lambdaFunction())
      .withAction('lambda:InvokeFunction')
      .withPrincipal('apigateway')
      .withSourceAccount('Account')
      .withSourceArn(template.dynamoDBTable().arn)
      .exists();
  });
});