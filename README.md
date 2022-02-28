> **IMPORTANT** This tool is NOT an official tool made by AWS.

# aws-cdk-assert

![Downloads](https://img.shields.io/npm/dw/aws-cdk-assert?style=flat-square) ![Version@npm](https://img.shields.io/npm/v/aws-cdk-assert?label=version%40npm&style=flat-square) ![Version@git](https://img.shields.io/github/package-json/v/idea-pool/aws-cdk-assert/main?label=version%40git&style=flat-square) ![CI](https://img.shields.io/github/workflow/status/idea-pool/aws-cdk-assert/CI/main?label=ci&style=flat-square) ![Docs](https://img.shields.io/github/workflow/status/idea-pool/aws-cdk-assert/Docs/main?label=docs&style=flat-square)

This tool gives handy utilities to test AWS CDK Stack, with predefined test constructs for certain CDK constructs.


The tool currently contains the following test constructs:

| Service        | Construct                      | CloudFormation Type                   |
| :------------- | :----------------------------- | :------------------------------------ |
| CloudFormation | `CloudFormationCustomResource` | `AWS::CloudFormation::CustomResource` |
| CloudFront     | `CloudFrontDistribution`       | `AWS::CloudFront::Distribution`       |
| CloudFront     | `CloudFrontFunction`           | `AWS::CloudFront::Function`           |
| CodeBuild      | `CodeBuildSourceCredentials`   | `AWS::CodeBuild::SourceCredential`    |
| CodeBuild      | `CodeBuildProject`             | `AWS::CodeBuild::Project`             |
| Custom         | `CustomResource`               | `Custom::AWS`                         |
| DynamoDB       | `DynamoDBTable`                | `AWS::DynamoDB::Table`                |
| IAM            | `IAMRole`                      | `AWS::IAM::Role`                      |
| IAM            | `IAMPolicy`                    | `AWS::IAM::Policy`                    |
| Lambda         | `LambdaFunction`               | `AWS::Lambda::Function`               |
| Route53        | `Route53HostedZone`            | `AWS::Route53::HostedZone`            |
| Route53        | `Route53RecordSet`             | `AWS::Route53::RecordSet`             |
| S3             | `S3Bucket`                     | `AWS::S3::Bucket`                     |
| S3             | `S3BucketPolicy`               | `AWS::S3::BucketPolicy`               |
| SSM            | `SSMParameter`                 | `AWS::SSM::Parameter`                 |
| WAF v2         | `WafV2WebACL`                  | `AWS::WAFv2::WebACL`                  |

## Need a new construct?

**Suggest one** in the issues, with an example CloudFormation template or **contribute** implementing it in this tool.

## Usage

```typescript
// stack.test.ts
import * as cdk from 'aws-cdk-lib';
import * as MyStack from '../lib/mystack.ts';
import { AdvancedTemplate } from 'aws-cdk-assert';

describe('MyStack', () => {
  let template: AdvancedTemplate;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new MyStack.MyStack(app, 'MyStack', {
      // props
    });
    template = AdvancedTemplate.fromStack(stack);
  });

  test('should have S3 Bucket', () => {
    template.s3Bucket().withBucketName('MyBucket').exists();
  });
});
```

## API

The main components/API the tool relies on:

* `AdvancedTemplate` is a wrapper around [Template](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html), decorated with factory methods for the predefined constructs.
* `AdvancedMatcher` is similar to [Match](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html), but with additional functions.
* `Resource` (and `RemovableResource`) is the base construct to work with CloudFormation constructs. It allows to
  + construct the matcher properties, which will be used to find a construct in the template, 
  + check if a construct exists or not, 
  + check the count of a construct (not just based on type, but fully matching construct), 
  + make assertions with extended information in case of failure, 
  + etc.

For detailed documentation see the [TypeDocs documentation](https://idea-pool.github.io/aws-cdk-assert/).
