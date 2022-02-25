import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export interface CodeBuildProjectTriggerEvent {
  type: string;
  pattern?: string;
}

export class CodeBuildSourceCredentials extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CODE_BUILD_SOURCE_CREDENTIALS, template, props);
  }

  public withCredentials(authType: string, serverType: string, token: string): CodeBuildSourceCredentials {
    this.setProperty('AuthType', authType);
    this.setProperty('ServerType', serverType);
    this.setProperty('Token', Match.stringLikeRegexp(token));
    return this;
  }

  public withGitHubPersonalAccessToken(token: string): CodeBuildSourceCredentials {
    return this.withCredentials('PERSONAL_ACCESS_TOKEN', 'GITHUB', token);
  }
}

export class CodeBuildProject extends Resource {
  private environmentVariables: any[];

  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.CODE_BUILD_PROJECT, template, props);
    this.environmentVariables = [];
  }

  public withServiceRole(resource: Resource): CodeBuildProject {
    return this.setProperty('ServiceRole', AdvancedMatcher.arn(resource)) as CodeBuildProject;
  }

  public withSource(type: string, location: string): CodeBuildProject {
    return this.setProperty('Source', Match.objectLike({
      Location: Match.stringLikeRegexp(location),
      Type: type,
    })) as CodeBuildProject;
  }

  public withEnvironmentVariable(name: string, value?: any, type?: string): CodeBuildProject {
    const environmentVariable: any = {
      Name: name,
      Type: type || "PLAINTEXT",
    };
    if (value) {
      if (value instanceof Resource) {
        environmentVariable.Value = {
          Ref: value.id,
        };
      } else {
        environmentVariable.Value = value;
      }
    }
    this.environmentVariables.push(Match.objectLike(environmentVariable));
    return this.setProperty('Environment', Match.objectLike({
      EnvironmentVariables: Match.arrayWith(this.environmentVariables),
    })) as CodeBuildProject;
  }

  public withConcurrentBuildLimit(limit: number): CodeBuildProject {
    return this.setProperty('ConcurrentBuildLimit', limit) as CodeBuildProject;
  }

  public withTriggers(events: CodeBuildProjectTriggerEvent[], webhook = true): CodeBuildProject {
    const eventMatchers = events.map(e => {
      const filter: any = { Type: e.type };
      if (e.pattern) {
        filter.Pattern = Match.stringLikeRegexp(e.pattern);
      }
      return Match.objectLike(filter);
    });
    return this.setProperty('Triggers', Match.objectLike({
      Webhook: !!webhook,
      FilterGroups: Match.arrayWith([
        Match.arrayWith(eventMatchers)
      ])
    })) as CodeBuildProject;
  }

  public withArtifact(type: string, location?: any, encription?: boolean, packaging?: boolean): CodeBuildProject {
    const artifact: any = {
      EncryptionDisabled: !encription,
      Type: type || "S3",
      Packaging: packaging || "NONE",
    };
    if (location) {
      if (location instanceof Resource) {
        artifact.Location = {
          Ref: location.id,
        };
      } else {
        artifact.Location = location;
      }
    }
    return this.setProperty('Artifacts', Match.objectLike(artifact)) as CodeBuildProject;
  }
}