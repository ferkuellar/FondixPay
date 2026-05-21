# Phase 5E — Card Payment UX Mock Implementation Requirements

## Goal
Implement a mobile-only mock/dev card UX so users can add, select, and change a simulated card before confirming a mock payment.

## In Scope
- Local Zustand payment method state.
- Card payment methods screen.
- Add card demo screen.
- Confirmation screen selected card requirement.
- Service detail method status.
- Payment success and receipt method disclosure where viable.
- AXON-AI documentation updates.

## Out of Scope
- Real providers.
- Prontipagos integration.
- PAN/CVV capture or storage.
- Backend payment method models.
- Real charges, wallet, KYC, or reconciliation.

## Acceptance Summary
- No phantom payment method remains in the payment flow.
- Mock cards are explicitly labeled as card demo and no real charge.
- Payment confirmation requires a selected card demo.
- Existing fee transparency remains visible.
