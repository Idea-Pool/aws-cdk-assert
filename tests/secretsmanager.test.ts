import { App, RemovalPolicy } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { AdvancedTemplate } from "../src"
import { TestSecretsManagerStack } from "./stacks/secretsmanager.stack";


describe("SecretsManager", () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new App();
    const stack = new TestSecretsManagerStack(app, 'TestSecretsManagerStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();
  });

  test('Secret is created with plain secret string', () => {
    template
      .secret()
      .withName('secret-string')
      .withSecretString('TOP SECRET')
      .withRemovalPolicy(RemovalPolicy.SNAPSHOT)
      .exists();
  });

  test('Secret is created with generated secret string', () => {
    template
      .secret()
      .withName('secret-generated')
      .asGeneratedSecretString('string-key', Match.serializedJson({ foo: "bar" }))
      .withRemovalPolicy(RemovalPolicy.RETAIN)
      .exists();


    template
      .secret()
      .withName('secret-generated')
      .asGeneratedSecretString('string-key', "foo")
      .exists();
  });
});