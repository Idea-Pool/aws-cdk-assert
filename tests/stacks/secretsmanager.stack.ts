import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class TestSecretsManagerStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // SECRET WITH VALUE

    new secretsmanager.Secret(this, 'SecretString', {
      secretName: 'secret-string',
      secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromUnsafePlaintext('TOP SECRET'),
      removalPolicy: RemovalPolicy.SNAPSHOT,
    });

    // SECRET WITH GENERATED VALUE

    new secretsmanager.Secret(this, 'SecretGenerated', {
      secretName: 'secret-generated',
      generateSecretString: {
        generateStringKey: 'string-key',
        secretStringTemplate: JSON.stringify({ foo: 'bar' }),
      },
      removalPolicy: RemovalPolicy.RETAIN,
    })
  }
}