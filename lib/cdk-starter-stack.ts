import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create ACM Permission Policy
    const describeAcmCertificates = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['arn:aws:acm:*:*:certificate/*'],
          actions: ['acm:DescribeCertificate'],
        }),
      ],
    });

    // 👇 Create role
    const role = new iam.Role(this, 'example-iam-role', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      description: 'An example IAM role in AWS CDK',
      // 👇 created with the role, whereas `addToPolicy` ones are added via a separate CloudFormation reosurce ( allows us to avoid circular dependencies )
      inlinePolicies: {
        DescribeACMCerts: describeAcmCertificates,
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonAPIGatewayInvokeFullAccess',
        ),
      ],
    });

    // 👇 attach an Inline Policy to role
    role.attachInlinePolicy(
      new iam.Policy(this, 'cw-logs', {
        statements: [
          new iam.PolicyStatement({
            actions: ['logs:PutLogEvents'],
            notResources: [
              'arn:aws:logs:ap-northeast-1:587273731068:log-group:/important-log-group:*'
            ],
          }),
        ],
      }),
    );

    // 👇 Add the Lambda service as a Principal
    role.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      }),
    );
  }
}
