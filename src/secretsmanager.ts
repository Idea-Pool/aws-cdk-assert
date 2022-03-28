import { Match, Matcher } from "aws-cdk-lib/assertions";
import { CfnSecret } from "aws-cdk-lib/aws-secretsmanager";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * Represents a SecrestManager Secret test construct.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.CfnSecret.html}
 */
export class Secret extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnSecret.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Adds a matching secret string generation template.
   * @param key The whole or a partial key of the secret.
   * @param template The whole or a partial template to generate the string, or a matcher.
   * @returns 
   */
  public asGeneratedSecretString(key: string, template?: string | Matcher) {
    const generatedSecretString: any = {
      GenerateStringKey: Match.stringLikeRegexp(key),
    };
    if (template) {
      if (typeof template === 'string') {
        generatedSecretString.SecretStringTemplate = Match.stringLikeRegexp(template);
      } else {
        generatedSecretString.SecretStringTemplate = template;
      }
    }
    this.withProperty('GenerateSecretString', Match.objectLike(generatedSecretString));
    return this;
  }

  /**
   * Adds a matching secret string value.
   * @param value The whole or a partial value of the secret or a matcher.
   * @returns 
   */
  public withSecretString(value: string | Matcher) {
    this.withProperty('SecretString', value);
    return this;
  }

  /**
   * Adds a matching secret string name.
   * @param value The whole or a partial name of the secret or a matcher.
   * @returns 
   */
  public withName(name: string | Matcher) {
    this.withProperty('Name', name);
    return this;
  }
}