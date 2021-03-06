import assert = require("assert");
import { RemovalPolicy } from "aws-cdk-lib";
import { Match, Matcher } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Dict, KeyAndProps } from "./types";

/**
 * Represents a general test construct.
 * This class can be extended to work with other, specific resources.
 */
export class Resource {
  /**
   * @member The CloudFormation type of the resource.
   */
  private type: string;
  /**
   * @member The parsed template.
   */
  protected template: AdvancedTemplate;
  /**
   * @member The matching Properties of the resource.
   */
  protected propertiesMatcher: any;
  /**
   * @member The matching definition of the resource (including the Properties).
   */
  protected definitionMatcher: Dict;
  /**
   * @member The matching key of the resource.
   */
  protected key: string;
  /**
   * @member The matching dependency keys of the resource (DependsOn).
   */
  protected dependencyMatcher: string[];
  /**
   * @member The matching Metadata of the resource.
   */
  protected metadataMatcher: any;

  constructor(type: string, template: AdvancedTemplate, props: any) {
    this.type = type;
    this.template = template;
    this.propertiesMatcher = props;
    this.dependencyMatcher = [];
  }

  /**
   * Sets the matching key.
   * @param key The exact or partial key.
   * @returns 
   */
  public withPartialKey(key: string) {
    this.key = key;
    return this;
  }

  /**
   * Sets/Overwrites a particular property in Properties.
   * @param key The key of the property.
   * @param value The property's value, either a matching string, 
   *              a Matcher, or not set to only match for
   *              the existence of the property.
   * @returns 
   */
  public withProperty(key: string, value?: any) {
    if (!this.propertiesMatcher) {
      this.propertiesMatcher = {};
    }
    if (value) {
      if (typeof value === 'string') {
        this.propertiesMatcher[key] = Match.stringLikeRegexp(value);
      } else {
        this.propertiesMatcher[key] = value;
      }
    } else {
      this.propertiesMatcher[key] = Match.anyValue();
    }
    this.withRootProperty('Properties', Match.objectLike(this.propertiesMatcher));
    return this;
  }

  /**
   * Sets/Overwrites a particular property in Metadata.
   * @param key The key of the metadata.
   * @param value The metadata's value, either a matching string, 
   *              a Matcher, or not set to only match for
   *              the existence of the property.
   * @returns 
   */
  public withMetadata(key: string, value?: any) {
    if (!this.metadataMatcher) {
      this.metadataMatcher = {};
    }
    if (value) {
      if (typeof value === 'string') {
        this.metadataMatcher[key] = Match.stringLikeRegexp(value);
      } else {
        this.metadataMatcher[key] = value;
      }
    } else {
      this.metadataMatcher[key] = Match.anyValue();
    }
    this.withRootProperty('Metadata', Match.objectLike(this.metadataMatcher));
    return this;
  }

  /**
   * Sets/Overwrites a particular property in the root definition.
   * @param key The key of the property.
   * @param value The metadata's value, either a matching string, 
   *              a Matcher, or not set to only match for
   *              the existence of the property.
   * @returns 
   */
  public withRootProperty(key: string, value?: any) {
    if (!this.definitionMatcher) {
      this.definitionMatcher = {};
    }
    if (value) {
      if (typeof value === 'string') {
        this.definitionMatcher[key] = Match.stringLikeRegexp(value);
      } else {
        this.definitionMatcher[key] = value;
      }
    } else {
      this.definitionMatcher[key] = Match.anyValue();
    }
    return this;
  }

  /**
   * Returns dictionary (object) of the matching resources
   * from the template, considering the matching definition
   * and the key, if set.
   * @returns 
   */
  public find(): KeyAndProps {
    const resources = this.template.findResources(this.type, this.definitionMatcher);
    if (this.key) {
      for (const key in resources) {
        if (!key.toLowerCase().includes(this.key.toLowerCase())) {
          delete resources[key];
        }
      }
    }
    return resources;
  }

  /**
   * Returns the dictionary (object) of the resources with
   * the same type as the current one.
   * @returns 
   */
  public findSimilarType(): KeyAndProps {
    return this.template.findResources(this.type);
  }

  /**
   * The definition of the resource from the template.
   * @throws {AssertionError} if the resource is not found.
   * @throws {AssertionError} if more than one matching resource is found.
   */
  protected get definition(): any {
    const resources = this.find();
    const ids = Object.keys(resources);

    this.assert(ids.length > 0, 'Resource not found!');
    this.assert(ids.length == 1, 'Resource is not unique, multiple one found!');

    const resource = resources[ids[0]];
    resource.Id = ids[0];
    return resource;
  }

