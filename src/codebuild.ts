import { Match } from "aws-cdk-lib/assertions";
import { BuildEnvironmentVariableType, CfnProject, CfnSourceCredential } from "aws-cdk-lib/aws-codebuild";
import { AdvancedTemplate } from "./advanced-template";
import { Resource, RemovableResource } from "./resource";

export interface CodeBuildProjectTriggerEvent {
  readonly eventType: string;
  readonly pattern?: string;
}

export enum CredentialAuthType {
  OAUTH = 'OAUTH',
  BASIC_AUTH = 'BASIC_AUTH',
  PERSONAL_ACCESS_TOKEN = 'PERSONAL_ACCESS_TOKEN'
}

export enum CrednetialServerType {
  GITHUB = 'GITHUB',
  GITHUB_ENTERPRISE = 'GITHUB_ENTERPRISE',
  BITBUCKET = 'BITBUCKET',
}

/**
 * A test construct for CloudBuild Source Credentials resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild.CfnSourceCredential.html}
 */
export class CodeBuildSourceCredentials extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnSourceCredential.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets matching credential properties for the source credentials
   * @param authType The authentication type (exact match)
   * @param serverType The server type (exact match)
   * @param token The token (partial match)
   * @param username The username of the token (partial match)
   * @returns 
   */
  public withCredentials(authType: CredentialAuthType, serverType: CrednetialServerType, token: string, username?: string) {
    this.withProperty('AuthType', authType);
    this.withProperty('ServerType', serverType);
    this.withProperty('Token', Match.stringLikeRegexp(token));
    if (username) {
      this.withProperty('Username', Match.stringLikeRegexp(username));
    }
    return this;
  }

  /**
   * Sets matching credentials for GitHub
   * @param token The GitHub access token
   * @returns 
   */
  public withGitHubPersonalAccessToken(token: string) {
    return this.withCredentials(CredentialAuthType.PERSONAL_ACCESS_TOKEN, CrednetialServerType.GITHUB, token);
  }

  /**
   * Sets matching credentials for GitHub Enterprise
   * @param token The GitHub access token
   * @returns 
   */
  public withGitHubEnterprisePersonalAccessToken(token: string) {
    return this.withCredentials(CredentialAuthType.PERSONAL_ACCESS_TOKEN, CrednetialServerType.GITHUB_ENTERPRISE, token);
  }

  /**
   * Sets matching credentials for BitBucket
   * @param username The username
   * @param password The password
   * @returns 
   */
  public withBitBucketUser(username: string, password: string) {
    return this.withCredentials(CredentialAuthType.BASIC_AUTH, CrednetialServerType.BITBUCKET, password, username);
  }
}

/**
 * A test construct for a CodeBuild Project resource
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild.CfnProject.html}
 */
export class CodeBuildProject extends RemovableResource {
  private environmentVariables: any[];
  private source: any;

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnProject.CFN_RESOURCE_TYPE_NAME, template, props);
    this.environmentVariables = [];
    this.source = {};
  }

  /**
   * Sets a matching Service Role to another test construct resource
   * @param resource The test construct resource to set
   * @returns 
   */
  public withServiceRole(resource: Resource) {
    this.withProperty('ServiceRole', resource.arn);
    return this;
  }

  /**
   * Sets a matching source for the project
   * @param sourceType The source type to match (exact match)
   * @param location The whole or a partial location
   * @returns 
   */
  public withSource(sourceType: string, location: string) {
    this.source = this.source || {};
    this.source.Location = Match.stringLikeRegexp(location);
    this.source.Type = sourceType;

    this.withProperty('Source', Match.objectLike(this.source));
    return this;
  }

  /**
   * Sets a matching environment variable for the project
   * @param name The whole of a partial name of the environment variable
   * @param value The value of the environment variable (resource, string, or a matcher)
   * @param envVariableType The type of the environment variable
   * @returns 
   */
  public withEnvironmentVariable(name: string, value?: any, envVariableType?: BuildEnvironmentVariableType) {
    const environmentVariable: any = {
      Name: Match.stringLikeRegexp(name),
      Type: envVariableType || BuildEnvironmentVariableType.PLAINTEXT,
    };
    if (value) {
      if (value instanceof Resource) {
        environmentVariable.Value = value.arn;
      } else if (typeof value === "string") {
        environmentVariable.Value = Match.stringLikeRegexp(value);
      } else {
        environmentVariable.Value = value;
      }
    }
    this.environmentVariables.push(Match.objectLike(environmentVariable));
    this.withProperty('Environment', Match.objectLike({
      EnvironmentVariables: Match.arrayWith(this.environmentVariables),
    }));
    return this;
  }

  /**
   * Sets a matching concurrent build limit
   * @param limit The exact limit to match
   * @returns 
   */
  public withConcurrentBuildLimit(limit: number) {
    this.withProperty('ConcurrentBuildLimit', limit);
    return this;
  }

  /**
   * Sets a matching trigger for the project
   * @param events The trigger events to match with
   * @param webhook Whether a webhook is used for the trigger
   * @returns 
   */
  public withTriggers(events: CodeBuildProjectTriggerEvent[], webhook = true) {
    const eventMatchers = events.map(e => {
      const filter: any = { Type: e.eventType };
      if (e.pattern) {
        filter.Pattern = Match.stringLikeRegexp(e.pattern);
      }
      return Match.objectLike(filter);
    });
    this.withProperty('Triggers', Match.objectLike({
      Webhook: !!webhook,
      FilterGroups: Match.arrayWith([
        Match.arrayWith(eventMatchers)
      ])
    }));
    return this;
  }

  /**
   * Sets a matching artifact for the project
   * @param artifactType The type of the artifact (e.g., S3)
   * @param location The location of the artifact (resource, string, or a matcher)
   * @param encryption Whether encryption is enabled for the artifact
   * @param packaging Whether packaging is enabled for the artifact
   * @returns 
   */
  public withArtifact(artifactType: string, location?: any, encryption?: boolean, packaging?: boolean) {
    const artifact: any = {
      EncryptionDisabled: !encryption,
      Type: artifactType || "S3",
      Packaging: packaging || "NONE",
    };
    if (location) {
      if (location instanceof Resource) {
        artifact.Location = location.reference;
      } else if (typeof location === "string") {
        artifact.Location = Match.stringLikeRegexp(location);
      } else {
        artifact.Location = location;
      }
    }
    this.withProperty('Artifacts', Match.objectLike(artifact));
    return this;
  }

  /**
   * Sets a matching build spec for the project
   * @param command A partial build spec command
   * @returns 
   */
  public withBuildSpec(command: string) {
    this.source = this.source || {};
    this.source.BuildSpec = Match.stringLikeRegexp(command);

    this.withProperty('Source', Match.objectLike(this.source));
    return this;
  }
}