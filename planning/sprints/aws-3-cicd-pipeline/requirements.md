# Fase AWS-3 - CI/CD Pipeline Requirements

## Goal

Create a safe, auditable CI/CD foundation for FONDIXPAY after AWS-1 Terraform foundation and AWS-2 dev deployment discipline.

## In Scope

- Inspect existing repo structure and scripts.
- Add GitHub Actions validation workflows.
- Add Terraform formatting, init, validate, and controlled dev plan support.
- Add a manual dev deployment workflow with approval gating.
- Document secret management, environment strategy, rollback, and branch protection.
- Update planning state, decisions, risks, and completion evidence.

## Out Of Scope

- Production deployment.
- Production payment processing.
- Production Prontipagos connectivity.
- Store release automation.
- Kubernetes, ECS, EKS, multi-region, or multi-cloud deployment.
- Destructive database migrations.
- Real secret creation or hardcoded credentials.
- Automatic Terraform apply on push to `main`.

## Safety Requirements

- Pull request validation must not deploy.
- Terraform apply must be manual and target `dev` only.
- Production must not be enabled by default.
- Workflows must not upload Terraform state or plan artifacts.
- AWS credentials must use GitHub OIDC where possible.
- Vercel remains landing-only and must not host backend, CRM, payment, ledger, reconciliation, or secret-bearing workloads.
