import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { Resource } from "./resource";
import { ResourceTypes } from "./types";

export class S3BucketPolicy extends Resource {
  private s3Bucket: S3Bucket;

  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.S3_BUCKET_POLICY, template, props);
  }

  public forBucket(s3Bucket: S3Bucket): S3BucketPolicy {
    this.s3Bucket = s3Bucket;
    return this.setProperty('Bucket', {
      Ref: this.s3Bucket.id,
    }) as S3BucketPolicy;
  }

  public withPublicAccess(): S3BucketPolicy {
    return this.setProperty('PolicyDocument', {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Resource: AdvancedMatcher.fnJoin(
            Match.arrayWith([
              AdvancedMatcher.arn(this.s3Bucket)
            ])
          )
        })
      ])
    }) as S3BucketPolicy;
  }
}

export class S3Bucket extends Resource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(ResourceTypes.S3_BUCKET, template, props);
  }

  public withBucketName(name: string): S3Bucket {
    return this.setProperty('BucketName', name) as S3Bucket;
  }

  public withWebsiteHosting(options: {
    redirectTo?: string,
    redirectProtocol?: string,
    indexDocument?: string,
    errorDocument?: string,
  } = {}): S3Bucket {
    return this.setProperty(
      'WebsiteConfiguration',
      options.redirectTo
        ? {
          RedirectAllRequestsTo: {
            HostName: options.redirectTo,
            Protocol: options.redirectProtocol || 'https',
          }
        }
        : {
          IndexDocument: options.indexDocument || 'index.html',
        }
    ) as S3Bucket;
  }

  public withCorsEnabled(options: {
    methods?: string[],
    origins?: string[],
  } = {}): S3Bucket {
    return this.setProperty(
      'CorsConfiguration',
      {
        CorsRules: Match.arrayWith([
          Match.objectEquals({
            AllowedMethods: Match.arrayEquals(options.methods || ["GET"]),
            AllowedOrigins: Match.arrayEquals(options.origins || ["*"]),
          })
        ])
      }
    ) as S3Bucket;
  }

  public withDeletePolicy(policy = "Delete") {
    return this.setRootProperty('DeletionPolicy', policy) as S3Bucket;
  }

  // TODO: withAutoDeleteObjects
}