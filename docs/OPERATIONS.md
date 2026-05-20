# Operations

## Current Operations

- `GET /health` exists.
- Docker Compose can run PostgreSQL and backend for local/dev.
- No production monitoring is defined.

## Pending Operational Capabilities

- Structured logs.
- Error tracking.
- Metrics.
- Alerting.
- Backup and restore.
- Incident response.
- Payment review queue.
- Receipt review.
- Audit review.
- Support workflows.
- Runbooks.

## Incident Categories Future

- Auth/OTP outage.
- API degradation.
- Provider outage.
- Payment pending too long.
- Receipt generation failure.
- Webhook processing failure.
- Suspected fraud.
- Data access concern.

## Continuous Improvement

Operations should feed back into roadmap, risk register, support tooling, and audit controls.

## Phase 4B Operational Gate

Current health check:

- `GET /health` returns a simple application status.
- It is intentionally lightweight and does not perform a DB dependency check yet.

Desired future health checks:

- Liveness: app process responds.
- Readiness: database is reachable with bounded timeout.
- Version/build metadata.
- Environment name without leaking secrets.

Testing as an operational gate:

```powershell
cd backend
python -m compileall app
python -m pytest

cd ../mobile
npm run typecheck
```

How to interpret failures:

- `compileall` failure means import/syntax/runtime import safety is broken.
- `pytest` failure means backend behavior or security boundaries regressed.
- `typecheck` failure means mobile contract or TypeScript safety regressed.

Pending operations work:

- Structured logging.
- Request correlation IDs.
- Error tracking.
- CI/CD gates.
- Metrics and alerting.
- Backup/restore drills.
- Audit review workflow.

Production blockers:

- No rate limiting.
- No RBAC enforcement.
- No audit log persistence.
- No ledger.
- No migration discipline enforcement.
- No observability/incident runbooks.

## Phase 5A Payment Operations Strategy

Future payment operations must include:

- Payment monitoring for intent, attempt, provider, ledger, and receipt states.
- Failed payment queue.
- Pending/timeout payment queue.
- Reconciliation monitoring.
- Audit log review workflow.
- Provider outage handling.
- Retry policy with idempotency rules.
- Manual review queue for mismatches, duplicate provider references, missing receipts, and user claims.
- Daily settlement/conciliation checklist.

Future metrics:

- `payment_success_rate`
- `payment_failure_rate`
- `provider_timeout_rate`
- `duplicate_blocked_count`
- `reconciliation_mismatch_count`
- `receipt_generation_failure_count`

Provider outage handling:

- Stop new real provider submissions if outage threshold is met.
- Keep existing pending payments in non-success state until provider evidence arrives.
- Display user-facing pending/support status rather than guessed success.
- Preserve provider request hashes, audit events, and correlation IDs.

Daily reconciliation checklist:

1. Import or fetch provider report.
2. Compare provider transactions against internal payment intents and attempts.
3. Verify ledger entries for succeeded/reversed payments.
4. Verify receipt state for provider-confirmed payments.
5. Create review records for mismatches.
6. Emit reconciliation audit events.
7. Escalate unresolved mismatches to finance/support.
