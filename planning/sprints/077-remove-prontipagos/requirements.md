# Sprint 077 — Remove Prontipagos Integration

**Status:** READY  
**Type:** Cleanup / Dead code removal  
**Approved by:** Fernando Cuellar (2026-06-14)

## Contexto

Prontipagos fue el primer proveedor de pago de servicios evaluado. Se integró como sandbox mock
para pruebas del flujo de pagos en sprints 008a–008c. La decisión de negocio es **no usar
Prontipagos**; el proveedor de servicios de pago será definido en un sprint futuro.

El código y los datos de `prontipagos` siguen activos en el orquestador, la API de sandbox, el
CRM y la configuración del backend. Esto genera ruido en la codebase y expone en el CRM un módulo
de reconciliación sin funcionalidad real.

## Objetivo

Eliminar todo el código vivo de Prontipagos manteniendo la arquitectura del flujo de pagos intacta:
el orquestador debe seguir funcionando con el mock genérico, la ruta `/payments/sandbox` debe
permanecer pero sin el `prontipagos_scenario` param, y el CRM no debe mostrar la pantalla de
reconciliación de Prontipagos.

Los documentos históricos de planning (`PRONTIPAGOS_BACKLOG.md`, sprints 008a–008c,
`docs/PRONTIPAGOS_*.md`) **no se eliminan** — son registro de decisiones.

## Alcance

### Eliminar completamente

| Ruta | Descripción |
|------|-------------|
| `backend/app/modules/providers/prontipagos/` | Módulo completo (6 archivos) |
| `backend/tests/test_prontipagos_mock.py` | Test unitario del mock |
| `admin/src/pages/ProntipagosReconciliationPage.tsx` | Pantalla CRM |

### Modificar

**`backend/app/modules/payments/orchestrator.py`**
- Eliminar imports de `ProntipagosSandboxAdapter` y `ProntipagosMockScenario`
- Reemplazar la llamada al adapter de Prontipagos por un mock genérico inline
  (`service_provider_mock`) que replique el comportamiento actual del `ProntipagosSandboxAdapter`
  con `scenario="success"` como único path activo en sandbox
- Renombrar `prontipagos_scenario` → `service_scenario` en la firma de `process_sandbox_payment`
- Renombrar eventos de audit `prontipagos.*` → `service_payment.*`

**`backend/app/modules/payments/schemas.py`**
- Eliminar import de `ProntipagosMockScenario`
- Renombrar campo `prontipagos_scenario` → `service_scenario` en `SandboxPaymentCreate`
  con tipo `Literal["success", "timeout", "pending", "failed", "duplicate_blocked"]`

**`backend/app/modules/payments/routes.py`**
- Actualizar llamada a `process_sandbox_payment` para usar `service_scenario` en lugar de
  `prontipagos_scenario`

**`backend/app/core/config.py`**
- Eliminar campos `prontipagos_env`, `prontipagos_api_base_url`, `prontipagos_client_id`,
  `prontipagos_client_secret`, `prontipagos_timeout_seconds`, `prontipagos_enable_sandbox_mock`

**`backend/app/modules/admin/permissions.py`**
- Eliminar permisos `admin.reconciliation.prontipagos.*` de todos los roles

**`backend/app/modules/admin/routes.py`** *(si aplica)*
- Eliminar endpoint(s) de reconciliación de Prontipagos

**`backend/app/modules/admin/schemas.py`** *(si aplica)*
- Eliminar schemas de reconciliación de Prontipagos

**`backend/app/modules/admin/services.py`** *(si aplica)*
- Eliminar servicios de reconciliación de Prontipagos

**`admin/src/layout/Sidebar.tsx`**
- Eliminar ítem `#/reconciliation/prontipagos`

**`admin/src/auth/permissions.ts`**
- Eliminar `admin.reconciliation.prontipagos.view` del tipo `Permission`

**`admin/src/api/adminClient.ts`**
- Eliminar función(es) de llamada a endpoints de reconciliación de Prontipagos

**`admin/src/types/admin.ts`**
- Eliminar tipos relacionados con Prontipagos

**`admin/src/pages/DashboardPage.tsx`** y **`admin/src/pages/PaymentsPage.tsx`**
- Eliminar referencias a Prontipagos en datos mostrados (si usan `prontipagos_scenario`)

**`backend/tests/test_sandbox_payment_orchestration.py`**
- Actualizar los tests para usar `service_scenario` en lugar de `prontipagos_scenario`

**`backend/tests/test_provider_error_mapping.py`**
- Eliminar / actualizar referencias a Prontipagos

**`backend/tests/test_admin_reconciliation_workflows.py`**
- Eliminar / actualizar sección de reconciliación de Prontipagos

**`backend/.env.example`**
- Eliminar sección `# Prontipagos` y variables `PRONTIPAGOS_*`

## Restricciones

- No eliminar documentos de planning/docs históricos (`PRONTIPAGOS_BACKLOG.md`,
  `docs/PRONTIPAGOS_*.md`, sprints 008*)
- El flujo de pagos sandbox debe seguir pasando todos los tests existentes al final del sprint
- No introducir ningún nuevo proveedor de servicios en este sprint
- `service_scenario="success"` es el único escenario necesario para el sandbox activo;
  los demás (`timeout`, `pending`, `failed`) deben quedar soportados en el mock genérico
  por si tests específicos los usan
- Los audit events renombrados (`service_payment.*`) deben mantener la misma estructura de metadata

## Criterios de aceptación

- [ ] `backend/app/modules/providers/prontipagos/` no existe
- [ ] `backend/app/core/config.py` no tiene campos `prontipagos_*`
- [ ] `backend/app/modules/payments/schemas.py` no importa de `prontipagos`
- [ ] `backend/app/modules/payments/orchestrator.py` no importa de `prontipagos`
- [ ] `pytest backend/` pasa sin errores
- [ ] CRM sidebar no muestra "Conciliacion Prontipagos"
- [ ] `npx tsc --noEmit` en `admin/` pasa sin errores
- [ ] `grep -ri "prontipagos" backend/app/` retorna 0 resultados (código vivo)
- [ ] `grep -ri "prontipagos" admin/src/` retorna 0 resultados

## Archivos NO tocados (fuera de scope)

- `planning/` — todos los docs de sprint históricos
- `docs/PRONTIPAGOS_*.md` — referencia de arquitectura histórica
- `planning/PRONTIPAGOS_BACKLOG.md`
- `backend/tests/test_admin_rbac.py` — revisar; si solo menciona permisos eliminados, actualizar
- Cualquier archivo en `infra/`

## Commit target

`phase-077: remove prontipagos integration`
