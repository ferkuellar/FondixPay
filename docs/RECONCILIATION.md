# Reconciliation

## Current State

Phase 11 does not implement production reconciliation execution. Existing admin card and Prontipagos reconciliation endpoints remain historical placeholders with `production_ready=false`.

Sprint 010 changes the provider target: Tekae is the approved provider. Prontipagos reconciliation is superseded and must not be expanded.

No Tekae reconciliation execution is implemented yet.

## Phase 11 Readiness Additions

- Fraud signals can link to reconciliation mismatches.
- Dispute evidence can use `evidence_type=reconciliation`.
- Chargeback/dispute cases can reference payment, provider transaction, and card processor references.

## Manual Workflow

1. Operator reviews available safe Tekae session, support, or future reconciliation evidence.
2. If a mismatch is found by manual inspection or future Tekae report, create a manual review case or fraud signal.
3. If the mismatch relates to a dispute/chargeback, add reconciliation evidence to the case.
4. Do not alter payment, receipt, ledger, or provider state without an approved future remediation workflow.

## Future Events

- `reconciliation.mismatch_detected`
- `reconciliation.mismatch_reviewed`
- `provider.reconciliation_started`
- `provider.reconciliation_completed`
- `provider.reconciliation_mismatch`

## Tekae Reconciliation Requirements

Before implementation, Tekae must confirm:

- Whether reconciliation reports exist.
- Report delivery method and cadence.
- Required identifiers for matching FONDIXPAY sessions to Tekae transactions.
- Amount, currency, service, user, and timestamp fields.
- Status taxonomy and terminal states.
- Dispute, reversal, refund, or cancellation evidence if supported.
- Whether transaction query APIs exist for manual review.

Until this is confirmed, FONDIXPAY must not claim production reconciliation readiness.

## Security

Reconciliation notes and evidence must not include PAN, CVV, secrets, raw provider payloads, or full customer contact details unless a later privacy/legal policy approves storage.
