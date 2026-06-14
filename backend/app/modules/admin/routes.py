from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.admin import repository, services
from app.modules.admin.dependencies import require_admin_permission
from app.modules.admin.redaction import (
    redact_payment_for_role,
    redact_receipt_for_role,
    redact_sensitive_dict,
    redact_user_for_role,
)
from app.modules.admin import analytics as admin_analytics
from app.modules.admin.schemas import (
    AdminAuditEventListItem,
    AdminNotificationDeliveryDetail,
    AdminNotificationDeliveryListItem,
    AdminOperatorCreate,
    AdminOperatorStatusUpdate,
    AdminPaymentDetail,
    AdminPaymentListItem,
    AdminReceiptDetail,
    AdminReceiptListItem,
    AdminSearchResponse,
    AdminUserDetail,
    AdminUserListItem,
    CategoryVolumePoint,
    DashboardSummary,
    DisputeCaseCreate,
    DisputeCaseRead,
    DisputeCaseUpdate,
    DisputeEvidenceCreate,
    FraudSignalCreate,
    FraudSignalRead,
    FraudSignalUpdate,
    HourlyTrafficPoint,
    ManualReviewCaseCreate,
    ManualReviewCaseRead,
    ManualReviewCaseUpdate,
    PaymentTrendPoint,
    ReconciliationSummaryPlaceholder,
    SupportTicketCreate,
    SupportTicketNoteCreate,
    SupportTicketRead,
    SupportTicketUpdate,
)
from app.modules.admin.permissions import ADMIN_ROLES, normalize_role
from app.modules.notifications import repository as notification_repository
from app.modules.users.models import User
from app.modules.users.repository import get_by_phone

router = APIRouter()


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.dashboard.view")),
    db: Session = Depends(get_db),
) -> DashboardSummary:
    result = services.dashboard_summary(db)
    _audit(db, request, current_user, "admin.dashboard_viewed", "admin.dashboard.view")
    return result


@router.get("/dashboard/trend", response_model=list[PaymentTrendPoint])
def get_dashboard_trend(
    days: int = Query(default=30, ge=7, le=90),
    current_user: User = Depends(require_admin_permission("admin.dashboard.view")),
    db: Session = Depends(get_db),
) -> list[PaymentTrendPoint]:
    return [PaymentTrendPoint(**p) for p in admin_analytics.payment_trend(db, days)]


@router.get("/dashboard/category-volume", response_model=list[CategoryVolumePoint])
def get_dashboard_category_volume(
    current_user: User = Depends(require_admin_permission("admin.dashboard.view")),
    db: Session = Depends(get_db),
) -> list[CategoryVolumePoint]:
    return [CategoryVolumePoint(**p) for p in admin_analytics.category_volume(db)]


@router.get("/dashboard/hourly", response_model=list[HourlyTrafficPoint])
def get_dashboard_hourly(
    current_user: User = Depends(require_admin_permission("admin.dashboard.view")),
    db: Session = Depends(get_db),
) -> list[HourlyTrafficPoint]:
    return [HourlyTrafficPoint(**p) for p in admin_analytics.hourly_traffic(db)]


@router.get("/users", response_model=list[AdminUserListItem])
def list_users(
    request: Request,
    q: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.users.list")),
    db: Session = Depends(get_db),
) -> list[AdminUserListItem]:
    result = [
        AdminUserListItem(**redact_user_for_role(user, current_user.role))
        for user in repository.list_users(db, q=q, limit=limit, offset=offset)
    ]
    _audit(db, request, current_user, "admin.users_list_viewed", "admin.users.list", metadata={"q_used": bool(q)})
    return result


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def get_user(
    user_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.users.view")),
    db: Session = Depends(get_db),
) -> AdminUserDetail:
    user = services.get_or_404(repository.get_user(db, user_id), "Usuario no encontrado")
    result = services.user_detail(db, user, current_user.role)
    _audit(db, request, current_user, "admin.user_viewed", "admin.users.view", "User", user.id)
    return result


@router.get("/admin-users", response_model=list[AdminUserListItem])
def list_admin_operators(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.admin_users.list")),
    db: Session = Depends(get_db),
) -> list[AdminUserListItem]:
    operators = db.query(User).filter(User.role.in_(ADMIN_ROLES)).order_by(User.created_at.desc()).all()
    _audit(db, request, current_user, "admin.admin_users_listed", "admin.admin_users.list")
    return [AdminUserListItem.model_validate(u, from_attributes=True) for u in operators]


