# AWS-2 - Dev/Staging Deployment Requirements

## Goal

Safely validate the AWS-1 Terraform foundation for controlled non-production FondixPay infrastructure and document a repeatable dev deployment workflow.

## In Scope

- Review AWS-1 Terraform foundation.
- Confirm Terraform backend/state strategy.
- Validate repository hygiene for Terraform runtime artifacts.
- Validate Terraform formatting.
- Run Terraform initialization.
- Run Terraform validation.
- Run Terraform plan for the dev environment when credentials are available.
- Document blockers when AWS credentials or account confirmation are missing.
- Document deployment, rollback, destroy, operations, security, and cost notes.
- Keep production, real payments, real Prontipagos, and real card processing out of scope.

## Out Of Scope

- Production deployment.
- Production payment processing.
- Production Prontipagos connectivity.
- Production secrets.
- Production database migration.
- CI/CD implementation.
- WhatsApp receipt MVP implementation.
- Kubernetes.
- ECS/EKS unless approved in a later architecture phase.
- Multi-region deployment.
- Auto-remediation.
- Terraform destroy without explicit human approval.

## Non-Production Boundary

AWS-2 can validate and prepare dev deployment only with the current Terraform code. Staging remains a documented future environment because AWS-1 currently enforces `environment = "dev"`.

