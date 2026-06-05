from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any, Mapping


class CoverageMode(StrEnum):
    NATIONAL = "NATIONAL"
    STATE = "STATE"
    CITY_FUTURE = "CITY_FUTURE"
    DISABLED = "DISABLED"
    UNKNOWN_REVIEW_REQUIRED = "UNKNOWN_REVIEW_REQUIRED"


class TekaeCatalogValidationError(ValueError):
    def __init__(self, message: str, *, missing_columns: list[str] | None = None, invalid_fields: dict[str, str] | None = None) -> None:
        super().__init__(message)
        self.missing_columns = missing_columns or []
        self.invalid_fields = invalid_fields or {}


@dataclass(frozen=True)
class NormalizedServiceCatalogItem:
    service_id: str
    canonical_slug: str
    display_name: str
    short_name: str
    provider_name: str
    provider_code: str | None
    category: str
    subcategory: str | None
    service_type: str | None
    source_provider: str
    source_provider_service_id: str
    provider_metadata: dict[str, str | None]
    coverage_mode: CoverageMode
    coverage_states: list[str]
    coverage_cities: list[str] = field(default_factory=list)
    is_national: bool = False
    is_active: bool = True
    visible_on_mobile: bool = False
    payable_in_mobile: bool = False
    review_status: str | None = None
    source_catalog_version: str | None = None
    validation_warnings: list[str] = field(default_factory=list)


REQUIRED_TEKAe_CATALOG_COLUMNS = frozenset(
    {
        "product_id",
        "tekae_product_number",
        "raw_category",
        "normalized_category",
        "provider_name",
        "provider_slug",
        "coverage_scope",
        "coverage_code",
        "allowed_state_codes",
        "is_national",
        "review_status",
        "menu",
        "categoria",
        "carrier",
    }
)

VALID_MX_STATE_CODES = frozenset(
    {
        "MX-AGU",
        "MX-BCN",
        "MX-BCS",
        "MX-CAM",
        "MX-CHP",
        "MX-CHH",
        "MX-CMX",
        "MX-COA",
        "MX-COL",
        "MX-DUR",
        "MX-GUA",
        "MX-GRO",
        "MX-HID",
        "MX-JAL",
        "MX-MEX",
        "MX-MIC",
        "MX-MOR",
        "MX-NAY",
        "MX-NLE",
        "MX-OAX",
        "MX-PUE",
        "MX-QUE",
        "MX-ROO",
        "MX-SLP",
        "MX-SIN",
        "MX-SON",
        "MX-TAB",
        "MX-TAM",
        "MX-TLA",
        "MX-VER",
        "MX-YUC",
        "MX-ZAC",
    }
)

SHORT_STATE_CODE_MAP = {
    "AGS": "MX-AGU",
    "AGU": "MX-AGU",
    "BCN": "MX-BCN",
    "BCS": "MX-BCS",
    "CAM": "MX-CAM",
    "CHP": "MX-CHP",
    "CHH": "MX-CHH",
    "CMX": "MX-CMX",
    "CDMX": "MX-CMX",
    "COA": "MX-COA",
    "COL": "MX-COL",
    "DGO": "MX-DUR",
    "DUR": "MX-DUR",
    "GTO": "MX-GUA",
    "GUA": "MX-GUA",
    "GRO": "MX-GRO",
    "HGO": "MX-HID",
    "HID": "MX-HID",
    "JAL": "MX-JAL",
    "MEX": "MX-MEX",
    "MCH": "MX-MIC",
    "MIC": "MX-MIC",
    "MOR": "MX-MOR",
    "NAY": "MX-NAY",
    "NLE": "MX-NLE",
    "OAX": "MX-OAX",
    "PUE": "MX-PUE",
    "QRO": "MX-QUE",
    "QUE": "MX-QUE",
    "ROO": "MX-ROO",
    "SLP": "MX-SLP",
    "SIN": "MX-SIN",
    "SON": "MX-SON",
    "TAB": "MX-TAB",
    "TAM": "MX-TAM",
    "TLX": "MX-TLA",
    "TLA": "MX-TLA",
    "VER": "MX-VER",
    "YUC": "MX-YUC",
    "ZAC": "MX-ZAC",
}

