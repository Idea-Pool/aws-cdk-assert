import { Match } from "aws-cdk-lib/assertions";
import { AttributeType, CfnTable } from "aws-cdk-lib/aws-dynamodb";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * A test construct for a DynamoDB Table
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb.Table.html}
 */
export class DynamoDBTable extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnTable.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching name of the table
   * @param name Either the whole or a partial name of the table
   * @returns 
   */
  public withTableName(name: string) {
    this.setProperty('TableName', Match.stringLikeRegexp(name));
    return this;
  }

  /**
   * Sets a matching key of the table
   * @param key Either the whole or a partial name of the key of the table
   * @param type The type of the key attribute
   * @returns 
   */
  public withKey(key: string, type?: AttributeType) {
    this.setProperty('KeySchema', Match.arrayWith([
      Match.objectLike({
        AttributeName: Match.stringLikeRegexp(key),
      }),
    ]));
    this.setProperty('AttributeDefinitions', Match.arrayWith([
      Match.objectEquals({
        AttributeName: Match.stringLikeRegexp(key),
        AttributeType: type || AttributeType.STRING,
      }),
    ]));
    return this;
  }
}