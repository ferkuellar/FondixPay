from __future__ import annotations

from dataclasses import dataclass

from app.modules.service_catalog.constants import CapabilityStatus, CoverageStatus
from app.modules.service_catalog.models import ServiceCatalogItem


@dataclass(frozen=True)
class PublicCoverage:
    mode: str
    states: list[str]
    label: str


LEGACY_STATE_CODE_TO_CANONICAL: dict[str, str] = {
    "AGS": "MX-AGU",
    "BCN": "MX-BCN",
    "BCS": "MX-BCS",
    "CAM": "MX-CAM",
    "CHP": "MX-CHP",
    "CHH": "MX-CHH",
    "CMX": "MX-CMX",
    "COA": "MX-COA",
    "COL": "MX-COL",
    "DGO": "MX-DUR",
    "GTO": "MX-GUA",
    "GRO": "MX-GRO",
    "HGO": "MX-HID",
    "JAL": "MX-JAL",
    "MEX": "MX-MEX",
    "MCH": "MX-MIC",
    "MOR": "MX-MOR",
    "NAY": "MX-NAY",
    "NLE": "MX-NLE",
    "OAX": "MX-OAX",
    "PUE": "MX-PUE",
    "QRO": "MX-QUE",
    "ROO": "MX-ROO",
    "SLP": "MX-SLP",
    "SIN": "MX-SIN",
    "SON": "MX-SON",
    "TAB": "MX-TAB",
    "TAM": "MX-TAM",
    "TLX": "MX-TLA",
    "VER": "MX-VER",
    "YUC": "MX-YUC",
    "ZAC": "MX-ZAC",
}

CANONICAL_TO_LEGACY_STATE_CODE = {canonical: legacy for legacy, canonical in LEGACY_STATE_CODE_TO_CANONICAL.items()}
VALID_PUBLIC_STATE_CODES = frozenset(CANONICAL_TO_LEGACY_STATE_CODE)
NATIONAL_TOKENS = frozenset({"MX-ALL", "NATIONAL", "ALL", "NATIONWIDE"})


def normalize_public_state_code(value: str) -> str | None:
    code = value.strip().upper()
    if not code:
        return None
    if code in NATIONAL_TOKENS:
        return "MX-ALL"
    if code in VALID_PUBLIC_STATE_CODES:
        return code
    return LEGACY_STATE_CODE_TO_CANONICAL.get(code)


def storage_state_code_for_public_input(value: str | None) -> str | None:
    if value is None:
        return None
    canonical = normalize_public_state_code(value)
    if canonical is None or canonical == "MX-ALL":
        return None
    return CANONICAL_TO_LEGACY_STATE_CODE[canonical]


def public_coverage_for_item(item: ServiceCatalogItem) -> PublicCoverage:
    if item.is_national:
        return PublicCoverage(mode="NATIONAL", states=[], label="Disponible a nivel nacional")
    return PublicCoverage(
        mode="STATE",
        states=canonical_coverage_states(item),
        label="Disponible en estados seleccionados",
    )


def canonical_coverage_states(item: ServiceCatalogItem) -> list[str]:
    states: list[str] = []
    for coverage in item.coverage_states:
        if coverage.coverage_status != CoverageStatus.AVAILABLE.value:
            continue
        canonical = normalize_public_state_code(coverage.state_code)
        if canonical is None or canonical == "MX-ALL":
            continue
        if canonical not in states:
            states.append(canonical)
    return states


def matches_public_state(item: ServiceCatalogItem, canonical_state_code: str | None) -> bool:
    if canonical_state_code is None:
        return True
    if item.is_national:
        return True
    return canonical_state_code in canonical_coverage_states(item)


def is_public_catalog_item_available(item: ServiceCatalogItem) -> bool:
    if not item.visible_on_mobile or not item.payable_in_mobile:
        return False
    if item.coverage_status != CoverageStatus.AVAILABLE.value:
        return False
    if not item.is_national and not canonical_coverage_states(item):
        return False
    return any(
        capability.status == CapabilityStatus.CONFIRMED.value
        and capability.supports_payment_execution
        and capability.supports_receipt
        for capability in item.capabilities
    )
