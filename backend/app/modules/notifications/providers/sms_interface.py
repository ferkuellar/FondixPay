from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class SmsResult:
    provider_name: str
    provider_message_id: str


class SmsProvider(Protocol):
    provider_name: str

    def send_sms(self, to: str, body: str) -> SmsResult:
        ...
