import { Match } from "aws-cdk-lib/assertions";
import { CfnRecordSet, RecordType } from "aws-cdk-lib/aws-route53";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template"
import { CloudFrontDistribution } from "./cloudfront";
import { RemovableResource } from "./resource";

/**
 * A test construct representing a Route53 RecordSet.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.RecordSet.html}
 */
export class Route53RecordSet extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnRecordSet.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching RecordType
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.RecordType.html}
   * @param recordType The records type to match
   * @returns 
   */
  public withRecordType(recordType: RecordType) {
    this.setProperty('Type', recordType);
    return this;
  }

  /**
   * Sets a matching name for the RecordSet
   * @param name Either the whole or a partial name of the record
   * @returns 
   */
  public withName(name: string) {
    this.setProperty('Name', Match.stringLikeRegexp(name));
    return this;
  }

  /**
   * Sets a matching hosted zone ID for the RecordSet
   * @param zoneId Either the whole or a partial zone ID the record belongs to
   * @returns 
   */
  public inHostedZone(zoneId: string) {
    this.setProperty('HostedZoneId', zoneId);
    return this;
  }

  /**
   * Sets a matching CloudFront Distribution target for the RecordSet
   * @param distribution The CloudFront distribution as the target
   * @returns 
   */
  public withAliasToCloudFront(distribution: CloudFrontDistribution) {
    this.setProperty('AliasTarget', Match.objectLike({
      DNSName: AdvancedMatcher.fnGetAtt(distribution.id, "DomainName"),
    }));
    return this;
  }

  /**
   * Sets a matching S3 Bucket target for the RecordSet
   * @returns 
   */
  public withAliasToS3() {
    this.setProperty('AliasTarget', Match.objectLike({
      DNSName: `s3-website.${this.template.region}.amazonaws.com`,
    }));
    return this;
  }
}