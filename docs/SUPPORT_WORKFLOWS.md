# Support Workflows

## Current State

Support tickets and manual review cases already exist for internal CRM operations. Phase 11 adds fraud signal visibility and dispute/chargeback case workflows.

## Support Role

SUPPORT can view users, payments, receipts, manual review cases, fraud signals, and support tickets according to backend permissions. SUPPORT cannot update fraud signals or dispute cases in Phase 11.

## Fraud Signal Support Path

1. Search for the customer/payment/receipt using safe references.
2. Open the fraud signal if visible.
3. Do not reveal internal fraud labels to customers.
4. Add support context through ticket notes if needed.
5. Escalate to FINANCE/ADMIN for signal status changes.

## Dispute/Chargeback Support Path

1. Open or update a support ticket with safe customer-facing context.
2. Link payment, receipt, manual review, or correlation references when available.
3. Do not promise refund, win/loss outcome, or provider confirmation.
4. Route chargeback/dispute evidence requests to FINANCE/ADMIN.

## Internal Notes

Internal notes are not customer-visible. Notes must not contain:

- PAN or CVV.
- Provider secrets.
- Raw provider payloads.
- Raw provider errors.
- Full phone numbers unless a future privacy policy permits it.

## Failure Handling

If evidence is incomplete, keep the case open or move it to `EVIDENCE_GATHERING`. Do not close a support ticket or dispute case merely because provider state is unknown.
