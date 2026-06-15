import httpx

from app.modules.notifications.providers.sms_errors import SmsProviderError
from app.modules.notifications.providers.sms_interface import SmsResult

_TWILIO_API = "https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"


def _to_e164(phone: str) -> str:
    """Convert digits-only phone to E.164. Assumes Mexico (+52) when no country code present."""
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) == 10:
        return f"+52{digits}"
    if len(digits) == 12 and digits.startswith("52"):
        return f"+{digits}"
    return f"+{digits}"


class TwilioSmsProvider:
    provider_name = "twilio_sms"

    def __init__(self, account_sid: str, auth_token: str, from_number: str, timeout: int = 10) -> None:
        self._account_sid = account_sid
        self._auth_token = auth_token
        self._from_number = from_number
        self._timeout = timeout

    def send_sms(self, to: str, body: str) -> SmsResult:
        url = _TWILIO_API.format(sid=self._account_sid)
        try:
            response = httpx.post(
                url,
                data={"From": self._from_number, "To": _to_e164(to), "Body": body},
                auth=(self._account_sid, self._auth_token),
                timeout=self._timeout,
            )
            response.raise_for_status()
            return SmsResult(
                provider_name=self.provider_name,
                provider_message_id=response.json()["sid"],
            )
        except httpx.TimeoutException:
            raise SmsProviderError("timeout", "El servicio de SMS no respondio a tiempo.")
        except httpx.HTTPStatusError as exc:
            code = exc.response.status_code
            if code == 400:
                raise SmsProviderError("invalid_recipient", "Numero de telefono invalido para SMS.")
            if code in (401, 403):
                raise SmsProviderError("auth_failed", "Error de autenticacion con proveedor SMS.")
            raise SmsProviderError("provider_error", "Error al enviar el SMS.")
        except httpx.RequestError:
            raise SmsProviderError("network_error", "No se pudo conectar con el proveedor SMS.")
