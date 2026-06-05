import pytest

from app.modules.service_catalog.tekae_normalizer import (
    CoverageMode,
    TekaeCatalogValidationError,
    normalize_state_code,
    normalize_tekae_catalog_row,
)


def synthetic_row(**overrides):
    row = {
        "product_id": "synthetic-product-001",
        "tekae_product_number": "SYN-001",
        "raw_category": "Synthetic raw category",
        "normalized_category": "Utilities",
        "provider_name": "Synthetic Utility",
        "provider_slug": "synthetic-utility",
        "coverage_scope": "STATE",
        "coverage_code": "",
        "allowed_state_codes": "MX-CHH",
        "is_national": False,
        "review_status": "approved",
        "menu": "2",
        "categoria": "synthetic-bills",
        "carrier": "synthetic-carrier",
        "payment_type": "bill_payment",
    }
    row.update(overrides)
    return row


def test_national_service_via_mx_all() -> None:
    item = normalize_tekae_catalog_row(
        synthetic_row(coverage_scope="STATE", coverage_code="MX-ALL", allowed_state_codes="", is_national=False)
    )

    assert item.coverage_mode == CoverageMode.NATIONAL
    assert item.coverage_states == ["MX-ALL"]
    assert item.is_national is True
    assert item.visible_on_mobile is True


def test_national_service_via_is_national_true() -> None:
    item = normalize_tekae_catalog_row(synthetic_row(coverage_scope="", coverage_code="", allowed_state_codes="", is_national="true"))

    assert item.coverage_mode == CoverageMode.NATIONAL
    assert item.coverage_states == ["MX-ALL"]
    assert item.is_national is True


def test_state_service_with_one_state_normalizes_short_code() -> None:
    item = normalize_tekae_catalog_row(synthetic_row(allowed_state_codes="CHH"))

    assert item.coverage_mode == CoverageMode.STATE
    assert item.coverage_states == ["MX-CHH"]
    assert item.is_national is False


def test_state_service_with_multiple_states() -> None:
    item = normalize_tekae_catalog_row(synthetic_row(allowed_state_codes="MX-CHH, COA, MX-NLE"))

    assert item.coverage_mode == CoverageMode.STATE
    assert item.coverage_states == ["MX-CHH", "MX-COA", "MX-NLE"]


def test_missing_required_column_raises_validation_error() -> None:
    row = synthetic_row()
    row.pop("carrier")

    with pytest.raises(TekaeCatalogValidationError) as exc:
        normalize_tekae_catalog_row(row)

    assert exc.value.missing_columns == ["carrier"]


def test_invalid_state_code_raises_validation_error() -> None:
    with pytest.raises(TekaeCatalogValidationError) as exc:
        normalize_tekae_catalog_row(synthetic_row(allowed_state_codes="MX-XYZ"))

    assert exc.value.invalid_fields == {"state_code": "MX-XYZ"}


def test_unknown_coverage_becomes_review_required_not_national() -> None:
    item = normalize_tekae_catalog_row(
        synthetic_row(coverage_scope="", coverage_code="", allowed_state_codes="", is_national=False, review_status="pending_review")
    )

    assert item.coverage_mode == CoverageMode.UNKNOWN_REVIEW_REQUIRED
    assert item.coverage_states == []
    assert item.is_national is False
    assert item.visible_on_mobile is False
    assert "coverage is missing or ambiguous" in item.validation_warnings


def test_disabled_or_rejected_row_becomes_not_user_facing() -> None:
    item = normalize_tekae_catalog_row(synthetic_row(review_status="rejected"))

    assert item.coverage_mode == CoverageMode.DISABLED
    assert item.is_active is False
    assert item.visible_on_mobile is False
    assert item.payable_in_mobile is False


def test_provider_metadata_mapping_keeps_tekae_fields_out_of_business_identity() -> None:
    item = normalize_tekae_catalog_row(synthetic_row(menu="3", categoria="streaming", carrier="movie-pass"))

    assert item.source_provider == "TEKAE"
    assert item.source_provider_service_id == "SYN-001"
    assert item.provider_metadata == {
        "menu": "3",
        "categoria": "streaming",
        "carrier": "movie-pass",
        "provider_slug": "synthetic-utility",
    }
    assert item.service_id == "tekae:SYN-001"
    assert item.canonical_slug.startswith("synthetic-utility-")
    assert "3" not in item.canonical_slug
    assert "streaming" not in item.canonical_slug


def test_normalizer_requires_no_tekae_credentials_or_tokens() -> None:
    item = normalize_tekae_catalog_row(synthetic_row())

    assert item.provider_metadata["menu"] == "2"
    assert "uid" not in item.provider_metadata
    assert "password" not in item.provider_metadata
    assert "accessToken" not in item.provider_metadata


def test_normalize_state_code_outputs_mx_codes() -> None:
    assert normalize_state_code("CHH") == "MX-CHH"
    assert normalize_state_code("MX-COA") == "MX-COA"
    assert normalize_state_code("NATIONAL") == "MX-ALL"
