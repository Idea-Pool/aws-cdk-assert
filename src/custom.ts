import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class CustomResource extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CUSTOM, template, props);
  }

  public withEventHandler(event: string, action: string, service: string, parameters?: any): CustomResource {
    const handler: any = {
      action, service,
    };
    if (parameters) {
      handler.parameters = Match.objectLike(parameters);
    }
    return this.setProperty(event, Match.serializedJson(Match.objectLike(handler))) as CustomResource;
  }

  public withCreateHandler(action: string, service: string, parameters?: any): CustomResource {
    return this.withEventHandler('Create', action, service, parameters);
  }

  public withUpdateHandler(action: string, service: string, parameters?: any): CustomResource {
    return this.withEventHandler('Update', action, service, parameters);
  }

  public withServiceToken(resource: Resource): CustomResource {
    return this.setProperty('ServiceToken', AdvancedMatcher.arn(resource)) as CustomResource;
  }

  public withDeletionPolicy(policy: string): CustomResource {
    return this.setRootProperty('DeletionPolicy', policy) as CustomResource;
  }

  public withUpdateReplacePolicy(policy: string): CustomResource {
    return this.setRootProperty('UpdateReplacePolicy', policy) as CustomResource;
  }
}