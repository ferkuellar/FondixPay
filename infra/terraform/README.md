# FondixPay Terraform Foundation

AWS-1 defines a minimal, low-cost Terraform foundation for controlled dev validation.

It does not deploy production, real payments, Prontipagos, a real card processor, the public landing page, or a complete backend platform.

## Layout

```txt
infra/terraform/
  backend/              # S3 + DynamoDB remote state bootstrap
  environments/dev/     # only active environment in AWS-1
  modules/
    network/            # one VPC, one public subnet, one IGW, no NAT
    compute/            # optional EC2 dev host, disabled by default
    storage/            # optional dev artifacts bucket
    budget/             # AWS Budgets alerts
```

## Cost Guardrails

- No NAT Gateway.
- No Load Balancer.
- No ECS/Fargate.
- No EKS.
- No RDS.
- No WAF.
- No CloudFront for landing.
- EC2 is optional and disabled by default.
- CloudWatch retention is 3, 5, or 7 days only.
- Budget alerts are configured at 20, 30, and 50 USD.

## Required Tags

All resources are tagged with:

- `Project = FondixPay`
- `Environment = dev`
- `Owner = NorthboundFinOps`
- `ManagedBy = Terraform`
- `CostControl = strict`

## Bootstrap Remote State

Remote state must be created once before switching the dev environment to S3 state.

```powershell
cd infra/terraform/backend
terraform init
terraform plan -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
terraform apply -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
```

Outputs:

- `state_bucket_name`
- `lock_table_name`
- `aws_region`

## Dev Environment

Copy the example variables file:

```powershell
cd infra/terraform/environments/dev
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit:

- `artifacts_bucket_name`
- `budget_alert_emails`
- optional EC2 fields if a short-lived dev host is needed

Run:

```powershell
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Destroy:

```powershell
terraform destroy
```

## Remote State For Dev

AWS-1 keeps the S3 backend block commented so local validation works before bootstrap.

After creating the backend resources, use either:

```powershell
terraform init `
  -backend-config="bucket=fondixpay-terraform-state-REPLACE_ME" `
  -backend-config="key=dev/terraform.tfstate" `
  -backend-config="region=us-east-1" `
  -backend-config="dynamodb_table=fondixpay-terraform-locks" `
  -backend-config="encrypt=true"
```

or create a local uncommitted backend override according to your AWS account policy.

## What Costs Money

Low or optional:

- S3 state bucket and artifact bucket storage.
- DynamoDB lock table, pay-per-request.
- CloudWatch log group ingestion/storage if EC2 is enabled.
- AWS Budgets alerts.
- EC2 t4g.micro/t3.micro and EBS only if `enable_compute=true`.

Avoided:

- NAT Gateway.
- Load Balancer.
- RDS.
- ECS/Fargate.
- WAF.

## Production Status

This is not production infrastructure. Real payments, Prontipagos, card processing, production secrets, and commercial launch remain blocked.

## AWS-2 Validation Status

AWS-2 validated the current dev Terraform foundation as a plan-only workflow.

Validated:

- `terraform fmt -recursive`
- `terraform init` in `environments/dev`
- `terraform init` in `backend`
- `terraform validate` in `environments/dev`
- `terraform validate` in `backend`

Blocked:

- `terraform plan` requires AWS credentials for a confirmed non-production account.
- `terraform apply` must not run until plan is reviewed and explicitly approved.

Current environment support:

- `dev` is implemented.
- `staging` is not implemented yet. The dev variables currently validate `environment = "dev"` only.

## AWS-3 CI/CD Usage

GitHub Actions now provides Terraform validation and controlled dev deployment workflows.

Workflows:

- `.github/workflows/terraform-dev.yml`: runs `terraform fmt -recursive -check`, init, and validate for backend and dev. Manual dispatch can run a dev plan when secrets are configured.
- `.github/workflows/deploy-dev.yml`: manual dev apply only. Requires GitHub Environment `dev`, OIDC, remote state secrets, `confirm_environment=dev`, and `apply=true`.

Required GitHub values:

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `TF_STATE_BUCKET`
- `TF_LOCK_TABLE`
- `TF_VAR_ARTIFACTS_BUCKET_NAME`
- `TF_VAR_BUDGET_ALERT_EMAILS`

The workflows generate an uncommitted `backend_override.tf` in the GitHub runner for remote S3 state. Do not commit backend override files, local `terraform.tfvars`, state files, plans, or downloaded providers.

CI/CD does not enable staging or production. Staging requires a future `infra/terraform/environments/staging` design.
