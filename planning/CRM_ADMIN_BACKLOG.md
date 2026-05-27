# CRM Admin Backlog

| ID | Severidad | Modulo | Trabajo | Fase sugerida | Estado |
|---|---|---|---|---|---|
| CRM-001 | SEV-1 | Architecture | CRM architecture | 10A | implemented |
| CRM-002 | SEV-1 | RBAC | RBAC matrix | 10A | implemented |
| CRM-003 | SEV-1 | Auth | Admin auth design | 10A/10B | partial: user-role JWT path implemented; full hardening pending |
| CRM-004 | SEV-1 | Backend | Admin backend APIs | 10B | implemented |
| CRM-005 | SEV-2 | Frontend | Admin frontend scaffold | 10C | implemented |
| CRM-006 | SEV-2 | Dashboard | Operational dashboard | 10C | implemented |
| CRM-007 | SEV-1 | Users | User search/detail | 10B/10C | implemented |
| CRM-008 | SEV-1 | Payments | Payment search/detail | 10B/10C | implemented |
| CRM-009 | SEV-1 | Receipts | Receipt search/detail | 10B/10C | implemented |
| CRM-010 | SEV-1 | Ledger | Ledger read-only view | 10B/10C | pending |
| CRM-011 | SEV-1 | Audit | Audit log viewer | 10B/10C | backend and frontend list implemented |
| CRM-012 | SEV-1 | Support | Support tickets | 10B/10D | implemented: linked entities, notes, close resolution required |
| CRM-013 | SEV-1 | Manual Review | Manual review queue | 10B/10D | implemented: event log, close resolution required, frontend update flow |
| CRM-014 | SEV-1 | Reconciliation | Card reconciliation view | 10B/10D | implemented as separated placeholder, production_ready=false |
| CRM-015 | SEV-1 | Reconciliation | Prontipagos reconciliation view | 10B/10D | implemented as separated placeholder, production_ready=false |
| CRM-016 | SEV-2 | Search | Provider reference search | 10D | partial implemented via `/admin/search` for IDs, correlation_id, provider_reference |
| CRM-017 | SEV-1 | Security | Safe data redaction | 10B | implemented |
| CRM-018 | SEV-1 | Audit | Admin action audit events | 10B | implemented for current routes |
| CRM-019 | SEV-1 | Testing | Permission tests | 10B | implemented |
| CRM-020 | SEV-2 | Security | Export controls | 10B/10D | pending |
| CRM-021 | SEV-1 | Auth | MFA future | before production | pending |
| CRM-022 | SEV-2 | Testing | Admin frontend runtime tests | 10D+ | pending after typecheck/build baseline |
| CRM-023 | SEV-1 | Operations | Support workflows | 10D | implemented for minimum ticket lifecycle |
| CRM-024 | SEV-1 | Operations | Manual review workflows | 10D | implemented for minimum investigation/resolution lifecycle |
| CRM-025 | SEV-1 | Operations | Runbooks for ambiguous states | 10D | implemented in docs |
| CRM-026 | SEV-1 | Reconciliation | Real card/Prontipagos reconciliation | 11+ | pending |
| CRM-027 | SEV-1 | Risk | Chargeback/fraud readiness | 11 | pending |
