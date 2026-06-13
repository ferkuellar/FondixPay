"""
Demo seed script — populate the DB with realistic Mexican data for dashboard demos.
Run inside the Docker backend container:
  docker compose exec backend python seed_demo.py
"""

import uuid
from datetime import datetime, timedelta
from app.core.database import get_db
from sqlalchemy import text

db = next(get_db())

NOW = datetime.utcnow()

def ts(days_ago=0, hours_ago=0):
    return NOW - timedelta(days=days_ago, hours=hours_ago)

# ─────────────────────────────────────────────────────────────────────────────
# 0. Guard: skip if already seeded
# ─────────────────────────────────────────────────────────────────────────────
existing = db.execute(text("SELECT COUNT(*) FROM payments")).scalar()
if existing > 0:
    print(f"[seed] DB already has {existing} payments. Skipping.")
    exit(0)

# ─────────────────────────────────────────────────────────────────────────────
# 1. Service providers
# ─────────────────────────────────────────────────────────────────────────────
providers = [
    ("telmex", "Telmex", "telecomunicaciones", "telmex", "MOCK", True, 1),
    ("totalplay", "Totalplay", "telecomunicaciones", "totalplay", "MOCK", True, 2),
    ("cfe", "CFE", "electricidad", "cfe", "MOCK", True, 3),
    ("izzi", "Izzi", "telecomunicaciones", "izzi", "MOCK", True, 4),
    ("telcel", "Telcel", "telefonia", "telcel", "MOCK", True, 5),
    ("att", "AT&T", "telefonia", "att", "MOCK", True, 6),
]
provider_ids = {}
for name, display_name, category, icon_key, integration_type, is_active, sort_order in providers:
    pid = db.execute(text("""
        INSERT INTO service_providers (name, display_name, category, icon_key, integration_type, is_active, sort_order, created_at, updated_at)
        VALUES (:name, :dn, :cat, :icon, :itype, :active, :sort, NOW(), NOW())
        ON CONFLICT DO NOTHING
        RETURNING id
    """), dict(name=name, dn=display_name, cat=category, icon=icon_key, itype=integration_type, active=is_active, sort=sort_order)).scalar()
    if pid:
        provider_ids[name] = pid
        print(f"[seed] provider '{name}' id={pid}")

db.commit()

# Re-fetch ids in case of conflicts
rows = db.execute(text("SELECT id, name FROM service_providers")).fetchall()
provider_ids = {r.name: r.id for r in rows}

# ─────────────────────────────────────────────────────────────────────────────
# 2. Users (15 realistic Mexican users)
# ─────────────────────────────────────────────────────────────────────────────
users_data = [
    ("+5215511001001", "María García López", "USER"),
    ("+5215511001002", "Juan Hernández Martínez", "USER"),
    ("+5215511001003", "Ana Rodríguez Pérez", "USER"),
    ("+5215511001004", "Carlos López Sánchez", "USER"),
    ("+5215511001005", "Sofía González Ramírez", "USER"),
    ("+5215511001006", "Diego Martínez Torres", "USER"),
    ("+5215511001007", "Valentina Sánchez Flores", "USER"),
    ("+5215511001008", "Miguel Rodríguez Cruz", "USER"),
    ("+5215511001009", "Isabella López García", "USER"),
    ("+5215511001010", "Alejandro Hernández Morales", "USER"),
    ("+5215511001011", "Camila González Jiménez", "USER"),
    ("+5215511001012", "Sebastián Martínez Ruiz", "USER"),
    ("+5215511001013", "Lucía Sánchez Mendoza", "USER"),
    ("+5215511001014", "Mateo López Vargas", "USER"),
    ("+5215511001015", "Gabriela Rodríguez Ortega", "USER"),
]

user_ids = []
for phone, name, role in users_data:
    uid = db.execute(text("""
        INSERT INTO users (phone, name, role, is_active, created_at)
        VALUES (:phone, :name, :role, TRUE, :created_at)
        ON CONFLICT DO NOTHING
        RETURNING id
    """), dict(phone=phone, name=name, role=role, created_at=ts(days_ago=30))).scalar()
    if uid:
        user_ids.append(uid)
        print(f"[seed] user '{name}' id={uid}")

db.commit()

# Re-fetch in case of conflicts
rows = db.execute(text("SELECT id FROM users WHERE role != 'SUPER_ADMIN' ORDER BY id")).fetchall()
user_ids = [r.id for r in rows]
print(f"[seed] {len(user_ids)} non-admin users ready")

