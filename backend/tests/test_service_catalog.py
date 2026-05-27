from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.service_catalog import repository, services
from app.modules.service_catalog.constants import CoverageStatus


def test_service_catalog_defaults_to_no_payable_services(client: TestClient) -> None:
    response = client.get("/service-catalog")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 0
    assert body["services"] == []


def test_seeded_coverage_data_is_not_payable_by_default(client: TestClient, db_session: Session) -> None:
    services.seed_service_catalog_from_static_data(db_session)
    items = repository.list_admin_catalog(db_session)

    assert items
    assert all(item.payable_in_mobile is False for item in items)
    assert all(item.coverage_status != CoverageStatus.AVAILABLE.value for item in items)
    assert all(not capability.supports_payment_execution for item in items for capability in item.capabilities)


def test_service_categories_are_public(client: TestClient) -> None:
    response = client.get("/service-categories")

    assert response.status_code == 200
    categories = response.json()
    assert any(category["code"] == "electricity" for category in categories)
    assert any(category["code"] == "water" for category in categories)


def test_cfe_is_not_payable_without_provider_confirmation(client: TestClient, db_session: Session) -> None:
    services.seed_service_catalog_from_static_data(db_session)
    cfe = repository.get_item_by_slug(db_session, "cfe-online")
    assert cfe is not None

    validation = services.validate_service_is_payable(db_session, cfe.id)

    assert validation.payable is False
    assert "provider capability is not confirmed for payment execution and receipt" in validation.reasons

