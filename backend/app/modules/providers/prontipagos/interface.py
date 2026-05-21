from typing import Protocol

from app.modules.providers.prontipagos.schemas import (
    ProntipagosAmountResponse,
    ProntipagosReferenceRequest,
    ServicePaymentRequest,
    ServicePaymentResponse,
)


class ProntipagosClient(Protocol):
    def validate_reference(self, request: ProntipagosReferenceRequest) -> bool: ...

    def lookup_amount(self, request: ProntipagosReferenceRequest) -> ProntipagosAmountResponse: ...

    def execute_service_payment(self, request: ServicePaymentRequest) -> ServicePaymentResponse: ...

    def get_service_payment_status(self, provider_reference: str) -> ServicePaymentResponse: ...
