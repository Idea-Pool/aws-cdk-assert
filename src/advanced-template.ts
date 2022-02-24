import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CloudFrontDistribution } from "./cloudfront";
import { S3Bucket, S3BucketPolicy } from "./s3";
import { Route53RecordSet } from "./route53";
import { Dict, KeyAndProps } from "./types";

export class AdvancedTemplate {
  constructor(private template: Template, public region?: string) { }

  public static fromStack(stack: Stack): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromStack(stack), stack.region);
  }

  public static fromJSON(template: Dict, region?: string): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromJSON(template), region);
  }

  public static fromString(template: string, region?: string): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromString(template), region);
  }

  public findConditions(logicalId: string, props?: any): KeyAndProps {
    return this.template.findConditions(logicalId, props);
  }

  public findMappings(logicalId: string, props?: any): KeyAndProps {
    return this.template.findMappings(logicalId, props);
  }

  public findOutputs(logicalId: string, props?: any): KeyAndProps {
    return this.template.findOutputs(logicalId, props);
  }

  public findParameters(logicalId: string, props?: any): KeyAndProps {
    return this.template.findParameters(logicalId, props);
  }

  public findResources(type: string, props?: any): KeyAndProps {
    return this.template.findResources(type, props);
  }

  public hasCondition(logicalId: string, props: any): void {
    this.template.hasCondition(logicalId, props);
  }

  public hasMapping(logicalId: string, props: any): void {
    this.template.hasMapping(logicalId, props);
  }

  public hasOutput(logicalId: string, props: any): void {
    this.template.hasOutput(logicalId, props);
  }

  public hasParameter(logicalId: string, props: any): void {
    this.template.hasParameter(logicalId, props);
  }

  public hasResource(type: string, props: any): void {
    this.template.hasResource(type, props);
  }

  public hasResourceProperties(type: string, props: any): void {
    this.template.hasResourceProperties(type, props);
  }

  public resourceCountIs(type: string, count: number): void {
    this.template.resourceCountIs(type, count);
  }

  public templateMatches(expected: any): void {
    this.template.templateMatches(expected);
  }

  public toJSON(): Dict {
    return this.template.toJSON();
  }

  public s3Bucket(props?: any): S3Bucket {
    return new S3Bucket(this, props);
  }

  public s3BucketPolicy(props?: any): S3BucketPolicy {
    return new S3BucketPolicy(this, props);
  }

  public cloudFrontDistribution(props?: any): CloudFrontDistribution {
    return new CloudFrontDistribution(this, props);
  }

  public route53RecordSet(props?: any): Route53RecordSet {
    return new Route53RecordSet(this, props);
  }
}