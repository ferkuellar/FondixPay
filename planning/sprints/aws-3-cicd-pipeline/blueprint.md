# Fase AWS-3 - CI/CD Pipeline Blueprint

## Architecture

AWS-3 uses GitHub Actions as the CI/CD control plane.

Workflows:

- `ci.yml`: application and static landing validation. No deployment.
- `terraform-dev.yml`: Terraform fmt/init/validate on infra changes; manual dev plan when secrets and approvals are configured.
- `deploy-dev.yml`: manual dev-only Terraform apply through GitHub Environment `dev`.

## Application Validation

- Backend: install Python dependencies, compile `app`, run pytest.
- Mobile: install with npm and run `npm run typecheck`.
- Admin: install with npm, run `npm run typecheck`, then `npm run build`.
- Landing: static file presence and basic secret-pattern scan.

No fake lint, test, or build scripts are introduced.

## Terraform Validation

Validation jobs use `terraform init -backend=false` so pull requests can validate syntax and providers without cloud credentials.

Manual plan/apply jobs generate an uncommitted `backend_override.tf` in the runner and use S3/DynamoDB backend config from GitHub secrets. The override is not committed.

## Deployment Gate

The dev deployment workflow requires:

- `workflow_dispatch`.
- `confirm_environment=dev`.
- `apply=true`.
- GitHub Environment `dev`.
- OIDC role assumption.
- Remote state bucket and lock table secrets.
- Terraform plan immediately before apply.

Staging and production are not implemented.

## Security Model

- Least-privilege workflow permissions.
- OIDC preferred over long-lived keys.
- No state or tfplan artifact uploads.
- No production deployment workflow.
- No Vercel deployment for sensitive runtime.
