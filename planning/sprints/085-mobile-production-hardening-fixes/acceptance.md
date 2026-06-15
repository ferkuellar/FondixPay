# Sprint 085 — Acceptance Criteria

1. `mexicoStates.ts` contiene las 32 entidades mexicanas con códigos `MX-*`.
2. Códigos existentes `MX-CHH`, `MX-COA`, `MX-NLE`, `MX-CMX`, `MX-JAL` siguen funcionando sin cambio.
3. `locationStateResolver.ts` resuelve las 32 entidades con nombres normales y variantes comunes.
4. Resolver devuelve `null` para ubicaciones no reconocibles; no lanza excepción.
5. `ProfileScreen` ya no muestra datos hardcodeados como datos reales del usuario.
6. `ProfileScreen` usa stores reales o muestra empty states honestos.
7. El selector interno de escenarios QA no aparece sin `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS=true`.
8. El selector demo solo aparece cuando el entorno local/QA habilita la flag explícitamente.
9. `apiRequest()` tiene timeout de 15 segundos con `AbortController`.
10. Una request colgada no deja loading infinito; muestra mensaje claro.
11. Respuesta 401 limpia sesión y regresa al estado no autenticado.
12. Login y OTP no quedan rotos por el manejo 401.
13. `npm --prefix mobile run typecheck` pasa con 0 errores.
14. `npm --prefix mobile run lint` pasa.
15. `planning/STATE.md` queda actualizado.
16. Decisiones registradas en `planning/DECISIONS.md`.
17. No se agregan secretos ni credenciales al repo.
18. No se toca Tekae runtime.