  /**
   * The key/ID of the resource from the template.
   */
  public get id(): string {
    return this.definition.Id;
  }

  /**
   * The metadata of the resource from the template.
   */
  public get metadata(): Dict {
    return this.definition.Metadata;
  }

  /**
   * The matcher for the ARN of the resource.
   */
  public get arn(): Matcher {
    return AdvancedMatcher.arn(this);
  }

  /**
   * The matcher for the Ref of the resource.
   */
  public get ref(): Matcher {
    return Match.objectEquals({
      Ref: this.id,
    });
  }

  /**
   * The number of resources matching from the template.
   * @returns 
   */
  public count(): number {
    const resources = this.find();
    return Object.keys(resources).length;
  }

  /**
   * Checks if the matching resource does not exist.
   * @throws {AssertionError} if the matching resource exists.
   */
  public doesNotExist(): void {
    this.assert(this.count() === 0, 'Resource exists!');
  }

  /**
   * Checks if the matching resource exists.
   * @throws {AssertionError} if the matching resource does not exist.
   */
  public exists(): void {
    this.assert(this.count() > 0, 'Resource does not exist!');
  }

  /**
   * Checks if the number of matching resources is expected.
   * @param count The expected number of matching resources.
   * @throws {AssertionError} if the number of the matching resources is not the expected.
   */
  public countIs(count: number): void {
    this.assert(this.count() === count, 'Resource count does not match!');
  }

  /**
   * Converts the resource to its CloudFormation definition from the template.
   * @returns 
   */
  public toJSON(): any {
    return this.definition;
  }

  /**
   * Returns debug information (as JSON string) of the test construct,
   * including the matching definition and the resources with the same type
   * found in the template.
   * @returns 
   */
  public toDebugString(): string {
    return JSON.stringify({
      config: this.definitionMatcher,
      similarType: this.findSimilarType(),
    }, null, 2)
  }

  /**
   * Asserts the condition and in case of failure,
   * fails with a detailed error containing the template's
   * debug information.
   * @param condition The condition to evaluate for true.
   * @param message The message to fail if the condition is false.
   * @throws {AssertionError} if the condition is false.
   */
  public assert(condition: boolean, message: string): void {
    assert(condition, message + '\nInfo: ' + this.toDebugString());
  }

  /**
   * Checks if the tag with the given name (and optionally value) exists on the resource.
   * @param key The exact name of the tag.
   * @param value Either empty to check only for the tag or the exact value of the tag.
   * @returns 
   * @throws {AssertionError} if the tag is not found.
   */
  public hasTag(key: string, value?: string) {
    const tags = this.definition.Properties?.Tags;
    this.assert(tags, 'The resource does not have any tags');
    this.assert(key in tags, `There is no such tag like '${key}' on the resource!`);
    if (value) {
      this.assert(tags[key] === value, `The tag '${key}' is not as expected (${value}): ${tags[key]}!`);
    }
    return this;
  }

  /**
   * Sets a matching dependency of the resource (DependsOn root property).
   * @param resource The test construct to match dependency on.
   * @returns 
   */
  public dependsOn(resource: Resource) {
    this.dependencyMatcher.push(resource.id);
    this.withRootProperty('DependsOn', Match.arrayWith(this.dependencyMatcher));
    return this;
  }
}

/**
 * Represents a test construct with RemovalPolicy.
 * This class can be extended to work with other, specific resources.
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.RemovalPolicy.html}
 */
export class RemovableResource extends Resource {
  private static mapRemovalPolicy(policy: RemovalPolicy): string {
    switch (policy) {
      case RemovalPolicy.RETAIN:
        return "Retain";
      case RemovalPolicy.SNAPSHOT:
        return "Snapshot";
      default:
        return "Delete";
    }
  }

  /**
   * Sets matching properties inferred from the RemovalPolicy
   * (i.e. DeletionPolicy, UpdateReplacePolicy).
   * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.RemovalPolicy.html}
   * @param policy The RemovalPolicy to match with.
   * @returns 
   */
  public withRemovalPolicy(policy: RemovalPolicy) {
    const operation = RemovableResource.mapRemovalPolicy(policy);
    this.withRootProperty('DeletionPolicy', Match.stringLikeRegexp(operation));
    this.withRootProperty('UpdateReplacePolicy', Match.stringLikeRegexp(operation));
    return this;
  }
}