# ─────────────────────────────────────────────────────────────────────────────
# 3. User services (1-2 per user)
# ─────────────────────────────────────────────────────────────────────────────
provider_list = list(provider_ids.values())
user_service_ids = []
assignments = [
    # (user_index, provider_name, alias, reference, amount_due, days_ago)
    (0, "telmex", "Internet Casa", "TEL-001-001", 599.00, 25),
    (1, "cfe", "Luz Hogar", "CFE-002-001", 450.50, 20),
    (2, "totalplay", "Internet + TV", "TOT-003-001", 799.00, 22),
    (3, "telcel", "Línea Móvil", "TLC-004-001", 250.00, 18),
    (4, "izzi", "Cable + Internet", "IZZ-005-001", 649.00, 28),
    (5, "att", "Plan Móvil", "ATT-006-001", 320.00, 15),
    (6, "telmex", "Internet Oficina", "TEL-007-001", 899.00, 12),
    (7, "cfe", "Luz Oficina", "CFE-008-001", 1200.00, 10),
    (8, "totalplay", "Fibra 300", "TOT-009-001", 999.00, 8),
    (9, "telcel", "Plan Familiar", "TLC-010-001", 780.00, 30),
    (10, "izzi", "Internet 200", "IZZ-011-001", 549.00, 25),
    (11, "att", "Postpago", "ATT-012-001", 420.00, 20),
    (12, "telmex", "Dúo Hogar", "TEL-013-001", 699.00, 18),
    (13, "cfe", "Tarifa Doméstica", "CFE-014-001", 380.00, 14),
    (14, "totalplay", "Plan Business", "TOT-015-001", 1299.00, 7),
    # second services for some users
    (0, "cfe", "Luz Casa", "CFE-001-002", 320.00, 25),
    (3, "izzi", "Cable Casa", "IZZ-004-002", 449.00, 18),
    (9, "telmex", "Teléfono Fijo", "TEL-010-002", 199.00, 30),
]

for user_idx, prov_name, alias, reference, amount_due, days_ago in assignments:
    if user_idx >= len(user_ids):
        continue
    prov_id = provider_ids.get(prov_name)
    if not prov_id:
        continue
    usid = db.execute(text("""
        INSERT INTO user_services (user_id, provider_id, alias, reference, amount_due, created_at)
        VALUES (:uid, :pid, :alias, :ref, :amount, :cat)
        RETURNING id
    """), dict(uid=user_ids[user_idx], pid=prov_id, alias=alias, ref=reference, amount=amount_due, cat=ts(days_ago=days_ago))).scalar()
    if usid:
        user_service_ids.append(usid)

db.commit()
print(f"[seed] {len(user_service_ids)} user_services created")

