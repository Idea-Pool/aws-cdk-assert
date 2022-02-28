import { Match, Matcher } from "aws-cdk-lib/assertions";
import { CfnHostedZone, CfnRecordSet, RecordType } from "aws-cdk-lib/aws-route53";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template"
import { CloudFrontDistribution } from "./cloudfront";
import { RemovableResource } from "./resource";

/**
 * A test construct representing a Route53 RecordSet.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.CfnHostedZone.html}
 */
export class Route53HostedZone extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnHostedZone.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching name for the HostedZone
   * @param name Either the whole or a partial name of the record
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('Name', Match.stringLikeRegexp(name));
    return this;
  }
}


/**
 * A test construct representing a Route53 RecordSet.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.CfnRecordSet.html}
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
    this.withProperty('Type', recordType);
    return this;
  }

  /**
   * Sets a matching name for the RecordSet
   * @param name Either the whole or a partial name of the record
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('Name', Match.stringLikeRegexp(name));
    return this;
  }

  /**
   * Sets a matching hosted zone ID for the RecordSet
   * @param zone Either the hosted zone resource, a matcher or a matching zone Id.
   * @returns 
   */
  /*
    TODO: add mapping

    "HostedZoneId": {
      "Fn::FindInMap": [
        "AWSCloudFrontPartitionHostedZoneIdMap",
        {
          "Ref": "AWS::Partition"
        },
        "zoneId"
      ]
    }
    
    "Mappings": {
      "AWSCloudFrontPartitionHostedZoneIdMap": {
        "aws": {
          "zoneId": "Z2FDTNDATAQYW2"
        },
        "aws-cn": {
          "zoneId": "Z3RFFRIM2A3IF5"
        }
      }
    },
  */
  public inHostedZone(zone: Route53HostedZone | Matcher) {
    if (zone instanceof Route53HostedZone) {
      this.withProperty('HostedZoneId', zone.ref);
    } else {
      this.withProperty('HostedZoneId', zone);
    }
    return this;
  }

  /**
   * Sets a matching CloudFront Distribution target for the RecordSet
   * @param distribution The CloudFront distribution as the target
   * @returns 
   */
  public withAliasToCloudFront(distribution: CloudFrontDistribution) {
    this.withProperty('AliasTarget', Match.objectLike({
      DNSName: AdvancedMatcher.fnGetAtt(distribution.id, "DomainName"),
    }));
    return this;
  }

  /**
   * Sets a matching S3 Bucket target for the RecordSet
   * @returns 
   */
  public withAliasToS3() {
    this.withProperty('AliasTarget', Match.objectLike({
      DNSName: `s3-website.${this.template.region}.amazonaws.com`,
    }));
    return this;
  }

  /**
   * Sets matching resource records for the RecordSet
   * @param records The list of records
   * @returns 
   */
  public withResourceRecords(records: string[]) {
    this.withProperty('ResourceRecords', Match.arrayWith(records));
    return this;
  }
}