# FONDIX PAY

FONDIX PAY es una app mobile-first para pagar servicios domesticos en Mexico de forma simple: abrir, ver lo pendiente, pagar y listo.

## Estado del proyecto

Este repositorio ya tiene una implementacion inicial mobile/backend y ahora queda alineado con la metodologia AXON-AI Architect / Builder.

Estado real: MVP mock/dev. El flujo actual no procesa dinero real, no integra proveedores reales de pago y no debe considerarse listo para produccion financiera.

Documentos principales:

- [AGENTS.md](AGENTS.md): instrucciones operativas para Builders.
- [planning/ROADMAP.md](planning/ROADMAP.md): fases oficiales del proyecto.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): arquitectura actual documentada.
- [docs/SECURITY.md](docs/SECURITY.md): riesgos y reglas de seguridad.
- [docs/TECHNICAL_HARDENING_AUDIT.md](docs/TECHNICAL_HARDENING_AUDIT.md): auditoria tecnica de Fase 2.

## Estructura 

```txt
fondix-pay/
  admin/
  mobile/
  backend/
  docs/
  docker-compose.yml
  README.md
  .env.example
```

## Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API local:

- `GET http://127.0.0.1:8000/health`
- Swagger: `http://127.0.0.1:8000/docs`

## Mobile

```powershell
cd mobile
npm install
npm start
```

La app Expo real vive en `mobile/`. No ejecutes `npx expo start` desde la raiz del repo. El script de inicio fija Metro en el puerto `8081`, por lo que Expo Go debe abrir la URL que imprima Metro, normalmente `exp://192.168.1.136:8081` en la red local actual.

Scripts seguros desde la raiz:

```powershell
npm run mobile:start
npm run mobile:doctor
npm run mobile:typecheck
```

## CRM Admin

La consola web interna vive en `admin/` y consume los endpoints backend `/admin/*` de Fase 10B.

```powershell
cd admin
npm install
npm run dev
```

El acceso admin actual usa token backend existente y un rol de desarrollo frontend claramente marcado cuando `VITE_ENABLE_ADMIN_DEV_AUTH=true`. No sustituye autenticacion admin endurecida ni habilita produccion.

## Docker

Desde la raiz del proyecto:

```powershell
docker compose up -d
```

## Flujo mock

1. Login con telefono.
2. OTP de desarrollo: `123456`.
3. Agrega un servicio como CFE, Telmex o Telcel.
4. Toca `Pagar ahora`.
5. Confirma el pago.
6. Se genera recibo e historial mock.

Advertencia: este flujo es solo para desarrollo y validacion de producto. No ejecuta pagos reales, no valida KYC, no concilia dinero, no genera recibos fiscales y no debe usarse con clientes finales.

## Payment Model

FondixPay is card-only for user-facing service payments.

Users pay with debit or credit card. Service payment execution is expected to use Prontipagos as the service payment aggregator. Prontipagos is separate from the future card processor unless a later contract/API decision explicitly says otherwise.

Current implementation remains mock/dev. No real card processing or real service-payment execution is enabled yet.

## Seguridad de autenticacion

- El OTP `123456` es solo para `development`/`test`.
- El backend solo devuelve `otp_dev` si `OTP_DEV_RESPONSE_ENABLED=true` y `APP_ENV` es `development` o `test`.
- En `staging`/`production`, `JWT_SECRET_KEY` debe ser fuerte y `OTP_DEV_RESPONSE_ENABLED` debe estar deshabilitado.
- `.env.example` contiene valores de ejemplo, no configuracion productiva.
- Ver [docs/SECURITY.md](docs/SECURITY.md) y [planning/sprints/004a-auth-session-security-p0/COMPLETION_REPORT.md](planning/sprints/004a-auth-session-security-p0/COMPLETION_REPORT.md).

Validaciones de auth:

```powershell
cd backend
python -m compileall app
python -m pytest
```

## Siguiente fase recomendada

Fase 4B - Backend Safety & Test Foundation: ordenar tests, errores, migraciones, health checks, logging y base de auditoria.

## Primer commit sugerido

```powershell
git add .
git commit -m "phase-4a: harden auth and session security baseline"
```
