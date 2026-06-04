# Transaction States

Status: Sprint 010 documentation baseline. No runtime state machine is implemented by this document.

## State Boundary

FONDIXPAY internal states and Tekae provider states are separate.

FONDIXPAY must not mark a payment, receipt, or service transaction successful only because:

- A Tekae SSO token was generated.
- A Tekae launch URL was returned.
- The mobile app opened Tekae.
- A user returned from Tekae.

Payment success requires confirmed Tekae evidence through an approved provider channel that is not yet documented.

## Tekae Session States

These states describe FONDIXPAY's internal launch-session lifecycle, not final payment status.

| State | Meaning | User-facing implication |
|---|---|---|
| `TEKAE_SESSION_REQUESTED` | Authenticated user requested a Tekae launch session. | Preparing provider experience. |
| `TEKAE_TOKEN_REQUESTED` | Backend is requesting Tekae token/session generation. | Preparing provider experience. |
| `TEKAE_TOKEN_READY` | Backend generated a launch payload for mobile. | User may open Tekae. |
| `TEKAE_LAUNCHED` | Mobile opened the Tekae URL. | Provider experience started, payment not confirmed. |
| `TEKAE_EXPIRED` | Token or launch session expired before usable confirmation. | User must retry session creation. |
| `TEKAE_LAUNCH_FAILED` | Backend or mobile could not prepare/open Tekae. | Show safe retry/support copy. |
| `TEKAE_OUTCOME_UNKNOWN` | User launched Tekae but FONDIXPAY has no confirmed outcome evidence. | Pending/manual review if payment intent exists. |

## FONDIXPAY Payment States

These states are internal payment/user-facing states. They must not be collapsed into Tekae session states.

| State | Meaning |
|---|---|
| `PAYMENT_NOT_STARTED` | No payment attempt has begun. |
| `PAYMENT_SESSION_PREPARED` | Tekae launch session exists, but no provider result is known. |
| `PAYMENT_PENDING_PROVIDER` | Provider outcome is not yet confirmed. |
| `PAYMENT_SUCCEEDED_CONFIRMED` | Provider evidence confirms success through an approved channel. |
| `PAYMENT_FAILED_CONFIRMED` | Provider evidence confirms failure or rejection. |
| `PAYMENT_OUTCOME_UNKNOWN` | Provider result cannot be confirmed. |
| `PAYMENT_MANUAL_REVIEW_REQUIRED` | Support/operations must review ambiguous evidence. |
| `PAYMENT_EXPIRED` | Session or intent expired before confirmation. |

## Receipt States

Receipt and payment states are also separate.

| State | Meaning |
|---|---|
| `RECEIPT_NOT_AVAILABLE` | No receipt evidence exists. |
| `RECEIPT_PENDING_PROVIDER` | Provider result or receipt evidence is pending. |
| `RECEIPT_GENERATED` | Receipt/proof is generated from approved evidence. |
| `RECEIPT_UNAVAILABLE` | Payment may need support because receipt evidence is unavailable. |
| `RECEIPT_MANUAL_REVIEW_REQUIRED` | Operator review is required before user-facing certainty. |

## Manual Review Triggers

Manual review is required when:

- Tekae was launched but outcome is unknown.
- Tekae result conflicts with FONDIXPAY internal state.
- Receipt evidence is missing after a possible provider success.
- Duplicate launch/payment attempts are suspected.
- Amount, service, user, or provider references do not match.
- Provider timeout or connectivity interruption creates uncertainty.

## User-Facing Rules

- Do not show "pagado" from Tekae launch alone.
- Do not expose raw Tekae status codes or provider errors.
- Use pending/uncertain copy until provider evidence is confirmed.
- Give users a safe support path for unknown outcomes.
- Do not present FONDIXPAY as the processor or financial source of truth.
