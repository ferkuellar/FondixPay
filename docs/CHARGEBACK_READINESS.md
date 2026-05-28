# Chargeback Readiness

## Purpose

Phase 11 prepares FondixPay to collect and review chargeback/dispute evidence without submitting anything automatically to card networks or processors.

## Scope

Implemented scope:

- Internal `dispute_cases` model for disputes and chargebacks.
- Internal `dispute_evidence` model for evidence metadata.
- Admin APIs under `/admin/disputes`.
- CRM/Admin list and detail screens.
- RBAC for FINANCE/ADMIN/SUPER_ADMIN updates and AUDITOR read-only access.
- Audit events for creation, status changes, closure, and evidence additions.

Out of scope:

- External card-network submission.
- Automatic refunds.
- Automatic payment state changes.
- Legal advice or formal dispute response policy.

## Case Statuses

| Status | Meaning |
|---|---|
| `OPEN` | Case created and awaiting triage. |
| `UNDER_REVIEW` | Authorized operator is reviewing facts. |
| `EVIDENCE_GATHERING` | Evidence is being collected. |
| `SUBMITTED` | Placeholder for externally submitted evidence when future integration is approved. |
| `WON` | Outcome recorded as won. |
| `LOST` | Outcome recorded as lost. |
| `CLOSED` | Internal case closed. |
| `CANCELED` | Case canceled as invalid/duplicate. |

## Evidence Model

Evidence records store metadata only:

- `evidence_type`
- `title`
- `description`
- `storage_reference`
- `source_entity_type`
- `source_entity_id`
- `created_by`
- `created_at`

`storage_reference` must point to private storage or an internal reference. It must not be a public URL exposing private documents.

Evidence types:

- `payment_summary`
- `receipt`
- `provider_confirmation`
- `card_processor_reference`
- `support_note`
- `manual_review`
- `reconciliation`
- `customer_communication`
- `other`

## Chargeback Evidence Checklist

- Who initiated the payment: `user_id`, audit events, request ID, correlation ID.
- What was paid: service/provider labels, service reference masked where applicable.
- Amounts: `amount_minor`, `currency`, future fee/total evidence.
- Provider/aggregator IDs: safe Prontipagos/provider transaction reference if available.
- Card processor reference: safe processor reference if available.
- Status transitions: payment, provider, receipt, manual review, dispute status.
- Receipt evidence: receipt/proof link when available.
- Reconciliation state: mismatch or matched status when available.
- Support history: internal ticket/notes where relevant.

## Roles

- `FINANCE`: create/update cases, add evidence, manage status.
- `ADMIN` and `SUPER_ADMIN`: full internal access.
- `AUDITOR`: read-only access.
- `SUPPORT`: no direct dispute update permission in Phase 11; support evidence can be linked by authorized finance/admin users.
- `USER`/`CLIENT`: no access.

## Workflow

1. Finance/Admin creates a dispute or chargeback case.
2. Case starts at `OPEN`.
3. Authorized reviewer updates status and assignment.
4. Evidence records are appended as metadata.
5. Closing statuses set `closed_at`.
6. Every create/status/evidence action emits an audit event.

## Open Questions

- Legal response templates and deadlines.
- Processor-specific reason-code taxonomy.
- Secure export format for evidence packages.
- Retention and legal hold requirements.
