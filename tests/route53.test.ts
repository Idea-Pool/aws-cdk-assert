import { App } from "aws-cdk-lib";
import { Match } from "aws-cdk-lib/assertions";
import { RecordType } from "aws-cdk-lib/aws-route53";
import { AdvancedTemplate, Route53HostedZone } from "../src";
import { TestRoute53Stack } from "./stacks/route53.stack";


describe("Resource", () => {
  let template: AdvancedTemplate;
  let zone: Route53HostedZone;

  beforeAll(() => {
    const app = new App();
    const stack = new TestRoute53Stack(app, 'TestRoute53Stack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    zone = template.route53HostedZone().withName('example.com');
  });

  test('A record is created for bucket', () => {
    template
      .route53RecordSet()
      .inHostedZone(zone)
      .withName('bucket')
      .withRecordType(RecordType.A)
      .withAliasToS3()
      .exists();
  });

  test('A record is created for cloudfront', () => {
    template
      .route53RecordSet()
      .inHostedZone(zone)
      .withName('distribution')
      .withRecordType(RecordType.A)
      .withAliasToCloudFront(template.cloudFrontDistribution())
      .exists();
  });

  test('Txt record is created', () => {
    template
      .route53RecordSet()
      .inHostedZone(Match.objectEquals({
        Ref: zone.id,
      }))
      .withName('txt')
      .withRecordType(RecordType.TXT)
      .withResourceRecords(['"foo"'])
      .exists();
  });
});