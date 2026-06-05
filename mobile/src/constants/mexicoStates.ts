export type MexicoStateCode = 'MX-CHH' | 'MX-COA' | 'MX-NLE' | 'MX-CMX' | 'MX-JAL';

export type MexicoStateOption = {
  code: MexicoStateCode;
  name: string;
};

export const MX_ALL_CODE = 'MX-ALL';

export const MEXICO_STATE_OPTIONS: MexicoStateOption[] = [
  { code: 'MX-CHH', name: 'Chihuahua' },
  { code: 'MX-COA', name: 'Coahuila' },
  { code: 'MX-NLE', name: 'Nuevo León' },
  { code: 'MX-CMX', name: 'Ciudad de México' },
  { code: 'MX-JAL', name: 'Jalisco' },
];

export const DEFAULT_MEXICO_STATE_CODE: MexicoStateCode = 'MX-CHH';

export function getMexicoStateOption(code: string | undefined): MexicoStateOption {
  return MEXICO_STATE_OPTIONS.find((state) => state.code === code) ?? MEXICO_STATE_OPTIONS[0];
}
