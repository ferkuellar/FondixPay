import type { ServiceCatalogItem } from '../types';

const HIDDEN_COVERAGE_MODES = new Set(['UNKNOWN_REVIEW_REQUIRED', 'DISABLED']);
const HIDDEN_COVERAGE_STATUSES = new Set([
  'unavailable',
  'provider_pending',
  'temporarily_disabled',
  'maintenance',
  'deprecated',
  'unknown',
  'to_confirm',
]);
const HIDDEN_CAPABILITY_STATUSES = new Set(['rejected', 'unavailable', 'unknown', 'to_confirm']);

export function filterServicesBySelectedState(
  services: ServiceCatalogItem[],
  selectedStateCode: string | null | undefined,
): ServiceCatalogItem[] {
  if (!selectedStateCode) return [];

  return services.filter((service) => {
    if (!isUserFacingService(service)) return false;
    if (isNationalService(service)) return true;
    return service.coverageMode === 'STATE' && service.coverageStates?.includes(selectedStateCode);
  });
}

function isUserFacingService(service: ServiceCatalogItem) {
  if (!service.visibleOnMobile || !service.payableInMobile) return false;
  if (service.isActive === false || service.isUserFacing === false) return false;
  if (service.coverageMode && HIDDEN_COVERAGE_MODES.has(service.coverageMode)) return false;
  if (HIDDEN_COVERAGE_STATUSES.has(service.coverageStatus)) return false;
  if (service.providerCapabilityStatus && HIDDEN_CAPABILITY_STATUSES.has(service.providerCapabilityStatus)) return false;
  return true;
}

function isNationalService(service: ServiceCatalogItem) {
  return service.isNational || service.coverageMode === 'NATIONAL' || service.coverageStates?.includes('MX-ALL');
}
