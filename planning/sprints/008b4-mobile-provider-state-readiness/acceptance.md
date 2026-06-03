# Sprint 8B.4 - Acceptance Criteria

## Required

- `TEKAE_ENABLED` remains `false`.
- No Tekae HTTP calls are introduced.
- No Tekae endpoints or payload shapes are invented.
- `paymentStore.ts` remains unchanged.
- Mobile has internal provider states for disabled, unavailable, pending, timeout, failed, succeeded, and manual review.
- `fondixpay://provider/callback` routes to a safe placeholder screen.
- Demo payment methods are only available in dev/internal mode.
- When demo payments are disabled, payment UI shows unavailable/provider-preparation messaging instead of actionable payment controls.
- Support remains reachable from failure/recovery paths.
- TypeScript compiles with `npm run typecheck`.

## Evidence Required

- TypeScript validation output.
- Search evidence confirming no Tekae HTTP calls or enabled flag.
- Sprint record and harness documentation updated.