DISABLED_REVIEW_STATUSES = frozenset({"disabled", "inactive", "rejected", "blocked", "not_supported"})
ACTIVE_REVIEW_STATUSES = frozenset({"approved", "active", "ready", "validated"})
UNKNOWN_REVIEW_STATUSES = frozenset({"review_required", "pending_review", "pending", "unknown", "to_confirm", ""})
NATIONAL_TOKENS = frozenset({"NATIONAL", "MX-ALL", "ALL", "NATIONWIDE"})
DISABLED_TOKENS = frozenset({"DISABLED", "INACTIVE", "REJECTED", "BLOCKED", "NOT_SUPPORTED"})
STATE_TOKENS = frozenset({"STATE", "STATES", "REGIONAL"})
CITY_TOKENS = frozenset({"CITY", "CITY_FUTURE", "MUNICIPALITY", "MUNICIPAL"})


def validate_required_columns(row: Mapping[str, Any]) -> None:
    missing = sorted(column for column in REQUIRED_TEKAe_CATALOG_COLUMNS if column not in row)
    if missing:
        raise TekaeCatalogValidationError("Missing required Tekae catalog columns", missing_columns=missing)


def normalize_tekae_catalog_row(row: Mapping[str, Any], *, source_catalog_version: str | None = None) -> NormalizedServiceCatalogItem:
    validate_required_columns(row)

    product_id = _required_text(row, "product_id")
    provider_service_id = _required_text(row, "tekae_product_number")
    provider_name = _required_text(row, "provider_name")
    provider_slug = _optional_text(row.get("provider_slug"))
    category = _required_text(row, "normalized_category")
    raw_category = _optional_text(row.get("raw_category"))
    display_name = _derive_display_name(row, provider_name)
    review_status = _normalize_review_status(row.get("review_status"))
    coverage_mode, coverage_states, warnings = _normalize_coverage(row)

    disabled_by_review = review_status in DISABLED_REVIEW_STATUSES
    if disabled_by_review:
        coverage_mode = CoverageMode.DISABLED
        coverage_states = []
        warnings.append("review_status disables user-facing exposure")

    is_national = coverage_mode == CoverageMode.NATIONAL or "MX-ALL" in coverage_states
    is_active = coverage_mode not in {CoverageMode.DISABLED, CoverageMode.UNKNOWN_REVIEW_REQUIRED} and not disabled_by_review
    visible_on_mobile = is_active and review_status in ACTIVE_REVIEW_STATUSES

    return NormalizedServiceCatalogItem(
        service_id=f"tekae:{provider_service_id}",
        canonical_slug=_slugify("-".join(part for part in [provider_slug, display_name, provider_service_id] if part)),
        display_name=display_name,
        short_name=_optional_text(row.get("short_name")) or display_name,
        provider_name=provider_name,
        provider_code=provider_slug,
        category=category,
        subcategory=raw_category,
        service_type=_optional_text(row.get("payment_type")),
        source_provider="TEKAE",
        source_provider_service_id=provider_service_id,
        provider_metadata={
            "menu": _optional_text(row.get("menu")),
            "categoria": _optional_text(row.get("categoria")),
            "carrier": _optional_text(row.get("carrier")),
            "provider_slug": provider_slug,
        },
        coverage_mode=coverage_mode,
        coverage_states=coverage_states,
        coverage_cities=[],
        is_national=is_national,
        is_active=is_active,
        visible_on_mobile=visible_on_mobile,
        payable_in_mobile=False,
        review_status=review_status,
        source_catalog_version=source_catalog_version,
        validation_warnings=warnings,
    )


