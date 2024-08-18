# IAM Access Analyzer CI/CD test

Check if your CDK code violates [reference-files/reference.json](reference-files/reference.json).
GitHub Actions runs on following situations:
1. Push to branch `cdk-v2`
2. Pull request which is `opened` or `review_requested`

Using [awslabs/aws-cloudformation-iam-policy-validator](https://github.com/awslabs/aws-cloudformation-iam-policy-validator?tab=readme-ov-file) .
1. Synth your CDK codes
2. run [aws-cloudformation-iam-policy-validator](https://github.com/awslabs/aws-cloudformation-iam-policy-validator?tab=readme-ov-file) for all `.template.json` files in your `cdk.out`
## How to Use
1. Make your GitHub repository
2. Settings on IAM Management Console
   - Make IAM identity provider. (Provider type: `OpenID Connect`, Provider URL: `https://token.actions.githubusercontent.com`, Audience: `sts.amazonaws.com`) 
   - Make IAM role for GitHub. (Entity: `Web-Identity`, Identity provider: `token.actions.githubusercontent.com`, Audience: `sts.amazonaws.com`, GitHub Organizations: `<your-user-name>` )
3. Settings on GitHub repository settings
   - In `Settings > Security > Secrets and variables > Actions > Repository secrets`, `OIDC_IAM_ROLE`: `<role arn you made in step 3>`
4. introduce [reference-files/reference.json](reference-files/reference.json) into your repository and edit this file to fit your policies.
5. introduce [.github/workflows/main.yml](.github/workflows/main.yml) into your repository.
6. Enjoy making your CDK codes!
7. try push to branch `cdk-v2`
8. in GitHub actions, you can see whether your CDK codes pass the test.
