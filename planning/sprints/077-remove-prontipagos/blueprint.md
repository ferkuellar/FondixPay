# Sprint 077 — Blueprint de implementación

## Orden de ejecución

El orden importa: el orquestador depende del módulo; los schemas dependen del orquestador;
los tests dependen de todo lo anterior.

### Fase 1 — Backend: módulo prontipagos y config

1. **Eliminar** `backend/app/modules/providers/prontipagos/` (directorio completo)
2. **Editar** `backend/app/core/config.py`  
   Eliminar los 6 campos `prontipagos_*`
3. **Editar** `backend/.env.example`  
   Eliminar sección `# Prontipagos`

### Fase 2 — Backend: orquestador

4. **Editar** `backend/app/modules/payments/orchestrator.py`
   - Eliminar imports líneas 23–24
   - Renombrar param `prontipagos_scenario` → `service_scenario` en `process_sandbox_payment`
   - Reemplazar `ProntipagosSandboxAdapter` + `ServicePaymentRequest` por un dataclass/dict
     interno `_ServiceMockResponse` con la misma estructura que devuelve el adapter actual
   - Inline del mock: función `_mock_service_payment(scenario, ...)` que replica la lógica
     del `ProntipagosSandboxAdapter.execute_service_payment`
   - Renombrar audit events: `prontipagos.*` → `service_payment.*`
   - Renombrar `provider_name="prontipagos"` → `provider_name="service_mock"`

5. **Editar** `backend/app/modules/payments/schemas.py`
   - Eliminar import línea 8
   - Reemplazar `prontipagos_scenario: ProntipagosMockScenario` →
     `service_scenario: Literal["success","timeout","pending","failed","duplicate_blocked"] = "success"`

6. **Editar** `backend/app/modules/payments/routes.py`
   - Actualizar llamada `process_sandbox_payment(... prontipagos_scenario=...)` →
     `process_sandbox_payment(... service_scenario=...)`

### Fase 3 — Backend: admin

7. **Leer** `backend/app/modules/admin/routes.py`, `schemas.py`, `services.py`
   Identificar y eliminar endpoints/schemas/services de reconciliación de Prontipagos
8. **Editar** `backend/app/modules/admin/permissions.py`
   Eliminar `admin.reconciliation.prontipagos.*` de todos los roles

### Fase 4 — Tests

9. **Eliminar** `backend/tests/test_prontipagos_mock.py`
10. **Editar** `backend/tests/test_sandbox_payment_orchestration.py`
    Renombrar `prontipagos_scenario` → `service_scenario` en todos los calls
11. **Editar** `backend/tests/test_provider_error_mapping.py`
    Eliminar/actualizar sección de Prontipagos
12. **Editar** `backend/tests/test_admin_reconciliation_workflows.py`
    Eliminar sección de reconciliación de Prontipagos
13. **Revisar** `backend/tests/test_admin_rbac.py`
    Eliminar referencias al permiso `admin.reconciliation.prontipagos.view`
14. **Ejecutar** `pytest backend/` — debe pasar sin errores

### Fase 5 — CRM frontend

15. **Eliminar** `admin/src/pages/ProntipagosReconciliationPage.tsx`
16. **Editar** `admin/src/layout/Sidebar.tsx`
    Eliminar ítem `#/reconciliation/prontipagos`
17. **Editar** `admin/src/auth/permissions.ts`
    Eliminar `"admin.reconciliation.prontipagos.view"` del tipo `Permission`
18. **Editar** `admin/src/api/adminClient.ts`
    Eliminar función(es) de reconciliación de Prontipagos
19. **Editar** `admin/src/types/admin.ts`
    Eliminar tipos de Prontipagos
20. **Revisar** `admin/src/pages/DashboardPage.tsx` y `PaymentsPage.tsx`
    Eliminar referencias si las hay
21. **Revisar** `admin/src/crm/CrmVisualApp.tsx` si tiene import o route de Prontipagos
22. **Ejecutar** `npx tsc --noEmit` en `admin/` — debe pasar sin errores

### Fase 6 — Verificación final

23. `grep -ri "prontipagos" backend/app/` → 0 resultados
24. `grep -ri "prontipagos" admin/src/` → 0 resultados
25. Commit: `phase-077: remove prontipagos integration`

## Riesgo principal

El orquestador es el archivo más complejo (543 líneas). El mock de Prontipagos tiene 5 escenarios
(`success`, `timeout`, `pending`, `failed`, `duplicate_blocked`). Al inlinear la lógica, hay que
preservar todos esos escenarios exactamente para no romper los tests de orchestración.

La alternativa más segura es crear una función `_mock_service_payment(scenario)` dentro del mismo
`orchestrator.py` que devuelva un dataclass idéntico al que devuelve actualmente el adapter, y
sustituir la línea `service_response = prontipagos_adapter.execute_service_payment(...)` por
`service_response = _mock_service_payment(service_scenario, ...)`.
