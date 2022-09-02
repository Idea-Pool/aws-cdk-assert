import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CloudFrontDistribution, CloudFrontFunction } from "./cloudfront";
import { S3Bucket, S3BucketPolicy } from "./s3";
import { Route53HostedZone, Route53RecordSet } from "./route53";
import { Dict, KeyAndProps } from "./types";
import { CloudFormationCustomResource } from "./cloudformation";
import { CodeBuildProject, CodeBuildSourceCredentials } from "./codebuild";
import { CustomResource } from "./custom";
import { DynamoDBTable } from "./dynamodb";
import { SSMParameter } from "./ssm";
import { WafV2WebACL } from "./wafv2";
import { IAMPolicy, IAMRole } from "./iam";
import { LambdaFunction, LambdaPermission } from "./lambda";
import { Resource } from "./resource";
import { RemovableResource } from ".";
import { LogGroup } from "./logs";
import { ApiGatewayAccount, ApiGatewayApiKey, ApiGatewayBasePathMapping, ApiGatewayDeployment, ApiGatewayDomain, ApiGatewayMethod, ApiGatewayResource, ApiGatewayRestApi, ApiGatewayStage, ApiGatewayUsagePlan, ApiGatewayUsagePlanKey } from "./apigateway";
import { Secret } from "./secretsmanager";

/**
 * CloudFormation/CDK template assertion class, 
 * based on {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html|AWS CDK Assertions Template} 
 */
export class AdvancedTemplate {
  /**
   * @member The parsed template
   */
  private template: Template;
  /**
   * @member The region of the stack
   */
  public region: string;

  /**
   * @param template The parsed template
   * @param region The region of the stack
   */
  constructor(template: Template, region: string) {
    this.template = template;
    this.region = region;
  }

