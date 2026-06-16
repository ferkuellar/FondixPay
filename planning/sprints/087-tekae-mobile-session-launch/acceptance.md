# Sprint 087 — Acceptance Criteria

## API client

1. `startTekaeSession()` in `tekaeApi.ts` sends `POST /api/payments/tekae/session` with `Authorization: Bearer` header.
2. `startTekaeSession()` sends `{ menu, categoria, carrier, blockview }` as JSON body.
3. `startTekaeSession()` returns typed `TekaeSessionResponse` matching `{ portalUrl, expiresIn, sessionRef }`.
4. On 503 response, `startTekaeSession()` throws with the Spanish message from `detail`.
5. On 401 response, the existing FONDIXPAY `onUnauthorized` handler is triggered (via `apiRequest`).

## TekaeSessionScreen — loading state

6. Screen renders `ActivityIndicator` and copy "Preparando tu sesión de pago..." on mount.
7. `startTekaeSession()` is called automatically on mount — no extra button press required.

## TekaeSessionScreen — success state

8. On API success, `WebBrowser.openBrowserAsync(portalUrl)` is called with the exact `portalUrl` from the response.
9. Screen transitions to "en progreso" state after browser is opened.
10. `portalUrl` is not stored in React state, AsyncStorage, or logs — used once and discarded.
11. `sessionRef` may be held in memory but is not persisted to AsyncStorage.
12. "Volver a FONDIXPAY" button navigates back to the previous screen.

## TekaeSessionScreen — error state

13. On API error (503 or network), screen renders the error message and a "Reintentar" button.
14. "Reintentar" re-triggers `startTekaeSession()` with the same params.
15. "Cancelar" navigates back to the previous screen.

## Feature flag

16. `TEKAE_ENABLED` is `true` only when `EXPO_PUBLIC_TEKAE_ENABLED=true` is set in the environment.
17. `TEKAE_ENABLED` defaults to `false` — the feature is invisible to users without the env var.
18. `mobile/.env.example` contains `EXPO_PUBLIC_TEKAE_ENABLED=false`.

## Entry point

19. "Pagar con Tekae (sandbox)" button appears in `ServiceDetailScreen` only when `TEKAE_ENABLED=true` AND `service.menu` or `service.categoria` is non-null.
20. Button is not visible when `TEKAE_ENABLED=false`, regardless of service data.
21. Existing "Simular pago" button is not removed or modified.
22. Tapping the button navigates to `TekaeSession` route with correct params.

## Navigation

23. `TekaeSession` is added to `RootStackParamList` with params `{ menu?, categoria?, carrier?, blockview? }`.
24. `TekaeSession` screen is registered in the navigator.

## Types

25. `TekaeSessionResponse` in `types.ts` matches `{ portalUrl: string; expiresIn: number; sessionRef: string }`.
26. `TekaeSessionRequest` in `types.ts` matches `{ menu?, categoria?, carrier?, blockview? }`.
27. Legacy stub fields (`session_id`, `launch_url`, `expires_at`, `launch_mode`, `status`) are removed from `TekaeSessionResponse`.

## Business rules

28. No success screen, balance update, or receipt is generated as a result of this sprint.
29. Returning from the browser does NOT trigger any payment state update in FONDIXPAY.
30. Copy never implies payment is complete: "Completando tu pago en el navegador" is the strongest claim shown.

## Code quality

31. `npm --prefix mobile run typecheck` passes with 0 errors.
32. No credentials, tokens, or `portalUrl` values appear in any committed file.
33. `expo-web-browser` is present in `mobile/package.json` (install if missing).

## Scope

34. No backend changes.
35. No CRM/admin changes.
36. No receipt generation.
37. No payment success detection.
38. No in-app WebView (external browser only).
