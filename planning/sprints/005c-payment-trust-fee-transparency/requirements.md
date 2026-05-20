# Sprint 005C - Payment Trust & Fee Transparency Requirements

## Goal

Show service amount, FondixPay fee, and final total before payment confirmation, and preserve the same breakdown on success and receipt/history surfaces.

## In Scope

- Fixed mock/dev fee model.
- Backend fee fields on payment response.
- Mobile fee breakdown in service detail, confirmation, CTA, success, and receipt/history card.
- Specific trust microcopy without unsupported compliance claims.
- Audit events/contracts for fee disclosure and confirmed total.
- Tests for backend fee calculation and response fields.
- AXON-AI documentation updates.

## Out Of Scope

- Prontipagos integration.
- Real payment provider.
- Real payment method storage.
- SPEI, KYC, wallet, PCI/tokenization.
- Payment recovery path.
- Admin console.
- Production release.
