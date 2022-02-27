import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as s3 from "aws-cdk-lib/aws-s3";

export class TestIAMStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // IAM ROLE FOR LAMBDA

    const roleForLambda = new iam.Role(this, id + 'CustomLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    // IAM ROLE FOR CODEBUILD

    const roleForCodeBuild = new iam.Role(this, id + 'CustomCodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
    });

    // IAM SERVICE ROLE AND POLICY

    const fn = new lambda.Function(this, id + 'Lambda', {
      code: lambda.Code.fromInline("exports.handler = function () {}"),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS,
    });

    fn.grantInvoke(roleForLambda);
    fn.grantInvoke(roleForCodeBuild);

    const table = new dynamodb.Table(this, id + 'Table', {
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });

    table.grantReadWriteData(roleForLambda);
  }
}