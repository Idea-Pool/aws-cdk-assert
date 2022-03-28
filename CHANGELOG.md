# Changelog

## 1.1.0

### Added

| Service        | Construct                   | CloudFormation Type                |
| :------------- | :-------------------------- | :--------------------------------- |
| ApiGateway     | `ApiGatewayRestApi`         | `AWS::ApiGateway::RestApi`         |
| ApiGateway     | `ApiGatewayAccount`         | `AWS::ApiGateway::Account`         |
| ApiGateway     | `ApiGatewayDeployment`      | `AWS::ApiGateway::Deployment`      |
| ApiGateway     | `ApiGatewayStage`           | `AWS::ApiGateway::Stage`           |
| ApiGateway     | `ApiGatewayMethod`          | `AWS::ApiGateway::Method`          |
| ApiGateway     | `ApiGatewayResource`        | `AWS::ApiGateway::Resource`        |
| ApiGateway     | `ApiGatewayDomain`          | `AWS::ApiGateway::DomainName`      |
| ApiGateway     | `ApiGatewayBasePathMapping` | `AWS::ApiGateway::BasePathMapping` |
| ApiGateway     | `ApiGatewayApiKey`          | `AWS::ApiGateway::ApiKey`          |
| ApiGateway     | `ApiGatewayUsagePlan`       | `AWS::ApiGateway::UsagePlan`       |
| ApiGateway     | `ApiGatewayUsagePlanKey`    | `AWS::ApiGateway::UsagePlanKey`    |
| Lambda         | `LambdaPermission`          | `AWS::Lambda::Permission`          |
| Logs           | `LogGroup`                  | `AWS::Logs::LogGroup`              |
| SecretsManager | `Secret`                    | `AWS::SecretsManager::Secret`      |

## 1.0.1

Package transferred to [Idea Pool](https://github.com/Idea-Pool)

## 1.0.0

### Added

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

## 0.0.1 

### Added

- Added placeholder of `aws-cdk-assert`
