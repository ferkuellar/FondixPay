from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator

from app.core.config import settings

router = APIRouter()

ConsultaTipo = Literal[
    "soporte_pago",
    "aclaracion_reembolso",
    "reporte_fraude",
    "arco_privacidad",
    "consulta_legal",
    "otro",
]

TIPO_LABELS: dict[str, str] = {
    "soporte_pago": "Soporte sobre un pago",
    "aclaracion_reembolso": "Solicitud de aclaración o reembolso",
    "reporte_fraude": "Reporte de fraude o uso no autorizado",
    "arco_privacidad": "Ejercicio de derechos ARCO / privacidad",
    "consulta_legal": "Consulta legal o aviso legal",
    "otro": "Otro",
}

RESEND_API_URL = "https://api.resend.com/emails"


class ContactPayload(BaseModel):
    tipo: ConsultaTipo
    nombre: str
    telefono: str
    correo: str | None = None
    folio: str | None = None
    mensaje: str

    @field_validator("nombre")
    @classmethod
    def nombre_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("nombre requerido")
        if len(v) > 160:
            raise ValueError("nombre demasiado largo")
        return v

    @field_validator("telefono")
    @classmethod
    def telefono_digits(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 10:
            raise ValueError("teléfono debe tener al menos 10 dígitos")
        return digits[:15]

    @field_validator("mensaje")
    @classmethod
    def mensaje_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("mensaje requerido")
        if len(v) > 4000:
            raise ValueError("mensaje demasiado largo")
        return v


def _build_email_html(payload: ContactPayload) -> str:
    tipo_label = TIPO_LABELS.get(payload.tipo, payload.tipo)
    correo_line = f"<tr><td><b>Correo</b></td><td>{payload.correo}</td></tr>" if payload.correo else ""
    folio_line = f"<tr><td><b>Folio</b></td><td>{payload.folio}</td></tr>" if payload.folio else ""
    return f"""
<table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:600px">
  <tr><td colspan="2" style="background:#020B2D;color:#fff;padding:18px 20px;font-size:18px;font-weight:700">
    Nuevo mensaje de contacto — FONDIX PAY
  </td></tr>
  <tr><td style="padding:12px 16px;border-bottom:1px solid #eee;width:160px"><b>Tipo</b></td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee">{tipo_label}</td></tr>
  <tr><td style="padding:12px 16px;border-bottom:1px solid #eee"><b>Nombre</b></td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee">{payload.nombre}</td></tr>
  <tr><td style="padding:12px 16px;border-bottom:1px solid #eee"><b>Teléfono</b></td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee">{payload.telefono}</td></tr>
  {correo_line}
  {folio_line}
  <tr><td style="padding:12px 16px;border-bottom:1px solid #eee;vertical-align:top"><b>Mensaje</b></td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;white-space:pre-wrap">{payload.mensaje}</td></tr>
</table>
"""


@router.post("/contact", status_code=status.HTTP_204_NO_CONTENT)
async def send_contact_form(payload: ContactPayload) -> None:
    if not settings.resend_api_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="contact_unavailable")

    tipo_label = TIPO_LABELS.get(payload.tipo, payload.tipo)
    body = {
        "from": settings.resend_from_email,
        "to": [settings.resend_to_email],
        "subject": f"[Contacto FondixPay] {tipo_label} — {payload.nombre}",
        "html": _build_email_html(payload),
        "reply_to": payload.correo if payload.correo else None,
    }
    if body["reply_to"] is None:
        del body["reply_to"]

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            RESEND_API_URL,
            headers={"Authorization": f"Bearer {settings.resend_api_key}", "Content-Type": "application/json"},
            json=body,
        )

    if response.status_code not in (200, 201):
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="contact_send_failed")
