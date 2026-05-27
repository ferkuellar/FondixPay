# Phase 10G Requirements - WhatsApp Payment Receipt MVP

Goal: implement the MVP WhatsApp channel for successful post-payment receipts using only template `fondix_pago_exitoso`.

In scope:

- Explicit WhatsApp receipt consent, disabled by default.
- Safe delivery log with masked recipient and recipient hash.
- Provider abstraction with mock provider only.
- Safe template payload aligned to the reference visual.
- Non-blocking send after confirmed payment/receipt.
- User/admin endpoints, mobile consent UI, admin delivery list.
- Backend tests and documentation.

Out of scope:

- OTP, reminders, failed-payment WhatsApp, monthly summary, campaigns.
- Real provider integration, real secrets, webhook runtime, production approval.
- Any change to ledger, payment, or receipt truth from WhatsApp delivery state.
