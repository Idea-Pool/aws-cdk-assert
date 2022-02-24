import { Resource, ResourceTypes } from "../src";

describe("aws-cdk-assert", () => {
  test('should do anything', () => {
    const r = new Resource(ResourceTypes.CDK_METADATA, null, {})
    console.log(r);
  })
});