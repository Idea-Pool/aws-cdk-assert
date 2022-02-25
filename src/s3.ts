import { Match } from "aws-cdk-lib/assertions";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource, Resource } from "./resource";
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

export class S3Bucket extends RemovableResource {
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
            HostName: Match.stringLikeRegexp(options.redirectTo),
            Protocol: Match.stringLikeRegexp(options.redirectProtocol || 'https'),
          }
        }
        : {
          IndexDocument: Match.stringLikeRegexp(options.indexDocument || 'index.html'),
          ErrorDocument: Match.stringLikeRegexp(options.errorDocument || 'index.html'),
        }
    ) as S3Bucket;
  }

  public withCorsEnabled(options: {
    methods?: string | string[],
    origins?: string | string[],
  } = {}): S3Bucket {
    return this.setProperty(
      'CorsConfiguration',
      {
        CorsRules: Match.arrayWith([
          Match.objectEquals({
            AllowedMethods: Array.isArray(options.methods)
              ? Match.arrayEquals(options.methods)
              : Match.arrayWith([options.methods || "GET"]),
            AllowedOrigins: Array.isArray(options.origins)
              ? Match.arrayEquals(options.origins)
              : Match.arrayWith([options.origins || "*"]),
          })
        ])
      }
    ) as S3Bucket;
  }

  // TODO: withAutoDeleteObjects
}