# Reconciliation

## Current State

Phase 11 does not implement production reconciliation execution. Existing admin card and Prontipagos reconciliation endpoints remain placeholders with `production_ready=false`.

## Phase 11 Readiness Additions

- Fraud signals can link to reconciliation mismatches.
- Dispute evidence can use `evidence_type=reconciliation`.
- Chargeback/dispute cases can reference payment, provider transaction, and card processor references.

## Manual Workflow

1. Operator reviews card or Prontipagos reconciliation placeholder/status.
2. If a mismatch is found by manual inspection or future job, create a manual review case or fraud signal.
3. If the mismatch relates to a dispute/chargeback, add reconciliation evidence to the case.
4. Do not alter payment, receipt, ledger, or provider state without an approved future remediation workflow.

## Future Events

- `reconciliation.mismatch_detected`
- `reconciliation.mismatch_reviewed`
- `provider.reconciliation_started`
- `provider.reconciliation_completed`
- `provider.reconciliation_mismatch`

## Security

Reconciliation notes and evidence must not include PAN, CVV, secrets, raw provider payloads, or full customer contact details unless a later privacy/legal policy approves storage.
