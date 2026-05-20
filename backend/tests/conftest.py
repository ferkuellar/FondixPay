from collections.abc import Callable, Generator
from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import create_access_token
from app.main import app
from app.modules.notifications.models import Notification
from app.modules.payments.models import Payment, PaymentStatus
from app.modules.receipts.models import Receipt
from app.modules.service_providers.models import IntegrationType, ServiceCategory, ServiceProvider
from app.modules.user_services.models import UserService
from app.modules.users.models import User

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()


@pytest.fixture()
def create_user(db_session: Session) -> Callable[[str | None], User]:
    def _create_user(phone: str | None = None) -> User:
        user = User(phone=phone or f"55{uuid4().int % 10**8:08d}")
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    return _create_user


@pytest.fixture()
def auth_headers(create_user: Callable[[str | None], User]) -> Callable[[User | None], dict[str, str]]:
    def _auth_headers(user: User | None = None) -> dict[str, str]:
        current_user = user or create_user(None)
        token = create_access_token(str(current_user.id))
        return {"Authorization": f"Bearer {token}"}

    return _auth_headers


@pytest.fixture()
def create_provider(db_session: Session) -> Callable[[str], ServiceProvider]:
    def _create_provider(name: str = "cfe") -> ServiceProvider:
        provider = ServiceProvider(
            name=f"{name}-{uuid4().hex[:8]}",
            display_name=name.upper(),
            category=ServiceCategory.ELECTRICITY.value,
            icon_key="electricity",
            integration_type=IntegrationType.MOCK.value,
            is_active=True,
            sort_order=1,
        )
        db_session.add(provider)
        db_session.commit()
        db_session.refresh(provider)
        return provider

    return _create_provider


@pytest.fixture()
def create_user_service(
    db_session: Session,
    create_provider: Callable[[str], ServiceProvider],
) -> Callable[[User, Decimal], UserService]:
    def _create_user_service(user: User, amount_due: Decimal = Decimal("125.50")) -> UserService:
        provider = create_provider("cfe")
        service = UserService(
            user_id=user.id,
            provider_id=provider.id,
            alias="Casa",
            reference=f"REF-{uuid4().hex[:8]}",
            amount_due=amount_due,
        )
        db_session.add(service)
        db_session.commit()
        db_session.refresh(service)
        return service

    return _create_user_service


@pytest.fixture()
def create_payment(
    db_session: Session,
    create_user_service: Callable[[User, Decimal], UserService],
) -> Callable[[User], Payment]:
    def _create_payment(user: User) -> Payment:
        service = create_user_service(user, Decimal("125.50"))
        payment = Payment(
            user_id=user.id,
            user_service_id=service.id,
            amount=Decimal("125.50"),
            status=PaymentStatus.SUCCESS,
            external_reference=f"MOCK-{uuid4().hex[:8]}",
        )
        db_session.add(payment)
        db_session.commit()
        db_session.refresh(payment)
        return payment

    return _create_payment


@pytest.fixture()
def create_receipt(db_session: Session, create_payment: Callable[[User], Payment]) -> Callable[[User], Receipt]:
    def _create_receipt(user: User) -> Receipt:
        payment = create_payment(user)
        receipt = Receipt(payment_id=payment.id, folio=f"FOLIO-{uuid4().hex[:8]}", message="Pago mock exitoso")
        db_session.add(receipt)
        db_session.commit()
        db_session.refresh(receipt)
        return receipt

    return _create_receipt


@pytest.fixture()
def create_notification(db_session: Session) -> Callable[[User], Notification]:
    def _create_notification(user: User) -> Notification:
        notification = Notification(user_id=user.id, message="Pago mock registrado")
        db_session.add(notification)
        db_session.commit()
        db_session.refresh(notification)
        return notification

    return _create_notification