@router.post("/admin-users", response_model=AdminUserListItem, status_code=status.HTTP_201_CREATED)
def create_admin_operator(
    payload: AdminOperatorCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.admin_users.manage")),
    db: Session = Depends(get_db),
) -> AdminUserListItem:
    role = normalize_role(payload.role)
    if role not in ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Rol invalido. Valores permitidos: {sorted(ADMIN_ROLES)}",
        )
    if get_by_phone(db, payload.phone):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe un usuario con ese telefono")
    user = User(phone=payload.phone, role=role, name=payload.name, is_active=True)
    db.add(user)
    db.flush()
    _audit(db, request, current_user, "admin.admin_user_created", "admin.admin_users.manage", "User", user.id, {"role": role})
    db.commit()
    db.refresh(user)
    return AdminUserListItem.model_validate(user, from_attributes=True)


@router.patch("/admin-users/{user_id}/status", response_model=AdminUserListItem)
def update_admin_operator_status(
    user_id: int,
    payload: AdminOperatorStatusUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.admin_users.manage")),
    db: Session = Depends(get_db),
) -> AdminUserListItem:
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No puedes cambiar tu propio estado")
    user = db.get(User, user_id)
    if user is None or normalize_role(user.role) not in ADMIN_ROLES:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Operador no encontrado")
    user.is_active = payload.is_active
    _audit(db, request, current_user, "admin.admin_user_status_updated", "admin.admin_users.manage", "User", user.id, {"is_active": payload.is_active})
    db.commit()
    db.refresh(user)
    return AdminUserListItem.model_validate(user, from_attributes=True)


@router.get("/payments", response_model=list[AdminPaymentListItem])
def list_payments(
    request: Request,
    payment_status: str | None = Query(default=None, alias="status"),
    user_id: int | None = None,
    correlation_id: str | None = None,
    provider_reference: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.payments.list")),
    db: Session = Depends(get_db),
) -> list[AdminPaymentListItem]:
    payments = repository.list_payments(
        db,
        status=payment_status,
        user_id=user_id,
        correlation_id=correlation_id,
        provider_reference=provider_reference,
        limit=limit,
        offset=offset,
    )
    result = [AdminPaymentListItem(**redact_payment_for_role(payment, current_user.role)) for payment in payments]
    _audit(db, request, current_user, "admin.payments_list_viewed", "admin.payments.list")
    return result


@router.get("/payments/{payment_id}", response_model=AdminPaymentDetail)
def get_payment(
    payment_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.payments.view")),
    db: Session = Depends(get_db),
) -> AdminPaymentDetail:
    payment = services.get_or_404(repository.get_payment(db, payment_id), "Pago no encontrado")
    result = services.payment_detail(db, payment, current_user.role)
    _audit(
        db,
        request,
        current_user,
        "admin.payment_viewed",
        "admin.payments.view",
        "Payment",
        payment.id,
        correlation_id=result.correlation_id,
    )
    return result


@router.get("/receipts", response_model=list[AdminReceiptListItem])
def list_receipts(
    request: Request,
    user_id: int | None = None,
    payment_id: int | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.receipts.list")),
    db: Session = Depends(get_db),
) -> list[AdminReceiptListItem]:
    receipts = repository.list_receipts(db, user_id=user_id, payment_id=payment_id, limit=limit, offset=offset)
    result = [AdminReceiptListItem(**redact_receipt_for_role(receipt, current_user.role)) for receipt in receipts]
    _audit(db, request, current_user, "admin.receipts_list_viewed", "admin.receipts.list")
    return result


@router.get("/receipts/{receipt_id}", response_model=AdminReceiptDetail)
def get_receipt(
    receipt_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.receipts.view")),
    db: Session = Depends(get_db),
) -> AdminReceiptDetail:
    receipt = services.get_or_404(repository.get_receipt(db, receipt_id), "Recibo no encontrado")
    result = services.receipt_detail(db, receipt, current_user.role)
    _audit(
        db,
        request,
        current_user,
        "admin.receipt_viewed",
        "admin.receipts.view",
        "Receipt",
        receipt.id,
        correlation_id=result.correlation_id,
    )
    return result


@router.get("/audit-events", response_model=list[AdminAuditEventListItem])
def list_audit_events(
    request: Request,
    event_type: str | None = None,
    entity_type: str | None = None,
    entity_id: str | None = None,
    actor_id: str | None = None,
    correlation_id: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.audit.list")),
    db: Session = Depends(get_db),
) -> list[AdminAuditEventListItem]:
    events = repository.list_audit_events(
        db,
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor_id,
        correlation_id=correlation_id,
        limit=limit,
        offset=offset,
    )
    result = [
        AdminAuditEventListItem(
            id=event.id,
            event_type=event.event_type,
            actor_type=event.actor_type,
            actor_id=event.actor_id,
            entity_type=event.entity_type,
            entity_id=event.entity_id,
            result=event.result,
            request_id=event.request_id,
            correlation_id=event.correlation_id,
            metadata=redact_sensitive_dict(event.metadata_json),
            created_at=event.created_at,
        )
        for event in events
    ]
    _audit(db, request, current_user, "admin.audit_events_viewed", "admin.audit.list")
    return result


