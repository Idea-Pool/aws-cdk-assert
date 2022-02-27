import { Match } from "aws-cdk-lib/assertions";
import { CfnDistribution, CfnFunction, FunctionEventType } from "aws-cdk-lib/aws-cloudfront";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource, Resource } from "./resource";
import { S3Bucket } from "./s3";

/**
 * A test construct for a CloudFront Function resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Function.html}
 */
export class CloudFrontFunction extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnFunction.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching function code for the function
   * @param code The whole of a part of the function code
   * @returns 
   */
  public withCode(code: string) {
    this.setProperty('FunctionCode', Match.stringLikeRegexp(code));
    return this;
  }
}

/**
 * A test construct for a CloudFront Distribution
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Distribution.html}
 */
export class CloudFrontDistribution extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDistribution.CFN_RESOURCE_TYPE_NAME, template, props);
    this.setProperty('DistributionConfig', {});
  }

  /**
   * Sets matching aliases for the distribution
   * @param aliases The whole or a partial alias array
   * @returns 
   */
  public withAliases(aliases: string[]) {
    this.props.DistributionConfig.Aliases = Match.arrayWith(aliases);
    return this;
  }

  /**
   * Sets a matching CloudFront Function association
   * @param fn The CloudFront Function test construct resource
   * @param eventType The association event type
   * @returns 
   */
  public withFunctionAssociation(fn: CloudFrontFunction, eventType?: FunctionEventType) {
    this.props.DistributionConfig.DefaultCacheBehavior = Match.objectLike({
      FunctionAssociations: Match.arrayWith([
        Match.objectLike({
          EventType: eventType || FunctionEventType.VIEWER_REQUEST,
          FunctionARN: AdvancedMatcher.arn(fn, "FunctionARN"),
        })
      ])
    });
    return this;
  }

  /**
   * Sets a matching certificate
   * @param requestorResource The certificate requestor (or certificate) resource
   * @returns 
   */
  public withCertificate(requestorResource: Resource) {
    this.props.DistributionConfig.ViewerCertificate = Match.objectLike({
      AcmCertificateArn: AdvancedMatcher.arn(requestorResource),
    });
    return this;
  }

  /**
   * Sets a matching WafV2 WebACL ID
   * @param webACLId The WebACL ID 
   * @returns 
   */
  public withWebACL(webACLId: any) {
    this.props.DistributionConfig.WebACLId = webACLId;
    return this;
  }

  /**
   * Sets a matching origin for the passed S3 Bucket resource
   * @param s3Bucket The S3 Bucket test construct resource
   * @returns 
   */
  public withS3BucketOrigin(s3Bucket: S3Bucket) {
    this.props.DistributionConfig.Origins = [
      Match.objectLike({
        DomainName: AdvancedMatcher.s3BucketWebsiteURL(s3Bucket),
      })
    ];
    return this;
  }
}