# ─────────────────────────────────────────────────────────────────────────────
# 4. Payments (50+ with realistic distribution)
# ─────────────────────────────────────────────────────────────────────────────
# status distribution: ~55% SUCCESS, 15% PENDING, 10% PROCESSING, 10% FAILED, 5% CANCELLED, 5% REVERSED
payments_data = [
    # (user_idx, service_idx, amount, status, days_ago, hours_ago, has_paid)
    # --- SUCCESS payments ---
    (0, 0, 599.00, "SUCCESS", 25, 2, True),
    (0, 1, 320.00, "SUCCESS", 25, 3, True),
    (1, 1, 450.50, "SUCCESS", 20, 1, True),
    (2, 2, 799.00, "SUCCESS", 22, 4, True),
    (3, 2, 250.00, "SUCCESS", 18, 2, True),
    (3, 3, 449.00, "SUCCESS", 18, 2, True),
    (4, 3, 649.00, "SUCCESS", 28, 6, True),
    (5, 4, 320.00, "SUCCESS", 15, 1, True),
    (6, 5, 899.00, "SUCCESS", 12, 3, True),
    (7, 6, 1200.00, "SUCCESS", 10, 2, True),
    (8, 7, 999.00, "SUCCESS", 8, 1, True),
    (9, 8, 780.00, "SUCCESS", 30, 5, True),
    (9, 9, 199.00, "SUCCESS", 30, 5, True),
    (10, 9, 549.00, "SUCCESS", 25, 3, True),
    (11, 10, 420.00, "SUCCESS", 20, 2, True),
    (12, 11, 699.00, "SUCCESS", 18, 4, True),
    (13, 12, 380.00, "SUCCESS", 14, 1, True),
    (14, 13, 1299.00, "SUCCESS", 7, 2, True),
    # repeat payers (showing recurring payments)
    (0, 0, 599.00, "SUCCESS", 55, 2, True),
    (1, 1, 450.50, "SUCCESS", 50, 1, True),
    (2, 2, 799.00, "SUCCESS", 52, 4, True),
    (4, 3, 649.00, "SUCCESS", 58, 6, True),
    (7, 6, 1200.00, "SUCCESS", 40, 2, True),
    (9, 8, 780.00, "SUCCESS", 60, 5, True),
    (12, 11, 699.00, "SUCCESS", 48, 4, True),
    (14, 13, 1299.00, "SUCCESS", 37, 2, True),
    (5, 4, 320.00, "SUCCESS", 45, 1, True),
    (6, 5, 899.00, "SUCCESS", 42, 3, True),
    (11, 10, 420.00, "SUCCESS", 50, 2, True),
    # --- PENDING payments ---
    (1, 1, 450.50, "PENDING", 1, 3, False),
    (3, 2, 250.00, "PENDING", 0, 8, False),
    (6, 5, 899.00, "PENDING", 0, 2, False),
    (10, 9, 549.00, "PENDING", 0, 6, False),
    (13, 12, 380.00, "PENDING", 1, 1, False),
    (8, 7, 999.00, "PENDING", 0, 4, False),
    (14, 13, 1299.00, "PENDING", 1, 5, False),
    # --- PROCESSING payments ---
    (2, 2, 799.00, "PROCESSING", 0, 1, False),
    (7, 6, 1200.00, "PROCESSING", 0, 0, False),
    (5, 4, 320.00, "PROCESSING", 0, 0, False),
    (12, 11, 699.00, "PROCESSING", 0, 2, False),
    # --- FAILED payments ---
    (0, 0, 599.00, "FAILED", 5, 12, False),
    (4, 3, 649.00, "FAILED", 8, 6, False),
    (9, 8, 780.00, "FAILED", 12, 4, False),
    (11, 10, 420.00, "FAILED", 3, 8, False),
    (14, 13, 1299.00, "FAILED", 15, 2, False),
    # --- CANCELLED payments ---
    (1, 1, 450.50, "CANCELLED", 6, 3, False),
    (13, 12, 380.00, "CANCELLED", 10, 5, False),
    # --- REVERSED payments ---
    (8, 7, 999.00, "REVERSED", 20, 2, False),
    (3, 2, 250.00, "REVERSED", 28, 6, False),
    (6, 5, 899.00, "REVERSED", 35, 3, False),
]

payment_ids = []
for user_idx, svc_idx, amount, status, days_ago, hours_ago, has_paid in payments_data:
    if user_idx >= len(user_ids) or svc_idx >= len(user_service_ids):
        continue
    uid = user_ids[user_idx]
    usid = user_service_ids[svc_idx]
    ext_ref = f"EXT-{uuid.uuid4().hex[:8].upper()}"
    created = ts(days_ago=days_ago, hours_ago=hours_ago)
    paid_at = created + timedelta(minutes=2) if has_paid else None
    pid = db.execute(text("""
        INSERT INTO payments (user_id, user_service_id, amount, status, external_reference, created_at, paid_at)
        VALUES (:uid, :usid, :amount, CAST(:status AS paymentstatus), :ext, :cat, :pat)
        RETURNING id
    """), dict(uid=uid, usid=usid, amount=amount, status=status, ext=ext_ref, cat=created, pat=paid_at)).scalar()
    if pid:
        payment_ids.append((pid, status, uid))

db.commit()
print(f"[seed] {len(payment_ids)} payments created")

# ─────────────────────────────────────────────────────────────────────────────
# 5. Receipts (for SUCCESS payments)
# ─────────────────────────────────────────────────────────────────────────────
success_payment_ids = [pid for pid, status, uid in payment_ids if status == "SUCCESS"]
receipt_ids = []
for i, pid in enumerate(success_payment_ids):
    folio = f"RCP-{2024000 + i + 1}"
    msg = "Pago procesado exitosamente. Conserve este comprobante para cualquier aclaración."
    rid = db.execute(text("""
        INSERT INTO receipts (payment_id, folio, message, created_at)
        VALUES (:pid, :folio, :msg, NOW())
        RETURNING id
    """), dict(pid=pid, folio=folio, msg=msg)).scalar()
    if rid:
        receipt_ids.append(rid)

