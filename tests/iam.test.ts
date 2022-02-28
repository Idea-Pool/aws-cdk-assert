import { App } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { Effect } from "aws-cdk-lib/aws-iam";
import { AdvancedMatcher, AdvancedTemplate, DynamoDBTable, IAMRole, LambdaFunction } from "../src"
import { TestIAMStack } from "./stacks/iam.stack";


describe("IAM", () => {
  let template: AdvancedTemplate;
  let roleForLambda: IAMRole;
  let roleForCodeBuild: IAMRole;
  let serviceRole: IAMRole;
  let fn: LambdaFunction;
  let table: DynamoDBTable;

  beforeAll(() => {
    const app = new App();
    const stack = new TestIAMStack(app, 'TestIAMStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    roleForLambda = template
      .iamRole()
      .assumableByLambda()
      .withPartialKey('Custom') as IAMRole;
    roleForCodeBuild = template
      .iamRole()
      .assumableByCodeBuild()
      .withPartialKey('Custom') as IAMRole;
    serviceRole = template
      .iamRole()
      .assumableByLambda()
      .withManagedRolicy('service-role/AWSLambdaBasicExecutionRole');

    fn = template
      .lambdaFunction();

    table = template
      .dynamoDBTable();
  });

  test('Role assumed by Lambda is created', () => {
    roleForLambda.exists();
  });

  test('Role assumed by CodeBuild is created', () => {
    roleForCodeBuild.exists();
  });

  test('Service Role for lambda is created', () => {
    serviceRole.exists();
  });

  test('Policy is created', () => {
    template
      .iamPolicy()
      .usedByRole(roleForLambda)
      .withStatement(
        'lambda:InvokeFunction',
        AdvancedMatcher.arn(fn),
        Effect.ALLOW
      )
      .withStatement(
        ['dynamodb:Query', 'dynamodb:PutItem'],
        Match.arrayWith([
          AdvancedMatcher.arn(table),
        ]),
      )
      .exists();


    template
      .iamPolicy()
      .usedByRole(roleForCodeBuild)
      .withStatement('lambda:InvokeFunction', AdvancedMatcher.arn(fn))
      .exists();
  });
});