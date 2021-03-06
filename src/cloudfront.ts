import { Match } from "aws-cdk-lib/assertions";
import { CfnDistribution, CfnFunction, FunctionEventType, HttpVersion, OriginProtocolPolicy, OriginSslPolicy } from "aws-cdk-lib/aws-cloudfront";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource, Resource } from "./resource";
import { S3Bucket } from "./s3";
import { WafV2WebACL } from "./wafv2";

/**
 * A test construct for a CloudFront Function resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.CfnFunction.html}
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
    this.withProperty('FunctionCode', Match.stringLikeRegexp(code));
    return this;
  }
}

/**
 * A test construct for a CloudFront Distribution
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.CfnDistribution.html}
 */
export class CloudFrontDistribution extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDistribution.CFN_RESOURCE_TYPE_NAME, template, props);
    this.withProperty('DistributionConfig', {});
  }

  /**
   * Sets matching aliases for the distribution
   * @param aliases The whole or a partial alias array
   * @returns 
   */
  public withAliases(aliases: string[]) {
    this.propertiesMatcher.DistributionConfig.Aliases = Match.arrayWith(aliases);
    return this;
  }

  /**
   * Sets a matching CloudFront Function association
   * @param fn The CloudFront Function test construct resource
   * @param eventType The association event type
   * @returns 
   */
  public withFunctionAssociation(fn: CloudFrontFunction, eventType?: FunctionEventType) {
    this.propertiesMatcher.DistributionConfig.DefaultCacheBehavior = Match.objectLike({
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
    this.propertiesMatcher.DistributionConfig.ViewerCertificate = Match.objectLike({
      AcmCertificateArn: requestorResource.arn,
    });
    return this;
  }

  /**
   * Sets a matching WafV2 WebACL ID
   * @param webACLId The WebACL ID 
   * @returns 
   */
  public withWebACL(webACLId: any) {
    if (webACLId instanceof WafV2WebACL) {
      this.propertiesMatcher.DistributionConfig.WebACLId = AdvancedMatcher.fnGetAtt(webACLId.id, "Id");
    } else {
      this.propertiesMatcher.DistributionConfig.WebACLId = webACLId;
    }
    return this;
  }

  /**
   * Sets a matching origin for the passed S3 Bucket resource
   * @param s3Bucket The S3 Bucket test construct resource
   * @returns 
   */
  public withPublicS3BucketOrigin(s3Bucket: S3Bucket) {
    this.propertiesMatcher.DistributionConfig.Origins = [
      Match.objectLike({
        DomainName: s3Bucket.websiteUrl,
      })
    ];
    return this;
  }

  /**
   * Sets a matching HTTP version for the resource
   * @param version The matching HTTP version
   * @returns 
   */
  public withHttpVersion(version: HttpVersion) {
    this.propertiesMatcher.DistributionConfig.HttpVersion = version;
    return this;
  }

  /**
   * Sets a matching Origin configuration
   * @param originConfig The matching origin configuration
   * @returns 
   */
  public withOrigin(originConfig: {
    protocolPolicy?: OriginProtocolPolicy,
    sslProtocol?: OriginSslPolicy,
    domain?: any,
    id?: string,
    path?: string,
  } = {}) {
    const origin: any = {};
    if (originConfig.protocolPolicy) {
      origin.CustomOriginConfig = origin.CustomOriginConfig || {};
      origin.CustomOriginConfig.OriginProtocolPolicy = originConfig.protocolPolicy;
    }
    if (originConfig.sslProtocol) {
      origin.CustomOriginConfig = origin.CustomOriginConfig || {};
      origin.CustomOriginConfig.OriginSSLProtocols = Match.arrayWith([
        originConfig.sslProtocol
      ]);
    }
    if (originConfig.path) {
      origin.CustomOriginConfig = origin.CustomOriginConfig || {};
      origin.CustomOriginConfig.OriginPath = Match.stringLikeRegexp(originConfig.path);
    }
    if (originConfig.domain) {
      if (typeof originConfig.domain === 'string') {
        origin.DomainName = Match.stringLikeRegexp(originConfig.domain);
      } else {
        origin.DomainName = originConfig.domain;
      }
    }
    if (originConfig.id) {
      origin.Id = Match.stringLikeRegexp(originConfig.id);
    }
    if (Object.keys(origin).length) {
      this.propertiesMatcher.DistributionConfig.Origins = Match.arrayWith([
        Match.objectLike(origin)
      ]);
    } else {
      this.propertiesMatcher.DistributionConfig.Origins = Match.anyValue();
    }
    return this;
  }
}
