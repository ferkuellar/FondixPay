# Sprint 004A - Auth & Session Security P0 Blueprint

## Backend

1. Extend `Settings` with `APP_ENV`, `OTP_DEV_RESPONSE_ENABLED`, and environment helpers.
2. Validate production-like environments:
   - strong `JWT_SECRET_KEY`
   - disabled OTP dev response
   - explicit CORS origins
3. Change OTP request response:
   - always return `message`
   - always return `expires_in_seconds`
   - return `otp_dev` only in development/test when enabled
4. Keep access-token-only lifecycle for now.
5. Return clean auth errors for invalid JWTs.

## Mobile

1. Make OTP request response typing accept missing `otp_dev`.
2. Keep manual OTP input flow unchanged.
3. Preserve Secure Store usage for the access token only.

## Tests

Add backend tests for:

- dev OTP response allowed
- production-like OTP response hidden
- weak JWT secret rejected
- enabled dev OTP response rejected in production
- invalid `/auth/me` token rejected
- valid `/auth/me` token accepted
- incorrect OTP rejected

## Documentation

Update STATE, DECISIONS, RISKS, SECURITY, API, AUDIT, README, and this sprint folder.
