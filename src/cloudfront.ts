import { Match } from "aws-cdk-lib/assertions";
import { WafV2WebACL } from ".";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { S3Bucket } from "./s3";
import { ResourceTypes } from "./types";

export class CloudFrontDistribution extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CLOUDFRONT_DISTRIBUTION, template, props);
    this.setProperty('DistributionConfig', {});
  }

  public withAliases(aliases: string[]): CloudFrontDistribution {
    this.props.DistributionConfig.Aliases = aliases;
    return this;
  }

  public withFunctionAssociation(fn: CloudFrontFunction, eventType?: string): CloudFrontDistribution {
    this.props.DistributionConfig.DefaultCacheBehavior = Match.objectLike({
      FunctionAssociations: Match.arrayWith([
        Match.objectLike({
          EventType: eventType || "viewer-request",
          FunctionARN: AdvancedMatcher.arn(fn, "FunctionARN"),
        })
      ])
    });
    return this;
  }

  public withCertificate(requestorResource: Resource): CloudFrontDistribution {
    this.props.DistributionConfig.ViewerCertificate = Match.objectLike({
      AcmCertificateArn: AdvancedMatcher.arn(requestorResource),
    });
    return this;
  }

  public withWebACL(webACLId: any): CloudFrontDistribution {
    this.props.DistributionConfig.WebACLId = webACLId;
    return this;
  }

  public withS3BucketOrigin(s3Bucket: S3Bucket): CloudFrontDistribution {
    this.props.DistributionConfig.Origins = [
      Match.objectLike({
        DomainName: AdvancedMatcher.s3BucketWebsiteURL(s3Bucket),
      })
    ];
    return this;
  }
}

export class CloudFrontFunction extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CLOUDFRONT_FUNCTION, template, props);
  }

  public withCode(code: string): CloudFrontFunction {
    return this.setProperty('FunctionCode', Match.stringLikeRegexp(code)) as CloudFrontFunction;
  }
}