import { Match } from "aws-cdk-lib/assertions";
import { CfnAccount, CfnDeployment, CfnMethod, CfnResource, CfnRestApi, CfnStage } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { IAMRole } from "./iam";
import { LogGroup } from "./logs";
import { Resource } from "./resource";

export class ApiGatewayRestApi extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnRestApi.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  get resourceId() {
    return AdvancedMatcher.fnGetAtt(this.id, "RootResourceId");
  }

  public withName(name: string) {
    this.withProperty('Name', Match.stringLikeRegexp(name));
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
    this.withProperty('StageName', Match.stringLikeRegexp(name));
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