import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as logs from "aws-cdk-lib/aws-logs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export class TestLogsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // LOG GROUP

    new logs.LogGroup(this, 'Group', {
      logGroupName: 'log-group',
      removalPolicy: RemovalPolicy.SNAPSHOT,
      retention: RetentionDays.FIVE_YEARS,
    });
  }
}