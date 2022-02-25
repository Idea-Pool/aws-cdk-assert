
export type Dict = { [prop: string]: any };
export type KeyAndProps = { [key: string]: Dict };

export enum ResourceTypes {
  S3_BUCKET = 'AWS::S3::Bucket',
  S3_BUCKET_POLICY = 'AWS::S3::BucketPolicy',
  S3_AUTO_DELETE_OBJECTS = 'Custom::S3AutoDeleteObjects',

  CLOUD_FRONT_DISTRIBUTION = 'AWS::CloudFront::Distribution',
  CLOUD_FRONT_FUNCTION = 'AWS::CloudFront::Function',

  ROUTE53_RECORD_SET = 'AWS::Route53::RecordSet',

  IAM_ROLE = 'AWS::IAM::Role',
  IAM_POLICY = 'AWS::IAM::Policy',

  CODE_BUILD_PROJECT = 'AWS::CodeBuild::Project',
  CODE_BUILD_SOURCE_CREDENTIALS = 'AWS::CodeBuild::SourceCredential',

  CDK_METADATA = 'AWS::CDK::Metadata',

  LAMBDA_FUNCTION = 'AWS::Lambda::Function',

  CLOUD_FORMATION_CUSTOM_RESOURCE = 'AWS::CloudFormation::CustomResource',

  WAFV2_WEB_ACL = 'AWS::WAFv2::WebACL',

  SSM_PARAMETER = 'AWS::SSM::Parameter',

  CUSTOM = 'Custom::AWS',
}