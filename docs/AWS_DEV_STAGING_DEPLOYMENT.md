# AWS Dev/Staging Deployment

## Scope

This document covers the controlled non-production AWS deployment workflow for FondixPay using the AWS-1 Terraform foundation.

Current deployable Terraform environment: `dev`.

Staging is not implemented yet. The current Terraform variables explicitly restrict `environment` to `dev`, so AWS-2 must not claim staging deployment until a future approved sprint adds `infra/terraform/environments/staging`.

## Prerequisites

- Terraform >= 1.6.
- AWS CLI installed.
- Credentials for a confirmed non-production AWS account.
- An approved AWS region, currently documented as `us-east-1`.
- A budget alert email.
- A globally unique dev artifacts bucket name.
- No production secrets in local files.

Confirm identity before planning:

```powershell
aws sts get-caller-identity --output json
```

Do not continue to `apply` unless the account is confirmed as dev or staging.

## Repository Hygiene

Before every plan/apply:

```powershell
git status
git ls-files | Select-String -SimpleMatch "/.terraform/"
git ls-files | Select-String -Pattern ".tfstate|.tfvars$|/tfplan$"
```

Expected result:

- No `.terraform/` tracked.
- No `terraform.tfstate` tracked.
- No real `terraform.tfvars` tracked.
- No `tfplan` tracked.
- `.terraform.lock.hcl` remains versioned.
- `terraform.tfvars.example` remains versioned.

## Backend Bootstrap

Bootstrap remote state only once per non-production account:

```powershell
cd infra/terraform/backend
terraform init
terraform fmt -recursive
terraform validate
terraform plan -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
terraform apply -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
```

Capture outputs:

- `state_bucket_name`
- `lock_table_name`
- `aws_region`

Do not paste secrets into outputs or documentation.

## Dev Variables

Create a local untracked variable file:

```powershell
cd infra/terraform/environments/dev
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit only local values:

```hcl
artifacts_bucket_name = "fondixpay-dev-artifacts-REPLACE_ME"
budget_alert_emails  = ["finance@example.com"]
enable_compute       = false
```

Keep `enable_compute=false` unless an explicitly approved short-lived EC2 dev host is needed.

## Validation Workflow

```powershell
cd infra/terraform
terraform fmt -recursive

cd environments/dev
terraform init
terraform validate
terraform plan
```

Review the plan for:

- Account and region.
- `Environment = dev` tags.
- No production resource names.
- No destructive changes unless explicitly approved.
- No NAT Gateway, Load Balancer, RDS, ECS, EKS, WAF, or production services.
- S3 public access blocked.
- Security group ingress empty or restricted to approved CIDRs.
- Budget alerts configured.

## Apply Rule

Run apply only after explicit approval:

```powershell
terraform apply
```

After apply, capture sanitized outputs only:

```powershell
terraform output
```

Do not publish secrets, tokens, private URLs, provider credentials, or sensitive account details in docs.

## Rollback / Destroy

No destructive action is allowed without explicit approval.

For approved dev teardown:

```powershell
cd infra/terraform/environments/dev
terraform plan -destroy
terraform destroy
```

After destroy, verify:

- EC2 instances are gone or stopped as expected.
- EBS volumes are not orphaned.
- S3 buckets are intentionally retained or emptied/destroyed according to policy.
- CloudWatch log groups are removed or retained intentionally.
- Budgets are removed if no longer needed.

## Security Notes

- Dev/staging are non-production but security-sensitive.
- Do not store secrets in S3 artifacts.
- Do not store PAN, CVV, card tokens, provider credentials, or raw provider payloads.
- Public subnet compute is dev-only.
- SSH and backend ingress must not use `0.0.0.0/0`.
- Real payments and production provider connectivity remain blocked.

## Cost Notes

Default expected cost is minimal because compute is disabled and expensive managed services are excluded.

Costs may come from:

- S3 storage and requests.
- DynamoDB pay-per-request locking.
- CloudWatch log storage if logs are written.
- AWS Budget.
- EC2 and EBS only when `enable_compute=true`.

Budgets alert; they do not stop spend.

