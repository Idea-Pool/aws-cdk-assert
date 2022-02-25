import assert = require("assert");
import { RemovalPolicy } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { AdvancedTemplate } from "./advanced-template";
import { Dict, ResourceTypes, KeyAndProps } from "./types";

export class Resource {
  protected config: Dict;
  protected key: string;
  protected dependencyKeys: string[];

  constructor(private type: ResourceTypes, protected template: AdvancedTemplate, protected props: any) {
    this.dependencyKeys = [];
  }

  public withPartialKey(key: string): Resource {
    this.key = key;
    return this;
  }

  protected setProperty(key: string, value: any): Resource {
    if (!this.props) {
      this.props = {};
      this.setRootProperty('Properties', this.props)
    }
    this.props[key] = value;
    return this;
  }

  public withProperty(key: string, value: any): Resource {
    return this.setProperty(key, value);
  }

  protected setRootProperty(key: string, value: any): Resource {
    if (!this.config) {
      this.config = {};
    }
    this.config[key] = value;
    return this;
  }

  public withRootProperty(key: string, value: any): Resource {
    return this.setRootProperty(key, value);
  }

  public find(): KeyAndProps {
    const resources = this.template.findResources(this.type, this.config);
    if (this.key) {
      for (const key in resources) {
        if (!key.toLowerCase().includes(this.key.toLowerCase())) {
          delete resources[key];
        }
      }
    }
    return resources;
  }

  public findSimilarType(): KeyAndProps {
    return this.template.findResources(this.type);
  }

  protected get definition(): any {
    const resources = this.find();
    const ids = Object.keys(resources);

    this.assert(ids.length > 0, 'Resource not found!');
    this.assert(ids.length == 1, 'Resource is not unique, multiple one found!');

    const resource = resources[ids[0]];
    resource.Id = ids[0];
    return resource;
  }

  public get id(): string {
    return this.definition.Id;
  }

  public count(): number {
    const resources = this.find();
    return Object.keys(resources).length;
  }

  public doesNotExist(): void {
    this.assert(this.count() === 0, 'Resource exists!');
  }

  public exists(): void {
    this.assert(this.count() > 0, 'Resource does not exist!');
  }

  public countIs(count: number): void {
    this.assert(this.count() === count, 'Resource cound does not match!');
  }

  public toJSON(): any {
    return this.definition;
  }

  public toDebugString(): string {
    return JSON.stringify({
      props: this.props,
      similarType: this.findSimilarType(),
    }, null, 2)
  }

  public assert(condition: boolean, message: string): void {
    assert(condition, message + '\nInfo: ' + this.toDebugString());
  }

  public hasTag(key: string, value?: string): Resource {
    const tag = this.definition.Properties?.Tags.find((tag: any): boolean => {
      return tag.Key === key && (!value || tag.Value === value);
    });
    this.assert(tag, `There is no such tag like ${key}${value ? ':' + value : ''}`);
    return this;
  }

  public dependsOn(resource: Resource): Resource {
    this.dependencyKeys.push(resource.id);
    this.setRootProperty('DependsOn', Match.arrayWith(this.dependencyKeys));
    return this;
  }
}

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

  public withRemovalPolicy(policy: RemovalPolicy) {
    const operation = RemovableResource.mapRemovalPolicy(policy);
    this.setRootProperty('DeletionPolicy', Match.stringLikeRegexp(operation));
    this.setRootProperty('UpdateReplacePolicy', Match.stringLikeRegexp(operation));
    return this;
  }
}