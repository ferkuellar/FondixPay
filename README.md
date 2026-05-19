# FONDIX PAY

FONDIX PAY es una app mobile-first para pagar servicios domesticos en Mexico de forma simple: abrir, ver lo pendiente, pagar y listo.

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

## Primer commit sugerido

```powershell
git add .
git commit -m "chore: bootstrap Fondix Pay mobile and backend"
```

