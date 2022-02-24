// TODO: RecordSet

import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from ".";
import { AdvancedTemplate } from "./advanced-template"
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export enum RecordType {
  A = 'A',
  AAAA = 'AAAA',
  CNAME = 'CNAME',
  MX = 'MX',
  TXT = 'TXT',
  PTR = 'PTR',
  SRV = 'SRV',
  SPF = 'SPF',
  NAPTR = 'NAPTR',
  CAA = 'CAA',
  NS = 'NS',
}

export class Route53RecordSet extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.ROUTE53_RECORD_SET, template, props);
  }

  public withRecordType(recordType: RecordType): Route53RecordSet {
    return this.setProperty('Type', recordType) as Route53RecordSet;
  }

  public withName(name: string): Route53RecordSet {
    return this.setProperty('Name', name) as Route53RecordSet;
  }

  public inHostedZone(zoneId: string): Route53RecordSet {
    return this.setProperty('HostedZoneId', zoneId) as Route53RecordSet;
  }

  public withAliasToCloudFront(resource: Resource): Route53RecordSet {
    return this.setProperty('AliasTarget', Match.objectLike({
      DNSName: AdvancedMatcher.fnGetAtt(resource.id, "DomainName"),
    })) as Route53RecordSet;
  }

  public withAliasToS3(): Route53RecordSet {
    return this.setProperty('AliasTarget', Match.objectLike({
      DNSName: `s3-website.${this.template.region}.amazonaws.com`,
    })) as Route53RecordSet;
  }
}