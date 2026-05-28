# AWS-2 - Dev/Staging Deployment Acceptance

## Repository Hygiene

- [x] `.terraform/` is ignored by `.gitignore`.
- [x] `terraform.tfstate` and `terraform.tfstate.*` are ignored by `.gitignore`.
- [x] `terraform.tfvars` and `*.tfvars.json` are ignored by `.gitignore`.
- [x] `tfplan` and `*.tfplan` are ignored by `.gitignore`.
- [x] Git tracked-file checks did not show `.terraform/`, `.tfstate`, `.tfvars`, or `tfplan` tracked.
- [x] `.terraform.lock.hcl` remains versionable.
- [x] `terraform.tfvars.example` remains versionable and uses placeholders only.

## Terraform Validation

- [x] `terraform fmt -recursive` executed from `infra/terraform`.
- [x] `terraform init` passed for `infra/terraform/environments/dev`.
- [x] `terraform init` passed for `infra/terraform/backend`.
- [x] `terraform validate` passed for `infra/terraform/environments/dev`.
- [x] `terraform validate` passed for `infra/terraform/backend`.
- [x] `terraform plan` was attempted for `infra/terraform/environments/dev`.
- [ ] `terraform plan` completed successfully.
- [ ] `terraform apply` completed successfully.

## Current Blocker

`terraform plan` is blocked because no AWS credentials are configured in this environment. `aws sts get-caller-identity` returned `NoCredentials`, and Terraform returned `No valid credential sources found`.

## Product Boundaries

- [x] No production resources were deployed.
- [x] No real payment provider was integrated.
- [x] No real Prontipagos connectivity was added.
- [x] No real card processor was added.
- [x] No application payment logic was modified.
- [x] No secrets were committed.

## Documentation

- [x] Dev deployment workflow documented.
- [x] Rollback and destroy instructions documented.
- [x] Security notes reviewed.
- [x] Cost notes reviewed.
- [x] AWS-2 completion report exists.

