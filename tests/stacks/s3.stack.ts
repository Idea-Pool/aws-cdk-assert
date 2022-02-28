import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class TestS3Stack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // PRIVATE S3 BUCKET

    new s3.Bucket(this, id + 'PrivateBucket', {
      bucketName: 'private-bucket',
    });

    // BUCKETS WITH CERTAIN REMOVAL POLICY

    new s3.Bucket(this, id + 'DestroyRemovalPolicy', {
      bucketName: 'destroy-removal-policy',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new s3.Bucket(this, id + 'RetainRemovalPolicy', {
      bucketName: 'retain-removal-policy',
      removalPolicy: RemovalPolicy.RETAIN,
    });
    new s3.Bucket(this, id + 'SnapshotRemovalPolicy', {
      bucketName: 'snapshot-removal-policy',
      removalPolicy: RemovalPolicy.SNAPSHOT,
    });

    // BUCKET WITH DIFFERENT CORS SETTINGS

    new s3.Bucket(this, id + 'CorsEnabledWithDefaults', {
      bucketName: 'cors-enabled-defaults',
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ["*"],
        }
      ]
    });
    new s3.Bucket(this, id + 'CorsEnabledWithCustoms', {
      bucketName: 'cors-enabled-customs',
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ["*.example.com"],
        }
      ]
    });

    // BUCKET WITH WEBSITE HOSTING

    new s3.Bucket(this, id + 'WebSiteHostingSource', {
      bucketName: 'website-hosting-source',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });
    new s3.Bucket(this, id + 'WebSiteHostingSourceCustom', {
      bucketName: 'website-hosting-source-custom',
      websiteIndexDocument: 'index.dhtml',
      websiteErrorDocument: 'error.dhtml',
      publicReadAccess: true,
    });
    new s3.Bucket(this, id + 'WebSiteHostingRedirect', {
      bucketName: 'website-hosting-redirect',
      websiteRedirect: {
        hostName: 'domain',
        protocol: s3.RedirectProtocol.HTTPS,
      },
      publicReadAccess: true,
    });
    new s3.Bucket(this, id + 'WebSiteHostingRedirectCustom', {
      bucketName: 'website-hosting-redirect-custom',
      websiteRedirect: {
        hostName: 'domain',
        protocol: s3.RedirectProtocol.HTTP,
      },
      publicReadAccess: true,
    });
  }
}