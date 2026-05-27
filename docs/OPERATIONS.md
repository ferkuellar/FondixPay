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

## Phase 5B Operational Notes

Request tracing:

- Every response includes `X-Request-ID`.
- Support should ask for the request ID when investigating API failures.

Payment tracing:

- Mock payment flows now create a `correlation_id` in `payment_intents`.
- Related audit events, ledger trace entries, attempts, and provider transaction mock records should be investigated by correlation ID.

Operational checks:

```powershell
cd backend
python -m pytest
```

Review targets:

- `audit_events` for auth/payment/receipt event trails.
- `payment_intents` for idempotency and high-level payment state.
- `payment_attempts` for provider submission attempts.
- `ledger_entries` for mock trace entries only.
- `provider_transactions` for mock provider references only.

Pending operations:

- Real reconciliation job.
- Manual review queue.
- Provider outage runbook.
- Alerting on failed/timeout/duplicate payment attempts.
- Admin/auditor tooling with RBAC.

## Phase 5C Fee Transparency Operations

Support should be able to answer "me cobraron de más" tickets with:

- Service amount.
- FondixPay fee.
- Final total.
- Folio/mock reference.
- Request ID/correlation ID when backend payment API is involved.

Future operations requirements:

- Support/admin views must show amount vs fee separately.
- Finance dashboards should track fee revenue separately from service amount.
- Reconciliation must separate provider service amount, FondixPay fee, and any provider costs.
- Legal/commercial owners must approve final fee model before production.

## Payment Method Operations

- Support must identify the method used via safe display label only.
- Logs must not include PAN, CVV, or raw provider card payloads.
- Method failure incidents should capture request ID, user ID, method ID, safe display label, provider status, and audit event IDs.
- Future metrics:
  - `payment_method_add_success_rate`
  - `payment_method_add_failure_rate`
  - `payment_method_selection_change_rate`
  - `payment_method_unavailable_count`
# Payment Method Mock Operations

- Internal beta support must understand that Phase 5E demo methods do not generate real charges.
- Tickets about real payment methods remain out of scope until a provider and tokenization strategy are approved.
- Support copy must distinguish `Tarjeta demo` from a real tokenized card and from Prontipagos service-payment execution.
- Pending operational risks: provider downtime handling, token lifecycle, payment method validation, and failed payment recovery.

# Payment Recovery Operations

Future runbooks are required for:

- Payment failed before provider confirmation.
- Payment pending or provider timeout.
- Duplicate payment attempt.
- Receipt unavailable after confirmed payment.

Future metrics:

- `payment_failed_count`
- `payment_pending_count`
- `payment_retry_count`
- `duplicate_blocked_count`
- `support_requested_from_payment_error`
- `receipt_unavailable_count`

Phase 5F only adds mock/dev recovery UX and a support placeholder; it does not create a real support queue.

# Account and Balance Operations

Future operations must cover:
- Balance discrepancy handling.
- Movement investigation from ledger/payment references.
- Account restriction flow.
- Suspicious balance change review.
- Runbook for “mi saldo no coincide”.

Future metrics:
- `balance_view_count`
- `movement_count`
- `account_restricted_count`
- `balance_discrepancy_count`
- `demo_balance_usage_count`

## Phase 6B Demo Balance Operations
- Internal support must treat Phase 6B balance values as demo data only.
- A complaint that demo balance does not match expected UX should be investigated through the demo account, snapshot, movement, and audit events, not as a real-funds incident.
- Future metrics remain required: `balance_view_count`, `movement_view_count`, `demo_credit_count`, and `balance_error_count`.
## Phase 7 Receipt And History Operations

Support may ask for safe mock reference or correlation id from the receipt detail during internal validation. A receipt marked pending or unavailable is not proof of provider confirmation.

Future runbooks required:
- receipt unavailable,
- pending payment,
- failed payment,
- user says "me cobraron".

Future metrics:
- `receipt_view_count`
- `receipt_unavailable_count`
- `pending_history_count`
- `failed_history_count`
- `support_from_receipt_count`

## Card Payment Operations

Future support and operations must cover:

- card decline support,
- expired card support,
- chargeback handling,
- card processor outage,
- card authorization timeout,
- 3DS/auth challenge support when the selected processor requires it,
- no PAN/CVV exposure in support tooling.

Prontipagos outage handling remains a separate service-payment aggregator concern from the future card processor path.

## Card Payment Operations - Phase 8A Runbooks

Future runbooks:

- card declined,
- insufficient funds,
- expired card,
- invalid CVV,
- processor timeout,
- processor outage,
- chargeback received,
- duplicate charge suspected,
- card charge succeeded but Prontipagos failed,
- Prontipagos succeeded but card charge not captured, which should not happen.

