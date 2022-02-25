import { App, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { AdvancedTemplate } from "../src"
import { TestDynamoDBStack } from "./stacks/dynamodb.stack";


describe("DynamoDB", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestDynamoDBStack(app, 'TestDynamoDBStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test("Table with String key is created", () => {
    template
      .dynamoDBTable()
      .withTableName('table-with-string-key')
      .withKey('key')
      .exists();
  });

  test("Table with Number key is created", () => {
    template
      .dynamoDBTable()
      .withTableName('table-with-number-key')
      .withKey('key', AttributeType.NUMBER)
      .withRemovalPolicy(RemovalPolicy.RETAIN)
      .exists();
  });

  test("Table with Binary key is created", () => {
    template
      .dynamoDBTable()
      .withTableName('table-with-binary-key')
      .withKey('key', AttributeType.BINARY)
      .withRemovalPolicy(RemovalPolicy.DESTROY)
      .exists();
  });
});