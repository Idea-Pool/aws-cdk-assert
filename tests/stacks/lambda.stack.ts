import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class TestLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // IAM ROLE FOR LAMBDA

    const roleForLambda = new iam.Role(this, id + 'CustomLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    // TABLE 

    const table = new dynamodb.Table(this, id + 'Table', {
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // LAMBDA FUNCTION

    const fn = new lambda.Function(this, id + 'Lambda', {
      code: lambda.Code.fromInline("exports.handler = function () {}"),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: Duration.seconds(42),
      environment: {
        ARN: table.tableArn,
        STRING: 'STRING',
        MATCHER: 'some string',
        OBJECT: table.tableArn,
      }
    });

    fn.grantInvoke(roleForLambda);

    // LAMBDA PERMISSION

    new lambda.CfnPermission(this, id + 'Permission', {
      action: 'lambda:InvokeFunction',
      functionName: fn.functionName,
      principal: 'apigateway.amazonservices.com',
      sourceArn: table.tableArn,
      sourceAccount: 'Account',
    })
  }
}