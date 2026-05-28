# AWS-1 - Terraform Foundation Requirements

## Goal

Create a minimal, cheap, secure, reversible Terraform foundation for FondixPay dev infrastructure.

## In Scope

- Terraform project structure.
- Remote state S3 bucket.
- DynamoDB state lock table.
- AWS provider config.
- Dev environment only.
- Minimal VPC with one public subnet and no NAT Gateway.
- Optional EC2 dev backend host disabled by default.
- Minimal IAM for optional EC2 CloudWatch logging.
- Optional S3 dev artifacts bucket.
- CloudWatch logs with max 7-day retention.
- AWS Budgets alerts at 20, 30, and 50 USD.
- Documentation for plan, apply, destroy, and cost review.

## Out Of Scope

- Production.
- Staging.
- NAT Gateway.
- Load Balancer.
- ECS/Fargate.
- EKS.
- RDS or RDS Multi-AZ.
- WAF.
- CloudFront for landing.
- Secrets.
- CI/CD.
- Real payments.
- Prontipagos real integration.
- Real card processor.

## Acceptance

- Terraform is modular.
- Dev environment can run `terraform init`, `terraform plan`, and `terraform apply`.
- No expensive managed network/runtime services are defined.
- All resources have cost/ownership tags.
- Docs explain costs and destroy flow.
- Production remains blocked.

