# Phase 6B Blueprint

## Backend
- Add `accounts` module with `Account`, `BalanceSnapshot`, and `Movement`.
- Create a demo account automatically for the authenticated user.
- Seed one demo credit movement and one balance snapshot for UX validation.
- Expose `GET /account`, `GET /account/balance`, and `GET /account/movements`.
- Emit central audit events for account creation, snapshot creation, movement creation, and balance view.

## Mobile
- Fetch account, balance, and movements with the existing authenticated API pattern.
- Keep data in Zustand memory state only.
- Show a balance card on Home and dedicated account/movement screens.
- Preserve explicit demo/no-real-money copy.
