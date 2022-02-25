import { Match } from "aws-cdk-lib/assertions";
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
    return this.setProperty('DefaultCacheBehavior', Match.objectLike({
      FunctionAssociations: Match.arrayWith([
        Match.objectLike({
          EventType: eventType || "viewer-request",
          FunctionARN: AdvancedMatcher.arn(fn, "FunctionARN"),
        })
      ])
    })) as CloudFrontDistribution;
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