import { TEKAE_ENABLED, TEKAE_MODE } from './tekae/constants';
import type { ProviderReadinessState } from '../types';

export const PROVIDER_PAYMENT_UNAVAILABLE_MESSAGE =
  'El servicio de pago está en preparación. Te avisaremos cuando esté disponible.' as const;

type ProviderReadinessPresentation = {
  state: ProviderReadinessState;
  title: string;
  message: string;
};

const appEnv = process.env.EXPO_PUBLIC_APP_ENV?.trim().toLowerCase();

export function isInternalDemoMode() {
  if (appEnv) {
    return appEnv === 'development' || appEnv === 'local' || appEnv === 'internal';
  }

  return process.env.NODE_ENV !== 'production';
}

export function isDemoPaymentEnabled() {
  return !TEKAE_ENABLED && isInternalDemoMode();
}

export function getProviderReadinessState(): ProviderReadinessState {
  if (!TEKAE_ENABLED) {
    return TEKAE_MODE === 'disabled' ? 'PROVIDER_DISABLED' : 'PROVIDER_UNAVAILABLE';
  }

  return 'PROVIDER_PENDING';
}

export function getProviderReadinessPresentation(
  state: ProviderReadinessState = getProviderReadinessState(),
): ProviderReadinessPresentation {
  switch (state) {
    case 'PROVIDER_PENDING':
      return {
        message: 'Estamos revisando el estado de tu operación. Este flujo final dependerá de la documentación oficial del proveedor.',
        state,
        title: 'Estamos revisando tu operación',
      };
    case 'PROVIDER_TIMEOUT':
      return {
        message: 'Aún no tenemos una confirmación segura. No hagas otro pago por ahora.',
        state,
        title: 'Confirmación pendiente',
      };
    case 'PROVIDER_FAILED':
      return {
        message: 'No pudimos completar la operación. No mostramos errores técnicos ni datos del proveedor.',
        state,
        title: 'Pago no completado',
      };
    case 'PROVIDER_SUCCEEDED':
      return {
        message: 'La operación fue confirmada por los sistemas internos. La fuente final dependerá del contrato oficial del proveedor.',
        state,
        title: 'Operación confirmada',
      };
    case 'PROVIDER_MANUAL_REVIEW':
      return {
        message: 'Necesitamos revisar esta operación antes de mostrar un resultado final.',
        state,
        title: 'En revisión',
      };
    case 'PROVIDER_UNAVAILABLE':
    case 'PROVIDER_DISABLED':
    default:
      return {
        message: PROVIDER_PAYMENT_UNAVAILABLE_MESSAGE,
        state,
        title: 'Servicio de pago en preparación',
      };
  }
}
