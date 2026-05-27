from sqlalchemy.orm import Session

from app.modules.service_catalog import repository, services
from app.modules.service_catalog.constants import CoverageStatus


def test_validate_service_is_payable_false_for_to_confirm(db_session: Session) -> None:
    services.seed_service_catalog_from_static_data(db_session)
    item = repository.list_admin_catalog(db_session)[0]
    item.coverage_status = CoverageStatus.TO_CONFIRM.value
    db_session.commit()

    validation = services.validate_service_is_payable(db_session, item.id)

    assert validation.payable is False
    assert "payable_in_mobile is false" in validation.reasons
    assert "coverage_status is to_confirm" in validation.reasons


def test_validate_service_is_payable_false_without_state_coverage(db_session: Session) -> None:
    services.seed_service_catalog_from_static_data(db_session)
    item = repository.get_item_by_slug(db_session, "izzi")
    assert item is not None

    validation = services.validate_service_is_payable(db_session, item.id, "BCS")

    assert validation.payable is False
    assert "state coverage is missing" in validation.reasons

