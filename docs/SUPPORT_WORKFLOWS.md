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

## Phase 10X.2 Chat Operations Workflow

Chat Operations is the internal console for chatbot-origin conversations and human escalation.

1. Review the conversation queue in `#/chat-operations`.
2. Filter by `SEV-1`, `SEV-2`, escalated, unassigned, source, or status.
3. Open the transcript and review masked user/bot messages plus classification reason.
4. For `SEV-1` and `SEV-2`, create or confirm a linked ticket and route it to the human queue.
5. Assign to self or reassign according to role.
6. Add internal notes with safe context only.
7. Mark first response when a human response has been sent through the approved authenticated support channel.
8. Resolve or close only with human decision and note.

Rules:

- AI must not auto-close `SEV-1` or `SEV-2`.
- `Bot de Landing` remains configuration and metrics only; it is not the support desk.
- Public chatbot users must be routed to authenticated app/support flows for private payment, receipt, account, OTP, card, or balance questions.
- Internal notes must not include PAN, CVV, OTPs, passwords, provider secrets, raw provider payloads, or raw provider errors.
