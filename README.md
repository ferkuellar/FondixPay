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
npx expo start
```

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
