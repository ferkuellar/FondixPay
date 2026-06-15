import type { LocationGeocodedAddress } from 'expo-location';

import { MEXICO_STATE_OPTIONS, type MexicoStateCode, type MexicoStateOption } from '../constants/mexicoStates';

// Aliases are already normalized (lowercase, no diacritics, single spaces).
// They are compared against the output of normalizeStateName(address.region).
const STATE_ALIASES: Record<MexicoStateCode, string[]> = {
  'MX-AGU': ['aguascalientes'],
  'MX-BCN': ['baja california', 'baja california norte'],
  'MX-BCS': ['baja california sur'],
  'MX-CAM': ['campeche'],
  'MX-CHP': ['chiapas'],
  'MX-CHH': ['chihuahua'],
  'MX-CMX': ['ciudad de mexico', 'ciudad de mejico', 'cdmx', 'distrito federal', 'mexico city'],
  'MX-COA': ['coahuila', 'coahuila de zaragoza'],
  'MX-COL': ['colima'],
  'MX-DUR': ['durango'],
  'MX-GUA': ['guanajuato'],
  'MX-GRO': ['guerrero'],
  'MX-HID': ['hidalgo'],
  'MX-JAL': ['jalisco'],
  'MX-MEX': ['estado de mexico', 'estado de mejico', 'edomex', 'edo mex', 'state of mexico'],
  'MX-MIC': ['michoacan', 'michoacan de ocampo'],
  'MX-MOR': ['morelos'],
  'MX-NAY': ['nayarit'],
  'MX-NLE': ['nuevo leon'],
  'MX-OAX': ['oaxaca'],
  'MX-PUE': ['puebla'],
  'MX-QUE': ['queretaro', 'queretaro de arteaga'],
  'MX-ROO': ['quintana roo'],
  'MX-SLP': ['san luis potosi'],
  'MX-SIN': ['sinaloa'],
  'MX-SON': ['sonora'],
  'MX-TAB': ['tabasco'],
  'MX-TAM': ['tamaulipas'],
  'MX-TLA': ['tlaxcala'],
  'MX-VER': ['veracruz', 'veracruz de ignacio de la llave', 'veracruz-llave'],
  'MX-YUC': ['yucatan'],
  'MX-ZAC': ['zacatecas'],
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
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}
