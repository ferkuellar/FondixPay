from typing import Protocol

from app.modules.providers.card_processor.schemas import (
    CardChargeRequest,
    CardChargeResponse,
    CardTokenizationMockRequest,
    CardTokenizationMockResponse,
)


class CardProcessorClient(Protocol):
    def tokenize_card_mock(self, request: CardTokenizationMockRequest) -> CardTokenizationMockResponse: ...

    def charge_card(self, request: CardChargeRequest) -> CardChargeResponse: ...

    def get_charge_status(self, provider_transaction_id: str) -> CardChargeResponse: ...

    def refund_or_void_future(self, provider_transaction_id: str) -> None: ...
