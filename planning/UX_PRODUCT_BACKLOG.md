# UX/Product Backlog

Updated: 2026-05-20

| ID | Severity | Finding | Impact | Suggested Phase | Status |
| --- | --- | --- | --- | --- | --- |
| UX-001 | SEV-1 / Production Blocker | FondixPay fee is not visible before payment confirmation | Surprise fee, chargeback risk, trust loss | Phase 5C - Payment Trust & Fee Transparency | Implemented for mock/dev |
| UX-002 | SEV-1 / Production Blocker | Payment recovery path is missing | User may retry blindly or not know if a charge happened | Phase 5D - Payment Recovery Paths | Open |
| UX-003 | SEV-1 / Production Blocker | Payment method add/select flow is missing | Real payment cannot assume a preselected method | Phase 5C - Payment Method Flow | Open |
| UX-004 | SEV-1 / Production Blocker | Ledger and audit foundation absent before real money | Financial traceability cannot be proven | Phase 5A - Ledger & Audit Foundation Design | Open |
| UX-005 | SEV-2 / High | Trust signals are insufficient for target users | Lower confidence, lower activation, support burden | Phase 5C - Payment Trust & Fee Transparency | Partial |
| UX-006 | SEV-2 / High | 4-digit OTP mockup is obsolete and conflicts with 6-digit implementation | Design/security drift | Phase 5C - Payment Trust & Fee Transparency | Documented |
| UX-007 | SEV-2 / High | Support and reclamation flow is not defined | Users lack a recovery route after payment uncertainty | Phase 5E - Support & Receipt Proof | Open |
| UX-008 | SEV-2 / High | Surprise-fee risk can trigger chargebacks or complaints | Commercial and operational risk | Phase 5C - Payment Trust & Fee Transparency | Partial |
| UX-009 | SEV-2 / High | Payment method setup may cause abandonment | Users may stop before paying | Phase 5C - Payment Method Flow | Open |
| UX-010 | SEV-2 / High | Payment failure can lead to duplicate attempts | Double-payment and support risk | Phase 5D - Payment Recovery Paths | Open |
| UX-011 | SEV-3 / Medium | Add service flow lacks explicit stepper | Users may lose context in longer flows | Phase 5 - User Services Domain Hardening | Open |
| UX-012 | SEV-3 / Medium | Service list lacks search/other path | Catalog growth will be harder to navigate | Phase 5 - User Services Domain Hardening | Open |
| UX-013 | SEV-3 / Medium | History lacks filters | Payment/receipt review will become harder at scale | Phase 5E - Support & Receipt Proof | Open |
| UX-014 | SEV-3 / Medium | Microcopy is ambiguous in some financial moments | Users may not understand certainty, status, or next action | Phase 5C - Payment Trust & Fee Transparency | Partial |

## Phase 5C Follow-Up Items

- Approve final commercial fee model.
- Run legal/security review of trust and fee copy.
- Validate fee comprehension with users aged 30-65.
- Decide if future comparison against OXXO or physical payment options is useful.
- Replace mobile local mock fee source with backend fee source when mobile uses API payment flow.
| UX-015 | SEV-3 / Medium | Receipt download/share proof is not clear enough | Users may not know how to preserve or send proof | Phase 5E - Support & Receipt Proof | Open |
