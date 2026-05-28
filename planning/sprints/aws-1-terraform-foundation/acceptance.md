# AWS-1 - Terraform Foundation Acceptance

## Infrastructure

- [x] `infra/terraform` exists.
- [x] Remote state bootstrap exists.
- [x] Dev environment exists.
- [x] Modules exist for network, compute, storage, and budget.
- [x] No NAT Gateway is defined.
- [x] No Load Balancer is defined.
- [x] No RDS is defined.
- [x] No ECS/Fargate/EKS is defined.
- [x] No WAF is defined.
- [x] Budget alerts are defined.
- [x] Tags are applied through provider defaults and resource tags.

## Operations

- [x] Docs explain bootstrap.
- [x] Docs explain dev plan/apply.
- [x] Docs explain destroy.
- [x] Docs list cost-generating resources.

## Product Boundaries

- [x] Landing remains on Vercel.
- [x] No payment code changed.
- [x] No Prontipagos integration added.
- [x] No real card processor added.
- [x] Production remains blocked.

## Validation

- [x] `terraform fmt -recursive infra/terraform` executed.
- [x] `terraform validate` executed for `infra/terraform/environments/dev`.
- [x] `terraform validate` executed for `infra/terraform/backend`.
- [ ] `terraform plan` completed with AWS credentials.

`terraform plan -refresh=false` was attempted and blocked by missing AWS credentials in the local environment.
