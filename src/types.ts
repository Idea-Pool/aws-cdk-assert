
export type Dict = { [prop: string]: any };
export type KeyAndProps = { [key: string]: Dict };

export enum ResourceTypes {
  CDK_METADATA = 'AWS::CDK::Metadata',

  CLOUD_FORMATION_CUSTOM_RESOURCE = 'AWS::CloudFormation::CustomResource',

  CLOUD_FRONT_DISTRIBUTION = 'AWS::CloudFront::Distribution',
  CLOUD_FRONT_FUNCTION = 'AWS::CloudFront::Function',

  CODE_BUILD_PROJECT = 'AWS::CodeBuild::Project',
  CODE_BUILD_SOURCE_CREDENTIALS = 'AWS::CodeBuild::SourceCredential',

  CUSTOM = 'Custom::AWS',

  DYNAMODB_TABLE = 'AWS::DynamoDB::Table',

  IAM_ROLE = 'AWS::IAM::Role',
  IAM_POLICY = 'AWS::IAM::Policy',

  LAMBDA_FUNCTION = 'AWS::Lambda::Function',

  ROUTE53_RECORD_SET = 'AWS::Route53::RecordSet',

  S3_BUCKET = 'AWS::S3::Bucket',
  S3_BUCKET_POLICY = 'AWS::S3::BucketPolicy',
  S3_AUTO_DELETE_OBJECTS = 'Custom::S3AutoDeleteObjects',

  SSM_PARAMETER = 'AWS::SSM::Parameter',

  WAFV2_WEB_ACL = 'AWS::WAFv2::WebACL',
}