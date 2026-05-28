# AWS-1 - Terraform Foundation Blueprint

## Architecture

```txt
backend/
  S3 state bucket
  DynamoDB lock table

environments/dev/
  network module
  storage module
  compute module
  budget module
```

## Network

Use a dedicated dev VPC for future environment separation:

- One VPC.
- One public subnet.
- One Internet Gateway.
- Public route table.
- No NAT Gateway.
- No Load Balancer.

## Compute

Optional EC2 only:

- Disabled by default.
- `t4g.micro` default.
- IMDSv2 required.
- Encrypted root volume.
- No inbound access unless CIDRs are configured.
- CloudWatch log group retained 3-7 days.

## Storage

S3 artifacts bucket:

- Public access blocked.
- AES256 encryption.
- Versioning.
- Lifecycle expiration.

## Budget

One monthly cost budget with alerts at:

- 20 USD.
- 30 USD.
- 50 USD.

## Tagging

Every resource uses:

- Project.
- Environment.
- Owner.
- ManagedBy.
- CostControl.

## Safety

The foundation does not deploy or imply production readiness. Real payment infrastructure remains future work.

