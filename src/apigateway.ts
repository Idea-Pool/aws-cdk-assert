import { Match } from "aws-cdk-lib/assertions";
import { CfnAccount, CfnApiKey, CfnBasePathMapping, CfnDeployment, CfnDomainName, CfnMethod, CfnResource, CfnRestApi, CfnStage, CfnUsagePlan, CfnUsagePlanKey, EndpointType, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { LogGroup } from "./logs";
import { Resource } from "./resource";
import { Secret } from "./secretsmanager";

export class ApiGatewayRestApi extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnRestApi.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  get resourceId() {
    return AdvancedMatcher.fnGetAtt(this.id, "RootResourceId");
  }

  public withName(name: string) {
    this.withProperty('Name', name);
    return this;
  }
}

export class ApiGatewayAccount extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnAccount.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public withCloudWatchRole(role: IAMRole) {
    this.withProperty('CloudWatchRoleArn', role.arn);
    return this;
  }
}

export class ApiGatewayDeployment extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDeployment.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }
}

export class ApiGatewayStage extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnStage.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  public ofDeployment(deployment: ApiGatewayDeployment) {
    this.withProperty('DeploymentId', deployment.ref);
    return this;
  }

  public withName(name: string) {
    this.withProperty('StageName', name);
    return this;
  }

  public withLogGroup(group: LogGroup) {
    this.withProperty('AccessLogSetting', Match.objectLike({
      DestinationArn: group.arn,
    }));
    return this;
  }
}

export class ApiGatewayMethod extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnMethod.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  public withHttpMethod(method: HttpMethod) {
    this.withProperty('HttpMethod', method);
    return this;
  }

  public ofResource(resource: ApiGatewayRestApi | ApiGatewayResource) {
    if (resource instanceof ApiGatewayRestApi) {
      this.withProperty('ResourceId', resource.resourceId);
    } else {
      this.withProperty('ResourceId', resource.ref);
    }
    return this;
  }

  public withAuthorization(type: any) {
    this.withProperty('AuthorizationType', type);
    return this;
  }

  public withNoAuthorization() {
    return this.withAuthorization('NONE');
  }

  public withMockIntegration() {
    this.withProperty('Integration', Match.objectLike({
      Type: 'MOCK',
    }));
    return this;
  }

  public withHTTPIntegration(method: HttpMethod, type: string) {
    this.withProperty('Integration', Match.objectLike({
      IntegrationHttpMethod: method,
      Type: type,
    }));
    return this;
  }
}

export class ApiGatewayResource extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnResource.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  public ofParent(parent: ApiGatewayRestApi | ApiGatewayResource) {
    if (parent instanceof ApiGatewayRestApi) {
      this.withProperty('ResourceId', parent.resourceId);
    } else {
      this.withProperty('ResourceId', parent.ref);
    }
    return this;
  }

  public withPath(path: string) {
    this.withProperty('PathPart', path);
    return this;
  }
}

export class ApiGatewayDomain extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnDomainName.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public withDomainName(domain: string) {
    this.withProperty('DomainName', domain);
    return this;
  }

  public withSecurityPolicy(policy: SecurityPolicy) {
    this.withProperty('SecurityPolicy', policy);
    return this;
  }

  public withEndpointType(type: EndpointType) {
    this.withProperty('EndpointConfiguration', Match.objectLike({
      Types: Match.arrayEquals([type]),
    }));
    return this;
  }

  public withRegionalCertificate(resource: Resource) {
    this.withProperty('RegionalCertificateArn', resource.arn);
    return this;
  }
}

export class ApiGatewayBasePathMapping extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnBasePathMapping.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofApi(api: ApiGatewayRestApi) {
    this.withProperty('RestApiId', api.ref);
    return this;
  }

  public ofDomainName(domain: ApiGatewayDomain) {
    this.withProperty('DomainName', domain.ref);
    return this;
  }

  public toStage(stage: ApiGatewayStage) {
    this.withProperty('Stage', stage.ref);
    return this;
  }
}

export class ApiGatewayApiKey extends Resource {
  private apiStages: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnApiKey.CFN_RESOURCE_TYPE_NAME, template, props);
    this.apiStages = [];
  }

  public withName(name: string) {
    this.withProperty('Name', name);
    return this;
  }

  public forApiStage(api: ApiGatewayRestApi, stage: ApiGatewayStage) {
    this.apiStages.push(Match.objectLike({
      RestApiId: api.ref,
      StageName: stage.ref,
    }));
    this.withProperty('ApiStages', Match.arrayWith(this.apiStages));
  }

  public withValue(value: any) {
    this.withProperty('Value', AdvancedMatcher.fnJoin(
      Match.arrayWith(value),
    ));
    return this;
  }

  public withSecretValue(secret: Secret) {
    return this.withValue(secret.ref);
  }
}

export class ApiGatewayUsagePlan extends Resource {
  private apiStages: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnUsagePlan.CFN_RESOURCE_TYPE_NAME, template, props);
    this.apiStages = [];
  }

  public withApiStage(api: ApiGatewayRestApi, stage: ApiGatewayStage) {
    this.apiStages.push(Match.objectLike({
      ApiId: api.ref,
      Stage: stage.ref,
    }));
    this.withProperty('ApiStages', Match.arrayWith(this.apiStages));
    return this;
  }
}

export class ApiGatewayUsagePlanKey extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnUsagePlanKey.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  public ofUsagePlan(plan: ApiGatewayUsagePlan) {
    this.withProperty('UsagePlanId', plan.ref);
    return this;
  }

  public withApiKey(apiKey: ApiGatewayApiKey) {
    this.withProperty('KeyId', apiKey.ref);
    this.withProperty('KeyType', 'API_KEY');
    return this;
  }
}