db.commit()
print(f"[seed] {len(receipt_ids)} receipts created")

# ─────────────────────────────────────────────────────────────────────────────
# 6. Support tickets
# ─────────────────────────────────────────────────────────────────────────────
admin_user_id = db.execute(text("SELECT id FROM users WHERE role='SUPER_ADMIN' LIMIT 1")).scalar()

tickets_data = [
    # (user_idx, title, category, priority, severity, status, subject, days_ago, resolved)
    (0, "No se refleja mi pago de Telmex", "billing", "high", "high", "open", "Pago no reflejado", 3, False),
    (1, "Error al intentar pagar CFE", "technical", "medium", "medium", "open", "Error en pago", 2, False),
    (2, "Quiero cancelar mi servicio de Totalplay", "account", "low", "low", "resolved", "Cancelación de servicio", 8, True),
    (3, "Mi pago fue revertido sin razón", "billing", "high", "critical", "escalated", "Pago revertido", 1, False),
    (4, "No puedo ingresar a la app", "technical", "medium", "medium", "open", "Problema de acceso", 5, False),
    (5, "Cobro duplicado en mi cuenta", "billing", "high", "high", "in_progress", "Cargo duplicado", 2, False),
    (6, "Solicito factura de mis pagos", "account", "low", "low", "resolved", "Facturación", 12, True),
    (7, "La app se cierra al pagar", "technical", "medium", "medium", "open", "App se cierra", 1, False),
    (8, "Cambio de número telefónico", "account", "low", "low", "closed", "Actualización de datos", 15, True),
    (9, "Pago exitoso pero no tengo comprobante", "billing", "medium", "medium", "in_progress", "Comprobante faltante", 3, False),
    (10, "Dificultad para agregar servicio", "technical", "low", "low", "open", "Agregar servicio", 0, False),
    (11, "Quiero reembolso por pago fallido", "billing", "high", "high", "escalated", "Solicitud de reembolso", 2, False),
]

ticket_ids = []
for user_idx, title, category, priority, severity, status, subject, days_ago, resolved in tickets_data:
    if user_idx >= len(user_ids):
        continue
    uid = user_ids[user_idx]
    ticket_number = f"TKT-{2024000 + len(ticket_ids) + 1}"
    created = ts(days_ago=days_ago)
    resolved_at = created + timedelta(hours=48) if resolved else None
    tid = db.execute(text("""
        INSERT INTO support_tickets
            (user_id, ticket_number, source, status, priority, severity, category, title, subject,
             description, created_by, created_at, updated_at, resolved_at, sla_due_at)
        VALUES
            (:uid, :tnum, 'chatbot', :status, :priority, :severity, :category, :title, :subject,
             :desc, :cb, :cat, :cat, :resolved_at, :sla)
        RETURNING id
    """), dict(
        uid=uid, tnum=ticket_number, status=status, priority=priority, severity=severity,
        category=category, title=title, subject=subject,
        desc=f"El usuario reporta: {subject.lower()}. Requiere atención del equipo de soporte.",
        cb=admin_user_id, cat=created,
        resolved_at=resolved_at,
        sla=created + timedelta(hours=24),
    )).scalar()
    if tid:
        ticket_ids.append(tid)

db.commit()
print(f"[seed] {len(ticket_ids)} support tickets created")

# ─────────────────────────────────────────────────────────────────────────────
# 7. Chatbot conversations + messages
# ─────────────────────────────────────────────────────────────────────────────
conversations_data = [
    # (user_idx or None, status, severity, escalation_status, detected_intent, days_ago)
    (0, "closed", "low", "none", "consulta_saldo", 3),
    (1, "active", "medium", "none", "problema_pago", 1),
    (2, "escalated", "high", "escalated", "error_tecnico", 2),
    (3, "closed", "low", "none", "solicitud_comprobante", 5),
    (4, "active", "medium", "none", "cambio_datos", 0),
    (5, "closed", "low", "none", "info_servicios", 7),
    (6, "escalated", "critical", "escalated", "fraude_sospechoso", 1),
    (7, "active", "low", "none", "consulta_saldo", 0),
    (8, "closed", "medium", "none", "cancelacion_servicio", 4),
]

