import { apiRequest } from './api';
import type { CoverageMapState, ServiceCatalogItem } from '../types';

type ServiceCategoryResponse = {
  id: number;
  code: string;
  name: string;
  display_order: number;
};

type ServiceCatalogItemResponse = {
  id: number;
  display_name: string;
  slug: string;
  category: string;
  icon_key: string;
  description?: string;
  is_national: boolean;
  coverage?: ServiceCatalogItem['coverage'];
  coverage_mode?: ServiceCatalogItem['coverageMode'];
  coverage_states?: string[];
  is_active?: boolean;
  is_user_facing?: boolean;
  coverage_status: ServiceCatalogItem['coverageStatus'];
  provider_capability_status?: ServiceCatalogItem['providerCapabilityStatus'];
  visible_on_mobile: boolean;
  payable_in_mobile: boolean;
  reference_only: boolean;
  disclaimer: string;
};

type ServiceCatalogListResponse = {
  services: ServiceCatalogItemResponse[];
  count: number;
  disclaimer?: string;
};

type CoverageMapServiceResponse = {
  id: number;
  display_name: string;
  slug: string;
  category: string;
  coverage_status: ServiceCatalogItem['coverageStatus'];
  payable_in_mobile: boolean;
  reference_only: boolean;
};

type CoverageMapStateResponse = {
  state_code: string;
  state_name: string;
  reference_services: CoverageMapServiceResponse[];
  payable_services: CoverageMapServiceResponse[];
  reference_only: boolean;
  payment_availability_not_guaranteed: boolean;
  disclaimer: string;
};

export function getServiceCatalog(filters: { stateCode?: string; category?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.stateCode) params.set('state_code', filters.stateCode);
  if (filters.category) params.set('category', filters.category);
  const query = params.toString();
  return apiRequest<ServiceCatalogListResponse>(`/service-catalog${query ? `?${query}` : ''}`).then((response) =>
    response.services.map(mapServiceCatalogItem),
  );
}

export function getServiceCategories() {
  return apiRequest<ServiceCategoryResponse[]>('/service-categories').then((categories) =>
    categories.map((category) => ({
      id: category.id,
      code: category.code,
      name: category.name,
      displayOrder: category.display_order,
    })),
  );
}

export function getCoverageByState(stateCode: string) {
  return apiRequest<CoverageMapStateResponse>(`/coverage-map/states/${stateCode}`).then(mapCoverageMapState);
}

function mapServiceCatalogItem(item: ServiceCatalogItemResponse): ServiceCatalogItem {
  return {
    id: `${item.id}`,
    displayName: item.display_name,
    slug: item.slug,
    category: item.category,
    iconKey: item.icon_key,
    description: item.description,
    isNational: item.is_national,
    coverage: item.coverage,
    coverageMode: item.coverage?.mode ?? item.coverage_mode,
    coverageStates: item.coverage?.states ?? item.coverage_states,
    isActive: item.is_active,
    isUserFacing: item.is_user_facing,
    coverageStatus: item.coverage_status,
    providerCapabilityStatus: item.provider_capability_status,
    visibleOnMobile: item.visible_on_mobile,
    payableInMobile: item.payable_in_mobile,
    referenceOnly: item.reference_only,
    disclaimer: item.disclaimer,
  };
}

function mapCoverageMapState(state: CoverageMapStateResponse): CoverageMapState {
  const mapCoverageService = (item: CoverageMapServiceResponse): ServiceCatalogItem => ({
    id: `${item.id}`,
    displayName: item.display_name,
    slug: item.slug,
    category: item.category,
    iconKey: 'other',
    isNational: false,
    coverageStatus: item.coverage_status,
    visibleOnMobile: item.payable_in_mobile,
    payableInMobile: item.payable_in_mobile,
    referenceOnly: item.reference_only,
    disclaimer: state.disclaimer,
  });

  return {
    stateCode: state.state_code,
    stateName: state.state_name,
    referenceServices: state.reference_services.map(mapCoverageService),
    payableServices: state.payable_services.map(mapCoverageService),
    referenceOnly: state.reference_only,
    paymentAvailabilityNotGuaranteed: state.payment_availability_not_guaranteed,
    disclaimer: state.disclaimer,
  };
}
