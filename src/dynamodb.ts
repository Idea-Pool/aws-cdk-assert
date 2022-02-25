import { Match } from "aws-cdk-lib/assertions";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { AdvancedTemplate, ResourceTypes } from ".";
import { RemovableResource } from "./resource";

export class DynamoDBTable extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.DYNAMODB_TABLE, template, props);
  }

  public withTableName(name: string): DynamoDBTable {
    this.setProperty('TableName', name);
    return this;
  }

  public withKey(key: string, type?: AttributeType): DynamoDBTable {
    this.setProperty('KeySchema', Match.arrayWith([
      Match.objectLike({
        AttributeName: key,
      }),
    ]));
    this.setProperty('AttributeDefinitions', Match.arrayWith([
      Match.objectEquals({
        AttributeName: key,
        AttributeType: type || AttributeType.STRING,
      }),
    ]));
    return this;
  }
}