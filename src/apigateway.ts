import { Match } from "aws-cdk-lib/assertions";
import { AuthorizationType, CfnAccount, CfnApiKey, CfnBasePathMapping, CfnDeployment, CfnDomainName, CfnMethod, CfnResource, CfnRestApi, CfnStage, CfnUsagePlan, CfnUsagePlanKey, EndpointType, IntegrationType, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { LogGroup } from "./logs";
import { Resource } from "./resource";
import { Secret } from "./secretsmanager";

/**
 * A test construct representing an API Gateway Rest API
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnRestApi.html}
 */
export class ApiGatewayRestApi extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnRestApi.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Creates a matcher for the RootResourceID of the Rest API.
   */
  get resourceId() {
    return AdvancedMatcher.fnGetAtt(this.id, "RootResourceId");
  }

  /**
   * Sets a matching name of the Rest API.
   * @param name The whole or a partial name to match.
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('Name', name);
    return this;
  }
}

/**
 * A test construct representing an API Gateway Account (IAM Role for CloudWatch)
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnAccount.html}
 */
export class ApiGatewayAccount extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnAccount.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching IAM Role for CloudWatch.
   * @param role The IAM Role test construct.
   * @returns 
   */
  public withCloudWatchRole(role: IAMRole) {
    this.withProperty('CloudWatchRoleArn', role.arn);
    return this;
  }
}

/**
 * A test construct representing an API Gateway API Deployment
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnDeployment.html}
 */
export class ApiGatewayDeployment extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDeployment.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Rest API the Deployment belongs to
   * @param api The Rest API test construct
   * @returns 
   */
  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }
}

/**
 * A test construct representing an API Gateway API Stage
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnStage.html}
 */
export class ApiGatewayStage extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnStage.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Rest API the Deployment belongs to
   * @param api The Rest API test construct
   * @returns 
   */
  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  /**
   * Sets the matching Deployment the Stage belongs to
   * @param deployment The Deployment test construct
   * @returns 
   */
  public ofDeployment(deployment: ApiGatewayDeployment) {
    this.withProperty('DeploymentId', deployment.ref);
    return this;
  }

  /**
   * Sets a matching stage name
   * @param name The whole or a partial stage name to match
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('StageName', name);
    return this;
  }

  /**
   * Sets the matching log group
   * @param group The LogGroup test construct
   * @returns 
   */
  public withLogGroup(group: LogGroup) {
    this.withProperty('AccessLogSetting', Match.objectLike({
      DestinationArn: group.arn,
    }));
    return this;
  }
}

/**
 * A test construct for an API Gateway API Method
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnMethod.html}
 */
export class ApiGatewayMethod extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnMethod.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Rest API the Deployment belongs to
   * @param api The Rest API test construct
   * @returns 
   */
  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  /**
   * Sets a matching HTTP method
   * @param method The HTTP method to match
   * @returns 
   */
  public withHttpMethod(method: HttpMethod) {
    this.withProperty('HttpMethod', method);
    return this;
  }

  /**
   * Sets the matching resource the method belongs to
   * @param resource The Rest API or the API Gateway Resource test construct to match
   * @returns 
   */
  public ofResource(resource: ApiGatewayRestApi | ApiGatewayResource) {
    if (resource instanceof ApiGatewayRestApi) {
      this.withProperty('ResourceId', resource.resourceId);
    } else {
      this.withProperty('ResourceId', resource.ref);
    }
    return this;
  }

  /**
   * Sets the matching authorization type for the method
   * @param type The authorization type to match
   * @returns 
   */
  public withAuthorization(type: AuthorizationType) {
    this.withProperty('AuthorizationType', type);
    return this;
  }

  /**
   * Sets matching to no authorization
   * @returns 
   */
  public withNoAuthorization() {
    return this.withAuthorization(AuthorizationType.NONE);
  }

  /**
   * Sets matching mock integration type
   * @returns 
   */
  public withMockIntegration() {
    this.withProperty('Integration', Match.objectLike({
      Type: IntegrationType.MOCK,
    }));
    return this;
  }

  /**
   * Sets a matching HTTP integration
   * @param method The HTTP method to match
   * @param type The integration type to match
   * @returns 
   */
  public withHTTPIntegration(method: HttpMethod, type: IntegrationType) {
    this.withProperty('Integration', Match.objectLike({
      IntegrationHttpMethod: method,
      Type: type,
    }));
    return this;
  }
}

/**
 * A test construct for an API Gateway Resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnResource.html}
 */
export class ApiGatewayResource extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnResource.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Rest API the Deployment belongs to
   * @param api The Rest API test construct
   * @returns 
   */
  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  /**
   * Sets the matching parent resource
   * @param parent The parent Rest API or other Resource test construct
   * @returns 
   */
  public ofParent(parent: ApiGatewayRestApi | ApiGatewayResource) {
    if (parent instanceof ApiGatewayRestApi) {
      this.withProperty('ResourceId', parent.resourceId);
    } else {
      this.withProperty('ResourceId', parent.ref);
    }
    return this;
  }

  /**
   * Sets a matching path for the resource
   * @param path The whole or a partial path to match
   * @returns 
   */
  public withPath(path: string) {
    this.withProperty('PathPart', path);
    return this;
  }
}

