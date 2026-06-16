# Sprint 087 — Tekae Mobile Session Launch

## Objective

Wire the mobile app to call `POST /api/payments/tekae/session` and open the returned `portalUrl` in an external browser. The user can reach and interact with the Tekae responsive payment portal from the FONDIXPAY mobile app.

This sprint is backend-agnostic: the backend endpoint is already live (Sprint 086). This sprint is mobile-only.

---

## Context

- Sprint 086 delivered `POST /api/payments/tekae/session` which returns `{ portalUrl, expiresIn: 1800, sessionRef }`.
- The Tekae portal runs in a browser/WebView. The mobile app does not handle any Tekae payment logic — it only launches the URL.
- `portalUrl` contains a 30-minute live access token embedded in the URL path. Must not be stored or logged.
- Generating the session and opening the portal is **not** payment success — it only means the user entered Tekae.
- `EXPO_PUBLIC_TEKAE_ENABLED` env var gates the feature on the mobile side.
- The existing `mobile/src/integrations/tekae/types.ts` contains stubs written before the API contract was confirmed. Some field names differ from the real backend contract — this sprint aligns them.

---

## In Scope

- `mobile/src/services/tekaeApi.ts` — `startTekaeSession()` function that calls the backend.
- Align `TekaeSessionResponse` in `mobile/src/integrations/tekae/types.ts` with actual backend contract (`portalUrl`, `expiresIn`, `sessionRef`).
- Update `mobile/src/integrations/tekae/constants.ts` — `TEKAE_ENABLED` driven by `EXPO_PUBLIC_TEKAE_ENABLED` env var (defaults to `false`).
- `mobile/src/screens/payments/TekaeSessionScreen.tsx` — full-screen flow: loading → browser launch → "en progreso" state → back.
- `expo-web-browser` for external browser launch (no in-app WebView).
- Add `TekaeSession` route to `RootStackParamList` with params `{ menu?: string; categoria?: string; carrier?: string; blockview?: boolean }`.
- Register route in navigator.
- Entry point: conditional "Pagar" button in `ServiceDetailScreen` shown only when `TEKAE_ENABLED=true` and the service has Tekae catalog params (`menu` or `categoria`).
- Error handling: 503 (disabled/unreachable), network timeout, browser cancel.
- Mobile `.env.example` — add `EXPO_PUBLIC_TEKAE_ENABLED=false`.

---

## Out of Scope

- No in-app WebView (Sprint 087 uses external browser only).
- No payment success detection (requires Q-006 webhook — future sprint).
- No receipt generation from Tekae session.
- No "payment pending" or "payment succeeded" state from Tekae.
- No production credentials or production environment wiring.
- No backend changes.
- No CRM/admin changes.
- No landing changes.
- No reconciliation.

---

## API contract consumed

```
POST /api/payments/tekae/session
Authorization: Bearer {FONDIXPAY_JWT}
Content-Type: application/json

Body (all optional):
{
  "menu":      "2",        // Tekae menu slot — "1" Tiempo Aire, "2" Servicios, "3" Entretenimiento
  "categoria": "electric", // Tekae categoria slug
  "carrier":   null,
  "blockview": false
}

Response 200:
{
  "portalUrl":  "https://responsive.../user/.../token/...",
  "expiresIn":  1800,
  "sessionRef": "uuid"
}

Response 503: { "detail": "Servicio de pago no disponible. Intenta más tarde." }
Response 401: session expired — redirect to login
```

---

## User-facing flow

1. User is on `ServiceDetailScreen` for a service with Tekae catalog params.
2. User taps "Pagar" (only visible when `TEKAE_ENABLED=true`).
3. App navigates to `TekaeSessionScreen`.
4. Screen shows loading indicator and copy: "Preparando tu sesión de pago...".
5. App calls `POST /api/payments/tekae/session`.
6. On success: `expo-web-browser` opens `portalUrl` in the device's default browser.
7. Screen transitions to "en progreso" state: "Completando tu pago en el navegador...".
8. User taps "Volver a FONDIXPAY" (or presses back).
9. App returns to `ServiceDetailScreen`.

**Error path (503 or network failure):**
- Screen shows error state with Spanish message.
- "Reintentar" button triggers the API call again.
- "Cancelar" navigates back.

---

## Security rules

- `portalUrl` is passed to `expo-web-browser` but never stored in state, AsyncStorage, or logs.
- `sessionRef` may be stored in memory only (for potential future audit correlation) — not in AsyncStorage.
- `TEKAE_BEARER`, `TEKAE_UID`, `TEKAE_PASSWORD` never reach the mobile app.
- If the 401 error occurs, the standard FONDIXPAY unauthorized handler redirects to login.
- `EXPO_PUBLIC_TEKAE_ENABLED=false` is the default — the feature is invisible to users unless explicitly enabled.

---

## Business rules

- Opening `portalUrl` is NOT payment success.
- Returning from the browser is NOT payment success.
- FONDIXPAY must NOT show a success screen or update account balance after this sprint.
- Payment outcomes require a separate confirmed Tekae evidence channel (future sprint).

---

## Environment

- Sandbox only: `EXPO_PUBLIC_TEKAE_ENABLED=true` points to sandbox backend with sandbox Tekae credentials.
- Production: blocked until Q-006 and production credentials are approved.
