# Automation Strategy

## Current State

No CI/CD workflow is documented as active in Phase 1.

## Near-Term Automation

- Backend lint/test command once tests are added.
- Mobile `npm run typecheck`.
- Dependency installation validation.
- Docker Compose smoke check.
- Secret scan before commits.

## Future Automation

- GitHub Actions for backend tests.
- GitHub Actions for mobile typecheck.
- API smoke tests.
- Migration validation.
- Build artifacts for mobile release.
- Deployment promotion gates for dev/staging/prod.

## Rule

Automation must not deploy real financial functionality without explicit release approval.
