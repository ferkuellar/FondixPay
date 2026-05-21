from app.modules.providers.prontipagos.interface import ProntipagosClient
from app.modules.providers.prontipagos.mock_client import MockProntipagosClient
from app.modules.providers.prontipagos.schemas import ServicePaymentRequest, ServicePaymentResponse


class ProntipagosSandboxAdapter:
    def __init__(self, client: ProntipagosClient | None = None) -> None:
        self.client = client or MockProntipagosClient()

    def execute_service_payment(self, request: ServicePaymentRequest) -> ServicePaymentResponse:
        return self.client.execute_service_payment(request)
