import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class TestSSMStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // SSM STRING PARAMETER

    const stringParameter = new ssm.StringParameter(this, id + 'StringParameter', {
      parameterName: 'string',
      stringValue: 'VALUE',
      type: ssm.ParameterType.STRING,
    });

    Tags.of(stringParameter).add('Type', 'String');

    // SSM SECRET_STRING PARAMETER

    const secretParameter = new ssm.StringParameter(this, id + 'SecretStringParameter', {
      parameterName: 'secret',
      stringValue: 'VALUE',
      type: ssm.ParameterType.SECURE_STRING,
    });

    secretParameter.node.addDependency(stringParameter);
    Tags.of(secretParameter).add('Type', 'Secure String');

    // SSM IMAGE_ID PARAMETER

    new ssm.StringParameter(this, id + 'ImageIDParameter', {
      parameterName: 'image-id',
      stringValue: 'IMAGE',
      dataType: ssm.ParameterDataType.AWS_EC2_IMAGE,
    });

    // SSM STRING LIST PARAMETER

    new ssm.StringListParameter(this, id + 'StringListParameter', {
      parameterName: 'list',
      stringListValue: ['VALUE1', 'VALUE2'],
    });
  }
}