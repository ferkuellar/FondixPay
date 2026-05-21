# Account and Balance Model

## Executive Summary
FondixPay must define accounts and balance semantics before any wallet or visible balance work. A simulated balance can help validate UX and ledger-derived movements, but it must never be presented as real money without ledger posting rules, custody/funding model, reconciliation, legal review, and provider decisions.

Phase 6A is design only. It does not implement a real wallet, real stored value, cash-in, cash-out, SPEI, CoDi, OXXO, Prontipagos, KYC, or mobile balance UI.

## Design Goals
- Prevent confusion between demo balance and real money.
- Derive balance from ledger facts rather than arbitrary editable fields.
- Prepare account and balance APIs for future mock implementation.
- Connect visible movements to ledger entries and payment events.
- Keep payment states, receipts, and account display consistent.
- Prepare support and operations for balance investigations.

## Non-Goals
- No wallet real.
- No dinero real.
- No funding or withdrawal rail.
- No SPEI, CoDi, OXXO, banks, or Prontipagos.
- No KYC or regulated-account claim.
- No UI implementation in this phase.

## Core Concepts
| Concept | Meaning |
|---|---|
| User Account | Product-level account owned by a user for account status and future balance UX. |
| Ledger Account | Accounting account that receives append-only ledger entries. |
| Balance Snapshot | Derived/cacheable balance view as of a timestamp. |
| Available Balance | Confirmed spendable amount under future approved rules. |
| Pending Balance | Amount awaiting confirmation and not spendable. |
| Held Balance | Amount retained/reserved and not spendable. |
| Simulated Balance | Demo balance for internal/mock UX validation only. |
| Real Balance | Future balance backed by approved legal, custody, provider, ledger, and reconciliation model. |
| Movement | User-facing representation of ledger/payment activity. |
| Statement | Future period view of movements and balances. |
| Account Status | Product control state for demo/active/restricted/suspended/closed. |
| Balance Source | Ledger-derived source or demo source marker. |
| Balance Timestamp | `as_of` time for a snapshot or calculation. |

## Account Types
- `user_operational_account`
- `fondix_fee_account`
- `provider_settlement_account` future
- `suspense_account` future
- `adjustment_account` future
- `demo_account`

## Account Status
| Status | Meaning |
|---|---|
| `demo` | Mock/internal account only; no real money claim. |
| `active` | Eligible for approved actions in the current environment. |
| `restricted` | Limited by risk, compliance, support, or operations rule. |
| `suspended` | Temporarily unavailable for balance-affecting actions. |
| `closed` | No new activity; history remains retained and auditable. |

Account status must never delete financial history.

## Balance Model
Proposed balance fields:
- `available_minor`
- `pending_minor`
- `held_minor`
- `simulated_minor`
- `currency`
- `as_of`
- `source`
- `is_real_money`
- `is_demo`

Rules:
- Available is derived from confirmed ledger entries minus approved holds.
- Pending is not available.
- Held is not available.
- Failed payment does not affect available.
- Reversed activity uses compensating ledger effects.
- Simulated balance is not real funds.
- Amounts use integer minor units and explicit currency, default `MXN`.

## Balance Calculation Rules
- Calculate by `account_id`.
- Partition by currency.
- Include only entry states accepted by the approved ledger posting rules.
- Pending payment intents affect pending display, not available.
- Failed payment attempts do not increase or reduce available balance.
- Holds reduce spendable availability without rewriting history.
- Reversals compensate previous entries.
- Fees are separate ledger/movement concepts.
- Provider settlement remains future.
- Rounding is not allowed; use integer minor units.

## User-Facing Balance Rules
### When to Show Balance
Show a balance only when the environment and feature flag make its meaning explicit. In Phase 6B, any user-facing balance must be demo/simulated.

### Required Demo Labels
- “Saldo demo”
- “Saldo simulado para pruebas”
- “No representa dinero real”

### Prohibited Claims Without Real Backing
- “Tu dinero”
- “Saldo disponible” without approved real-money context
- “Fondos protegidos”
- “Cuenta regulada”
- Any custody or settlement claim not implemented and approved

### Pending and Held
- Pending must explain that confirmation is not complete.
- Held must explain that the amount is reserved and not usable.
- Failed must not be shown as a balance deduction.

## Movement Model
Visible movement types:
- `service_payment`
- `fee_charge`
- `payment_reversal`
- `adjustment`
- `demo_credit`
- `demo_debit`
- `provider_settlement` future

Proposed fields:
- `id`
- `account_id`
- `ledger_entry_id`
- `type`
- `direction`
- `amount_minor`
- `currency`
- `description`
- `status`
- `created_at`
- `related_payment_id`
- `related_receipt_id`

## Relationship With Ledger
- Account metadata is not the balance source of truth.
- Ledger entries are the financial source of truth.
- Balance snapshot is a derived or cacheable view.
- Movement is the UX projection of ledger/payment events.
- PaymentIntent links payment state to future balance effects.
- User owns product account; ledger accounts represent accounting buckets.

## Demo Balance Strategy
- Demo balance is allowed only for internal/mock validation.
- It must use `is_demo=true`.
- It must be isolated from real balance and provider settlement.
- It must not imply custody or funds availability.
- Demo credits/debits should remain auditable in future implementation.

## Future Real Balance Strategy
Real balance is blocked until:
- KYC/AML decision.
- Legal and terms/privacy review.
- Custody/provider model.
- Ledger posting rules.
- Reconciliation.
- Audit logs.
- Support/admin tooling.
- Settlement and funding design.

## Account and Balance API Proposal
All endpoints are future/proposed.

| Endpoint | Purpose | Auth | Role | Audit | Demo/Production Note |
|---|---|---|---|---|---|
| `GET /account` | Return own account metadata | yes | USER owner | future account read policy | Demo account allowed |
| `GET /account/balance` | Return derived balance snapshot | yes | USER owner | `balance.viewed` | Must label demo |
| `GET /account/movements` | Return movement list | yes | USER owner | optional viewed event | Ledger-derived |
| `GET /account/statements` | Return statement periods | yes | USER owner | future | Future |
| `GET /account/status` | Return account status | yes | USER owner | future | Restricted/suspended copy needed |
| `POST /account/demo-credit` | Add demo credit | yes | internal/dev only | `demo_balance.credit_added` | Never production real money |
| `POST /account/hold` | Create hold | yes | SYSTEM/internal | `hold.created` | Future |
| `POST /account/release-hold` | Release hold | yes | SYSTEM/internal | `hold.released` | Future |

## Audit Events
- `account.created`
- `account.status_changed`
- `account.restricted`
- `account.suspended`
- `balance.viewed`
- `balance.snapshot_created`
- `movement.created`
- `demo_balance.credit_added`
- `demo_balance.debit_added`
- `hold.created`
- `hold.released`
- `hold.expired`
- `adjustment.created`

## Security and Compliance Notes
- User can read only own account/balance/movements.
- Balance endpoints must be protected and tested for user scope.
- Account status changes require audit events.
- Demo and real balance semantics must remain separated.
- Logs must avoid secrets and sensitive provider data.
- Admin/auditor access requires least privilege and reviewable reads.
- No regulated or custody claim before legal/provider approval.

## Production Gates
- Ledger implemented and posting rules approved.
- Audit implemented.
- Account model implemented.
- Balance calculation tested.
- No floats for money.
- User-scoped access tests.
- KYC/legal decision.
- Provider settlement decision.
- Reconciliation.
- Support/admin tooling.
- Clear UX labels.
- Terms/privacy review.
