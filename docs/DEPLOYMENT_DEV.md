# Dev Deployment

## Scope

This document covers AWS-1 Terraform dev foundation only. It does not deploy the public landing, production backend, real payments, Prontipagos, or a real card processor.

## Prerequisites

- Terraform >= 1.6.
- AWS CLI configured locally.
- AWS credentials for a non-production AWS account.
- An email address for AWS Budget alerts.

## Step 1 - Bootstrap Terraform State

```powershell
cd infra/terraform/backend
terraform init
terraform fmt -recursive
terraform validate
terraform plan -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
terraform apply -var="state_bucket_name=fondixpay-terraform-state-REPLACE_ME"
```

Keep the output values for the dev backend configuration.

## Step 2 - Configure Dev Variables

```powershell
cd ../environments/dev
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit:

```hcl
artifacts_bucket_name = "fondixpay-dev-artifacts-REPLACE_ME"
budget_alert_emails  = ["finance@example.com"]
```

Keep `enable_compute=false` unless a short-lived EC2 dev host is needed.

## Step 3 - Validate Dev

```powershell
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```

## Step 4 - Apply Dev

```powershell
terraform apply
```

## Optional EC2 Dev Host

Only enable EC2 when needed:

```hcl
enable_compute = true
instance_type = "t4g.micro"
cpu_architecture = "arm64"
key_name = "your-existing-keypair"
allowed_ssh_cidrs = ["203.0.113.10/32"]
allowed_backend_cidrs = ["203.0.113.10/32"]
```

Do not use `0.0.0.0/0` for SSH.

## Destroy

```powershell
terraform destroy
```

Also check the AWS console for:

- Stopped/running EC2 instances.
- EBS volumes.
- S3 buckets.
- CloudWatch log groups.
- Budgets.

## Cost Checklist

- `enable_compute=false` unless actively testing.
- No NAT Gateway in plan.
- No Load Balancer in plan.
- No RDS in plan.
- CloudWatch retention <= 7 days.
- S3 buckets have lifecycle expiration.
- Budget alert emails are valid.
- All resources have required tags.

## Landing

The public landing remains in Vercel. AWS-1 does not move, proxy, serve, or deploy the landing.

## Production Warning

This dev foundation is not production-ready. It is for controlled mock/dev validation only.