/**
 * A test construct for an API Gateway Domain Name
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnDomainName.html}
 */
export class ApiGatewayDomain extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDomainName.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching domain name
   * @param domain The whole or a partial domain name to match
   * @returns 
   */
  public withDomainName(domain: string) {
    this.withProperty('DomainName', domain);
    return this;
  }

  /**
   * Sets a matching Security Policy
   * @param policy The security policy to match
   * @returns 
   */
  public withSecurityPolicy(policy: SecurityPolicy) {
    this.withProperty('SecurityPolicy', policy);
    return this;
  }

  /**
   * Sets a matching Endpoint Type
   * @param type The endpoint type to match
   * @returns 
   */
  public withEndpointType(type: EndpointType) {
    this.withProperty('EndpointConfiguration', Match.objectLike({
      Types: Match.arrayEquals([type]),
    }));
    return this;
  }

  /**
   * Sets a matching Certificate for regional endpoint
   * @param resource The certificate (or another resource) to match
   * @returns 
   */
  public withRegionalCertificate(resource: Resource) {
    this.withProperty('RegionalCertificateArn', resource.arn);
    return this;
  }
}

/**
 * A test construct for an API Gateway Base Path Mapping (for Domain Name)
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnBasePathMapping.html}
 */
export class ApiGatewayBasePathMapping extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnBasePathMapping.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Rest API the mapping belongs to
   * @param api The Rest API test construct
   * @returns 
   */
  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  /**
   * Sets the matching Domain Name the mapping belongs to
   * @param domain The Domain Name test construct
   * @returns 
   */
  public ofDomainName(domain: ApiGatewayDomain) {
    this.withProperty('DomainName', domain.ref);
    return this;
  }

  /**
   * Sets the matching State the mapping belongs to
   * @param stage The Stage test construct
   * @returns 
   */
  public toStage(stage: ApiGatewayStage) {
    this.withProperty('Stage', stage.ref);
    return this;
  }
}

/**
 * A test construct for an API Gateway API Key
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnApiKey.html}
 */
export class ApiGatewayApiKey extends Resource {
  private apiStages: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnApiKey.CFN_RESOURCE_TYPE_NAME, template, props);
    this.apiStages = [];
  }

  /**
   * Sets a matching name for the API Key
   * @param name The whole or a partial API Key name to match
   * @returns 
   */
  public withName(name: string) {
    this.withProperty('Name', name);
    return this;
  }

  /**
   * Sets the matching Rest API and Stage the API Key belongs to
   * @param api The Rest API to match
   * @param stage The Stage to match
   */
  public forApiAndStage(api: ApiGatewayRestApi, stage: ApiGatewayStage) {
    this.apiStages.push(Match.objectLike({
      RestApiId: api.ref,
      StageName: stage.ref,
    }));
    this.withProperty('ApiStages', Match.arrayWith(this.apiStages));
  }

  /**
   * Sets a matching value for the API Key
   * @param value The whole or a partial value, or a matcher to match
   * @returns 
   */
  public withValue(value: any) {
    this.withProperty('Value', AdvancedMatcher.fnJoin(
      Match.arrayWith(value),
    ));
    return this;
  }

  /**
   * Sets a matching value as a Secret for the API Key
   * @param secret The SecretsManager Secret to match
   * @returns 
   */
  public withSecretValue(secret: Secret) {
    return this.withValue(secret.ref);
  }
}

/**
 * A test construct for an API Gateway Usage Plan
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnUsagePlan.html}
 */
export class ApiGatewayUsagePlan extends Resource {
  private apiStages: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnUsagePlan.CFN_RESOURCE_TYPE_NAME, template, props);
    this.apiStages = [];
  }

  /**
   * Sets the matching Rest API and Stage the API Key belongs to
   * @param api The Rest API to match
   * @param stage The Stage to match
   */
  public withApiStage(api: ApiGatewayRestApi, stage: ApiGatewayStage) {
    this.apiStages.push(Match.objectLike({
      ApiId: api.ref,
      Stage: stage.ref,
    }));
    this.withProperty('ApiStages', Match.arrayWith(this.apiStages));
    return this;
  }
}

/**
 * A test construct for an API Gateway Usage Plan Key
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CfnUsagePlanKey.html}
 */
export class ApiGatewayUsagePlanKey extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnUsagePlanKey.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets the matching Usage Plan the Key belongs to
   * @param plan The Usage Plan to match
   * @returns 
   */
  public ofUsagePlan(plan: ApiGatewayUsagePlan) {
    this.withProperty('UsagePlanId', plan.ref);
    return this;
  }

  /**
   * Sets the matching API Key the Usage Plan associated with
   * @param apiKey The API Key to match
   * @returns 
   */
  public withApiKey(apiKey: ApiGatewayApiKey) {
    this.withProperty('KeyId', apiKey.ref);
    this.withProperty('KeyType', 'API_KEY');
    return this;
  }
}