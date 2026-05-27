from enum import StrEnum


class CoverageStatus(StrEnum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    COMING_SOON = "coming_soon"
    PROVIDER_PENDING = "provider_pending"
    TEMPORARILY_DISABLED = "temporarily_disabled"
    MAINTENANCE = "maintenance"
    DEPRECATED = "deprecated"
    UNKNOWN = "unknown"
    TO_CONFIRM = "to_confirm"


class CapabilityStatus(StrEnum):
    CONFIRMED = "confirmed"
    PENDING = "pending"
    REJECTED = "rejected"
    UNAVAILABLE = "unavailable"
    UNKNOWN = "unknown"
    TO_CONFIRM = "to_confirm"


STATE_NAMES: dict[str, str] = {
    "AGS": "Aguascalientes",
    "BCN": "Baja California",
    "BCS": "Baja California Sur",
    "CAM": "Campeche",
    "CHP": "Chiapas",
    "CHH": "Chihuahua",
    "CMX": "Ciudad de Mexico",
    "COA": "Coahuila",
    "COL": "Colima",
    "DGO": "Durango",
    "GTO": "Guanajuato",
    "GRO": "Guerrero",
    "HGO": "Hidalgo",
    "JAL": "Jalisco",
    "MEX": "Estado de Mexico",
    "MCH": "Michoacan",
    "MOR": "Morelos",
    "NAY": "Nayarit",
    "NLE": "Nuevo Leon",
    "OAX": "Oaxaca",
    "PUE": "Puebla",
    "QRO": "Queretaro",
    "ROO": "Quintana Roo",
    "SLP": "San Luis Potosi",
    "SIN": "Sinaloa",
    "SON": "Sonora",
    "TAB": "Tabasco",
    "TAM": "Tamaulipas",
    "TLX": "Tlaxcala",
    "VER": "Veracruz",
    "YUC": "Yucatan",
    "ZAC": "Zacatecas",
}


PUBLIC_COVERAGE_DISCLAIMER = (
    "Cobertura referencial sujeta a disponibilidad del proveedor. "
    "Los servicios disponibles para pago se habilitaran conforme a validacion operativa."
)

