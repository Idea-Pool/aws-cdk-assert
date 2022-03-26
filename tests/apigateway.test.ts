import { App } from "aws-cdk-lib";
import { EndpointType, IntegrationType, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { AdvancedTemplate, ApiGatewayDeployment, ApiGatewayDomain, ApiGatewayResource, ApiGatewayRestApi, ApiGatewayStage, IAMRole } from "../src"
import { TestAPIGatewayStack } from "./stacks/apigateway.stack";


describe("API Gateway", () => {
  let template: AdvancedTemplate;
  let api: ApiGatewayRestApi;
  let deployment: ApiGatewayDeployment;
  let stage: ApiGatewayStage;
  let adminResource: ApiGatewayResource;
  let domain: ApiGatewayDomain;
  let cwRole: IAMRole;

  beforeAll(() => {
    const app = new App();
    const stack = new TestAPIGatewayStack(app, 'TestAPIGatewayStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    template.debug();

    api = template.apiGatewayRestApi();
    deployment = template.apiGatewayDeployment();
    stage = template.apiGatewayStage();
    adminResource = template
      .apiGatewayResource()
      .ofApi(api)
      .ofParent(api)
      .withPath('admin');
    domain = template
      .apiGatewayDomain()
      .withDomainName('example.com');

    cwRole = template.iamRole().withPartialKey('CloudWatch');
  });

  test('Rest API is created', () => {
    api
      .withName('API')
      .exists();
  });

  test('Rest API should have resource ID', () => {
    expect(api.resourceId).toBeDefined();
  })

  test('Account is created', () => {
    template
      .apiGatewayAccount()
      .withCloudWatchRole(cwRole)
      .exists();
  });

  test('Deployment is created', () => {
    deployment
      .ofApi(api)
      .exists();
  });

  test('Stage is created', () => {
    stage
      .ofApi(api)
      .ofDeployment(deployment)
      .withName('stage')
      .withLogGroup(template.logGroup())
      .exists();
  });

  test('Method is created for root of the API', () => {
    template
      .apiGatewayMethod()
      .ofApi(api)
      .ofResource(api)
      .withHttpMethod(HttpMethod.PATCH)
      .withNoAuthorization()
      .withHttpIntegration(HttpMethod.POST, IntegrationType.AWS_PROXY)
      .exists();
  });

  test('Custom simple resource is created on root', () => {
    adminResource.exists();
  });

  test('Custom simple resource is created on other resource', () => {
    template
      .apiGatewayResource()
      .ofApi(api)
      .ofParent(adminResource)
      .withPath('sub')
      .exists();
  });

  test('Proxy resource is created', () => {
    template
      .apiGatewayResource()
      .ofApi(api)
      .ofParent(api)
      .asProxy()
      .exists();
  });

  test('Domain is created', () => {
    domain
      .withSecurityPolicy(SecurityPolicy.TLS_1_0)
      .withEndpointType(EndpointType.EDGE)
      .withCertificate(
        template.cloudFormationCustomResource()
          .withPartialKey('Certificate')
      )
      .exists();
  });

  test('Base path mapping is added', () => {
    template
      .apiGatewayBasePathMapping()
      .ofApi(api)
      .ofDomainName(domain)
      .toStage(stage)
      .exists();
  });
});