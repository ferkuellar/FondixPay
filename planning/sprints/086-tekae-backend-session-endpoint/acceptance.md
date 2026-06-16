# Sprint 086 — Acceptance Criteria

## Endpoint

1. `POST /api/payments/tekae/session` exists and is registered in the FastAPI app.
2. Unauthenticated request returns 401.
3. Request with valid FONDIXPAY JWT and `TEKAE_ENABLED=false` returns 503 with safe Spanish message.
4. Request with valid JWT and `TEKAE_ENABLED=true` (mocked Tekae client) returns 200 with `portalUrl`, `expiresIn`, and `sessionRef`.
5. `portalUrl` contains `TEKAE_RESPONSIVE_BASE_URL`, `TEKAE_PORTAL_UID`, and the mocked `accessToken`.
6. `expiresIn` is 1800.
7. `sessionRef` is a valid UUID.

## Security

8. `accessToken` does not appear in any log line, audit event, or response field other than embedded in `portalUrl`.
9. `TEKAE_BEARER`, `TEKAE_UID`, `TEKAE_PASSWORD`, and `TEKAE_PORTAL_UID` are never hardcoded; only read from `TekaeConfig`.
10. If `TEKAE_BEARER`, `TEKAE_UID`, `TEKAE_PASSWORD`, or `TEKAE_PORTAL_UID` is empty when `TEKAE_ENABLED=true`, startup validation raises a `RuntimeError`.
11. `refreshToken` from Tekae is discarded and not stored or returned.

## Audit

12. A `tekae.session.requested` audit event is written at start of each call.
13. A `tekae.session.created` audit event is written on success. Contains `session_ref`, no token.
14. A `tekae.session.failed` audit event is written when Tekae returns an error. Contains `session_ref`, no raw Tekae error body.

## Tekae Client

15. `cipher_data()` sends `Authorization: Bearer {TEKAE_BEARER}` header.
16. `cipher_data()` sends correct body: `UserCustomer`, `uid`, `password`, `redirect`, `menu`, `categoria`, `carrier`, `blockview`.
17. `generate_token_ciphered()` sends correct body: `uid`, `data`.
18. Both functions raise `TekaeClientError` on non-201 response.

## Tests

19. All 7 test cases pass (disabled, unauthenticated, success, cipher_error, token_error, audit_success, audit_failure).
20. Tests use mocked Tekae HTTP client — no real Tekae API calls in test suite.
21. `pytest backend/tests/test_tekae_session.py` passes with 0 failures.

## Code Quality

22. `npm --prefix mobile run typecheck` passes (mobile unchanged).
23. `cd backend && python -m pytest` passes (all existing tests still green).
24. No credentials or tokens committed to repo.
25. No new files added to `.gitignore` bypass.

## Scope

26. No mobile code changed.
27. No webhook endpoint created.
28. No payment success detection implemented.
29. No database migration added.
30. `TEKAE_ENABLED=false` in `.env.example` (unchanged).