  /**
   * Parses a template from the CDK stack instance.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#static-fromwbrstackstack}
   * 
   * @param stack The stack instance
   * @returns
   */
  public static fromStack(stack: Stack): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromStack(stack), stack.region);
  }

  /**
   * Parses a template from the CloudFormation template JSON.
   * @ee {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#static-fromwbrjsontemplate}
   * 
   * @param template The CloudFormation template, formatted as a nested set of records.
   * @param region The region of the stack.
   * @returns
   */
  public static fromJSON(template: Dict, region: string): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromJSON(template), region);
  }

  /**
   * Parses a template from the CloudFormation template.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#static-fromwbrstringtemplate}
   * 
   * @param template The CloudFormation template.
   * @param region The region of the stack
   * @returns 
   */
  public static fromString(template: string, region: string): AdvancedTemplate {
    return new AdvancedTemplate(Template.fromString(template), region);
  }

  /**
   * Returns the Conditions matching with the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#findwbrconditionslogicalid-props}
   */
  public findConditions(logicalId: string, props?: any): KeyAndProps {
    return this.template.findConditions(logicalId, props);
  }

  /**
   * Returns the Mapping matching with the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#findwbrmappingslogicalid-props}
   */
  public findMappings(logicalId: string, props?: any): KeyAndProps {
    return this.template.findMappings(logicalId, props);
  }

  /**
   * Returns the Outputs matching with the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#findwbroutputslogicalid-props}
   */
  public findOutputs(logicalId: string, props?: any): KeyAndProps {
    return this.template.findOutputs(logicalId, props);
  }

  /**
   * Returns the Parameters matching with the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#findwbrparameterslogicalid-props}
   */
  public findParameters(logicalId: string, props?: any): KeyAndProps {
    return this.template.findParameters(logicalId, props);
  }

  /**
   * Returns the Resources of type matching with the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#findwbrresourcestype-props}
   */
  public findResources(resourceType: string, props?: any): KeyAndProps {
    return this.template.findResources(resourceType, props);
  }

  /**
   * Checks if there is a Condition matching the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbrconditionlogicalid-props}
   */
  public hasCondition(logicalId: string, props: any): void {
    this.template.hasCondition(logicalId, props);
  }

  /**
   * Checks if there is a Mapping matching the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbrmappinglogicalid-props}
   */
  public hasMapping(logicalId: string, props: any): void {
    this.template.hasMapping(logicalId, props);
  }

  /**
   * Checks if there is an Output matching the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbroutputlogicalid-props}
   */
  public hasOutput(logicalId: string, props: any): void {
    this.template.hasOutput(logicalId, props);
  }

  /**
   * Checks if there is a Parameter matching the passed properties.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbrparameterlogicalid-props}
   */
  public hasParameter(logicalId: string, props: any): void {
    this.template.hasParameter(logicalId, props);
  }

  /**
   * Checks if there is a Resource matching the passed definition.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbrresourcetype-props} 
   */
  public hasResource(resourceType: string, props: any): void {
    this.template.hasResource(resourceType, props);
  }

  /**
   * Checks if there is a Resource matching the passed properties. 
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#haswbrresourcewbrpropertiestype-props}
   */
  public hasResourceProperties(resourceType: string, props: any): void {
    this.template.hasResourceProperties(resourceType, props);
  }

  /**
   * Checks if the count of the Resources of type is the passed one.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#resourcewbrcountwbristype-count} 
   */
  public resourceCountIs(resourceType: string, count: number): void {
    this.template.resourceCountIs(resourceType, count);
  }

  /**
   * Checks if the template matches the passed CloudFormation JSON template.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#templatewbrmatchesexpected}
   */
  public templateMatches(expected: AdvancedTemplate | KeyAndProps): void {
    if (expected instanceof AdvancedTemplate) {
      this.templateMatches(expected.toJSON());
    } else {
      this.template.templateMatches(expected);
    }
  }

  /**
   * Returns the CloudFormation JSON template of the current one.
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#towbrjson}
   */
  public toJSON(): Dict {
    return this.template.toJSON();
  }

  /**
   * Logs the CloudFormation JSON to the console.
   */
  public debug(): void {
    console.log(JSON.stringify(this.toJSON(), null, 2));
  }

  ////////////////////////////////////////////////////////////////////////////
  // TEST CONSTRUCTS
  ////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a general Resource test construct with the passed type and properties.
   * @param resourceType The CloudFormation resource type
   * @param props The properties of the expected test construct
   * @returns 
   */
  public resource(resourceType: string, props?: any): Resource {
    return new Resource(resourceType, this, props);
  }

  /**
   * Creates a general RemovableResource test construct with the passed type and properties.
   * @param resourceType The CloudFormation resource type
   * @param props The properties of the expected test construct
   * @returns 
   */
  public removableResource(resourceType: string, props?: any): RemovableResource {
    return new RemovableResource(resourceType, this, props);
  }

  /**
   * Creates an API Gateway Account test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayAccount(props?: any): ApiGatewayAccount {
    return new ApiGatewayAccount(this, props);
  }

  /**
   * Creates an API Gateway API Key test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayApiKey(props?: any): ApiGatewayApiKey {
    return new ApiGatewayApiKey(this, props);
  }

  /**
   * Creates an API Gateway Base Path Mapping test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayBasePathMapping(props?: any): ApiGatewayBasePathMapping {
    return new ApiGatewayBasePathMapping(this, props);
  }

  /**
   * Creates an API Gateway Deployment test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayDeployment(props?: any): ApiGatewayDeployment {
    return new ApiGatewayDeployment(this, props);
  }

  /**
   * Creates an API Gateway Domain test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayDomain(props?: any): ApiGatewayDomain {
    return new ApiGatewayDomain(this, props);
  }

  /**
   * Creates an API Gateway Method test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayMethod(props?: any): ApiGatewayMethod {
    return new ApiGatewayMethod(this, props);
  }

  /**
   * Creates an API Gateway Resource test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayResource(props?: any): ApiGatewayResource {
    return new ApiGatewayResource(this, props);
  }

  /**
   * Creates an API Gateway REST API test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayRestApi(props?: any): ApiGatewayRestApi {
    return new ApiGatewayRestApi(this, props);
  }

  /**
   * Creates an API Gateway Stage test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayStage(props?: any): ApiGatewayStage {
    return new ApiGatewayStage(this, props);
  }

  /**
   * Creates an API Gateway Usage Plan test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayUsagePlan(props?: any): ApiGatewayUsagePlan {
    return new ApiGatewayUsagePlan(this, props);
  }

  /**
   * Creates an API Gateway Usage Plan Key test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public apiGatewayUsagePlanKey(props?: any): ApiGatewayUsagePlanKey {
    return new ApiGatewayUsagePlanKey(this, props);
  }

  /**
   * Creates a CloudFormation CustomResource test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public cloudFormationCustomResource(props?: any): CloudFormationCustomResource {
    return new CloudFormationCustomResource(this, props);
  }

  /**
   * Creates a CloudFront Distribution test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public cloudFrontDistribution(props?: any): CloudFrontDistribution {
    return new CloudFrontDistribution(this, props);
  }

  /**
   * Creates a CloudFront Function test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public cloudFrontFunction(props?: any): CloudFrontFunction {
    return new CloudFrontFunction(this, props);
  }

  /**
   * Creates a CodeBuild Project test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public codeBuildProject(props?: any): CodeBuildProject {
    return new CodeBuildProject(this, props);
  }

  /**
   * Creates a CodeBuild SourceCredentials test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public codeBuildSourceCredentials(props?: any): CodeBuildSourceCredentials {
    return new CodeBuildSourceCredentials(this, props);
  }

  /**
   * Creates a CustomResource test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public customResource(props?: any): CustomResource {
    return new CustomResource(this, props);
  }

  /**
   * Creates a DynamoDB Table test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public dynamoDBTable(props?: any): DynamoDBTable {
    return new DynamoDBTable(this, props);
  }

  /**
   * Creates an IAM Role test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public iamRole(props?: any): IAMRole {
    return new IAMRole(this, props);
  }

  /**
   * Creates an IAM Policy test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public iamPolicy(props?: any): IAMPolicy {
    return new IAMPolicy(this, props);
  }

  /**
   * Creates a Lambda Function test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public lambdaFunction(props?: any): LambdaFunction {
    return new LambdaFunction(this, props);
  }

  /**
   * Creates a Lambda Permission test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public lambdaPermission(props?: any): LambdaPermission {
    return new LambdaPermission(this, props);
  }

  /**
   * Creates a LogGroup test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public logGroup(props?: any): LogGroup {
    return new LogGroup(this, props);
  }

  /**
   * Creates a Route53 HostedZone test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public route53HostedZone(props?: any): Route53HostedZone {
    return new Route53HostedZone(this, props);
  }

  /**
   * Creates a Route53 RecordSet test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public route53RecordSet(props?: any): Route53RecordSet {
    return new Route53RecordSet(this, props);
  }

  /**
   * Creates an S3 Bucket test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public s3Bucket(props?: any): S3Bucket {
    return new S3Bucket(this, props);
  }

  /**
   * Creates an S3 Bucket Policy test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public s3BucketPolicy(props?: any): S3BucketPolicy {
    return new S3BucketPolicy(this, props);
  }

  /**
   * Creates a SecretsManager Secret test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public secret(props?: any): Secret {
    return new Secret(this, props);
  }

  /**
   * Creates an SSM Parameter test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public ssmParameter(props?: any): SSMParameter {
    return new SSMParameter(this, props);
  }

  /**
   * Creates a WAF v2 WebACL test construct with the passed Properties.
   * @param props The Properties of the expected test construct.
   * @returns 
   */
  public wafV2WebACL(props?: any): WafV2WebACL {
    return new WafV2WebACL(this, props);
  }
}