# Sprint 085 — Mobile Production Hardening Fixes

## Objetivo

Corregir los hallazgos SEV-2/SEV-3 del Sprint 084 que bloquean producción sin requerir información externa ni tocar Tekae runtime.

## Hallazgos a corregir

- F-01: `mexicoStates.ts` solo tenía 5 estados. Expandir a las 32 entidades mexicanas.
- F-06: `locationStateResolver.ts` solo resolvía 5 estados. Expandir aliases para las 32 entidades.
- F-03: `ProfileScreen.tsx` mostraba datos hardcodeados. Conectar a stores reales.
- F-02: `ConfirmPaymentScreen` exponía selector de escenarios QA al usuario final. Proteger con gate de entorno.
- F-05: `apiRequest()` no tenía timeout. Agregar `AbortController` de 15 segundos.
- F-04: Sin manejo central de 401. Agregar handler que limpia sesión y regresa al login.

## Out of scope

- Notificaciones locales (Sprint 078/086).
- Tekae session launcher (Sprint 088).
- Flujo automático de ubicación (Sprint 086).
- Apple Privacy Manifest (Sprint 090).
- Suite completa de tests (Sprint 089).
- Persistencia real de stores.
- Métodos de pago reales.
