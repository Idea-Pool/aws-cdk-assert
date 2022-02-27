import { Resource } from "../src";

describe("aws-cdk-assert", () => {
  test('should do anything', () => {
    const r = new Resource('AWS::CDK::Metadata', null, {})
    console.log(r);
  })
});