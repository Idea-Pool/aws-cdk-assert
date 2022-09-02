import { CfnCondition, CfnMapping, CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

export class TestCustomStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // CUSTOM RESOURCE

    const custom = new AwsCustomResource(this, id + 'Custom', {
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      onCreate: {
        action: 'getParameter',
        service: 'SSM',
        parameters: {
          Name: 'CustomParameter',
        },
        region: props.env?.region,
        physicalResourceId: PhysicalResourceId.of('CustomParameter'),
      },
      onUpdate: {
        action: 'getParameter',
        service: 'SSM',
        parameters: {
          Name: 'CustomParameter',
        },
        region: props.env?.region,
        physicalResourceId: PhysicalResourceId.of('CustomParameter'),
      },
    });

    // CONDITION

    const bucket = new CfnBucket(this, id + 'Bucket', {
      bucketName: 'bucket',
    });
    bucket.cfnOptions.condition = new CfnCondition(this, id + 'Condition', {
      expression: Fn.conditionEquals(true, true),
    });

    // MAPPING

    new CfnMapping(this, id + 'Mapping', {
      mapping: {
        'eu-central-1': {
          regionName: 'Europe (Frankfurt)'
        }
      }
    });

    // OUTPUT

    new CfnOutput(this, 'CustomARN', {
      value: custom.node.id,
    });
  }
}
