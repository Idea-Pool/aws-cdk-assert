import { App } from "aws-cdk-lib";
import { HttpVersion, OriginProtocolPolicy, OriginSslPolicy } from "aws-cdk-lib/aws-cloudfront";
import { AdvancedTemplate, CloudFrontDistribution, WebACLScope } from "../src"
import { TestCloudFrontStack } from "./stacks/cloudfront.stack";


describe("CloudFront", () => {
  let template: AdvancedTemplate;
  let distribution: CloudFrontDistribution;

  beforeEach(() => {
    const app = new App();
    const stack = new TestCloudFrontStack(app, 'TestCloudFrontStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    template.debug();

    distribution = template.cloudFrontDistribution();
  });

  test('Distribution is created', () => {
    distribution.exists();
  });

  test('Certificate should be assigned', () => {
    const lambda = template.lambdaFunction();
    const cert = template
      .cloudFormationCustomResource()
      .withServiceToken(lambda);

    distribution
      .withCertificate(cert)
      .exists();
  });

  test('Alisases are set', () => {
    distribution
      .withAliases(['www.example.com'])
      .exists();
  });

  test('S3 Bucket origin is set', () => {
    distribution
      .withPublicS3BucketOrigin(template.s3Bucket())
      .exists();
  });

  test('CloudFront function is created and associated', () => {
    const fn = template
      .cloudFrontFunction()
      .withCode('handler');

    fn.exists();

    distribution.withFunctionAssociation(fn).exists();
  });

  test('CloudFront with Origin config', () => {
    distribution
      .withOrigin()
      .exists();
  });

  test('CloudFront with specific Origin config', () => {
    distribution
      .withOrigin({
        protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        sslProtocol: OriginSslPolicy.TLS_V1_2,
        domain: template.s3Bucket().websiteUrl,
        id: 'DistributionOrigin',
      })
      .exists();
  });

  test('HTTP version is set', () => {
    distribution
      .withHttpVersion(HttpVersion.HTTP2)
      .exists();
  })

  test('WebACL is associated', () => {
    const acl = template
      .wafV2WebACL()
      .inScope(WebACLScope.CLOUDFRONT);

    acl.exists();

    distribution.withWebACL(acl).exists();
  });
});