# Phase 10G Blueprint

Backend:

- Add `NotificationPreference` and `NotificationDelivery`.
- Add `backend/app/modules/notifications/providers/*` and `templates/whatsapp_templates.py`.
- Add `send_whatsapp_receipt(receipt_id, user_id, triggered_by)`.
- Add user routes under `/notification-preferences` and `/notifications`.
- Add admin routes under `/admin/notifications/deliveries`.

Mobile:

- Add profile switch for WhatsApp receipt consent.
- Add non-blocking PaymentSuccess copy.

Admin:

- Add notification delivery list route and sidebar item.

Security:

- No full phone in delivery responses or audit metadata.
- No PAN, CVV, card token, raw provider payload, secrets, or raw technical provider errors.
- Provider is mock/disabled by default.
