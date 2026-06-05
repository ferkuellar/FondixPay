from collections.abc import Iterable

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.service_catalog import repository
from app.modules.service_catalog.constants import CapabilityStatus, CoverageStatus, STATE_NAMES


def create_synthetic_public_service(
    db: Session,
    *,
    slug: str,
    is_national: bool = False,
    state_codes: Iterable[str] = (),
    coverage_status: str = CoverageStatus.AVAILABLE.value,
    visible_on_mobile: bool = True,
    payable_in_mobile: bool = True,
    capability_status: str = CapabilityStatus.CONFIRMED.value,
    supports_payment_execution: bool = True,
    supports_receipt: bool = True,
):
    category = repository.get_category_by_code(db, "synthetic_utilities") or repository.create_category(
        db,
        code="synthetic_utilities",
        name="Synthetic utilities",
        display_order=1,
    )
    item = repository.create_item(
        db,
        category_id=category.id,
        display_name=f"Synthetic service {slug}",
        slug=slug,
        icon_key="other",
        description="Synthetic public catalog fixture.",
        is_national=is_national,
        coverage_status=coverage_status,
        visible_on_landing=True,
        visible_on_mobile=visible_on_mobile,
        payable_in_mobile=payable_in_mobile,
        visible_on_admin=True,
        show_in_coverage_map=True,
        is_mock=True,
        sort_order=1,
    )
    for state_code in state_codes:
        repository.add_coverage(
            db,
            service_catalog_item_id=item.id,
            state_code=state_code,
            state_name=STATE_NAMES.get(state_code, state_code),
            coverage_status=CoverageStatus.AVAILABLE.value,
            source="synthetic_test",
            notes="Synthetic test coverage only.",
        )
    repository.add_capability(
        db,
        service_catalog_item_id=item.id,
        provider_name="synthetic_internal_provider",
        provider_service_code="internal-provider-service-code",
        supports_reference_validation=True,
        supports_amount_lookup=True,
        supports_payment_execution=supports_payment_execution,
        supports_receipt=supports_receipt,
        currency="MXN",
        status=capability_status,
        notes="Synthetic provider capability only.",
    )
    db.commit()
    db.refresh(item)
    return item


def test_public_catalog_national_service_returns_national_coverage(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-national", is_national=True)

    response = client.get("/service-catalog?state_code=MX-CHH")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    service = body["services"][0]
    assert service["coverage"] == {
        "mode": "NATIONAL",
        "states": [],
        "label": "Disponible a nivel nacional",
    }
    assert "MX-ALL" not in service["coverage"]["states"]


def test_public_catalog_legacy_state_data_returns_canonical_mx_state(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-state", state_codes=["CHH"])

    response = client.get("/service-catalog?state_code=CHH")

    assert response.status_code == 200
    service = response.json()["services"][0]
    assert service["coverage"]["mode"] == "STATE"
    assert service["coverage"]["states"] == ["MX-CHH"]
    assert_no_legacy_state_values(service["coverage"]["states"])


def test_public_catalog_accepts_mx_state_input_for_legacy_storage(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-mx-input", state_codes=["CHH"])

    response = client.get("/service-catalog?state_code=MX-CHH")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    assert body["services"][0]["coverage"]["states"] == ["MX-CHH"]


def test_public_catalog_multiple_states_are_all_canonical(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-multi-state", state_codes=["CHH", "COA", "NLE"])

    response = client.get("/service-catalog")

    assert response.status_code == 200
    states = response.json()["services"][0]["coverage"]["states"]
    assert states == ["MX-CHH", "MX-COA", "MX-NLE"]
    assert_no_legacy_state_values(states)


def test_public_catalog_filters_to_matching_state_plus_national(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-national-match", is_national=True)
    create_synthetic_public_service(db_session, slug="synthetic-state-match", state_codes=["COA"])
    create_synthetic_public_service(db_session, slug="synthetic-state-hidden", state_codes=["JAL"])

    response = client.get("/service-catalog?state_code=MX-COA")

    assert response.status_code == 200
    slugs = {service["slug"] for service in response.json()["services"]}
    assert slugs == {"synthetic-national-match", "synthetic-state-match"}


def test_public_catalog_does_not_expose_unknown_disabled_or_rejected_services(
    client: TestClient,
    db_session: Session,
) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-unknown", state_codes=["CHH"], coverage_status=CoverageStatus.UNKNOWN.value)
    create_synthetic_public_service(
        db_session,
        slug="synthetic-disabled",
        state_codes=["CHH"],
        coverage_status=CoverageStatus.TEMPORARILY_DISABLED.value,
    )
    create_synthetic_public_service(db_session, slug="synthetic-inactive", state_codes=["CHH"], payable_in_mobile=False)
    create_synthetic_public_service(db_session, slug="synthetic-not-user-facing", state_codes=["CHH"], visible_on_mobile=False)
    create_synthetic_public_service(
        db_session,
        slug="synthetic-rejected",
        state_codes=["CHH"],
        capability_status=CapabilityStatus.REJECTED.value,
    )

    response = client.get("/service-catalog?state_code=MX-CHH&include_unavailable=true")

    assert response.status_code == 200
    assert response.json()["services"] == []


def test_public_catalog_response_omits_internal_provider_and_tekae_metadata(
    client: TestClient,
    db_session: Session,
) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-redaction", state_codes=["CHH"])

    response = client.get("/service-catalog?state_code=MX-CHH")

    assert response.status_code == 200
    body = response.json()
    flattened_keys = collect_keys(body)
    flattened_values = collect_string_values(body)
    forbidden_keys = {
        "menu",
        "categoria",
        "carrier",
        "provider_id",
        "provider_ids",
        "provider_service_code",
        "sourceProviderServiceId",
        "raw_payload",
        "raw_payloads",
        "uid",
        "password",
        "token",
        "accessToken",
        "production_url",
        "commercial_terms",
    }
    assert flattened_keys.isdisjoint(forbidden_keys)
    assert "synthetic_internal_provider" not in flattened_values
    assert "internal-provider-service-code" not in flattened_values


def test_public_catalog_keeps_existing_mobile_required_fields(client: TestClient, db_session: Session) -> None:
    create_synthetic_public_service(db_session, slug="synthetic-mobile-fields", state_codes=["CHH"])

    response = client.get("/service-catalog?state_code=MX-CHH")

    assert response.status_code == 200
    service = response.json()["services"][0]
    assert {
        "id",
        "display_name",
        "slug",
        "category",
        "icon_key",
        "is_national",
        "coverage_status",
        "visible_on_mobile",
        "payable_in_mobile",
        "reference_only",
        "disclaimer",
        "coverage",
    }.issubset(service)


def assert_no_legacy_state_values(values: list[str]) -> None:
    legacy_codes = {"CHH", "COA", "NLE", "CMX", "JAL"}
    assert all(value.startswith("MX-") for value in values)
    assert all(value not in legacy_codes for value in values)


def collect_keys(value) -> set[str]:
    if isinstance(value, dict):
        keys = set(value)
        for item in value.values():
            keys.update(collect_keys(item))
        return keys
    if isinstance(value, list):
        keys: set[str] = set()
        for item in value:
            keys.update(collect_keys(item))
        return keys
    return set()


def collect_string_values(value) -> set[str]:
    if isinstance(value, str):
        return {value}
    if isinstance(value, dict):
        values: set[str] = set()
        for item in value.values():
            values.update(collect_string_values(item))
        return values
    if isinstance(value, list):
        values: set[str] = set()
        for item in value:
            values.update(collect_string_values(item))
        return values
    return set()
