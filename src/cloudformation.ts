import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class CloudFormationCustomResource extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CLOUD_FORMATION_CUSTOM_RESOURCE, template, props);
  }

  public withServiceToken(resource: Resource): CloudFormationCustomResource {
    return this.setProperty('ServiceToken', AdvancedMatcher.arn(resource)) as CloudFormationCustomResource;
  }

  public withDeletionPolicy(policy: string): CloudFormationCustomResource {
    return this.setRootProperty('DeletionPolicy', policy) as CloudFormationCustomResource;
  }

  public withUpdateReplacePolicy(policy: string): CloudFormationCustomResource {
    return this.setRootProperty('UpdateReplacePolicy', policy) as CloudFormationCustomResource;
  }

  public withProperty(key: string, value: any): CloudFormationCustomResource {
    return this.setProperty(key, value) as CloudFormationCustomResource;
  }
}