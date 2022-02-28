import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class TestDynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // TABLE WITH STRING KEY

    new dynamodb.Table(this, id + 'TableWithStringKey', {
      tableName: 'table-with-string-key',
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // TABLE WITH STRING KEY

    new dynamodb.Table(this, id + 'TableWithNumberKey', {
      tableName: 'table-with-number-key',
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    // TABLE WITH BINARY KEY

    new dynamodb.Table(this, id + 'TableWithBinaryKey', {
      tableName: 'table-with-binary-key',
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.BINARY,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}