Future metrics:

- `card_charge_success_rate`
- `card_charge_decline_rate`
- `card_charge_timeout_rate`
- `card_tokenization_failure_rate`
- `card_duplicate_blocked_count`
- `card_chargeback_count`
- `card_processor_error_rate`

## Prontipagos Operations

Future runbooks:

- provider outage,
- timeout,
- invalid reference,
- amount mismatch,
- pending transaction,
- receipt unavailable,
- duplicate provider transaction,
- reconciliation mismatch,
- manual review.

Future metrics:

- `prontipagos_payment_success_rate`
- `prontipagos_payment_failure_rate`
- `prontipagos_timeout_rate`
- `prontipagos_pending_count`
- `prontipagos_duplicate_blocked_count`
- `prontipagos_reconciliation_mismatch_count`
- `prontipagos_receipt_unavailable_count`

## Phase 8C Sandbox Operations

- Card success plus Prontipagos mock failure, pending, or timeout maps to `manual_review_required`.
- Card failure, pending, or timeout means Prontipagos is not called.
- Support investigation for sandbox traces should use `correlation_id`, safe provider references, attempts, provider transactions, and audit events.
- These sandbox states do not replace the future manual-review queue, provider status checks, reconciliation job, outage metrics, or production runbooks.

## Phase 9 Receipt Proof Runbooks

- User asks "where is my receipt?": inspect receipt status and safe proof references; confirm whether receipt is generated, pending, or unavailable.
- Receipt pending: use `correlation_id` and provider status; do not tell the user the service is paid.
- Receipt unavailable: verify payment/provider state before requesting any regeneration or retry.
- User says payment was charged but no receipt: treat as review case; collect proof/payment/correlation/provider references without PAN/CVV.
- Failed payment: state that no confirmed proof exists for the failed attempt.
- Proof shared with support: use only safe references from proof to locate audit/payment/provider evidence.
- Future notification delivery failure: keep in-app state truthful and record provider delivery failure when push/email exists.

Future metrics:

- `receipt_generated_count`
- `receipt_pending_count`
- `receipt_unavailable_count`
- `proof_view_count`
- `proof_share_count`
- `notification_created_count`
- `notification_read_rate`
- `support_from_receipt_count`

## CRM Admin Operations

CRM workflows required before commercial production:

- Support investigation from masked identity, `payment_id`, `receipt_id`, `correlation_id`, or permitted provider reference.
- Failed payment investigation using payment attempts, receipt status, safe card status, and user-safe next action.
- Pending/timeout investigation without guessing provider confirmation.
- Receipt unavailable investigation with proof state and manual-review escalation.
- Card reconciliation view for processor charge evidence.
- Prontipagos reconciliation view for service-payment evidence.
- Manual-review queue assignment, escalation, notes, resolution, and closure.
- Escalation from support to finance/admin when reconciliation or provider ambiguity exists.

CRM runbooks should cover:

- payment failed,
- payment pending too long,
- receipt unavailable,
- card success plus Prontipagos failure,
- amount mismatch,
- duplicate suspected,
- provider timeout,
- user says provider was not paid,
- privileged export request.

CRM metrics:

- `admin_login_count`
- `failed_admin_login_count`
- `support_ticket_count`
- `manual_review_open_count`
- `manual_review_resolution_time`
- `payment_pending_count`
- `payment_failed_count`
- `receipt_unavailable_count`
- `card_reconciliation_mismatch_count`
- `prontipagos_reconciliation_mismatch_count`
- `audit_log_view_count`
- `export_request_count`
## CRM Admin Backend Operations

Phase 10B provides backend-only operational APIs. The CRM frontend is still pending.

- Support can search safe user/payment/receipt context, create a support ticket, update its status, and add internal notes.
- Finance can inspect payment and receipt evidence, open/update manual review cases, and see reconciliation placeholders.
- Manual review cases represent ambiguous evidence such as provider timeout, receipt unavailable, duplicate suspicion, amount mismatch, and card-success/service-failure combinations.
- Support investigations should pivot by `payment_id`, `receipt_id`, and `correlation_id`; provider-reference visibility remains role limited.
- Card and Prontipagos reconciliation responses currently say `not_implemented`; they are not reconciliation proof.
- Audit queries are restricted to audit/admin roles and return redacted metadata.

Current operational metrics can be derived from dashboard counters for users, payments, generated receipts, open tickets, and open manual-review cases. Real reconciliation mismatch metrics remain Phase 10D work.

## CRM Admin Frontend Operations