@router.get("/notifications/deliveries", response_model=list[AdminNotificationDeliveryListItem])
def list_notification_deliveries(
    request: Request,
    status: str | None = None,
    template_name: str | None = None,
    user_id: int | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.notifications.list")),
    db: Session = Depends(get_db),
) -> list[AdminNotificationDeliveryListItem]:
    deliveries = notification_repository.list_deliveries(
        db,
        status=status,
        template_name=template_name,
        user_id=user_id,
        limit=limit,
        offset=offset,
    )
    _audit(db, request, current_user, "admin.notification_deliveries_viewed", "admin.notifications.list")
    return [AdminNotificationDeliveryListItem.model_validate(item, from_attributes=True) for item in deliveries]


@router.get("/notifications/deliveries/{delivery_id}", response_model=AdminNotificationDeliveryDetail)
def get_notification_delivery(
    delivery_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.notifications.view")),
    db: Session = Depends(get_db),
) -> AdminNotificationDeliveryDetail:
    delivery = services.get_or_404(
        notification_repository.get_delivery(db, delivery_id),
        "Delivery de notificacion no encontrado",
    )
    _audit(
        db,
        request,
        current_user,
        "admin.notification_delivery_viewed",
        "admin.notifications.view",
        "NotificationDelivery",
        delivery.id,
    )
    return AdminNotificationDeliveryDetail.model_validate(delivery, from_attributes=True)


@router.get("/search", response_model=AdminSearchResponse)
def search_admin_references(
    request: Request,
    q: str = Query(min_length=1, max_length=160),
    search_type: str | None = Query(default=None, alias="type"),
    current_user: User = Depends(require_admin_permission("admin.search.view")),
    db: Session = Depends(get_db),
) -> AdminSearchResponse:
    result = services.search_operational_references(db, q, search_type, current_user.role)
    _audit(
        db,
        request,
        current_user,
        "admin.search_executed",
        "admin.search.view",
        metadata={"type": search_type or "all", "result_count": len(result.results)},
    )
    return result


@router.get("/reconciliation/card", response_model=ReconciliationSummaryPlaceholder)
def get_card_reconciliation(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.reconciliation.card.view")),
    db: Session = Depends(get_db),
) -> ReconciliationSummaryPlaceholder:
    _audit(
        db,
        request,
        current_user,
        "admin.reconciliation_card_viewed",
        "admin.reconciliation.card.view",
        "Reconciliation",
        "card",
    )
    return _reconciliation_placeholder("card_processor")



@router.get("/manual-review", response_model=list[ManualReviewCaseRead])
def list_manual_review(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.manual_review.list")),
    db: Session = Depends(get_db),
) -> list[ManualReviewCaseRead]:
    return [
        ManualReviewCaseRead.model_validate(case, from_attributes=True)
        for case in repository.list_manual_review_cases(db, limit=limit, offset=offset)
    ]