def normalize_tekae_catalog_rows(rows: list[Mapping[str, Any]], *, source_catalog_version: str | None = None) -> list[NormalizedServiceCatalogItem]:
    return [normalize_tekae_catalog_row(row, source_catalog_version=source_catalog_version) for row in rows]


def normalize_state_code(value: str) -> str:
    code = value.strip().upper()
    if not code:
        raise TekaeCatalogValidationError("Invalid empty state code", invalid_fields={"state_code": value})
    if code == "MX-ALL" or code == "NATIONAL":
        return "MX-ALL"
    if code in VALID_MX_STATE_CODES:
        return code
    if code in SHORT_STATE_CODE_MAP:
        return SHORT_STATE_CODE_MAP[code]
    raise TekaeCatalogValidationError("Invalid state code", invalid_fields={"state_code": value})


def _normalize_coverage(row: Mapping[str, Any]) -> tuple[CoverageMode, list[str], list[str]]:
    scope = _token(row.get("coverage_scope"))
    coverage_code = _token(row.get("coverage_code"))
    allowed_codes = _split_codes(row.get("allowed_state_codes"))
    is_national = _truthy(row.get("is_national"))
    warnings: list[str] = []

    if scope in DISABLED_TOKENS or coverage_code in DISABLED_TOKENS:
        return CoverageMode.DISABLED, [], warnings

    national_requested = is_national or scope in NATIONAL_TOKENS or coverage_code in NATIONAL_TOKENS or any(
        _token(code) in NATIONAL_TOKENS for code in allowed_codes
    )
    if national_requested:
        return CoverageMode.NATIONAL, ["MX-ALL"], warnings

    if scope in CITY_TOKENS:
        states = _normalize_state_codes(allowed_codes or ([coverage_code] if coverage_code else []))
        return CoverageMode.CITY_FUTURE, states, warnings

    state_candidates = allowed_codes.copy()
    if coverage_code and coverage_code not in {"UNKNOWN", "REVIEW", "REVIEW_REQUIRED", "TO_CONFIRM"}:
        state_candidates.append(coverage_code)

    if scope in STATE_TOKENS or state_candidates:
        if not state_candidates:
            warnings.append("state coverage missing allowed_state_codes")
            return CoverageMode.UNKNOWN_REVIEW_REQUIRED, [], warnings
        states = _normalize_state_codes(state_candidates)
        if "MX-ALL" in states:
            return CoverageMode.NATIONAL, ["MX-ALL"], warnings
        return CoverageMode.STATE, states, warnings

    warnings.append("coverage is missing or ambiguous")
    return CoverageMode.UNKNOWN_REVIEW_REQUIRED, [], warnings


def _normalize_state_codes(values: list[str]) -> list[str]:
    normalized: list[str] = []
    for value in values:
        state_code = normalize_state_code(value)
        if state_code not in normalized:
            normalized.append(state_code)
    return normalized


def _split_codes(value: Any) -> list[str]:
    text = _optional_text(value)
    if not text:
        return []
    return [part.strip() for part in re.split(r"[,;|]", text) if part.strip()]


def _derive_display_name(row: Mapping[str, Any], provider_name: str) -> str:
    for key in ("display_name", "name", "service_name", "provider_name"):
        value = _optional_text(row.get(key))
        if value:
            return value
    return provider_name


def _required_text(row: Mapping[str, Any], field_name: str) -> str:
    value = _optional_text(row.get(field_name))
    if not value:
        raise TekaeCatalogValidationError("Missing required Tekae catalog value", invalid_fields={field_name: "empty"})
    return value


def _optional_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _normalize_review_status(value: Any) -> str:
    return (_optional_text(value) or "").strip().lower()


def _token(value: Any) -> str:
    return (_optional_text(value) or "").upper().replace(" ", "_")


def _truthy(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "yes", "y", "si", "s"}


def _slugify(value: str) -> str:
    normalized = value.lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return normalized.strip("-")
