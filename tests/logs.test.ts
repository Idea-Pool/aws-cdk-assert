import { App, RemovalPolicy } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { AdvancedTemplate } from "../src"
import { TestLogsStack } from "./stacks/log.stack";


describe("Logs", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestLogsStack(app, 'TestLogsStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('Log Group is created', () => {
    template.logGroup()
      .withRemovalPolicy(RemovalPolicy.SNAPSHOT)
      .withRetention(RetentionDays.FIVE_YEARS)
      .withName('log-group')
      .exists();
  });
});