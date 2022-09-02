import { App } from "aws-cdk-lib";
import { EndpointType, IntegrationType, SecurityPolicy } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { AdvancedTemplate, ApiGatewayApiKey, ApiGatewayDeployment, ApiGatewayDomain, ApiGatewayResource, ApiGatewayRestApi, ApiGatewayStage, ApiGatewayUsagePlan, IAMRole } from "../src"
import { TestAPIGatewayStack } from "./stacks/apigateway.stack";


describe("API Gateway", () => {
  let template: AdvancedTemplate;
  let api: ApiGatewayRestApi;
  let deployment: ApiGatewayDeployment;
  let stage: ApiGatewayStage;
  let adminResource: ApiGatewayResource;
  let domain: ApiGatewayDomain;
  let usagePlan: ApiGatewayUsagePlan;
  let apiKey: ApiGatewayApiKey;
  let cwRole: IAMRole;

  beforeAll(() => {
    const app = new App();
    const stack = new TestAPIGatewayStack(app, 'TestAPIGatewayStack', {
      env: { account: '12345', region: 'eu-central-1' },
    });
    template = AdvancedTemplate.fromStack(stack);

    // template.debug();

    api = template
      .apiGatewayRestApi()
      .withName('REST');
    deployment = template
      .apiGatewayDeployment()
      .ofApi(api);
    stage = template
      .apiGatewayStage()
      .ofApi(api);
    adminResource = template
      .apiGatewayResource()
      .ofApi(api)
      .ofParent(api)
      .withPath('admin');
    domain = template
      .apiGatewayDomain()
      .withDomainName('example.com');
    usagePlan = template
      .apiGatewayUsagePlan();
    apiKey = template
      .apiGatewayApiKey();

    cwRole = template.iamRole().withPartialKey('RESTCloudWatch');
  });

  test('Rest API is created', () => {
    api.exists();
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
    deployment.exists();
  });

  test('Stage is created', () => {
    stage
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

  test('Method is created for a resource', () => {
    template
      .apiGatewayMethod()
      .ofApi(api)
      .ofResource(adminResource)
      .withHttpMethod(HttpMethod.DELETE)
      .withNoAuthorization()
      .withHttpIntegration(HttpMethod.POST, IntegrationType.AWS_PROXY)
      .exists();
  });

  test('Mock method is created', () => {
    template
      .apiGatewayMethod()
      .ofApi(api)
      .ofResource(api)
      .withMockIntegration()
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

    template
      .apiGatewayDomain()
      .withDomainName('other.com')
      .withSecurityPolicy(SecurityPolicy.TLS_1_2)
      .withEndpointType(EndpointType.REGIONAL)
      .withCertificate(
        template.cloudFormationCustomResource()
          .withPartialKey('Certificate')
        , true
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

  test('API Key is added', () => {
    apiKey
      .forApiAndStage(api, stage)
      .withName('APIKey')
      .withSecretValue(template.secret())
      .exists();
  });

  test('Usage Plan is created', () => {
    usagePlan
      .withApiStage(api, stage)
      .exists();
  });

  test("Usage Plan Key is created", () => {
    template
      .apiGatewayUsagePlanKey()
      .ofUsagePlan(usagePlan)
      .withApiKey(apiKey)
      .exists();
  });
});