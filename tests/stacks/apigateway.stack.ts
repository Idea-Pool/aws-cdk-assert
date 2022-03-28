import { Stack, StackProps } from "aws-cdk-lib";
import { EndpointType, LambdaIntegration, LogGroupLogDestination, RestApi, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Secret, SecretStringValueBeta1 } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export class TestAPIGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // ZONE

    const zone = new HostedZone(this, id + 'Zone', {
      zoneName: 'example.com',
    });

    // CERTIFICATION

    const cert = new DnsValidatedCertificate(this, id + 'Cert', {
      domainName: 'example.com',
      hostedZone: zone,
    });

    // LOG GROUP

    const logs = new LogGroup(this, id + 'LogGroup');

    // API

    const api = new RestApi(this, id + 'REST', {
      deployOptions: {
        stageName: 'stage',
        accessLogDestination: new LogGroupLogDestination(logs),
      },
      domainName: {
        certificate: cert,
        domainName: 'example.com',
        endpointType: EndpointType.EDGE,
        securityPolicy: SecurityPolicy.TLS_1_0,
      }
    });

    const otherApi = new RestApi(this, id + 'Other', {
      deployOptions: {
        stageName: 'stage',
      },
      domainName: {
        certificate: cert,
        domainName: 'other.com',
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      }
    });
    otherApi.root.addMethod('GET');

    // SECRET

    const secret = new Secret(this, id + 'SecretKey', {
      secretName: 'api-key',
      secretStringBeta1: SecretStringValueBeta1.fromUnsafePlaintext('TOP SECRET'),
    });

    // API KEY

    const key = api.addApiKey(id + 'APIKey', {
      apiKeyName: 'APIKey',
      value: secret.secretValue.toString(),
    });

    // USAGE PLAN

    api.addUsagePlan(id + 'UsagePlan', {
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        }
      ],
      // @ts-ignore
      apiKey: key,
    });

    // LAMBDA

    const proxyLambda = new Function(this, id + 'ProxyLambda', {
      code: Code.fromInline('function () {}'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS,
    });
    const adminLambda = new Function(this, id + 'AdminLambda', {
      code: Code.fromInline('function () {}'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS,
    });

    // METHODS

    const adminLambdaIntegration = new LambdaIntegration(adminLambda);

    api.root.addMethod('PATCH', adminLambdaIntegration);

    const rootProxy = api.root.addProxy({
      anyMethod: false,
      defaultIntegration: new LambdaIntegration(proxyLambda, { proxy: true }),
    });
    rootProxy.addMethod('GET');

    const adminRoute = api.root.addResource('admin');
    adminRoute.addMethod('POST', adminLambdaIntegration);
    adminRoute.addMethod('DELETE', adminLambdaIntegration);

    const subAdminRoute = adminRoute.addResource('sub');
    subAdminRoute.addMethod('GET', adminLambdaIntegration)
  }
}