@router.get("/manual-review/{case_id}", response_model=ManualReviewCaseRead)
def get_manual_review(
    case_id: int,
    current_user: User = Depends(require_admin_permission("admin.manual_review.view")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.get_or_404(repository.get_manual_review_case(db, case_id), "Caso no encontrado")
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.post("/manual-review", response_model=ManualReviewCaseRead, status_code=status.HTTP_201_CREATED)
def create_manual_review(
    payload: ManualReviewCaseCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.manual_review.update")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.create_manual_review_case(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.manual_review_created",
        "admin.manual_review.update",
        "ManualReviewCase",
        case.id,
        {"case_type": case.case_type},
        case.correlation_id,
    )
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.patch("/manual-review/{case_id}", response_model=ManualReviewCaseRead)
def update_manual_review(
    case_id: int,
    payload: ManualReviewCaseUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.manual_review.update")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.get_or_404(repository.get_manual_review_case(db, case_id), "Caso no encontrado")
    previous_status = case.status
    case = services.update_manual_review_case(db, case, payload, current_user)
    event_type = "admin.manual_review_note_added" if payload.note else "admin.manual_review_updated"
    if previous_status != case.status:
        event_type = "admin.manual_review_status_changed"
        if case.assigned_to is not None and case.status == "assigned":
            event_type = "admin.manual_review_assigned"
        if case.status == "resolved":
            event_type = "admin.manual_review_resolved"
        if case.status == "closed":
            event_type = "admin.manual_review_closed"
    _audit(
        db,
        request,
        current_user,
        event_type,
        "admin.manual_review.update",
        "ManualReviewCase",
        case.id,
        {"fields": sorted(payload.model_dump(exclude_unset=True))},
        case.correlation_id,
    )
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.get("/fraud/signals", response_model=list[FraudSignalRead])
def list_fraud_signals(
    status_filter: str | None = Query(default=None, alias="status"),
    severity: str | None = None,
    payment_id: int | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.fraud_signals.list")),
    db: Session = Depends(get_db),
) -> list[FraudSignalRead]:
    return [
        FraudSignalRead.model_validate(signal, from_attributes=True)
        for signal in repository.list_fraud_signals(
            db,
            status=status_filter,
            severity=severity,
            payment_id=payment_id,
            limit=limit,
            offset=offset,
        )
    ]


@router.get("/fraud/signals/{signal_id}", response_model=FraudSignalRead)
def get_fraud_signal(
    signal_id: int,
    current_user: User = Depends(require_admin_permission("admin.fraud_signals.view")),
    db: Session = Depends(get_db),
) -> FraudSignalRead:
    signal = services.get_or_404(repository.get_fraud_signal(db, signal_id), "Senal de fraude no encontrada")
    return FraudSignalRead.model_validate(signal, from_attributes=True)


@router.post("/fraud/signals", response_model=FraudSignalRead, status_code=status.HTTP_201_CREATED)
def create_fraud_signal(
    payload: FraudSignalCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.fraud_signals.update")),
    db: Session = Depends(get_db),
) -> FraudSignalRead:
    signal = services.create_fraud_signal(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "fraud.signal.created",
        "admin.fraud_signals.update",
        "FraudSignal",
        signal.id,
        {"signal_type": signal.signal_type, "severity": signal.severity, "status": signal.status},
    )
    return FraudSignalRead.model_validate(signal, from_attributes=True)


@router.patch("/fraud/signals/{signal_id}/status", response_model=FraudSignalRead)
def update_fraud_signal_status(
    signal_id: int,
    payload: FraudSignalUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.fraud_signals.update")),
    db: Session = Depends(get_db),
) -> FraudSignalRead:
    signal = services.get_or_404(repository.get_fraud_signal(db, signal_id), "Senal de fraude no encontrada")
    previous_status = signal.status
    signal = services.update_fraud_signal(db, signal, payload, current_user)
    event_type = {
        "reviewed": "fraud.signal.reviewed",
        "dismissed": "fraud.signal.dismissed",
        "escalated": "fraud.signal.escalated",
    }.get(signal.status, "fraud.signal.reviewed")
    _audit(
        db,
        request,
        current_user,
        event_type,
        "admin.fraud_signals.update",
        "FraudSignal",
        signal.id,
        {"before_status": previous_status, "after_status": signal.status},
    )
    return FraudSignalRead.model_validate(signal, from_attributes=True)


@router.get("/disputes", response_model=list[DisputeCaseRead])
def list_disputes(
    status_filter: str | None = Query(default=None, alias="status"),
    case_type: str | None = None,
    payment_id: int | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.disputes.list")),
    db: Session = Depends(get_db),
) -> list[DisputeCaseRead]:
    return [
        DisputeCaseRead.model_validate(case, from_attributes=True)
        for case in repository.list_dispute_cases(
            db,
            status=status_filter,
            case_type=case_type,
            payment_id=payment_id,
            limit=limit,
            offset=offset,
        )
    ]


@router.post("/disputes", response_model=DisputeCaseRead, status_code=status.HTTP_201_CREATED)
def create_dispute(
    payload: DisputeCaseCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.disputes.update")),
    db: Session = Depends(get_db),
) -> DisputeCaseRead:
    case = services.create_dispute_case(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "chargeback.created" if case.case_type == "chargeback" else "dispute.created",
        "admin.disputes.update",
        "DisputeCase",
        case.id,
        {"case_type": case.case_type, "status": case.status, "payment_id": case.payment_id},
    )
    return DisputeCaseRead.model_validate(case, from_attributes=True)


@router.get("/disputes/{case_id}", response_model=DisputeCaseRead)
def get_dispute(
    case_id: int,
    current_user: User = Depends(require_admin_permission("admin.disputes.view")),
    db: Session = Depends(get_db),
) -> DisputeCaseRead:
    case = services.get_or_404(repository.get_dispute_case(db, case_id), "Caso de disputa no encontrado")
    return DisputeCaseRead.model_validate(case, from_attributes=True)


@router.patch("/disputes/{case_id}/status", response_model=DisputeCaseRead)
def update_dispute_status(
    case_id: int,
    payload: DisputeCaseUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.disputes.update")),
    db: Session = Depends(get_db),
) -> DisputeCaseRead:
    case = services.get_or_404(repository.get_dispute_case(db, case_id), "Caso de disputa no encontrado")
    previous_status = case.status
    case = services.update_dispute_case(db, case, payload, current_user)
    event_type = "chargeback.status_changed" if case.case_type == "chargeback" else "dispute.status_changed"
    if case.status in {"CLOSED", "CANCELED", "WON", "LOST"}:
        event_type = "chargeback.closed" if case.case_type == "chargeback" else "dispute.closed"
    _audit(
        db,
        request,
        current_user,
        event_type,
        "admin.disputes.update",
        "DisputeCase",
        case.id,
        {"before_status": previous_status, "after_status": case.status},
    )
    return DisputeCaseRead.model_validate(case, from_attributes=True)


@router.post("/disputes/{case_id}/evidence", response_model=DisputeCaseRead, status_code=status.HTTP_201_CREATED)
def add_dispute_evidence(
    case_id: int,
    payload: DisputeEvidenceCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.disputes.update")),
    db: Session = Depends(get_db),
) -> DisputeCaseRead:
    case = services.get_or_404(repository.get_dispute_case(db, case_id), "Caso de disputa no encontrado")
    evidence = services.add_dispute_evidence(db, case, payload, current_user)
    event_type = "chargeback.evidence_added" if case.case_type == "chargeback" else "dispute.evidence_added"
    _audit(
        db,
        request,
        current_user,
        event_type,
        "admin.disputes.update",
        "DisputeCase",
        case.id,
        {"evidence_id": evidence.id, "evidence_type": evidence.evidence_type},
    )
    return DisputeCaseRead.model_validate(case, from_attributes=True)


@router.get("/support/tickets", response_model=list[SupportTicketRead])
def list_tickets(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.support_tickets.list")),
    db: Session = Depends(get_db),
) -> list[SupportTicketRead]:
    return [
        SupportTicketRead.model_validate(ticket, from_attributes=True)
        for ticket in repository.list_support_tickets(db, limit=limit, offset=offset)
    ]


@router.get("/support/tickets/{ticket_id}", response_model=SupportTicketRead)
def get_ticket(
    ticket_id: int,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.list")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.post("/support/tickets", response_model=SupportTicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: SupportTicketCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.create")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.create_ticket(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.support_ticket_created",
        "admin.support_tickets.create",
        "SupportTicket",
        ticket.id,
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.patch("/support/tickets/{ticket_id}", response_model=SupportTicketRead)
def update_ticket(
    ticket_id: int,
    payload: SupportTicketUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.update")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    previous_status = ticket.status
    ticket = services.update_ticket(db, ticket, payload, current_user)
    event_type = "admin.support_ticket_updated"
    if previous_status != ticket.status and ticket.status == "closed":
        event_type = "admin.support_ticket_closed"
    _audit(
        db,
        request,
        current_user,
        event_type,
        "admin.support_tickets.update",
        "SupportTicket",
        ticket.id,
        {"fields": sorted(payload.model_dump(exclude_unset=True))},
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.post("/support/tickets/{ticket_id}/notes", response_model=SupportTicketRead)
def add_ticket_note(
    ticket_id: int,
    payload: SupportTicketNoteCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.update")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    services.add_ticket_note(db, ticket, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.support_ticket_note_added",
        "admin.support_tickets.update",
        "SupportTicket",
        ticket.id,
        {"is_internal": payload.is_internal},
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


def _audit(
    db: Session,
    request: Request,
    actor: User,
    event_type: str,
    permission: str,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    metadata: dict | None = None,
    correlation_id: str | None = None,
) -> None:
    services.audit_admin_action(
        db,
        request,
        actor,
        event_type=event_type,
        permission=permission,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata=metadata,
        correlation_id=correlation_id,
    )
    db.commit()


def _reconciliation_placeholder(provider_type: str) -> ReconciliationSummaryPlaceholder:
    return ReconciliationSummaryPlaceholder(
        status="not_implemented",
        provider_type=provider_type,
        summary={
            "total_count": 0,
            "matched_count": 0,
            "mismatch_count": 0,
            "pending_count": 0,
            "manual_review_count": 0,
        },
        items=[],
        message="Reconciliation is planned for a later phase.",
        production_ready=False,
    )
