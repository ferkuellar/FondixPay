# Sprint 005D - Card Payment Method Strategy Requirements

## Goal

Define the card-only user payment strategy before real payments and remove the risk of phantom cards in the current UI.

## In Scope

- Document the card-only user payment decision for Mexico.
- Separate future card processor from Prontipagos service-payment execution.
- Define UX flows.
- Define security rules.
- Define audit events.
- Define proposed data model and future APIs.
- Update AXON-AI planning docs.
- Relabel current mobile method as mock/dev if needed.

## Out Of Scope

- Real provider integration.
- Card tokenization implementation.
- SPEI/CoDi/OXXO/cash-in as user-facing payment methods.
- Prontipagos integration.
- Storing PAN/CVV.
- Real money movement.
- Full payment recovery implementation.
