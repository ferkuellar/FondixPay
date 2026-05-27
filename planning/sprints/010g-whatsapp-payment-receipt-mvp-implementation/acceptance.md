# Phase 10G Acceptance

Accepted when:

- Sprint 010G docs exist.
- `fondix_pago_exitoso` exists and matches the approved visual/copy hierarchy.
- Consent defaults off and can be enabled/revoked.
- No send occurs without consent.
- Sends require successful payment and confirmed/generated receipt proof.
- Duplicate sends are blocked.
- WhatsApp provider failures do not alter payment, receipt, proof, ledger, or internal receipt status.
- Recipient is masked and hashed; full phone is not exposed in delivery/admin responses.
- Mock provider is default.
- Backend, mobile, and admin validations pass.
- Production remains blocked and documented.
