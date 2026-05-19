import { apiRequest } from './api';

type ServiceProviderResponse = {
  id: number;
  name: string;
  display_name: string;
  category: string;
  icon_key: string;
  integration_type: string;
  is_active: boolean;
  sort_order: number;
};

export function listServiceProviders() {
  return apiRequest<ServiceProviderResponse[]>('/service-providers').then((providers) => providers.map(mapProvider));
}

export function listServiceProvidersByCategory(category: string) {
  return apiRequest<ServiceProviderResponse[]>(`/service-providers/category/${category}`).then((providers) =>
    providers.map(mapProvider),
  );
}

function mapProvider(provider: ServiceProviderResponse) {
  return {
    id: `${provider.id}`,
    name: provider.name,
    displayName: provider.display_name,
    category: provider.category,
    iconKey: provider.icon_key,
    integrationType: provider.integration_type,
    isActive: provider.is_active,
    sortOrder: provider.sort_order,
    icon: iconFor(provider.icon_key),
  };
}

function iconFor(iconKey: string) {
  const icons: Record<string, string> = {
    electricity: '⚡',
    phone: '📱',
    internet: '📶',
    water: '💧',
    gas: '🔥',
    tv: '📺',
  };
  return icons[iconKey] ?? '💳';
}
