from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.modules.payments.models import Payment, PaymentStatus
from app.modules.service_providers.models import ServiceProvider
from app.modules.user_services.models import UserService


def payment_trend(db: Session, days: int = 30) -> list[dict]:
    since = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=days)
    payments = (
        db.query(Payment.created_at, Payment.status)
        .filter(Payment.created_at >= since)
        .all()
    )

    result: dict[str, dict] = {}
    for i in range(days):
        day = (datetime.now(timezone.utc) - timedelta(days=days - 1 - i)).date().isoformat()
        result[day] = {"date": day, "count": 0, "succeeded": 0, "failed": 0}

    for created_at, status in payments:
        day = created_at.date().isoformat()
        if day in result:
            result[day]["count"] += 1
            if status == PaymentStatus.SUCCESS:
                result[day]["succeeded"] += 1
            elif status == PaymentStatus.FAILED:
                result[day]["failed"] += 1

    return list(result.values())


def category_volume(db: Session) -> list[dict]:
    rows = (
        db.query(
            ServiceProvider.category,
            func.count(Payment.id).label("count"),
            func.sum(Payment.amount).label("total_amount"),
        )
        .select_from(Payment)
        .join(UserService, Payment.user_service_id == UserService.id)
        .join(ServiceProvider, UserService.provider_id == ServiceProvider.id)
        .group_by(ServiceProvider.category)
        .order_by(func.count(Payment.id).desc())
        .all()
    )
    return [
        {
            "category": row.category,
            "count": row.count,
            "total_minor": int(float(row.total_amount or 0) * 100),
        }
        for row in rows
    ]


def hourly_traffic(db: Session) -> list[dict]:
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=None)
    payments = (
        db.query(Payment.created_at)
        .filter(Payment.created_at >= today_start)
        .all()
    )

    hours = {h: 0 for h in range(24)}
    for (created_at,) in payments:
        hours[created_at.hour] += 1

    return [{"hour": h, "count": hours[h]} for h in range(24)]
