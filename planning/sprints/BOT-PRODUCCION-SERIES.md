# Serie: Bot de Landing → Producción

## Estado actual (post Sprint 053)
- `POST /admin/chat/test` → Claude API ✓ (solo admin)
- `POST /chat` (público) → respuesta basada en reglas, sin Claude
- Landing → HTML estático, sin widget
- Admin BotLandingView → edita config, NO la persiste

## Objetivo de la serie
Bot de Claude activo en la landing, configurable desde el CRM admin, listo para tráfico real.

---

## Sprints

### 054 — AI en endpoint público
**Archivo:** `054-chatbot-ai-public-endpoint/requirements.md`
**Qué entrega:** `POST /chat` responde con Claude. Si hay FAQ/intent match, lo usa (más rápido). Si no, Claude genera la respuesta con el system prompt configurado.
**Backend only.** Sin cambios en frontend ni landing.
**Duración estimada:** 1 día

### 055 — Endpoint GET /chat/config
**Archivo:** `055-chatbot-public-config-endpoint/requirements.md`
**Qué entrega:** Endpoint público que devuelve identidad del bot (name, greeting, pills). El widget lo consume para no hardcodear nada.
**Backend only.**
**Duración estimada:** medio día

### 056 — Widget para landing
**Archivo:** `056-landing-bot-widget/requirements.md`
**Qué entrega:** `bot-widget.js` + `bot-widget.css` incrustados en landing/index.html. Chat funcional con Claude, pills, typing indicator, manejo de errores, responsive.
**Landing JS only.** Sin framework.
**Duración estimada:** 1-2 días
**Requiere:** 054 + 055

### 057 — Persistencia admin
**Archivo:** `057-bot-config-persistence/requirements.md`
**Qué entrega:** BotLandingView carga settings desde DB al abrir, y guarda al hacer click. El admin puede cambiar el system prompt, identidad y pills desde el CRM y los cambios se reflejan en la landing.
**Admin frontend only.**
**Duración estimada:** 1 día
**Requiere:** 055

### 058 — Hardening producción
**Archivo:** `058-bot-production-hardening/requirements.md`
**Qué entrega:** CORS para dominio real, rate limiting por IP, degradación elegante, health endpoint, headers de seguridad. El bot está listo para tráfico público.
**Backend + infra.**
**Duración estimada:** 1 día
**Requiere:** 054-057

---

## Dependencias entre sprints

```
053 (hecho) ──► 054 ──► 056 ──► [landing live]
                    └──► 055 ──► 056
                              └──► 057
                                    └──► 058 ──► [producción]
```

054 y 055 son independientes entre sí — pueden hacerse en paralelo.
056 bloquea en 054 y 055.
057 bloquea en 055.
058 es el último, requiere todo.

---

## Secuencia recomendada (paralelo donde sea posible)

**Día 1:** Sprint 054 + Sprint 055 (en paralelo — ambos solo backend)
**Día 2:** Sprint 056 (widget) + Sprint 057 (admin persistence)
**Día 3:** Sprint 058 (hardening) + QA end-to-end
**Día 4:** Deploy a producción

---

## Checklist de lanzamiento (post 058)
- [ ] `CHATBOT_AI_API_KEY` configurada en servidor de producción
- [ ] `CHATBOT_AI_MODEL=claude-haiku-4-5-20251001` configurado
- [ ] `ALLOWED_ORIGINS` incluye `https://fondixpay.com`
- [ ] `FONDIX_BOT_BASE` en `bot-widget.js` apunta a URL de producción
- [ ] `GET /chat/health` retorna `{"status": "ok", "ai_configured": true}`
- [ ] Test manual: abrir landing, enviar pregunta, recibir respuesta de Claude
- [ ] Admin: cambiar system prompt, verificar que el bot responde diferente
- [ ] Rate limit verificado: 31 mensajes seguidos retorna 429
- [ ] Mobile verificado: chat funciona en iPhone/Android

---

## Qué NO está en esta serie (fuera de alcance)
- Autenticación de usuarios en el chat (no hay login en landing)
- Historial persistente entre sesiones (sessionStorage, no BD a largo plazo)
- Notificaciones push cuando el admin responde
- Integración con WhatsApp/Telegram
- Análisis de sentiment avanzado
- A/B testing de prompts
