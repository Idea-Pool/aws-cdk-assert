import { Match } from "aws-cdk-lib/assertions";
import { CfnBucket, CfnBucketPolicy } from "aws-cdk-lib/aws-s3";
import { AdvancedMatcher } from "./advanced-matcher";
import { AdvancedTemplate } from "./advanced-template";
import { RemovableResource } from "./resource";

/**
 * A test construct for an S3 BucketPolicy
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.CfnBucketPolicy.html}
 */
export class S3BucketPolicy extends RemovableResource {
  private s3Bucket: S3Bucket;

  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching S3 Bucket the BucketPolicy is connected
   * @param s3Bucket The S3 Bucket test construct
   * @returns 
   */
  public forBucket(s3Bucket: S3Bucket) {
    this.s3Bucket = s3Bucket;
    this.withProperty('Bucket', {
      Ref: this.s3Bucket.id,
    });
    return this;
  }

  /**
   * Sets to match an S3 BucketPolicy with Public Access.
   * @returns 
   */
  public withPublicAccess() {
    this.withProperty('PolicyDocument', {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Resource: AdvancedMatcher.fnJoin(
            Match.arrayWith([
              this.s3Bucket.arn,
            ])
          )
        })
      ])
    });
    return this;
  }
}

/**
 * A test construct for an S3 Bucket
 * @see {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.CfnBucket.html}
 */
export class S3Bucket extends RemovableResource {
  constructor(template: AdvancedTemplate, props?: any) {
    super(CfnBucket.CFN_RESOURCE_TYPE_NAME, template, props);
  }

  /**
   * Sets a matching bucket name
   * @param name Either the whole of a partial bucket name
   * @returns 
   */
  public withBucketName(name: string) {
    this.withProperty('BucketName', Match.stringLikeRegexp(name));
    return this;
  }

  /**
   * Sets a matching website hosting configuration
   * @param options The website hosting options
   * @returns 
   */
  public withWebsiteHosting(options: {
    redirectTo?: string,
    redirectProtocol?: string,
    indexDocument?: string,
    errorDocument?: string,
  } = {}) {
    this.withProperty(
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
    );
    return this;
  }

  /**
   * Sets a matching CORS configuration
   * @param options The CORS options
   * @returns 
   */
  public withCorsEnabled(options: {
    methods?: string | string[],
    origins?: string | string[],
  } = {}) {
    this.withProperty(
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
    );
    return this;
  }

  // TODO: withAutoDeleteObjects
}