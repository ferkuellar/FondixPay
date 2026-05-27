# WhatsApp Notification Backlog

| ID | Severidad | Area | Trabajo | Fase sugerida | Estado |
|---|---|---|---|---|---|
| WA-001 | SEV-1 | Consent | Onboarding consent screen for WhatsApp receipts | 10G | pending |
| WA-002 | SEV-1 | Preferences | Notification preferences model | 10G | proposed |
| WA-003 | SEV-1 | Provider | WhatsApp provider selection | before 10G runtime | pending |
| WA-004 | SEV-1 | Templates | Template approval for `fondix_pago_exitoso` | before 10G runtime | pending |
| WA-005 | SEV-1 | Delivery | Append-only delivery log model | 10G | proposed |
| WA-006 | SEV-1 | Delivery | Delivery idempotency key and duplicate blocking | 10G | proposed |
| WA-007 | SEV-1 | Template | Safe receipt payload/template | 10G | proposed |
| WA-008 | SEV-1 | Security | Webhook verification future | post-provider selection | pending |
| WA-009 | SEV-2 | Reliability | Retry policy with non-blocking payment behavior | 10G | proposed |
| WA-010 | SEV-2 | CRM | CRM visibility for notification attempts | 10G/11 | pending |
| WA-011 | SEV-1 | Testing | Consent, idempotency, privacy, failure tests | 10G | pending |
| WA-012 | SEV-1 | Privacy | Privacy review for phone hashing and payload minimization | before 10G runtime | pending |
| WA-013 | SEV-2 | Expansion | `fondix_pago_fallido` template | future after MVP | pending |
| WA-014 | SEV-2 | Expansion | `fondix_recordatorio_vencimiento` template | future after MVP | pending |
| WA-015 | SEV-2 | Expansion | `fondix_resumen_mensual` template | future after MVP | pending |
| WA-016 | SEV-1 | Auth | WhatsApp OTP login | separate future auth phase | pending |
