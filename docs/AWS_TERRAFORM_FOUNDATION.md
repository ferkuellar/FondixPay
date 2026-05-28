# AWS Terraform Foundation

## Purpose

AWS-1 creates a minimal Terraform foundation for FondixPay dev infrastructure. It is designed to be cheap, reversible, and safe for controlled mock/dev validation.

## Current Boundary

- Mobile app remains Expo/React Native.
- Backend remains FastAPI mock/dev.
- Landing remains on Vercel.
- No real payments.
- No real Prontipagos.
- No real card processor.
- No production release.

## Infrastructure Defined

### Remote State Bootstrap

`infra/terraform/backend` creates:

- S3 bucket for Terraform state.
- S3 versioning.
- S3 server-side encryption.
- S3 public access block.
- Lifecycle expiration for old state versions.
- DynamoDB table for Terraform locking with pay-per-request billing and encryption.

### Dev Environment

`infra/terraform/environments/dev` creates:

- One VPC.
- One public subnet.
- Internet Gateway.
- Route table for public egress.
- Optional S3 dev artifacts bucket.
- CloudWatch log group with 3-7 day retention.
- Optional EC2 backend dev host, disabled by default.
- AWS monthly budget with alerts at 20, 30, and 50 USD.

## Network Decision

AWS-1 uses a small dedicated VPC instead of the default VPC. This keeps future dev/staging/prod evolution clean without adding NAT Gateway or Load Balancer cost.

Current network:

- Public subnet only.
- No private subnet.
- No NAT Gateway.
- No Load Balancer.

This is acceptable only for dev/mock validation. Production would require a separate design.

## Compute Decision

EC2 is optional and disabled by default:

```hcl
enable_compute = false
```

If enabled, the module creates a single encrypted-root-volume Amazon Linux 2023 instance using `t4g.micro` by default. SSH and backend access are closed unless CIDRs are explicitly configured.

## Storage Decision

The dev artifacts bucket is for non-secret artifacts, logs, and backups only. It blocks public access, uses AES256 encryption, and has lifecycle expiration.

Do not store:

- Secrets.
- PAN.
- CVV.
- Card tokens.
- Provider credentials.
- Raw provider payloads.

## Budget Decision

Budgets are mandatory in dev. The module requires at least one alert email and emits alerts at 20, 30, and 50 USD equivalent thresholds.

Budgets alert; they do not stop AWS spend.

## Explicitly Not Created

- NAT Gateway.
- Application Load Balancer.
- ECS/Fargate.
- EKS.
- RDS or RDS Multi-AZ.
- WAF.
- CloudFront for the landing.
- Secrets Manager secrets.
- CI/CD.
- Auto Scaling.
- Production environments.

## Tags

All resources use:

- `Project = FondixPay`
- `Environment = dev`
- `Owner = NorthboundFinOps`
- `ManagedBy = Terraform`
- `CostControl = strict`

## Production Blockers

AWS-1 does not remove any product blocker:

- Real payment provider remains unselected.
- Prontipagos production integration remains absent.
- Card processor production integration remains absent.
- Provider secrets and webhook security remain future work.
- Production deployment architecture remains future work.

