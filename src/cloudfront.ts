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

  public withS3BucketOrigin(s3Bucket: S3Bucket): CloudFrontDistribution {
    this.props.DistributionConfig.Origins = [
      Match.objectLike({
        DomainName: AdvancedMatcher.s3BucketWebsiteURL(s3Bucket),
      })
    ];
    return this;
  }
}