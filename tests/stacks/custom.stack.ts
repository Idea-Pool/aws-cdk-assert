import { Stack, StackProps } from "aws-cdk-lib";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

export class TestCustomStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // CUSTOM RESOURCE

    new AwsCustomResource(this, id + 'Custom', {
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      onCreate: {
        action: 'getParameter',
        service: 'SSM',
        parameters: {
          Name: 'CustomParameter',
        },
        region: props.env.region,
        physicalResourceId: PhysicalResourceId.of('CustomParameter'),
      },
      onUpdate: {
        action: 'getParameter',
        service: 'SSM',
        parameters: {
          Name: 'CustomParameter',
        },
        region: props.env.region,
        physicalResourceId: PhysicalResourceId.of('CustomParameter'),
      },
    });
  }
}
