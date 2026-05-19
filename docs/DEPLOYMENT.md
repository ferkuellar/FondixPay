# Deployment

## Current State

The project is local/dev only. It is not production ready.

## Backend Local

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Mobile Local

```powershell
cd mobile
npm install
npx expo start
```

## Docker Local

```powershell
docker compose up -d
```

## Environments Future

- local.
- dev.
- staging.
- production.

## Environment Variables

Current examples live in `.env.example`. Real secrets must not be committed.

Key current variables:

- `DATABASE_URL`.
- `JWT_SECRET_KEY`.
- `JWT_ALGORITHM`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`.
- `OTP_DEV_CODE`.
- `APP_ENV`.
- `CORS_ORIGINS`.
- `EXPO_PUBLIC_API_URL`.

## Pending

- Production secret management.
- CI/CD.
- Staging environment.
- Mobile build profiles.
- Android/iOS release process.
- Rollback plan.
