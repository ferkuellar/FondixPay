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

## Siguiente fase recomendada

Fase 2 - Technical Architecture Hardening: auditar backend, mobile, configuracion, seguridad, dependencias, manejo de errores, estado mobile, `.env.example`, Docker y pruebas iniciales sin agregar nuevas features.

## Primer commit sugerido

```powershell
git add .
git commit -m "phase-1: align existing fondixpay repo with axon-ai operating model"
```
