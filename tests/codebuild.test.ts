import { App } from "aws-cdk-lib";
import { AdvancedTemplate, CodeBuildProject, IAMRole, S3Bucket } from "../src"
import { TestCodeBuildStack } from "./stacks/codebuild.stack";


describe("CodeBuild", () => {
  let template: AdvancedTemplate;
  let project: CodeBuildProject;
  let bucket: S3Bucket;
  let role: IAMRole;

  beforeEach(() => {
    const app = new App();
    const stack = new TestCodeBuildStack(app, 'TestCodeBuildStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    role = template.iamRole();
    bucket = template.s3Bucket();
    project = template.codeBuildProject();
  });

  test('Project is created', () => {
    project.withConcurrentBuildLimit(1).exists();
  });

  test('Project has proper artifact', () => {
    project.withArtifact("S3", bucket, false, false).exists();
  });

  test('Project has proper environment variables', () => {
    project
      .withEnvironmentVariable('DISTRIBUTION', 'DISTRIBUTION')
      .withEnvironmentVariable('BUCKET', bucket)
      .withEnvironmentVariable('ROLE', role.arn)
      .exists();
  });

  test('Project has proper role', () => {
    project.withServiceRole(role).exists();
  });

  test('Project has proper source', () => {
    project.withBuildSpec('create-invalidation').exists();
  });

  test('Project has proper trigger', () => {
    project.withTriggers([
      { type: 'EVENT', pattern: 'PUSH' },
      { type: 'HEAD_REF' },
    ], true).exists();
  });

  test('Project has proper source', () => {
    project.withSource('GITHUB', 'owner/repo').exists();
  });

  test('GitHub credentials is added', () => {
    template
      .codeBuildSourceCredentials()
      .withGitHubPersonalAccessToken('GH_')
      .exists();
  });

  test('GitHub Enterprise credentials is added', () => {
    template
      .codeBuildSourceCredentials()
      .withGitHubEnterprisePersonalAccessToken('GHE')
      .exists();
  });

  test('BitBucket credentials is added', () => {
    template
      .codeBuildSourceCredentials()
      .withBitBucketUser('BB_USERNAME', 'BB_PASSWORD')
      .exists();
  });
});