from hashlib import sha256

from app.modules.notifications.providers.whatsapp_errors import WhatsAppProviderError
from app.modules.notifications.providers.whatsapp_interface import WhatsAppTemplateMessageResult


class WhatsAppMockProvider:
    provider_name = "whatsapp_mock"

    def __init__(self, scenario: str = "success") -> None:
        self.scenario = scenario

    def send_template_message(
        self,
        recipient_phone: str,
        template_name: str,
        template_params: dict,
        idempotency_key: str,
        correlation_id: str | None = None,
    ) -> WhatsAppTemplateMessageResult:
        if self.scenario == "invalid_recipient":
            raise WhatsAppProviderError("invalid_recipient", "El destinatario no es valido para WhatsApp.")
        if self.scenario == "provider_unavailable":
            raise WhatsAppProviderError("provider_unavailable", "WhatsApp no esta disponible temporalmente.")
        if self.scenario == "timeout":
            raise WhatsAppProviderError("timeout", "WhatsApp no respondio a tiempo.")
        if self.scenario == "template_rejected":
            raise WhatsAppProviderError("template_rejected", "El template fue rechazado por el proveedor.")

        digest = sha256(f"{template_name}:{idempotency_key}".encode("utf-8")).hexdigest()[:24]
        return WhatsAppTemplateMessageResult(
            provider_name=self.provider_name,
            provider_message_id=f"mock-wa-{digest}",
        )
