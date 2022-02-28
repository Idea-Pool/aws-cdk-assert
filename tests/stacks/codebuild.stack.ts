import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { Artifacts, BitBucketSourceCredentials, BuildSpec, EventAction, FilterGroup, GitHubEnterpriseSourceCredentials, GitHubSourceCredentials, LinuxBuildImage, Project, Source } from "aws-cdk-lib/aws-codebuild";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class TestCodeBuildStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // S3 BUCKET

    const bucket = new Bucket(this, id + 'Bucket', {
      bucketName: 'bucket',
    });

    // IAM ROLE

    const role = new Role(this, id + 'Role', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
    });

    // CODE BUILD PROJECT

    new Project(this, id + 'Project', {
      source: Source.gitHub({
        owner: 'owner',
        repo: 'repo',
        webhook: true,
        webhookTriggersBatchBuild: false,
        webhookFilters: [
          FilterGroup
            .inEventOf(EventAction.PUSH)
            .andBranchIs('main'),
        ],
      }),
      role,
      environment: {
        buildImage: LinuxBuildImage.fromCodeBuildImageId(
          'aws/codebuild/standard:5.0'
        ),
      },
      environmentVariables: {
        DISTRIBUTION_ID: {
          value: 'DISTRIBUTION',
        },
        BUCKET: {
          value: bucket.bucketArn,
        },
        ROLE: {
          value: role.roleArn,
        }
      },
      buildSpec: BuildSpec.fromObjectToYaml({
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 14,
            },
            commands: [
              'echo "Installing dependencies"',
              'node -v',
              'npm -v',
              'npm i'
            ],
          },
          build: {
            commands: [
              'echo "Starting VersHivo build!"',
              'node -v',
              'npm -v',
              'npm run build-site',
            ],
          },
          post_build: {
            commands: [
              'echo "Starting post build!"',
              'aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*"'
            ]
          },
        },
        artifacts: {
          'base-directory': './site/dist',
          files: '**/*',
        },
      }),
      artifacts: Artifacts.s3({
        bucket,
        includeBuildId: false,
        packageZip: false,
        name: '/',
        encryption: false,
      }),
      concurrentBuildLimit: 1,
    });

    // CREDENTIALS

    new GitHubSourceCredentials(this, id + 'CodeBuildGitHubCreds', {
      accessToken: SecretValue.secretsManager('GH_'),
    });

    new GitHubEnterpriseSourceCredentials(this, id + 'CodeBuildGitHubEnterpriseCreds', {
      accessToken: SecretValue.secretsManager('GHE'),
    });

    new BitBucketSourceCredentials(this, id + 'CodeBuildBitbucketCreds', {
      username: SecretValue.secretsManager('BB_USERNAME'),
      password: SecretValue.secretsManager('BB_PASSWORD'),
    });
  }
}
