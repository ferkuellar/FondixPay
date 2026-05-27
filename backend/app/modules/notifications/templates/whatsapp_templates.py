from datetime import datetime

from app.modules.receipts.schemas import ReceiptProofRead

PAYMENT_SUCCESS_TEMPLATE = "fondix_pago_exitoso"

_MONTHS_ES = {
    1: "ene",
    2: "feb",
    3: "mar",
    4: "abr",
    5: "may",
    6: "jun",
    7: "jul",
    8: "ago",
    9: "sep",
    10: "oct",
    11: "nov",
    12: "dic",
}


def build_payment_success_template(proof: ReceiptProofRead, app_link: str | None = None) -> dict:
    service_name = f"{proof.service_provider_name} · {proof.service_name}"
    paid_at = proof.confirmed_at or proof.issued_at
    return {
        "business_name": "FONDIX PAY",
        "verified_label": "Negocio verificado",
        "title": "Pago realizado",
        "short_success_copy": "Ya quedó! 🙌",
        "service_name": service_name,
        "amount_formatted": _format_minor_amount(proof.total_minor),
        "currency": proof.currency,
        "receipt_reference": proof.internal_reference,
        "paid_at_formatted": _format_paid_at(paid_at),
        "final_copy": "Tu comprobante oficial está guardado en la app FONDIX PAY.",
        "cta_label": "Ver en la app",
        "app_link": app_link or "fondixpay://receipts",
        "allowed_fields": [
            "service_name",
            "amount_formatted",
            "currency",
            "receipt_reference",
            "paid_at_formatted",
            "status",
            "app_link",
        ],
        "visual_style": {
            "header": "teal_verified_business",
            "card": "white_rich_message",
            "tone": "professional_clear_trustworthy",
        },
    }


def _format_minor_amount(amount_minor: int) -> str:
    return f"${amount_minor / 100:,.2f}"


def _format_paid_at(value: datetime) -> str:
    month = _MONTHS_ES.get(value.month, f"{value.month:02d}")
    return f"{value.day:02d} {month} {value.year} · {value.hour:02d}:{value.minute:02d}"
