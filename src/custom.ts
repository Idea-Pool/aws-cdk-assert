import { Match } from "aws-cdk-lib/assertions";
import { AdvancedTemplate } from "./advanced-template";
import { Resource, RemovableResource } from "./resource";

/**
 * A test construct for the CustomResource resource type
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnCustomResource.html}
 */
export class CustomResource extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super('Custom::AWS', template, props);
  }

  /**
   * Sets a matching event handler for the custom resource
   * @param eventName The matching event name (exact match)
   * @param action The matching action name (exact match)
   * @param service The matching service name (exact match)
   * @param parameters Optional parameters of the custom resource
   * @returns 
   */
  public withEventHandler(eventName: string, action: string, service: string, parameters?: any) {
    const handler: any = {
      action, service,
    };
    if (parameters) {
      handler.parameters = Match.objectLike(parameters);
    }
    this.withProperty(eventName, Match.serializedJson(Match.objectLike(handler)));
    return this;
  }

  /**
   * Sets a matching "Create" event handler for the custom resource
   * @param action The matching action name (exact match)
   * @param service The matching service name (exact match)
   * @param parameters Optional parameters of the custom resource
   * @returns 
   */
  public withCreateHandler(action: string, service: string, parameters?: any) {
    return this.withEventHandler('Create', action, service, parameters);
  }

  /**
   * Sets a matching "Update" event handler for the custom resource
   * @param action The matching action name (exact match)
   * @param service The matching service name (exact match)
   * @param parameters Optional parameters of the custom resource
   * @returns 
   */
  public withUpdateHandler(action: string, service: string, parameters?: any) {
    return this.withEventHandler('Update', action, service, parameters);
  }

  /**
   * Sets a matching service token to the resource passed
   * @param resource The test construct to connect
   * @returns 
   */
  public withServiceToken(resource: Resource) {
    this.withProperty('ServiceToken', resource.arn);
    return this;
  }
}