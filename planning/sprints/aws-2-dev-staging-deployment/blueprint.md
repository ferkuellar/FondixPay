# AWS-2 - Dev/Staging Deployment Blueprint

## Current Terraform Foundation

AWS-2 uses the AWS-1 foundation under `infra/terraform/`.

```txt
infra/terraform/
  backend/              # S3 state bucket and DynamoDB lock table bootstrap
  environments/dev/     # current non-production environment
  modules/
    network/            # VPC, public subnet, IGW, route table
    storage/            # optional encrypted/private S3 artifacts bucket
    compute/            # optional EC2 backend host, disabled by default
    budget/             # AWS Budgets alerts
```

## Backend Strategy

The backend bootstrap creates:

- S3 bucket for Terraform state.
- S3 versioning.
- S3 server-side encryption.
- S3 public access block.
- Lifecycle expiration for old versions.
- DynamoDB lock table with pay-per-request billing, PITR, and encryption.

The dev environment keeps `backend "s3"` commented so local validation can run before bootstrap. After backend bootstrap, operators must pass `-backend-config` values or use an uncommitted backend override.

## Deployment Path

1. Confirm AWS credentials belong to a non-production account.
2. Bootstrap backend state if it does not exist.
3. Configure `terraform.tfvars` locally from `terraform.tfvars.example`.
4. Run `terraform fmt -recursive`.
5. Run `terraform init`.
6. Run `terraform validate`.
7. Run `terraform plan`.
8. Review resources, costs, tags, account, region, and destructive changes.
9. Run `terraform apply` only after explicit human approval.

## Safety Controls

- `environment` is restricted to `dev`.
- `enable_compute = false` by default.
- No NAT Gateway, Load Balancer, RDS, ECS, EKS, WAF, or production resources are defined.
- S3 public access is blocked.
- CloudWatch retention is constrained to 3, 5, or 7 days.
- Budget alert recipients are required.
- All resources use FondixPay ownership and cost-control tags.

## Rollback

For failed or unwanted dev infrastructure, use `terraform destroy` only after explicit human approval. Before destroy, capture outputs, verify target account/region/environment, and confirm no production resources are in the plan.

