import { App, RemovalPolicy } from "aws-cdk-lib";
import { AdvancedTemplate, S3Bucket } from "../src"
import { TestS3Stack } from "./stacks/s3.stack";


describe("S3", () => {
  let template: AdvancedTemplate;
  let nonExistingBucket: S3Bucket;
  let privateBucket: S3Bucket;
  let webSiteHostingSourceBucket: S3Bucket;
  let webSiteHostingSourceCustomBucket: S3Bucket;
  let webSiteHostingRedirectBucket: S3Bucket;
  let webSiteHostingRedirectCustomBucket: S3Bucket;

  beforeAll(() => {
    const app = new App();
    const stack = new TestS3Stack(app, 'TestS3Stack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    nonExistingBucket = template.s3Bucket()
      .withBucketName('non-existing-bucket');
    privateBucket = template.s3Bucket()
      .withBucketName('private-bucket');
    webSiteHostingSourceBucket = template.s3Bucket()
      .withBucketName('website-hosting-source');
    webSiteHostingSourceCustomBucket = template.s3Bucket()
      .withBucketName('website-hosting-source-custom');
    webSiteHostingRedirectBucket = template.s3Bucket()
      .withBucketName('website-hosting-redirect');
    webSiteHostingRedirectCustomBucket = template.s3Bucket()
      .withBucketName('website-hosting-redirect-custom');

  });

  test('Non-existing bucket is not created', () => {
    nonExistingBucket.doesNotExist();
  });

  test("Private S3 Bucket is created", () => {
    privateBucket.exists();
  });

  test('Bucket with Certain RemovalPolicy is created', () => {
    template.s3Bucket()
      .withBucketName('destroy-removal-policy')
      .withRemovalPolicy(RemovalPolicy.DESTROY)
      .exists();

    template.s3Bucket()
      .withBucketName('retain-removal-policy')
      .withRemovalPolicy(RemovalPolicy.RETAIN)
      .exists();

    template.s3Bucket()
      .withBucketName('snapshot-removal-policy')
      .withRemovalPolicy(RemovalPolicy.SNAPSHOT)
      .exists();
  });

  test('Bucket with CorsEnabled is created', () => {
    template.s3Bucket()
      .withBucketName('cors-enabled-defaults')
      .withCorsEnabled()
      .exists();

    template.s3Bucket()
      .withBucketName('cors-enabled-customs')
      .withCorsEnabled({
        methods: 'HEAD',
        origins: '*.example.com',
      })
      .exists();

    template.s3Bucket()
      .withBucketName('cors-enabled-customs')
      .withCorsEnabled({
        methods: ['GET', 'HEAD'],
        origins: ['*.example.com'],
      })
      .exists();
  });

  test('Bucket with WebSite hosting is created', () => {
    webSiteHostingSourceBucket
      .withWebsiteHosting()
      .exists();

    webSiteHostingSourceCustomBucket
      .withWebsiteHosting({
        indexDocument: 'index.dhtml',
        errorDocument: 'error.dhtml'
      })
      .exists();

    webSiteHostingRedirectBucket
      .withWebsiteHosting({
        redirectTo: 'domain',
      })
      .exists();

    webSiteHostingRedirectCustomBucket
      .withWebsiteHosting({
        redirectTo: 'domain',
        redirectProtocol: 'http',
      })
      .exists();
  });

  test('BucketPolicy is not created for non-website hosting buckets', () => {
    template.s3BucketPolicy()
      .forBucket(privateBucket)
      .doesNotExist();
  });

  test('BucketPolicy is created for website hosting buckets', () => {
    template.s3BucketPolicy()
      .forBucket(webSiteHostingSourceBucket)
      .withPublicAccess()
      .exists();

    template.s3BucketPolicy()
      .forBucket(webSiteHostingSourceCustomBucket)
      .withPublicAccess()
      .exists();

    template.s3BucketPolicy()
      .forBucket(webSiteHostingRedirectBucket)
      .withPublicAccess()
      .exists();

    template.s3BucketPolicy()
      .forBucket(webSiteHostingRedirectCustomBucket)
      .withPublicAccess()
      .exists();
  });
});