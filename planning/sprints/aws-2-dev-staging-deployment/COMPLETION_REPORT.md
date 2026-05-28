# AWS-2 - Dev/Staging Deployment Completion Report

## Executive Summary

AWS-2 reviewed and validated the AWS-1 Terraform foundation for controlled non-production use. Formatting, initialization, and validation passed. Terraform plan was attempted for the dev environment but is blocked by missing AWS credentials, so no infrastructure was applied or deployed.

This phase did not deploy production and did not enable real payments, Prontipagos, a real card processor, production secrets, Kubernetes, ECS/EKS, or CI/CD.

## Commands Run

From repository root:

```powershell
git status --short
git branch --show-current
git status --porcelain=v1
git ls-files | Select-String -SimpleMatch "/.terraform/"
git ls-files | Select-String -Pattern ".tfstate|.tfvars$|/tfplan$"
```

From Terraform paths:

```powershell
cd infra/terraform
terraform fmt -recursive

cd environments/dev
terraform version
terraform init
terraform validate
terraform plan -var='artifacts_bucket_name=fondixpay-dev-artifacts-REPLACE_ME' -var='budget_alert_emails=["finance@example.com"]'

cd ../../backend
terraform init
terraform validate
```

AWS account check:

```powershell
aws sts get-caller-identity --output json
```

## Results

- Branch: `main`.
- Git status: clean before AWS-2 documentation updates.
- Terraform version: `1.15.1`.
- AWS provider: `hashicorp/aws v5.100.0`.
- `terraform fmt -recursive`: passed.
- `terraform init` for dev: passed.
- `terraform init` for backend: passed.
- `terraform validate` for dev: passed.
- `terraform validate` for backend: passed.
- `aws sts get-caller-identity`: failed with `NoCredentials`.
- `terraform plan`: failed with `No valid credential sources found`.
- `terraform apply`: intentionally skipped.

## Planned Resource Set

Because plan could not complete, no authoritative resource plan was produced. Based on reviewed Terraform code, the intended dev resource set is:

- VPC.
- Public subnet.
- Internet Gateway.
- Public route table and association.
- Optional private S3 artifacts bucket.
- CloudWatch log group.
- AWS Budget with email alerts.
- Optional EC2 backend host, disabled by default.
- Optional EC2 security group, IAM role, instance profile, and encrypted root volume only when compute is enabled.

## Security Review

Positive controls:

- S3 public access block is configured for state and artifacts buckets.
- S3 server-side encryption is configured.
- DynamoDB lock table encryption is configured.
- EC2 IMDSv2 is required when compute is enabled.
- SSH and backend ingress default to empty CIDR lists.
- `environment` is restricted to `dev`.
- No secrets are defined in Terraform.

Open risks:

- AWS account and credentials were not available, so account, actual region, and live IAM permissions could not be confirmed.
- Dev uses a public subnet by design. This is acceptable only for controlled dev/mock validation and should not be reused for production.
- No production secrets manager, RDS, private subnet, WAF, or full observability stack exists.

## Cost Review

Cost controls:

- `enable_compute=false` by default.
- No NAT Gateway.
- No Load Balancer.
- No RDS.
- No ECS/EKS.
- Short CloudWatch retention.
- S3 lifecycle expiration.
- Budget alerts at 20, 30, and 50 USD.

Estimated monthly cost with default compute disabled should be minimal and primarily limited to S3, DynamoDB pay-per-request, CloudWatch log retention if logs are written, and AWS Budget usage. AWS Budgets alert but do not stop spend.

## Rollback / Destroy

No apply was executed, so no AWS rollback is currently required.

When dev infrastructure is applied later:

```powershell
cd infra/terraform/environments/dev
terraform plan -destroy
terraform destroy
```

Only run destroy after explicit human approval and after confirming account, region, environment, and planned destroyed resources.

## Blocker

AWS credentials are missing. Next action is to configure credentials for a confirmed non-production AWS account, verify identity with `aws sts get-caller-identity`, rerun `terraform plan`, review the plan, and request explicit approval before apply.

## Acceptance Status

AWS-2 is complete as a plan-only validation/documentation phase with deployment intentionally skipped. It is not complete as a live AWS deployment because credentials are unavailable and apply was not approved.

## Recommended Next Phase

AWS-2B - Dev Apply With Confirmed AWS Account:

- Configure non-production AWS credentials.
- Confirm AWS account ID and region.
- Bootstrap remote state if needed.
- Run and review `terraform plan`.
- Apply dev only after explicit approval.
- Capture sanitized outputs.
- Re-run repository hygiene checks.
