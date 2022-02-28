import { Stack, StackProps } from "aws-cdk-lib";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import { ARecord, HostedZone, RecordTarget, TxtRecord } from "aws-cdk-lib/aws-route53";
import { BucketWebsiteTarget, CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class TestRoute53Stack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // S3 BUCKET

    const bucket = new Bucket(this, id + 'Bucket', {
      bucketName: 'bucket',
    });

    // CLOUDFRONT DISTRIBUTION

    const distribution = new CloudFrontWebDistribution(this, id + 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        }
      ],
    });

    // ZONE

    const zone = new HostedZone(this, id + 'Zone', {
      zoneName: 'example.com',
    });

    // RECORDS

    new ARecord(this, id + 'ARecordBucket', {
      zone,
      recordName: 'bucket',
      target: RecordTarget.fromAlias(new BucketWebsiteTarget(bucket)),
    });

    new ARecord(this, id + 'ARecordDistribuion', {
      zone,
      recordName: 'distribution',
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    new TxtRecord(this, id + 'TxtRecord', {
      zone,
      recordName: 'txt',
      values: ['foo', 'bar'],
    });
  }
}
