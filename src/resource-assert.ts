import assert = require("assert");
import { AdvancedTemplate } from "./advanced-template";
import { Dict, ResourceTypes } from "./types";

export class Resource {
  protected config: Dict;

  constructor(private type: ResourceTypes, protected template: AdvancedTemplate, protected props: any) {
  }

  protected setProperty(key: string, value: any): Resource {
    if (!this.props) {
      this.props = {};
      this.setRootProperty('Properties', this.props)
    }
    this.props[key] = value;
    return this;
  }

  protected setRootProperty(key: string, value: any): Resource {
    if (!this.config) {
      this.config = {};
    }
    this.config[key] = value;
    return this;
  }

  public find() {
    return this.template.findResources(this.type, this.config);
  }

  public findSimilarType() {
    return this.template.findResources(this.type);
  }

  private get definition(): any {
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

  public doesNotExist() {
    const resources = this.find();
    this.assert(Object.keys(resources).length === 0, 'Resource exists!');
  }

  public exists() {
    const resources = this.find();
    this.assert(Object.keys(resources).length > 0, 'Resource does not exist!');
  }

  public countIs(count: number) {
    this.template.resourceCountIs(this.type, count);
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

  public assert(condition: boolean, message: string) {
    assert(condition, message + '\nInfo: ' + this.toDebugString());
  }
}