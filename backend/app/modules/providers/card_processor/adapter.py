from app.modules.providers.card_processor.interface import CardProcessorClient
from app.modules.providers.card_processor.mock_client import MockCardProcessorClient
from app.modules.providers.card_processor.schemas import CardChargeRequest, CardChargeResponse


class CardProcessorSandboxAdapter:
    def __init__(self, client: CardProcessorClient | None = None) -> None:
        self.client = client or MockCardProcessorClient()

    def charge_card(self, request: CardChargeRequest) -> CardChargeResponse:
        return self.client.charge_card(request)