conversation_ids = []
for user_idx, status, severity, escalation, intent, days_ago in conversations_data:
    session_id = uuid.uuid4().hex
    started = ts(days_ago=days_ago, hours_ago=2)
    last_msg = started + timedelta(minutes=30)
    cid = db.execute(text("""
        INSERT INTO chatbot_conversations
            (session_id, source, started_at, last_message_at, status, detected_intent,
             severity, escalation_status, created_at, updated_at)
        VALUES
            (:sid, 'web_widget', :started, :last, :status, :intent,
             :severity, :esc, :started, :last)
        RETURNING id
    """), dict(sid=session_id, started=started, last=last_msg, status=status, intent=intent,
               severity=severity, esc=escalation)).scalar()
    if cid:
        conversation_ids.append(cid)
        # add messages
        msgs = [
            ("user", f"Hola, tengo una consulta sobre mi cuenta.", started),
            ("bot", "¡Hola! Bienvenido a FondixPay. ¿En qué puedo ayudarte?", started + timedelta(seconds=5)),
            ("user", "Necesito información sobre mi último pago.", started + timedelta(minutes=1)),
            ("bot", "Con gusto te ayudo. ¿Puedes proporcionarme tu número de servicio?", started + timedelta(minutes=1, seconds=10)),
        ]
        for sender, text_msg, msg_time in msgs:
            db.execute(text("""
                INSERT INTO chatbot_messages (conversation_id, sender_type, message_text_masked, raw_message_stored, created_at)
                VALUES (:cid, :sender, :msg, FALSE, :cat)
            """), dict(cid=cid, sender=sender, msg=text_msg, cat=msg_time))

db.commit()
print(f"[seed] {len(conversation_ids)} chatbot conversations created")

# ─────────────────────────────────────────────────────────────────────────────
# 8. Fraud signals
# ─────────────────────────────────────────────────────────────────────────────
fraud_payments = [(pid, uid) for pid, status, uid in payment_ids if status in ("FAILED", "REVERSED")]
fraud_data = [
    ("velocity_check", "high", "open", "payment", "Múltiples intentos de pago fallidos en menos de 10 minutos."),
    ("amount_anomaly", "medium", "open", "payment", "Monto inusualmente alto comparado con historial del usuario."),
    ("device_fingerprint", "low", "resolved", "user", "Acceso desde dispositivo no reconocido en ubicación diferente."),
    ("pattern_anomaly", "high", "open", "payment", "Patrón de pagos sospechoso: 5 servicios diferentes en 2 horas."),
    ("blacklist_match", "critical", "open", "payment", "Referencia externa coincide con lista negra de operaciones."),
]

for i, (signal_type, severity, status, entity_type, reason) in enumerate(fraud_data):
    fp = fraud_payments[i % len(fraud_payments)] if fraud_payments else (None, None)
    payment_id_val = fp[0] if fp[0] else None
    user_id_val = fp[1] if fp[1] else user_ids[i % len(user_ids)]
    db.execute(text("""
        INSERT INTO fraud_signals
            (signal_type, severity, status, entity_type, entity_id, user_id, payment_id,
             reason, metadata_json, created_by, created_at)
        VALUES
            (:stype, :severity, :status, :etype, :eid, :uid, :pid,
             :reason, :meta, :cb, :cat)
    """), dict(
        stype=signal_type, severity=severity, status=status,
        etype=entity_type, eid=str(payment_id_val or user_id_val),
        uid=user_id_val, pid=payment_id_val,
        reason=reason, meta='{"source": "automated", "confidence": 0.87}',
        cb=admin_user_id, cat=ts(days_ago=i+1),
    ))

db.commit()
print("[seed] 5 fraud signals created")

# ─────────────────────────────────────────────────────────────────────────────
# 9. Manual review cases
# ─────────────────────────────────────────────────────────────────────────────
review_payments = [(pid, uid) for pid, status, uid in payment_ids if status in ("FAILED", "REVERSED", "CANCELLED")]
review_data = [
    ("payment_dispute", "open", "high", "Pago disputado por el usuario. Monto: $999.00. Requiere revisión manual."),
    ("suspicious_activity", "open", "critical", "Actividad sospechosa detectada. Usuario realizó 8 pagos en 30 minutos."),
    ("reconciliation_mismatch", "in_review", "medium", "Diferencia en conciliación detectada entre sistema y proveedor."),
    ("refund_request", "resolved", "low", "Solicitud de reembolso por pago duplicado. Comprobante adjunto."),
    ("identity_verification", "open", "high", "Verificación de identidad requerida. KYC pendiente de validación."),
]

