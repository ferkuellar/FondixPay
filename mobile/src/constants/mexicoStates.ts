export type MexicoStateCode =
  | 'MX-AGU'
  | 'MX-BCN'
  | 'MX-BCS'
  | 'MX-CAM'
  | 'MX-CHP'
  | 'MX-CHH'
  | 'MX-CMX'
  | 'MX-COA'
  | 'MX-COL'
  | 'MX-DUR'
  | 'MX-GUA'
  | 'MX-GRO'
  | 'MX-HID'
  | 'MX-JAL'
  | 'MX-MEX'
  | 'MX-MIC'
  | 'MX-MOR'
  | 'MX-NAY'
  | 'MX-NLE'
  | 'MX-OAX'
  | 'MX-PUE'
  | 'MX-QUE'
  | 'MX-ROO'
  | 'MX-SLP'
  | 'MX-SIN'
  | 'MX-SON'
  | 'MX-TAB'
  | 'MX-TAM'
  | 'MX-TLA'
  | 'MX-VER'
  | 'MX-YUC'
  | 'MX-ZAC';

export type MexicoStateOption = {
  code: MexicoStateCode;
  name: string;
};

export const MX_ALL_CODE = 'MX-ALL';

export const MEXICO_STATE_OPTIONS: MexicoStateOption[] = [
  { code: 'MX-AGU', name: 'Aguascalientes' },
  { code: 'MX-BCN', name: 'Baja California' },
  { code: 'MX-BCS', name: 'Baja California Sur' },
  { code: 'MX-CAM', name: 'Campeche' },
  { code: 'MX-CHP', name: 'Chiapas' },
  { code: 'MX-CHH', name: 'Chihuahua' },
  { code: 'MX-CMX', name: 'Ciudad de México' },
  { code: 'MX-COA', name: 'Coahuila' },
  { code: 'MX-COL', name: 'Colima' },
  { code: 'MX-DUR', name: 'Durango' },
  { code: 'MX-GUA', name: 'Guanajuato' },
  { code: 'MX-GRO', name: 'Guerrero' },
  { code: 'MX-HID', name: 'Hidalgo' },
  { code: 'MX-JAL', name: 'Jalisco' },
  { code: 'MX-MEX', name: 'Estado de México' },
  { code: 'MX-MIC', name: 'Michoacán' },
  { code: 'MX-MOR', name: 'Morelos' },
  { code: 'MX-NAY', name: 'Nayarit' },
  { code: 'MX-NLE', name: 'Nuevo León' },
  { code: 'MX-OAX', name: 'Oaxaca' },
  { code: 'MX-PUE', name: 'Puebla' },
  { code: 'MX-QUE', name: 'Querétaro' },
  { code: 'MX-ROO', name: 'Quintana Roo' },
  { code: 'MX-SLP', name: 'San Luis Potosí' },
  { code: 'MX-SIN', name: 'Sinaloa' },
  { code: 'MX-SON', name: 'Sonora' },
  { code: 'MX-TAB', name: 'Tabasco' },
  { code: 'MX-TAM', name: 'Tamaulipas' },
  { code: 'MX-TLA', name: 'Tlaxcala' },
  { code: 'MX-VER', name: 'Veracruz' },
  { code: 'MX-YUC', name: 'Yucatán' },
  { code: 'MX-ZAC', name: 'Zacatecas' },
];

export const DEFAULT_MEXICO_STATE_CODE: MexicoStateCode = 'MX-CHH';

export function getMexicoStateOption(code: string | undefined): MexicoStateOption {
  return MEXICO_STATE_OPTIONS.find((state) => state.code === code) ?? MEXICO_STATE_OPTIONS[0];
}
