from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class WhatsAppTemplateMessageResult:
    provider_name: str
    provider_message_id: str
    status: str = "sent"


class WhatsAppProvider(Protocol):
    provider_name: str

    def send_template_message(
        self,
        recipient_phone: str,
        template_name: str,
        template_params: dict,
        idempotency_key: str,
        correlation_id: str | None = None,
    ) -> WhatsAppTemplateMessageResult:
        ...