- Start in Dashboard for aggregate mock/sandbox counters.
- Use Users, Payments, and Receipts for safe evidence lookup by the available backend filters and detail references.
- Use Tickets for controlled support status and internal notes; notes must stay free of PAN/CVV/tokens/secrets.
- Use Manual Review for ambiguous payment states that require finance/admin operation.
- Treat card and Prontipagos reconciliation screens as placeholders until Phase 10D/provider work.
- Audit Logs are read-only and visible only for permissioned roles.
## Phase 10D - CRM Admin Operations

### Support Runbook - Missing Receipt

1. Search by `receipt_id`, `payment_id`, or `correlation_id` in `/admin/search`.
2. Review payment status and provider/service payment status.
3. Review receipt/proof status.
4. If receipt is unavailable after a confirmed sandbox/provider state, open or link a manual review case with `receipt_unavailable`.
5. Create or update a support ticket with safe references only.
6. Communicate a safe state to the user: pending/unavailable/under review. Do not claim fiscal or production confirmation.

### Manual Review Runbook - Card Success + Prontipagos Failure

1. Verify card leg status and service payment leg status separately.
2. Do not mark the payment as successful from CRM.
3. Create manual review case `card_success_prontipagos_failed`.
4. Link `payment_id`, `correlation_id`, provider reference if allowed, and support ticket if present.
5. Assign to FINANCE/ADMIN.
6. Document resolution before moving to `resolved` or `closed`.

### Reconciliation Runbook - Provider Timeout

1. Treat provider timeout as ambiguous, not success.
2. Search by `correlation_id` and provider reference.
3. Open manual review `prontipagos_timeout` or `provider_status_unknown`.
4. Leave reconciliation as placeholder until real provider reports exist.

### Reconciliation Runbook - Duplicate Suspected

1. Search by user, payment, receipt, and correlation references.
2. Create manual review `duplicate_attempt` or `duplicate_charge_claim`.
3. Attach support ticket if the user contacted support.
4. Do not issue refunds, chargebacks, or ledger edits in this phase.

### Support Runbook - User Claims Charged But Not Paid

1. Search by phone/user/payment/correlation reference.
2. Review payment, receipt, and provider status.
3. Create a support ticket with category `duplicate_charge_claim`, `payment_pending`, or `prontipagos_issue`.
4. Open manual review when card and provider states disagree.
5. Escalate to FINANCE when reconciliation is needed.
6. Close only with resolution notes.

### Operational Metrics

- `support_ticket_created_count`
- `support_ticket_closed_count`
- `manual_review_created_count`
- `manual_review_resolution_time`
- `reconciliation_card_view_count`
- `reconciliation_prontipagos_view_count`
- `admin_search_count`
- `manual_review_closed_without_resolution_count` must remain zero

## Phase 10D.1 - WhatsApp Receipt Channel Operations

WhatsApp delivery is future-only and non-blocking. Support must always treat the internal receipt/proof as the source of truth.

### Runbook - WhatsApp Delivery Failed

1. Verify internal receipt/proof status first.
2. Check future delivery record by `receipt_id` and idempotency key.
3. Confirm user consent is still active.
4. Record safe failure reason only.
5. Retry only if idempotency allows.
6. Do not change payment or receipt state.

### Runbook - Duplicate Delivery Suspected

1. Search by `receipt_id`, `template_name`, and `recipient_hash`.
2. Verify whether duplicate was blocked by idempotency.
3. If duplicate was sent, create support/manual-review note with safe references.
4. Do not expose full phone or raw provider payloads.

### Runbook - User Revokes Consent

1. Update future notification preference to disabled.
2. Record `whatsapp.consent_revoked`.
3. Stop future sends for that channel/type.
4. Preserve historical delivery logs as append-only evidence.

### Runbook - Provider Outage

1. Stop automatic retries if outage threshold is reached.
2. Keep payments and receipts independent from delivery.
3. Surface safe degraded status in CRM.
4. Resume sends only after provider recovery and idempotency checks.

### Runbook - Template Rejected

1. Disable sends for the rejected template.
2. Record safe template rejection reason.
3. Do not fall back to free-form receipt messages without approval.
4. Re-submit template through provider approval process.

### Runbook - User Says Receipt Not Received

1. Confirm receipt exists in-app/internal proof.
2. Confirm WhatsApp consent.
3. Check delivery status by safe references.
4. Re-send only if policy and idempotency allow.
5. Offer in-app receipt as the authoritative proof.

### CRM Support View Future

- Show delivery status and template name.
- Show masked phone or recipient hash only.
- Show safe provider message id if allowed.
- Hide raw provider payloads and full phone number.
- Allow retry only with a future explicit permission.

Future metrics:

- `whatsapp_receipt_send_success_rate`
- `whatsapp_receipt_send_failure_rate`
- `whatsapp_duplicate_blocked_count`
- `whatsapp_consent_rate`
- `whatsapp_revocation_rate`
