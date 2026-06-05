import type { LocationGeocodedAddress } from 'expo-location';

import { MEXICO_STATE_OPTIONS, type MexicoStateCode, type MexicoStateOption } from '../constants/mexicoStates';

const STATE_ALIASES: Record<MexicoStateCode, string[]> = {
  'MX-CHH': ['chihuahua'],
  'MX-COA': ['coahuila', 'coahuila de zaragoza'],
  'MX-NLE': ['nuevo leon', 'nuevo león'],
  'MX-CMX': ['ciudad de mexico', 'ciudad de méxico', 'cdmx', 'distrito federal'],
  'MX-JAL': ['jalisco'],
};

export function resolveMexicoStateFromAddress(address: LocationGeocodedAddress | undefined): MexicoStateOption | null {
  const rawRegion = normalizeStateName(address?.region);
  if (!rawRegion) return null;

  const match = MEXICO_STATE_OPTIONS.find((state) => {
    const aliases = STATE_ALIASES[state.code] ?? [];
    return aliases.some((alias) => normalizeStateName(alias) === rawRegion);
  });

  return match ?? null;
}

function normalizeStateName(value: string | null | undefined) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}
