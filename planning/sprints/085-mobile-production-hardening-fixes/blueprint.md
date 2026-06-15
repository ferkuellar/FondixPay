# Sprint 085 — Blueprint

## Cambios de implementación

### F-01 + F-06 — Estados mexicanos completos

`mobile/src/constants/mexicoStates.ts`:
- Expandir `MexicoStateCode` union type a 32 entidades.
- Expandir `MEXICO_STATE_OPTIONS` a 32 entries.
- Mantener compatibilidad con códigos existentes: MX-CHH, MX-COA, MX-NLE, MX-CMX, MX-JAL.
- `DEFAULT_MEXICO_STATE_CODE` permanece MX-CHH.

`mobile/src/utils/locationStateResolver.ts`:
- Expandir `STATE_ALIASES` a 32 entradas (una por estado).
- Incluir variantes con y sin acentos, abreviaturas comunes, nombres alternativos.
- La función `normalizeStateName` ya es correcta (NFD + diacríticos).

### F-03 — ProfileScreen con datos reales

`mobile/src/screens/profile/ProfileScreen.tsx`:
- Eliminar local `type PaymentMethod`, `type SavedService`.
- Eliminar arrays hardcodeados `paymentMethods[]` y `savedServices[]`.
- Conectar a `usePaymentMethodStore` (métodos de pago reales).
- Conectar a `useServiceStore` (servicios guardados reales).
- Mostrar empty states honestos si no hay datos.
- Agregar navegación funcional a ServiceDetail y AddPaymentMethodMock.

### F-02 — Gate sobre selector QA

`mobile/src/config/environment.ts` (nuevo):
- Helper `isQaScenariosEnabled()` que retorna `true` solo si `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS === 'true'`.
- Default seguro: sin la variable, retorna `false`.

`mobile/src/screens/payments/ConfirmPaymentScreen.tsx`:
- Agregar `&& isQaScenariosEnabled()` al gate del selector de escenarios.

### F-05 — API timeout

`mobile/src/services/api.ts`:
- Constante `DEFAULT_API_TIMEOUT_MS = 15_000`.
- `AbortController` + `setTimeout` en `apiRequest()`.
- Error `AbortError` mapeado a mensaje claro en español.
- `clearTimeout` en bloque `finally`.

### F-04 — Manejo 401 central

`mobile/src/services/api.ts`:
- Módulo-level `onUnauthorized: (() => void) | null`.
- Export `setUnauthorizedHandler(handler)`.
- En `apiRequest`, si `response.status === 401`, llamar `onUnauthorized?.()` y lanzar error claro.

`mobile/src/navigation/AppNavigator.tsx`:
- `useEffect` que registra el handler con `setUnauthorizedHandler(() => useAuthStore.getState().signOut())`.
- Cleanup: `setUnauthorizedHandler(null)` on unmount.

### Documentación

- `mobile/.env.example` — documentar `EXPO_PUBLIC_APP_ENV` y `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS`.
- `planning/STATE.md` — Sprint 085 entry.
- `planning/DECISIONS.md` — ADR-186 a ADR-190.
- `planning/RISKS.md` — riesgos residuales Sprint 085.
