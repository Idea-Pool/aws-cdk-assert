import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class TestSSMStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // SSM STRING PARAMETER

    new ssm.StringParameter(this, id + 'StringParameter', {
      parameterName: 'string',
      stringValue: 'VALUE',
      type: ssm.ParameterType.STRING,
    });

    // SSM SECRET_STRING PARAMETER

    new ssm.StringParameter(this, id + 'SecretStringParameter', {
      parameterName: 'secret-string',
      stringValue: 'VALUE',
      type: ssm.ParameterType.SECURE_STRING,
    });

    // SSM IMAGE_ID PARAMETER

    new ssm.StringParameter(this, id + 'ImageIDParameter', {
      parameterName: 'image-id',
      stringValue: 'IMAGE',
      dataType: ssm.ParameterDataType.AWS_EC2_IMAGE,
    });

    // SSM STRING LIST PARAMETER

    new ssm.StringListParameter(this, id + 'StringListParameter', {
      parameterName: 'string-list',
      stringListValue: ['VALUE1', 'VALUE2'],
    });
  }
}