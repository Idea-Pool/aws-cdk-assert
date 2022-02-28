import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Distribution, Function, FunctionCode, FunctionEventType, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

export class TestCloudFrontStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // BUCKET

    const bucket = new Bucket(this, id + 'Bucket', {
      bucketName: 'bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [HttpMethods.GET],
        },
      ],
    })

    // CERTIFICATE

    const cert = new DnsValidatedCertificate(this, id + 'Cert', {
      domainName: 'example.com',
      hostedZone: new HostedZone(this, id + 'Zone', {
        zoneName: 'example.com',
      }),
      subjectAlternativeNames: ['www.example.com', 'example.com'],
    });

    // FUNCTION

    const fn = new Function(this, id + 'Function', {
      code: FunctionCode.fromInline('function handler() {}')
    });

    // ACL

    const acl = new CfnWebACL(this, id + 'WebACL', {
      defaultAction: { allow: {} },
      scope: "CLOUDFRONT",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'example.com',
        sampledRequestsEnabled: true,
      },
      name: 'example.com',
      rules: [
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 100,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendorName: 'AWS',
              excludedRules: [],
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesCommonRuleSet',
          },
        },
        {
          name: 'RateLimit100',
          priority: 1,
          action: {
            block: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimit100'
          },
          statement: {
            rateBasedStatement: {
              limit: 100,
              aggregateKeyType: 'IP',
            },
          },
        }
      ],
    })

    // DISTRIBUTION

    new Distribution(this, id + 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: fn,
            eventType: FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      domainNames: ['example.com', 'www.example.com'],
      certificate: cert,
      webAclId: acl.attrId,
    });
  }
}
