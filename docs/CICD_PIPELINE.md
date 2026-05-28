# AWS-3 CI/CD Pipeline

Fase AWS-3 creates a controlled CI/CD foundation for FONDIXPAY. It validates code and Terraform without enabling production deployment.

## Workflows

### `.github/workflows/ci.yml`

Runs on pull requests and pushes to `main`.

Jobs:

- Backend validation: installs `backend/requirements.txt`, runs `python -m compileall app`, then `python -m pytest`.
- Mobile validation: runs `npm ci` and `npm run typecheck` in `mobile/`.
- Admin validation: runs `npm ci`, `npm run typecheck`, and `npm run build` in `admin/`.
- Landing static check: confirms `landing/index.html` and `landing/vercel.json` exist and scans the landing folder for obvious secret patterns.

This workflow does not deploy and does not require cloud credentials.

### `.github/workflows/terraform-dev.yml`

Runs on infrastructure pull requests and pushes to `main` when Terraform or workflow files change.

Default behavior:

- `terraform fmt -recursive -check`
- `terraform init -backend=false`
- `terraform validate`

Manual behavior:

- `workflow_dispatch` with `run_plan=true` runs a dev Terraform plan against AWS after the GitHub `dev` environment approval and required secrets are configured.

The plan is not uploaded as an artifact.

### `.github/workflows/deploy-dev.yml`

Runs only by `workflow_dispatch`.

Controls:

- Requires `confirm_environment=dev`.
- Requires `apply=true`.
- Uses GitHub Environment `dev`.
- Uses OIDC through `AWS_ROLE_TO_ASSUME`.
- Uses concurrency group `terraform-dev-apply`.
- Runs `terraform plan` immediately before `terraform apply`.
- Targets only `infra/terraform/environments/dev`.

This workflow does not support staging or production.

## Environment Strategy

- `dev`: active Terraform environment. CI can validate and, after manual approval, apply dev infrastructure.
- `staging`: not active. No Terraform folder exists yet.
- `production`: not active. No production deployment workflow is allowed in AWS-3.

## Required GitHub Configuration

Create a protected GitHub Environment named `dev`.

Recommended environment settings:

- Required reviewers before deployment jobs run.
- Restricted deployment branches limited to `main`.
- Environment secrets scoped only to `dev`.

Required repository or environment variables/secrets:

| Name | Type | Purpose |
| --- | --- | --- |
| `AWS_REGION` | variable or secret | AWS region for dev, for example `us-east-1`. |
| `AWS_ROLE_TO_ASSUME` | secret | IAM role ARN trusted by GitHub OIDC for dev. |
| `TF_STATE_BUCKET` | secret | S3 bucket for Terraform state. |
| `TF_LOCK_TABLE` | secret | DynamoDB table for Terraform state locks. |
| `TF_VAR_ARTIFACTS_BUCKET_NAME` | secret | Globally unique dev artifacts bucket name. |
| `TF_VAR_BUDGET_ALERT_EMAILS` | secret | Terraform list value, for example `["ops@example.com"]`. |

Long-lived `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are not used by the committed workflows. Use them only as a temporary fallback if OIDC cannot be configured, and document that exception separately.

## Branch Protection Recommendation

For `main`:

- Require pull request before merge.
- Require the `CI` workflow to pass.
- Require the `Terraform Dev` workflow to pass for infrastructure changes.
- Require at least one approval.
- Block force pushes.
- Block deletion of `main`.
- Require conversation resolution before merge.

## Vercel Boundary

Vercel is approved only for the static public landing page under `landing/`.

Do not deploy through Vercel:

- Backend/API.
- Payment processing.
- Reconciliation.
- Ledger/audit workloads.
- CRM/Admin workflows.
- Provider secrets or payment credentials.

AWS-3 does not add a Vercel deployment workflow.

## Rollback And Failure Handling

CI failure:

1. Inspect the failed job logs.
2. Fix only the failing area.
3. Re-run the workflow.

Terraform validation failure:

1. Run the same command locally from `infra/terraform`.
2. Fix format or validation errors.
3. Do not apply until validation and plan pass.

Terraform plan failure:

1. Confirm AWS OIDC role and `dev` environment secrets.
2. Confirm remote state bucket and lock table exist.
3. Confirm Terraform variables are present.
4. Confirm account identity is non-production.

Terraform apply failure:

1. Preserve the workflow logs.
2. Run `terraform plan` locally or through the manual plan workflow after the failure.
3. Do not run `terraform destroy` automatically.
4. If rollback requires destruction, run `terraform plan -destroy` and request explicit human approval before `terraform destroy`.

## Production Gate

Production deployment is not enabled. It requires a future approved phase with separate Terraform environment design, secrets, approvals, monitoring, rollback, and security review.
