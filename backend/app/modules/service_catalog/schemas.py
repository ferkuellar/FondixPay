from datetime import datetime

from pydantic import BaseModel, Field


class ServiceCategoryRead(BaseModel):
    id: int
    code: str
    name: str
    display_order: int

    model_config = {"from_attributes": True}


class ProviderServiceCapabilityRead(BaseModel):
    provider_name: str
    provider_service_code: str | None = None
    supports_reference_validation: bool
    supports_amount_lookup: bool
    supports_payment_execution: bool
    supports_receipt: bool
    currency: str
    status: str
    notes: str | None = None

    model_config = {"from_attributes": True}


class ServiceCoverageByStateRead(BaseModel):
    state_code: str
    state_name: str
    coverage_status: str
    source: str
    notes: str | None = None

    model_config = {"from_attributes": True}


class PublicServiceCoverageRead(BaseModel):
    mode: str
    states: list[str] = Field(default_factory=list)
    label: str | None = None


class ServiceCatalogItemRead(BaseModel):
    id: int
    display_name: str
    slug: str
    category: str
    icon_key: str
    description: str | None = None
    is_national: bool
    coverage_status: str
    visible_on_mobile: bool
    payable_in_mobile: bool
    reference_only: bool = True
    coverage: PublicServiceCoverageRead
    disclaimer: str


class ServiceCatalogItemAdminRead(ServiceCatalogItemRead):
    visible_on_landing: bool
    visible_on_admin: bool
    show_in_coverage_map: bool
    is_mock: bool
    coverage_states: list[ServiceCoverageByStateRead] = Field(default_factory=list)
    provider_capabilities: list[ProviderServiceCapabilityRead] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class ServiceCatalogListResponse(BaseModel):
    services: list[ServiceCatalogItemRead] = Field(default_factory=list)
    count: int
    reference_only: bool = False
    payment_availability_not_guaranteed: bool = False
    disclaimer: str | None = None


class AdminServiceCatalogListResponse(BaseModel):
    services: list[ServiceCatalogItemAdminRead] = Field(default_factory=list)
    count: int


class CoverageMapServiceRead(BaseModel):
    id: int
    display_name: str
    slug: str
    category: str
    coverage_status: str
    payable_in_mobile: bool
    reference_only: bool = True


class CoverageMapStateRead(BaseModel):
    state_code: str
    state_name: str
    reference_services: list[CoverageMapServiceRead] = Field(default_factory=list)
    payable_services: list[CoverageMapServiceRead] = Field(default_factory=list)
    reference_only: bool = True
    payment_availability_not_guaranteed: bool = True
    disclaimer: str


class CoverageMapResponse(BaseModel):
    states: list[CoverageMapStateRead] = Field(default_factory=list)
    reference_only: bool = True
    payment_availability_not_guaranteed: bool = True
    national_reference_count: int
    disclaimer: str


class ServiceCatalogPatch(BaseModel):
    visible_on_landing: bool | None = None
    visible_on_mobile: bool | None = None
    payable_in_mobile: bool | None = None
    coverage_status: str | None = None
    notes: str | None = Field(default=None, max_length=1000)

class ServicePayableValidationRead(BaseModel):
    service_id: int
    state_code: str | None = None
    payable: bool
    reasons: list[str] = Field(default_factory=list)
