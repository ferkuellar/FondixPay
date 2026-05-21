# Card Processor Evaluation Matrix

Updated: 2026-05-20

Phase 8A defines the scorecard without selecting a provider. Provider columns stay as placeholders until approved commercial, API, security, and mobile compatibility research is performed.

| Criteria | Weight | Provider A | Provider B | Provider C | Notes |
|---|---:|---|---|---|---|
| Mexico card support | 10 | TBD | TBD | TBD | Legal/commercial availability for Mexico. |
| Debit/credit card support | 9 | TBD | TBD | TBD | Both card categories required for product scope. |
| Tokenization | 10 | TBD | TBD | TBD | Backend must avoid PAN/CVV by default. |
| Mobile SDK/hosted fields | 9 | TBD | TBD | TBD | Expo/React Native fit and secure capture path. |
| Sandbox quality | 9 | TBD | TBD | TBD | Test cards, decline cases, webhooks, docs. |
| 3DS | 8 | TBD | TBD | TBD | Future auth-challenge support and UX handoff. |
| Webhooks | 8 | TBD | TBD | TBD | Signature, replay, state updates. |
| Idempotency | 10 | TBD | TBD | TBD | Charge retry/double-tap protection. |
| Refunds/voids | 7 | TBD | TBD | TBD | Future reversals and operational recovery. |
| Chargebacks | 8 | TBD | TBD | TBD | Dispute evidence and support tooling. |
| Settlement | 7 | TBD | TBD | TBD | Timing, reports, and reconciliation. |
| Fees | 7 | TBD | TBD | TBD | Commercial model and card costs. |
| Docs quality | 8 | TBD | TBD | TBD | API contracts, examples, error taxonomy. |
| PCI scope | 10 | TBD | TBD | TBD | Hosted/tokenized posture preferred. |
| Support | 7 | TBD | TBD | TBD | Escalation, outage handling, response time. |

## Scoring Notes

- `TBD` means not researched/approved yet.
- A provider with weak tokenization or unsafe PCI posture should be rejected regardless of weighted total.
- Prontipagos is evaluated separately as service-payment aggregator, not as the default card processor.