for i, (case_type, status, severity, summary) in enumerate(review_data):
    rp = review_payments[i % len(review_payments)] if review_payments else (None, None)
    pid_val = rp[0] if rp else None
    uid_val = rp[1] if rp else user_ids[i % len(user_ids)]
    db.execute(text("""
        INSERT INTO manual_review_cases
            (case_type, status, severity, user_id, payment_id, summary, created_at, updated_at)
        VALUES
            (:ctype, :status, :severity, :uid, :pid, :summary, :cat, :cat)
    """), dict(
        ctype=case_type, status=status, severity=severity,
        uid=uid_val, pid=pid_val, summary=summary,
        cat=ts(days_ago=i+1),
    ))

db.commit()
print("[seed] 5 manual review cases created")

# ─────────────────────────────────────────────────────────────────────────────
# 10. Audit events (30+)
# ─────────────────────────────────────────────────────────────────────────────
admin_id_str = str(admin_user_id)
event_templates = [
    ("USER_LOGIN", "user", "users", "success"),
    ("PAYMENT_CREATED", "user", "payments", "success"),
    ("PAYMENT_SUCCEEDED", "system", "payments", "success"),
    ("PAYMENT_FAILED", "system", "payments", "failure"),
    ("RECEIPT_GENERATED", "system", "receipts", "success"),
    ("SUPPORT_TICKET_CREATED", "user", "support_tickets", "success"),
    ("SUPPORT_TICKET_RESOLVED", "admin", "support_tickets", "success"),
    ("FRAUD_SIGNAL_CREATED", "system", "fraud_signals", "success"),
    ("MANUAL_REVIEW_OPENED", "admin", "manual_review_cases", "success"),
    ("CHATBOT_CONVERSATION_STARTED", "user", "chatbot_conversations", "success"),
    ("ADMIN_LOGIN", "admin", "users", "success"),
    ("USER_CREATED", "system", "users", "success"),
    ("PAYMENT_REVERSED", "admin", "payments", "success"),
    ("TICKET_ESCALATED", "admin", "support_tickets", "success"),
    ("FRAUD_SIGNAL_RESOLVED", "admin", "fraud_signals", "success"),
]

for i in range(35):
    tmpl = event_templates[i % len(event_templates)]
    event_type, actor_type, entity_type, result = tmpl
    actor_id = admin_id_str if actor_type == "admin" else str(user_ids[i % len(user_ids)])
    entity_id = str(i + 1)
    db.execute(text("""
        INSERT INTO audit_events
            (event_type, actor_type, actor_id, entity_type, entity_id, result,
             metadata_json, created_at)
        VALUES
            (:etype, :atype, :aid, :ent_type, :eid, :result,
             :meta, :cat)
    """), dict(
        etype=event_type, atype=actor_type, aid=actor_id,
        ent_type=entity_type, eid=entity_id, result=result,
        meta='{"ip": "192.168.1.1", "user_agent": "Mozilla/5.0"}',
        cat=ts(days_ago=(35 - i) // 3, hours_ago=i % 24),
    ))

db.commit()
print("[seed] 35 audit events created")

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
print("\n[seed] ✓ Demo data seeded successfully.")
counts = db.execute(text("""
    SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM service_providers) AS providers,
        (SELECT COUNT(*) FROM user_services) AS user_services,
        (SELECT COUNT(*) FROM payments) AS payments,
        (SELECT COUNT(*) FROM receipts) AS receipts,
        (SELECT COUNT(*) FROM support_tickets) AS tickets,
        (SELECT COUNT(*) FROM chatbot_conversations) AS conversations,
        (SELECT COUNT(*) FROM fraud_signals) AS fraud_signals,
        (SELECT COUNT(*) FROM manual_review_cases) AS manual_cases,
        (SELECT COUNT(*) FROM audit_events) AS audit_events
""")).fetchone()
print(f"""
  users:             {counts.users}
  providers:         {counts.providers}
  user_services:     {counts.user_services}
  payments:          {counts.payments}
  receipts:          {counts.receipts}
  support_tickets:   {counts.tickets}
  conversations:     {counts.conversations}
  fraud_signals:     {counts.fraud_signals}
  manual_cases:      {counts.manual_cases}
  audit_events:      {counts.audit_events}
""")
